---
title: Psql Passthrough
description: Interactive Postgres sessions with full psql flag support.
---

`graft psql` opens a `psql` session on the infrastructure Postgres. It acts as a full psql passthrough — all native psql flags are supported.

### Project Scope

Inside a project directory, `graft psql` auto-connects to the environment's linked database. No dbname argument is accepted — the database is always determined by the current env.

```bash
graft psql                             # interactive session on env's db
graft psql -c "\dt"                    # list tables
graft psql -c "SELECT count(*) FROM users"
graft psql -f migrations/001.sql       # run a SQL file
graft psql -t -A -c "SELECT version()"  # any psql flags work
graft env staging psql                 # staging env's database
graft env staging psql -c "\dt"        # one-off on staging
graft -p myapp psql                    # specific project's prod db
```

---

### Registry Scope

With `-r`, connects to the admin master database by default, or to a specific database if provided.

```bash
graft -r azure psql                    # admin master db
graft -r azure psql mydb              # specific database
graft -r azure psql mydb -c "SELECT 1"
```
