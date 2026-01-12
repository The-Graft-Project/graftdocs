---
title: Project Commands
description: Commands for initializing and managing Graft projects and hosts.
---

### `graft init`
Initialize a new Graft project in the current directory and configure server connection settings.

```bash
graft init [-f, --force]
```

**Interactive Setup Flow:**
1. **Server Selection**: Select an existing server from your global registry or type `/new`.
2. **Host Status Check**: Automatically checks if the remote host is initialized.
   - If `/opt/graft` is missing, prompts: `⚠️  Host is not initialized. Do you want to initialize the host? (y/n)`.
   - If "y", runs the complete host initialization process (`InitHost`).
3. **Registry Name** (if new): Provide a unique name to save the server globally.
4. **Project Name**: Name of your project (normalized to lowercase/underscores).
5. **Conflict Check**: Graft checks for existing projects with the same name.
6. **Domain Name**: The domain used for Traefik routing.
7. **Deployment Mode Selection**: Select from 5 modes (3 Git-based, 2 Direct).
8. **Automated Service Setup**: Checks if the `graft-hook` service is running on the server.
9. **Remote Environment Setup**: Creates remote project directory and initializes environment.

---

### `graft mode`
Change the deployment mode of an existing project.

```bash
graft mode
```

**Interactive Selection:**
Displays current deployment mode and prompts you to select a new one from 5 available modes:

**Git-based modes:**
1. **git-images** - GitHub Actions builds images and pushes to GHCR, automated deployment via graft-hook.
2. **git-repo-serverbuild** - GitHub Actions triggers server to pull and build from repository.
3. **git-manual** - Git repository setup without CI/CD workflow.

**Direct deployment modes:**
4. **direct-serverbuild** - Upload source code, build on server (default).
5. **direct-localbuild** - Build Docker images locally, upload to server.

---

### `graft host init`
Initialize the remote server with Docker, Docker Compose, Traefik, and optionally shared infrastructure.

```bash
graft host init
```

**What it does:**
- Detects OS (Ubuntu, Debian, Amazon Linux, etc.).
- Installs Docker and Docker Compose v2.
- Installs Docker Buildx.
- Creates `graft-public` network.
- Sets up **Traefik** with automatic HTTPS/Let's Encrypt support.
- Optionally installs shared Postgres and Redis.

---

### `graft host clean`
Clean up Docker resources on the server (stopped containers, unused images, build cache, etc.).

```bash
graft host clean
```

---

### `graft host self-destruct`
**⚠️ DESTRUCTIVE OPERATION ⚠️** - Completely tear down all Graft infrastructure and projects on the server.

```bash
graft host self-destruct
```
Requires typing `DESTROY` and then `YES` to confirm.
