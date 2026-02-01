---
title: Docker Passthrough
description: Execute Docker commands directly on your remote infrastructure using Graft.
---

Graft provides a powerful "passthrough" capability that allows you to execute native `docker` commands directly on your remote servers. This eliminates the need to manually SSH into a server to perform maintenance, debugging, or advanced operations.

When you use the passthrough feature, Graft wraps your command and executes it as `sudo docker <your-command>` on the target host.

## Targeting Methods

You can use passthrough commands in several ways depending on your context:

### 1. By Registry Name
Target any server in your global registry, regardless of your current directory.

```bash
graft -r <registry-name> <docker-command>
```

### 2. By Current Project Host
Target the server where your current project (in the current directory) is deployed.

```bash
graft host <docker-command>
```

### 3. By Project Name
Target a specific project's host from anywhere, using the project flag.

```bash
graft -p <project-name> host <docker-command>
```

### 4. By Environment
Target a specific environment's host for a project.

```bash
graft -p <project-name> env <env-name> host <docker-command>
```

---

## Common Use Cases

### Docker Login
Authenticate with a private container registry on your remote server. This is useful if your deployment requires pulling images from a private repository.

```bash
# Log in to Docker Hub or a private registry on the remote host
graft -r vps login --username myuser --password-stdin < my_password.txt
# Or simply
graft -r vps login
```


### General Debugging
Perform standard Docker operations for debugging.

```bash
# View running containers
graft host ps

# Follow logs for a specific container
graft host logs -f <container-id>

# Prune unused data
graft host system prune
```
