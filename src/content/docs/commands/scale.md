---
title: Scale
description: Scale services to run multiple instances on the remote server.
---

Graft provides a native `scale` command to adjust the number of running replicas for any service in your project without a full redeploy.

### `graft scale <service> <replicas>`
Set the number of running instances for a specific service.

```bash
graft scale backend 3
graft scale worker 5
graft scale frontend 1
```

**What it does:**
1. Connects to the remote server.
2. Runs `docker compose up -d --scale <service>=<replicas> --no-recreate` against your project's compose file.
3. Starts or stops containers to match the requested replica count without interrupting already-running instances.

**Flags:**
- `--no-recreate` *(default)* — Only add or remove containers; do not recreate existing ones.
- `--force-recreate` — Recreate all containers for the service to apply any configuration changes.

```bash
graft scale backend 3 --force-recreate
```

---

### Scaling to Zero

Setting replicas to `0` stops all containers for a service without removing its configuration.

```bash
graft scale backend 0
```

This is equivalent to `graft stop backend` but keeps scaling semantics consistent when scripting.

---

### Load Balancing with Traefik

When scaling a service behind Traefik, all replicas are automatically added to the load balancer pool. No label changes are required.

```yaml
# graft-compose.yml
services:
  backend:
    build: ./backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.example.com`)"
      - "traefik.http.services.backend.loadbalancer.server.port=8080"
    networks:
      - graft-public
```

```bash
# Scale to 3 replicas — Traefik distributes traffic across all three automatically
graft scale backend 3
```

:::note
Traefik uses round-robin load balancing by default. For sticky sessions, add the `loadbalancer.sticky` label to your service.
:::

---

### Example Workflow

```bash
# Scale up before a traffic spike
graft scale backend 5

# Check that all instances are running
graft ps

# Scale back down after the spike
graft scale backend 2
```
