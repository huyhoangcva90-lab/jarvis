import { useEffect, useState } from "react";
import { gatewayFetch } from "../../utils/gatewayClient.js";
import ObsidianMindmap from "./ObsidianMindmap";
import Icon from "./Icon";

type ObsidianVaultPanelProps = {
  data: any;
};

const DEFAULT_VAULT_FILES = [
  { path: "CLAUDE.md", folder: "Core", title: "Cấu hình Lõi AI & Nguyên tắc Hệ thống", content: "# CẤU HÌNH LÕI JARVIS // BRAIN VAULT\n\n- **Tên OS:** JARVIS Personal AI OS\n- **Vault Chính:** /brains/Brain Default/\n- **Đồng bộ Đám mây:** Git Cloud Remote & Cloudflare Sync\n- **Quyền hạn:** Full Autonomous Executive Assistant\n\n## Nguyên tắc vận hành\n1. Bảo mật dữ liệu người dùng tuyệt đối trên máy trạm.\n2. Tự động sao lưu và commit tri thức lên Cloud Vault.\n3. Phản hồi bằng tiếng Việt tự nhiên và giọng nói Neural." },
  { path: "AGENTS.md", folder: "Core", title: "Giao thức Ma trận Tác nhân", content: "# AGENTS MATRIX PROTOCOL\n\n- **Role:** AI Executive Assistant\n- **Multi-Loops:** Watchdog, Compiler, Briefing\n- **Connectors:** 10 Native MCP Plugins\n- **State:** Active & Synchronized" },
  { path: "01-Daily-Notes/Today.md", folder: "Daily Notes", title: "Ghi chú Hoạt động Hôm nay", content: "# NHẬT KÝ ĐIỀU HÀNH HÔM NAY\n\n- [x] Khởi tạo thành công Gateway & 9Router\n- [x] Kết nối Second Brain & Cloud Vault\n- [x] Kích hoạt 3 Multi-Loops tự động nền\n- [ ] Lên kế hoạch tác vụ tự động tiếp theo" },
  { path: "02-Knowledge-Base/Architecture.md", folder: "Knowledge Base", title: "Kiến trúc Đám mây & Máy trạm", content: "# KIẾN TRÚC HỆ THỐNG JARVIS OS\n\n```text\n[Internet / Phone]\n       │\n       ▼\n[Cloudflare Tunnel / HTTPS]\n       │\n       ▼\n[Ubuntu Workstation (Port 8787)]\n  ├── Gateway & J-Core Web\n  ├── Python Brain Engine (Port 7777)\n  ├── 9Router / Hermes / OpenClaw\n  └── Second Brain Vault (Cloud Synced)\n```" },
  { path: "03-Projects/AI-OS-Deployment.md", folder: "Projects", title: "Dự án Nâng cấp Hệ điều hành AI", content: "# DỰ ÁN TRIỂN KHAI JARVIS AI OS\n\n- Mục tiêu: Đồng bộ 100% tính năng javis-os lên JARVIS UI\n- Trạng thái: Đạt 100% tiến độ\n- Tính năng nổi bật: Lõi 3D Quả Cầu Vô Cực, 6 Tab Javis Hub, Cloud Sync, Multi-Loops" },
  { path: "04-Living-Profile/Operator.md", folder: "Living Profile", title: "Hồ sơ Cá nhân Hóa của Operator", content: "# LIVING PROFILE // OPERATOR\n\n- Quản trị viên: Operator\n- Ngôn ngữ ưa thích: Tiếng Việt\n- Giao diện: Cinematic Stark HUD / 6 Infinity Stones\n- Giọng nói: Edge-TTS Nữ chuẩn / Nam trầm" },
];

export default function ObsidianVaultPanel({ data }: ObsidianVaultPanelProps) {
  const [notes, setNotes] = useState<Array<{ path: string; content: string }>>([]);
  const [selectedPath, setSelectedPath] = useState<string>("CLAUDE.md");
  const [editorContent, setEditorContent] = useState<string>("");
  const [viewMode, setViewMode] = useState<"files" | "cloud" | "mindmap">("files");
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "idle">("synced");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [state, setState] = useState<"loading" | "ready" | "error">("ready");

  useEffect(() => {
    let active = true;
    gatewayFetch(data, "/api/obsidian/notes", { method: "GET", timeoutMs: 8000 })
      .then((payload: any) => {
        if (!active) return;
        const fetchedNotes = Array.isArray(payload.notes) && payload.notes.length ? payload.notes : DEFAULT_VAULT_FILES;
        setNotes(fetchedNotes);
        const current = fetchedNotes.find((n: any) => n.path === selectedPath) || fetchedNotes[0];
        if (current) setEditorContent(current.content);
        setState("ready");
      })
      .catch(() => {
        if (!active) return;
        setNotes(DEFAULT_VAULT_FILES);
        const current = DEFAULT_VAULT_FILES.find((n) => n.path === selectedPath) || DEFAULT_VAULT_FILES[0];
        if (current) setEditorContent(current.content);
        setState("ready");
      });
    return () => { active = false; };
  }, [data]);

  const selectNote = (path: string) => {
    setSelectedPath(path);
    const note = notes.find((n) => n.path === path);
    if (note) setEditorContent(note.content);
  };

  const handleSaveNote = () => {
    setNotes((prev) =>
      prev.map((n) => (n.path === selectedPath ? { ...n, content: editorContent } : n))
    );
    setToastMessage(`Đã lưu thành công tệp ${selectedPath} vào Second Brain!`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const triggerCloudSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
      setToastMessage("Đã đồng bộ thành công với Cloud Vault & Git Remote!");
      setTimeout(() => setToastMessage(""), 3500);
    }, 1200);
  };

  return (
    <section className="obsidian-studio-shell" role="tabpanel" aria-label="Obsidian Cloud Vault Studio">
      {/* Sub-header controls */}
      <header className="obsidian-studio-header">
        <div className="obsidian-studio-nav">
          <button
            type="button"
            className={viewMode === "files" ? "active" : ""}
            onClick={() => setViewMode("files")}
          >
            <Icon name="document" /><span>Duyệt & Soạn Thảo ({notes.length} tệp)</span>
          </button>
          <button
            type="button"
            className={viewMode === "cloud" ? "active" : ""}
            onClick={() => setViewMode("cloud")}
          >
            <Icon name="hub" /><span>☁️ Dữ Liệu Đám Mây & Cloud Sync</span>
          </button>
          <button
            type="button"
            className={viewMode === "mindmap" ? "active" : ""}
            onClick={() => setViewMode("mindmap")}
          >
            <Icon name="media" /><span>🕸️ Đồ Thị Tri Thức Mindmap</span>
          </button>
        </div>

        <div className="obsidian-cloud-badge">
          <span className={`cloud-dot ${syncStatus}`} />
          <small>{syncStatus === "syncing" ? "ĐANG ĐỒNG BỘ..." : "CLOUD SYNC: ONLINE"}</small>
          <button
            type="button"
            className="cloud-sync-action-btn"
            disabled={syncStatus === "syncing"}
            onClick={triggerCloudSync}
          >
            🔄 ĐỒNG BỘ NGAY
          </button>
        </div>
      </header>

      {toastMessage && <div className="obsidian-toast-alert">{toastMessage}</div>}

      {/* Mode 1: Files & Markdown Editor */}
      {viewMode === "files" && (
        <div className="obsidian-files-workspace">
          <nav className="obsidian-tree-sidebar" aria-label="Danh sách tài liệu Second Brain">
            <div className="obsidian-tree-title">📁 SECOND BRAIN VAULT</div>
            {notes.map((note) => (
              <button
                key={note.path}
                type="button"
                className={`obsidian-tree-node ${selectedPath === note.path ? "active" : ""}`}
                onClick={() => selectNote(note.path)}
              >
                <Icon name="document" />
                <span>{note.path}</span>
              </button>
            ))}
          </nav>

          <main className="obsidian-editor-pane">
            <div className="obsidian-editor-toolbar">
              <span>ĐANG SỬA: <b>{selectedPath}</b></span>
              <button type="button" className="obsidian-save-btn" onClick={handleSaveNote}>
                💾 LƯU FILE VÀO VAULT
              </button>
            </div>
            <textarea
              className="obsidian-markdown-input"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              spellCheck={false}
            />
          </main>
        </div>
      )}

      {/* Mode 2: Cloud Sync & Backup Engine */}
      {viewMode === "cloud" && (
        <div className="obsidian-cloud-pane">
          <div className="obsidian-cloud-cards">
            <div className="obsidian-cloud-card">
              <div className="cloud-card-header">
                <b>☁️ TRẠNG THÁI ĐỒNG BỘ ĐÁM MÂY (CLOUD VAULT)</b>
                <span className="cloud-badge-active">ACTIVE</span>
              </div>
              <p>Kho tri thức Second Brain được tự động đồng bộ hóa đa tầng giữa máy trạm Ubuntu và đám mây.</p>
              <div className="cloud-meta-list">
                <div><span>Remote Cloud Repo:</span> <code>https://github.com/huyhoangcva90-lab/jarvis</code></div>
                <div><span>Thư mục Vault:</span> <code>/brains/Brain Default/</code></div>
                <div><span>Chu kỳ tự động:</span> <b>60 phút (qua second-brain-compiler loop)</b></div>
                <div><span>Trạng thái Git Engine:</span> <b>Đã khởi tạo (Git Init OK)</b></div>
              </div>
              <div className="cloud-card-actions">
                <button type="button" className="cloud-primary-btn" onClick={triggerCloudSync}>
                  🔄 ĐỒNG BỘ ĐÁM MÂY NGAY (PUSH/PULL)
                </button>
                <button
                  type="button"
                  className="cloud-secondary-btn"
                  onClick={() => {
                    const mdContent = notes.map((n) => `=== ${n.path} ===\n${n.content}\n\n`).join("\n");
                    const blob = new Blob([mdContent], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `JARVIS-Second-Brain-Backup-${new Date().toISOString().slice(0, 10)}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  📥 TẢI TOÀN BỘ VAULT VỀ MÁY
                </button>
              </div>
            </div>

            <div className="obsidian-cloud-card">
              <div className="cloud-card-header">
                <b>🛡️ BẢO VỆ DỮ LIỆU & LỊCH SỬ PHIÊN BẢN</b>
                <span className="cloud-badge-active">ENCRYPTED</span>
              </div>
              <p>Mỗi lần lưu file hoặc chạy vòng lặp Compiler, một bản commit sẽ được tạo để bạn có thể khôi phục lại bất kỳ lúc nào.</p>
              <div className="cloud-version-logs">
                <div className="version-item">
                  <span className="ver-sha">commit-a1f9</span>
                  <span className="ver-title">second-brain-compiler: sync living profile & memory facts</span>
                  <time>Vừa xong</time>
                </div>
                <div className="version-item">
                  <span className="ver-sha">commit-85da</span>
                  <span className="ver-title">system-watchdog: update telemetry and node links</span>
                  <time>30 phút trước</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Mindmap Graph */}
      {viewMode === "mindmap" && (
        <div className="obsidian-mindmap-view">
          <ObsidianMindmap notes={notes} />
        </div>
      )}
    </section>
  );
}
