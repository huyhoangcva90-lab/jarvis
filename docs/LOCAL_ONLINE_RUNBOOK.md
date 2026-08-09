# J-Core local and online runbook

## 1. Local setup

```powershell
pnpm install
Copy-Item .env.example .env.local
notepad .env.local
```

Run the gateway:

```powershell
pnpm run gateway
```

Run the web UI:

```powershell
pnpm run dev
```

Set the Gateway URL in J-Core to:

```text
http://127.0.0.1:8787
```

## 2. Production gateway

Only expose the J-Core gateway, not Hermes/OpenClaw/9Router/Claude directly.

```env
JCORE_GATEWAY_HOST=0.0.0.0
JCORE_GATEWAY_PORT=8787
JCORE_GATEWAY_TOKEN=<long-random-token>
JCORE_CORS_ORIGIN=https://jarvis.huykl.id.vn
JCORE_DASHBOARD_SESSION_TTL_MS=1800000
```

The gateway refuses to start on `0.0.0.0` without `JCORE_GATEWAY_TOKEN`.

Use a private tunnel when possible:

- Cloudflare Tunnel + Access for public domain access.
- Tailscale/Funnel for private personal access.
- Ngrok only for short testing.

## 3. Hermes-first chat

Default production profile:

```env
HERMES_BASE_URL=http://127.0.0.1:8642
HERMES_HEALTH_URL=http://127.0.0.1:8642/v1/models
HERMES_CHAT_URL=http://127.0.0.1:8642/v1/chat/completions
HERMES_API_KEY=<matches-hermes-api-server-key>
HERMES_MODEL=hermes-agent
HERMES_DEFAULT_PROFILE=jarvis
HERMES_ALLOWED_PROFILES=jarvis
HERMES_MULTIPLEX_PROFILES=false
HERMES_SESSION_MODE=web
HERMES_SESSION_ID=jarvis-web-primary
HERMES_SESSION_KEY=agent:jarvis:web:dm:owner
```

The UI sends the active Hermes profile with `/api/hermes/chat`. Profile switching in the UI changes the orb palette and persists the selected profile locally.

## 4. OpenClaw, 9Router and Claude

```env
OPENCLAW_BASE_URL=http://127.0.0.1:18789
OPENCLAW_HEALTH_URL=http://127.0.0.1:18789/v1/models
OPENCLAW_CHAT_URL=http://127.0.0.1:18789/v1/chat/completions
OPENCLAW_TASK_URL=
OPENCLAW_MODEL=openclaw/default

NINEROUTER_BASE_URL=http://127.0.0.1:20128
NINEROUTER_HEALTH_URL=http://127.0.0.1:20128/v1/models
NINEROUTER_CHAT_URL=http://127.0.0.1:20128/v1/chat/completions
NINEROUTER_MODEL=Code

CLAUDE_BASE_URL=http://127.0.0.1:3001
CLAUDE_HEALTH_URL=http://127.0.0.1:3001/health
CLAUDE_CHAT_URL=
```

Dashboard diagnostics use `POST /api/system/dashboard-command` with an allowlist. This gives the UI real status/model/task checks without exposing an unrestricted shell.

## 5. Ubuntu Files and Obsidian

```env
JCORE_WORKSPACE_ROOT=/srv/j-core
JCORE_OBSIDIAN_ROOT=/home/<ubuntu-user>/Documents/ObsidianVault
```

The gateway returns relative paths only. It skips dotfiles, secrets, symlinks and oversized files. File viewing is read-only.

## 6. Terminal modes

Safe broker mode is the default:

```env
JCORE_TERMINAL_ENABLED=true
JCORE_TERMINAL_PRIVATE_MODE=false
JCORE_TERMINAL_SHELL=/bin/bash
JCORE_TERMINAL_TIMEOUT_MS=10000
JCORE_TERMINAL_OUTPUT_LIMIT=262144
JCORE_MANAGED_SERVICES=j-core-gateway,hermes,openclaw,9router
JCORE_HERMES_CLI=jarvis
JCORE_OPENCLAW_CLI=openclaw
JCORE_CLAUDE_CLI=claude
```

Broker commands include:

- `help`, `pwd`, `roots`
- `ls`, `cat`, `find`
- `system uptime|disk|memory`
- `service <name> status`, `logs <name> [lines]`
- `hermes status|doctor|sessions|cron`
- `openclaw status|doctor|models|tasks`
- `claude version`
- `9router models`

Private shell mode is for a trusted Ubuntu gateway only:

```env
JCORE_TERMINAL_PRIVATE_MODE=true
JCORE_TERMINAL_SHELL=/bin/bash
```

When the UI toggle `Private Ubuntu shell` is enabled, commands go to:

```text
POST /api/system/private-terminal
```

Do not enable private shell on a public gateway unless it is behind strong access control.

## 7. Verify

```bash
curl -H "Authorization: Bearer $JCORE_GATEWAY_TOKEN" \
  https://jarvisidhuykl.huykl.id.vn/health
```

At least one chat service should show:

```json
{ "online": true, "configured": true }
```

Every response includes `x-request-id`; use it to match UI errors with gateway logs.
