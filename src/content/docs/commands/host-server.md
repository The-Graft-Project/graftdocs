---
title: Host/Server Management
description: Commands for maintaining your remote host and core Graft infrastructure.
---

### `graft host clean`
Clean up Docker resources on the server (stopped containers, unused images, build cache, etc.).

```bash
graft host clean
```

---

### `graft host -sh`
Instantly start an SSH session on the remote server where your current project is deployed. No need to manage IP addresses or keys manually.

**Start an interactive session:**
```bash
graft host -sh
```

**Run a single command:**
You can also execute a command directly on the remote host without entering an interactive shell.
```bash
graft host -sh "df -h"
```
*Example output: Shows the disk usage of the remote server.*

---

### `graft host self-destruct`
**⚠️ DESTRUCTIVE OPERATION ⚠️** - Completely tear down all Graft infrastructure and projects on the server.

```bash
graft host self-destruct
```
Requires typing `DESTROY` and then `YES` to confirm.

---

### `graft host init`
Manually trigger the setup of Graft's core infrastructure on a remote server. This is usually handled automatically by `graft init`, but can be run independently to prepare a server.

```bash
graft host init
```
**Installs:** Docker, Docker Compose, Traefik (with SSL), and prepares the Graft public network.
