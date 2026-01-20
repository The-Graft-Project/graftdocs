---
title: Environment Variables & Secrets
description: Handle environment-specific configurations and secrets securely.
---

Graft provides a flexible way to manage environment variables and secrets by automatically filtering and applying `.env` files based on your active deployment environment.

### Naming Conventions

Graft looks for environment files in your project root or specified paths and maps them to environments based on their suffix.

| File Pattern | Usage |
| :--- | :--- |
| `.env` | Primary configuration (often used for `main` or `production`). |
| `.env.dev` | Applied when using the `dev` environment (`graft env dev ...`). |
| `.env.staging` | Applied when using the `staging` environment. |
| `.env.<name>` | Applied when using the environment named `<name>`. |

### Configuration in `graft-compose.yml`

You can specify your environment files in the `env_file` section of your `graft-compose.yml`. Graft will automatically select the correct file based on the environment you are targeting.

```yaml
# example graft-compose.yml
services:
  web:
    image: my-app
    env_file:
      - .env            # Used for main/production env
      - path/.env.prod  # Used for main/production env
      - path/.env.dev   # Used for development environment
      - path/.env.name  # Used for the environment named 'name'
```

### How it Works

When you run a command like `graft env dev sync`, Graft:
1. Identifies that you are targeting the `dev` environment.
2. Filters the `env_file` list to find files matching `.env.dev`.
3. Merges these variables with the base configuration.
4. Securely pushes the resulting environment to the remote server.

### Secrets Management

Graft treats all variables in your `.env` files as secrets. When you perform a `graft sync`, these variables are:
- **Never committed** to your repository (ensure they are in `.gitignore`).
- **Encrypted** during transit.
- **Stored securely** on the remote server, accessible only to your Docker containers.

> [!IMPORTANT]
> Always add your `.env` files to `.gitignore` to prevent sensitive credentials from leaking into your source control.
