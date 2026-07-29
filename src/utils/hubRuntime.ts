export type HubKind =
  | "web"
  | "video"
  | "map"
  | "places"
  | "images"
  | "mindmap"
  | "diagram"
  | "text"
  | "dashboard"
  | "chart"
  | "table"
  | "compare"
  | "timeline"
  | "tasks"
  | "calendar"
  | "weather"
  | "travel"
  | "shopping"
  | "news"
  | "code";

export type HubStatus = "loading" | "ready" | "error";

export type HubItem = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  meta?: string;
};

export type HubArtifact = {
  id: string;
  kind: HubKind;
  title: string;
  query: string;
  status: HubStatus;
  summary?: string;
  items: HubItem[];
  createdAt: number;
  error?: string;
};

export const HUB_TEMPLATES: Array<{
  kind: HubKind;
  label: string;
  code: string;
  description: string;
  group: "intel" | "spatial" | "planning" | "data" | "creation";
}> = [
  { kind: "web", label: "Web Intel", code: "NET", description: "Tra cứu mạng và tổng hợp nguồn", group: "intel" },
  { kind: "news", label: "Newsroom", code: "NWS", description: "Tin mới, diễn biến và nguồn", group: "intel" },
  { kind: "video", label: "YouTube", code: "VID", description: "Video, playlist và ghi chú", group: "intel" },
  { kind: "shopping", label: "Shopping", code: "SHP", description: "Sản phẩm, giá và lựa chọn", group: "intel" },
  { kind: "map", label: "Map", code: "MAP", description: "Địa chỉ, tuyến đường và khu vực", group: "spatial" },
  { kind: "places", label: "Places", code: "PLC", description: "Quán, menu và gợi ý", group: "spatial" },
  { kind: "travel", label: "Travel", code: "TRV", description: "Lịch trình, chặng và điểm đến", group: "spatial" },
  { kind: "weather", label: "Weather", code: "WTH", description: "Thời tiết và điều kiện môi trường", group: "spatial" },
  { kind: "tasks", label: "Mission Board", code: "TSK", description: "Checklist và tiến độ nhiệm vụ", group: "planning" },
  { kind: "calendar", label: "Calendar", code: "CAL", description: "Lịch, cuộc hẹn và agenda", group: "planning" },
  { kind: "timeline", label: "Timeline", code: "TML", description: "Mốc thời gian và diễn biến", group: "planning" },
  { kind: "dashboard", label: "Dashboard", code: "DSH", description: "KPI và trạng thái tổng quan", group: "data" },
  { kind: "chart", label: "Chart", code: "CHT", description: "Xu hướng và dữ liệu trực quan", group: "data" },
  { kind: "table", label: "Data Grid", code: "TBL", description: "Bảng dữ liệu có cấu trúc", group: "data" },
  { kind: "compare", label: "Compare", code: "CMP", description: "So sánh lựa chọn cạnh nhau", group: "data" },
  { kind: "images", label: "Images", code: "IMG", description: "Gallery và hình tham khảo", group: "creation" },
  { kind: "mindmap", label: "Mind Map", code: "MND", description: "Bản đồ ý tưởng tương tác", group: "creation" },
  { kind: "diagram", label: "Diagram", code: "DGM", description: "Luồng, hệ thống và kiến trúc", group: "creation" },
  { kind: "code", label: "Code Lab", code: "COD", description: "Mã nguồn, giải thích và patch", group: "creation" },
  { kind: "text", label: "Brief", code: "TXT", description: "Tóm tắt và nội dung chuyên sâu", group: "creation" },
];

const KIND_RULES: Array<[HubKind, RegExp]> = [
  ["weather", /\b(thoi tiet|du bao|nhiet do|mua|nang|bao|weather|forecast)\b/],
  ["calendar", /\b(lich|cuoc hen|hen lich|agenda|calendar|schedule|meeting)\b/],
  ["tasks", /\b(todo|checklist|cong viec|nhiem vu|mission|task|viec can lam)\b/],
  ["compare", /\b(so sanh|versus|vs|khac nhau|lua chon nao|compare)\b/],
  ["timeline", /\b(timeline|lo trinh|moc thoi gian|dien bien|roadmap)\b/],
  ["dashboard", /\b(dashboard|tong quan|kpi|chi so|monitor|bang dieu khien)\b/],
  ["chart", /\b(bieu do|do thi|chart|thong ke|xu huong|trend)\b/],
  ["table", /\b(bang du lieu|data grid|table|bang chi tiet)\b/],
  ["travel", /\b(du lich|lich trinh|chuyen di|khach san|chuyen bay|travel|itinerary)\b/],
  ["shopping", /\b(mua sam|san pham|gia ban|deal|shopping|review san pham)\b/],
  ["news", /\b(tin tuc|tin moi|thoi su|news|su kien moi)\b/],
  ["code", /\b(code|ma nguon|viet ham|lap trinh|snippet|implementation|patch)\b/],
  ["video", /\b(video|youtube|clip|playlist|phim|xem)\b/],
  ["mindmap", /\b(mind\s*map|mindmap|so do tu duy|ban do tu duy)\b/],
  ["diagram", /\b(so do|diagram|flowchart|luong xu ly|kien truc|architecture)\b/],
  ["images", /\b(hinh anh|hinh|anh|image|gallery|moodboard)\b/],
  ["places", /\b(quan|cafe|ca phe|nha hang|menu|mon an|an gi|uong gi|dia diem goi y)\b/],
  ["map", /\b(ban do|map|dia chi|duong di|chi duong|toa do|gan day)\b/],
  ["web", /\b(tim kiem|tra cuu|tren mang|internet|web|tin moi|nghien cuu|search)\b/],
  ["text", /\b(tom tat|viet|phan tich|bao cao|brief|ghi chu|tai lieu)\b/],
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function compactTitle(query: string, fallback: string) {
  const cleaned = query
    .replace(/\s+/g, " ")
    .replace(/^(jarvis|j-core|j core)[,\s:;-]*/i, "")
    .trim();
  if (!cleaned) return fallback;
  return cleaned.length > 56 ? `${cleaned.slice(0, 53).trim()}…` : cleaned;
}

export function detectHubKind(query: string): HubKind | null {
  const normalized = normalize(query);
  return KIND_RULES.find(([, rule]) => rule.test(normalized))?.[0] ?? null;
}

export function createHubArtifact(query: string, forcedKind?: HubKind): HubArtifact | null {
  const kind = forcedKind ?? detectHubKind(query);
  if (!kind) return null;
  const template = HUB_TEMPLATES.find((item) => item.kind === kind)!;
  return {
    id: `hub-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    title: compactTitle(query, template.label),
    query: query.trim(),
    status: "loading",
    items: [],
    createdAt: Date.now(),
  };
}

function asHubItems(value: unknown): HubItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).map((item, index) => {
    if (typeof item === "string") {
      return { id: `item-${index}`, title: item };
    }
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      id: String(row.id ?? `item-${index}`),
      title: String(row.title ?? row.name ?? row.label ?? `Kết quả ${index + 1}`),
      description: String(row.description ?? row.summary ?? row.snippet ?? row.detail ?? ""),
      url: typeof row.url === "string" ? row.url : typeof row.link === "string" ? row.link : undefined,
      image: typeof row.image === "string" ? row.image : typeof row.thumbnail === "string" ? row.thumbnail : undefined,
      meta:
        typeof row.meta === "string" || typeof row.meta === "number"
          ? String(row.meta)
          : typeof row.price === "string" || typeof row.price === "number"
            ? String(row.price)
            : typeof row.value === "string" || typeof row.value === "number"
              ? String(row.value)
              : typeof row.status === "string"
                ? row.status
                : typeof row.time === "string"
                  ? row.time
                  : typeof row.date === "string"
                    ? row.date
                    : undefined,
    };
  });
}

function deriveHubItems(kind: HubKind, reply: string): HubItem[] {
  const derivable = ["dashboard", "chart", "table", "compare", "timeline", "tasks", "calendar", "travel"];
  if (!derivable.includes(kind)) return [];
  return extractOutline(reply, kind === "compare" ? 4 : 8).map((line, index) => {
    const numeric = line.match(/-?\d+(?:[.,]\d+)?\s*(?:%|ms|°|k|m|b)?/i)?.[0]?.replace(/\s+/g, "");
    const time = line.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/)?.[0];
    const title = line.replace(/^.{0,24}?:\s*/, "").trim() || line;
    return {
      id: `derived-${index}`,
      title,
      description: line === title ? "" : line,
      meta:
        time ??
        numeric ??
        (kind === "tasks" ? "Queued" : kind === "timeline" || kind === "travel" ? `T+${index + 1}` : undefined),
    };
  });
}

export function resolveHubArtifact(
  artifact: HubArtifact,
  reply: string,
  response?: Record<string, unknown>,
): HubArtifact {
  const raw = (response?.raw ?? {}) as Record<string, unknown>;
  const artifacts =
    (Array.isArray(response?.artifacts) ? response?.artifacts : undefined) ??
    (Array.isArray(raw.artifacts) ? raw.artifacts : undefined);
  const payload =
    (response?.hub as Record<string, unknown> | undefined) ??
    (raw.hub as Record<string, unknown> | undefined) ??
    (artifacts
      ? (artifacts as Array<Record<string, unknown>>).find(
          (item) => item.kind === artifact.kind || item.type === artifact.kind,
        )
      : undefined);
  const structuredItems = asHubItems(payload?.items ?? payload?.results ?? response?.results ?? raw.results);
  const items = structuredItems.length ? structuredItems : deriveHubItems(artifact.kind, reply);
  return {
    ...artifact,
    status: "ready",
    title: typeof payload?.title === "string" ? payload.title : artifact.title,
    summary:
      typeof payload?.summary === "string"
        ? payload.summary
        : reply,
    items,
  };
}

export function failHubArtifact(artifact: HubArtifact, error: string): HubArtifact {
  return { ...artifact, status: "error", error };
}

export function recoverHubArtifact(artifact: HubArtifact, error: string): HubArtifact {
  const canDegrade = ["web", "video", "map", "places", "images", "news", "shopping", "travel", "weather"].includes(artifact.kind);
  if (!canDegrade) return failHubArtifact(artifact, error);
  return {
    ...artifact,
    status: "ready",
    summary: `Kênh tổng hợp AI đang gián đoạn (${error}). Jarvis đã giữ nguyên truy vấn và mở chế độ nguồn trực tiếp để b vẫn tiếp tục tra cứu.`,
  };
}

export function extractOutline(text: string, limit = 7) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^(\s*[-*•]|\s*\d+[.)])\s*/, "").trim())
    .filter((line) => line.length > 2 && line.length < 150);
  const unique = Array.from(new Set(lines));
  if (unique.length >= 2) return unique.slice(0, limit);
  return text
    .split(/[.!?]\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 8)
    .slice(0, limit);
}

export function hubTemplate(kind: HubKind) {
  return HUB_TEMPLATES.find((item) => item.kind === kind) ?? HUB_TEMPLATES[0];
}

export function hubSearchQuery(artifact: Pick<HubArtifact, "kind" | "query">) {
  let query = artifact.query
    .replace(/^(jarvis|j-core|j core)[,\s:;-]*/i, "")
    .trim();
  const cleaners: Partial<Record<HubKind, RegExp[]>> = {
    video: [/^(hãy\s+|giúp\s+)?tìm(\s+kiếm)?(\s+(một|vài|\d+))?\s+(video|clip)(\s+về)?\s*/i, /\byoutube\b/gi],
    map: [/^(hãy\s+|giúp\s+)?(tra|tìm)(\s+cứu)?\s+(địa\s+chỉ|vị\s+trí)\s*/i, /\b(trên\s+bản\s+đồ|bản\s+đồ|chỉ\s+đường)\b/gi],
    places: [/^(hãy\s+|giúp\s+)?(tìm|gợi\s+ý)(\s+cho\s+\w+)?\s*/i],
    images: [/^(hãy\s+|giúp\s+)?tìm(\s+kiếm)?(\s+(một|vài|\d+))?\s+(hình\s+ảnh|ảnh|image)(\s+về)?\s*/i],
    web: [/^(hãy\s+|giúp\s+)?(tìm\s+kiếm|tra\s+cứu|nghiên\s+cứu)(\s+trên\s+(mạng|web|internet))?\s*/i],
    news: [/^(hãy\s+|giúp\s+)?(tìm|xem|đọc)?\s*(tin\s+tức|tin\s+mới|news)(\s+về)?\s*/i],
    shopping: [/^(hãy\s+|giúp\s+)?(tìm|so\s+sánh)?\s*(mua\s+sắm|sản\s+phẩm|giá)(\s+về)?\s*/i],
    travel: [/^(hãy\s+|giúp\s+)?(lên|tạo|gợi\s+ý)?\s*(lịch\s+trình|chuyến\s+đi|du\s+lịch)(\s+đến)?\s*/i],
    weather: [/^(hãy\s+|giúp\s+)?(xem|kiểm\s+tra|dự\s+báo)?\s*(thời\s+tiết)(\s+tại|\s+ở)?\s*/i],
  };
  for (const cleaner of cleaners[artifact.kind] ?? []) query = query.replace(cleaner, " ");
  return query.replace(/\s+/g, " ").trim() || artifact.query;
}

export function hubDemoItems(kind: HubKind): HubItem[] {
  const demos: Partial<Record<HubKind, HubItem[]>> = {
    dashboard: [
      { id: "metric-1", title: "System readiness", description: "Core services available", meta: "92%" },
      { id: "metric-2", title: "Active missions", description: "2 high-priority workflows", meta: "06" },
      { id: "metric-3", title: "Response latency", description: "Rolling 5-minute median", meta: "184ms" },
      { id: "metric-4", title: "Memory context", description: "Relevant items in scope", meta: "24" },
    ],
    chart: [
      { id: "chart-1", title: "Mon", meta: "42" },
      { id: "chart-2", title: "Tue", meta: "68" },
      { id: "chart-3", title: "Wed", meta: "54" },
      { id: "chart-4", title: "Thu", meta: "86" },
      { id: "chart-5", title: "Fri", meta: "73" },
    ],
    table: [
      { id: "row-1", title: "Hermes", description: "Reasoning orchestrator", meta: "Ready" },
      { id: "row-2", title: "OpenClaw", description: "Agent workforce", meta: "Standby" },
      { id: "row-3", title: "9Router", description: "Model routing", meta: "Online" },
    ],
    compare: [
      { id: "option-1", title: "Option Alpha", description: "Fast, focused and low overhead", meta: "86" },
      { id: "option-2", title: "Option Beta", description: "Broader coverage and more context", meta: "74" },
      { id: "option-3", title: "Option Gamma", description: "Balanced default profile", meta: "81" },
    ],
    timeline: [
      { id: "time-1", title: "Discovery", description: "Collect constraints and signals", meta: "08:00" },
      { id: "time-2", title: "Synthesis", description: "Build the operating picture", meta: "09:30" },
      { id: "time-3", title: "Execution", description: "Dispatch tools and agents", meta: "11:00" },
      { id: "time-4", title: "Review", description: "Verify outputs and close loop", meta: "14:00" },
    ],
    tasks: [
      { id: "task-1", title: "Verify source data", description: "Check freshness and provenance", meta: "Ready" },
      { id: "task-2", title: "Run primary workflow", description: "Execute with safe tool scope", meta: "Active" },
      { id: "task-3", title: "Review final output", description: "Validate against the objective", meta: "Queued" },
    ],
    calendar: [
      { id: "event-1", title: "Daily briefing", description: "Command center sync", meta: "08:30" },
      { id: "event-2", title: "Mission review", description: "Progress and blockers", meta: "13:00" },
      { id: "event-3", title: "System maintenance", description: "Diagnostics window", meta: "20:30" },
    ],
    weather: [
      { id: "weather-1", title: "Now", description: "Partly cloudy", meta: "29°" },
      { id: "weather-2", title: "Afternoon", description: "Light rain possible", meta: "31°" },
      { id: "weather-3", title: "Evening", description: "Cloudy", meta: "27°" },
      { id: "weather-4", title: "Night", description: "Calm", meta: "25°" },
    ],
    travel: [
      { id: "trip-1", title: "Arrival", description: "Check in and establish base", meta: "Day 1" },
      { id: "trip-2", title: "Primary route", description: "Top locations by proximity", meta: "Day 2" },
      { id: "trip-3", title: "Local discovery", description: "Flexible exploration window", meta: "Day 3" },
    ],
    news: [
      { id: "news-1", title: "Top signal", description: "Latest verified development", meta: "Now" },
      { id: "news-2", title: "Context", description: "Why this event matters", meta: "Analysis" },
      { id: "news-3", title: "Watch next", description: "Signals likely to change", meta: "Monitor" },
    ],
    shopping: [
      { id: "shop-1", title: "Best overall", description: "Strong balance of price and capability", meta: "Recommended" },
      { id: "shop-2", title: "Best value", description: "Core features at lower cost", meta: "Value" },
      { id: "shop-3", title: "Premium", description: "Maximum capability and support", meta: "High-end" },
    ],
    code: [
      { id: "code-1", title: "Implementation", description: "Primary code path", meta: "TSX" },
      { id: "code-2", title: "Validation", description: "Type and runtime checks", meta: "TEST" },
    ],
  };
  return demos[kind] ?? [];
}
