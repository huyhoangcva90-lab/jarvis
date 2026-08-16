# Kien truc AI JARVIS

## Muc tieu

JARVIS la personal AI OS tu host tren Ubuntu AI WORKSTATION. Repository nay la
source code; production runtime nam tren workstation. Codex chay tren DEV
MACHINE va khong duoc gia dinh Hermes, OpenClaw, 9Router, Claude Code, Notion
hoac Karen co san tren may dev.

## Kien truc production

```text
Internet
  -> Cloudflare Tunnel
  -> JARVIS server tren Ubuntu
  -> frontend + backend cung origin
  -> Hermes / OpenClaw / 9Router / Claude bridge tren loopback
```

Trinh duyet chi noi chuyen voi JARVIS:

- `/`
- `/api/*`
- `/ws/*`

JARVIS server moi noi chuyen voi internal AI services. Khong expose truc tiep
Hermes, OpenClaw, 9Router, Claude bridge, hoac native dashboard ports ra
Internet.

## Core contract

- Frontend production duoc build vao `dist/` va serve boi `server/gateway.mjs`.
- Frontend API calls dung relative paths va cookie session same-origin.
- Nguoi dung khong can nhap gateway URL, gateway code, local service URL, hoac
  API key.
- Secrets va upstream credentials chi nam server-side.
- Hermes la duong chat chinh; OpenClaw, 9Router va Claude giu nguyen la
  integrations phia sau JARVIS.
- WebSocket terminal giu tai `/ws/terminal` voi ticket da xac thuc.

## Bao mat bat buoc

- Dang nhap JARVIS tao HttpOnly `jcore_session` cookie.
- Khong dua API key, service token, hay workstation-only secret vao React bundle
  hoac browser storage.
- CORS khong can cho production same-origin; chi bat cho dev cross-origin co chu
  dich.
- Native dashboard proxies mac dinh bind `127.0.0.1` va khong nam trong
  Cloudflare ingress.
- Private terminal mac dinh tat; chi bat khi workstation da duoc bao ve phu hop.

## Development

May dev co the chay Vite de phat trien UI, nhung khong duoc yeu cau local
Hermes/OpenClaw/9Router. Cac thay doi nen nho, co the verify, va khong redesign
cinematic JARVIS UI neu khong duoc yeu cau.

