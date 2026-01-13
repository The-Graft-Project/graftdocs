---
title: Automatic CI/CD
description: How to use Graft Hook for automated deployments and CI/CD.
---

Graft Hook is primarily used to enable automated deployments triggered by external services like GitHub Actions.

### Automated Setup

Graft Hook is automatically configured when you choose a **Git-based deployment mode** during `graft init` or via `graft mode`.

If Graft Hook is not yet installed on your server, Graft will:
1.  Detect its absence.
2.  Prompt you for a webhook domain (e.g., `hook.yourdomain.com`).
3.  Automatically deploy and configure it with SSL via Traefik.

### Webhook Payload Structure

The Graft Hook expects a JSON payload containing metadata about the deployment. This structure allows the hook to correlate the incoming request with your project settings on the server.

#### Payload Fields

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`project`** | String | The normalized name of your Graft project. |
| **`repository`** | String | The name of your source repository. |
| **`token`** | String | A short-lived security token (like `secrets.GITHUB_TOKEN`) provided by the CI/CD runner. |
| **`user`** | String | The user or actor triggering the deployment (e.g., GitHub username). |
| **`type`** | String | The deployment type, typically `image` for GHCR/DockerHub or `repo` for server builds. |
| **`registry`** | String | The container registry being used (e.g., `ghcr.io`, `docker.io`, `registry.gitlab.com`). |

---

### Deployment Request

Graft Hook is platform-agnostic and can be triggered from **anywhere** (GitHub Actions, GitLab CI, Bitbucket Pipelines, or even a local cURL command) by sending a POST request to your hook endpoint.

#### Request Template
Use this structure to build your integration:

```bash
curl -X POST https://your-hook-domain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "project": "your-project-name",
    "repository": "your-repo-name",
    "token": "your-runner-token",
    "user": "actor-name",
    "type": "image/repo",
    "registry": "ghcr.io" # or docker.io, registry.gitlab.com, etc.
  }'
```

:::note[Security Tip]
The `token` sent in the JSON payload **must** be a short-lived security token generated automatically by your CI/CD platform. This ensures that even if a request is intercepted, the token will expire shortly after the deployment.

*   **GitHub Actions**: Use `${{ secrets.GITHUB_TOKEN }}`.
*   **GitLab CI/CD**: Use `$CI_JOB_TOKEN`.
:::

:::tip[Provider Matching]
For full automatic authentication, your CI/CD provider and Container Registry must match:
*   **GitHub Actions** ↔ `ghcr.io`
*   **GitLab CI** ↔ `registry.gitlab.com`

If you are using a separate registry (e.g., GitHub Actions with Docker Hub), you must use the [Manual CI/CD Configuration](/graft-hook/manual-setup).
:::

#### GitHub Workflow Example
If your project is named `your-project` and your hook is at `webhook.yourdomain.com`:

```bash
curl -X POST https://webhook.yourdomain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "project": "your-project",
    "repository": "${{ github.event.repository.name }}",
    "token": "${{ secrets.GITHUB_TOKEN }}",
    "user": "${{ github.actor }}",
    "type": "image",
    "registry": "ghcr.io"
  }'
```

---
#### GitLab CI Example
If your project is on GitLab and your hook is at `webhook.yourdomain.com`:

```yaml
deploy:
  script:
    - |
      curl -X POST https://webhook.yourdomain.com/webhook \
        -H "Content-Type: application/json" \
        -d "{
          \"project\": \"your-project\",
          \"repository\": \"$CI_PROJECT_NAME\",
          \"token\": \"$CI_JOB_TOKEN\",
          \"user\": \"$GITLAB_USER_LOGIN\",
          \"type\": \"image\",
          \"registry\": \"registry.gitlab.com\"
        }"
```

---

### CI/CD Integration
Graft automatically generates a GitHub Actions workflow template in `.github/workflows/graft-deploy.yml` when using Git modes. This template uses the request structure shown above to notify your server of new builds.

### Monitoring Logs

You can monitor the activities of the Graft Hook in real-time to debug deployment issues:

```bash
graft hook logs
```

The logs will show authentication attempts, project matching, and the status of concurrent deployment tasks.
