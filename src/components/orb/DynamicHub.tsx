import { useMemo, useState } from "react";
import {
  HUB_TEMPLATES,
  extractOutline,
  hubSearchQuery,
  hubTemplate,
  type HubArtifact,
  type HubKind,
} from "../../utils/hubRuntime";

type DynamicHubProps = {
  artifacts: HubArtifact[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreateDemo: (kind: HubKind) => void;
  onRemove: (id: string) => void;
};

function HubGlyph({ kind }: { kind: HubKind }) {
  const paths: Record<HubKind, React.ReactNode> = {
    web: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3Z" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    places: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    images: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m3 17 5-5 4 4 3-3 6 6" /></>,
    mindmap: <><circle cx="12" cy="12" r="3" /><circle cx="4" cy="5" r="2" /><circle cx="20" cy="5" r="2" /><circle cx="4" cy="19" r="2" /><circle cx="20" cy="19" r="2" /><path d="m6 6 4 4m4 0 4-4M6 18l4-4m4 0 4 4" /></>,
    diagram: <><rect x="8" y="2" width="8" height="5" rx="1" /><rect x="2" y="17" width="8" height="5" rx="1" /><rect x="14" y="17" width="8" height="5" rx="1" /><path d="M12 7v5M6 17v-5h12v5" /></>,
    text: <><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></>,
    dashboard: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="m3 7 6-4 6 6 6-5" /></>,
    table: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M3 14h18M9 4v16M15 4v16" /></>,
    compare: <><path d="M8 4 4 8l4 4M4 8h8M16 12l4 4-4 4M20 16h-8" /></>,
    timeline: <><path d="M7 3v18M7 6h11M7 12h8M7 18h11" /><circle cx="7" cy="6" r="2" /><circle cx="7" cy="12" r="2" /><circle cx="7" cy="18" r="2" /></>,
    tasks: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 2 2 4-4M7 16h2M12 16h5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
    weather: <><circle cx="8" cy="8" r="3" /><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.5 1.5M10.5 10.5 12 12" /><path d="M8 18h10a3 3 0 0 0 0-6 5 5 0 0 0-9.5 1.8A2.5 2.5 0 0 0 8 18Z" /></>,
    travel: <><path d="M3 17h18M5 17l2-9h10l2 9M9 8V5h6v3M8 12h8" /></>,
    shopping: <><path d="M6 7h15l-2 8H8L6 3H3M9 20h.01M18 20h.01" /></>,
    news: <><path d="M5 4h14v16H5Z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>;
}

function LoadingView({ artifact }: { artifact: HubArtifact }) {
  const stages = [
    ["ROUTE", "Đã chọn đúng Hub"],
    ["SOURCE", "Đang truy vấn nguồn phù hợp"],
    ["SYNTHESIS", "Đang dựng giao diện kết quả"],
  ];
  return (
    <section className="dynamic-hub-loading" aria-live="polite">
      <div className="hub-loader-core"><i /><i /><b /></div>
      <div>
        <span>JARVIS ORCHESTRATION</span>
        <h2>Đang dựng {hubTemplate(artifact.kind).label} Hub</h2>
        <p>{artifact.query}</p>
      </div>
      <ol>
        {stages.map(([code, label], index) => (
          <li className={index === 0 ? "complete" : index === 1 ? "active" : ""} key={code}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <span>{code}<small>{label}</small></span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Summary({ artifact }: { artifact: HubArtifact }) {
  return (
    <article className="hub-intel-summary">
      <span>JARVIS SYNTHESIS</span>
      <p>{artifact.summary || "Hub đã sẵn sàng."}</p>
    </article>
  );
}

function SearchLaunchers({ artifact }: { artifact: HubArtifact }) {
  const query = encodeURIComponent(hubSearchQuery(artifact));
  const sources =
    artifact.kind === "video"
      ? [
          ["YouTube", `https://www.youtube.com/results?search_query=${query}`],
          ["Google Video", `https://www.google.com/search?tbm=vid&q=${query}`],
        ]
      : artifact.kind === "images"
        ? [
            ["Google Images", `https://www.google.com/search?tbm=isch&q=${query}`],
            ["Bing Images", `https://www.bing.com/images/search?q=${query}`],
          ]
        : artifact.kind === "news"
          ? [
              ["Google News", `https://news.google.com/search?q=${query}`],
              ["Bing News", `https://www.bing.com/news/search?q=${query}`],
            ]
          : artifact.kind === "shopping"
            ? [
                ["Google Shopping", `https://www.google.com/search?tbm=shop&q=${query}`],
                ["Bing Shopping", `https://www.bing.com/shop?q=${query}`],
              ]
            : artifact.kind === "travel"
              ? [
                  ["Google Travel", `https://www.google.com/travel/search?q=${query}`],
                  ["Google Maps", `https://www.google.com/maps/search/${query}`],
                ]
        : [
            ["Google", `https://www.google.com/search?q=${query}`],
            ["Bing", `https://www.bing.com/search?q=${query}`],
          ];
  return (
    <div className="hub-source-launchers">
      {sources.map(([label, url]) => (
        <a href={url} target="_blank" rel="noopener noreferrer" key={label}>
          <HubGlyph kind={artifact.kind} />
          <span>{label}<small>Mở nguồn trực tiếp</small></span>
          <b>↗</b>
        </a>
      ))}
    </div>
  );
}

function ResultsGrid({ artifact }: { artifact: HubArtifact }) {
  if (!artifact.items.length) return <SearchLaunchers artifact={artifact} />;
  return (
    <div className={`hub-results-grid ${artifact.kind}`}>
      {artifact.items.map((item, index) => (
        <a
          href={item.url || "#"}
          target={item.url ? "_blank" : undefined}
          rel={item.url ? "noopener noreferrer" : undefined}
          onClick={(event) => { if (!item.url) event.preventDefault(); }}
          key={item.id}
        >
          {item.image && <img src={item.image} alt="" loading="lazy" />}
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{item.title}</b>
          {item.description && <p>{item.description}</p>}
          {item.meta && <small>{item.meta}</small>}
        </a>
      ))}
    </div>
  );
}

function MapView({ artifact }: { artifact: HubArtifact }) {
  const mapQuery = hubSearchQuery(artifact);
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  return (
    <div className="hub-map-layout">
      <div className="hub-map-frame">
        <div><span>LIVE CARTOGRAPHY</span><b>MAP://ACTIVE</b></div>
        <iframe title={`Bản đồ ${artifact.query}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function GraphView({ artifact }: { artifact: HubArtifact }) {
  const nodes = useMemo(
    () => (artifact.items.length ? artifact.items.map((item) => item.title) : extractOutline(artifact.summary || artifact.query)),
    [artifact],
  );
  if (artifact.kind === "mindmap") {
    return (
      <div className="hub-mindmap" style={{ "--nodes": Math.max(nodes.length, 1) } as React.CSSProperties}>
        <div className="hub-mindmap-core"><span>CORE IDEA</span><b>{artifact.title}</b></div>
        {nodes.map((node, index) => (
          <div className="hub-mindmap-node" style={{ "--index": index } as React.CSSProperties} key={`${node}-${index}`}>
            <i /><span>{node}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="hub-diagram">
      {nodes.map((node, index) => (
        <div className="hub-diagram-step" key={`${node}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{node}</b>
          {index < nodes.length - 1 && <i aria-hidden="true">→</i>}
        </div>
      ))}
    </div>
  );
}

function DashboardView({ artifact }: { artifact: HubArtifact }) {
  return (
    <div className="hub-dashboard-view">
      <div className="hub-metric-grid">
        {artifact.items.map((item, index) => {
          const parsed = Number.parseFloat(item.meta || "");
          const progress = Number.isFinite(parsed) ? Math.min(100, Math.max(8, parsed)) : 42 + ((index * 17) % 48);
          return (
            <article key={item.id}>
              <span>METRIC {String(index + 1).padStart(2, "0")}</span>
              <b>{item.meta || "—"}</b>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div aria-label={`${item.title}: ${item.meta || "không có dữ liệu"}`}><i style={{ width: `${progress}%` }} /></div>
            </article>
          );
        })}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function ChartView({ artifact }: { artifact: HubArtifact }) {
  const values = artifact.items.map((item) => Number.parseFloat(item.meta || "") || 0);
  const max = Math.max(...values, 1);
  return (
    <div className="hub-chart-view">
      <div className="hub-bar-chart" role="img" aria-label={`Biểu đồ ${artifact.title}`}>
        {artifact.items.map((item, index) => (
          <div key={item.id}>
            <span>{item.meta || "0"}</span>
            <i style={{ height: `${Math.max(8, (values[index] / max) * 100)}%` }} />
            <b>{item.title}</b>
          </div>
        ))}
      </div>
      <div className="hub-chart-legend" aria-label="Dữ liệu biểu đồ">
        {artifact.items.map((item) => <span key={item.id}><i />{item.title}<b>{item.meta}</b></span>)}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function TableView({ artifact }: { artifact: HubArtifact }) {
  return (
    <div className="hub-table-view">
      <div className="hub-table-scroll">
        <table>
          <caption>{artifact.title}</caption>
          <thead><tr><th scope="col">ID</th><th scope="col">Mục</th><th scope="col">Chi tiết</th><th scope="col">Trạng thái</th></tr></thead>
          <tbody>
            {artifact.items.map((item, index) => (
              <tr key={item.id}>
                <td>{String(index + 1).padStart(2, "0")}</td>
                <th scope="row">{item.title}</th>
                <td>{item.description || "—"}</td>
                <td><span>{item.meta || "Ready"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function CompareView({ artifact }: { artifact: HubArtifact }) {
  return (
    <div className="hub-compare-view">
      <div className="hub-compare-grid">
        {artifact.items.map((item, index) => {
          const score = Math.min(100, Math.max(10, Number.parseFloat(item.meta || "") || 70 + index * 7));
          return (
            <article key={item.id}>
              <span>OPTION {String.fromCharCode(65 + index)}</span>
              <h3>{item.title}</h3>
              <b>{item.meta || `${score}%`}</b>
              <p>{item.description}</p>
              <div><i style={{ width: `${score}%` }} /></div>
            </article>
          );
        })}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function TimelineView({ artifact, travel = false }: { artifact: HubArtifact; travel?: boolean }) {
  return (
    <div className={`hub-timeline-view ${travel ? "travel" : ""}`}>
      <ol>
        {artifact.items.map((item, index) => (
          <li key={item.id}>
            <i><b>{String(index + 1).padStart(2, "0")}</b></i>
            <div><span>{item.meta || `T+${index}`}</span><h3>{item.title}</h3><p>{item.description}</p></div>
          </li>
        ))}
      </ol>
      <Summary artifact={artifact} />
    </div>
  );
}

function TasksView({ artifact }: { artifact: HubArtifact }) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) => setCompleted((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  return (
    <div className="hub-tasks-view">
      <header><span>MISSION PROGRESS</span><b>{completed.size}/{artifact.items.length}</b><progress value={completed.size} max={Math.max(artifact.items.length, 1)} /></header>
      <div>
        {artifact.items.map((item, index) => (
          <button type="button" aria-pressed={completed.has(item.id)} onClick={() => toggle(item.id)} key={item.id}>
            <i>{completed.has(item.id) ? "OK" : String(index + 1).padStart(2, "0")}</i>
            <span><b>{item.title}</b><small>{item.description}</small></span>
            <em>{completed.has(item.id) ? "DONE" : item.meta || "QUEUED"}</em>
          </button>
        ))}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function CalendarView({ artifact }: { artifact: HubArtifact }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
  return (
    <div className="hub-calendar-view">
      <div className="hub-week-strip">
        {days.map((day, index) => (
          <div className={index === 0 ? "active" : ""} key={day.toISOString()}>
            <span>{new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(day)}</span>
            <b>{day.getDate()}</b>
          </div>
        ))}
      </div>
      <div className="hub-agenda">
        {artifact.items.map((item) => (
          <article key={item.id}><time>{item.meta || "TBD"}</time><i /><span><b>{item.title}</b><small>{item.description}</small></span></article>
        ))}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function WeatherView({ artifact }: { artifact: HubArtifact }) {
  if (!artifact.items.length) {
    return <div className="dynamic-hub-result"><Summary artifact={artifact} /><SearchLaunchers artifact={artifact} /></div>;
  }
  return (
    <div className="hub-weather-view">
      <div className="hub-weather-hero"><span>LOCAL ATMOSPHERE</span><b>{artifact.items[0]?.meta}</b><h3>{artifact.title}</h3><p>{artifact.items[0]?.description}</p></div>
      <div className="hub-forecast-grid">
        {artifact.items.map((item, index) => <article key={item.id}><span>{item.title}</span><i className={`weather-glyph phase-${index % 4}`} /><b>{item.meta}</b><p>{item.description}</p></article>)}
      </div>
      <Summary artifact={artifact} />
    </div>
  );
}

function CodeView({ artifact }: { artifact: HubArtifact }) {
  const match = artifact.summary?.match(/```(?:[\w+-]+)?\s*([\s\S]*?)```/);
  const code = match?.[1]?.trim() || `// ${artifact.title}\n// Jarvis is ready to render structured code output here.`;
  return (
    <div className="hub-code-view">
      <header><span>CODE://READ-ONLY</span><b>{artifact.items[0]?.meta || "SOURCE"}</b></header>
      <pre><code>{code}</code></pre>
      <Summary artifact={artifact} />
    </div>
  );
}

function HubContent({ artifact }: { artifact: HubArtifact }) {
  if (artifact.status === "loading") return <LoadingView artifact={artifact} />;
  if (artifact.status === "error") {
    return <section className="dynamic-hub-error"><span>LINK INTERRUPTED</span><h2>Không thể hoàn tất Hub</h2><p>{artifact.error}</p></section>;
  }
  if (artifact.kind === "map") return <MapView artifact={artifact} />;
  if (artifact.kind === "mindmap" || artifact.kind === "diagram") return <GraphView artifact={artifact} />;
  if (artifact.kind === "dashboard") return <DashboardView artifact={artifact} />;
  if (artifact.kind === "chart") return <ChartView artifact={artifact} />;
  if (artifact.kind === "table") return <TableView artifact={artifact} />;
  if (artifact.kind === "compare") return <CompareView artifact={artifact} />;
  if (artifact.kind === "timeline") return <TimelineView artifact={artifact} />;
  if (artifact.kind === "travel" && artifact.items.length) return <TimelineView artifact={artifact} travel />;
  if (artifact.kind === "tasks") return <TasksView artifact={artifact} />;
  if (artifact.kind === "calendar") return <CalendarView artifact={artifact} />;
  if (artifact.kind === "weather") return <WeatherView artifact={artifact} />;
  if (artifact.kind === "code") return <CodeView artifact={artifact} />;
  return (
    <div className="dynamic-hub-result">
      <Summary artifact={artifact} />
      {artifact.kind !== "text" && <ResultsGrid artifact={artifact} />}
    </div>
  );
}

const HUB_GROUPS = [
  ["intel", "INTELLIGENCE"],
  ["spatial", "WORLD & SPACE"],
  ["planning", "PLANNING"],
  ["data", "DATA SYSTEMS"],
  ["creation", "CREATION LAB"],
] as const;

export default function DynamicHub({ artifacts, activeId, onSelect, onCreateDemo, onRemove }: DynamicHubProps) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const active = artifacts.find((artifact) => artifact.id === activeId) ?? artifacts[0] ?? null;
  return (
    <div className="dynamic-hub-shell">
      <header className="dynamic-hub-toolbar">
        <div className="dynamic-hub-tabs" role="tablist" aria-label="Các Hub đang mở">
          {artifacts.map((artifact) => (
            <button
              type="button"
              role="tab"
              aria-selected={artifact.id === active?.id}
              className={artifact.id === active?.id ? "active" : ""}
              onClick={() => onSelect(artifact.id)}
              key={artifact.id}
            >
              <HubGlyph kind={artifact.kind} />
              <span>{hubTemplate(artifact.kind).label}</span>
              <i className={artifact.status} />
              <b
                role="button"
                tabIndex={0}
                aria-label={`Đóng ${artifact.title}`}
                onClick={(event) => { event.stopPropagation(); onRemove(artifact.id); }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(artifact.id);
                  }
                }}
              >×</b>
            </button>
          ))}
        </div>
        <button className="hub-catalog-toggle" type="button" aria-expanded={catalogOpen} onClick={() => setCatalogOpen((open) => !open)}>
          <span>APP MATRIX</span><b>{catalogOpen ? "−" : "+"}</b>
        </button>
      </header>

      {catalogOpen && (
        <div className="hub-template-catalog">
          {HUB_GROUPS.map(([group, label]) => (
            <section key={group}>
              <h3>{label}<span>{String(HUB_TEMPLATES.filter((template) => template.group === group).length).padStart(2, "0")}</span></h3>
              <div>
                {HUB_TEMPLATES.filter((template) => template.group === group).map((template) => (
                  <button type="button" onClick={() => { onCreateDemo(template.kind); setCatalogOpen(false); }} key={template.kind}>
                    <HubGlyph kind={template.kind} />
                    <span><b>{template.label}</b><small>{template.description}</small></span>
                    <i>{template.code}</i>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <main className="dynamic-hub-canvas">
        {active ? (
          <>
            <div className="dynamic-hub-context">
              <span>{hubTemplate(active.kind).code}://{active.status.toUpperCase()}</span>
              <h2>{active.title}</h2>
              <time>{new Date(active.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</time>
            </div>
            <HubContent artifact={active} />
          </>
        ) : (
          <section className="dynamic-hub-empty">
            <div className="hub-empty-radar"><i /><i /><b>J</b></div>
            <span>UNIVERSAL HUB RUNTIME</span>
            <h2>Jarvis đang quan sát toàn hệ thống</h2>
            <p>Ra lệnh tra cứu, xem bản đồ, lập kế hoạch, so sánh, dựng dashboard, biểu đồ, timeline, code hoặc nội dung sáng tạo. Giao diện phù hợp sẽ tự xuất hiện tại đây.</p>
            <button type="button" onClick={() => setCatalogOpen(true)}>Xem các Hub đã nạp</button>
          </section>
        )}
      </main>
    </div>
  );
}
