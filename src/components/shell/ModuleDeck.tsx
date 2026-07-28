import { useState } from 'react';
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
  const [showOfficeModal, setShowOfficeModal] = useState(false);
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
        <OfficeSubAppLauncher onOpenModal={() => setShowOfficeModal(true)} />
      ) : activeModule.id === "settings" ? (
        <BalancedSettingsDashboard />
      ) : activeModule.id === "hermes" ? (
        <HermesDashboard />
      ) : activeModule.id === "router" ? (
        <RouterDashboard />
      ) : activeModule.id === "web" ? (
        <WebOpsDashboard />
      ) : activeModule.id === "openclaw" || activeModule.id === "agents" ? (
        <OpenClawDashboard onLaunchOffice={() => setShowOfficeModal(true)} />
      ) : (
        <SignalGrid activeModule={activeModule} />
      )}

      {/* Avengers Virtual Office Modal Sub-App */}
      {showOfficeModal && (
        <div 
          className="office-subapp-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(5, 7, 12, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ color: '#b56dff', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase' }}>
                🟣 Power Realm Sub-App
              </span>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#eef7fb' }}>Avengers Agent Virtual Office</h2>
            </div>
            <button
              onClick={() => setShowOfficeModal(false)}
              style={{
                background: 'rgba(255, 105, 120, 0.2)',
                border: '1px solid rgba(255, 105, 120, 0.4)',
                color: '#ff6978',
                padding: '6px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px'
              }}
            >
              ✕ Close Sub-App
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <PurpleOffice selectedRoomId={selectedRoomId} setSelectedRoomId={setRoom} />
          </div>
        </div>
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

function OfficeSubAppLauncher({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div style={{
      padding: '24px',
      background: 'rgba(181, 109, 255, 0.08)',
      border: '1px solid rgba(181, 109, 255, 0.25)',
      borderRadius: '8px',
      textAlign: 'center',
      margin: '16px 0'
    }}>
      <span style={{ color: '#b56dff', fontSize: '11px', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>
        Sub-App Direct Trực Thuộc Module Tím (Power Realm)
      </span>
      <h3 style={{ color: '#eef7fb', margin: '8px 0 12px 0' }}>Avengers Virtual Office Sub-App</h3>
      <p style={{ color: '#778996', fontSize: '13px', maxWidth: '480px', margin: '0 auto 16px auto' }}>
        Ứng dụng 2D Chibi Virtual Office là sub-app trực thuộc Module Tím (Power/Agents). 
        Bấm nút bên dưới để mở toàn bộ sơ đồ phòng làm việc của biệt đội Agent.
      </p>
      <button
        onClick={onOpenModal}
        style={{
          background: 'linear-gradient(135deg, #b56dff 0%, #7d33ff 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(181, 109, 255, 0.4)'
        }}
      >
        🍇 Launch Virtual Office Sub-App
      </button>
    </div>
  );
}

function BalancedSettingsDashboard() {
  const { setEmotion } = useTesseract();
  const [username, setUsername] = useState('Operator Huy');
  const [persona, setPersona] = useState('JARVIS Tesseract');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState('1234');
  const [hermesUrl, setHermesUrl] = useState('http://127.0.0.1:8642');
  const [routerUrl, setRouterUrl] = useState('http://127.0.0.1:20128/v1');
  const [openclawUrl, setOpenclawUrl] = useState('http://127.0.0.1:18789');

  return (
    <div className="settings-balanced-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '16px 0' }}>
      {/* Box 1: Profile & Audio */}
      <article style={{ background: 'rgba(9, 13, 21, 0.65)', border: '1px solid rgba(175, 220, 240, 0.15)', padding: '16px', borderRadius: '6px' }}>
        <header style={{ borderBottom: '1px solid rgba(175, 220, 240, 0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', color: '#778996', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>Console Identity</span>
          <h4 style={{ margin: '2px 0 0 0', color: '#69e8ff' }}>Operator Profile</h4>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', fontFamily: 'IBM Plex Mono' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            Username
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ background: 'rgba(5, 7, 12, 0.8)', border: '1px solid rgba(175, 220, 240, 0.2)', color: '#eef7fb', padding: '6px 10px', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            AI Persona Name
            <input 
              value={persona} 
              onChange={(e) => setPersona(e.target.value)} 
              style={{ background: 'rgba(5, 7, 12, 0.8)', border: '1px solid rgba(175, 220, 240, 0.2)', color: '#eef7fb', padding: '6px 10px', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={soundEnabled} 
              onChange={(e) => setSoundEnabled(e.target.checked)} 
            />
            Enable Web Audio Sound FX Cues
          </label>
        </div>
      </article>

      {/* Box 2: Security Lock */}
      <article style={{ background: 'rgba(9, 13, 21, 0.65)', border: '1px solid rgba(175, 220, 240, 0.15)', padding: '16px', borderRadius: '6px' }}>
        <header style={{ borderBottom: '1px solid rgba(175, 220, 240, 0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', color: '#778996', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>Security Protocol</span>
          <h4 style={{ margin: '2px 0 0 0', color: '#f5b73f' }}>Console Lock & PIN</h4>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', fontFamily: 'IBM Plex Mono' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={pinEnabled} 
              onChange={(e) => setPinEnabled(e.target.checked)} 
            />
            Bật khóa bảo mật PIN khi mở
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            Mã PIN Bảo Mật (4 số)
            <input 
              maxLength={4}
              value={pinCode} 
              onChange={(e) => setPinCode(e.target.value)} 
              style={{ background: 'rgba(5, 7, 12, 0.8)', border: '1px solid rgba(175, 220, 240, 0.2)', color: '#f5b73f', padding: '6px 10px', borderRadius: '4px', letterSpacing: '4px' }}
            />
          </label>
          <button
            onClick={() => setEmotion('alert')}
            style={{
              marginTop: '6px',
              background: 'rgba(245, 183, 63, 0.15)',
              border: '1px solid rgba(245, 183, 63, 0.3)',
              color: '#f5b73f',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔒 Test Security Lock Alert
          </button>
        </div>
      </article>

      {/* Box 3: Adapter Endpoints */}
      <article style={{ background: 'rgba(9, 13, 21, 0.65)', border: '1px solid rgba(175, 220, 240, 0.15)', padding: '16px', borderRadius: '6px' }}>
        <header style={{ borderBottom: '1px solid rgba(175, 220, 240, 0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', color: '#778996', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>Service Endpoints</span>
          <h4 style={{ margin: '2px 0 0 0', color: '#5df3a4' }}>Local Adapters</h4>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', fontFamily: 'IBM Plex Mono' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            Hermes Orchestrator API
            <input 
              value={hermesUrl} 
              onChange={(e) => setHermesUrl(e.target.value)} 
              style={{ background: 'rgba(5, 7, 12, 0.8)', border: '1px solid rgba(175, 220, 240, 0.2)', color: '#5df3a4', padding: '6px 10px', borderRadius: '4px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            9Router Multi-Model Gateway
            <input 
              value={routerUrl} 
              onChange={(e) => setRouterUrl(e.target.value)} 
              style={{ background: 'rgba(5, 7, 12, 0.8)', border: '1px solid rgba(175, 220, 240, 0.2)', color: '#69e8ff', padding: '6px 10px', borderRadius: '4px' }}
            />
          </label>
        </div>
      </article>
    </div>
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
        <span>Visual energy signature</span>
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

function OpenClawDashboard({ onLaunchOffice }: { onLaunchOffice?: () => void }) {
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
          {onLaunchOffice && (
            <button 
              onClick={onLaunchOffice}
              style={{
                marginTop: '6px',
                background: '#b56dff',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'IBM Plex Mono',
                cursor: 'pointer'
              }}
            >
              🍇 Launch Virtual Office Sub-App
            </button>
          )}
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
