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

### `graft registry del <name>`
Remove a server from your registry by its name. You will be asked to confirm.
```bash
graft registry del my-server
```

If the server you delete was the [default registry](#default-registry), the default is cleared at the same time, so it can never point at a registry that no longer exists.

### Global Registry Mapping (`-r`, `--registry`)
When you use a registry name in any Graft command (e.g., via the `-r` flag), Graft automatically retrieves the correct SSH credentials to target that specific remote server from your registry. This is essential for operations that aren't tied to a specific local project directory.

---

## Default Registry

Typing `-r <name>` every time gets repetitive when you mostly work against one server. Marking a registry as the default lets you drop the flag for work outside a project directory.

### `graft -default <name>`
Mark a registry as the default.

```bash
graft -default vps
```

```
✅ Default registry set to 'vps' (root@31.97.114.213)
   Commands run outside a project directory will target this server.
```

### `graft -default`
Report the current default. `graft registry ls` also marks the default row with `*`.

```bash
graft -default
```

### How the fallback works

When a command has **no `-r`, no `-p`, and no project in the current directory**, Graft runs exactly what `graft -r <default> <command>` would have run:

```bash
cd ~/scratch          # no .graft here

graft ps              # same as: graft -r vps ps
graft -sh "uptime"    # same as: graft -r vps -sh "uptime"
graft stats           # same as: graft -r vps stats
```

Graft says so when it does this, so you always know which server a command landed on:

```
🌐 No project here - using default registry 'vps'
🚀 Executing on 'vps': sudo docker ps
```

:::note
A project in the current directory always wins. Inside a project, `graft ps` still targets that project's own server and runs `docker compose` in its remote directory — the default registry changes nothing there.
:::

Explicit scoping also wins: `-r` and `-p` both take precedence, so the default applies only when nothing else has scoped the command.

### Commands that never fall back

`init`, `pub`, `projects` and `registry` already work without a project, so they are never redirected — `graft init` stays `graft init` wherever you run it.

Commands that genuinely need a project, such as `sync` and `map`, are handed to the default registry like anything else, which means they fail there exactly as `graft -r <name> sync` would. Use `-p <project>` when you mean to act on a project from outside its directory.

:::tip
The default is stored as a top-level `"default"` key in `~/.graft/registry.json`. Point it elsewhere with another `graft -default <name>`, or clear it by deleting that registry.
:::

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

### Docker Passthrough
Directly execute `sudo docker` commands on your remote registry. Graft acts as a wrapper, passing your command arguments straight to the Docker CLI on the remote server.

```bash
graft -r <registryname> <command>
```

**Examples:**
```bash
# List containers
graft -r vps ps

# View docker stats
graft -r vps stats

# Stop a container (subshell example)
graft -r vps stop $(docker ps -q)
```
