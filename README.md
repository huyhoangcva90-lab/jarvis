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

The online console uses `https://jarvisidhuykl.huykl.id.vn` as its default gateway.
Hermes chat, OpenClaw tasks, 9Router chat, and health checks all go through that
gateway. Configure the Ubuntu service with `.env.local`; never put upstream API
keys in the React app.

See `docs/LOCAL_ONLINE_RUNBOOK.md` for the full local and online setup.
