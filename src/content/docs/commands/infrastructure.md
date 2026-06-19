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

### `graft db <name> serve`
Tunnel a remote Postgres database to your local machine over SSH.

```bash
graft db myapp serve                   # tunnel to localhost:5432
graft db myapp serve :5433             # custom local port

# Host scope
graft host db myapp serve
graft host db myapp serve :5433

# Registry scope
graft -r azure db myapp serve
graft -r azure db myapp serve :5433
```

**Example output (with local secrets):**
```
🔗 Tunneling remote postgres to localhost:5432...

📋 Connection details:
   Host:     localhost
   Port:     5432
   Database: myapp

📋 Connection string:
   postgres://myapp_user:abc123@localhost:5432/myapp (from .graft/secrets.env)

Press Ctrl+C to stop the tunnel.
```

**Without local secrets:**
```
📋 Connection details:
   Host:     localhost
   Port:     5432
   Database: myapp

💡 Credentials are in .graft/secrets.env (key: GRAFT_POSTGRES_MYAPP_URL)
```

Once the tunnel is running, connect with any local tool — pgAdmin, DBeaver, TablePlus, psql, or your app's dev config pointing at `localhost:5432`.

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
