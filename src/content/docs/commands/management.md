---
title: Resource Management
description: Manage servers, projects, and global context flags.
---

### Registry Management
Graft keeps a local registry of your servers in `~/.graft/registry.json`.

- `graft registry ls`: List all servers.
- `graft registry add`: Interactively add a new server.
- `graft registry <name> del`: Remove a server from the registry.

---

### Project Management
- `graft projects ls`: List all local projects.
- `graft -r <srv> projects ls`: List all projects on a specific remote server.
- `graft -r <srv> pull <project>`: Download an existing project from a remote server to your local machine.

---

### Global Context Flags

#### `-p, --project <name>`
Run any Graft command for a specific project from **any directory**.
```bash
graft -p my-project sync
graft -p my-project ps
```

#### `-sh, --sh [command]`
Execute a shell command on the target or start an interactive SSH session.
- `graft -sh`: Starts an interactive SSH session.
- `graft -sh ls -la`: Executes a non-interactive command.
- Works with both `-r <registry>` and `-p <project>` flags.

---

### Docker Compose Passthrough
**Any command not natively handled by Graft is automatically passed to `docker compose` on the remote server!**

Examples:
- `graft ps`: Check status.
- `graft up`: Start services.
- `graft down`: Stop everything.
- `graft restart <service>`: Restart a service.
- `graft exec <service> sh`: Open a shell in a running container.
- `graft config`: View merged Docker Compose configuration.
- `graft images`: View images on the server.
