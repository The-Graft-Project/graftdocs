---
title: Introduction
description: Overview and performance metrics of the Graft Hook automation engine.
---

**Graft Hook** is the lightweight powerhouse that enables automated deployments for your projects. It operates as a minimalist webhook receiver that listens for deployment triggers (like GitHub Actions) and executes your synchronization logic on the server.

### ⚡ Performance & Efficiency

Graft Hook is designed with a "zero-overhead" philosophy. It stays completely out of the way of your application's resources, ensuring your server remains focused on what matters: your code.

#### Live Performance Stats
During idle periods, the resource footprint is virtually non-existent:

```text
CONTAINER ID   NAME                   CPU %     MEM USAGE / LIMIT    MEM %     PIDS
0deea9bcd77e   webhook-graft-hook-1   0.00%     1.73MiB / 916.8MiB   0.19%     3
```

#### Key Metrics:
*   **Idle CPU Usage**: 0.00%
*   **Idle RAM**: < 2MB (typically around 1.7MiB)
*   **Peak Deployment RAM**: Max 10-15MB (during active `git pull`, `docker pull`, and container restarts)

---

### Webhook Mechanism

Graft Hook provides a secure endpoint to trigger remote deployments. It eliminates the need for complex, heavy agents by using a precise, authenticated communication flow:

1.  **POST Request**: A client (like GitHub Actions) sends a POST request containing the **Project Name** in the payload.
2.  **Authentication**: The request is verified using a **short-lived security token** (like `secrets.GITHUB_TOKEN`) provided by the CI/CD runner.
3.  **Deployment**: Once authenticated, Graft Hook triggers the server-side engine to perform the sync, handle `git pull` or `docker pull`, and restart the target containers.

### Why it's different

Unlike traditional "Heavy agents" or control panels that consume hundreds of megabytes of RAM just to stay alive, Graft Hook is a compiled, high-performance binary. It provides the automation of a production-grade CI/CD runner with a footprint smaller than most system logging daemons.
