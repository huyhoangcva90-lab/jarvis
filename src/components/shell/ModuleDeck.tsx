import { useTesseract } from '../../tesseract/useTesseract';
import { 
  modules, 
  modeBlueprints, 
  officeRooms, 
  agents, 
  hermesPanels, 
  routerProviders, 
  openClawNodes, 
  webOpsCards,
  statusCopy
} from '../../tesseract/constants';
import type { 
  OfficeRoomId, 
  ModeBlueprint,
  JCoreModule
} from '../../tesseract/tesseract';

export default function ModuleDeck() {
  const { activeModuleId, selectedRoomId, setRoom } = useTesseract();
  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0];
  const blueprint = modeBlueprints[activeModule.id];

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

      <ModeBlueprintPanel blueprint={blueprint} />

      {activeModule.id === "office" ? (
        <PurpleOffice selectedRoomId={selectedRoomId} setSelectedRoomId={setRoom} />
      ) : activeModule.id === "hermes" ? (
        <HermesDashboard />
      ) : activeModule.id === "router" ? (
        <RouterDashboard />
      ) : activeModule.id === "web" ? (
        <WebOpsDashboard />
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

function ModeBlueprintPanel({ blueprint }: { blueprint: ModeBlueprint }) {
  return (
    <section
      className={`mode-blueprint mode-${blueprint.moduleId} density-${blueprint.density}`}
      aria-label={`${blueprint.codename} visual blueprint`}
    >
      <div className="blueprint-identity">
        <span>Visual grammar</span>
        <b>{blueprint.codename}</b>
        <p>{blueprint.inspiration}</p>
      </div>
      <div className="blueprint-stage" aria-hidden="true">
        <i className="blueprint-symbol" />
        <i className="blueprint-axis axis-a" />
        <i className="blueprint-axis axis-b" />
        <i className="blueprint-axis axis-c" />
      </div>
      <div className="blueprint-rules">
        <p><span>Geometry</span>{blueprint.geometry}</p>
        <p><span>Motion</span>{blueprint.motion}</p>
        <p><span>Layout</span>{blueprint.layout}</p>
      </div>
      <div className="blueprint-layers">
        {blueprint.layers.map((layer, index) => (
          <article key={layer.label}>
            <em>{String(index + 1).padStart(2, "0")}</em>
            <div>
              <b>{layer.label}</b>
              <span>{layer.detail}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
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

function WebOpsDashboard() {
  return (
    <div className="webops-dashboard">
      <section className="webops-hero">
        <div>
          <span>Spider Core</span>
          <h2>Spider-sense web net</h2>
          <p>
            Một dạng riêng cho J-Core: nhanh, linh hoạt, bám link, kiểm tra web UI, browser automation và monitor quota/dashboard.
          </p>
        </div>
        <div className="web-diagram" aria-hidden="true">
          <i className="web-node node-a" />
          <i className="web-node node-b" />
          <i className="web-node node-c" />
          <i className="web-node node-d" />
          <i className="web-line line-a" />
          <i className="web-line line-b" />
          <i className="web-line line-c" />
          <i className="web-line line-d" />
        </div>
      </section>

      <div className="webops-grid">
        {webOpsCards.map((card) => (
          <article key={card.id} className={`webops-${card.status}`}>
            <span>{card.label}</span>
            <b>{card.value}</b>
            <p>{card.detail}</p>
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
  const officePositions =
    selectedRoomId === "lobby"
      ? [
          [18, 36],
          [45, 31],
          [72, 36],
          [18, 64],
          [45, 60],
          [72, 64],
          [45, 76]
        ]
      : [[50, 58]];

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
                left: `${officePositions[index % officePositions.length][0]}%`,
                top: `${officePositions[index % officePositions.length][1]}%`
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
