import { useEffect, useMemo, useState } from "react";
import AvengersTower from "./components/AvengersTower";
import VirtualOffice from "./components/VirtualOffice";

export type Agent = {
  id: string;
  codename: string;
  name: string;
  role: string;
  floor: string;
  color: string;
  rgb: string;
  status: "ACTIVE" | "STANDBY";
  load: number;
  description: string;
  skills: string[];
  prompt: string;
};

// Legacy realm components still consume these shared activity types.
export type AiActivity = "idle" | "listening" | "thinking" | "speaking";
export type EnergyPalette = "gold" | "blue" | "green" | "red" | "violet" | "orange";

const agents: Agent[] = [
  {
    id: "iron-man", codename: "IRON MAN", name: "Stark", role: "Chief Orchestrator", floor: "L86 — ARC LAB", color: "#ff4d38", rgb: "255,77,56", status: "ACTIVE", load: 82,
    description: "Phân rã mục tiêu, thiết kế kiến trúc và điều phối toàn bộ agent trong tower.", skills: ["System design", "Code review", "Delegation"], prompt: "Thiết kế một kế hoạch thực thi tối ưu cho nhiệm vụ mới."
  },
  {
    id: "captain", codename: "CAPTAIN", name: "Rogers", role: "Strategy Lead", floor: "L78 — WAR ROOM", color: "#4aa8ff", rgb: "74,168,255", status: "ACTIVE", load: 64,
    description: "Xác định ưu tiên, tiêu chí thành công và giữ mọi đội hình đi đúng mục tiêu.", skills: ["Planning", "Risk control", "Decision log"], prompt: "Đánh giá mục tiêu, rủi ro và chọn hướng hành động."
  },
  {
    id: "thor", codename: "THOR", name: "Odinson", role: "Infrastructure", floor: "L70 — BIFROST OPS", color: "#80d7ff", rgb: "128,215,255", status: "ACTIVE", load: 71,
    description: "Triển khai hạ tầng, giám sát dịch vụ và xử lý sự cố với tốc độ sấm sét.", skills: ["Cloud deploy", "Observability", "Incident response"], prompt: "Kiểm tra hạ tầng và đề xuất phương án triển khai an toàn."
  },
  {
    id: "hulk", codename: "HULK", name: "Banner", role: "Heavy Compute", floor: "L62 — GAMMA LAB", color: "#73e06d", rgb: "115,224,109", status: "STANDBY", load: 28,
    description: "Xử lý dữ liệu lớn, chạy kiểm thử tải và nghiền nát các bài toán tính toán nặng.", skills: ["Data processing", "Load testing", "Optimization"], prompt: "Phân tích tập dữ liệu và tìm nút thắt hiệu năng."
  },
  {
    id: "widow", codename: "BLACK WIDOW", name: "Romanoff", role: "Intel & Security", floor: "L54 — RED ROOM", color: "#ff6a8a", rgb: "255,106,138", status: "ACTIVE", load: 58,
    description: "Nghiên cứu sâu, kiểm chứng nguồn tin và rà soát các bề mặt rủi ro bảo mật.", skills: ["Deep research", "Threat review", "Verification"], prompt: "Thu thập bằng chứng, kiểm tra nguồn và viết intelligence brief."
  },
  {
    id: "hawkeye", codename: "HAWKEYE", name: "Barton", role: "Precision QA", floor: "L46 — TARGET RANGE", color: "#bd8cff", rgb: "189,140,255", status: "ACTIVE", load: 43,
    description: "Tập trung vào chi tiết, truy tìm regression và xác nhận từng tiêu chí bàn giao.", skills: ["E2E testing", "Visual QA", "Bug triage"], prompt: "Kiểm tra luồng chính và báo cáo sai lệch chính xác."
  }
];

const icons: Record<string, React.ReactElement> = {
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  signal: <><path d="M4 17a8 8 0 0 1 8-8 8 8 0 0 1 8 8"/><path d="M7 17a5 5 0 0 1 10 0"/><circle cx="12" cy="17" r="1"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  office: <><rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8M12 17v4M7 9h3v4H7zM14 8h3v5h-3z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3a1.7 1.7 0 0 0 1.1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.3.8.6 1 .3.3.7.4 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6.6Z"/></>
};

function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState(agents[0].id);
  const [filter, setFilter] = useState<"all" | "active">("all");
  const [deployed, setDeployed] = useState<string[]>([]);
  const [view, setView] = useState<"tower" | "office">("tower");
  const [clock, setClock] = useState(new Date());
  const selected = agents.find((agent) => agent.id === selectedId) ?? agents[0];
  const visibleAgents = filter === "active" ? agents.filter((a) => a.status === "ACTIVE") : agents;

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = useMemo(() => clock.toLocaleTimeString("vi-VN", { hour12: false }), [clock]);

  const deploy = () => {
    setDeployed((current) => current.includes(selected.id) ? current : [...current, selected.id]);
  };

  return (
    <main className="tower-app" style={{ "--agent": selected.color, "--agent-rgb": selected.rgb } as React.CSSProperties}>
      <a className="skip-link" href="#agent-detail">Bỏ qua tới agent đang chọn</a>
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><span>A</span></div>
        <div className="brand-copy"><strong>AVENGERS</strong><span>AI TOWER // COMMAND NETWORK</span></div>
        <div className="tower-status"><i/><span>TOWER ONLINE</span><b>{time}</b><em>VN-01</em></div>
        <button className="icon-button" aria-label="Cài đặt hệ thống"><Icon name="settings" /></button>
      </header>

      <aside className="rail" aria-label="Điều hướng chính">
        <button className={`rail-button ${view === "tower" ? "is-active" : ""}`} aria-label="Tower overview" onClick={() => setView("tower")}><Icon name="grid" /><span>HQ</span></button>
        <button className="rail-button" aria-label="Network status"><Icon name="signal" /><span>NET</span></button>
        <button className="rail-button" aria-label="Mission layers"><Icon name="layers" /><span>OPS</span></button>
        <button className={`rail-button office-rail-button ${view === "office" ? "is-active" : ""}`} aria-label="AI Agent Virtual Office" onClick={() => setView("office")}><Icon name="office" /><span>OFFICE</span></button>
        <div className="rail-line" />
        <span className="rail-code">NYC<br/>40.7°N</span>
      </aside>

      <section className="roster-panel">
        <div className="section-heading">
          <div><span>ASSEMBLE PROTOCOL</span><h1>Agent roster</h1></div>
          <b>{String(visibleAgents.length).padStart(2, "0")}</b>
        </div>
        <div className="filter-tabs" role="group" aria-label="Lọc agent">
          <button className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All agents</button>
          <button className={filter === "active" ? "is-active" : ""} onClick={() => setFilter("active")}>Active</button>
        </div>
        <div className="agent-list">
          {visibleAgents.map((agent, index) => (
            <button key={agent.id} className={`agent-row ${selected.id === agent.id ? "is-selected" : ""}`} onClick={() => setSelectedId(agent.id)} style={{ "--row-color": agent.color, "--row-rgb": agent.rgb } as React.CSSProperties}>
              <span className="agent-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="agent-avatar"><b>{agent.codename === "BLACK WIDOW" ? "BW" : agent.codename[0]}</b></span>
              <span className="agent-copy"><strong>{agent.codename}</strong><small>{agent.role}</small></span>
              <span className={`status-dot ${agent.status === "ACTIVE" ? "is-on" : ""}`} title={agent.status}/>
            </button>
          ))}
        </div>
        <div className="network-card"><span>NETWORK LOAD</span><b>63%</b><div><i style={{ width: "63%" }}/></div><small>6 agents · 4 missions live</small></div>
      </section>

      <section className="tower-stage" aria-label="Mô hình Avengers Tower tương tác">
        {view === "tower" ? <>
          <div className="stage-label"><span>STARK SYSTEMS / DIGITAL TWIN</span><b>AVENGERS TOWER</b><small>Click từng tầng để mở AI office</small></div>
          <AvengersTower agents={agents} selectedId={selected.id} onSelect={setSelectedId} />
          <div className="altitude"><span>ALT</span><b>1,130<small> FT</small></b></div>
          <div className="coordinates">40.7484° N<br/>73.9857° W</div>
          <div className="floor-key"><span style={{ background: selected.color }}/><b>{selected.floor}</b></div>
        </> : <VirtualOffice agents={agents} selectedId={selected.id} onSelect={setSelectedId} />}
      </section>

      <aside className="detail-panel" id="agent-detail">
        <div className="detail-topline"><span>AGENT PROFILE</span><b>{selected.status}</b></div>
        <div className="hero-id"><div className="hero-avatar">{selected.codename === "BLACK WIDOW" ? "BW" : selected.codename[0]}</div><div><span>{selected.name}</span><h2>{selected.codename}</h2><p>{selected.role}</p></div></div>
        <div className="floor-badge"><span>ASSIGNED OFFICE</span><b>{selected.floor}</b></div>
        <p className="agent-description">{selected.description}</p>
        <div className="capabilities"><span>CORE CAPABILITIES</span>{selected.skills.map((skill, i) => <div key={skill}><b>0{i + 1}</b><p>{skill}</p><i/></div>)}</div>
        <div className="load-block"><span>COGNITIVE LOAD</span><b>{selected.load}%</b><div><i style={{ width: `${selected.load}%` }}/></div></div>
        <div className="prompt-preview"><span>STARTER DIRECTIVE</span><p>“{selected.prompt}”</p></div>
        <button className={`deploy-button ${deployed.includes(selected.id) ? "is-deployed" : ""}`} onClick={deploy} disabled={deployed.includes(selected.id)}>
          <span>{deployed.includes(selected.id) ? "AGENT DEPLOYED" : "DEPLOY AGENT"}</span><b>{deployed.includes(selected.id) ? "✓" : "↗"}</b>
        </button>
      </aside>

      <footer className="mission-strip">
        <span>LIVE MISSIONS</span><div className="mission"><i/>RESEARCH / MARKET INTEL <b>72%</b></div><div className="mission"><i/>BUILD / CORE API <b>41%</b></div><div className="mission"><i/>VERIFY / RELEASE QA <b>88%</b></div><button>OPEN MISSION CONTROL <b>↗</b></button>
      </footer>
    </main>
  );
}
