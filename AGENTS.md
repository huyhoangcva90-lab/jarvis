# JARVIS Agent Instructions

JARVIS is a personal AI OS. Treat this repository as the source code for that system, not as the production runtime itself.

## Machine Boundaries

- The DEV MACHINE and AI WORKSTATION are separate machines.
- Codex runs on the DEV MACHINE, where this repository is edited and committed.
- Production JARVIS runs on the Ubuntu AI WORKSTATION.
- GitHub is the source of truth for source code.
- Local AI services such as Hermes, OpenClaw, and 9Router belong to the production workstation.
- Never assume Hermes, OpenClaw, 9Router, Claude Code, Notion, Karen, or other production services exist on the development machine.

## Production Topology

Intended production flow:

```text
Internet
  -> Cloudflare Tunnel
  -> JARVIS server on Ubuntu AI WORKSTATION
  -> JARVIS frontend/backend
  -> private local AI services such as Hermes, OpenClaw, 9Router, and Claude
```

The browser talks only to JARVIS. JARVIS talks to internal AI services. Internal AI services must never be exposed directly to the Internet. Prefer a same-origin frontend/backend architecture:

- `https://jarvis.example.com/`
- `https://jarvis.example.com/api/*`
- `https://jarvis.example.com/ws/*`

## Security Rules

- Authentication belongs to the JARVIS server/session.
- Users should not need to enter gateway URLs, gateway codes, local service URLs, or AI API keys.
- Secrets must remain server-side.
- Never put API keys, service tokens, upstream credentials, or workstation-only secrets in frontend code.
- Keep internal service URLs and credentials out of browser storage and client-visible bundles.

## Engineering Rules

- Preserve the existing cinematic JARVIS visual identity.
- Do not redesign the UI unless explicitly requested.
- Do not remove existing features without explicit approval.
- Do not introduce unnecessary dependencies.
- Do not rewrite working integrations without a concrete reason.
- Make small, verifiable changes.
- Keep development-machine behavior safe when production services are unavailable.
- Run appropriate build, typecheck, smoke, or targeted tests before claiming a task is complete.

