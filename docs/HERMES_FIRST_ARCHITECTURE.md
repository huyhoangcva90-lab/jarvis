# Hermes-first architecture

Status: active specification for J-Core Console.

J-Core Console is a single web dashboard for talking to a local AI profile and controlling the AI services running on the Ubuntu gateway host. The UI must not be a static mock. Every operational dashboard should either call a real local API/CLI through `server/gateway.mjs` or clearly report that the upstream is not configured.

## Core contract

- Main chat and voice always route through Hermes first.
- Default Hermes profile is `jarvis`.
- The active Hermes profile is stored by the client and sent with chat/test requests.
- The 3D orb reflects the active profile and activity state: `idle`, `listening`, `thinking`, `speaking`.
- 9Router, OpenClaw and Claude are secondary service dashboards behind the same gateway.
- Browser code never receives raw local filesystem paths, shell secrets or upstream API keys.

## Gateway routes

| Feature | Route | Target |
| --- | --- | --- |
| Hermes chat | `POST /api/hermes/chat` | Hermes OpenAI-compatible chat endpoint |
| Hermes profiles | `GET /api/hermes/profiles` | Gateway profile allowlist |
| Hermes capabilities | `GET /api/hermes/capabilities` | Hermes models/capabilities |
| OpenClaw task | `POST /api/openclaw/task` | OpenClaw task endpoint |
| OpenClaw diagnostics | `POST /api/system/dashboard-command` | `openclaw status/doctor/models/tasks` allowlist |
| 9Router chat | `POST /api/9router/chat` | 9Router chat endpoint |
| 9Router native dashboard | `POST /api/session/9router` + `/dashboard` | Gateway-authenticated iframe proxy |
| Claude chat | `POST /api/claude/chat` | Claude local bridge |
| Claude diagnostics | `POST /api/system/dashboard-command` | `claude version/status` allowlist |
| Ubuntu files | `GET /api/workspace/*` | Safe local filesystem reader |
| Obsidian vault | `GET /api/obsidian/notes` | Safe Markdown vault reader |
| Terminal broker | `POST /api/system/terminal` | Safe read-only command catalog |
| Private terminal | `POST /api/system/private-terminal` | Gated Ubuntu shell mode |

## Security baseline

- `JCORE_GATEWAY_TOKEN` is required whenever the gateway listens beyond localhost.
- Browser requests must use `Authorization: Bearer <token>` when a token is configured.
- Secrets stay in Ubuntu `.env.local` or service-specific configuration.
- Workspace APIs return relative paths only.
- Terminal broker rejects shell metacharacters and write/delete/restart/stop operations.
- Private shell is disabled by default and only works when `JCORE_TERMINAL_PRIVATE_MODE=true` on Linux.

## Hermes profile behavior

Production default:

```env
HERMES_DEFAULT_PROFILE=jarvis
HERMES_ALLOWED_PROFILES=jarvis
HERMES_MULTIPLEX_PROFILES=false
```

Additional profiles can be enabled only after their memory scope, tool policy and access rights are separated on the Hermes side.

## Acceptance criteria

- Login asks only for username and password, default `admin` / `123456`.
- Chat and voice use the active Hermes profile.
- Hermes/OpenClaw/9Router/Claude panels call real gateway routes.
- Terminal commands run on the Ubuntu gateway host, either through the safe broker or gated private shell.
- Library and Obsidian panels read configured local directories.
- Orb visual state follows Hermes profile and voice/chat activity.
