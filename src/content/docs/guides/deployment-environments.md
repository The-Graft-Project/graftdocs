---
title: Deployment Environments
description: Manage multiple deployment targets like dev, staging, and production.
---

Graft allows you to manage multiple isolated deployment environments for a single project. This is ideal for testing features in a `dev` or `staging` environment before pushing to `production`.

:::note
By default, the environment is `prod` or `production`. If an environment is not explicitly mentioned in a command, Graft defaults to this production environment.
:::

### Creating a New Environment

To create a new deployment environment, use the `env` command with the `--new` flag:

```bash
graft env --new <name>
# or
graft -p env --new <name>
```

**Interactive Setup:**
When you create a new environment, Graft will guide you through an interactive setup process:
1. **Host Configuration**: Specify the remote server IP and SSH details for this environment.
2. **Host Setup**: Graft performs necessary server-side preparations (Docker installation, folder structure).
3. **Webhook Integration**: Prepare a unique `graft-hook` for this environment.
4. **Git Branch Connection**: Connect the environment to a specific Git branch (e.g., `dev` branch for the `dev` environment).

---

### Running Commands in an Environment

Once an environment is set up, you can run any Graft command against it by prefixing the command with `env <name>`.

```bash
graft env <name> <command>
# or
graft -p env <name> <command>
```

#### Examples

**Synchronize a specific environment:**
```bash
graft env dev sync
```

**View logs for the webhook in an environment:**
```bash
graft env staging hook logs graft-hook
```

**Run any graft command:**
```bash
graft env dev ls
graft env staging ps
```

> [!TIP]
> Graft also supports passing through commands to the remote server, including `docker compose` commands via `graft env <name> compose ...`.

---

### Environment Separation

Each environment is completely isolated:
- Different remote servers (optional).
- Different webhooks.
- Different Git branches.
- Different environment variables (see [Environment Variables](/guides/environment-variables)).
