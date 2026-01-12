---
title: Rollback Commands
description: Revert to previous versions of your project or specific services.
---

Graft automatically creates a backup of your configuration and images during every `sync`.

### `graft rollback`
Roll back the entire project to a previous backup version.

```bash
graft rollback
```

**What it does:**
1. Lists available backups with timestamps.
2. Interactively prompts you to select a version.
3. Restores `docker-compose.yml` and environment files.
4. Loads and re-tags compressed images from the backup.
5. Restarts all services.

---

### `graft rollback service <name>`
Roll back only a specific service to a previous version.

```bash
graft rollback service backend
```

---

### `graft rollback config`
Configure how many rollback versions Graft should keep on the server.

```bash
graft rollback config
```
Default is 3 versions. Set to 0 to disable rollbacks.
