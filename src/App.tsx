import { useEffect, useMemo, useState } from "react";
import LivingOrb3D from "./jcore/LivingOrb3D";
import {
  agents,
  emotions,
  hermesPanels,
  modules,
  openClawNodes,
  officeRooms,
  routerProviders,
  statusCopy,
  type AiEmotion,
  type JCoreModule,
  type ModuleId,
  type OfficeRoom,
  type OfficeRoomId
} from "./jcore/model";

const UI_STATE_KEY = "jcore.ui.v2";
const moduleIds = modules.map((module) => module.id);
const emotionIds = Object.keys(emotions);
const roomIds = officeRooms.map((room) => room.id);

type PersistedUiState = {
  activeModuleId?: ModuleId;
  emotion?: AiEmotion;
  selectedRoomId?: OfficeRoomId;
};

// Legacy 3D tower/office components still import this shared shape during typecheck.
// The new shell does not render them directly, but keeping the contract prevents
// old modules from breaking while we migrate them into proper J-Core modules.
export type Agent = {
  id: string;
  codename: string;
  name: string;
  role: string;
  floor: string;
  room: string;
  equipment: string;
  station: string;
  color: string;
  rgb: string;
  status: "ACTIVE" | "STANDBY";
  load: number;
  description: string;
  skills: string[];
  prompt: string;
};

function readUiState(): PersistedUiState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(UI_STATE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedUiState;
  } catch {
    return {};
  }
}

function sanitizeUiState(state: PersistedUiState) {
  const activeModuleId: ModuleId =
    state.activeModuleId && moduleIds.includes(state.activeModuleId) ? state.activeModuleId : "chat";
  const emotion: AiEmotion = state.emotion && emotionIds.includes(state.emotion) ? state.emotion : "calm";
  const selectedRoomId: OfficeRoomId =
    state.selectedRoomId && roomIds.includes(state.selectedRoomId) ? state.selectedRoomId : "lobby";

  return {
    activeModuleId,
    emotion,
    selectedRoomId
  } satisfies Required<PersistedUiState>;
}

function useClock() {
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () =>
      clock.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }),
    [clock]
  );
}

function LivingOrb({ emotion }: { emotion: AiEmotion }) {
  const state = emotions[emotion];

  return (
    <section
      className={`living-orb-card emotion-${emotion}`}
      style={{ "--emotion": state.color, "--emotion-rgb": state.rgb } as React.CSSProperties}
      aria-label={`J-Core emotional state: ${state.label}`}
    >
      <div className="orb-meta">
        <span>Living Intelligence</span>
        <b>{state.label}</b>
      </div>
      <LivingOrb3D emotion={emotion} state={state} />
      <div className="orb-state-readout">
        <p>{state.description}</p>
        <div>
          <span>Tempo</span>
          <b>{state.tempo}</b>
        </div>
      </div>
    </section>
  );
}

function ModuleRail({
  activeModule,
  setActiveModule
}: {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
}) {
  return (
    <nav className="module-rail" aria-label="J-Core modules">
      <div className="rail-brand">
        <span>J</span>
      </div>
      {modules.map((module) => (
        <button
          key={module.id}
          className={activeModule === module.id ? "is-active" : ""}
          style={{ "--module": module.color, "--module-rgb": module.rgb } as React.CSSProperties}
          onClick={() => setActiveModule(module.id)}
          aria-label={module.label}
        >
          <b>{module.icon}</b>
          <span>{module.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SignalGrid({ activeModule }: { activeModule: JCoreModule }) {
  return (
    <div className="signal-grid">
      <article>
        <span>Signal</span>
        <b>{activeModule.signal}</b>
        <p>Trạng thái chính của module hiện tại.</p>
      </article>
      <article>
        <span>Metric</span>
        <b>{activeModule.metric}</b>
        <p>Chỉ số ngắn để nhìn là hiểu ngay.</p>
      </article>
      <article>
        <span>Next action</span>
        <b>Design → wire → adapter</b>
        <p>UI chạy mock trước, backend nối sau.</p>
      </article>
    </div>
  );
}

function HermesDashboard() {
  return (
    <div className="hermes-dashboard">
      <section className="runtime-hero">
        <div>
          <span>Hermes Control Plane</span>
          <h2>Local-first agent brain</h2>
          <p>
            J-Core sẽ đọc status, sessions, config, env, analytics, cron, skills và logs từ Hermes API/dashboard.
          </p>
        </div>
        <div className="runtime-endpoints">
          <b>API</b>
          <code>http://127.0.0.1:8642</code>
          <b>Dashboard</b>
          <code>http://127.0.0.1:9119</code>
        </div>
      </section>

      <div className="runtime-grid">
        {hermesPanels.map((panel) => (
          <article key={panel.id} className={`health-${panel.health}`}>
            <span>{panel.label}</span>
            <b>{panel.value}</b>
            <p>{panel.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function RouterDashboard() {
  const totalUsed = Math.round(
    routerProviders.reduce((sum, provider) => sum + provider.used, 0) / routerProviders.length
  );

  return (
    <div className="router-dashboard">
      <section className="router-summary">
        <div>
          <span>9Router quota & fallback</span>
          <h2>{totalUsed}%</h2>
          <p>Mock quota hiện tại. Sau này adapter sẽ gọi local 9Router/OpenAI-compatible gateway.</p>
        </div>
        <div>
          <b>Endpoint</b>
          <code>http://127.0.0.1:20128/v1</code>
          <small>Hermes nên trỏ model provider về endpoint này.</small>
        </div>
      </section>

      <div className="provider-list">
        {routerProviders.map((provider) => (
          <article key={provider.id} className={`provider-${provider.status}`}>
            <header>
              <span>{provider.tier}</span>
              <b>{provider.name}</b>
              <em>{provider.status}</em>
            </header>
            <div className="quota-bar">
              <i style={{ width: `${provider.used}%` }} />
            </div>
            <footer>
              <p>{provider.models}</p>
              <p>{provider.latency}</p>
              <p>{provider.cost}</p>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

function OpenClawDashboard() {
  return (
    <div className="openclaw-dashboard">
      <section className="runtime-hero openclaw-hero">
        <div>
          <span>OpenClaw Gateway</span>
          <h2>Fleet bridge</h2>
          <p>
            J-Core sẽ đọc `openclaw dashboard --json`, lấy Control UI URL, HTTP URL, WS URL, port và trạng thái token.
          </p>
        </div>
        <div className="runtime-endpoints">
          <b>CLI</b>
          <code>openclaw dashboard --json</code>
          <b>Events</b>
          <code>wsUrl → J-Core event bus</code>
        </div>
      </section>

      <div className="openclaw-grid">
        {openClawNodes.map((node) => (
          <article key={node.id} className={`node-${node.status}`}>
            <i />
            <span>{node.label}</span>
            <b>{node.value}</b>
            <em>{node.status}</em>
          </article>
        ))}
      </div>

      <div className="fleet-roster">
        {agents.map((agent) => (
          <article key={agent.id} style={{ "--agent": agent.color } as React.CSSProperties}>
            <div>
              <span>{agent.runtime}</span>
              <b>{agent.character}</b>
              <p>{agent.task}</p>
            </div>
            <em>{agent.heartbeat}</em>
            <small>{agent.tool}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function PurpleOffice({
  selectedRoomId,
  setSelectedRoomId
}: {
  selectedRoomId: OfficeRoomId;
  setSelectedRoomId: (room: OfficeRoomId) => void;
}) {
  const selectedRoom = officeRooms.find((room) => room.id === selectedRoomId) ?? officeRooms[officeRooms.length - 1];
  const roomAgents = selectedRoomId === "lobby" ? agents : agents.filter((agent) => agent.room === selectedRoomId);

  return (
    <div
      className="purple-office-preview"
      style={{ "--room": selectedRoom.color, "--room-rgb": selectedRoom.rgb } as React.CSSProperties}
    >
      <div className="office-tower-map" aria-label="Avengers tower rooms">
        {officeRooms.map((room) => (
          <button
            key={room.id}
            className={selectedRoomId === room.id ? "is-live" : ""}
            style={{ "--room": room.color, "--room-rgb": room.rgb } as React.CSSProperties}
            onClick={() => setSelectedRoomId(room.id)}
          >
            <span>{room.floor}</span>
            <b>{room.label}</b>
          </button>
        ))}
      </div>

      <div className="office-room-stage">
        <div className="room-title">
          <span>Purple Realm / {selectedRoom.floor}</span>
          <b>{selectedRoom.label}</b>
          <small>{selectedRoom.purpose}</small>
        </div>
        <div className="holo-table" />
        <div className="office-console-wall">
          <b>runtime</b>
          <span>Hermes</span>
          <span>OpenClaw</span>
          <span>9Router</span>
        </div>
        <div className="office-approval-gate">
          <b>Human Gate</b>
          <span>2 pending</span>
        </div>
        <div className="room-grid-lines" />

        {roomAgents.map((agent, index) => (
          <button
            key={agent.id}
            className={`chibi-card status-${agent.status}`}
            style={
              {
                "--agent": agent.color,
                left: `${18 + (index % 3) * 30}%`,
                top: `${38 + Math.floor(index / 3) * 32}%`
              } as React.CSSProperties
            }
            aria-label={`${agent.character}, ${agent.role}, ${statusCopy[agent.status]}`}
          >
            <i />
            <b>{agent.character}</b>
            <span>{statusCopy[agent.status]}</span>
          </button>
        ))}

        {roomAgents.length === 0 ? (
          <div className="empty-room">
            <b>No agent assigned</b>
            <span>Room sẵn sàng, chưa có agent đứng trực.</span>
          </div>
        ) : null}
      </div>

      <aside className="office-room-inspector">
        <span>Room inspector</span>
        <h3>{selectedRoom.label}</h3>
        <p>{selectedRoom.purpose}</p>
        <div>
          <b>{String(roomAgents.length).padStart(2, "0")}</b>
          <small>agent visible</small>
        </div>
      </aside>
    </div>
  );
}

function ModuleDeck({
  activeModule,
  selectedRoomId,
  setSelectedRoomId
}: {
  activeModule: JCoreModule;
  selectedRoomId: OfficeRoomId;
  setSelectedRoomId: (room: OfficeRoomId) => void;
}) {
  return (
    <section
      className="module-deck"
      style={{ "--module": activeModule.color, "--module-rgb": activeModule.rgb } as React.CSSProperties}
    >
      <div className="deck-heading">
        <span>{activeModule.eyebrow}</span>
        <h1>{activeModule.label}</h1>
        <p>{activeModule.summary}</p>
      </div>

      {activeModule.id === "office" ? (
        <PurpleOffice selectedRoomId={selectedRoomId} setSelectedRoomId={setSelectedRoomId} />
      ) : activeModule.id === "hermes" ? (
        <HermesDashboard />
      ) : activeModule.id === "router" ? (
        <RouterDashboard />
      ) : activeModule.id === "openclaw" || activeModule.id === "agents" ? (
        <OpenClawDashboard />
      ) : (
        <SignalGrid activeModule={activeModule} />
      )}

      <div className="mission-timeline" aria-label="J-Core upgrade timeline">
        {["Shell", "Orb states", "Office rooms", "Adapters", "Hermes", "Ubuntu"].map((item, index) => (
          <div key={item} className={index <= 2 ? "is-done" : ""}>
            <i />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContextRail({ emotion }: { emotion: AiEmotion }) {
  return (
    <aside className="context-rail">
      <section>
        <span className="panel-kicker">Agent pulse</span>
        <div className="agent-stack">
          {agents.map((agent) => (
            <article key={agent.id} style={{ "--agent": agent.color } as React.CSSProperties}>
              <div>
                <b>{agent.character}</b>
                <span>{agent.role}</span>
              </div>
              <em>{statusCopy[agent.status]}</em>
              <i style={{ width: `${agent.load}%` }} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <span className="panel-kicker">Approvals</span>
        <div className="approval-card">
          <b>2 waiting</b>
          <p>Deploy, file write, terminal, public tunnel sẽ cần human gate.</p>
        </div>
      </section>

      <section>
        <span className="panel-kicker">Hermes / 9Router</span>
        <div className="health-list">
          <p>
            <i className="ok" /> Hermes API: planned
          </p>
          <p>
            <i className="ok" /> 9Router: local provider
          </p>
          <p>
            <i className={emotion === "alert" ? "bad" : "ok"} /> UI state: {emotions[emotion].label}
          </p>
        </div>
      </section>
    </aside>
  );
}

function CommandComposer({ setEmotion }: { setEmotion: (emotion: AiEmotion) => void }) {
  return (
    <section className="command-composer">
      <div>
        <span>Command</span>
        <input
          aria-label="Command input"
          placeholder="Nói với J-Core: lập plan, mở office, kiểm tra Hermes, gửi mission..."
          onFocus={() => setEmotion("listening")}
          onBlur={() => setEmotion("calm")}
        />
      </div>
      <button onClick={() => setEmotion("thinking")}>Think</button>
      <button onClick={() => setEmotion("speaking")}>Reply</button>
    </section>
  );
}

export default function App() {
  const initialUiState = useMemo(() => sanitizeUiState(readUiState()), []);
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(initialUiState.activeModuleId);
  const [emotion, setEmotion] = useState<AiEmotion>(initialUiState.emotion);
  const [selectedRoomId, setSelectedRoomId] = useState<OfficeRoomId>(initialUiState.selectedRoomId);
  const time = useClock();

  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0];
  const emotionState = emotions[emotion];

  useEffect(() => {
    window.localStorage.setItem(
      UI_STATE_KEY,
      JSON.stringify({
        activeModuleId,
        emotion,
        selectedRoomId
      } satisfies PersistedUiState)
    );
  }, [activeModuleId, emotion, selectedRoomId]);

  return (
    <main
      className="jcore-shell"
      style={
        {
          "--active": activeModule.color,
          "--active-rgb": activeModule.rgb,
          "--emotion": emotionState.color,
          "--emotion-rgb": emotionState.rgb
        } as React.CSSProperties
      }
    >
      <a className="skip-link" href="#main-workspace">
        Skip to workspace
      </a>
      <ModuleRail activeModule={activeModuleId} setActiveModule={setActiveModuleId} />

      <header className="jcore-topbar">
        <div>
          <span>J-Core Console</span>
          <b>AI Command System</b>
        </div>
        <div className="topbar-status">
          <p>
            <i /> Local UI
          </p>
          <p>Hermes bridge: planned</p>
          <p>9Router: planned</p>
          <time>{time}</time>
        </div>
      </header>

      <section className="emotion-switcher" aria-label="AI emotional states">
        {Object.entries(emotions).map(([id, value]) => (
          <button
            key={id}
            className={emotion === id ? "is-active" : ""}
            style={{ "--state": value.color, "--state-rgb": value.rgb } as React.CSSProperties}
            onClick={() => setEmotion(id as AiEmotion)}
          >
            <i />
            <span>{value.label}</span>
          </button>
        ))}
      </section>

      <div className="main-workspace" id="main-workspace">
        <LivingOrb emotion={emotion} />
        <ModuleDeck
          activeModule={activeModule}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </div>

      <ContextRail emotion={emotion} />
      <CommandComposer setEmotion={setEmotion} />
    </main>
  );
}
