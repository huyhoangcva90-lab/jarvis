# J-Core Console

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

## Gateway

The public web app is served from `https://jarvis.huykl.id.vn`.
The online console uses `https://jarvisidhuykl.huykl.id.vn` as its default gateway.
Hermes chat, OpenClaw tasks, 9Router chat, and health checks all go through that
gateway. Configure the Ubuntu service with `.env.local`; never put upstream API
keys in the React app.

The main web chat is Hermes-first and uses the `jarvis` profile with
server-controlled session continuity. See `docs/HERMES_FIRST_ARCHITECTURE.md`
for the routing contract, Telegram-session mode, Ubuntu checklist, and staged
Mission Control backlog.

See `docs/LOCAL_ONLINE_RUNBOOK.md` for the full local and online setup.
