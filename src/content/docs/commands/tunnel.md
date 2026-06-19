---
title: Tunnel
description: Tunnel remote container ports to your local machine over SSH.
---

`graft host tunnel` forwards a remote container's port to your local machine, letting you connect to any running service as if it were local.

### `graft host tunnel <container> :<localport>`

```bash
graft host tunnel backend :8080            # tunnel backend API
graft host tunnel frontend :3000           # tunnel frontend dev server
graft host tunnel worker :9090             # tunnel any service
graft -r azure tunnel backend :8080        # via registry
```

**What it does:**
1. Connects to the remote server over SSH.
2. Auto-detects the container's exposed port. If multiple ports are exposed, prompts you to pick one.
3. Forwards the remote port to `localhost:<localport>`.

If `:<localport>` is omitted, uses the same port as the container.

```bash
# Omit local port — uses container's exposed port
graft host tunnel graft-postgres
```

**Use with any local tool** — database GUIs, API clients, browsers, or your app's dev config pointing at `localhost`.

---

### `graft db <name> serve`

For Postgres databases created with `graft db init`, the [`db serve`](/commands/infrastructure/#graft-db-name-serve) command is a shortcut that also prints credentials from `.graft/secrets.env`.
