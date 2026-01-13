---
title: Manual CD (Graft Projects)
description: Trigger automated deployments for your existing Graft projects using native webhooks.
---

This guide is for users who have already initialized a project via `graft init` and want to set up direct deployment pings without using CI/CD runners. 

By using the **project-based** trigger, Graft Hook automatically resolves the project path and configuration from your server's index.

---

## 1. Required Tokens

You need a persistent token that Graft Hook uses to pull your code or images.

### Personal Access Token (PAT)
1. In GitHub: **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
2. Generate a token with `repo` (for builds) or `read:packages` (for image pulls) scope.

---

## 2. Server Secrets

Configure the Graft Hook environment variables on your server:

```env
GIT_PAT_TOKEN=your_pat_token_here
DOCKER_ACCESS_TOKEN=your_reg_token_here
DOCKER_USER=your_username
DOCKER_REGISTRY=ghcr.io
```

---

## 3. Webhook URL Structure

Connect your repository directly to the Graft Hook using the **project** identifier.

**Payload URL Template:**
`https://your-hook-url.com/webhook?mode=image&project=YOUR_PROJECT_NAME`

:::important
Graft Hook requires query parameters to be **alphabetically sorted** by their keys before calculating the HMAC signature. For example, `mode` (m) must come before `project` (p).
:::

- **`mode`**: Either `image` (pull pre-built) or `repo` (build on server).
- **`project`**: The name of the project you initialized with Graft.

---

## 4. GitHub Setup

1. Repository **Settings** > **Webhooks** > **Add webhook**.
2. **Payload URL**: Use the structure above.
3. **Content type**: `application/json`.
4. **Secret**: Use your `GIT_PAT_TOKEN` or `DOCKER_ACCESS_TOKEN` (provided as HMAC secret).
5. **Trigger**: Push events.

---

## 5. Manual Trigger (cURL)

If you want to trigger the deployment manually from your terminal or a custom script, you can build the request like this:

```bash
# 1. Alphabetical Order: 'mode' (m) comes before 'project' (p)
QUERY="mode=image&project=your-project"

# 2. Key: Use DOCKER_ACCESS_TOKEN for image mode, GIT_PAT_TOKEN for repo mode
SECRET="YOUR_SECRET_TOKEN"

# 3. Sign the alphabetical string
SIGNATURE=$(echo -n "$QUERY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# 4. Send the request
curl -X POST "https://webhook.yourdomain.com/webhook?$QUERY" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE"
```

:::note
If you are not using Graft but still want to use Graft Hook for your deployments, please see the [Standalone (Non-Graft)](/graft-hook/standalone) documentation.
:::
