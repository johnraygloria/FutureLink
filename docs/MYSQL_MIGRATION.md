# FutureLink — Migrating off XAMPP to a native Windows MySQL Server

> Runbook for what was done on 2026-07-20 to stop relying on XAMPP's bundled
> MariaDB for `company_ftl`, and how to redo it on a new machine.
> Companion docs: [DATABASE.md](DATABASE.md) · [DEVELOPMENT.md](DEVELOPMENT.md)

---

## Why

XAMPP's MariaDB (`C:\xampp\mysql`) was never registered as a Windows
service. It only started if someone opened XAMPP Control Panel and clicked
"Start" next to MySQL — so after every reboot the backend would fail to
connect until someone noticed and manually started it. On top of that, this
machine's XAMPP `mysql.db` system table had silently become corrupted
("marked as crashed"), which is very likely the real reason it kept failing
to come up at all.

The fix: install MySQL Server directly, register it as a Windows service set
to **Automatic** startup on port 3306 (so it survives reboots with zero GUI
interaction), migrate `company_ftl` into it, and move XAMPP's MariaDB off to
a different port so it stops competing for 3306. XAMPP itself (Apache,
phpMyAdmin, FileZilla, etc.) is left alone — only its MySQL component is
touched.

---

## Prerequisites

- `winget` available (ships with modern Windows 10/11).
- An elevated (Administrator) PowerShell window. Installing a Windows
  service and writing to `C:\Program Files` requires admin rights that a
  non-elevated shell (or an AI agent without a desktop session to click a
  UAC prompt) cannot obtain on its own — these steps must be run by a human
  in an admin PowerShell window.
- XAMPP already installed at `C:\xampp` with the `company_ftl` database
  present in its MariaDB data dir (this doc assumes you're migrating *from*
  an existing XAMPP install; skip step 3 if there's no old data to bring
  over).

---

## Step 1 — Install MySQL Server as an auto-start Windows service

Run in an **elevated** PowerShell window. This downloads MySQL Server 8.4
(~130MB), initializes a fresh data directory, registers it as a Windows
service, and sets the root password.

```powershell
# install_mysql_server.ps1
$ErrorActionPreference = 'Stop'

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Error "Run this from an elevated PowerShell window."; exit 1 }

Write-Host "==> Installing MySQL Server via winget..." -ForegroundColor Cyan
winget install --id Oracle.MySQL --source winget --silent --accept-package-agreements --accept-source-agreements

$mysqlBase = Get-ChildItem "C:\Program Files\MySQL" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
if (-not $mysqlBase) { throw "MySQL install directory not found under C:\Program Files\MySQL - install may have failed." }
$mysqlBin = Join-Path $mysqlBase.FullName "bin"

$dataDir = "C:\ProgramData\MySQL\MySQLServerData"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

$iniPath = "C:\ProgramData\MySQL\my.ini"
@"
[mysqld]
port=3306
datadir=$dataDir
"@ | Set-Content -Path $iniPath -Encoding ascii

$serviceName = "MySQL84"

Write-Host "==> Initializing data directory..." -ForegroundColor Cyan
& "$mysqlBin\mysqld.exe" --defaults-file="$iniPath" --initialize-insecure --console

Write-Host "==> Installing Windows service $serviceName..." -ForegroundColor Cyan
& "$mysqlBin\mysqld.exe" --install $serviceName --defaults-file="$iniPath"

Set-Service $serviceName -StartupType Automatic
Start-Service $serviceName
Start-Sleep -Seconds 3

# CHANGE THIS - generate a real random password, don't reuse across machines
$rootPassword = '<GENERATE_A_STRONG_PASSWORD>'
Write-Host "==> Setting root password..." -ForegroundColor Cyan
& "$mysqlBin\mysql.exe" -u root --execute "ALTER USER 'root'@'localhost' IDENTIFIED BY '$rootPassword'; FLUSH PRIVILEGES;"

Write-Host "==> Done. Service status:" -ForegroundColor Green
Get-Service $serviceName | Format-Table -AutoSize
sc.exe qc $serviceName | Select-String "START_TYPE"
netstat -ano | Select-String ":3306"
```

**Notes:**
- `--initialize-insecure` creates `root@localhost` with an empty password;
  the script immediately sets a real one via `ALTER USER`. Never leave it on
  the insecure default.
- The service name `MySQL84` is arbitrary — pick something that won't clash
  if you ever install a second MySQL version side by side.
- Verify afterward: `Get-Service MySQL84` should show `Running` /
  `Automatic`, and `netstat -ano | findstr :3306` should show `mysqld.exe`
  listening.
- **Generate the password with the agent/session doing the migration and
  keep it out of git** — put it straight into `server/.env`
  (`DB_PASSWORD=...`), which is gitignored. Do not commit it anywhere,
  especially in a public repo.

---

## Step 2 — Move XAMPP's MariaDB off port 3306

Two files need editing. `my.ini` is user-writable; `xampp-control.ini` is
ACL-locked to Administrators only, so that one needs an elevated shell too.
**Close XAMPP Control Panel first** — it holds `xampp-control.ini` open, and
on this machine closing it also killed Apache because XAMPP Control Panel
manages its children via a Windows job object (force-killing the panel takes
Apache down with it). Restart Apache afterward if you need it:
`Start-Process C:\xampp\apache\bin\httpd.exe`.

### `C:\xampp\mysql\bin\my.ini` (no elevation needed)

Change `port=3306` to `port=3307` in **both** the `[client]` and `[mysqld]`
sections.

### `C:\xampp\xampp-control.ini` (elevated)

Only touch `[Autostart]`, `[EnableServices]`, and `[ServicePorts]` — leave
`[EnableModules]` alone (that one just controls whether MySQL shows up in
the panel UI at all, not whether it autostarts).

```powershell
# fix_xampp_control_ini.ps1 — run elevated
$ErrorActionPreference = 'Stop'
$path = "C:\xampp\xampp-control.ini"

$lines = Get-Content $path
$section = ""
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\[(.+)\]$') { $section = $matches[1]; continue }
    if ($lines[$i] -match '^MySQL=') {
        if ($section -eq 'Autostart' -or $section -eq 'EnableServices') {
            $lines[$i] = 'MySQL=0'
        } elseif ($section -eq 'ServicePorts') {
            $lines[$i] = 'MySQL=3307'
        }
    }
}

[System.IO.File]::WriteAllLines($path, $lines)
Select-String -Path $path -Pattern "MySQL"
```

> **Gotcha:** a naive `-replace '(?m)^MySQL=1$', 'MySQL=0'` regex across the
> whole file silently no-ops on Windows CRLF line endings (`$` in .NET
> multiline mode matches before `\n`, not before the `\r` that precedes it in
> `\r\n`), and even if it worked it would also flip the unrelated
> `[EnableModules]` entry. Do the section-aware line-by-line edit above
> instead.

---

## Step 3 — Migrate the data

1. Start XAMPP's MariaDB on its new port to access the old data:
   ```powershell
   Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList '--defaults-file="C:\xampp\mysql\bin\my.ini"' -WorkingDirectory "C:\xampp\mysql\bin"
   ```
   Give it a few seconds, then confirm: `netstat -ano | findstr :3307`.

2. **If it crashes on startup** with something like `Table '.\mysql\db' is
   marked as crashed and last (automatic?) repair failed` in
   `C:\xampp\mysql\data\mysql_error.log` — this is what happened on this
   machine — repair the Aria system table before retrying:
   ```bash
   cd C:\xampp\mysql\data
   C:\xampp\mysql\bin\aria_chk.exe -r mysql/db
   ```
   Then retry step 1. (Must be run from inside the data directory so
   `aria_chk` can find `aria_log_control`.)

3. Sanity-check what's there before dumping:
   ```bash
   mysql -u root -h 127.0.0.1 -P 3307 --protocol=tcp -e "SHOW DATABASES;"
   mysql -u root -h 127.0.0.1 -P 3307 --protocol=tcp company_ftl -e "SHOW TABLES;"
   ```

4. Dump it:
   ```bash
   mysqldump -u root -h 127.0.0.1 -P 3307 --protocol=tcp --routines --triggers --single-transaction company_ftl > company_ftl_migration.sql
   ```

5. Create the DB and import into the new server (port 3306):
   ```bash
   mysql -u root -p -P 3306 --protocol=tcp -e "CREATE DATABASE company_ftl CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
   mysql -u root -p -P 3306 --protocol=tcp company_ftl < company_ftl_migration.sql
   ```

6. Verify row counts match on both sides for every table (adjust table list
   if the schema has changed since — check `docs/DATABASE.md`):
   ```sql
   SELECT 'recruitment_applicants' t, COUNT(*) c FROM recruitment_applicants
   UNION ALL SELECT 'principals', COUNT(*) FROM principals
   UNION ALL SELECT 'applicant_principals', COUNT(*) FROM applicant_principals
   UNION ALL SELECT 'masterlist_employees', COUNT(*) FROM masterlist_employees
   UNION ALL SELECT 'screening_history', COUNT(*) FROM screening_history
   UNION ALL SELECT 'assessment_history', COUNT(*) FROM assessment_history
   UNION ALL SELECT 'selection_history', COUNT(*) FROM selection_history
   UNION ALL SELECT 'engagement_history', COUNT(*) FROM engagement_history
   UNION ALL SELECT 'users', COUNT(*) FROM users;
   ```

7. Stop the temporary XAMPP mysqld (it won't come back on its own — autostart
   is disabled per Step 2):
   ```powershell
   Stop-Process -Id <pid-from-netstat> -Force
   ```

8. **Delete the dump file** once verified — it contains real applicant PII
   (names, contact numbers, addresses). Don't leave it lying around, and
   never commit it to the repo.

---

## Step 4 — Point the app at the new server

Edit `server/.env` (gitignored, never committed):
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=<the password you set in Step 1>
DB_NAME=company_ftl
```
No `DB_PORT` needed — nothing in the codebase reads it, and `mysql2`
defaults to 3306, which the new server owns.

If a backend process was already running (e.g. from the
`C:\Users\<user>\Desktop\Startup` scripts), it's holding a stale DB
connection pool from before `.env` changed — restart it:
```bash
# find and kill the process on port 5001, then:
cd server && npm start
```

---

## Step 5 — Verify end-to-end

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5001/api/applicants     # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/api/applicants     # 200 (preview) or 5173 (dev)
```
Then open the app in a browser and click through a page or two (e.g.
Screening list) to confirm real data loads.

Confirm the service will survive a reboot:
```powershell
sc.exe qc MySQL84 | Select-String "START_TYPE"   # expect AUTO_START
```

---

## What's left as-is (deliberately out of scope)

- XAMPP itself is **not** uninstalled — Apache/phpMyAdmin/FileZilla etc.
  keep running exactly as before, only MySQL was touched.
- The `C:\Users\<user>\Desktop\Startup` scripts (`server.ps1`, `start.ps1`,
  and the XAMPP Control Panel shortcut) needed **no changes** — none of them
  reference MySQL directly. The XAMPP Control Panel shortcut still
  auto-launches Apache on boot; MySQL now starts independently as a native
  Windows service regardless of whether that panel is ever opened.
