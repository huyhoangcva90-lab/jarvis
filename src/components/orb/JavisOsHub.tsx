import { FormEvent, useMemo, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };
type NativeDashboards = { hermes: string; openclaw: string; nineRouter: string } | null;
type RealmSection = "assistant" | "brain" | "capabilities" | "work" | "connections" | "system";
type DashboardKey = "hermes" | "openclaw" | "nineRouter";

type JavisOsHubProps = {
  currentTime: string;
  username: string;
  messages: Message[];
  isSending: boolean;
  connections: any;
  nativeDashboards: NativeDashboards;
  onAskAi: (prompt: string) => void;
  onExit: () => void;
};

const sections: Array<{ id: RealmSection; code: string; label: string; detail: string }> = [
  { id: "assistant", code: "A0", label: "Trợ lý", detail: "Chat & voice" },
  { id: "brain", code: "B1", label: "Bộ não", detail: "Memory & graph" },
  { id: "capabilities", code: "C2", label: "Năng lực", detail: "Skills & agents" },
  { id: "work", code: "W3", label: "Công việc", detail: "Tasks & loops" },
  { id: "connections", code: "L4", label: "Kết nối", detail: "Models & channels" },
  { id: "system", code: "S5", label: "Hệ thống", detail: "Runtime & access" },
];

const capabilityItems = [
  ["Skills", "Bật, tắt và tổ chức năng lực dùng lại", "12 READY"],
  ["Agents", "Trợ lý chuyên biệt với memory riêng", "04 ACTIVE"],
  ["Workflows", "Chuỗi tác vụ có bước tự kiểm chứng", "07 FLOWS"],
  ["Plugins", "Tool và hook dùng chung cho mọi engine", "SUPERPOWERS"],
];

const graphNodes = [
  ["PROFILE", 50, 18], ["PROJECTS", 22, 37], ["MEMORY", 76, 37], ["TASKS", 18, 70],
  ["J-CORE", 50, 55], ["PEOPLE", 81, 70], ["SKILLS", 38, 84], ["SYSTEMS", 66, 86],
];

function JavisIcon({ name }: { name: RealmSection | "send" | "close" | "arrow" }) {
  const paths = {
    assistant: <><circle cx="12" cy="9" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 9H5v5h2M16 9h3v5h-2"/></>,
    brain: <><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5v1a3 3 0 0 0 4 3M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5v1a3 3 0 0 1-4 3M12 3v18M8 8h4M12 13h5M7 16h5"/></>,
    capabilities: <><path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
    work: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6"/></>,
    connections: <><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7 7.2 11 17M17 7.2 13 17M7 6h10"/></>,
    system: <><circle cx="12" cy="12" r="3"/><path d="M19 12h3M2 12h3M12 2v3M12 19v3M17 7l2-2M5 19l2-2M17 17l2 2M5 5l2 2"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  } as const;
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function CognitiveIris({ isSending }: { isSending: boolean }) {
  return (
    <div className={`javis-iris ${isSending ? "is-thinking" : ""}`} aria-label={isSending ? "Javis đang suy nghĩ" : "Javis sẵn sàng"}>
      <i className="javis-iris-orbit orbit-a"><b>BRAIN</b><b>SKILLS</b></i>
      <i className="javis-iris-orbit orbit-b"><b>JOBS</b><b>LINKS</b></i>
      <i className="javis-iris-grid" />
      <span className="javis-iris-core"><strong>J</strong><small>{isSending ? "THINK" : "READY"}</small></span>
      <em className="javis-iris-scan" />
    </div>
  );
}

export default function JavisOsHub({ currentTime, username, messages, isSending, connections, nativeDashboards, onAskAi, onExit }: JavisOsHubProps) {
  const [active, setActive] = useState<RealmSection>("assistant");
  const [prompt, setPrompt] = useState("");
  const [dashboard, setDashboard] = useState<DashboardKey | null>(null);
  const [tasks, setTasks] = useState([
    { id: "t1", title: "Đồng bộ J-Core server", lane: "doing" },
    { id: "t2", title: "Hoàn thiện personal map", lane: "next" },
    { id: "t3", title: "Kiểm tra OpenClaw agents", lane: "done" },
  ]);
  const recentMessages = useMemo(() => messages.slice(-5), [messages]);

  const serviceRows = [
    { id: "hermes" as const, label: "Hermes", role: "Reasoning & sessions", online: Boolean(connections?.hermes) },
    { id: "openclaw" as const, label: "OpenClaw", role: "Agents & channels", online: Boolean(connections?.openclaw) },
    { id: "nineRouter" as const, label: "9Router", role: "Models & routing", online: Boolean(connections?.nineRouter) },
  ];

  const submitPrompt = (event: FormEvent) => {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || isSending) return;
    onAskAi(`[JAVIS OS] ${value}`);
    setPrompt("");
  };

  const moveTask = (id: string) => {
    const order = ["next", "doing", "done"];
    setTasks((current) => current.map((task) => task.id === id ? { ...task, lane: order[(order.indexOf(task.lane) + 1) % order.length] } : task));
  };

  const dashboardUrl = dashboard ? nativeDashboards?.[dashboard] : "";

  return (
    <section className="javis-os-shell" aria-label="Javis Neural OS realm">
      <aside className="javis-os-sidebar">
        <header className="javis-os-brand"><span>J</span><div><b>JAVIS</b><small>NEURAL OPERATING SYSTEM</small></div></header>
        <nav aria-label="Miền điều khiển Javis">
          {sections.map((section) => (
            <button className={active === section.id ? "active" : ""} type="button" key={section.id} onClick={() => setActive(section.id)}>
              <span><JavisIcon name={section.id} /></span><b>{section.label}</b><small>{section.detail}</small><em>{section.code}</em>
            </button>
          ))}
        </nav>
        <footer><i /><div><b>{username}</b><small>PRIVATE OPERATOR</small></div><button type="button" onClick={onExit}>EXIT</button></footer>
      </aside>

      <main className="javis-os-main">
        <header className="javis-os-topbar">
          <div><small>JAVIS://{active.toUpperCase()}</small><b>{sections.find((item) => item.id === active)?.label}</b></div>
          <div className="javis-os-runtime"><span><i />LOCAL SERVER</span><span>{serviceRows.filter((item) => item.online).length}/3 LINKS</span><time>{currentTime}</time></div>
        </header>

        {active === "assistant" && (
          <div className="javis-assistant-view">
            <section className="javis-assistant-hero">
              <div className="javis-hero-copy"><small>PERSONAL INTELLIGENCE LAYER</small><h1>Chào {username}.<br/><em>Ta bắt đầu từ đâu?</em></h1><p>Chat, giao việc, gọi agent hoặc mở một hệ thống. Javis giữ nguyên công cụ khi bạn đổi bộ não.</p></div>
              <CognitiveIris isSending={isSending} />
              <div className="javis-hero-stats"><span><b>{recentMessages.length}</b><small>CONTEXT</small></span><span><b>06</b><small>DOMAINS</small></span><span><b>{serviceRows.filter((item) => item.online).length}</b><small>ONLINE</small></span></div>
            </section>
            <section className="javis-dialogue">
              <div className="javis-message-list" aria-live="polite">
                {recentMessages.length ? recentMessages.map((message) => <article className={message.role} key={message.id}><small>{message.role === "assistant" ? "JAVIS" : username.toUpperCase()}</small><p>{message.text.replace(/^\[JAVIS OS\]\s*/, "")}</p></article>) : <article><small>JAVIS</small><p>Hệ điều hành nhận thức đã sẵn sàng. Nói mục tiêu, tôi sẽ chọn bộ não và công cụ phù hợp.</p></article>}
                {isSending && <div className="javis-thinking"><i/><i/><i/><span>Đang điều phối</span></div>}
              </div>
              <form onSubmit={submitPrompt}><label htmlFor="javis-prompt">COMMAND LAYER</label><div><textarea id="javis-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Nhập mục tiêu, câu hỏi hoặc việc cần giao…"/><button type="submit" disabled={!prompt.trim() || isSending}><JavisIcon name="send"/><span>EXECUTE</span></button></div></form>
            </section>
          </div>
        )}

        {active === "brain" && (
          <div className="javis-section-view">
            <header><small>SECOND BRAIN</small><h2>Tri thức không nằm trong lịch sử chat.<br/>Nó sống thành một mạng liên kết.</h2><p>Memory, Wiki, phiên hội thoại và file cá nhân hợp thành một context có thể truy vấn.</p></header>
            <div className="javis-brain-layout">
              <section className="javis-knowledge-graph">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 55 22 37M50 55 76 37M50 55 18 70M50 55 81 70M50 55 38 84M50 55 66 86M22 37 50 18M76 37 50 18"/></svg>
                {graphNodes.map(([label, x, y]) => <button type="button" key={String(label)} style={{ left: `${x}%`, top: `${y}%` }}><i/><span>{label}</span></button>)}
              </section>
              <aside className="javis-brain-index">
                {[['Memory','48 facts','Living profile'],['Wiki','12 pages','Linked knowledge'],['Sessions',String(messages.length),'Searchable history'],['Files','LOCAL','Ubuntu workspace']].map(([label,value,detail]) => <article key={label}><small>{detail}</small><b>{label}</b><span>{value}</span></article>)}
              </aside>
            </div>
          </div>
        )}

        {active === "capabilities" && (
          <div className="javis-section-view">
            <header><small>CAPABILITY FABRIC</small><h2>Năng lực thuộc về hệ thống.<br/>Không bị khóa vào model.</h2><p>Mỗi engine dùng chung skills, plugins, agent memory và workflow có kiểm chứng.</p></header>
            <div className="javis-capability-grid">{capabilityItems.map(([label, detail, value], index) => <article key={label}><span>0{index + 1}</span><small>{value}</small><h3>{label}</h3><p>{detail}</p><button type="button">MANAGE <JavisIcon name="arrow"/></button></article>)}</div>
          </div>
        )}

        {active === "work" && (
          <div className="javis-section-view">
            <header><small>BACKGROUND WORK</small><h2>Giao mục tiêu, không giao từng cú nhấp.</h2><p>Agent tự đặc tả, chọn worker, chạy nền và chỉ gọi bạn khi có ngoại lệ.</p></header>
            <div className="javis-kanban">
              {[['next','NEXT'],['doing','IN MOTION'],['done','VERIFIED']].map(([lane,label]) => <section key={lane}><header><b>{label}</b><span>{tasks.filter((task) => task.lane === lane).length}</span></header>{tasks.filter((task) => task.lane === lane).map((task) => <button type="button" key={task.id} onClick={() => moveTask(task.id)}><small>PERSONAL GOAL</small><b>{task.title}</b><span>Nhấn để chuyển bước <JavisIcon name="arrow"/></span></button>)}</section>)}
            </div>
          </div>
        )}

        {active === "connections" && (
          <div className="javis-section-view">
            <header><small>MODEL-AGNOSTIC LINKS</small><h2>Một giao diện. Nhiều bộ não.<br/>Cùng một bộ công cụ.</h2><p>Hermes điều phối, OpenClaw vận hành agent và 9Router quyết định đường model.</p></header>
            <div className="javis-service-grid">{serviceRows.map((service) => <article className={service.online ? "online" : "offline"} key={service.id}><i/><small>{service.role}</small><h3>{service.label}</h3><span>{service.online ? "OPERATIONAL" : "OFFLINE"}</span><button type="button" disabled={!nativeDashboards?.[service.id]} onClick={() => setDashboard(service.id)}>OPEN CONTROL <JavisIcon name="arrow"/></button></article>)}</div>
          </div>
        )}

        {active === "system" && (
          <div className="javis-section-view">
            <header><small>SELF-HOSTED CORE</small><h2>Dữ liệu ở máy của bạn.<br/>Quyền kiểm soát cũng vậy.</h2><p>Một lần đăng nhập mở web, runtime, terminal và dashboard nội bộ có bảo vệ phiên.</p></header>
            <div className="javis-system-grid">
              <article><small>ACCESS</small><b>SESSION COOKIE</b><span>Đăng nhập một lần</span></article><article><small>SERVER</small><b>192.168.1.114</b><span>Private LAN appliance</span></article><article><small>KNOWLEDGE</small><b>LOCAL FIRST</b><span>Memory & files ở Ubuntu</span></article><article><small>CODE INTEL</small><b>GITNEXUS</b><span>Graph-aware engineering</span></article>
            </div>
          </div>
        )}
      </main>

      {dashboard && (
        <section className="javis-native-overlay" aria-label={`${dashboard} dashboard`}>
          <header><div><small>NATIVE CONTROL</small><b>{dashboard === "nineRouter" ? "9ROUTER" : dashboard.toUpperCase()}</b></div><button type="button" onClick={() => setDashboard(null)}><JavisIcon name="close"/> CLOSE</button></header>
          {dashboardUrl ? <iframe src={dashboardUrl} title={`${dashboard} native dashboard`}/> : <div className="javis-native-empty">Dashboard chưa sẵn sàng.</div>}
        </section>
      )}
    </section>
  );
}
