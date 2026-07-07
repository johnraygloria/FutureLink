import * as XLSX from 'xlsx';

export const DATABASE_SHEET_NAME = 'database';
export const HEADER_ROW_INDEX = 3;

const NUMBER_HEADER = 'NO.';

const FIELD_HEADERS: Array<{ excel: string; payload: string }> = [
  { excel: 'NO.', payload: 'NO' },
  { excel: 'REFFERED BY', payload: 'REFFERED_BY' },
  { excel: 'LAST NAME', payload: 'LAST_NAME' },
  { excel: 'FIRST NAME', payload: 'FIRST_NAME' },
  { excel: 'EXT', payload: 'EXT' },
  { excel: 'MIDDLE', payload: 'MIDDLE' },
  { excel: 'GENDER', payload: 'GENDER' },
  { excel: 'SIZE', payload: 'SIZE' },
  { excel: 'DATE OF BIRTH', payload: 'DATE_OF_BIRTH' },
  { excel: 'DATE APPLIED', payload: 'DATE_APPLIED' },
  { excel: 'FB NAME', payload: 'FB_NAME' },
  { excel: 'AGE', payload: 'AGE' },
  { excel: 'LOCATION', payload: 'LOCATION' },
  { excel: 'CONTACT NUMBER', payload: 'CONTACT_NUMBER' },
  { excel: 'POSITION APPLIED FOR', payload: 'POSITION_APPLIED_FOR' },
  { excel: 'EXPERIENCE', payload: 'EXPERIENCE' },
  { excel: 'RECRUITMENT STATUS', payload: 'STATUS' },
  { excel: 'REQUIREMENTS STATUS', payload: 'REQUIREMENTS_STATUS' },
  { excel: 'FINAL INTERVIEW STATUS', payload: 'FINAL_INTERVIEW_STATUS' },
  { excel: 'MEDICAL REMARKS', payload: 'MEDICAL_STATUS' },
  { excel: 'STATUS REMARKS', payload: 'STATUS_REMARKS' },
  { excel: 'APPLICANT REMARKS', payload: 'APPLICANT_REMARKS' },
];

const PRINCIPAL_HEADERS = [
  'JINBOWAY',
  'COMFIER',
  'SURPRISE',
  'ENJOY',
  'AKATSUKI',
  'RE-CORE',
  'WINVIEW',
  'HK RECYPOINT',
  'JACK',
];

const FIELD_HEADER_SET = new Set(FIELD_HEADERS.map(f => f.excel));
const PRINCIPAL_HEADER_SET = new Set(PRINCIPAL_HEADERS);

export interface ParsedRow {
  rowIndex: number;
  applicantNo: string;
  payload: Record<string, string>;
  principalNames: string[];
}

export interface ParsedImport {
  sheetName: string;
  totalRowsScanned: number;
  rows: ParsedRow[];
  skippedBlankNoCount: number;
  duplicateNumbersInFile: string[];
  unknownHeaders: string[];
  principalHeadersFound: string[];
}

export interface ImportSummary {
  attempted: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{ applicantNo: string; message: string }>;
}

function normalizeHeader(raw: unknown): string {
  return String(raw ?? '').trim().toUpperCase().replace(/\s+/g, ' ');
}

function cellToString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
}

export async function parseRecruitmentWorkbook(file: File): Promise<ParsedImport> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });

  const sheetName = wb.SheetNames.find(n => n.toLowerCase() === DATABASE_SHEET_NAME.toLowerCase());
  if (!sheetName) {
    throw new Error(
      `Sheet "${DATABASE_SHEET_NAME}" not found. Sheets in file: ${wb.SheetNames.join(', ') || '(none)'}`
    );
  }

  const ws = wb.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false,
  });

  if (grid.length <= HEADER_ROW_INDEX) {
    throw new Error(
      `Sheet "${sheetName}" has fewer rows than expected (need header on row ${HEADER_ROW_INDEX + 1}).`
    );
  }

  const headerRow = grid[HEADER_ROW_INDEX] as unknown[];
  const colIndexByHeader = new Map<string, number>();
  const unknownHeaders: string[] = [];
  const principalHeadersFound: string[] = [];

  headerRow.forEach((raw, i) => {
    const norm = normalizeHeader(raw);
    if (!norm) return;
    if (FIELD_HEADER_SET.has(norm)) {
      colIndexByHeader.set(norm, i);
    } else if (PRINCIPAL_HEADER_SET.has(norm)) {
      colIndexByHeader.set(norm, i);
      principalHeadersFound.push(norm);
    } else {
      unknownHeaders.push(String(raw));
    }
  });

  const noColIdx = colIndexByHeader.get(NUMBER_HEADER);
  if (noColIdx === undefined) {
    throw new Error(`Required header "${NUMBER_HEADER}" not found on row ${HEADER_ROW_INDEX + 1}.`);
  }

  const rows: ParsedRow[] = [];
  const seenNumbers = new Set<string>();
  const duplicateNumbersInFile: string[] = [];
  let skippedBlankNoCount = 0;
  let totalRowsScanned = 0;
  let consecutiveBlank = 0;

  for (let i = HEADER_ROW_INDEX + 1; i < grid.length; i++) {
    const row = grid[i] as unknown[];
    const applicantNo = cellToString(row[noColIdx]);

    if (!applicantNo) {
      // Trailing empty rows: bail once we've seen a run of blanks.
      consecutiveBlank++;
      if (consecutiveBlank >= 25) break;
      // Otherwise the row is skipped (may be a mid-file gap).
      skippedBlankNoCount++;
      continue;
    }
    consecutiveBlank = 0;
    totalRowsScanned++;

    if (seenNumbers.has(applicantNo)) {
      duplicateNumbersInFile.push(applicantNo);
    } else {
      seenNumbers.add(applicantNo);
    }

    const payload: Record<string, string> = {};
    for (const { excel, payload: key } of FIELD_HEADERS) {
      const idx = colIndexByHeader.get(excel);
      if (idx === undefined) continue;
      const val = cellToString(row[idx]);
      if (val !== '') payload[key] = val;
    }
    // NO must always be present in the payload (upsert key) even if we ended
    // up filtering blanks above — reassert it explicitly.
    payload['NO'] = applicantNo;

    const principalNames: string[] = [];
    for (const p of PRINCIPAL_HEADERS) {
      const idx = colIndexByHeader.get(p);
      if (idx === undefined) continue;
      const val = cellToString(row[idx]);
      if (val !== '') principalNames.push(p);
    }

    rows.push({ rowIndex: i, applicantNo, payload, principalNames });
  }

  return {
    sheetName,
    totalRowsScanned,
    rows,
    skippedBlankNoCount,
    duplicateNumbersInFile,
    unknownHeaders,
    principalHeadersFound,
  };
}

export async function runPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const size = Math.max(1, Math.min(limit, items.length || 1));
  const runners = Array.from({ length: size }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}
