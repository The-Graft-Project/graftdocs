---
title: Scale
description: Scale services to run multiple replicas with automatic load balancing.
---

Graft provides a native `scale` command to adjust the number of running replicas for any service. Scaling persists through deploys.

### `graft scale <service> <n>`
Scale a service to N replicas via Traefik load balancing.

```bash
graft scale backend 3                  # 3 instances of backend
graft scale backend 1                  # remove replicas, back to single
graft env staging scale backend 2      # scale in staging env
```

**What it does:**
1. Creates `<service>-scale-2`, `<service>-scale-3`, etc. in the remote compose file.
2. Each replica gets the Traefik loadbalancer label so traffic is distributed automatically.
3. Starts the new replica containers alongside existing ones.

Scaling back to `1` removes the extra replicas from the compose file and stops the additional containers.

---

### Load Balancing with Traefik

When scaling a service behind Traefik, all replicas are automatically added to the load balancer pool. No label changes are required — Graft handles this for you.

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
# Scale to 3 replicas — Traefik distributes traffic across all three
graft scale backend 3
```

---

### Example Workflow

```bash
# Scale up before a traffic spike
graft scale backend 3

# Check that all instances are running
graft ps

# Deploy an update — replicas persist
graft sync backend

# Scale back down
graft scale backend 1
```
