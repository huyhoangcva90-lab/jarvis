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

## 8. Bật phản hồi AI thật

J-Core gửi hội thoại tới `/api/ai/chat`. Gateway thử lần lượt:

1. Hermes (`HERMES_CHAT_URL`)
2. OpenClaw (`OPENCLAW_CHAT_URL`)
3. 9Router (`NINEROUTER_CHAT_URL`)
4. Claude bridge (`CLAUDE_CHAT_URL`)

Chỉ cần ít nhất một endpoint chat hoạt động là J-Core có thể trả lời. OpenClaw
có endpoint tương thích OpenAI nhưng mặc định bị tắt. Bật bằng:

```bash
openclaw config set gateway.http.endpoints.chatCompletions.enabled true
openclaw gateway restart
```

Sau đó cấu hình `OPENCLAW_CHAT_URL=http://127.0.0.1:18789/v1/chat/completions`
và `OPENCLAW_MODEL=openclaw/default`. `OPENCLAW_TASK_URL` vẫn dành cho một
endpoint nhiệm vụ riêng nếu bạn tự cài thêm.

Ví dụ cấu hình tối thiểu nếu 9Router cung cấp API tương thích OpenAI:

```env
NINEROUTER_BASE_URL=http://127.0.0.1:20128
NINEROUTER_HEALTH_URL=http://127.0.0.1:20128/v1/models
NINEROUTER_CHAT_URL=http://127.0.0.1:20128/v1/chat/completions
NINEROUTER_API_KEY=<token-tao-trong-dashboard>
NINEROUTER_MODEL=<model-id-trong-dashboard>
```

Claude Code CLI không tự mở HTTP API. Không cho gateway public chạy trực tiếp
lệnh shell `claude`. Nếu cần dùng Claude Code, hãy dựng một local bridge có xác
thực ở `127.0.0.1`, sau đó mới điền `CLAUDE_*`.

Sau khi sửa `.env.local` trên Ubuntu:

```bash
git pull origin main
sudo systemctl restart j-core-gateway
curl https://jarvisidhuykl.huykl.id.vn/health
```

Kết quả sẵn sàng phải có ít nhất một dịch vụ chat với:

```json
{ "online": true, "configured": true }
```
