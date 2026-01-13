---
title: Deployment
description: Synchronizing your code and configuration to the remote server.
---

Once your project is initialized and configured, the `graft sync` command becomes your primary tool for pushing updates to production.

### 1. Git-Based Automated Deployment
*Used for: `git-images` and `git-repo-serverbuild` modes.*

For Git-based workflows, `graft sync` acts as a **setup and synchronization** tool. Instead of building locally, it prepares your automated pipeline:

```bash
graft sync
```

**What it does:**
1.  **CI/CD Generation**: Automatically generates or updates your GitHub Actions workflows (`.github/workflows/graft-deploy.yml`).
2.  **Environment Sync**: Extraction of variables from `graft-compose.yml` and pushes a secure production `.env` file directly to the server.
3.  **Remote Configuration**: Sends the optimized `docker-compose.yml` to the server directory.

**The Result:** After running `graft sync`, your only step is to push your code:
```bash
git add .
git commit -m "update deployment"
git push origin main
```
The GitHub Action will build your images and trigger the deployment on your server automatically.

---

### 2. Direct & Manual Deployment
*Used for: `direct-serverbuild` or manually triggering builds from a Git repo on the server.*

In Direct modes, the CLI handles the entire build and deployment process immediately. For modes like `git-manual`, you can also trigger remote builds from specific commits.

```bash
graft sync [flags]
```

**Common Flags:**
- `graft sync --no-cache`: Force a fresh build (clears Docker build cache).
- `graft sync -h`: **Heave sync**. Uploads your source code/configuration only but does *not* trigger a build or restart.
- `graft sync --git`: Instructs the server to pull from its remote repository and build from the current branch.
- `graft sync --git --branch develop`: Pull and build from a specific Git branch.
- `graft sync --git --commit abc1234`: Pull and build from a specific Git commit hash.

**What happens (Direct Mode):**
1. Generates production `docker-compose.yml`.
2. Syncs environment variables and secret files.
3. Uploads source code via `rsync` (if not using `--git`).
4. Remotely executes the build and restarts the containers.

---

### Sync Sub-commands

#### `graft sync <service>`
Deploy a specific service only. This is significantly faster as other services remain untouched and running.
```bash
graft sync web
```

#### `graft sync compose`
Update only the remote `docker-compose.yml` and restart services without rebuilding any images.
```bash
graft sync compose
```
*Perfect for updating environment variables, port mappings, or Traefik labels.*
