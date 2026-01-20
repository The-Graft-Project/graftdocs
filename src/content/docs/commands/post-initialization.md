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
Graft uses Traefik for automated SSL and routing. By default, Graft provides the `${GRAFT_DOMAIN}` environment variable which contains the primary domain defined during initialization.

**Standard Host Rule:**
```yaml
services:
  web:
    labels:
      - "traefik.http.routers.myapp.rule=Host(`${GRAFT_DOMAIN}`)"
      - "traefik.http.services.myapp.loadbalancer.server.port=80"
```

**Subdomain Routing:**
You can easily add subdomains by prefixing the `${GRAFT_DOMAIN}` variable:
```yaml
      - "traefik.http.routers.admin.rule=Host(`admin.${GRAFT_DOMAIN}`)"
```

**Path-Based Reverse Proxy:**
If you want to route based on a URL path:
```yaml
      - "traefik.http.routers.api.rule=Host(`${GRAFT_DOMAIN}`) && PathPrefix(`/api`)"
```

#### 3. Environment Variables & Secret Management
You can define environment variables directly or, preferably, point to an `.env` file. Graft will securely sync these to your production server during synchronization.

```yaml
services:
  web:
    env_file:
      - .env
```

---

### Full Demo Example

Here is a comprehensive `graft-compose.yml` example showing a typical frontend and backend setup with subdomains, path-based routing, and volume optimizations.

```yaml
# Docker Compose Configuration for: gorest
# Domain: rest.docusup.com
# Deployment Mode: git-images

version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    
    env_file:
      - .env
    
    labels:
      - "graft.mode=git-images"
      - "traefik.enable=true"

      # Router & Priority
      - "traefik.http.routers.gorest-frontend.rule=Host(`${GRAFT_DOMAIN}`)"
      - "traefik.http.routers.gorest-frontend.priority=1"

      # Service Destination (Internal Port)
      - "traefik.http.routers.gorest-frontend.service=gorest-frontend-service"
      - "traefik.http.services.gorest-frontend-service.loadbalancer.server.port=3000"
      
      # HTTPS Configuration
      - "traefik.http.routers.gorest-frontend.entrypoints=websecure"
      - "traefik.http.routers.gorest-frontend.tls.certresolver=letsencrypt"
    
    networks:
      - graft-public
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    
    env_file:
      - .env
      # - .env.db
    
    labels:
      - "graft.mode=git-images"
      - "traefik.enable=true"

      # Router with Subdomain & Path
      - "traefik.http.routers.gorest-backend.rule=Host(`admin.${GRAFT_DOMAIN}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.gorest-backend.priority=10"
      
      # Middleware to strip /api prefix
      - "traefik.http.middlewares.gorest-backend-strip.stripprefix.prefixes=/api" 
      - "traefik.http.routers.gorest-backend.middlewares=gorest-backend-strip" 
      
      - "traefik.http.routers.gorest-backend.service=gorest-backend-service"
      - "traefik.http.services.gorest-backend-service.loadbalancer.server.port=5000"
      
      - "traefik.http.routers.gorest-backend.entrypoints=websecure"
      - "traefik.http.routers.gorest-backend.tls.certresolver=letsencrypt"
    
    networks:
      - graft-public
    restart: unless-stopped

# Persistent volumes (Optional)
# volumes:
#   npm-cache:
#   go-mod-cache:

networks:
  graft-public:
    external: true  # Created by 'graft host init'
```

---

### What's Next?
Once your `graft-compose.yml` is configured, you're ready to deploy your project using the `graft sync` command.
