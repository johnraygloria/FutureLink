# FutureLink — Code Conventions & Patterns

> The recurring patterns to follow so new code matches the existing code.
> Companion docs: [ARCHITECTURE.md](ARCHITECTURE.md) · [IMPROVEMENTS.md](IMPROVEMENTS.md)

When extending FutureLink, **copy the nearest existing module** rather than inventing a new shape. The four pipeline modules (Screening / Assessment / Selection / Engagement) are deliberately near-identical.

---

## 1. Naming

| Kind | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ApplicantsTable.tsx`, `PersonalDetailsForm.tsx` |
| Page shells | lowercase / kebab | `screening.tsx`, `recruitment-database.tsx` |
| Hooks | `useXxx` | `useApplicants.ts`, `useAssessmentApplicants.ts` |
| Utils | `xxxUtils.ts` | `screeningUtils.ts` |
| Types | in `src/api/` | `applicant.ts`, `assessmentStatus.ts` |
| DB columns | snake_case | `first_name`, `applicant_no` |
| API payload keys (write) | UPPER_CASE | `FIRST_NAME`, `NO`, `STATUS` |
| Frontend fields | camelCase | `firstName`, `positionApplied` |

---

## 2. The three field-name worlds (and how they map)

This is the single biggest source of bugs. The same field has **three** names:

```
DB row          frontend User        write payload
first_name  ◄──►  firstName    ──►     FIRST_NAME
applicant_no ◄─►  no           ──►     NO
```

- **Read** (`GET /api/applicants` → UI): a per-module row mapper in `utils/*Utils.ts` turns snake_case rows into camelCase `User`.
- **Write** (UI → `POST /api/applicants`): hooks build an UPPER_CASE payload; the controller accepts UPPER_CASE **or** snake_case (`body.FIRST_NAME || body.first_name`).

> ⚠ This mapping is hand-written and duplicated in ~6 places (each hook, `ApplicantSidebar`, and the controllers). Adding a field means editing all of them. Consolidating this is a tracked improvement — until then, **grep for an existing field (e.g. `positionApplied` / `POSITION_APPLIED_FOR` / `position_applied_for`) and add yours everywhere it appears.**

Boolean document flags: DB stores `tinyint(1)`; convert with `toBit(v)` / `toBitOrUndefined(v)` on write. `toBitOrUndefined` returns `undefined` for absent fields so the backend's `IFNULL` merge preserves existing values.

---

## 3. Status-driven modules

Each module defines its allowed statuses and a guard in `utils/*Utils.ts`:

```ts
export const ALLOWED_SCREENING_STATUSES = new Set([...]);
export const isScreeningStatus = (s?: string) => ALLOWED_SCREENING_STATUSES.has(s || '');
```

- The canonical `ApplicationStatus` union + shared sets live in `src/api/assessmentStatus.ts`.
- **Never hardcode status strings** in components — import the constant/guard.
- A module's list is always `allApplicants.filter(isXxxStatus)`.

---

## 4. Custom hook shape

`useXxxApplicants()` owns a module's data + interactions and returns them to the page:

```ts
export function useXxxApplicants() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  // fetch('/api/applicants') → map rows → filter by status → setUsers
  // handleStatusChangeAndSync(): optimistic setUsers, POST applicant, POST history, dispatch event
  const filteredUsers = useMemo(() => /* filters + search */, [users, /*...*/, search]);
  return { users, setUsers, selectedUser, search, setSearch, filteredUsers, /* handlers */ };
}
```

---

## 5. Optimistic updates

Update local state first, then sync to the server:

```ts
setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
await fetch('/api/applicants', { method: 'POST', /* payload */ });
```

> ⚠ Current code does **not** roll back or check `res.ok`. When writing new mutations, **do better**: check `!res.ok`, and revert the optimistic change on failure. (Tracked in [IMPROVEMENTS.md](IMPROVEMENTS.md).)

Also avoid `id: Date.now()` for optimistic inserts (used in `handleAddApplicant`) — it never matches the real DB id. Prefer refetching or using the id the server returns.

---

## 6. Cross-module sync via the event bus

Modules communicate through `window` CustomEvents, not a shared store:

```ts
// after a successful update
window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no, status, id } }));

// in another module
useEffect(() => {
  const h = (e: any) => setUsers(prev => prev.map(u => u.no === e.detail.no ? { ...u, status: e.detail.status } : u));
  window.addEventListener('applicant-updated', h);
  return () => window.removeEventListener('applicant-updated', h);  // always clean up
}, []);
```

Rules: dispatch **after** local state settles; **always** remove the listener in the effect cleanup; put everything a listener needs in `detail`.

---

## 7. localStorage

Used for auth (`token`, `user`), last section (`lastSection`), and per-module filter state (e.g. `screeningFilters`). Always wrap reads/writes in `try/catch` (existing code does). Auth = presence of `token` + `user`.

---

## 8. Backend endpoint pattern

Route stays thin; controller does the work; model does SQL:

```js
// routes/*.js
router.post('/thing', controller.addThing);

// controllers/*.js
exports.addThing = async (req, res) => {
  try {
    const { applicant_no } = req.body || {};
    if (!applicant_no) return res.status(400).json({ error: 'applicant_no is required' });
    await model.addThing(req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error('addThing error:', e);
    res.status(500).json({ error: 'Failed to add thing' });
  }
};
```

- **Always parameterize** SQL (`?` placeholders). Never string-concat user input.
- If you build a dynamic `SET`/column list, **whitelist** column names (see `patchApplicant`) — never pass raw request keys as identifiers.
- Return `{ ok: true }` on success, `{ error: '...' }` with a proper status on failure.

---

## 9. Use `principal`, not `client`

The `client`/`clients` files, routes, and the `datian`…`enjoy` columns are legacy. New code uses `principals` / `applicant_principals` / `/api/principals` / `src/api/principal.ts`. See [ARCHITECTURE.md](ARCHITECTURE.md) §7.

---

## 10. TypeScript

Strict mode is on. It's currently undermined by ~100 `any`/`as any` casts — **don't add more**. Prefer the existing interfaces in `src/api/`; if a type is genuinely unknown, use `unknown` and narrow. New shared shapes go in `src/api/`.
