---
title: Infrastructure Commands
description: Manage shared databases, caches, and backups.
---

Graft allows you to run shared infrastructure like Postgres and Redis that multiple projects can use.

### `graft db <name> init`
Create an isolated Postgres database on the project's server.

```bash
graft db myapp init                    # project scope (uses project's server)
graft host db myapp init               # host scope (uses host's server)
graft -r azure db myapp init           # registry scope (targets specific server)
graft env staging db myapp init        # creates db and links to staging env
```

**What it does:**
- Creates a dedicated database in the shared Postgres container.
- Creates a scoped `<name>_user` with a random 24-character password — admin credentials never appear in project secrets.
- Generates a connection URL saved to `.graft/secrets.env` as `GRAFT_POSTGRES_<NAME>_URL`.
- Prompts to link the database to a project environment. If the environment already has a database linked, prompts for overwrite confirmation.

**Output:**
```
GRAFT_POSTGRES_MYAPP_URL=postgres://<user>:<pass>@graft-postgres:5432/myapp
```

**Usage in graft-compose.yml:**
```yaml
environment:
  - DATABASE_URL=${GRAFT_POSTGRES_MYAPP_URL}
```

---

### `graft redis <name> init`
Map a Redis database index for the project.

```bash
graft redis cache init
graft host redis cache init
graft -r azure redis cache init
```

**What it does:**
- Allocates a Redis database index in the shared Redis container.
- Generates a connection URL.
- Saves the secret as `GRAFT_REDIS_<NAME>_URL`.

---

### `graft infra [db|redis] ports:<value>`
Manage port visibility for shared infrastructure services.

```bash
# Reveal Postgres port 5432 to the internet
graft infra db ports:5432

# Hide Postgres port from the internet
graft infra db ports:null
```

---

### `graft infra reload`
Pull and reload infrastructure services (Postgres and Redis).

```bash
graft infra reload
```

---

### `graft infra db backup`
Schedule or run an automated database backup to an S3-compatible service.

```bash
graft infra db backup
```

**Interactive Flow:**
1. **S3 Config**: Provide Endpoint, Region, Bucket, Access Key, and Secret Key.
2. **Scheduling**: Choose to enable daily backups via cron (2 AM).
3. **Save Info**: Choose to persist credentials on the server.
4. **Immediate Backup**: Option to run the first backup immediately to verify setup.
