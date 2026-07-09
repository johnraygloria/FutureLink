# FutureLink — Improvement Backlog

> Known issues and room for improvement, prioritized. This is a **living TODO** — update it as items are fixed or found.
> Companion docs: [ARCHITECTURE.md](ARCHITECTURE.md) · [DATABASE.md](DATABASE.md) · [CONVENTIONS.md](CONVENTIONS.md)

_Compiled from a code + live-DB review on 2026-07-07. Line numbers are approximate — verify before editing._

Legend: 🔴 critical · 🟠 high · 🟡 medium · 🟢 low / polish

---

## ⚡ Performance follow-ups (from the 2026-07-09 data-loading overhaul)

The big wins shipped: `GET /api/applicants` went 52.5 s → ~0.1 s (killed the principal N+1 + memoized the per-query `ensure*` schema checks), a `POST /api/applicants/bulk` endpoint made the Excel import ~500× faster, and `GET /api/applicants/numbers` + a SQL-level `?NO=` filter removed two more full-table pulls. Remaining items:

1. **All six list tables are virtualized** via the shared `src/components/Tables/useVirtualRows.ts` hook: Recruitment Database, Screening, Assessment, Selection, Engagement, and the ER Masterlist. High-volume ones (Recruitment 6.8k, Screening ~1.6k) get the real benefit; the rest are future-proofed with the same pattern.
2. **Browser QA still pending on the virtualized tables.** They compile and Vite serves them, but sticky-header alignment, scroll smoothness, and row-height measurement were not visually verified (no browser access during implementation). Load each module and confirm the header stays put and scrolling is smooth before relying on them. Note the four module tables (Screening/Assessment/Selection/Engagement) cap their own scroll at `max-h-[78vh]`; Recruitment Database and Masterlist use their existing bounded containers.
3. **True server-side pagination + server-side search** — deferred by choice. Client still fetches the full list and filters/searches in memory. Fine to ~50k rows; revisit beyond that. Would add `?limit&offset&search` to `GET /api/applicants` returning `{rows,total}` + a shared paginator.
4. **`UNIQUE(applicant_no)` is still blocked** — the source Excel has real duplicates (`6040`/`6041` are different people). The bulk endpoint avoids the insert race by processing rows sequentially, but the underlying data needs business renumbering before a unique constraint is safe.
5. **History endpoints are unbounded** (`SELECT * ORDER BY created_at`). `assessment_history` is ~3.6k rows; the dashboard/assessment refetch is now debounced (`src/lib/useDebouncedCallback.ts`) but the query itself should get `LIMIT` + pagination eventually.
6. **`status_remarks` / `applicant_remarks` widened to VARCHAR(500)** in the live DB and in the `ensureTables` DDL (one import row was 267 chars). If other free-text columns receive long Excel values, widen similarly.

---

## 🔴 Security (do these before any real/PII data)

The auth layer is **built but not wired in**. Right now the API is effectively public.

1. **Password backdoor — remove it.** `server/routes/auth.js` (~lines 83–120): if `password === '1'`, the server **overwrites any account's hash with `'1'` and logs in** — a master key for every department including Admin. Also the auto-create path seeds new department users with password `'1'` (~line 65). Delete both; require real credentials.
2. **Nothing is authenticated.** `middleware/auth.js` defines `authRequired` / `requireRoles`, but **no route uses them** and the frontend never sends an `Authorization` header. Apply `authRequired` to all `/api/applicants`, `/api/principals`, `/api/masterlist` routes, and make the frontend attach `Authorization: Bearer <token>` on every request (a small `apiFetch` wrapper, or a one-time `window.fetch` interceptor, covers all existing relative calls at once).
3. **Enforce roles server-side.** Section access is gated only in `App.tsx` (client-side) and the token's `role` is recomputed from the department string (`auth.js` ~line 145) instead of trusted from the DB. Add `requireRoles(...)` to stage-specific mutations and trust the persisted `users.role`.
4. **Stop logging plaintext passwords.** `auth.js` `console.log`s the provided password (~lines 40, 78, 132). Remove.
5. **Lock down CORS.** `server/index.js` uses `app.use(cors())` (any origin). Restrict to the known client origin.
6. **Credential hygiene.** Passwords follow the guessable `{Department}FutureLink` pattern with no rate limiting or lockout. Add throttling; consider per-user (not per-department) accounts.

> Fixes #1–#5 are ~half a day because the pieces (JWT middleware, bcrypt, roles enum) already exist and just need connecting. Re-verify login + one mutation per module afterward.

---

## 🟠 Correctness & data integrity

7. **Optimistic updates never roll back.** Hooks (`useApplicants.ts` `handleAddApplicant`, `handleStatusChangeAndSync`, and siblings) update state then `fetch` with no `!res.ok`/`.catch`. A failed save shows success and silently desyncs from the DB. Add error handling + revert. See [CONVENTIONS.md](CONVENTIONS.md) §5.
8. **Fake optimistic ids.** `handleAddApplicant` inserts `id: Date.now()`, which never matches the real row id — breaks later `id`-based updates until reload. Use the server-returned id or refetch.
9. **`applicant_no` is a fragile business key.** Free-text, **not unique**, generated as `MAX(numeric)+1` in app code (`applicant.js` ~line 300) — race-prone and collision-prone. Make it unique (or use a proper sequence) and back history joins with it.
10. **No foreign keys anywhere.** `applicant_principals`, `masterlist_employees.applicant_no`, and all `*_history.applicant_no` relate by convention only. Add FKs (or documented invariants + cleanup jobs).
11. **`IFNULL` upsert can't clear fields.** `upsertRecruitmentApplicant` uses `col = IFNULL(?, col)`, so a blanked value is ignored — you can set but not unset. Provide an explicit-clear path where the UI needs it.

---

## 🟡 Maintainability

12. **Schema lives in 3 disagreeing places.** Model `ensureTables()` DDL, `company_ftl.sql`, and the live DB. The dump is **stale** (no `principals`/`masterlist_employees`; has legacy `clients`). Pick one source of truth: introduce a migrations tool (or at minimum re-dump `company_ftl.sql` and stop hand-editing schema). See [DATABASE.md](DATABASE.md).
13. **`ensureTables()` on the hot path.** Every read/write runs `CREATE TABLE IF NOT EXISTS` (×5) first, plus masterlist `ALTER` probes. Move provisioning to startup/migration, call it once.
14. **Field mapping duplicated ~6×.** The snake ↔ camel ↔ UPPER mapping is copy-pasted across hooks, `ApplicantSidebar`, and controllers. Extract one shared `toPayload()` / `fromRow()` pair (front + back). Biggest maintainability win. See [CONVENTIONS.md](CONVENTIONS.md) §2.
15. **God components.** `ApplicantSidebar.tsx` (~950 lines) and `assessmentStatus.tsx` (~650 lines) mix fetching, editing, saving, history, and rendering. Split into presentational + hook layers.
16. **~100 `any` / `as any` casts** in a strict-TS project (incl. `activeSection as any` in `App.tsx`). Type the real shapes; stop widening.
17. **Legacy `client` shim layer.** `routes/clients.js`, `clientsController.js`, `models/client.js`, `models/applicantClient.js`, `src/api/client.ts`, and the `datian…enjoy` columns are superseded by principals. Migrate remaining callers, then delete. See [ARCHITECTURE.md](ARCHITECTURE.md) §7.
18. **Event-bus coupling.** ~17 `window` CustomEvent dispatch/listen pairs substitute for a store. Fine at this size; if module count grows, consider a light shared store (Zustand/Context) to make data flow traceable.
19. **Dead / band-aid code.** `saveToRecruitment` still writes legacy `datian…enjoy`; `createApplicant` is an unused stub; `getAssessmentHistory` reverse-engineers assessment events out of *screening* history when its table is empty — a symptom of the model drift, not a feature.

---

## 🟢 Process & polish

20. **No tests.** Zero automated coverage. Start with API tests for `auth` (post-fix) and the applicant upsert, then the status guards.
21. **Commit hygiene.** History is a wall of "new changes" / "CHANGES". Adopt short conventional messages; it makes `git log`/bisect usable.
22. **Config drift risk.** Port 5001 vs 5000 (AirPlay) is a recurring setup trap — documented in [DEVELOPMENT.md](DEVELOPMENT.md); keep `vite.config.ts` and `server/.env` in sync.
23. **Error surfaces.** Several catches `console.error` and swallow; a couple use `alert(...)`. Add a consistent toast/notification layer for user-facing errors.

---

## Suggested order

1. Security #1–#5 (half day, high impact).
2. Correctness #7–#8 (silent data loss).
3. Schema source-of-truth #12 + re-dump (unblocks safe onboarding).
4. Field-mapping consolidation #14 (kills the worst duplication).
5. Then integrity (#9–#11), god-component splits (#15), and legacy cleanup (#17).
