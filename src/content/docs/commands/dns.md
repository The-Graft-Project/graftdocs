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
3. Prompts for Cloudflare API credentials (saved securely for future use).
4. Synchronizes DNS records by pointing them to your server's public IP.

---

### How to Get Your Cloudflare API Token

To use Zero-Config DNS, you need an API Token with specific permissions. **Do not use your Global API Key.**

**Steps to create a token:**
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **My Profile** > **API Tokens**.
3.  Click **Create Token**.
4.  Use the **Edit zone DNS** template.
5.  **Permissions**: Ensure it has `Zone - DNS - Edit`.
6.  **Zone Resources**: Select `Include - Specific zone` or `Include - All zones`.
7.  Copy the generated token and keep it safe. Graft will prompt for this the first time you run `graft map`.

:::tip
You can find your **Zone ID** on the Overview page of your domain in the Cloudflare dashboard (right sidebar).
:::

---

### `graft map service <service-name>`
Map DNS records for a specific service only.

```bash
graft map service backend
```
