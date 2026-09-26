---
title: Tunnel
description: Tunnel remote container ports to your local machine over SSH.
---

`graft host tunnel` forwards a remote container's port to your local machine, letting you connect to any running service as if it were local.

### `graft host tunnel <container> [-port <remote>:<local>]`

```bash
graft host tunnel backend -port 5000:8080     # container port 5000 → localhost:8080
graft host tunnel frontend -port 3000         # container port 3000 → localhost:3000
graft host tunnel graft-postgres              # auto-detect the exposed port
graft -r azure tunnel backend -port 5000:8080 # via registry
```

The port mapping is passed with `-port` (or `--port`):

| Form | Remote port | Local port |
|------|-------------|------------|
| `-port 5000:8080` | 5000 | 8080 |
| `-port 3000` | 3000 | 3000 |
| omitted | auto-detected | same as remote |

:::caution
Use `-port`, not `-p`. `-p` is the project flag (`graft -p <project> ...`), and a bare `:8080` is not recognized either — an unrecognized port argument is silently ignored and the tunnel falls back to the container's own port on both sides.
:::

**What it does:**
1. Connects to the remote server over SSH.
2. Looks up the container's IP on the Docker network.
3. Auto-detects the container's exposed port when `-port` is omitted. If several ports are exposed, prompts you to pick one.
4. Forwards the remote port to your local port and holds the tunnel open until you press Ctrl+C.

Because the remote port is how Graft finds the service, there is no way to choose a local port without naming the remote one too. To reach a container's port 5000 on local port 8080, write `-port 5000:8080`.

**Use with any local tool** — database GUIs, API clients, browsers, or your app's dev config pointing at your local port.

:::note
The tunnel listens on `0.0.0.0`, not only `127.0.0.1`, so it is reachable from other machines on your network for as long as it is open. Pick a port accordingly, and stop the tunnel when you are done.
:::

The SSH connection behind the tunnel is self-healing: if it drops, Graft reconnects without tearing down your local listener, so you can open a tunnel once and leave it running.

---

### `graft db <name> serve`

For Postgres databases created with `graft db init`, the [`db serve`](/commands/infrastructure/#graft-db-name-serve) command is a shortcut that also prints credentials from `.graft/secrets.env`.

Note that `db serve` takes a bare `:port` for the local port — `graft db myapp serve :5433` — which is a different syntax from the `-port` flag used by `host tunnel`.
