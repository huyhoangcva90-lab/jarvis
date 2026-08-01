import type { FormEvent } from "react";
import { HERMES_PROFILES, HermesProfileId } from "../../utils/hermesProfiles";

type ServiceHealth = {
  latencyMs?: number;
  status?: number;
  configured?: boolean;
  circuit?: { state?: string };
};

type ServiceDashboardProps = {
  label: string;
  description: string;
  online: boolean;
  state: "idle" | "loading" | "ready" | "error";
  health?: ServiceHealth;
  overview?: any;
  error?: string;
  prompt: string;
  reply: string;
  sending: boolean;
  selectedProfileId?: HermesProfileId;
  onProfileSelect?: (profileId: HermesProfileId) => void;
  onPromptChange: (value: string) => void;
  onRefresh: () => void;
  onSubmit: () => void;
};

function readableValue(value: unknown) {
  if (typeof value === "boolean") return value ? "YES" : "NO";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return `${value.length} ITEMS`;
  if (value && typeof value === "object") return `${Object.keys(value).length} FIELDS`;
  return "—";
}

function capabilityRows(overview: any) {
  const source = overview?.capabilities?.features
    || overview?.capabilities
    || overview?.raw?.features
    || overview?.raw
    || {};
  if (!source || typeof source !== "object" || Array.isArray(source)) return [];
  return Object.entries(source)
    .filter(([key]) => !["data", "models"].includes(key))
    .slice(0, 8);
}

function modelNames(overview: any): string[] {
  const models = Array.isArray(overview?.models) ? overview.models : [];
  return models
    .map((model: any) => String(model?.id || model?.name || model || "").trim())
    .filter(Boolean)
    .slice(0, 8);
}

export default function ServiceDashboard({
  label,
  description,
  online,
  state,
  health,
  overview,
  error,
  prompt,
  reply,
  sending,
  selectedProfileId = "jarvis",
  onProfileSelect,
  onPromptChange,
  onRefresh,
  onSubmit,
}: ServiceDashboardProps) {
  const models = modelNames(overview);
  const capabilities = capabilityRows(overview);
  const circuit = health?.circuit?.state || "closed";
  const configured = overview?.configured ?? health?.configured;
  const isHermes = label.toUpperCase() === "HERMES";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="service-console">
      <header className="service-console-toolbar">
        <div>
          <i className={online ? "online" : "offline"} aria-hidden="true" />
          <span>
            <b>{label} {online ? "ONLINE" : "OFFLINE"}</b>
            <small>{description}</small>
          </span>
        </div>
        <button type="button" disabled={state === "loading"} onClick={onRefresh}>
          {state === "loading" ? "Đang quét" : "Quét lại"}
        </button>
      </header>

      {/* Hermes Mission Control 2.0 Agent Profile Selector */}
      {isHermes && (
        <section className="hermes-profile-selector-panel" aria-label="Hermes Agent Profile Selector">
          <header className="profile-panel-header">
            <span>HERMES AGENT PROFILES</span>
            <small>Active: {selectedProfileId}</small>
          </header>
          <div className="profile-chips">
            {HERMES_PROFILES.map((prof) => {
              const isSelected = selectedProfileId === prof.id;
              const profileAvailable = prof.id === overview?.defaultProfile || overview?.multiplexProfiles !== false;
              return (
                <button
                  type="button"
                  key={prof.id}
                  className={`profile-chip ${isSelected ? "active" : ""}`}
                  disabled={!profileAvailable}
                  onClick={() => onProfileSelect && onProfileSelect(prof.id)}
                >
                  <b>{prof.name}</b>
                  <small>{profileAvailable ? prof.role : "Cần bật Hermes multiplex profiles"}</small>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="service-metrics" aria-label={`Trạng thái ${label}`}>
        <article>
          <span>UPSTREAM</span>
          <b>{online ? "READY" : "NOT READY"}</b>
          <small>HTTP {health?.status ?? overview?.upstreamStatus ?? "—"}</small>
        </article>
        <article>
          <span>LATENCY</span>
          <b>{health?.latencyMs ?? overview?.latencyMs ?? "—"}ms</b>
          <small>Gateway probe</small>
        </article>
        <article>
          <span>CHAT LINK</span>
          <b>{configured === false ? "NOT CONFIGURED" : configured ? "CONFIGURED" : "UNKNOWN"}</b>
          <small>{isHermes ? `${overview?.defaultProfile || "jarvis"} · ${overview?.session?.continuity ? "PERSISTENT" : "STATELESS"}` : "Jarvis protected route"}</small>
        </article>
        <article>
          <span>CIRCUIT</span>
          <b>{String(circuit).toUpperCase()}</b>
          <small>{isHermes ? `${String(overview?.session?.mode || "web").toUpperCase()} transcript` : "Failure protection"}</small>
        </article>
      </section>

      {state === "error" ? (
        <div className="service-console-alert" role="alert">
          <b>Không đọc được dữ liệu {label}</b>
          <p>{error || "Dịch vụ chưa phản hồi. Kiểm tra cấu hình Gateway rồi thử lại."}</p>
          <button type="button" onClick={onRefresh}>Thử lại</button>
        </div>
      ) : (
        <div className="service-capability-grid">
          <section>
            <header><span>CAPABILITIES</span><b>{capabilities.length || "—"}</b></header>
            <div>
              {capabilities.length ? capabilities.map(([name, value]) => (
                <p key={name}><span>{name}</span><b>{readableValue(value)}</b></p>
              )) : <p className="empty"><span>Chưa có capability data</span><b>—</b></p>}
            </div>
          </section>
          <section>
            <header><span>MODELS</span><b>{models.length || "—"}</b></header>
            <div>
              {models.length ? models.map((model) => (
                <p key={model}><span>{model}</span><b>AVAILABLE</b></p>
              )) : <p className="empty"><span>Upstream chưa công bố model</span><b>—</b></p>}
            </div>
          </section>
        </div>
      )}

      {/* Quick Studio Presets for Content Machine */}
      {isHermes && selectedProfileId === "cadence-content" && (
        <div className="cadence-quick-presets">
          <span>STUDIO PIPELINE PRESETS:</span>
          <div className="preset-buttons">
            <button type="button" onClick={() => onPromptChange("Lên kịch bản 5 bước cho bài viết AI Content Studio")}>
              01/ Research & Scripting
            </button>
            <button type="button" onClick={() => onPromptChange("Tối ưu SEO & Tiêu đề thu hút cho video YouTube mới")}>
              02/ SEO & Metadata
            </button>
            <button type="button" onClick={() => onPromptChange("Lên lịch đăng bài tự động trên các kênh truyền thông")}>
              03/ Multi-channel Dispatch
            </button>
          </div>
        </div>
      )}

      <form className="service-test-console" onSubmit={submit}>
        <label htmlFor={`${label.toLowerCase()}-test-prompt`}>Direct service test {isHermes ? `(${selectedProfileId})` : ""}</label>
        <div>
          <input
            id={`${label.toLowerCase()}-test-prompt`}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder={isHermes ? `Gửi lệnh kiểm tra trực tiếp tới ${label} (${selectedProfileId})` : `Gửi lệnh kiểm tra trực tiếp tới ${label}`}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !prompt.trim()}>
            {sending ? "Đang gửi" : "Gửi test"}
          </button>
        </div>
        <output aria-live="polite">
          {reply || (isHermes ? `Chỉ gọi endpoint ${label}; định tuyến theo profile ${selectedProfileId}.` : `Chỉ gọi endpoint ${label}.`)}
        </output>
      </form>
    </div>
  );
}
