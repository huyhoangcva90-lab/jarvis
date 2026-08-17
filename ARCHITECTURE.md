# JARVIS J-Core Console — Kiến Trúc Dự Án

> **Personal AI OS** — Lấy cảm hứng từ Marvel Cinematic Universe
> Phong cách: Doctor Strange × Iron Man × Futuristic Holographic AI

---

## Tổng Quan

JARVIS J-Core Console là giao diện điều khiển AI cá nhân dạng 3D holographic, sử dụng React + Three.js / React Three Fiber. Hệ thống hiển thị một **quả cầu năng lượng 3D (Orb)** tương tác, được bao quanh bởi giao diện HUD kiểu Iron Man.

### Công Nghệ Sử Dụng

| Layer | Công nghệ |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| 3D Rendering | Three.js + React Three Fiber (@react-three/fiber) |
| Post-Processing | @react-three/postprocessing (Bloom) |
| Styling | Vanilla CSS (HUD theme) |
| Build Tool | Vite |
| Package Manager | pnpm |
| Deployment | GitHub Pages + Cloudflare Tunnel (production) |

---

## Cấu Trúc Thư Mục

```
j-core-console/
├── index.html                  # SPA entry point
├── tracker.html                # Spidey Tracker entry
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── AGENTS.md                   # Agent/AI development rules
├── ARCHITECTURE.md             # ← Tài liệu này
├── CNAME                       # Custom domain (jarvis.huykl.id.vn)
│
├── src/                        # Source code
│   ├── App.tsx                 # Root component & keyboard shortcuts
│   ├── main.tsx                # React mount point
│   ├── styles.css              # Global CSS & HUD theme
│   │
│   ├── components/
│   │   ├── AuthScreen.jsx      # Login screen (Stark Access Chamber)
│   │   ├── BootScreen.jsx      # Boot animation
│   │   └── orb/
│   │       ├── CinematicOrb.tsx        # Orb wrapper (gold → Legacy, others → JarvisCanvas)
│   │       ├── HudOverlay.tsx          # Main HUD console panel
│   │       ├── DynamicHub.tsx          # Dynamic AI capability hubs
│   │       ├── ServiceDashboard.tsx    # Service management dashboard
│   │       ├── AppConfigEditor.tsx     # App config editor
│   │       ├── Icon.tsx                # SVG icon library
│   │       ├── LegacyCinematicOrb.tsx  # Legacy 2D canvas orb (gold palette)
│   │       ├── ObsidianMindmap.tsx     # Obsidian vault mindmap viewer
│   │       ├── ObsidianVaultPanel.tsx  # Obsidian vault browser
│   │       ├── SpiderPersonalHub.tsx   # Spider-Man personal hub
│   │       └── UbuntuWorkspace.tsx     # Ubuntu terminal workspace
│   │
│   ├── core/
│   │   ├── JarvisCanvas.tsx    # Three.js Canvas & Realm Scene Switcher
│   │   └── RealmTransition.tsx # Cross-fade transition shader
│   │
│   ├── realms/                 # 3D Realm Scenes (mỗi viên đá vô cực = 1 realm)
│   │   ├── shared/
│   │   │   └── coreMotion.ts   # Shared math helpers & motion utilities
│   │   ├── mind/               # Gold — Mind Stone (Neural Lattice)
│   │   │   ├── MindScene.tsx
│   │   │   └── NeuralLattice.tsx
│   │   ├── space/              # Blue — Space Stone (Hypercube Tesseract)
│   │   │   ├── SpaceScene.tsx
│   │   │   └── HypercubeSystem.tsx
│   │   ├── time/               # Green — Time Stone (Mystic Core)
│   │   │   └── TimeScene.tsx
│   │   ├── reality/            # Red — Reality Stone (Financial Citadel)
│   │   │   ├── RealityScene.tsx
│   │   │   └── FinancialCitadel.tsx
│   │   ├── power/              # Violet — Power Stone (Agent Formation)
│   │   │   ├── PowerScene.tsx
│   │   │   └── AgentFormation.tsx
│   │   ├── stark/              # Orange — Soul Stone (Tony Orb / Iron Man)
│   │   │   └── TonyOrbScene.tsx
│   │   └── spider/             # Spider — Spider-Man (Web Tracker)
│   │       ├── SpiderScene.tsx
│   │       └── tracker/        # Spidey Tracker sub-app
│   │
│   ├── utils/
│   │   ├── gatewayClient.js    # Gateway API client
│   │   ├── hermesProfiles.ts   # Hermes AI profile management
│   │   ├── hubRuntime.ts       # Hub template runtime
│   │   ├── nineRouterModels.js # 9Router model definitions
│   │   ├── obsidianParser.ts   # Obsidian markdown parser
│   │   ├── orbPreferences.ts   # Orb palette & UI preferences
│   │   ├── soundManager.js     # Sound effects manager
│   │   ├── stoneState.jsx      # Infinity Stone state management
│   │   ├── storage.js          # localStorage wrapper
│   │   └── useReducedMotion.ts # Accessibility: reduced motion hook
│   │
│   └── types/
│       └── stones.js           # Stone type definitions
│
├── server/
│   └── gateway.mjs             # Production gateway server (Ubuntu)
│
├── scripts/
│   ├── build-pages.mjs         # Build for GitHub Pages
│   ├── deploy.sh               # Deploy script
│   └── ...                     # Doctor & smoke test scripts
│
├── deploy/                     # systemd service files
├── dist/                       # Build output (git-tracked for GitHub Pages)
├── docs/                       # Architecture & spec documents
├── external/
│   └── spideytracker-snapshot/ # Spidey Tracker submodule
├── public/
│   └── assets/                 # Static assets
└── .jcore/
    └── apps/                   # App descriptors (hermes, openclaw, 9router, claude)
```

---

## Bảng Mapping Realm ↔ Palette ↔ Phím Tắt

| Phím | Palette | Realm Scene | Viên Đá Vô Cực | Mô Tả |
|:---:|:---:|:---|:---|:---|
| — | `gold` | MindScene | Mind Stone | Neural Lattice vàng kim |
| `G` / `5` | `green` | TimeScene | Time Stone | Green Mystic Core (Doctor Strange) |
| — | `blue` | SpaceScene | Space Stone | Hypercube Tesseract |
| — | `red` | RealityScene | Reality Stone | Financial Citadel |
| — | `violet` | PowerScene | Power Stone | Agent Formation |
| — | `orange` | TonyOrbScene | Soul Stone | Iron Man Soul Core **(mặc định)** |
| — | `spider` | SpiderScene | — | Spider-Man Web Tracker |

**Phím tắt trạng thái AI:**
- `1` → IDLE | `2` → LISTENING | `3` → THINKING | `4` → SPEAKING
- `Escape` → Về Soul Core (orange)

---

## Xác Thực (Authentication)

### Trên Production (Ubuntu Gateway — `127.0.0.1:8787`)
1. `GET /api/auth/session` → Nếu có cookie `jcore_session` hợp lệ → auto-login.
2. `POST /api/auth/login` → Gateway xác thực bằng `JCORE_AUTH_PASSWORD` trong `.env`.
3. Thành công → Set `HttpOnly` cookie session (7 ngày).

### Trên GitHub Pages (static hosting)
1. `GET /api/auth/session` → 404 (không có backend) → Hiện AuthScreen.
2. `POST /api/auth/login` → Fail (không có backend).
3. Fallback: Kiểm tra mật khẩu trực tiếp trong browser (`admin` / `123456`).
4. Không có cookie session thực → Mỗi lần reload phải đăng nhập lại.

**Tài khoản mặc định:** `admin` / `123456`

---

## Hệ Thống 3D Orb

### Kiến Trúc Rendering

```
CinematicOrb.tsx
├── palette === "gold" → LegacyCinematicOrb.tsx (2D Canvas)
└── palette !== "gold" → JarvisCanvas.tsx (Three.js R3F)
    ├── Canvas (WebGL)
    ├── CanvasPaletteBackground (clear color per realm)
    ├── CameraOrbitController (OrbitControls)
    ├── SceneRig (drag-to-rotate interaction)
    ├── RealmTransition (cross-fade shader)
    │   └── [RealmScene] ← Switched by activePalette
    └── PostFX (Bloom)
```

### Hiệu Ứng Nền (Background Effects)

| Hiệu ứng | Mô tả |
|---|---|
| Magic Circle Glow | Vòng tròn phép phát sáng, lan tỏa |
| Rune Flow | Rune chạy chuyển động xung quanh vòng |
| Energy Stream | Dòng năng lượng kết nối các lớp và lõi |
| Time Distortion | Hiệu ứng méo thời gian, sóng xung quay tốc |
| Particle Sparks | Các hạt ma thuật bay lấp lánh |
| Light Pulse | Lõi phát xung nhịp nhàng theo trạng thái |

### Trạng Thái Hoạt Động AI

| State | Hiệu ứng |
|---|---|
| **IDLE** | Xoay chậm, ánh sáng ổn định |
| **LISTENING** | Các vòng khép nhẹ lại, ánh sáng đù đủ |
| **THINKING** | Tăng tốc xoay, rune sáng mạnh, ma trận mở rộng |
| **SPEAKING** | Lõi phát xung, năng lượng lan tỏa theo giọng nói |

---

## Scripts Hữu Ích

```bash
# Development (cần Node.js)
pnpm install
pnpm dev              # Vite dev server → http://localhost:5173

# Build cho GitHub Pages
node scripts/build-pages.mjs

# Production server (Ubuntu)
node server/gateway.mjs
```

---

## Lưu Ý Quan Trọng

- **DEV MACHINE ≠ AI WORKSTATION**: Code được edit trên máy dev, deploy chạy trên Ubuntu.
- **Không đặt API keys / secrets trong frontend code**.
- **Giữ nguyên visual identity JARVIS** — không redesign trừ khi được yêu cầu.
- **Small, verifiable changes** — không rewrite toàn bộ nếu không cần thiết.
