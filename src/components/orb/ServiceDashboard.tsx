import type { FormEvent } from "react";
import { DEFAULT_HERMES_PROFILE_ID, HERMES_PROFILES, type HermesProfileId } from "../../utils/hermesProfiles";

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
  onSelectProfile?: (profileId: HermesProfileId) => void;
  diagnostics?: string[];
  onRunDiagnostic?: (action: string) => void;
  onPromptChange: (value: string) => void;
  onRefresh: () => void;
  onSubmit: () => void;
};

function readableValue(value: unknown) {
  if (typeof value === "boolean") return value ? "YES" : "NO";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return `${value.length} ITEMS`;
  if (value && typeof value === "object") return `${Object.keys(value).length} FIELDS`;
  return "-";
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
  selectedProfileId = DEFAULT_HERMES_PROFILE_ID,
  onSelectProfile,
  diagnostics = [],
  onRunDiagnostic,
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

      {isHermes && (
        <section className="hermes-profile-selector-panel" aria-label="Profile Hermes">
          <header className="profile-panel-header">
            <span>Chọn profile Hermes</span>
            <small>Ubuntu · đang dùng: {selectedProfileId}</small>
          </header>
          <div className="profile-chips">
            {HERMES_PROFILES.map((profile) => (
              <button
                type="button"
                className={`profile-chip ${selectedProfileId === profile.id ? "active" : ""}`}
                key={profile.id}
                onClick={() => onSelectProfile?.(profile.id)}
              >
                <b>{profile.name}</b>
                <small>{profile.description || `${profile.id} · bộ nhớ phiên bền vững`}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="service-metrics" aria-label={`Trạng thái ${label}`}>
        <article>
          <span>UPSTREAM</span>
          <b>{online ? "READY" : "NOT READY"}</b>
          <small>HTTP {health?.status ?? overview?.upstreamStatus ?? "-"}</small>
        </article>
        <article>
          <span>LATENCY</span>
          <b>{health?.latencyMs ?? overview?.latencyMs ?? "-"}ms</b>
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
            <header><span>CAPABILITIES</span><b>{capabilities.length || "-"}</b></header>
            <div>
              {capabilities.length ? capabilities.map(([name, value]) => (
                <p key={name}><span>{name}</span><b>{readableValue(value)}</b></p>
              )) : <p className="empty"><span>Chưa có capability data</span><b>-</b></p>}
            </div>
          </section>
          <section>
            <header><span>MODELS</span><b>{models.length || "-"}</b></header>
            <div>
              {models.length ? models.map((model) => (
                <p key={model}><span>{model}</span><b>AVAILABLE</b></p>
              )) : <p className="empty"><span>Upstream chưa công bố model</span><b>-</b></p>}
            </div>
          </section>
        </div>
      )}

      {diagnostics.length > 0 && (
        <section className="service-diagnostic-actions" aria-label={`Lệnh điều khiển ${label}`}>
          {diagnostics.map((action) => (
            <button type="button" key={action} disabled={sending} onClick={() => onRunDiagnostic?.(action)}>
              {action}
            </button>
          ))}
        </section>
      )}

      <form className="service-test-console" onSubmit={submit}>
        <label htmlFor={`${label.toLowerCase()}-test-prompt`}>
          {isHermes ? `Kiểm tra trực tiếp profile ${selectedProfileId}` : "Kiểm tra dịch vụ trực tiếp"}
        </label>
        <div>
          <input
            id={`${label.toLowerCase()}-test-prompt`}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder={isHermes ? `Gửi lệnh tới Hermes (${selectedProfileId})` : `Gửi lệnh kiểm tra trực tiếp tới ${label}`}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !prompt.trim()}>
            {sending ? "Đang gửi" : "Gửi test"}
          </button>
        </div>
        <output aria-live="polite">
          {reply || (isHermes ? `Mọi lệnh được định tuyến tới profile ${selectedProfileId} trên Ubuntu.` : `Chỉ gọi endpoint ${label}.`)}
        </output>
      </form>
    </div>
  );
}
