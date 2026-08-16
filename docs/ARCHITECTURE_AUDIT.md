# JARVIS Architecture Audit

**Audit date:** 2026-08-16  
**Scope:** current repository only. No runtime machine was accessed and no application behavior was changed.

## 1. Current architecture

J-Core/JARVIS is a Vite + React 19 frontend with Three.js/R3F visual scenes. The main browser entry point is `index.dev.html` / `src/main.tsx`; a separate tracker entry point is `tracker.html`. The production build is emitted to `dist/` by `scripts/build-pages.mjs` and Vite.

`server/gateway.mjs` is a single Node HTTP server that currently combines:

- static production asset serving from `JCORE_WEB_ROOT` (default: `dist/`);
- username/password login and in-memory HttpOnly sessions;
- authenticated REST API routes;
- proxying to local AI services;
- workspace, Obsidian, configuration-editor, and terminal broker APIs;
- the authenticated terminal WebSocket at `/ws/terminal`; and
- three extra native-dashboard proxy servers, on ports 9120, 18790, and 20129 by default.

The intended Ubuntu topology is represented by systemd units in `deploy/ubuntu/`:

- `j-core.service`: J-Core Node gateway on port 8787.
- `hermes-dashboard.service`: Hermes dashboard on loopback port 9119.
- `openclaw.service`: OpenClaw gateway/UI on loopback port 18789, with its own `--auth none` setting.
- `9router.service`: 9Router on loopback port 20128 with API-key requirement enabled.

The frontend remains capable of an older static-host deployment. `src/utils/gatewayClient.js` selects an externally configured/default gateway for GitHub Pages, `file:` previews, and `jarvis.huykl.id.vn`; settings retain a gateway URL and optional bearer token in browser storage.

## 2. Current request flow

### Same-origin appliance path (already implemented)

```text
Browser
  -> J-Core gateway :8787
       -> serves / and compiled assets from dist/
       -> /api/* (authenticated)
       -> /ws/terminal (ticket-authenticated WebSocket)
       -> loopback Hermes / OpenClaw / 9Router / optional Claude bridge
```

When the app records `auth.sessionMode = "same-origin"`, `gatewayFetch()` uses `window.location.origin`, sends cookies, and does not send a configured gateway token. The gateway has SPA fallback behavior: paths without file extensions fall back to `dist/index.html`.

### Legacy split-origin path (still implemented)

```text
Browser hosted by GitHub Pages/static host
  -> configured/default external J-Core gateway URL
       -> local AI services
```

In this mode the UI can send `Authorization: Bearer <gateway token>`. It stores the token in sessionStorage or localStorage and includes a configurable gateway URL in UI settings. This is contrary to the required final browser contract, but it is current behavior and must be removed only in a dedicated migration phase.

### AI request routes

All documented service calls go through `server/gateway.mjs` rather than directly from React:

| Browser route | Current upstream behavior |
| --- | --- |
| `POST /api/hermes/chat` | Hermes OpenAI-compatible chat endpoint, with allowed profile and server-side Hermes session headers. |
| `POST /api/ai/chat` | Hermes first; falls back to configured 9Router, OpenClaw, then Claude endpoints using circuit breakers. |
| `POST /api/openclaw/task` | Optional configured OpenClaw task endpoint. |
| `POST /api/9router/chat` | Configured 9Router OpenAI-compatible chat endpoint. |
| `POST /api/claude/chat` | Optional local Claude HTTP bridge, not Claude Code itself. |
| `GET /health` | Probes all four configured service health endpoints. |

Chat is request/response JSON. No SSE endpoint was found. The only first-party WebSocket is the private terminal PTY; native dashboard WebSocket upgrades are proxied by the separate native-dashboard proxy servers.

## 3. Current authentication flow

1. `AuthScreen` posts username/password to `POST /api/auth/login` at the page origin.
2. The gateway compares credentials using a timing-safe hash comparison, rate-limits failures by remote address (five attempts per 15 minutes), then creates an in-memory `jcore_session` ID.
3. The browser receives an HttpOnly cookie. It is `Secure; SameSite=Strict` only when `X-Forwarded-Proto` is `https`; otherwise it is `SameSite=Lax` without `Secure`.
4. `authorized()` accepts either a valid browser session or the optional `Authorization: Bearer JCORE_GATEWAY_TOKEN` header.
5. Session entries are held only in the gateway process memory and expire after `JCORE_AUTH_SESSION_TTL_MS`; restarting the service invalidates all sessions.

The same-origin session model satisfies the desired interaction model. The legacy bearer-token path and frontend gateway-token controls do not.

## 4. Current gateway flow

The gateway defaults to `127.0.0.1:8787`, reads `.env.local`, and refuses startup only if *both* `JCORE_AUTH_PASSWORD` and `JCORE_GATEWAY_TOKEN` are absent. It permits CORS according to `JCORE_CORS_ORIGIN` (default `*`).

Local upstream defaults are:

- Hermes: `http://127.0.0.1:8642`
- OpenClaw: `http://127.0.0.1:18789`
- 9Router: `http://127.0.0.1:20128`
- Claude bridge: `http://127.0.0.1:3001`

Upstream API keys remain server environment variables. Hermes profile allowlisting, session continuity headers, health probes, circuit breakers, optional local STT/TTS, safe workspace APIs, configuration editing, and terminal command allowlists are all implemented in this gateway.

9Router has two dashboard mechanisms:

- `POST /api/session/9router` establishes a temporary upstream session and returns same-origin `/dashboard`.
- `GET /api/native-dashboards` returns three separately ported proxy URLs for Hermes, OpenClaw, and 9Router. Those proxies require the J-Core session, but are not on the primary origin/path contract.

## 5. Current production/development assumptions

### Development machine

`npm run dev` runs Vite on loopback and opens `index.dev.html`. `npm run gateway` runs the Node gateway locally. Current development instructions therefore assume both processes exist on the developer machine and, for live integrations, a reachable configured gateway. This conflicts with the requested Dev Machine rule if the UI is used against production services; the migration must define a safe mock/offline development profile and ensure no production secrets or service URLs are needed locally.

### Ubuntu runtime

Two installers exist:

- `scripts/install-ubuntu.sh` performs a per-user install under `~/.local/share/j-core-console` and creates a user service.
- `scripts/provision-ubuntu-runtime.sh` assumes a `jcore` user, copies to `/opt/j-core-console`, builds using OpenClaw's bundled Node runtime, creates root-managed systemd services, and writes `/home/jcore/.config/j-core/j-core.env`.

Both build the frontend and set `JCORE_WEB_ROOT` to the compiled `dist/`; therefore production same-origin serving is already supported. The latter provisioner defaults the gateway to loopback unless `JCORE_LAN_ADDRESS` is supplied. There is no Cloudflare Tunnel configuration, service unit, or deployment script in this repository.

## 6. Existing AI service integrations

| Service | Integration status | Notes |
| --- | --- | --- |
| Hermes | Implemented | Health, capability/model/profile discovery, chat, profile multiplexing, server-managed session headers, and optional STT/TTS. |
| OpenClaw | Implemented | Health/models, optional task and chat endpoint, allowlisted CLI diagnostics, and native dashboard proxy. The Ubuntu unit binds its upstream to loopback. |
| 9Router | Implemented | Health/models, OpenAI-compatible chat, server-held API key, upstream dashboard-login bridge, and native dashboard proxy. Its Ubuntu upstream binds to loopback. |
| Claude / Claude Code | Partial | Gateway can probe an optional local HTTP bridge and proxy an optional chat route; command broker can run the `claude` CLI. No bridge implementation is present, and Claude Code does not itself provide the configured HTTP server. |
| Obsidian | Implemented | Read-only note collection through `GET /api/obsidian/notes`, using a configured local vault root. |
| Notion | Not implemented | Only a direct `https://www.notion.so/` tool URL and profile prompt text/reference were found. No credentials, server route, webhook, or API client exists. |
| Karen | Not found | No source, environment variable, route, script, or documentation integration was found. |

## 7. Problems with the current architecture

1. **Two competing deployment models.** Documentation and frontend code still support GitHub Pages/static hosting plus a manually entered remote gateway/token, while the desired model is one authenticated origin.
2. **Secrets/tokens can reach browser storage in legacy mode.** The optional gateway bearer token is retained in sessionStorage/localStorage and exposed in settings UI. This violates the target user experience and creates avoidable client-side secret exposure.
3. **Extra public-facing proxy ports.** When `JCORE_GATEWAY_HOST=0.0.0.0`, the three native dashboard proxies bind the same address at 9120/18790/20129. Their upstreams remain private, but these ports are additional internet/LAN entry points and do not meet the required single-origin `https://jarvis.example.com/*` boundary.
4. **Cloudflare Tunnel is not codified.** The repository documents Cloudflare Tunnel but contains no `cloudflared` configuration/unit, ingress rule, hostname policy, or verification procedure.
5. **Production config disagreement.** `.env.example`/runbook describe Hermes at port 8642 and OpenAI-style API URLs; the root provisioner writes Hermes dashboard port 9119 as the Hermes base and health endpoint without configuring `HERMES_CHAT_URL`. This can make Hermes chat unavailable after a fresh provision. The provisioner also points the 9Router configuration editor at a SQLite file, while the editor accepts only text configuration extensions.
6. **Risky runtime defaults.** The root provisioner enables `JCORE_TERMINAL_PRIVATE_MODE=true`, exposing an interactive shell through an authenticated browser session. This needs explicit production gating before a tunnel is opened.
7. **In-memory sessions and login-rate tracking.** Gateway restart invalidates all sessions. Multi-instance deployment would not work without shared session storage or explicit stickiness; neither is currently needed for a single workstation but the limitation should be documented.
8. **CORS remains broader than necessary.** The default is `*`, and legacy cross-origin support drives complexity. A single-origin tunnel should eliminate CORS for normal browser traffic.
9. **No streaming chat transport.** Current AI chat is buffered JSON; terminal WebSocket support does not provide token streaming. This is not a blocker for the target boundary but must be preserved/handled when streaming is added later.
10. **Documentation is stale/inconsistent.** `docs/J_CORE_AI_ARCHITECTURE.md` still describes GitHub Pages and Ollama, and README names public/default gateway domains. Those assumptions conflict with the requested self-hosted personal AI OS.
11. **Notion/Karen are not represented as server-owned integrations.** The stated workstation integrations exist outside this repository audit; JARVIS currently has no verified server contract for either.

## 8. Target architecture

```text
Internet
  -> Cloudflare Tunnel (HTTPS, WebSocket-capable)
       -> JARVIS server on Ubuntu (loopback listener is preferred)
            -> /                 compiled JARVIS frontend
            -> /api/*            authenticated JARVIS backend/broker
            -> /ws/*             authenticated JARVIS WebSockets
            -> loopback-only Hermes / OpenClaw / 9Router / Claude bridge
            -> server-side Notion / Karen integrations
```

The browser talks only to `https://jarvis.example.com`. It receives an HttpOnly session cookie from JARVIS and never receives upstream URLs, upstream API keys, a gateway URL, or a gateway token. Cloudflare Tunnel is the only externally reachable transport; the JARVIS gateway and every internal AI service should be loopback-only or otherwise firewall-restricted to the Ubuntu workstation.

The existing Node gateway is a valid starting point for the JARVIS server. The target does **not** require replacing Hermes or OpenClaw, changing the visual identity, introducing World Monitor, or adding the Infinity Stone architecture.

## 9. Files that need to change

These are proposed future migration targets, not changes made by this audit.

| File | Required future change |
| --- | --- |
| `server/gateway.mjs` | Make the single primary server/path surface authoritative; retire separately exposed native-dashboard ports or mount approved proxies below same-origin paths; narrow CORS; harden session/CSRF/tunnel trust boundaries; preserve existing API behavior. |
| `src/utils/gatewayClient.js` | Remove static-host gateway selection/default external URL and bearer-token request path after same-origin cutover. |
| `src/utils/storage.js` | Remove persisted gateway URL/token state and migration compatibility after the frontend no longer supports split origin. |
| `src/components/orb/HudOverlay.tsx` | Remove gateway URL/token settings controls while retaining service status and existing UI identity. |
| `src/components/AuthScreen.jsx` | Remove static-preview credential fallback once static hosting is retired; retain the existing login visual treatment. |
| `.env.example` | Define the Ubuntu-only, same-origin, loopback-only production contract; remove obsolete cross-origin values and document Cloudflare-derived headers. |
| `scripts/install-ubuntu.sh` | Align the lightweight installer with the approved production architecture, without assuming services exist on the Dev Machine. |
| `scripts/provision-ubuntu-runtime.sh` | Correct Hermes endpoint/config assumptions, disable private terminal by default, stop generating unsuitable 9Router config editor paths, and add only the required runtime integration hooks. |
| `deploy/ubuntu/j-core.service` | Apply hardened service settings and finalized environment locations. |
| `deploy/ubuntu/*.service` | Verify actual Hermes/OpenClaw/9Router executable/config contracts and preserve loopback binding. |
| New Cloudflare deployment artifacts | Add a least-privilege `cloudflared` configuration/systemd unit and deployment documentation only after the hostname/access policy is chosen. |
| `README.md`, `docs/LOCAL_ONLINE_RUNBOOK.md`, `docs/J_CORE_AI_ARCHITECTURE.md`, `docs/HERMES_FIRST_ARCHITECTURE.md` | Consolidate into the Dev Machine vs AI Workstation model and remove stale GitHub Pages/Ollama/default-domain claims. |
| `scripts/smoke-gateway.mjs`, `scripts/doctor-gateway.sh`, `scripts/verify-local-modes.mjs` | Update automated checks from dual-mode assumptions to the final same-origin tunnel contract. |

## 10. Files that should NOT be changed in this migration

Unless a narrowly required compatibility fix is discovered, keep these feature/identity areas untouched:

- Visual system and scene components: `src/realms/**`, `src/core/**`, `src/styles.css`, and existing JARVIS HUD components.
- Existing user-facing product features, including chat, voice fallback, workspace/Obsidian panels, terminal broker, service dashboards, and current persistence unrelated to gateway credentials.
- World Monitor code/assets (`src/components/orb/WorldMonitorHub.tsx`, `external/worldmonitor/**`, and related assets): no new work or redesign in this migration.
- Infinity Stone/agent-orchestration components (`src/components/InfinityStoneNode.jsx`, `src/utils/stoneState.jsx`, and related realm material): no new architecture work in this migration.
- Hermes, OpenClaw, and 9Router products/configuration semantics beyond the minimum endpoint/binding corrections required to connect the existing installations safely.

## 11. Migration plan in small phases

### Phase 0 — Freeze and verify the current baseline

- Run the existing typecheck, build, gateway smoke test, and read-only gateway doctor checks.
- Record the AI Workstation's actual Hermes, OpenClaw, 9Router, Claude bridge, Notion, and Karen endpoint/credential ownership without copying secrets into Git.
- Confirm the current production hostname and Cloudflare Access policy decision.

**Exit criterion:** an agreed configuration matrix distinguishes Dev Machine from AI Workstation and lists each real loopback upstream.

### Phase 1 — Define the production boundary

- Make one Ubuntu JARVIS listener the Cloudflare Tunnel origin (prefer `127.0.0.1:8787`).
- Add Cloudflare Tunnel configuration/service with exactly one public hostname routed to the JARVIS listener.
- Confirm all Hermes/OpenClaw/9Router/Claude listeners remain loopback-only and firewall rules expose no native service ports.

**Exit criterion:** remote access reaches only JARVIS via the tunnel; port scans from outside cannot reach internal AI services.

### Phase 2 — Normalize same-origin application serving

- Make JARVIS static serving from `dist/` the supported production path.
- Preserve all existing API routes under `/api/*` and terminal traffic under `/ws/*`.
- Correct installer/provisioner endpoint assumptions against the actual existing workstation services.

**Exit criterion:** a freshly deployed workstation serves frontend, login, health, and existing service panels from one origin.

### Phase 3 — Remove browser gateway configuration

- Remove manual gateway URL/token controls and storage only after Phase 2 passes.
- Remove static-host fallback routing/auth behavior and update frontend request code to relative paths with cookies.
- Retain the existing login presentation and all unrelated UI settings.

**Exit criterion:** a new browser profile can log in and use existing JARVIS functions without entering any URL, code, token, local service address, or API key.

### Phase 4 — Collapse auxiliary dashboard exposure

- Replace the separate native-dashboard proxy ports with same-origin, authenticated path proxies where technically compatible, or keep native dashboards available only from local workstation administration.
- Verify WebSocket upgrades and iframe policies through Cloudflare if a same-origin embedded dashboard is retained.

**Exit criterion:** public tunnel ingress contains no service-specific ports; all browser-accessible dashboards are under the JARVIS hostname.

### Phase 5 — Harden server/session operations

- Narrow/remove CORS for the one-origin flow; use explicit host/origin validation for state-changing routes and WebSockets.
- Choose session persistence behavior appropriate for a single workstation and document restart semantics.
- Disable private shell by default; require an explicit local-only/strong-access operational decision to enable it.
- Add safe logging, backup/rollback, and service health behavior without logging secrets.

**Exit criterion:** security controls are documented and tested for login, logout, expired sessions, Cloudflare HTTPS, and terminal restriction.

### Phase 6 — Integrate existing workstation-only Notion/Karen contracts

- First audit the existing workstation integrations and their credential ownership.
- Add server-owned adapters/routes only after their allowed actions and consent requirements are specified.

**Exit criterion:** JARVIS can use approved integrations without exposing their secrets or direct URLs to the browser.

## 12. Risks

- Cloudflare Tunnel may forward request metadata differently from direct local access; cookie `Secure` behavior and origin/host validation must be tested with the real tunnel.
- Existing native dashboards may use absolute URLs, cookies, WebSockets, CSP, or redirects that make path mounting non-trivial.
- Current provisioning assumptions do not prove the installed Hermes HTTP API contract; changing them without workstation inspection could break chat.
- The private terminal is powerful enough that an authentication/tunnel misconfiguration becomes a host compromise risk.
- Removing legacy static-host support can affect existing bookmarks and GitHub Pages deployments; provide a planned cutover/redirect or explicit decommission notice.
- Profile switching currently affects both UI state and Hermes routing; profile allowlists must remain server-authoritative.
- Notion/Karen requirements are underspecified in this repository. Implementing them before their workstation contracts are audited risks duplicating or bypassing established integrations.

## 13. Verification plan

For each migration phase, test on both machines with a clean browser profile.

1. **Build and baseline:** `pnpm run typecheck`, `pnpm run build`, `pnpm run test:gateway`, and `pnpm run doctor:gateway` (where the environment supports the shell script).
2. **Same origin:** open `/`, login, request `/api/auth/session`, call `/health`, and confirm browser network traffic uses only the JARVIS hostname for first-party APIs and WebSockets.
3. **No browser secrets:** inspect page source/bundles, browser storage, settings UI, and request headers. Confirm no gateway URL/token/upstream key or local service URL is present.
4. **Tunnel:** through the real Cloudflare hostname, verify HTTPS, secure HttpOnly cookie issuance, login/logout/session expiry, SPA deep links, and `/ws/terminal` upgrade behavior.
5. **Service isolation:** from an external network, confirm Hermes, OpenClaw, 9Router, Claude bridge, and native-dashboard ports are not directly reachable. From JARVIS, verify authenticated health/chat/diagnostic paths still work.
6. **Feature regression:** verify existing Hermes chat/profiles/voice fallback, OpenClaw controls, 9Router chat/dashboard behavior, Claude diagnostics, Obsidian, workspace operations, terminal broker, and visual scenes without changing their identity.
7. **Failure and rollback:** stop each upstream in turn and confirm clean gateway errors/circuit behavior; verify systemd restart behavior; retain the prior known-good deployment artifact and environment backup for rollback.

## Conclusion

The repository is already materially closer to the requested architecture than its older static-host documentation suggests: it can serve the compiled frontend, API, authentication cookie, and terminal WebSocket from the same Node server/origin. The migration should consolidate that existing path, eliminate browser-configured gateway credentials, prevent auxiliary proxy ports from becoming public ingress, and codify Cloudflare Tunnel plus the actual Ubuntu service contracts. No implementation changes were made as part of this audit.
