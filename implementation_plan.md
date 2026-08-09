# J-Core Console Implementation Plan

Trang thai: ban chot yeu cau chinh cho J-Core Console.

## 1. Huong san pham chinh

J-Core Console khong phai la mot giao dien trang tri. Muc tieu chinh la mot web dashboard duy nhat de giao tiep voi AI va dieu khien cac he thong AI dang chay tren may Ubuntu local.

Chuc nang trung tam la giao tiep voi AI bang chat hoac voice thong qua mot Hermes profile dang duoc cai dat trong he thong, mac dinh la profile `jarvis`. Moi cau chat, voice input, voice output, trang thai nghe, suy nghi va tra loi phai di qua Hermes profile dang active.

## 2. Dashboard that su

Bang dieu khien phai la dashboard custom lai cua cac he thong dang co tren may, khong chi hien thi du lieu gia lap.

| Hub | Vai tro | Yeu cau ket noi that |
| --- | --- | --- |
| Hermes | AI profile, memory, session, voice/chat orchestration | Ket noi Hermes API/CLI tren Ubuntu, profile mac dinh `jarvis`, ho tro chuyen profile neu Hermes cho phep |
| OpenClaw | Agent/task runner | Hien thi va dieu khien task, worker, model, doctor/status tu OpenClaw that |
| 9Router | Model router | Hien thi models, endpoint, latency, routing/fallback va chat proxy tu 9Router that |
| Claude | Claude Code / Claude CLI bridge | Doc status/version, goi command duoc cho phep, hien output that tu local Claude |

Tat ca route phai di qua `server/gateway.mjs` de web chi noi voi mot gateway, con gateway moi noi toi cac service local.

## 3. Chat va voice qua Hermes profile

- Chat UI la cong giao tiep chinh voi AI.
- Voice input can Speech-to-Text, uu tien tieng Viet.
- Voice output can TTS, uu tien gioi nu chuan hoac nam tram tieng Viet.
- Moi tin nhan can kem profile Hermes active, mac dinh `jarvis`.
- Orb AI phai phan ung theo trang thai Hermes/chat/voice: `idle`, `listening`, `thinking`, `speaking`.
- Mau sac, nang luong, style orb phai lay theo profile Hermes duoc chon, khong hard-code mot mau duy nhat.

## 4. Terminal Ubuntu local

Terminal trong web phai la terminal cua may Ubuntu local o nha, de co the nhan lenh truc tiep toi Ubuntu.

Ban hien tai co safe command broker doc-only de kiem tra file, service status, logs va mot so command duoc whitelist. Ban tiep theo can nang len PTY/interactive terminal co auth rieng, session rieng va audit log, vi day la quyen dieu khien may that.

Yeu cau:

- Terminal target la Ubuntu gateway host.
- Co stdout/stderr, exit code, history va trang thai dang chay.
- Co che do an toan: allowlist cho dashboard cong khai, PTY day du chi bat khi user xac nhan trong moi truong local/private.
- Khong thuc hien restart/delete/write nguy hiem neu chua co guard va xac nhan ro.

## 5. Auth don gian

Man mo khoa dashboard chi can:

- Tai khoan mac dinh: `admin`
- Mat khau tam thoi: `123456`

Bo luong PIN/keypad cu va cac truong nhap khong can thiet tren man mo khoa. Gateway token van la cau hinh rieng cho ket noi gateway, khong phai tai khoan dang nhap dashboard.

## 6. Thu vien file va Obsidian space

Thu vien la tong hop file trong may local, khong phai danh sach mau.

- `Library`/`Ubuntu Files`: duyet file theo root duoc cau hinh bang `JCORE_WORKSPACE_ROOT`.
- Chi tra ve path tuong doi tren UI, khong leak absolute path.
- Chan dotfiles, secret/key files, symlink escape va file qua lon.
- `Obsidian Space`: doc thu muc vault tu `JCORE_OBSIDIAN_ROOT`, gom note markdown thanh hub/graph/mindmap phu hop voi J-Core.
- Obsidian hub can sap xep lai note theo tag/link/thu muc de dung nhu khong gian tri thuc, khong chi list file.

## 7. Orb AI theo Hermes profile

Orb AI khong nen chi la mau trang tri. No la mat tien trang thai cua AI core.

- Profile Hermes quy dinh palette, voice persona, icon/state va intensity.
- Khi doi profile Hermes, orb doi mau/cau truc nang luong theo profile.
- Trang thai voice/chat can dong bo truc tiep vao orb.
- Moi realm hoac profile co ngon ngu thiet ke rieng, tranh cac core trong giong nhau.

## 8. Bien moi truong can co tren Ubuntu

```env
HERMES_DEFAULT_PROFILE=jarvis
HERMES_ALLOWED_PROFILES=jarvis
JCORE_WORKSPACE_ROOT=/srv/j-core
JCORE_OBSIDIAN_ROOT=/home/<ubuntu-user>/Documents/ObsidianVault
JCORE_TERMINAL_ENABLED=true
JCORE_MANAGED_SERVICES=j-core-gateway,hermes,openclaw,9router
JCORE_HERMES_CLI=jarvis
JCORE_OPENCLAW_CLI=openclaw
JCORE_CLAUDE_CLI=claude
```

## 9. Acceptance criteria

- Dang nhap dashboard bang `admin` / `123456`.
- Chat text hoat dong qua Hermes profile `jarvis`.
- Voice input/output tieng Viet hoat dong qua Hermes profile.
- Hermes/OpenClaw/9Router/Claude hub doc va dieu khien du lieu that tu Ubuntu services.
- Terminal trong web goi lenh tren Ubuntu gateway host.
- Library doc file local tu `JCORE_WORKSPACE_ROOT`.
- Obsidian hub doc vault tu `JCORE_OBSIDIAN_ROOT` va hien note/graph co to chuc.
- Orb doi style/mau/trang thai theo Hermes profile va voice/chat activity.

## 10. Trang thai hien tai

Da co:

- Gateway trung tam `server/gateway.mjs`.
- Hermes-first chat route va profile `jarvis`.
- Service health cho Hermes/OpenClaw/9Router/Claude.
- Ubuntu file browser doc-only.
- Obsidian vault reader doc-only.
- Terminal command broker doc-only.
- Private Ubuntu shell endpoint gated by `JCORE_TERMINAL_PRIVATE_MODE`, chua phai full PTY stream.
- Login dashboard don gian `admin` / `123456`.
- Active Hermes profile duoc luu trong dashboard va dong bo voi chat/voice + palette orb.
- Dashboard command route `/api/system/dashboard-command` cho Hermes/OpenClaw/9Router/Claude theo allowlist.
- OpenClaw hub co nut status/doctor/models/tasks goi command that qua Gateway.
- 9Router hub co nut doc models/status that qua Gateway.

Da trien khai trong control pass 2026-08-09:

- Hermes voice pipeline tieng Viet co hai tang: local STT/TTS OpenAI-compatible tren Ubuntu va browser fallback. Client co VAD de tu dung khi im lang, sau do gui transcript qua Hermes profile active.
- Private Ubuntu PTY stream qua WebSocket, ticket mot lan, session timeout va audit metadata. Local browser console + Ubuntu Files khong API van la mac dinh.
- Hermes/Claude dashboard co them allowlist diagnostics profiles/config va doctor/auth; khong co lenh restart/delete/write tu UI.
- Profile metadata, model, tag va palette duoc dong bo tu Hermes `/v1/profiles`, co fallback tu env/catalog neu upstream chua ho tro.
- Obsidian knowledge hub duoc sap xep theo topic/tag/folder, co outgoing links, backlinks, unresolved-note state va layout cluster deterministic.

Con phu thuoc cau hinh tren Ubuntu (khong the hard-code trong web):

- Gan `HERMES_STT_URL` va `HERMES_TTS_URL` vao Whisper/TTS runtime that neu muon thay browser voice.
- Bat `JCORE_TERMINAL_PRIVATE_MODE=true` chi sau khi Gateway nam sau private tunnel/strong access control.
- Xac nhan CLI Hermes/Claude tren may ho tro cac action allowlist tuong ung; action khong ton tai se hien exit code/output that, khong fallback gia lap.
