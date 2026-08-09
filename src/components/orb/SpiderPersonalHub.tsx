import { FormEvent, useEffect, useMemo, useState } from "react";
import { soundManager } from "../../utils/soundManager.js";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };
type LinkKind = "eat" | "drink" | "play" | "todo";
type PersonalNode = { id: string; kind: LinkKind; title: string; note: string; done?: boolean };

type Props = {
  currentTime: string;
  username: string;
  connections: { gateway: boolean; hermes: boolean; openclaw: boolean; nineRouter: boolean };
  messages: Message[];
  isSending: boolean;
  onAskEv: (prompt: string) => void;
  onExit: () => void;
  onResetView: () => void;
};

const STORAGE_KEY = "jarvis.spider.personal.v1";
const KINDS: Array<{ id: LinkKind; label: string; icon: string }> = [
  { id: "eat", label: "Ăn", icon: "◒" },
  { id: "drink", label: "Uống", icon: "◇" },
  { id: "play", label: "Chơi", icon: "✦" },
  { id: "todo", label: "Việc phải làm", icon: "✓" },
];

const SEED_NODES: PersonalNode[] = [
  { id: "ev", kind: "todo", title: "Lập kế hoạch tuần", note: "Hỏi E.V và tách thành từng chặng" },
  { id: "coffee", kind: "drink", title: "Quán làm việc yên tĩnh", note: "Ghim địa chỉ hoặc link Maps" },
  { id: "dinner", kind: "eat", title: "Ăn tối", note: "Danh sách nơi muốn thử" },
  { id: "weekend", kind: "play", title: "Cuối tuần", note: "Hoạt động để nạp lại năng lượng" },
];

function loadNodes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(parsed) && parsed.length ? parsed as PersonalNode[] : SEED_NODES;
  } catch {
    return SEED_NODES;
  }
}

export default function SpiderPersonalHub({ currentTime, username, connections, messages, isSending, onAskEv, onExit, onResetView }: Props) {
  const [tab, setTab] = useState<"map" | "personal" | "links" | "missions">("map");
  const [kind, setKind] = useState<LinkKind>("todo");
  const [nodes, setNodes] = useState<PersonalNode[]>(loadNodes);
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [evPrompt, setEvPrompt] = useState("");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [evOpen, setEvOpen] = useState(false);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes)), [nodes]);
  const selected = nodes.find((node) => node.id === selectedId) || null;
  const latestEv = useMemo(() => [...messages].reverse().find((message) => message.role === "assistant"), [messages]);
  const visibleNodes = useMemo(() => {
    if (tab === "missions") return nodes.filter((node) => node.kind === "todo");
    if (tab === "links") return nodes.filter((node) => node.kind !== "todo");
    if (tab === "personal") return nodes.filter((node) => !node.done);
    return nodes;
  }, [nodes, tab]);

  const addNode = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const node = { id: `${Date.now()}`, kind, title: draft.trim(), note: note.trim() || "Chưa có ghi chú hoặc liên kết" };
    setNodes((current) => [...current, node]);
    setSelectedId(node.id);
    setDraft("");
    setNote("");
    soundManager.play("success");
  };

  const askEv = (event: FormEvent) => {
    event.preventDefault();
    const prompt = evPrompt.trim();
    if (!prompt || isSending) return;
    onAskEv(`Trong Spider Personal Link, hãy giúp tôi hoạch định: ${prompt}. Trả lời theo các nút Ăn, Uống, Chơi, Việc phải làm và các liên kết cần lưu.`);
    setEvPrompt("");
  };

  return (
    <div className="spider-personal-shell">
      <div className="spider-scanlines" aria-hidden="true" />
      <header className="spider-topbar">
        <button className="spider-identity" type="button" onClick={() => { setTab("personal"); setEvOpen(true); }}>
          <span className="spider-mask">◉</span><span><small>OPERATOR</small><b>{username.toUpperCase()}</b></span>
        </button>
        <div className="spider-tracker-brand"><small>PERSONAL</small><b>SPIDER <i /> LINK</b><em>LIVE PLANNING NETWORK</em></div>
        <nav aria-label="Spider Personal navigation">
          {([['map', 'WEB MAP'], ['personal', 'PERSONAL'], ['missions', 'MISSIONS'], ['links', 'LINKS']] as const).map(([id, label]) => (
            <button className={tab === id ? "active" : ""} type="button" key={id} onClick={() => { setTab(id); if (id === "personal") setEvOpen(true); }}>{label}</button>
          ))}
        </nav>
        <div className="spider-top-actions">
          <button type="button" onClick={() => setAlertsOpen((open) => !open)}><i className={connections.gateway ? "online" : "offline"} /> ALERTS</button>
          <button type="button" onClick={onExit}>J-CORE ↗</button>
        </div>
      </header>

      <aside className="spider-left-rail">
        <span>MAP FILTERS</span>
        {KINDS.map((item) => (
          <button className={`${item.id} ${kind === item.id ? "active" : ""}`} type="button" key={item.id} onClick={() => setKind(item.id)} title={item.label}>
            <b>{item.icon}</b><small>{item.label}</small>
          </button>
        ))}
        <i />
        <button type="button" onClick={onResetView} title="Căn lại orb"><b>↺</b><small>Căn lõi</small></button>
      </aside>

      <main className={`spider-main spider-tab-${tab}`}>
        <section className="spider-map-head">
          <div><span>{tab === "map" ? "LIVE PERSONAL NETWORK" : `${tab.toUpperCase()} LAYER`}</span><b>{visibleNodes.length} NÚT ĐANG HIỂN THỊ</b></div>
          <div className="spider-system-links">
            <span className={connections.hermes ? "online" : "offline"}>E.V / HERMES</span>
            <span className={connections.openclaw ? "online" : "offline"}>OPENCLAW</span>
            <span>NOTION / LINK SLOT</span>
          </div>
        </section>

        <section className="spider-web-map" aria-label="Bản đồ liên kết cá nhân">
          <svg className="spider-web-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <circle cx="50" cy="50" r="17" /><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="49" />
            {[0,45,90,135].map((angle) => <line key={angle} x1="50" y1="50" x2={50 + Math.cos(angle * Math.PI / 180) * 70} y2={50 + Math.sin(angle * Math.PI / 180) * 70} />)}
          </svg>
          <button className="spider-map-core" type="button" onClick={() => setTab("personal")}>
            <i /><span>E.V</span><small>PERSONAL CORE</small>
          </button>
          {visibleNodes.map((node, index) => {
            const angle = (index / Math.max(visibleNodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const radius = 29 + (index % 2) * 12;
            return (
              <button
                type="button"
                className={`spider-place-node ${node.kind} ${selectedId === node.id ? "active" : ""} ${node.done ? "done" : ""}`}
                style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%` }}
                key={node.id}
                onClick={() => setSelectedId(node.id)}
              >
                <i>{KINDS.find((item) => item.id === node.kind)?.icon}</i><span>{node.title}</span><small>{KINDS.find((item) => item.id === node.kind)?.label}</small>
              </button>
            );
          })}
          <div className="spider-map-coordinates">10.8231° N / 106.6297° E<br />PERSONAL SPACE · PRIVATE</div>
        </section>

        <aside className="spider-detail-card">
          <header><span>NODE INTEL</span><button type="button" onClick={() => setSelectedId("")}>×</button></header>
          {selected ? <>
            <small>{KINDS.find((item) => item.id === selected.kind)?.label.toUpperCase()} // PIN-{selected.id.slice(-4)}</small>
            <h2>{selected.title}</h2><p>{selected.note}</p>
            <div className="spider-node-actions">
              <button type="button" onClick={() => setNodes((items) => items.map((item) => item.id === selected.id ? { ...item, done: !item.done } : item))}>{selected.done ? "MỞ LẠI" : "HOÀN TẤT"}</button>
              <button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.title)}`, "_blank", "noopener,noreferrer")}>MỞ MAP ↗</button>
              <button className="danger" type="button" onClick={() => { setNodes((items) => items.filter((item) => item.id !== selected.id)); setSelectedId(""); }}>XÓA</button>
            </div>
          </> : <p>Chọn một nút trên mạng để xem địa chỉ, ghi chú và hành động tiếp theo.</p>}
        </aside>

        <form className="spider-add-node" onSubmit={addNode}>
          <span>ADD SIGNAL</span>
          <select value={kind} onChange={(event) => setKind(event.target.value as LinkKind)}>{KINDS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tên địa điểm hoặc việc cần làm…" />
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Địa chỉ, link hoặc ghi chú…" />
          <button type="submit">GHIM VÀO WEB +</button>
        </form>
      </main>

      <button className={`spider-message-launch ${evOpen ? "active" : ""}`} type="button" onClick={() => setEvOpen((open) => !open)}><i /><span>MESSAGE<br />CENTER</span><b>{messages.length}</b></button>

      <aside className={`spider-ev-panel ${evOpen ? "is-open" : ""}`}>
        <header><span><i /> E.V PROFILE</span><small>{isSending ? "THINKING" : connections.hermes ? "ONLINE" : "LOCAL MODE"}</small><button type="button" onClick={() => setEvOpen(false)}>CLOSE ×</button></header>
        <div className="spider-ev-copy">
          <b>Kế hoạch trở nên hữu hình.</b>
          <p>{latestEv?.text || "Nói mục tiêu của bạn. Tôi sẽ nối địa điểm, công việc và các bước tiếp theo thành một web map."}</p>
        </div>
        <div className="spider-quick-prompts">
          {["Lên lịch cuối tuần", "Tìm chỗ ăn gần đây", "Chia kế hoạch tuần", "Chuẩn bị việc hôm nay"].map((prompt) => <button type="button" key={prompt} onClick={() => setEvPrompt(prompt)}>{prompt}</button>)}
        </div>
        <form onSubmit={askEv}><textarea value={evPrompt} onChange={(event) => setEvPrompt(event.target.value)} placeholder="Nói với E.V điều bạn đang hình dung…" /><button type="submit" disabled={isSending || !evPrompt.trim()}>{isSending ? "ĐANG NỐI…" : "TẠO KẾ HOẠCH ↗"}</button></form>
        <footer><span>HERMES://EV-PERSONAL</span><time>{currentTime}</time></footer>
      </aside>

      {alertsOpen && <div className="spider-alert-popover"><b>LINK STATUS</b><span>Gateway {connections.gateway ? "operational" : "offline"}</span><span>OpenClaw {connections.openclaw ? "linked" : "waiting"}</span><span>Notion connector ready to configure</span></div>}
      <footer className="spider-ticker"><b>PERSONAL LINK ACTIVE</b><span>ĂN · UỐNG · CHƠI · VIỆC PHẢI LÀM · NOTION · OPENCLAW</span><i>SPIDER MODE 1.0</i></footer>
    </div>
  );
}
