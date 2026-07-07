# FutureLink — Development & Local Run

> How to get the stack running on macOS and the gotchas that bite first.
> Companion docs: [ARCHITECTURE.md](ARCHITECTURE.md) · [DATABASE.md](DATABASE.md) · [CONVENTIONS.md](CONVENTIONS.md)

---

## Prerequisites

- Node ≥ 18 (verified on v22), npm
- MySQL running locally with database `company_ftl` present and populated
- Dependencies installed in **both** roots: `npm install` and `cd server && npm install`

---

## ⚠ Gotcha #1 — the backend runs on port 5001, not 5000

macOS **Control Center / AirPlay Receiver** listens on port 5000. So:
- `server/.env` sets `PORT=5001`.
- `vite.config.ts` proxies `/api → http://localhost:5001`.

If API calls 404/hang, first check that these two agree. To reclaim 5000 instead, disable *System Settings → General → AirDrop & Handoff → AirPlay Receiver* and set both back to 5000 — but 5001 is the path of least resistance.

## ⚠ Gotcha #2 — the frontend uses relative `/api` paths

All `fetch()` calls are relative (`/api/...`) and depend on the Vite dev proxy. There is **no** API base URL in the request path. In production, serve the API under the same origin at `/api` (reverse proxy).

## ⚠ Gotcha #3 — `company_ftl.sql` is stale

Do not rebuild the DB from the committed dump — it predates `principals` and `masterlist_employees`. The model layer self-provisions the live schema at runtime. See [DATABASE.md](DATABASE.md).

---

## Run it (two terminals)

```bash
# Terminal 1 — backend (nodemon, port 5001)
cd server
npm run dev

# Terminal 2 — frontend (Vite, port 5173)
npm run dev
```

Open **http://localhost:5173**.

### Verify the whole chain
```bash
# backend up?
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5001/api/applicants     # 200
# proxy → backend up?
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/api/applicants     # 200
```

---

## Environment files

`server/.env` (backend):
```env
PORT=5001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=company_ftl
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
NODE_ENV=development
```
Root `.env` is optional today (frontend fetches are relative). `.env` files and `service-account-key.json` are gitignored — keep secrets out of commits.

---

## Login credentials (seeded)

One account per department; password pattern `{Department}FutureLink`:

| Department | Password |
|-----------|----------|
| Admin | `MaribelAbataFutureLinkAdmin` |
| Screening | `ScreeningFutureLink` |
| Assessment | `AssessmentFutureLink` |
| Selection | `SelectionFutureLink` |
| Engagement | `EngagementFutureLink` |
| Employee Relations | `Employee RelationsFutureLink` |

> The login flow currently also accepts/repairs accounts via a `password === '1'` path — a security bug, not a feature. See [IMPROVEMENTS.md](IMPROVEMENTS.md); do not rely on it.

---

## Commands

```bash
# Frontend (root)
npm run dev       # Vite dev server (5173)
npm run build     # tsc -b && vite build
npm run preview   # preview production build
npm run lint      # ESLint

# Backend (server/)
npm run dev       # nodemon index.js (5001)
npm start         # node index.js
```

---

## Useful DB one-liners

```bash
mysql -u root company_ftl -e "SHOW TABLES;"
mysql -u root company_ftl -e "SELECT id,hr_department,role FROM users;"
mysql -u root company_ftl -e "SELECT applicant_no,first_name,last_name,status FROM recruitment_applicants;"
```

---

## Git workflow

Branch off `main`, keep changes scoped, write real commit messages (history is currently a wall of "new changes" — see [IMPROVEMENTS.md](IMPROVEMENTS.md)). Never commit `.env` or service-account keys. There is no CI and no test suite yet, so **manually verify the affected module in the browser before pushing**, and re-run `npm run lint` / `npm run build` to catch type errors.
