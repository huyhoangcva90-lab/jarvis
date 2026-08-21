# JARVIS self-hosted runbook

> Runtime workstation hiện tại dùng repository `/home/huykl/jarvis`, branch
> `main` và system service `jarvis.service`. Quy trình vận hành chuẩn nằm tại
> [`WORKSTATION_OPERATIONS.md`](WORKSTATION_OPERATIONS.md). Các mục cài đặt bên
> dưới mô tả lựa chọn bootstrap cho máy mới.

JARVIS is a personal AI OS with two separate machines:

- DEV MACHINE: Codex edits and commits this repository here. Do not assume
  Hermes, OpenClaw, 9Router, Claude Code, Notion, or Karen exist locally.
- Ubuntu AI WORKSTATION: production runtime. JARVIS runs here and talks to
  local/private AI services over loopback.

## 1. Development machine

Install dependencies and use Vite for UI development:

```powershell
pnpm install
pnpm run dev
```

The development frontend calls relative `/api/*` paths. For live service
testing, run the JARVIS server locally with a development `.env.local`, or test
against the Ubuntu workstation through its JARVIS origin. Do not put production
service URLs or API keys in frontend code.

## 2. Production topology

```text
Internet
  -> Cloudflare Tunnel
  -> http://127.0.0.1:8787 on Ubuntu AI WORKSTATION
  -> JARVIS frontend, /api/*, /ws/*
  -> loopback Hermes / OpenClaw / 9Router / Claude bridge
```

Only the JARVIS hostname should be public, for example:

- `https://jarvis.example.com/`
- `https://jarvis.example.com/api/*`
- `https://jarvis.example.com/ws/*`

Do not expose Hermes, OpenClaw, 9Router, Claude, or native dashboard proxy ports
through Cloudflare or the firewall.

## 3. Ubuntu install

From the repository checkout on the AI Workstation:

```bash
bash scripts/install-ubuntu.sh
```

For the root/systemd provisioner:

```bash
sudo bash scripts/provision-ubuntu-runtime.sh "$PWD"
```

Both scripts build `dist/` and configure the JARVIS server to serve the
production frontend and backend from the same origin.

## 4. Required server config

Copy `.env.example` to the server environment file and edit values on the AI
Workstation only:

```env
JCORE_GATEWAY_HOST=127.0.0.1
JCORE_GATEWAY_PORT=8787
JCORE_WEB_ROOT=/opt/j-core-console/dist
JCORE_PUBLIC_ORIGIN=https://jarvis.example.com
JCORE_AUTH_USERNAME=admin
JCORE_AUTH_PASSWORD=<strong-password>
JCORE_NATIVE_DASHBOARD_PROXY_HOST=127.0.0.1
JCORE_CORS_ORIGIN=
```

Keep upstream integrations loopback/private:

```env
HERMES_BASE_URL=http://127.0.0.1:8642
HERMES_CHAT_URL=http://127.0.0.1:8642/v1/chat/completions
OPENCLAW_BASE_URL=http://127.0.0.1:18789
NINEROUTER_BASE_URL=http://127.0.0.1:20128
CLAUDE_BASE_URL=http://127.0.0.1:3001
```

Store all service API keys in the server environment only.

## 5. Cloudflare Tunnel

Use `deploy/ubuntu/cloudflared-j-core.yml.example` as the starting point:

```yaml
ingress:
  - hostname: jarvis.example.com
    service: http://127.0.0.1:8787
  - service: http_status:404
```

The tunnel origin should be JARVIS only. Do not add ingress rules for Hermes,
OpenClaw, 9Router, Claude, or dashboard proxy ports.

## 6. Verify

Run from the repository:

```bash
pnpm run typecheck
pnpm run build
pnpm run test:self-hosted
pnpm run test:gateway
```

On the AI Workstation, also run:

```bash
pnpm run doctor:gateway
```

Then verify through the Cloudflare hostname:

- `/` serves the JARVIS UI.
- `/api/auth/login` issues an HttpOnly session cookie.
- `/api/auth/session` returns the logged-in user.
- `/health` requires that session and reports upstream status.
- Browser network traffic uses only the JARVIS hostname for app APIs and
  WebSockets.
- Built frontend assets contain no API keys, service tokens, or upstream
  workstation URLs.

