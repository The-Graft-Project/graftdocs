---
title: Project Scope
description: Using the project flag to run commands from any directory.
---

Graft is designed to be location-agnostic. While you usually run commands from within a specific project directory, the **Project Scope** flag allows you to manage your deployments from anywhere on your machine.

### Project Scoping (`-p`, `--project`)

The project flag tells Graft which project context to use. Instead of looking for a `.graft` folder in your current directory, Graft retrieves the project metadata and remote connection details from its global registry.

#### Examples:

**Deploy from anywhere:**
```bash
graft -p my-awesome-project sync
```

**Check service status:**
```bash
graft -p my-awesome-project ps
```

**View remote logs:**
```bash
graft -p my-awesome-project logs --tail=50
```

**Restart a specific service:**
```bash
graft -p my-awesome-project restart web
```

---

### Why use Project Scope?

1.  **Quick Management**: No need to `cd` into multiple project folders to check status or restart services.
2.  **Automation**: Easily script Graft commands in your local automation tools without worrying about the working directory.
3.  **Global Access**: Manage your entire fleet of projects from a single terminal session.
