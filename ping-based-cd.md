# Ping-Based Continuous Delivery

Trigger automated deployments using lightweight webhook "pings". Graft Hook will use the information provided in the request to automatically perform either a `docker compose build` or a `docker compose pull` on the target server.

## Overview

This method allows you to trigger a deployment via a simple POST request with query parameters. Security is handled via HMAC-SHA256 signature verification.

## Server-Side Requirements

On the server where Graft Hook is running, the following environment variables must be configured:

- `GIT_PAT_TOKEN`: Your Git Personal Access Token (for `repo` mode).
- `DOCKER_ACCESS_TOKEN`: Your Docker Access Token or Password (for `image` mode).
- `DOCKER_USER`: Your Git/Docker username.
- `DOCKER_REGISTRY`: The registry URL (e.g., `ghcr.io`) for pulling images.

## Request Options (Query Parameters)

| Parameter | Required | Description |
|-----------|----------|-------------|
| `project` | Optional* | The project ID as defined in `projects.json`. |
| `path` | Optional* | The absolute file system path to the project directory (used if project is not in config). |
| `mode` | **Yes** | Use `repo` for git-based build or `image` for registry-based pull. |
| `versionstokeep` | Optional | Number of rolling backups to keep (default is 0). |
| `repository` | Optional | Legacy field (ignored by modern Graft Hook). |

*\* Either `project` or `path` must be provided to identify the target.*

## Authentication Header

Every request must include an HMAC-SHA256 signature calculated from the query string using the appropriate token as the secret.

**Header Name:** `X-Hub-Signature-256`  
**Format:** `sha256=<signature_hex>`

- Use `GIT_PAT_TOKEN` as secret for `mode=repo`
- Use `DOCKER_ACCESS_TOKEN` as secret for `mode=image`

## Deployment Modes

### 1. Repository Mode (`mode=repo`)
Graft Hook will use the server credentials to:
- Perform a git pull to the latest state.
- Run `docker compose up -d --build`.

### 2. Image Mode (`mode=image`)
Graft Hook will use the server credentials to:
- Log in to the configured Docker registry.
- Run `docker compose up -d --pull always`.

---

## Example Usage (GitHub Actions)

```bash
# Define the query string
QUERY_STRING="project=my-org/my-app&mode=image"

# Calculate the signature (using your secret token)
SIGNATURE=$(echo -n "${QUERY_STRING}" | openssl dgst -sha256 -hmac "${SECRET_TOKEN}" | sed 's/^.* //')

# Send the ping
curl -X POST "https://your-hook-url.com/webhook?${QUERY_STRING}" \
  -H "X-Hub-Signature-256: sha256=${SIGNATURE}"
```
