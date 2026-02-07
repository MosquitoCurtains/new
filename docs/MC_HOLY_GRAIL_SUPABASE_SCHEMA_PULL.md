# MC Holy Grail Supabase Schema Pull

**Last Updated:** February 7, 2026

How to pull a complete schema dump from the production Supabase database.

---

## Prerequisites

### 1. PostgreSQL Client Tools (version must match server)

The Supabase database runs **PostgreSQL 17**. Your local `pg_dump` must be version 17+.

Check your version:

```bash
pg_dump --version
```

If you have an older version (e.g. 14.x from Homebrew), install the matching version:

```bash
brew install postgresql@17
```

This installs as keg-only (won't override your existing version). The binary lives at:

```
/opt/homebrew/opt/postgresql@17/bin/pg_dump
```

### 2. Connection String

You need the **Session Mode Pooler** connection string from the Supabase dashboard.

- Go to: **Supabase Dashboard > Project Settings > Database > Connection string**
- Select **Session mode** (port 5432) — `pg_dump` does NOT work with transaction mode (port 6543)
- Direct connections (db.*.supabase.co) are blocked; you must use the pooler

The connection string format:

```
postgresql://postgres.zmtqborzhfhtoibsyldu:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```

---

## The Command

Run from the project root:

```bash
/opt/homebrew/opt/postgresql@17/bin/pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  --schema=public \
  "postgresql://postgres.zmtqborzhfhtoibsyldu:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres" \
  > supabase/COMPLETE_SCHEMA_DUMP.sql
```

### Flags Explained

| Flag | Purpose |
|------|---------|
| `--schema-only` | Dumps structure only, no data |
| `--no-owner` | Skips ownership statements (not needed locally) |
| `--no-privileges` | Skips GRANT/REVOKE statements |
| `--schema=public` | Only dumps the `public` schema (skips Supabase internals like `auth`, `storage`, `extensions`) |

---

## Quick Reference (Copy-Paste)

If you've already installed postgresql@17 and have the password ready:

```bash
/opt/homebrew/opt/postgresql@17/bin/pg_dump --schema-only --no-owner --no-privileges --schema=public "postgresql://postgres.zmtqborzhfhtoibsyldu:YOUR_PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres" > supabase/COMPLETE_SCHEMA_DUMP.sql
```

Output goes to `supabase/COMPLETE_SCHEMA_DUMP.sql` (~6,600 lines as of Feb 2026).

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Connection refused` on port 5432 | You're using the direct URL (`db.*.supabase.co`). Use the **pooler** URL instead (`aws-0-us-west-2.pooler.supabase.com`) |
| `server version mismatch` | Your `pg_dump` is too old. Install `postgresql@17` via Homebrew |
| `Tenant or user not found` | Wrong AWS region in the pooler URL. This project uses **us-west-2** |
| `password authentication failed` | Check the password in your Supabase dashboard (Project Settings > Database) |
