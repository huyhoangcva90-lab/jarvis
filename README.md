# J-Core Console

## Ubuntu local appliance

Sau khi Windows đã bật WSL và khởi động lại, mở Ubuntu rồi chạy:

```bash
bash /mnt/d/test/j-core-console/scripts/install-ubuntu.sh
```

Installer hỏi tài khoản/mật khẩu J-Core, build giao diện và chạy một user service tại `http://127.0.0.1:8787`. Giao diện và server dùng cùng origin; đăng nhập tạo cookie HttpOnly nên không cần nhập URL hoặc API token. Các dashboard Hermes, OpenClaw, 9Router và Claude có editor ghi vào đúng file được khai báo bởi `JCORE_*_CONFIG_PATH`.

A browser-based personal AI console inspired by fictional supercomputer and mission-control interfaces.

## Run Locally

Install Node.js, then run:

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build

```bash
npm run build
```

The production files will be generated in `dist/`.

## Production

JARVIS is intended to run as a self-hosted Ubuntu appliance:

```text
Internet -> Cloudflare Tunnel -> JARVIS server -> local AI services
```

The production server builds and serves the frontend from `dist/`, exposes
backend routes at `/api/*`, and keeps WebSocket traffic under `/ws/*` on the
same origin. The browser should only talk to JARVIS and should never receive
gateway URLs, upstream service URLs, API keys, or service tokens.

Configure the Ubuntu service with `.env.local` or
`/home/jcore/.config/j-core/j-core.env`. Hermes chat, OpenClaw tasks, 9Router
chat, Claude bridge calls, health checks, and dashboard diagnostics all go
through the JARVIS server. Keep Hermes, OpenClaw, 9Router, Claude, Notion, and
Karen credentials server-side on the AI Workstation.

The main web chat is Hermes-first and uses the `jarvis` profile with
server-controlled session continuity. See `docs/HERMES_FIRST_ARCHITECTURE.md`
for the routing contract, Telegram-session mode, Ubuntu checklist, and staged
Mission Control backlog.

See `docs/LOCAL_ONLINE_RUNBOOK.md` for the full Dev Machine and AI Workstation
setup.
