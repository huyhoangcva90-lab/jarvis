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

## 7. Cấu hình production hiện tại

Frontend mặc định dùng:

```text
https://jarvisidhuykl.huykl.id.vn
```

Trên Ubuntu, `JCORE_CORS_ORIGIN` phải chứa origin của GitHub Pages, không kèm
đường dẫn `/jarvis`:

```env
JCORE_GATEWAY_HOST=0.0.0.0
JCORE_GATEWAY_TOKEN=<device-token-dai-va-ngau-nhien>
JCORE_CORS_ORIGIN=https://huyhoangcva90-lab.github.io
```

Gateway sẽ từ chối khởi động trên `0.0.0.0` nếu chưa đặt
`JCORE_GATEWAY_TOKEN`. Đây là cơ chế fail-closed để tránh vô tình mở API ra
Internet mà không có xác thực.

Có thể cho phép cả local dev bằng danh sách phân cách bởi dấu phẩy:

```env
JCORE_CORS_ORIGIN=http://127.0.0.1:5173,https://huyhoangcva90-lab.github.io
```

Sau khi cập nhật code và `.env.local`, restart gateway rồi kiểm tra:

```powershell
curl.exe https://jarvisidhuykl.huykl.id.vn/health
```

`services.*.online` cho biết tiến trình upstream có chạy hay không.
`services.*.configured` cho biết gateway đã có URL chat/task thật hay chưa.
