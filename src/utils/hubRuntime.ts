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
  | "code"
  | "files"
  | "document"
  | "pdf"
  | "notes"
  | "inbox"
  | "audio"
  | "podcast"
  | "feed"
  | "finance"
  | "automation"
  | "monitor"
  | "terminal";

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
  group: "intel" | "spatial" | "planning" | "workspace" | "data" | "media" | "creation" | "system";
}> = [
  { kind: "web", label: "Tình báo Web", code: "NET", description: "Tra cứu mạng và tổng hợp nguồn", group: "intel" },
  { kind: "news", label: "Phòng tin", code: "NWS", description: "Tin mới, diễn biến và nguồn", group: "intel" },
  { kind: "video", label: "YouTube", code: "VID", description: "Video, playlist và ghi chú", group: "intel" },
  { kind: "shopping", label: "Mua sắm", code: "SHP", description: "Sản phẩm, giá và lựa chọn", group: "intel" },
  { kind: "map", label: "Bản đồ", code: "MAP", description: "Địa chỉ, tuyến đường và khu vực", group: "spatial" },
  { kind: "places", label: "Địa điểm", code: "PLC", description: "Quán, menu và gợi ý", group: "spatial" },
  { kind: "travel", label: "Du lịch", code: "TRV", description: "Lịch trình, chặng và điểm đến", group: "spatial" },
  { kind: "weather", label: "Thời tiết", code: "WTH", description: "Thời tiết và điều kiện môi trường", group: "spatial" },
  { kind: "tasks", label: "Bảng nhiệm vụ", code: "TSK", description: "Danh sách và tiến độ nhiệm vụ", group: "planning" },
  { kind: "calendar", label: "Lịch", code: "CAL", description: "Lịch, cuộc hẹn và chương trình", group: "planning" },
  { kind: "timeline", label: "Dòng thời gian", code: "TML", description: "Mốc thời gian và diễn biến", group: "planning" },
  { kind: "files", label: "Kho tệp", code: "FIL", description: "Tệp, thư mục và tài nguyên", group: "workspace" },
  { kind: "document", label: "Tài liệu", code: "DOC", description: "Tài liệu và nội dung dài", group: "workspace" },
  { kind: "pdf", label: "Trình đọc PDF", code: "PDF", description: "Đọc, tóm tắt và trích dẫn PDF", group: "workspace" },
  { kind: "notes", label: "Ghi chú", code: "NTE", description: "Ghi chú, ý tưởng và bộ nhớ", group: "workspace" },
  { kind: "inbox", label: "Hộp thư", code: "INB", description: "Tin nhắn, email và ưu tiên", group: "workspace" },
  { kind: "dashboard", label: "Bảng tổng quan", code: "DSH", description: "KPI và trạng thái tổng quan", group: "data" },
  { kind: "chart", label: "Biểu đồ", code: "CHT", description: "Xu hướng và dữ liệu trực quan", group: "data" },
  { kind: "table", label: "Lưới dữ liệu", code: "TBL", description: "Bảng dữ liệu có cấu trúc", group: "data" },
  { kind: "compare", label: "So sánh", code: "CMP", description: "So sánh lựa chọn cạnh nhau", group: "data" },
  { kind: "finance", label: "Tài chính", code: "FIN", description: "Giá, ngân sách và biến động", group: "data" },
  { kind: "audio", label: "Bàn âm thanh", code: "AUD", description: "Âm thanh, nhạc và giọng nói", group: "media" },
  { kind: "podcast", label: "Podcast", code: "POD", description: "Tập podcast và transcript", group: "media" },
  { kind: "feed", label: "Dòng nội dung", code: "FED", description: "Dòng nội dung số được tuyển chọn", group: "media" },
  { kind: "images", label: "Hình ảnh", code: "IMG", description: "Thư viện và hình tham khảo", group: "creation" },
  { kind: "mindmap", label: "Sơ đồ tư duy", code: "MND", description: "Bản đồ ý tưởng tương tác", group: "creation" },
  { kind: "diagram", label: "Sơ đồ hệ thống", code: "DGM", description: "Luồng, hệ thống và kiến trúc", group: "creation" },
  { kind: "code", label: "Phòng mã", code: "COD", description: "Mã nguồn, giải thích và bản vá", group: "creation" },
  { kind: "text", label: "Bản tóm lược", code: "TXT", description: "Tóm tắt và nội dung chuyên sâu", group: "creation" },
  { kind: "automation", label: "Tự động hóa", code: "AUT", description: "Kích hoạt, quy trình và hành động", group: "system" },
  { kind: "monitor", label: "Giám sát hệ thống", code: "SYS", description: "Tài nguyên, dịch vụ và đo lường", group: "system" },
  { kind: "terminal", label: "Terminal", code: "TRM", description: "Lệnh, log và phiên thực thi", group: "system" },
];

const KIND_RULES: Array<[HubKind, RegExp]> = [
  ["terminal", /\b(terminal|command line|dong lenh|shell|powershell|bash|log he thong)\b/],
  ["automation", /\b(automation|tu dong hoa|workflow|trigger|webhook|quy trinh tu dong)\b/],
  ["monitor", /\b(system monitor|tai nguyen he thong|cpu|ram|telemetry|health check|process)\b/],
  ["inbox", /\b(inbox|email|hop thu|thu moi|tin nhan|mail)\b/],
  ["pdf", /\b(pdf|file pdf|tai lieu pdf|doc pdf)\b/],
  ["document", /\b(document|tai lieu|van ban|docx|word|bao cao dai)\b/],
  ["notes", /\b(note|notes|ghi chu|so tay|memory note)\b/],
  ["files", /\b(file|folder|tep|thu muc|file manager|quan ly tep)\b/],
  ["podcast", /\b(podcast|transcript podcast|tap moi|chuong trinh noi)\b/],
  ["audio", /\b(audio|am thanh|nhac|music|voice note|ghi am)\b/],
  ["feed", /\b(content feed|bang tin|dong noi dung|rss|feed|noi dung so)\b/],
  ["finance", /\b(tai chinh|finance|co phieu|chung khoan|ngan sach|chi tieu|doanh thu|gia vang|crypto)\b/],
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
  const derivable = [
    "dashboard", "chart", "table", "compare", "timeline", "tasks", "calendar", "travel",
    "files", "document", "pdf", "notes", "inbox", "audio", "podcast", "feed", "finance",
    "automation", "monitor", "terminal",
  ];
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
        (kind === "tasks" || kind === "automation"
          ? "Queued"
          : kind === "timeline" || kind === "travel"
            ? `T+${index + 1}`
            : kind === "files"
              ? "LOCAL"
              : kind === "inbox"
                ? "Unread"
                : undefined),
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
  const canDegrade = [
    "web", "video", "map", "places", "images", "news", "shopping", "travel", "weather",
    "audio", "podcast", "feed", "finance",
  ].includes(artifact.kind);
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
    audio: [/^(hãy\s+|giúp\s+)?(tìm|mở|nghe)?\s*(audio|âm\s+thanh|nhạc)(\s+về)?\s*/i],
    podcast: [/^(hãy\s+|giúp\s+)?(tìm|mở|nghe)?\s*(podcast)(\s+về)?\s*/i],
    feed: [/^(hãy\s+|giúp\s+)?(tạo|xem|tổng\s+hợp)?\s*(content\s+feed|feed|bảng\s+tin)(\s+về)?\s*/i],
    finance: [/^(hãy\s+|giúp\s+)?(xem|phân\s+tích|theo\s+dõi)?\s*(tài\s+chính|finance|giá)(\s+của)?\s*/i],
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
    files: [
      { id: "file-1", title: "Mission Assets", description: "/workspace/mission-assets", meta: "12 files" },
      { id: "file-2", title: "Research Archive", description: "/knowledge/research", meta: "2.4 GB" },
      { id: "file-3", title: "Generated Media", description: "/outputs/media", meta: "38 items" },
      { id: "file-4", title: "System Logs", description: "/runtime/logs", meta: "Live" },
    ],
    document: [
      { id: "doc-1", title: "Executive summary", description: "Decision-ready overview and key outcome", meta: "01" },
      { id: "doc-2", title: "Evidence", description: "Sources, observations and supporting details", meta: "02" },
      { id: "doc-3", title: "Recommendations", description: "Prioritized next actions with owners", meta: "03" },
    ],
    pdf: [
      { id: "pdf-1", title: "Page 01", description: "Cover, abstract and document metadata", meta: "1/12" },
      { id: "pdf-2", title: "Key findings", description: "Highlighted passages and extracted claims", meta: "4/12" },
      { id: "pdf-3", title: "References", description: "Linked citations and source appendix", meta: "12/12" },
    ],
    notes: [
      { id: "note-1", title: "Capture", description: "Fast ideas waiting to be organized", meta: "Pinned" },
      { id: "note-2", title: "Project memory", description: "Decisions, preferences and constraints", meta: "Linked" },
      { id: "note-3", title: "Next questions", description: "Unknowns worth investigating", meta: "Open" },
    ],
    inbox: [
      { id: "mail-1", title: "Mission update", description: "New evidence is ready for review", meta: "Now" },
      { id: "mail-2", title: "Approval requested", description: "Workflow is waiting at a safe checkpoint", meta: "Priority" },
      { id: "mail-3", title: "Daily digest", description: "7 signals summarized by Jarvis", meta: "08:30" },
    ],
    audio: [
      { id: "audio-1", title: "Focus Protocol", description: "Ambient command-center soundscape", meta: "04:18" },
      { id: "audio-2", title: "Voice Memo 07", description: "Captured idea with auto transcript", meta: "01:42" },
      { id: "audio-3", title: "System Theme", description: "J-Core interface audio profile", meta: "02:56" },
    ],
    podcast: [
      { id: "pod-1", title: "Agentic systems", description: "How AI workspaces become durable operating systems", meta: "28 min" },
      { id: "pod-2", title: "Interface intelligence", description: "Designing calm, high-density command centers", meta: "41 min" },
      { id: "pod-3", title: "Local-first future", description: "Ownership, memory and resilient tools", meta: "35 min" },
    ],
    feed: [
      { id: "feed-1", title: "Signals worth knowing", description: "Five verified developments selected for relevance", meta: "Briefing" },
      { id: "feed-2", title: "Creative radar", description: "Interfaces, media and ideas gaining momentum", meta: "Culture" },
      { id: "feed-3", title: "Deep read", description: "One long-form source with Jarvis annotations", meta: "12 min" },
      { id: "feed-4", title: "Watch queue", description: "Three videos grouped into a single learning path", meta: "Playlist" },
    ],
    finance: [
      { id: "fin-1", title: "Available budget", description: "Current operating envelope", meta: "72%" },
      { id: "fin-2", title: "Monthly spend", description: "Tools, APIs and subscriptions", meta: "18.4M" },
      { id: "fin-3", title: "Market watch", description: "Tracked instruments with notable movement", meta: "+3.8%" },
      { id: "fin-4", title: "Forecast", description: "Projected runway at current velocity", meta: "9 mo" },
    ],
    automation: [
      { id: "auto-1", title: "Signal detected", description: "A scheduled or external event starts the run", meta: "TRIGGER" },
      { id: "auto-2", title: "Jarvis reasons", description: "Context is enriched and a route is selected", meta: "AGENT" },
      { id: "auto-3", title: "Tools execute", description: "Approved actions run with observable state", meta: "ACTION" },
      { id: "auto-4", title: "Human checkpoint", description: "High-impact output waits for confirmation", meta: "REVIEW" },
    ],
    monitor: [
      { id: "sys-1", title: "CPU load", description: "8 logical processors", meta: "34%" },
      { id: "sys-2", title: "Memory", description: "Working set across active modules", meta: "61%" },
      { id: "sys-3", title: "Network", description: "Gateway round-trip latency", meta: "142ms" },
      { id: "sys-4", title: "Services", description: "7 of 8 modules responding", meta: "87%" },
    ],
    terminal: [
      { id: "term-1", title: "jcore status --all", description: "Inspect core services and active routes", meta: "READY" },
      { id: "term-2", title: "hub list --running", description: "Show live workspace surfaces", meta: "02" },
      { id: "term-3", title: "agent trace --latest", description: "Read the newest execution trace", meta: "LOG" },
    ],
  };
  return demos[kind] ?? [];
}
