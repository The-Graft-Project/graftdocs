---
title: DNS Mapping Commands
description: Automatically manage Cloudflare DNS records for your services.
---

### `graft map`
Automatically map all service domains to Cloudflare DNS records.

```bash
graft map
```

**What it does:**
1. Parses `graft-compose.yml` to extract all Traefik `Host()` rules.
2. Detects the server's public IP address.
3. Prompts for Cloudflare API credentials (saved for future use).
4. Checks if DNS records exist and prompts to create or update them to point to the server IP.

**Requirements:**
- Cloudflare API Token with DNS edit permissions.
- Zone ID for your domain.
- Services must have Traefik labels with `Host()` rules.

---

### `graft map service <service-name>`
Map DNS records for a specific service only.

```bash
graft map service backend
```
