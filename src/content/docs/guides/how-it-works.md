---
title: How Graft Works
description: The core concepts behind Graft and its architecture.
---

Graft is designed to make remote deployment feel as seamless as local development. It achieves this by extending Docker Compose to remote servers over SSH without requiring any agent installations.

### Core Architecture

Every Graft project consists of three main components:

1.  **`docker-compose.yml`**: Your standard Docker Compose file.
2.  **`graft-compose.yml`**: A Graft-specific configuration that stores context like production environment variables and Traefik labels.
3.  **`.graft/` folder**: Stores server configuration, project metadata, and connection details.

### The Lifecycle of a Project

#### 1. Initialization (`graft init`)
Graft connects to your server (or helps you set up a new one). It checks if the server is ready by looking for Graft's infrastructure directory (`/opt/graft`). If the host is not initialized, Graft will:
- Install Docker and Docker Compose.
- Set up a **Traefik** reverse proxy with automatic SSL (Let's Encrypt).
- Configure internal networking.

#### 2. Synchronization (`graft sync`)
When you run `graft sync`, Graft performs several tasks:
- **Environment Management**: It extracts variables from `graft-compose.yml` into a secure `.env` file on the server.
- **Source Sync**: Depending on your [Deployment Mode](/guides/deployment-modes), it uploads your code (via rsync) or leverages Git.
- **Remote Build**: It instructs the remote Docker engine to build and start your services.
- **Cleanup**: It prunes old images to keep your server storage clean.

#### 3. Management
Once deployed, you can use any Docker Compose command through Graft. Commands like `graft ps`, `graft logs`, and `graft restart` are passed directly to the remote server, giving you full control from your local terminal.

---

### Key Concepts

- **Passthrough Engine**: Any command Graft doesn't recognize is sent directly to `docker compose` on the server.
- **Shared Infrastructure**: Graft can manage shared Postgres and Redis instances that are shared across different projects on the same host.
- **DNS Automation**: Integrated with Cloudflare to automatically update A records when your services are deployed.
