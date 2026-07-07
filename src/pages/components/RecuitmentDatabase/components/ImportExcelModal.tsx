import React, { useEffect, useRef, useState } from 'react';
import { fetchPrincipals, createPrincipal, type Principal } from '../../../../api/principal';
import {
  parseRecruitmentWorkbook,
  runPool,
  type ParsedImport,
  type ParsedRow,
  type ImportSummary,
} from '../utils/excelImport';

interface ImportExcelModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

type Phase = 'idle' | 'parsing' | 'preview' | 'importing' | 'done' | 'error';

const IMPORT_CONCURRENCY = 3;
const MAX_RETRIES = 3;

const isDeadlockMessage = (msg: string) =>
  /deadlock|Lock wait timeout|try restarting transaction/i.test(msg);

async function postApplicant(body: Record<string, unknown>): Promise<void> {
  let attempt = 0;
  let lastErr: Error | null = null;
  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) return;
      let detail = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j?.error) detail = String(j.error);
        if (j?.detail) detail += ` — ${j.detail}`;
      } catch {}
      const err = new Error(detail);
      if (res.status === 500 && isDeadlockMessage(detail) && attempt < MAX_RETRIES) {
        // Deadlocks are transient — back off with jitter and try again.
        await new Promise(r => setTimeout(r, 120 * attempt + Math.random() * 200));
        lastErr = err;
        continue;
      }
      throw err;
    } catch (e: any) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      if (attempt < MAX_RETRIES && isDeadlockMessage(lastErr.message)) {
        await new Promise(r => setTimeout(r, 120 * attempt + Math.random() * 200));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr ?? new Error('Failed to POST /api/applicants');
}

const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ open, onClose, onImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedImport | null>(null);
  const [existingPrincipalNames, setExistingPrincipalNames] = useState<Set<string>>(new Set());
  const [existingApplicantNos, setExistingApplicantNos] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase('idle');
      setFileName('');
      setErrorMsg('');
      setParsed(null);
      setExistingPrincipalNames(new Set());
      setExistingApplicantNos(new Set());
      setProgress({ done: 0, total: 0 });
      setSummary(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [open]);

  if (!open) return null;

  const newPrincipalsToCreate = parsed
    ? parsed.principalHeadersFound.filter(name => !existingPrincipalNames.has(name.toUpperCase()))
    : [];

  const rowsClassified = parsed
    ? parsed.rows.reduce(
        (acc, r) => {
          if (existingApplicantNos.has(r.applicantNo)) acc.updates++;
          else acc.inserts++;
          return acc;
        },
        { inserts: 0, updates: 0 }
      )
    : { inserts: 0, updates: 0 };

  const handleFile = async (file: File) => {
    setPhase('parsing');
    setErrorMsg('');
    setFileName(file.name);
    try {
      const parsedFile = await parseRecruitmentWorkbook(file);

      const [principals, applicantsRes] = await Promise.all([
        fetchPrincipals(),
        fetch('/api/applicants').then(r => (r.ok ? r.json() : [])),
      ]);

      const principalSet = new Set<string>(principals.map((p: Principal) => p.name.toUpperCase()));
      const applicantSet = new Set<string>(
        Array.isArray(applicantsRes)
          ? applicantsRes.map((a: any) => String(a.applicant_no || '')).filter(Boolean)
          : []
      );

      setParsed(parsedFile);
      setExistingPrincipalNames(principalSet);
      setExistingApplicantNos(applicantSet);
      setPhase('preview');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to read the Excel file.');
      setPhase('error');
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmImport = async () => {
    if (!parsed) return;
    setPhase('importing');
    setProgress({ done: 0, total: parsed.rows.length });

    const nameToId = new Map<string, number>();
    try {
      const principals = await fetchPrincipals();
      for (const p of principals) nameToId.set(p.name.toUpperCase(), p.id);

      for (const name of newPrincipalsToCreate) {
        if (nameToId.has(name)) continue;
        try {
          const created = await createPrincipal(name);
          nameToId.set(created.name.toUpperCase(), created.id);
        } catch {
          const refreshed = await fetchPrincipals();
          for (const p of refreshed) nameToId.set(p.name.toUpperCase(), p.id);
        }
      }
    } catch (e: any) {
      setErrorMsg(`Failed to prepare principals: ${e?.message || 'unknown error'}`);
      setPhase('error');
      return;
    }

    const errors: Array<{ applicantNo: string; message: string }> = [];
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    let doneCount = 0;

    const wasExisting = existingApplicantNos;

    await runPool(parsed.rows, IMPORT_CONCURRENCY, async (row: ParsedRow) => {
      const principalIds = row.principalNames
        .map(n => nameToId.get(n.toUpperCase()))
        .filter((id): id is number => typeof id === 'number');

      // Only include PRINCIPAL_IDS when non-empty: the controller runs a
      // DELETE+INSERT transaction on setApplicantPrincipals whenever the key
      // is present (even as []), and concurrent transactions on the shared
      // junction indexes deadlock. Omitting the key skips that path entirely
      // for rows with no principals (the majority).
      const body: Record<string, unknown> = { ...row.payload };
      if (principalIds.length > 0) body.PRINCIPAL_IDS = principalIds;

      try {
        await postApplicant(body);
        if (wasExisting.has(row.applicantNo)) updated++;
        else inserted++;
      } catch (err: any) {
        failed++;
        if (errors.length < 20) {
          errors.push({ applicantNo: row.applicantNo, message: err?.message || 'Unknown error' });
        }
      } finally {
        doneCount++;
        setProgress({ done: doneCount, total: parsed.rows.length });
      }
    });

    setSummary({ attempted: parsed.rows.length, inserted, updated, failed, errors });
    setPhase('done');
  };

  const handleCloseAndRefresh = () => {
    onImported();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0d1219] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-info/15 border border-info/25 flex items-center justify-center text-info">
              <i className="fas fa-file-import" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Recruitment Database</h2>
              <p className="text-xs text-text-secondary/80">
                Upload an .xlsx to bulk-upsert applicants. Excel data takes precedence on duplicates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={phase === 'importing'}
            className="text-text-secondary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Close"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {phase === 'idle' && (
            <div className="text-center py-8">
              <button
                onClick={handlePickFile}
                className="inline-flex items-center gap-2 px-5 py-3 bg-info/15 hover:bg-info/25 text-info border border-info/25 rounded-xl transition-all text-sm font-bold active:scale-95"
              >
                <i className="fas fa-cloud-upload-alt" />
                Choose Excel file
              </button>
              <p className="text-xs text-text-secondary/80 mt-3">
                Expects the sheet named <code className="px-1.5 py-0.5 rounded bg-white/5">database</code>{' '}
                with headers on row 4.
              </p>
            </div>
          )}

          {phase === 'parsing' && (
            <div className="flex items-center gap-3 py-6 justify-center text-text-secondary">
              <div className="w-6 h-6 rounded-full border-2 border-info/30 border-t-info animate-spin" />
              <span>Reading <span className="text-white font-medium">{fileName}</span>…</span>
            </div>
          )}

          {phase === 'error' && (
            <div className="bg-danger/10 border border-danger/25 text-danger rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold mb-1">
                <i className="fas fa-exclamation-circle" />
                Import failed
              </div>
              <p className="text-sm break-words">{errorMsg}</p>
              <button
                onClick={() => {
                  setPhase('idle');
                  setErrorMsg('');
                }}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-white/10"
              >
                Try again
              </button>
            </div>
          )}

          {phase === 'preview' && parsed && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-text-secondary/80">Source</span>
                  <span className="text-sm text-white font-medium">{fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-text-secondary/80">Sheet</span>
                  <span className="text-sm text-white font-medium">{parsed.sheetName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-text-secondary/80">Rows read</span>
                  <span className="text-sm text-white font-medium">{parsed.totalRowsScanned}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-success/20 bg-success/10 p-4">
                  <div className="text-xs uppercase tracking-wider text-success/80">New applicants</div>
                  <div className="text-2xl font-bold text-success mt-1">{rowsClassified.inserts}</div>
                </div>
                <div className="rounded-xl border border-warning/20 bg-warning/10 p-4">
                  <div className="text-xs uppercase tracking-wider text-warning/80">Will overwrite</div>
                  <div className="text-2xl font-bold text-warning mt-1">{rowsClassified.updates}</div>
                </div>
              </div>

              {newPrincipalsToCreate.length > 0 && (
                <div className="rounded-xl border border-info/20 bg-info/10 p-4">
                  <div className="text-xs uppercase tracking-wider text-info/80 mb-2">
                    New principals to auto-create ({newPrincipalsToCreate.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newPrincipalsToCreate.map(name => (
                      <span
                        key={name}
                        className="text-xs px-2 py-1 rounded-md bg-info/15 border border-info/25 text-info"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(parsed.duplicateNumbersInFile.length > 0 ||
                parsed.skippedBlankNoCount > 0 ||
                parsed.unknownHeaders.length > 0) && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2 text-sm text-text-secondary/90">
                  {parsed.skippedBlankNoCount > 0 && (
                    <div className="flex items-start gap-2">
                      <i className="fas fa-info-circle text-text-secondary/70 mt-0.5" />
                      <span>{parsed.skippedBlankNoCount} row(s) skipped (blank <code className="px-1 py-0.5 rounded bg-white/5">NO.</code>).</span>
                    </div>
                  )}
                  {parsed.duplicateNumbersInFile.length > 0 && (
                    <div className="flex items-start gap-2">
                      <i className="fas fa-triangle-exclamation text-warning/80 mt-0.5" />
                      <span>
                        {parsed.duplicateNumbersInFile.length} duplicate NO. within the file (last write wins):{' '}
                        <span className="text-white/80">
                          {parsed.duplicateNumbersInFile.slice(0, 8).join(', ')}
                          {parsed.duplicateNumbersInFile.length > 8 ? '…' : ''}
                        </span>
                      </span>
                    </div>
                  )}
                  {parsed.unknownHeaders.length > 0 && (
                    <div className="flex items-start gap-2">
                      <i className="fas fa-question-circle text-text-secondary/70 mt-0.5" />
                      <span>
                        Ignored unrecognized headers:{' '}
                        <span className="text-white/80">
                          {parsed.unknownHeaders.slice(0, 6).join(', ')}
                          {parsed.unknownHeaders.length > 6 ? '…' : ''}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={parsed.rows.length === 0}
                  className="px-4 py-2 rounded-xl bg-info/20 hover:bg-info/30 text-info border border-info/30 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {parsed.rows.length} row{parsed.rows.length === 1 ? '' : 's'}
                </button>
              </div>
            </div>
          )}

          {phase === 'importing' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary/90">
                    Uploading… <span className="text-white font-semibold">{progress.done}</span> of{' '}
                    <span className="text-white font-semibold">{progress.total}</span>
                  </span>
                  <span className="text-white/80 font-mono">
                    {progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-info transition-[width] duration-300"
                    style={{
                      width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-text-secondary/70 text-center">
                Please keep this window open until the import finishes.
              </p>
            </div>
          )}

          {phase === 'done' && summary && (
            <div className="space-y-4">
              <div className="rounded-xl border border-success/20 bg-success/10 p-4 flex items-center gap-3">
                <i className="fas fa-circle-check text-success text-xl" />
                <div>
                  <div className="font-bold text-white">Import complete</div>
                  <div className="text-xs text-text-secondary/90">
                    {summary.attempted} row{summary.attempted === 1 ? '' : 's'} processed.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-success/20 bg-success/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-success/80">Inserted</div>
                  <div className="text-2xl font-bold text-success mt-1">{summary.inserted}</div>
                </div>
                <div className="rounded-xl border border-warning/20 bg-warning/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-warning/80">Updated</div>
                  <div className="text-2xl font-bold text-warning mt-1">{summary.updated}</div>
                </div>
                <div className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-danger/80">Failed</div>
                  <div className="text-2xl font-bold text-danger mt-1">{summary.failed}</div>
                </div>
              </div>

              {summary.errors.length > 0 && (
                <div className="rounded-xl border border-danger/20 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-wider text-danger/80 mb-2">
                    Errors ({summary.errors.length}{summary.failed > summary.errors.length ? '+' : ''})
                  </div>
                  <ul className="text-xs text-white/85 space-y-1 max-h-40 overflow-y-auto">
                    {summary.errors.map((e, i) => (
                      <li key={i} className="font-mono">
                        <span className="text-danger">NO. {e.applicantNo}:</span> {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCloseAndRefresh}
                  className="px-4 py-2 rounded-xl bg-info/20 hover:bg-info/30 text-info border border-info/30 text-sm font-bold"
                >
                  Close &amp; refresh
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
};

export default ImportExcelModal;
