---
title: Deployment Commands
description: Sync your code and configuration to the remote server.
---

### `graft sync`
Deploy all services to the server.

```bash
graft sync                    # Deploy all services
graft sync --no-cache         # Force fresh build (clears cache)
graft sync -h                 # Heave sync (upload only, no build)
```

**What it does:**
1. Updates project metadata.
2. Uploads source code for `serverbuild` services.
3. Injects secrets from `.graft/secrets.env`.
4. Uploads `docker-compose.yml`.
5. Builds and starts all services.

**Git-Based Sync:**
Deploy from specific git commits or branches:

```bash
graft sync --git
graft sync --git --branch develop
graft sync --git --commit abc1234
```

---

### `graft sync <service>`
Deploy a specific service only. This is much faster as other services keep running.

```bash
graft sync backend
graft sync frontend --no-cache
```

---

### `graft sync compose`
Update only the `docker-compose.yml` and restart services without rebuilding images.

```bash
graft sync compose
```
Useful for quick changes to environment variables or port mappings.
