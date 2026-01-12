---
title: Deployment Modes
description: Choose the best way to sync and deploy your project.
---

Graft supports several deployment modes to fit your workflow, from quick local iteration to full CI/CD pipelines.

### Direct Deployment (No Git Required)

These modes are perfect for fast iteration or project where you don't want to manage a repository.

- **`direct-serverbuild` (Default)**: Graft uploads your source code and builds the Docker images directly on the remote server.
- **`direct-localbuild`**: Graft builds the images on your local machine and then uploads the compressed images to the server. Useful if your server has limited CPU/RAM.

### Git-Based Deployment (CI/CD)

For production environments, we recommend using one of the Git-based modes.

- **`git-images`**:
  - **Workflow**: GitHub Actions builds images → Pushes to GitHub Container Registry (GHCR) → Graft-hook deploys via webhook.
  - **Best for**: Teams using GitHub with automated deployments.
- **`git-repo-serverbuild`**:
  - **Workflow**: GitHub Actions triggers your server → Server pulls from your repo → Server builds images locally.
  - **Best for**: Automated deployments where you prefer building on your own hardware.
- **`git-manual`**:
  - **Workflow**: Sets up the Git integration but requires you to run `graft sync` manually to deploy.
  - **Best for**: Projects where you want Git tracking but full manual control over when code goes live.

---

### Switching Modes

You can change your deployment mode at any time using:

```bash
graft mode
```

This will guide you through an interactive selection and update your `graft-compose.yml` and project metadata accordingly.
