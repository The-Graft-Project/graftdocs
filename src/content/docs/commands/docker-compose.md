---
title: Docker Compose Passthrough
description: Learn how Graft forwards standard Docker Compose commands to your remote server.
---

Graft uses a **hybrid command architecture**. While it has many native commands for infrastructure and deployment management, it also acts as a powerful proxy for Docker Compose.

**Any command not natively handled by Graft is automatically passed to `docker compose` on the remote server!**

Simply replace `docker compose` with `graft` in your terminal, and Graft will take your command straight to your server's project.

See the full list of available commands at the [Docker Compose Documentation](https://docs.docker.com/reference/cli/docker/compose/).

---


## Common Passthrough Commands

Here are some of the most common Docker Compose commands you can run through Graft.

### Container Management

```bash
# View container status
graft ps

# Start all services
graft up

# Stop all services
graft down

# Stop a specific service
graft stop backend

# Start a specific service
graft start frontend

# Restart a specific service
graft restart backend
```

### Debugging & Inspection

```bash
# Execute commands in running containers
graft exec backend ls -la /app

# Open an interactive shell in a running container
graft exec backend sh

# Run one-off commands in new containers
graft run backend /app/main --version

# View container logs (standard Compose logs)
graft logs backend --tail=50 --follow

# Show running processes in a container
graft top backend
```

### Images & Builds

```bash
# View images on the remote host
graft images

# Build or rebuild services
graft build backend

# Build without using cache
graft build --no-cache backend
```

### Configuration & Scaling

```bash
# View the merged docker-compose configuration
graft config

# Scale a service to multiple instances
graft up --scale backend=3
```

---

## Global Context

You can use the `-p` or `--project` flag to run passthrough commands for any project from any directory:

```bash
# Check status of another project
graft -p my-other-app ps

# Restart a service in another project
graft -p my-other-app restart api
```

---

:::tip[Native vs Passthrough]
Graft native commands (like `graft sync` or `graft map`) often perform complex tasks like building images, injecting secrets, or updating DNS. Passthrough commands are pure Docker Compose operations executed on the remote host.
:::
