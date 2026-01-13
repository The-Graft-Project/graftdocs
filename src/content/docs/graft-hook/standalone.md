---
title: Standalone Usage (Non-Graft)
description: Use Graft Hook as a standalone webhook receiver for any project, even those not managed by Graft.
---

Graft Hook can be used as a high-performance, minimalist webhook receiver for **any project** on your server, even if you don't use the Graft CLI for project management.

---

## 1. Setup Requirements

To use Graft Hook in standalone mode, your Hook service must be configured to manage your host's Docker engine and projects.

### Graft Hook Service Setup

Your Hook's own `docker-compose.yml` should expose the endpoint securely. Here is a production-ready example using **Traefik** for SSL and routing:

```yaml
services:
  graft-hook:
    image: skssmd/graft-hook:latest
    environment:
      - GIT_PAT_TOKEN=your_pat
      - DOCKER_ACCESS_TOKEN=your_registry_token
      - DOCKER_USER=your_username
      - DOCKER_REGISTRY=ghcr.io
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock      # Required: To control Docker on the host
      - /path/to/your/projects:/path/to/your/projects # Required: Mount where your projects live
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.graft-hook.rule=Host(`hook.yourdomain.com`)"
      - "traefik.http.routers.graft-hook.entrypoints=websecure"
      - "traefik.http.routers.graft-hook.tls.certresolver=myresolver"
      - "traefik.http.services.graft-hook.loadbalancer.server.port=8080"
      - "traefik.docker.network=infra_network" # Ensure Traefik uses the correct network
    networks:
      - infra_network
    restart: always

networks:
  infra_network:
    external: true
```

> **Note on Networking**: When using Traefik, ensure the Hook service is on the same Docker network as your Traefik instance (e.g., `infra_network` or `traefik_public`). 
> **Note for Nginx users**: If you prefer Nginx, simply remove the labels/networks and map the ports (e.g., `8080:8080`).


### Project Requirements
*   **Docker Compose**: The target project must have a valid `docker-compose.yml`.
*   **Permissions**: The Graft Hook container must have read/write permissions for the project directory on the host.

### Target Project Demo
The project located at the `path` you provide should contain a standard `docker-compose.yml`. For example:

```yaml
# /path/to/your/projects/my-app/docker-compose.yml
services:
  web:
    image: ghcr.io/your-user/your-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

---

## 2. Configuration Logic

Since standalone projects aren't indexed by the Graft CLI, you must specify the full project path and backup settings directly in the Webhook URL.

### URL Structure (Non-Graft)

**Payload URL Template:**
`https://your-hook-url.com/webhook?mode=repo&path=/path/to/your/projects/my-app&versionstokeep=5`

:::important
Graft Hook requires query parameters to be **alphabetically sorted** by their keys before calculating the HMAC signature. In standalone mode, the order is **`mode`**, then **`path`**, then **`versionstokeep`**.
:::

| Parameter | Required | Description |
|-----------|----------|-------------|
| `mode` | **Yes** | `repo` for git builds, `image` for direct pulls. |
| `path` | **Yes** | The absolute file system path (on the host) to the directory containing your `docker-compose.yml`. |
| `versionstokeep` | Optional | Number of rolling backups to keep (default is 0/none). |

---

## 3. Webhook Trigger (GitHub)

1. **Payload URL**: `https://hook.yourdomain.com/webhook?mode=image&path=/path/to/your/projects/my-app&versionstokeep=3`
2. **Secret**: Your security token (used for HMAC verification).
3. **Content type**: `application/json`.

---

## 4. Manual Trigger (cURL)

Example of triggering a standalone deployment manually:

```bash
# 1. Alphabetical Order: 'mode', then 'path', then 'versionstokeep'
QUERY="mode=repo&path=/path/to/your/projects/my-app&versionstokeep=5"

# 2. Key: Use DOCKER_ACCESS_TOKEN for image mode, GIT_PAT_TOKEN for repo mode
SECRET="YOUR_SECRET_TOKEN"

# 3. Sign the alphabetical string
SIGNATURE=$(echo -n "$QUERY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# 4. Send the request
curl -X POST "https://hook.yourdomain.com/webhook?$QUERY" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE"
```

:::tip[Why use standalone?]
This is perfect for legacy projects or simple setups where you don't want the full Graft project structure but still need a reliable, 0% CPU idle deployment engine.
:::
