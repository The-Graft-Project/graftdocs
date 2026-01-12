---
title: Monitoring Commands
description: View logs and monitor deployment activities.
---

### `graft logs <service>`
Stream live logs from a specific service.

```bash
graft logs backend
```
Press `Ctrl+C` to stop.

---

### `graft hook logs`
Monitor the `graft-hook` service logs on the remote server. 

```bash
graft hook logs
```
This is extremely useful for debugging CI/CD pipeline failures or build errors that happen on the server.
