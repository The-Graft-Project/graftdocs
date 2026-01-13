---
title: Deployment Mode
description: Managing and changing your project's deployment strategy.
---

Graft allows you to change your deployment strategy at any time. This is useful if you start with direct uploads and later want to transition to a full GitHub Actions CI/CD workflow.

### `graft mode`
Change the deployment mode of an existing project.

```bash
graft mode
```

**The Workflow:**
When you run this command, Graft fetches your current mode and allows you to switch to any of the other [Deployment Modes](/guides/deployment-modes):

#### Git-Based Modes:
1.  **git-images**: Full CI/CD. GitHub Actions builds images → pushes to GHCR → automated deployment via Graft-Hook.
2.  **git-repo-serverbuild**: CI/CD triggered. GitHub Actions tells your server to pull and build the code locally.
3.  **git-manual**: Remote repository setup without an automated CI/CD workflow.

#### Direct Deployment Modes:
4.  **direct-serverbuild**: (Default) Source code is uploaded via `rsync` and built directly on the server.
