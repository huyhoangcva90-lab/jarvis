import { FormEvent, useMemo, useState } from "react";
import javisLogo from "../../../external/javis-os/dashboard/logo.png";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };
type NativeDashboards = { hermes: string; openclaw: string; nineRouter: string } | null;
type RealmSection = "assistant" | "brain" | "capabilities" | "work" | "connections" | "system";

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
  { id: "assistant", code: "A0", label: "Assistant", detail: "Voice dashboard" },
  { id: "brain", code: "B1", label: "Second Brain", detail: "Wiki + memory graph" },
  { id: "capabilities", code: "C2", label: "Skills", detail: "Plugins + MCP tools" },
  { id: "work", code: "W3", label: "Agents", detail: "Workflows + loops" },
  { id: "connections", code: "L4", label: "Models", detail: "Claude, Codex, OpenRouter" },
  { id: "system", code: "S5", label: "Self-host", detail: "Docker/VPS/Windows" },
];

const JAVIS_MODULES = [
  ["Voice", "Hands-free talk, Edge/OpenAI/ElevenLabs TTS", "READY"],
  ["Second Brain", "Memory, wiki pages, session search, wikilinks", "GRAPH"],
  ["MCP Hub", "Shared tools for every model engine", "TOOLS"],
  ["Skills", "Enable, disable, edit and package abilities", "PACKS"],
  ["Plugins", "Drop-in Python native tools and hooks", "NATIVE"],
  ["Agents", "Specialist helpers with private memory", "WORKERS"],
  ["Workflows", "Multi-step verified automation chains", "FLOWS"],
  ["Recurring Jobs", "Loops, reminders, scheduled background work", "CRON"],
];

function JavisIcon({ name }: { name: RealmSection | "send" | "arrow" }) {
  const paths = {
    assistant: <><circle cx="12" cy="9" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 9H5v5h2M16 9h3v5h-2"/></>,
    brain: <><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5v1a3 3 0 0 0 4 3M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5v1a3 3 0 0 1-4 3M12 3v18M8 8h4M12 13h5M7 16h5"/></>,
    capabilities: <><path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
    work: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6"/></>,
    connections: <><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7 7.2 11 17M17 7.2 13 17M7 6h10"/></>,
    system: <><circle cx="12" cy="12" r="3"/><path d="M19 12h3M2 12h3M12 2v3M12 19v3M17 7l2-2M5 19l2-2M17 17l2 2M5 5l2 2"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  } as const;
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function JavisBrainGraph() {
  const nodes = [["YOU", 50, 18], ["MEMORY", 24, 36], ["WIKI", 74, 36], ["MCP", 20, 67], ["JAVIS", 50, 56], ["SKILLS", 80, 67], ["AGENTS", 38, 86], ["LOOPS", 64, 86]];
  return (
    <section className="javis-knowledge-graph javis-native-graph">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 56 24 36M50 56 74 36M50 56 20 67M50 56 80 67M50 56 38 86M50 56 64 86M24 36 50 18M74 36 50 18"/></svg>
      {nodes.map(([label, x, y]) => <button type="button" key={String(label)} style={{ left: `${x}%`, top: `${y}%` }}><i/><span>{label}</span></button>)}
    </section>
  );
}

export default function JavisOsHub({ currentTime, username, messages, isSending, connections, onAskAi, onExit }: JavisOsHubProps) {
  const [active, setActive] = useState<RealmSection>("assistant");
  const [prompt, setPrompt] = useState("");
  const recentMessages = useMemo(() => messages.slice(-5), [messages]);
  const onlineCount = [connections?.hermes, connections?.openclaw, connections?.nineRouter].filter(Boolean).length;

  const submitPrompt = (event: FormEvent) => {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || isSending) return;
    onAskAi(`[JAVIS OS] ${value}`);
    setPrompt("");
  };

  return (
    <section className="javis-os-shell javis-native-shell" aria-label="Javis OS native realm">
      <aside className="javis-os-sidebar">
        <header className="javis-os-brand"><img src={javisLogo} alt="" /><div><b>JAVIS OS</b><small>external/javis-os</small></div></header>
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
          <div><small>NO IFRAME · CLONED DASHBOARD DNA</small><b>{sections.find((item) => item.id === active)?.label}</b></div>
          <div className="javis-os-runtime"><span><i />SELF-HOST CORE</span><span>{onlineCount}/3 LOCAL LINKS</span><time>{currentTime}</time></div>
        </header>

        {active === "assistant" && (
          <div className="javis-assistant-view javis-native-assistant">
            <section className="javis-assistant-hero">
              <div className="javis-hero-copy">
                <small>MODEL-AGNOSTIC AGENTIC OS</small>
                <h1>Javis OS đã được bê vào J-Core.<br/><em>Không còn dashboard custom trống.</em></h1>
                <p>Repo gốc mô tả một AI agentic tự host: voice, Second Brain, MCP tools, skills, plugins, workflows, recurring jobs và multi-model brain switching.</p>
              </div>
              <div className="javis-native-logo-orb"><img src={javisLogo} alt="Javis OS logo from cloned repository" /><span>{isSending ? "THINK" : "READY"}</span></div>
              <div className="javis-hero-stats"><span><b>07</b><small>BRAINS</small></span><span><b>08</b><small>MODULES</small></span><span><b>{onlineCount}</b><small>ONLINE</small></span></div>
            </section>
            <section className="javis-dialogue">
              <div className="javis-message-list" aria-live="polite">
                {recentMessages.length ? recentMessages.map((message) => <article className={message.role} key={message.id}><small>{message.role === "assistant" ? "JAVIS" : username.toUpperCase()}</small><p>{message.text.replace(/^\[JAVIS OS\]\s*/, "")}</p></article>) : <article><small>JAVIS OS</small><p>Voice-first command layer ready. Nói mục tiêu, Javis chọn brain/provider và công cụ phù hợp.</p></article>}
                {isSending && <div className="javis-thinking"><i/><i/><i/><span>Đang điều phối</span></div>}
              </div>
              <form onSubmit={submitPrompt}><label htmlFor="javis-prompt">COMMAND LAYER</label><div><textarea id="javis-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Nhập mục tiêu, câu hỏi hoặc việc cần giao…"/><button type="submit" disabled={!prompt.trim() || isSending}><JavisIcon name="send"/><span>EXECUTE</span></button></div></form>
            </section>
          </div>
        )}

        {active !== "assistant" && (
          <div className="javis-section-view javis-native-module-view">
            <header><small>FROM external/javis-os README + dashboard</small><h2>{sections.find((item) => item.id === active)?.label}</h2><p>Module này đang dùng cấu trúc thật của Javis OS: tự host, model-agnostic, có voice, brain, MCP hub, skills/plugins và background workers.</p></header>
            <div className="javis-native-layout">
              <JavisBrainGraph />
              <div className="javis-capability-grid">
                {JAVIS_MODULES.map(([label, detail, value], index) => <article key={label}><span>0{index + 1}</span><small>{value}</small><h3>{label}</h3><p>{detail}</p><button type="button">NATIVE <JavisIcon name="arrow"/></button></article>)}
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}
