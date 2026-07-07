# FutureLink — AI Development Guide

Internal Applicant Tracking System (ATS) for a Philippine staffing agency. React 19 + TypeScript + Vite frontend, Express + MySQL backend. **This is an ongoing project — extend the existing patterns, don't rebuild.**

> This file is intentionally lean. Detailed context lives in [`docs/`](docs/) — read the relevant doc before working in an area.

## 📚 Documentation map

| Doc | Read it when |
|-----|--------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understanding the system: layers, modules, data flow, the Clients→Principals migration. |
| [docs/DATABASE.md](docs/DATABASE.md) | Touching data/schema. **The live DB is the source of truth — the SQL dump is stale.** |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Writing code. Naming, the 3-name field mapping, status guards, hooks, event bus. |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Running it locally, ports, credentials, commands. |
| [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) | Prioritized known issues + tech debt. Add to it when you find something out of scope. |

## Run it (macOS)

```bash
cd server && npm run dev   # backend → http://localhost:5001
npm run dev                # frontend → http://localhost:5173
```

Open http://localhost:5173. Full setup, credentials, and DB one-liners in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Must-know gotchas (details in the docs)

- **Backend is on port 5001, not 5000** — macOS AirPlay owns 5000. `vite.config.ts` proxy and `server/.env` must agree. → [DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **All frontend fetches are relative `/api/...`** and rely on the Vite proxy. No API-base-URL in the request path. → [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **`company_ftl.sql` is out of date.** Don't rebuild the DB from it (missing `principals`, `masterlist_employees`). The model layer self-provisions the schema. → [DATABASE.md](docs/DATABASE.md)
- **Every field has 3 names** — `first_name` (DB) ↔ `firstName` (UI) ↔ `FIRST_NAME` (write payload) — mapped by hand in ~6 places. → [CONVENTIONS.md](docs/CONVENTIONS.md)
- **Use `principal`, not `client`.** The `client*` files/routes are deprecated compat shims. → [ARCHITECTURE.md](docs/ARCHITECTURE.md) §7
- **⚠ Auth is currently not enforced** and there's a password backdoor. Do not treat this as production-ready. → [IMPROVEMENTS.md](docs/IMPROVEMENTS.md) §Security

## Working norms for this project

- **Match the nearest module.** Screening / Assessment / Selection / Engagement are deliberately near-identical — copy the closest one when adding a stage or feature.
- **Don't hardcode statuses.** Use the `ALLOWED_*_STATUSES` sets and `isXxxStatus` guards.
- **Parameterize all SQL**; whitelist column names for any dynamic `SET`.
- **Found a problem outside your task?** Add it to [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) instead of expanding scope.
- **No tests or CI yet** — manually verify the affected module in the browser, and run `npm run lint` / `npm run build`, before pushing.
- **Keep this file lean.** New durable context goes in the appropriate `docs/` file (or a new one), linked from the table above — not inline here.
