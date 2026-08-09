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
HERMES_ALLOWED_PROFILES=jarvis,ev-personal
HERMES_MULTIPLEX_PROFILES=true
HERMES_SESSION_MODE=web
HERMES_SESSION_ID=jarvis-web-primary
HERMES_SESSION_KEY=agent:jarvis:web:dm:owner
```

The UI sends the active Hermes profile with `/api/hermes/chat`. Profile switching in the UI changes the orb palette and persists the selected profile locally.

J-Core now reads profile metadata from Hermes `/v1/profiles`. If the installed Hermes build does not expose that route, configure a safe fallback without adding secrets:

```env
HERMES_PROFILE_METADATA_JSON=[{"id":"jarvis","name":"Jarvis","palette":"orange","tags":["Memory"]},{"id":"ev-personal","name":"E.V","palette":"spider","tags":["Personal"]}]
HERMES_PROFILE_METADATA_TTL_MS=30000
```

Create the real isolated E.V profile before enabling Spider Mode chat:

```bash
hermes profile create ev-personal
hermes config set gateway.multiplex_profiles true
hermes gateway restart
```

E.V then uses its own profile directory, memory, tools and provider credentials. J-Core routes it through the multiplexed profile endpoint instead of treating a frontend persona as a separate agent.

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
JCORE_WORKSPACE_WRITE_ENABLED=true
```

The gateway returns relative paths only. It skips dotfiles, secrets, symlinks and oversized files. Text-file editing is enabled only when `JCORE_WORKSPACE_WRITE_ENABLED=true`; writes use conflict detection and an atomic same-directory replacement. Create/delete and binary writes are not exposed by this broker.

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

The non-streaming private command endpoint remains available for trusted diagnostics:

```text
POST /api/system/private-terminal
```

The focused Terminal dashboard also supports a real streamed PTY. The browser first requests an authenticated, one-time ticket from `POST /api/system/terminal/session`, then connects to `/ws/terminal`. The ticket expires after 60 seconds and the PTY session expires after 30 minutes by default:

```env
JCORE_TERMINAL_TICKET_TTL_MS=60000
JCORE_TERMINAL_SESSION_TTL_MS=1800000
```

PTY audit records session open/close time, remote address and input/output byte counts. It deliberately does not store command text because commands may contain secrets. Local browser console and direct Ubuntu Files remain the default mode.

Do not enable private shell on a public gateway unless it is behind strong access control.

## 7. Vietnamese voice pipeline

Without extra configuration, J-Core keeps using browser SpeechRecognition and speechSynthesis. To use local Ubuntu voice, point these variables at OpenAI-compatible Whisper and TTS endpoints:

```env
HERMES_STT_URL=http://127.0.0.1:9000/v1/audio/transcriptions
HERMES_STT_API_KEY=
HERMES_STT_MODEL=whisper-1
HERMES_TTS_URL=http://127.0.0.1:9001/v1/audio/speech
HERMES_TTS_API_KEY=
HERMES_TTS_MODEL=tts-1
HERMES_TTS_VOICE=alloy
```

The client records WebM/Opus, uses local VAD to stop after silence, transcribes as Vietnamese, routes the text through the active Hermes profile, and plays local TTS. If either service is absent, that half of the pipeline falls back to the browser automatically.

## 8. Verify

```bash
curl -H "Authorization: Bearer $JCORE_GATEWAY_TOKEN" \
  https://jarvisidhuykl.huykl.id.vn/health
```

At least one chat service should show:

```json
{ "online": true, "configured": true }
```

Every response includes `x-request-id`; use it to match UI errors with gateway logs.
