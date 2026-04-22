---
title: How Graft Works
description: The core concepts behind Graft and its architecture.
---

Graft is designed to make remote deployment feel as seamless as local development. It achieves this by extending Docker Compose to remote servers over SSH without requiring any agent installations.

### Core Architecture

Every Graft project is built on three pillars that bridge the gap between your local environment and your production server:

1.  **`graft-compose.yml`**: Your primary source of truth. This is a standard Docker Compose file enhanced with Graft-specific context, such as production environment variables and routing metadata.
2.  **`docker-compose.yml`**: A refined, production-optimized version of your compose file generated automatically by Graft. It includes injected network configurations, Traefik labels, and managed environment paths.
3.  **`.graft/` folder**: A local hidden directory that stores your project's unique fingerprint, server connection details, and deployment history.

---

### The Project Lifecycle

#### 1. Initialization (`graft init`)

The initialization process prepares both your local environment and your target server for seamless communication. When you run `graft init`, the following occurs:

*   **Server Connection**: Graft prompts for your SSH credentials (user and key path) to establish a secure link to the remote host. You can use [`graft pub`](/commands/ssh) to quickly generate or retrieve a public key to authorize on your server.
*   **Infrastructure Check**: It audits the server for Graft's management layer (`/opt/graft`). If the server is "fresh," Graft automatically:
    *   Installs **Docker** and **Docker Compose**.
    *   Deploys a pre-configured **Traefik** reverse proxy with **Let's Encrypt** for automated SSL.
    *   Configures a secure internal networking bridge.
*   **Project Context**: You define your project name and primary domain name which Graft uses for routing and isolation.
*   **Rollback Configurations**: Configure how many previous versions you want to retain for instant restoration (but can be customized later).
*   **Webhook Integration**: Graft checks for the **Graft-Hook** on the server. If enabled, it installs the necessary components to allow remote triggers (e.g., for simple CI/CD).
*   **Boilerplate Generation**: Finally, it generates a demo `graft-compose.yml` tailored to your project, ready for you to customize.

#### 2. Synchronization (`graft sync`)

Synchronization is the core mechanic that pushes your local changes to production. It handles the heavy lifting of environment management and deployment logic:

*   **Compose Optimization**: Graft generates a specialized `docker-compose.yml` locally, optimizes it for the target server's environment, and transfers it securely with your confirmation.
*   **Secret Management**: Environment variables are extracted from `graft-compose.yml` and safely injected into a production-grade `.env` file on the remote server.
*   **Source Delivery**: Depending on your [Deployment Mode](/guides/deployment-modes), Graft handles your code delivery:
    *   **Server Build**: Your source code is uploaded via high-speed `rsync`, followed by a remote build and container restart. Graft also handles pruning old images to optimize storage.
    *   **Git Modes**: For Git-first workflows (like GitHub Actions), Graft generates high-performance CI/CD workflows based on your `graft-compose.yml` build contexts, automating your pipeline from push to production.

#### 3. Management

Once your project is live, Graft enters **Passthrough Mode**. Commands like `graft ps`, `graft logs`, and `graft restart` are relayed directly to the remote server. This allows you to manage production services with the exact same syntax and experience as if they were running on `localhost`.

---

### Key Concepts

*   **Passthrough Engine**: Graft acts as a thin wrapper. Any unrecognized command is passed directly to the remote Docker engine, ensuring you never lose access to native Docker features.
*   **Shared Infrastructure**: Provides the option to use shared database instances (Postgres, Redis) across multiple projects via Graft's core networking. While convenient for small setups, keeping databases separate is often the preferred choice for production isolation.
*   **Zero-Config DNS**: If using Cloudflare, Graft automatically manages your DNS records, ensuring your domain points to the correct server IP the moment you sync (requires a Cloudflare Access Token setup for domain configuration).
*   **Instant Rollbacks**: Graft provides built-in rollback options by keeping your preferred number of previous project images and configurations.