---
title: Infrastructure Commands
description: Manage shared databases, caches, and backups.
---

Graft allows you to run shared infrastructure like Postgres and Redis that multiple projects can use.

### `graft db <name> init`
Initialize a managed Postgres database.

```bash
graft db mydb init
```

**What it does:**
- Creates a database in the shared Postgres container.
- Generates a connection URL.
- Saves the secret as `GRAFT_POSTGRES_<NAME>_URL`.

**Usage in graft-compose.yml:**
```yaml
environment:
  - DATABASE_URL=${GRAFT_POSTGRES_MYDB_URL}
```

---

### `graft redis <name> init`
Initialize a managed Redis instance.

```bash
graft redis mycache init
```

**What it does:**
- Creates a Redis database (separate DB number).
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
