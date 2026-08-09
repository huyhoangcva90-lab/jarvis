import type { EnergyPalette } from "./orbPreferences";

export type HermesProfileId = string;
export const DEFAULT_HERMES_PROFILE_ID: HermesProfileId = "jarvis";

export interface HermesProfile {
  id: HermesProfileId;
  name: string;
  role: string;
  description: string;
  icon: string;
  systemPrompt: string;
  defaultModel?: string;
  tags: string[];
  palette?: EnergyPalette;
  source?: "local" | "hermes";
}

export const HERMES_PROFILES: HermesProfile[] = [
  {
    id: "jarvis",
    name: "Jarvis Orchestrator",
    role: "Trợ lý điều phối mặc định của J-Core",
    description: "Profile Hermes mặc định cho web, có phiên hội thoại bền vững và cùng cơ chế session như Telegram.",
    icon: "terminal",
    tags: ["Default", "Memory", "Command"],
    palette: "gold",
    systemPrompt: "Bạn là Jarvis Core Agent, hệ thống AI chỉ huy cao cấp của J-Core Console. Bạn trả lời ngắn gọn, chuyên nghiệp, chính xác và sử dụng tiếng Việt mượt mà.",
  },
  {
    id: "ev-personal",
    name: "E.V Personal Link",
    role: "Trợ lý hoạch định đời sống & liên kết cá nhân",
    description: "Profile riêng cho Spider Mode: biến địa điểm, việc cần làm, ghi chú và liên kết thành một bản đồ hành động dễ hình dung.",
    icon: "router",
    tags: ["Personal", "Planner", "OpenClaw", "Notion"],
    palette: "spider",
    systemPrompt: "Bạn là E.V, trợ lý cá nhân trong Spider Link Hub. Hãy trả lời bằng tiếng Việt, ngắn gọn và thực tế. Mỗi kế hoạch nên được chia thành các nút: Ăn, Uống, Chơi, Việc phải làm, Người liên quan và Liên kết. Luôn đề xuất bước tiếp theo rõ ràng và định dạng phù hợp để đồng bộ sang Notion/OpenClaw.",
  },
  {
    id: "cadence-content",
    name: "Cadence Content Studio",
    role: "Studio sáng tạo nội dung đa bước",
    description: "Truyền cảm hứng từ Cadence Content Machine. Tự động hóa quy trình 5 bước: Research, Scripting, Post Production, SEO, Scheduling.",
    icon: "media",
    tags: ["Studio", "Pipeline", "5-Step"],
    palette: "violet",
    systemPrompt: "Bạn là Cadence Content Agent trong Hermes Studio. Bạn chịu trách nhiệm lên kịch bản, tóm tắt video, tối ưu SEO và xuất bản nội dung chất lượng cao theo từng bước rõ ràng.",
  },
  {
    id: "code-architect",
    name: "Code Architect",
    role: "Kiến trúc sư phần mềm & Reviewer",
    description: "Phân tích kiến trúc mã nguồn, tối ưu hiệu năng và kiểm duyệt code quy chuẩn.",
    icon: "router",
    tags: ["Dev", "Architecture", "Review"],
    palette: "blue",
    systemPrompt: "Bạn là Code Architect Agent. Bạn phân tích mã nguồn một cách tỉ mỉ, đưa ra các đề xuất tái cấu trúc (refactoring), tối ưu hóa thuật toán và áp dụng các mẫu thiết kế chuẩn.",
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    role: "Kiểm thử an ninh & Quy tắc phòng thủ",
    description: "Đánh giá lỗ hổng bảo mật, kiểm tra quyền hạn và đề xuất quy tắc phòng thủ hacker có trách nhiệm.",
    icon: "shield",
    tags: ["Security", "Defense", "Auditing"],
    palette: "red",
    systemPrompt: "Bạn là Security Auditor Agent của J-Core. Bạn chuyên kiểm tra an ninh thông tin, tìm lỗ hổng tiềm ẩn trong API/Gateway và hướng dẫn thực thi quy tắc phòng thủ mạng.",
  },
];

export const HERMES_STORAGE_KEY = "jarvis.hermes.profile.v2";

export function loadStoredHermesProfileId(): HermesProfileId {
  if (typeof window === "undefined") return DEFAULT_HERMES_PROFILE_ID;
  try {
    const stored = window.localStorage.getItem(HERMES_STORAGE_KEY);
    if (stored === "jarvis-core") return DEFAULT_HERMES_PROFILE_ID;
    return stored && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(stored) ? stored : DEFAULT_HERMES_PROFILE_ID;
  } catch {
    return DEFAULT_HERMES_PROFILE_ID;
  }
}

export function mergeHermesProfiles(remoteProfiles: unknown): HermesProfile[] {
  const fallbackById = new Map(HERMES_PROFILES.map((profile) => [profile.id, profile]));
  if (!Array.isArray(remoteProfiles)) return HERMES_PROFILES;
  const merged = remoteProfiles.flatMap((value): HermesProfile[] => {
    if (!value || typeof value !== "object") return [];
    const item = value as Record<string, unknown>;
    const id = String(item.id || "").trim();
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(id)) return [];
    const fallback = fallbackById.get(id);
    const palette = String(item.palette || fallback?.palette || "gold") as EnergyPalette;
    return [{
      id,
      name: String(item.name || fallback?.name || id),
      role: String(item.role || fallback?.role || "Hermes profile"),
      description: String(item.description || fallback?.description || `Profile ${id} được đồng bộ từ Hermes Ubuntu.`),
      icon: String(item.icon || fallback?.icon || "terminal"),
      systemPrompt: fallback?.systemPrompt || "",
      defaultModel: item.defaultModel ? String(item.defaultModel) : fallback?.defaultModel,
      tags: Array.isArray(item.tags) ? item.tags.map(String).slice(0, 8) : fallback?.tags || ["Hermes"],
      palette,
      source: "hermes",
    }];
  });
  return merged.length ? merged : HERMES_PROFILES;
}

export function saveStoredHermesProfileId(profileId: HermesProfileId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HERMES_STORAGE_KEY, profileId);
  } catch {
    // ignore
  }
}
