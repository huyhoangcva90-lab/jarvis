import { useMemo, useState, type CSSProperties } from "react";
import type { EnergyPalette } from "../App";

export type LocalEndpoints = {
  hermes: string;
  openclaw: string;
  nineRouter: string;
};

type RealmDesktopProps = {
  palette: EnergyPalette;
  endpoints: LocalEndpoints;
  onSelect: (palette: EnergyPalette) => void;
};

const REALMS: Array<{ id: EnergyPalette; short: string; title: string; subtitle: string }> = [
  { id: "gold", short: "MI", title: "MIND", subtitle: "Memory / Dev" },
  { id: "blue", short: "SP", title: "SPACE", subtitle: "9Router Gateway" },
  { id: "green", short: "TM", title: "TIME", subtitle: "Terminal / Schedule" },
  { id: "red", short: "RL", title: "REALITY", subtitle: "Finance Console" },
  { id: "violet", short: "PW", title: "POWER", subtitle: "Agent Office" },
  { id: "orange", short: "SO", title: "SOUL", subtitle: "Personal Brain" }
];

function endpointFor(palette: EnergyPalette, endpoints: LocalEndpoints) {
  if (palette === "blue") return endpoints.nineRouter;
  if (palette === "violet") return endpoints.openclaw;
  if (palette === "gold" || palette === "orange") return endpoints.hermes;
  return "";
}

function RealmGlyph({ id }: { id: EnergyPalette }) {
  return <span className={`realm-glyph glyph-${id}`} aria-hidden="true"><i /><b /></span>;
}

function StatusLine({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "good" | "warn" }) {
  return <div className={`realm-status-line ${tone}`}><span>{label}</span><b>{value}</b></div>;
}

function RealmContent({ id, endpoints }: { id: EnergyPalette; endpoints: LocalEndpoints }) {
  if (id === "blue") return (
    <>
      <div className="realm-hero-stat"><span>ROUTING FABRIC</span><b>9ROUTER</b><small>{endpoints.nineRouter}</small></div>
      <div className="provider-grid">
        {["OpenAI", "Anthropic", "Google", "Local"].map((name, index) => <div key={name}><span>{name}</span><i style={{ "--fill": `${82 - index * 13}%` } as CSSProperties} /><b>{82 - index * 13}%</b></div>)}
      </div>
      <StatusLine label="POLICY" value="AUTO / COST AWARE" tone="good" />
      <StatusLine label="TELEMETRY" value="AWAITING LOCAL LINK" />
    </>
  );
  if (id === "green") return (
    <>
      <div className="temporal-readout"><span>LOCAL TIME</span><b>{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</b></div>
      <StatusLine label="NEXT WINDOW" value="DEEP WORK / 45 MIN" tone="good" />
      <StatusLine label="TERMINAL" value="STANDBY" />
      <div className="mini-terminal"><span>&gt; temporal scan</span><span>timeline stable</span><span>operator focus available</span></div>
    </>
  );
  if (id === "red") return (
    <>
      <div className="realm-hero-stat"><span>PRIVATE LEDGER</span><b>FINANCE</b><small>LOCAL DATA ONLY</small></div>
      <div className="ledger-bars"><i style={{ height: "38%" }} /><i style={{ height: "62%" }} /><i style={{ height: "48%" }} /><i style={{ height: "78%" }} /><i style={{ height: "69%" }} /><i style={{ height: "88%" }} /></div>
      <StatusLine label="MONTHLY FLOW" value="NOT CONNECTED" tone="warn" />
      <StatusLine label="RISK WATCH" value="READY" tone="good" />
    </>
  );
  if (id === "violet") return (
    <>
      <div className="realm-hero-stat"><span>AI COMPANY</span><b>VIRTUAL OFFICE</b><small>{endpoints.openclaw}</small></div>
      <div className="agent-office">
        {["COORDINATOR", "RESEARCH", "BUILDER", "REVIEWER", "OPS", "MEMORY"].map((agent, index) => <div key={agent}><i className={index < 2 ? "active" : ""} /><span>{agent}</span><b>{index < 2 ? "ACTIVE" : "STANDBY"}</b></div>)}
      </div>
    </>
  );
  if (id === "orange") return (
    <>
      <div className="realm-hero-stat"><span>PERSONAL CORTEX</span><b>BRAIN MAP</b><small>{endpoints.hermes}</small></div>
      <div className="brain-stream">
        <div><span>01</span><p>Agent activity and decisions</p><b>TRACKING</b></div>
        <div><span>02</span><p>Personal context and routines</p><b>LOCAL</b></div>
        <div><span>03</span><p>Cross-module event memory</p><b>READY</b></div>
      </div>
    </>
  );
  return (
    <>
      <div className="realm-hero-stat"><span>COGNITIVE CORE</span><b>MEMORY / DEV</b><small>{endpoints.hermes}</small></div>
      <StatusLine label="LONG MEMORY" value="LOCAL STORAGE" tone="good" />
      <StatusLine label="DEV BRIDGE" value="HERMES" />
      <StatusLine label="CONTEXT" value="OPERATOR PROFILE READY" tone="good" />
      <div className="memory-pulses"><i /><i /><i /><i /><i /></div>
    </>
  );
}

export default function RealmDesktop({ palette, endpoints, onSelect }: RealmDesktopProps) {
  const [open, setOpen] = useState<EnergyPalette[]>([]);
  const [minimized, setMinimized] = useState<EnergyPalette[]>([]);
  const [probe, setProbe] = useState<Record<string, "checking" | "online" | "offline">>({});
  const realmMap = useMemo(() => new Map(REALMS.map((realm) => [realm.id, realm])), []);

  const launch = (id: EnergyPalette) => {
    onSelect(id);
    setOpen((current) => current.includes(id) ? current : [...current, id]);
    setMinimized((current) => current.filter((item) => item !== id));
  };

  const check = async (id: EnergyPalette) => {
    const endpoint = endpointFor(id, endpoints);
    if (!endpoint) return;
    setProbe((current) => ({ ...current, [id]: "checking" }));
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2600);
    try {
      await fetch(endpoint, { mode: "no-cors", cache: "no-store", signal: controller.signal });
      setProbe((current) => ({ ...current, [id]: "online" }));
    } catch {
      setProbe((current) => ({ ...current, [id]: "offline" }));
    } finally {
      window.clearTimeout(timer);
    }
  };

  return (
    <div className="realm-desktop">
      <nav className="realm-dock" aria-label="Six core modules">
        {REALMS.map((realm) => (
          <button className={palette === realm.id ? "active" : ""} key={realm.id} type="button" onClick={() => launch(realm.id)} title={`${realm.title}: ${realm.subtitle}`}>
            <RealmGlyph id={realm.id} /><span>{realm.short}</span>
          </button>
        ))}
      </nav>

      <div className="realm-window-layer">
        {open.filter((id) => !minimized.includes(id)).map((id, index) => {
          const realm = realmMap.get(id)!;
          const endpoint = endpointFor(id, endpoints);
          return (
            <section className={`realm-window realm-${id}`} style={{ "--window-index": index } as CSSProperties} key={id} aria-label={`${realm.title} module`}>
              <header>
                <div><RealmGlyph id={id} /><span>{realm.title}</span><small>{realm.subtitle}</small></div>
                <nav>
                  <button type="button" aria-label="Thu nhỏ" onClick={() => setMinimized((current) => [...current, id])}>_</button>
                  <button type="button" aria-label="Đóng" onClick={() => setOpen((current) => current.filter((item) => item !== id))}>×</button>
                </nav>
              </header>
              <div className="realm-window-body">
                <RealmContent id={id} endpoints={endpoints} />
              </div>
              <footer>
                <span className={`probe-dot ${probe[id] || "idle"}`} />
                <b>{probe[id] === "checking" ? "PROBING" : probe[id] === "online" ? "LINK DETECTED" : probe[id] === "offline" ? "OFFLINE / BLOCKED" : endpoint ? "LOCAL LINK UNTESTED" : "LOCAL MODULE"}</b>
                {endpoint && <button type="button" onClick={() => check(id)}>TEST</button>}
              </footer>
            </section>
          );
        })}
      </div>

      {minimized.length > 0 && <nav className="realm-taskbar" aria-label="Minimized modules">{minimized.map((id) => <button key={id} type="button" onClick={() => launch(id)}><RealmGlyph id={id} /><span>{realmMap.get(id)?.title}</span></button>)}</nav>}
    </div>
  );
}
