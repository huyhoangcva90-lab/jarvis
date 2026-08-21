# JARVIS workstation operations

Tài liệu này là nguồn chuẩn cho cách đồng bộ và vận hành JARVIS trên máy trạm
Ubuntu hiện tại. Các installer trong `scripts/` vẫn hữu ích cho cài đặt mới,
nhưng không mô tả chính xác runtime đang hoạt động.

## Nguồn code

```text
DEV MACHINE -> GitHub main -> Ubuntu AI WORKSTATION
```

- Chỉ branch `main` được dùng để triển khai production.
- GitHub `main` là nguồn chuẩn. Không reset production theo feature branch.
- Thay đổi phải được kiểm tra trên DEV MACHINE trước khi push.
- Ubuntu chỉ nhận thay đổi bằng fast-forward từ `origin/main`.

## Runtime đang hoạt động

| Thành phần | Giá trị |
| --- | --- |
| Repository | `/home/huykl/jarvis` |
| Branch | `main` |
| System service | `jarvis.service` |
| Working directory | `/home/huykl/jarvis` |
| Entry point | `/usr/bin/node /home/huykl/jarvis/server/gateway.mjs` |
| Server config | `/home/huykl/jarvis/.env.local` |
| Frontend build | `/home/huykl/jarvis/dist` |
| JARVIS listener | `0.0.0.0:8787` theo cấu hình workstation hiện tại |

`dist/`, `.env.local` và log runtime không được commit. Secrets chỉ nằm trên
Ubuntu và không được in ra trong log triển khai.

## Quy trình cập nhật

Trên DEV MACHINE:

```powershell
pnpm run typecheck
pnpm run build
pnpm run test:self-hosted
pnpm run test:gateway
pnpm run test:production-serving
git push origin main
```

Trên Ubuntu AI WORKSTATION:

```bash
cd /home/huykl/jarvis
git fetch origin main
git merge --ff-only origin/main
npm run build
sudo systemctl restart jarvis.service
systemctl is-active jarvis.service
curl -I http://127.0.0.1:8787/
```

Không dùng `git reset --hard` cho cập nhật thông thường. Nếu working tree có
tracked changes, dừng triển khai và kiểm tra trước khi pull.

## Service ownership

Chỉ `jarvis.service` được giữ cổng 8787. User service cũ
`gateway-api.service` phải ở trạng thái `disabled` và `inactive`; chạy đồng
thời hai service sẽ gây vòng lặp `EADDRINUSE`.

Kiểm tra:

```bash
systemctl is-active jarvis.service
systemctl --user is-active gateway-api.service
ss -lntp | grep ':8787'
```

## Xác minh sau deploy

- `/` trả HTTP 200 và phục vụ build mới.
- `/health` không có session trả HTTP 401.
- `jarvis.service` ở trạng thái `active` với MainPID mới.
- Local `main`, GitHub `main` và Ubuntu `main` có cùng commit SHA.
- Chỉ JARVIS là public origin; Hermes, OpenClaw, 9Router và Claude tiếp tục ở
  phía server/private network.

## Rollback

Ghi lại SHA trước deploy. Khi cần rollback, checkout SHA đã biết là tốt, build
lại `dist`, restart `jarvis.service`, rồi xác minh HTTP và service. Không thay
đổi hoặc sao chép `.env.local` trong quá trình rollback.
