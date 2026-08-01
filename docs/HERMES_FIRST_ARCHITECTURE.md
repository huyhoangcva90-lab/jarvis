# Hermes-first architecture and rollout plan

Status: implemented in J-Core Gateway; Ubuntu activation still requires the
Hermes service and Cloudflare tunnel to be online.

Normative words `MUST`, `SHOULD`, and `MAY` follow RFC 2119 semantics.

## 1. Objective

The main J-Core web chat MUST use the Hermes profile `jarvis`. 9Router,
OpenClaw, and Claude remain explicit tools and diagnostics; they MUST NOT
silently replace Hermes in the main chat. The generic `/api/ai/chat` endpoint
is Hermes-first for legacy clients and only falls back after a real Hermes
failure.

The web chat uses the same Hermes session primitives as Telegram:

- `X-Hermes-Session-Id` continues one transcript from `state.db`.
- `X-Hermes-Session-Key` keeps a stable long-term-memory scope across
  transcript rotations.
- The browser never receives either raw value. J-Core Gateway injects both
  headers from `.env.local` after Jarvis-token authentication.

## 2. Standards and security baseline

- Secrets MUST live in Ubuntu `.env.local` or the Hermes profile `.env`; they
  MUST NOT be committed or sent to the React application.
- Hermes MUST bind to loopback. Only J-Core Gateway may be exposed by the
  Cloudflare tunnel.
- `HERMES_API_KEY` MUST match Hermes `API_SERVER_KEY`; Hermes requires API-key
  authentication before it accepts session-continuation headers.
- Profile names MUST pass a strict identifier check and an environment-backed
  allowlist. They are never interpolated from arbitrary browser input.
- Gateway responses MUST use `Cache-Control: no-store`, request IDs, explicit
  CORS origins, and circuit-breaker diagnostics.
- Mission Control SHOULD consume authenticated Hermes HTTP APIs. It MUST NOT
  expose `state.db`, profile `.env` files, or direct filesystem paths to the
  public browser.
- Destructive configuration, session deletion, and secret editing MUST require
  a separate confirmation flow before they are added to the web console.

## 3. Routing contract

| Web action | Gateway route | Upstream |
| --- | --- | --- |
| Main chat | `POST /api/hermes/chat` | Hermes `jarvis` profile |
| Legacy AI chat | `POST /api/ai/chat` | Hermes first; controlled fallback |
| Hermes direct test | `POST /api/hermes/chat` | Selected allowlisted profile |
| 9Router chat/admin | `/api/9router/*`, proxied dashboard | 9Router |
| OpenClaw task | `POST /api/openclaw/task` | OpenClaw |
| Claude test | `POST /api/claude/chat` | Local Claude bridge |

Hermes' active/default profile uses the ordinary
`/v1/chat/completions` endpoint. Secondary profiles use
`/p/<profile>/v1/chat/completions` only when
`HERMES_MULTIPLEX_PROFILES=true` and Hermes multiplexing is enabled.

## 4. Session modes

### Dedicated web session (default)

```env
HERMES_SESSION_MODE=web
HERMES_SESSION_ID=jarvis-web-primary
HERMES_SESSION_KEY=agent:jarvis:web:dm:owner
```

This behaves like a persistent Telegram DM but keeps the web transcript
separate. It is the safest initial configuration.

### Exact Telegram transcript

1. In Telegram, use `/topic` inside the relevant topic to display its binding,
   or run `hermes sessions list --source telegram` on Ubuntu.
2. Record the exact session ID on Ubuntu; do not paste it into browser storage.
3. Set:

```env
HERMES_SESSION_MODE=telegram
HERMES_SESSION_ID=<existing-telegram-session-id>
HERMES_SESSION_KEY=<existing-telegram-session-key>
```

4. Restart `j-core-gateway` and send one harmless test from web, then verify the
   reply appears in the same Hermes transcript. The web request does not send a
   Telegram message; it continues the same Hermes session database record.

If Telegram DM Topics are enabled, Hermes can also bind a Telegram topic to an
existing session with `/topic <session-id>`.

## 5. Ubuntu configuration checklist

Create and configure the main profile using official Hermes profile commands:

```bash
hermes profile create jarvis --description "J-Core owner orchestrator"
jarvis setup
jarvis gateway install
jarvis gateway start
jarvis doctor
```

The `jarvis` profile owns its own `config.yaml`, `.env`, `SOUL.md`, memory,
skills, cron jobs, and `state.db`. Configure the API server on loopback port
`8642` and set a strong `API_SERVER_KEY`. Then configure J-Core:

```env
HERMES_BASE_URL=http://127.0.0.1:8642
HERMES_HEALTH_URL=http://127.0.0.1:8642/v1/models
HERMES_CHAT_URL=http://127.0.0.1:8642/v1/chat/completions
HERMES_API_KEY=<same-value-as-Hermes-API_SERVER_KEY>
HERMES_MODEL=hermes-agent
HERMES_DEFAULT_PROFILE=jarvis
HERMES_ALLOWED_PROFILES=jarvis,cadence-content,code-architect,security-auditor
HERMES_MULTIPLEX_PROFILES=false
```

Verification gates:

```bash
curl -H "Authorization: Bearer $API_SERVER_KEY" http://127.0.0.1:8642/health/detailed
curl -H "Authorization: Bearer $JCORE_GATEWAY_TOKEN" http://127.0.0.1:8787/api/hermes/capabilities
curl -H "Authorization: Bearer $JCORE_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Reply only: jarvis-session-ok"}' \
  http://127.0.0.1:8787/api/hermes/chat
```

## 6. Mission Control scope adopted from the referenced tutorials

The useful subset is:

1. One owner-facing Orchestrator (`jarvis`).
2. Optional isolated specialist profiles.
3. Persistent session and long-term-memory scope.
4. Read-only service health, model, capability, agent, task, and cron views.
5. Activity/status logging with retention.
6. A chat surface attached to a real Hermes session.

The following are intentionally excluded from the core rollout: carousel
rendering, Buffer publishing, image hosting, Supabase, a second Python data
server, paid templates, and auto-installers. They do not help the core Jarvis
chat path and would duplicate or overwrite existing services.

## 7. Backlog after the core connection is healthy

### Phase A — read-only Mission Control

- Session list, title, source, last activity, token usage, and history preview.
- Active runs, tool lifecycle, approval-needed state, and stop action.
- Cron schedule/status and recent execution result.
- Profile inventory and health without displaying secrets.
- Agent activity feed derived from Hermes APIs, not raw public files.

### Phase B — controlled operations

- Create/fork/rename a Hermes session.
- Hand off a web session to Telegram and resume it later.
- Approve/deny pending Hermes runs with explicit confirmation.
- Switch models through Hermes' authenticated model-options surface.

### Phase C — optional specialist fleet

- Create `cadence-content`, `code-architect`, and `security-auditor` as real
  Hermes profiles only when their isolated memory/tool boundaries are needed.
- Give each profile a separate `SOUL.md`, workspace, API policy, and bot token
  where a messaging gateway is required.
- Enable multiplex routing only after profile isolation tests pass.

## 8. Acceptance criteria

- Main web chat reports `source=hermes` and `profile=jarvis`.
- Two consecutive web messages continue the configured Hermes session.
- With Telegram mode enabled, web and Telegram resolve to the same session ID.
- A missing Hermes API key disables continuity instead of exposing history.
- A profile outside the allowlist returns HTTP 400.
- A secondary profile with multiplexing disabled returns HTTP 409.
- Gateway smoke tests cover headers, profile URL routing, Hermes-first routing,
  auth, CORS, 9Router session proxy, and native management API.

## 9. References

- Hermes sessions: <https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md>
- Hermes API server: <https://github.com/NousResearch/hermes-agent/blob/main/gateway/platforms/api_server.py>
- Hermes profiles: <https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/profiles.md>
- Hermes programmatic integration: <https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/programmatic-integration.md>
- Mission Control tutorial: <https://komputermechanic.com/tutorials/hermes-mission-control>
- Cadence content-machine tutorial: <https://komputermechanic.com/tutorials/content-creation-machine>
