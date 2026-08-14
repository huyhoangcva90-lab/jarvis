import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { soundManager } from "../../utils/soundManager.js";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };
type LinkKind = "eat" | "drink" | "play" | "todo";
type DraftLocation = { lng: number; lat: number };
type PersonalNode = { id: string; kind: LinkKind; title: string; note: string; done?: boolean; x?: number; y?: number; lng?: number; lat?: number };

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

const STORAGE_KEY = "jarvis.spider.personal.v2";
const KINDS: Array<{ id: LinkKind; label: string; short: string; color: string }> = [
  { id: "eat", label: "Ăn", short: "ĂN", color: "amber" },
  { id: "drink", label: "Uống", short: "UỐNG", color: "cyan" },
  { id: "play", label: "Chơi", short: "CHƠI", color: "violet" },
  { id: "todo", label: "Việc phải làm", short: "VIỆC", color: "red" },
];

const SAIGON_CENTER: DraftLocation = { lng: 106.7009, lat: 10.7769 };

const SEED_NODES: PersonalNode[] = [
  { id: "ev", kind: "todo", title: "Lập kế hoạch tuần", note: "Hỏi E.V và tách thành từng chặng", x: 68, y: 35 },
  { id: "coffee", kind: "drink", title: "Quán làm việc", note: "Ghim địa chỉ hoặc link Maps", x: 79, y: 48 },
  { id: "dinner", kind: "eat", title: "Ăn tối", note: "Danh sách nơi muốn thử", x: 53, y: 58 },
  { id: "weekend", kind: "play", title: "Cuối tuần", note: "Hoạt động để nạp lại năng lượng", x: 27, y: 39 },
];

function xyToLngLat(x = 50, y = 50): DraftLocation {
  return {
    lng: SAIGON_CENTER.lng + ((x - 50) / 100) * 0.18,
    lat: SAIGON_CENTER.lat - ((y - 50) / 100) * 0.14,
  };
}

function migrateNode(node: PersonalNode): PersonalNode {
  if (typeof node.lng === "number" && typeof node.lat === "number") return node;
  return { ...node, ...xyToLngLat(node.x, node.y) };
}

function loadNodes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(parsed) && parsed.length ? (parsed as PersonalNode[]).map(migrateNode) : SEED_NODES.map(migrateNode);
  } catch {
    return SEED_NODES.map(migrateNode);
  }
}

function KindGlyph({ kind }: { kind: LinkKind }) {
  if (kind === "eat") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v8M4 3v5c0 2 6 2 6 0V3M7 11v10M16 3c-2 3-2 8 1 10v8M17 3v10" /></svg>;
  if (kind === "drink") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l-1 16H8L7 4ZM8 8h8M14 4l3-2" /></svg>;
  if (kind === "play") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8 2-3h4l2 3 3 1 2 8-3 2-4-4h-4l-4 4-3-2 2-8 3-1Z" /><path d="M8 10v4M6 12h4M16 11h.01M18 13h.01" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 9l2 2 5-5M8 15h7" /></svg>;
}

function WebheadMark() {
  return <svg className="spidey-webhead" viewBox="0 0 64 64" aria-hidden="true"><path className="head" d="M32 3C15 3 9 16 11 34c2 17 12 27 21 27s19-10 21-27C55 16 49 3 32 3Z" /><path className="web" d="M32 5v53M13 26h38M17 43h30M16 17l16 11 16-11M18 48l14-20 14 20" /><path className="eye" d="M17 23c1 13 5 20 13 25V27c-4-4-8-5-13-4ZM47 23c-1 13-5 20-13 25V27c4-4 8-5 13-4Z" /></svg>;
}

function PixelHero() {
  return <svg className="spidey-pixel-hero" viewBox="0 0 90 150" aria-hidden="true" shapeRendering="crispEdges">
    <path className="hero-outline" d="M28 3h34v5h10v10h6v30h-6v12h-8v8h8v9h8v31H68v20H55v19H37v-19H24v-20H10V77h8v-9h8v-8h-8V18h5V8h5V3Z" />
    <path className="hero-red" d="M31 9h28v5h8v8h5v23h-7v10H25V45h-5V22h5v-8h6V9Zm-5 54h38v15h8v25H58V83H32v20H17V78h9V63Zm6 44h26v18H48v17H40v-17h-8v-18Z" />
    <path className="hero-blue" d="M32 78h26v29H48v18H40v-18H32V78ZM17 83h15v20H17V83Zm41 0h14v20H58V83Z" />
    <path className="hero-eye" d="M27 22h14v19H30l-5-8 2-11Zm36 0H49v19h11l5-8-2-11Z" />
    <path className="hero-web" d="M45 10v48M23 30h44M28 16l17 15 17-15M28 49l17-18 17 18M45 64l-8 13 8 10 8-10-8-13Z" />
    <path className="hero-spider" d="M42 70h6v13h-6zM34 68h7v4h-7zm15 0h7v4h-7zm-18 9h11v4H31zm17 0h11v4H48z" />
  </svg>;
}

function WorldMap() {
  return <svg className="spidey-world" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
    <g className="world-grid"><path d="M0 90h1200M0 180h1200M0 270h1200M0 360h1200M0 450h1200M200 0v560M400 0v560M600 0v560M800 0v560M1000 0v560" /></g>
    <g className="world-land">
      <path d="M36 74 92 31l111 7 52 38 44 6 14 44-37 30-16 54-39 9-18 45-50 24-38-32-39-6-26-64-33-39 19-29-30-22Z" />
      <path d="m252 252 60 32 30 65-13 53-32 73-21 47-22-30 5-69-31-73 7-58Z" />
      <path d="m508 68 52-19 48 14 18 29-29 16-10 28-42-3-32-27Z" />
      <path d="m557 154 45-24 54 14 31 43-9 58-27 50-5 76-42 65-31-48-22-95-31-56 12-48Z" />
      <path d="m626 83 80-40 134-13 75 23 57 12 51 51 105 17 24 62-34 40-70 8-34 32-58-15-42 20-65-42-56 17-44-35-56 12-36-44-54-13Z" />
      <path d="m932 357 49-28 73 14 55 44-25 49-68 20-59-24Z" />
      <path d="m1075 245 20-12 14 15-12 22-17-7Z" /><path d="m1145 300 17 2 8 24-19 14-13-19Z" />
    </g>
    <g className="world-traces"><path d="M84 112h128l25 35M161 208l49-23 66 18M553 109l80 42 52-28M697 85l45 83 93 18M874 74l32 75 99 27M976 365l61 31 52-19" /></g>
  </svg>;
}

export default function SpiderPersonalHub({ currentTime, username, connections, messages, isSending, onAskEv, onExit, onResetView }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [activeKind, setActiveKind] = useState<LinkKind | "all">("all");
  const [nodes, setNodes] = useState<PersonalNode[]>(loadNodes);
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id || "");
  const [panel, setPanel] = useState<"nav" | "activity" | "compose" | "detail" | "ev" | "links" | null>(null);
  const [kind, setKind] = useState<LinkKind>("todo");
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [draftLocation, setDraftLocation] = useState<DraftLocation | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editKind, setEditKind] = useState<LinkKind>("todo");
  const [evPrompt, setEvPrompt] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      center: [SAIGON_CENTER.lng, SAIGON_CENTER.lat],
      zoom: 12,
      attributionControl: { compact: true },
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "OpenStreetMap",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => map.resize());
    map.on("click", (event) => {
      setDraftLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
      setPanel("compose");
      soundManager.play("beep");
    });

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes)), [nodes]);
  const selected = nodes.find((node) => node.id === selectedId) || null;
  useEffect(() => { if (selected) { setEditTitle(selected.title); setEditNote(selected.note); setEditKind(selected.kind); } }, [selectedId, selected?.title, selected?.note, selected?.kind]);

  const latestEv = useMemo(() => [...messages].reverse().find((message) => message.role === "assistant"), [messages]);
  const visibleNodes = useMemo(() => activeKind === "all" ? nodes : nodes.filter((node) => node.kind === activeKind), [activeKind, nodes]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    visibleNodes.forEach((node) => {
      if (typeof node.lng !== "number" || typeof node.lat !== "number") return;

      const item = KINDS.find((entry) => entry.id === node.kind);
      const markerButton = document.createElement("button");
      const label = document.createElement("span");
      const title = document.createElement("b");

      markerButton.type = "button";
      markerButton.className = `spidey-map-marker pin-${node.kind}${selectedId === node.id ? " selected" : ""}${node.done ? " done" : ""}`;
      markerButton.setAttribute("aria-label", `${item?.label || node.kind}: ${node.title}`);
      label.textContent = item?.short || node.kind;
      title.textContent = node.title;
      markerButton.append(label, title);
      markerButton.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelectedId(node.id);
        setPanel("detail");
        soundManager.play("click");
      });

      markersRef.current[node.id] = new maplibregl.Marker({ element: markerButton, anchor: "bottom" })
        .setLngLat([node.lng, node.lat])
        .addTo(map);
    });
  }, [selectedId, visibleNodes]);

  useEffect(() => {
    if (typeof selected?.lng !== "number" || typeof selected?.lat !== "number") return;
    mapRef.current?.flyTo({ center: [selected.lng, selected.lat], zoom: 14, speed: 0.8, essential: false });
  }, [selectedId, selected?.lng, selected?.lat]);

  const addNode = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const index = nodes.length;
    const x = 18 + ((index * 19) % 70);
    const y = 24 + ((index * 23) % 49);
    const location = draftLocation || xyToLngLat(x, y);
    const node: PersonalNode = { id: `${Date.now()}`, kind, title: draft.trim(), note: note.trim() || "Chưa có địa chỉ, link hoặc ghi chú", x: 18 + ((index * 19) % 70), y: 24 + ((index * 23) % 49) };
    node.x = x;
    node.y = y;
    node.lng = location.lng;
    node.lat = location.lat;
    setNodes((current) => [...current, node]);
    setSelectedId(node.id); setDraft(""); setNote(""); setDraftLocation(null); setPanel("detail");
    soundManager.play("success");
  };

  const saveSelected = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !editTitle.trim()) return;
    setNodes((items) => items.map((item) => item.id === selected.id ? { ...item, title: editTitle.trim(), note: editNote.trim(), kind: editKind } : item));
    soundManager.play("success");
  };

  const askEv = (event: FormEvent) => {
    event.preventDefault();
    const prompt = evPrompt.trim();
    if (!prompt || isSending) return;
    onAskEv(`Trong Spider Personal Link, hãy giúp tôi hoạch định: ${prompt}. Trả lời theo các nút Ăn, Uống, Chơi, Việc phải làm và các liên kết cần lưu.`);
    setEvPrompt("");
  };

  const togglePanel = (next: typeof panel) => setPanel((current) => current === next ? null : next);

  const openSelectedMap = () => {
    if (!selected || typeof selected.lat !== "number" || typeof selected.lng !== "number") return;
    window.open(`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="spider-personal-shell spidey-tracker-shell">
      <a className="spidey-skip" href="#spidey-map">Bỏ qua điều hướng</a>
      <div className="spidey-blueprint" aria-hidden="true" />
      <div className="spider-scanlines" aria-hidden="true" />

      <section className="spidey-frame">
        <button className="spidey-corner spidey-corner-left" type="button" aria-label="Mở điều hướng" aria-expanded={panel === "nav"} onClick={() => togglePanel("nav")}><WebheadMark /></button>
        <div className="spidey-logo"><span>PERSONAL</span><b>SPIDEY <WebheadMark /> TRACKER</b><small>J—CORE FIELD NETWORK</small></div>
        <button className="spidey-corner spidey-corner-right" type="button" aria-label="Trở về J-Core" onClick={onExit}>
          <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 9v30M9 24h30M13 13l22 22M35 13 13 35" /><circle cx="24" cy="24" r="17" /></svg>
        </button>

        <aside className="spidey-filter-rail" aria-label="Lọc loại địa điểm">
          {KINDS.map((item) => <button key={item.id} className={`${item.color} ${activeKind === item.id ? "active" : ""}`} type="button" aria-label={`Lọc ${item.label}`} aria-pressed={activeKind === item.id} onClick={() => setActiveKind((current) => current === item.id ? "all" : item.id)}><KindGlyph kind={item.id} /><span>{item.short}</span></button>)}
        </aside>

        <main id="spidey-map" className="spidey-map" tabIndex={-1}>
          <div ref={mapContainerRef} className="spidey-real-map" aria-label="Spider personal map" />
          <div className="spidey-map-vignette" aria-hidden="true" />
          <div className="spidey-map-status"><span>PERSONAL MAP // SAIGON</span><b>{visibleNodes.length} SIGNALS ONLINE</b>{draftLocation && <em>{draftLocation.lat.toFixed(5)} / {draftLocation.lng.toFixed(5)}</em>}</div>

          <div className="spidey-radar" aria-label="Điều khiển bản đồ">
            <i /><i /><i /><b />
            <button type="button" onClick={() => setActiveKind("all")} aria-label="Hiển thị toàn bộ bản đồ">◎</button>
            <button type="button" onClick={onResetView} aria-label="Căn lại bản đồ">⌾</button>
          </div>
        </main>

        <button className="spidey-message-center" type="button" onClick={() => togglePanel("ev")} aria-expanded={panel === "ev"}><span>{messages.length}</span><WebheadMark /><b>MESSAGE<br />CENTER</b></button>

        <div className="spidey-ticker" aria-label="Trạng thái hệ thống"><b>PERSONAL LINK ACTIVE</b><div><span>ĂN · UỐNG · CHƠI · VIỆC PHẢI LÀM</span><span>HERMES {connections.hermes ? "ONLINE" : "LOCAL"} · OPENCLAW {connections.openclaw ? "LINKED" : "WAITING"}</span></div><time>{currentTime}</time></div>

        {panel === "nav" && <aside className="spidey-panel spidey-nav-panel"><header><b>NAVIGATION</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header><nav>
          <button type="button" onClick={() => setPanel("activity")}>ACTIVITY LOG <span>{nodes.length}</span></button>
          <button type="button" onClick={() => setPanel("compose")}>ADD SIGNAL <span>＋</span></button>
          <button type="button" onClick={() => setPanel("ev")}>MESSAGE CENTER <span>{messages.length}</span></button>
          <button type="button" onClick={() => setPanel("links")}>SYSTEM LINKS <span>03</span></button>
          <button type="button" onClick={onExit}>J—CORE HUB <span>↗</span></button>
        </nav></aside>}

        {panel === "activity" && <aside className="spidey-panel spidey-log-panel"><header><b>ACTIVITY LOG</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header><div className="spidey-log-list">{nodes.map((node) => <button type="button" key={node.id} onClick={() => { setSelectedId(node.id); setPanel("detail"); }}><KindGlyph kind={node.kind} /><span><small>{node.done ? "COMPLETED" : KINDS.find((item) => item.id === node.kind)?.label.toUpperCase()}</small><b>{node.title}</b><em>{node.note}</em></span></button>)}</div></aside>}

        {panel === "compose" && <aside className="spidey-panel spidey-compose-panel"><header><b>ADD SIGNAL</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header><form onSubmit={addNode}><label>LOẠI<select value={kind} onChange={(event) => setKind(event.target.value as LinkKind)}>{KINDS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label>TÊN<input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tên địa điểm hoặc việc…" autoFocus /></label><label>ĐỊA CHỈ / LINK / GHI CHÚ<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dán link Maps, Notion hoặc ghi chú…" /></label><button type="submit" disabled={!draft.trim()}>GHIM VÀO MAP ＋</button></form></aside>}

        {panel === "detail" && selected && (
          <aside className="spidey-panel spidey-detail-panel">
            <header><b>NODE INTEL // {selected.id.slice(-4)}</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header>
            <form onSubmit={saveSelected}>
              <label>LOẠI<select value={editKind} onChange={(event) => setEditKind(event.target.value as LinkKind)}>{KINDS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
              <label>TÊN<input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} /></label>
              <label>ĐỊA CHỈ / LINK / GHI CHÚ<textarea value={editNote} onChange={(event) => setEditNote(event.target.value)} /></label>
              <button type="submit">LƯU THAY ĐỔI</button>
            </form>
            <div className="spidey-node-coordinates">
              <span>COORDINATES</span>
              <b>{typeof selected.lat === "number" && typeof selected.lng === "number" ? `${selected.lat.toFixed(5)} / ${selected.lng.toFixed(5)}` : "NO MAP POINT"}</b>
            </div>
            <div className="spidey-detail-actions">
              <button type="button" onClick={() => setNodes((items) => items.map((item) => item.id === selected.id ? { ...item, done: !item.done } : item))}>{selected.done ? "MỞ LẠI" : "HOÀN TẤT"}</button>
              <button type="button" onClick={openSelectedMap}>MỞ MAP ↗</button>
              <button className="danger" type="button" onClick={() => { setNodes((items) => items.filter((item) => item.id !== selected.id)); setSelectedId(""); setPanel(null); }}>XÓA</button>
            </div>
          </aside>
        )}

        {panel === "ev" && <aside className="spidey-panel spidey-ev-panel"><header><b>E.V // MESSAGE CENTER</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header><div className="spidey-ev-message"><span><WebheadMark /></span><p>{latestEv?.text || "Nói mục tiêu của bạn. Tôi sẽ nối địa điểm, công việc và các bước tiếp theo thành bản đồ hành động."}</p></div><div className="spidey-quick-prompts">{["Lên lịch cuối tuần", "Tìm chỗ ăn gần đây", "Chia kế hoạch tuần", "Chuẩn bị việc hôm nay"].map((prompt) => <button type="button" key={prompt} onClick={() => setEvPrompt(prompt)}>{prompt}</button>)}</div><form onSubmit={askEv}><label htmlFor="spidey-ev-prompt">TIN NHẮN CHO E.V</label><textarea id="spidey-ev-prompt" value={evPrompt} onChange={(event) => setEvPrompt(event.target.value)} placeholder="Mô tả kế hoạch bạn đang hình dung…" /><button type="submit" disabled={isSending || !evPrompt.trim()}>{isSending ? "ĐANG NỐI…" : "TẠO KẾ HOẠCH ↗"}</button></form></aside>}

        {panel === "links" && <aside className="spidey-panel spidey-links-panel"><header><b>SYSTEM LINKS</b><button type="button" onClick={() => setPanel(null)}>CLOSE</button></header><div><span className={connections.hermes ? "online" : "offline"}>HERMES / E.V <b>{connections.hermes ? "ONLINE" : "LOCAL"}</b></span><span className={connections.openclaw ? "online" : "offline"}>OPENCLAW <b>{connections.openclaw ? "LINKED" : "WAITING"}</b></span><span className={connections.nineRouter ? "online" : "offline"}>9ROUTER <b>{connections.nineRouter ? "READY" : "OFFLINE"}</b></span><span>NOTION <b>CONFIGURE IN HUB</b></span></div></aside>}
      </section>

      <div className="spidey-hero-dock"><PixelHero /><button type="button" onClick={() => setPanel("compose")}>ADD SIGNAL</button></div>
      <footer className="spidey-footer"><b>J—CORE</b><span>POWERED BY HERMES + OPENCLAW</span><small>{username.toUpperCase()} · PRIVATE NETWORK · {new Date().getFullYear()}</small></footer>
    </div>
  );
}
