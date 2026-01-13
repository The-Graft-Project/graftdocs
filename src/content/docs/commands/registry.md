---
title: Registry Management
description: Managing your local registry of remote servers.
---

Graft keeps a local registry of your servers, allowing you to reference them by a simple name instead of an IP address and SSH key path every time.

Your registry is stored locally in `~/.graft/registry.json`.

### `graft registry ls`
List all servers currently saved in your local registry.
```bash
graft registry ls
```

### `graft registry add`
Interactively add a new server to your registry. You will be prompted for:
*   **Host IP**: The address of the remote server.
*   **Port**: SSH port (default 22).
*   **User**: SSH username.
*   **Key Path**: Path to your private SSH key.
*   **Registry Name**: A friendly name to refer to this server (e.g., `prod-us`).

```bash
graft registry add
```

### `graft registry <name> del`
Remove a server from your registry by its name.
```bash
graft registry my-server del
```

### Global Registry Mapping (`-r`, `--registry`)
When you use a registry name in any Graft command (e.g., via the `-r` flag), Graft automatically retrieves the correct SSH credentials to target that specific remote server from your registry. This is essential for operations that aren't tied to a specific local project directory.

---

### Remote Operations

#### List projects on a server
Inspect what projects are running on a specific host without being in their local directories.
```bash
graft -r prod-us projects ls
```

#### Pull a project from a server
If you are on a new machine, you can "pull" an existing project from a remote server to set up your local development environment instantly.
```bash
graft -r prod-us pull my-awesome-project
```

#### SSH & Remote Commands
Execute terminal commands directly on a server in your registry.
```bash
graft -r prod-us -sh "uptime"
```
