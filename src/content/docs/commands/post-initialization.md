---
title: Post-Initialization
description: Configuring your project after running graft init.
---

After running `graft init`, your project is ready for configuration. The most important step is setting up your `graft-compose.yml` file.

### Configuring graft-compose.yml

The `graft-compose.yml` is the heart of your project context. It tells Graft how to build, route, and manage your services on the remote server.

#### 1. Define Services
Copy your service definitions from your local `docker-compose.yml` into `graft-compose.yml`. Ensure you include the necessary build context or image names.

```yaml
services:
  web:
    build: .
    # or
    # image: myapp:latest
```

#### 2. Routing with Traefik Labels
Graft uses Traefik for automated SSL and routing. Follow the standard label pattern to expose your services:

```yaml
services:
  web:
    labels:
      - "traefik.http.routers.myapp.rule=Host(`app.yourdomain.com`)"
      - "traefik.http.services.myapp.loadbalancer.server.port=80"
```

#### 3. Environment Variables & Secret Management
You can define environment variables directly or point to an `.env` file. Graft will securely sync these to your production server.

```yaml
services:
  web:
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/dbname
      # or use env_file
    env_file:
      - .env.production
```

:::tip
Recommended Practice: Keep your environment files in a dedicated `./env` directory within your project. Graft will securely transfer these files directly to the target server during synchronization. Remember to exclude sensitive environment files from version control while letting Graft handle the production transfer.
:::

---

### What's Next?
Once your `graft-compose.yml` is configured, you're ready to deploy your project using the `graft sync` command.
