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

Trên Ubuntu, `JCORE_CORS_ORIGIN` phải chứa origin của web J-Core và các origin
dev được phép, không kèm đường dẫn:

```env
JCORE_GATEWAY_HOST=0.0.0.0
JCORE_GATEWAY_TOKEN=<device-token-dai-va-ngau-nhien>
JCORE_CORS_ORIGIN=https://jarvis.huykl.id.vn
JCORE_DASHBOARD_SESSION_TTL_MS=1800000
```

Gateway sẽ từ chối khởi động trên `0.0.0.0` nếu chưa đặt
`JCORE_GATEWAY_TOKEN`. Đây là cơ chế fail-closed để tránh vô tình mở API ra
Internet mà không có xác thực.

Có thể cho phép cả local dev bằng danh sách phân cách bởi dấu phẩy:

```env
JCORE_CORS_ORIGIN=http://127.0.0.1:5173,https://jarvis.huykl.id.vn,https://huyhoangcva90-lab.github.io
```

Sau khi cập nhật code và `.env.local`, restart gateway rồi kiểm tra:

```powershell
curl.exe -H "Authorization: Bearer <jarvis-token>" https://jarvisidhuykl.huykl.id.vn/health
```

`services.*.online` cho biết tiến trình upstream có chạy hay không.
`services.*.configured` cho biết gateway đã có URL chat/task thật hay chưa.
`services.*.circuit.state` cho biết upstream đang `closed`, `degraded` hay
`open`. Mặc định circuit sẽ mở sau 3 lần lỗi liên tục và thử lại sau 30 giây;
có thể điều chỉnh bằng:

```env
JCORE_CIRCUIT_FAILURE_THRESHOLD=3
JCORE_CIRCUIT_OPEN_MS=30000
```

Mỗi response có header `x-request-id`; khi chat qua router thành công có thêm
`x-jcore-upstream` và `server-timing`. Dùng request ID hiển thị trong UI để
đối chiếu log gateway khi chẩn đoán lỗi.

## 8. Bật phản hồi AI thật

Cửa sổ chat chính gửi thẳng tới `/api/hermes/chat` và mặc định dùng Hermes
profile `jarvis`. Endpoint tương thích cũ `/api/ai/chat` cũng thử Hermes trước,
sau đó mới fallback theo thứ tự 9Router, OpenClaw và Claude bridge. Vì vậy một
lỗi Hermes không bị che giấu trong cửa sổ chat chính, còn client cũ vẫn có đường
phục hồi có kiểm soát.

Để Hermes giữ phiên giống Telegram, `HERMES_API_KEY` phải khớp
`API_SERVER_KEY` của Hermes. Chi tiết hai chế độ phiên web/Telegram và checklist
profile `jarvis` nằm trong `docs/HERMES_FIRST_ARCHITECTURE.md`.

OpenClaw
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
# Có thể để trống nếu 9Router chỉ bind loopback và REQUIRE_API_KEY=false.
NINEROUTER_API_KEY=
NINEROUTER_MODEL=Code
```

Dashboard native 9Router được J-Core Gateway reverse-proxy sau khi xác thực
Jarvis token. Không expose port `20128` ra Internet. Nếu muốn người dùng chỉ
nhập đúng một Jarvis token, tắt login riêng của dashboard 9Router trong cấu
hình local; lớp bảo vệ public lúc đó là phiên `HttpOnly` tạm do J-Core Gateway
cấp. Nếu vẫn bật login 9Router, dashboard nhúng sẽ hiển thị màn hình login
native của 9Router.

Claude Code CLI không tự mở HTTP API. Không cho gateway public chạy trực tiếp
lệnh shell `claude`. Nếu cần dùng Claude Code, hãy dựng một local bridge có xác
thực ở `127.0.0.1`, sau đó mới điền `CLAUDE_*`.

Sau khi sửa `.env.local` trên Ubuntu:

```bash
git pull origin main
sudo systemctl restart j-core-gateway
curl -H "Authorization: Bearer $JCORE_GATEWAY_TOKEN" \
  https://jarvisidhuykl.huykl.id.vn/health
```

Kết quả sẵn sàng phải có ít nhất một dịch vụ chat với:

```json
{ "online": true, "configured": true }
```
