# Kien truc tro ly AI ca nhan J-Core

## Muc tieu

J-Core la giao dien tro ly AI ca nhan, hoat dong duoc bang chat va voice tren nhieu thiet bi. Giao dien duoc host tren GitHub Pages; du lieu rieng va mo hinh AI co the chay tren may tinh cua nguoi dung.

## Kien truc de xuat

```text
Trinh duyet / dien thoai
        |
        | HTTPS + token thiet bi
        v
J-Core Local Gateway tren may nha
        |-- Ollama: LLM va embeddings
        |-- SQLite: hoi thoai, memory, cau hinh
        |-- Whisper.cpp: speech-to-text (giai doan 2)
        |-- Browser speechSynthesis hoac TTS local
        `-- Tool allowlist: lich, file, tim kiem, automation
```

Khong de giao dien GitHub Pages goi truc tiep Ollama. Gateway phai xu ly xac thuc, CORS, rate limit, streaming va quyen truy cap tool.

## Hai che do AI mien phi

### 1. Local Gateway - khuyen dung

- Ollama chay tren may tinh tai nha.
- Gateway Node.js cung cap API HTTPS va WebSocket/SSE cho giao dien.
- Co the truy cap tu may khac qua mang rieng nhu Tailscale hoac tunnel HTTPS duoc bao ve.
- Model, lich su va memory nam tren may cua nguoi dung.
- May nha phai bat khi truy cap tu xa.

### 2. WebLLM trong trinh duyet

- Model chay truc tiep bang WebGPU, khong can backend.
- Moi thiet bi phai tai model co kich thuoc lon va can GPU/bo nho phu hop.
- Phu hop che do offline hoac demo, khong phu hop moi dien thoai.

## Model khoi dau

- May 8 GB RAM: `qwen3:1.7b` hoac `qwen3:4b`.
- May 16 GB RAM: `qwen3:4b` hoac `qwen3:8b`.
- May 32 GB RAM/GPU tot: `qwen3:14b`.
- Bat streaming de UI hien token ngay khi model sinh noi dung.

Lua chon cuoi cung can dua tren RAM, VRAM, CPU/GPU va do tre thuc te cua may.

## Voice pipeline

### Giai doan 1

- SpeechRecognition cua trinh duyet cho nhan giong noi.
- speechSynthesis cua trinh duyet cho doc phan hoi.
- Voice activity state dieu khien animation: listening, thinking, speaking.

### Giai doan 2

- Whisper.cpp chay local de nhan tieng Viet on dinh hon.
- Voice activity detection de tu dong bat dau/ket thuc cau noi.
- Audio amplitude hoac phoneme envelope dieu khien truc tiep scale, bloom va toc do cua loi 3D.

## Memory

- LocalStorage chi luu giao dien, tuy chon va cache nho.
- SQLite luu hoi thoai, profile, project va long-term memory.
- Memory phai co pham vi, ngay tao, nguon va nut xoa ro rang.
- Chi dua cac memory lien quan vao context, khong gui toan bo lich su moi lan.

## Tool system

Moi tool la mot ham co schema vao/ra ro rang. Chi cho phep tool trong allowlist.

Vi du:

- doc lich va tao su kien
- tim file theo ten
- mo URL tin cay
- ghi chu va tao task
- tim kiem web
- kich hoat workflow n8n

Khong cho model chay shell tuy y. Tac vu xoa, gui, mua, dang bai hoac thay doi du lieu phai yeu cau xac nhan.

## Bao mat bat buoc

- Khong dua API key vao React bundle hoac LocalStorage.
- Khong expose truc tiep cong Ollama ra Internet.
- Gateway dung HTTPS, token rieng cho tung thiet bi va rate limit.
- Tool co allowlist va audit log.
- Bi mat nam trong bien moi truong tren may local.
- Co nut thu hoi thiet bi va xoa memory.
- Khong tu dong hoa hoac chuyen tiep session ChatGPT Web/Plus.

## Lo trinh

1. Hoan thien renderer hologram va state animation.
2. Tao Local Gateway + Ollama streaming chat.
3. Noi history va memory vao SQLite.
4. Them push-to-talk, sau do VAD va hands-free.
5. Them Whisper.cpp va TTS local neu can.
6. Them tool calling voi permission va audit log.
7. Dong goi gateway thanh app khoi dong cung Windows.

## Tai lieu ky thuat

- SideFX / Animal Logic procedural hologram case study: https://www.sidefx.com/community/the-avengers-age-of-ultron/
- Three.js BufferGeometry: https://threejs.org/docs/pages/BufferGeometry.html
- Three.js PointsMaterial: https://threejs.org/docs/pages/PointsMaterial.html
- React Three Fiber performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- Ollama API: https://docs.ollama.com/api/introduction
- Ollama streaming: https://docs.ollama.com/capabilities/streaming
- Qwen3 models in Ollama: https://ollama.com/library/qwen3
- WebLLM: https://github.com/mlc-ai/web-llm
- Whisper.cpp: https://github.com/ggml-org/whisper.cpp
