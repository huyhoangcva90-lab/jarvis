# J-Core local + online tunnel runbook

## 1. Clone về máy

```powershell
git clone https://github.com/huyhoangcva90-lab/jarvis.git
cd jarvis
pnpm install
```

## 2. Tạo file cấu hình local

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Điền URL thật của Hermes, OpenClaw và 9Router vào `.env.local`. Không commit file `.env.local`.

## 3. Chạy local gateway

Terminal 1:

```powershell
pnpm run gateway
```

Kiểm tra:

```powershell
Invoke-RestMethod http://127.0.0.1:8787/health
```

## 4. Chạy web local

Terminal 2:

```powershell
pnpm run dev
```

Mở URL Vite in ra. Trong Settings của J-Core, đặt:

- Gateway URL: `http://127.0.0.1:8787`
- Hermes: `http://127.0.0.1:8080`
- OpenClaw: `http://127.0.0.1:18789`
- 9Router: `http://127.0.0.1:9000`

## 5. Tunnel lên online

Khuyến nghị an toàn:

- Tailscale Funnel nếu chỉ bạn dùng.
- Cloudflare Tunnel + Access nếu muốn domain riêng và có login.
- Ngrok chỉ nên dùng test nhanh.

Không expose trực tiếp Hermes/OpenClaw/9Router ra Internet. Chỉ expose gateway `8787`, và nên bật `JCORE_GATEWAY_TOKEN`.

## 6. Luồng đúng

```text
Browser / Vercel web
  -> HTTPS tunnel
  -> J-Core Local Gateway
  -> Hermes / OpenClaw / 9Router trên máy local
```
