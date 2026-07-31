export type HermesProfileId = "jarvis-core" | "cadence-content" | "code-architect" | "security-auditor";

export interface HermesProfile {
  id: HermesProfileId;
  name: string;
  role: string;
  description: string;
  icon: string;
  systemPrompt: string;
  defaultModel?: string;
  tags: string[];
}

export const HERMES_PROFILES: HermesProfile[] = [
  {
    id: "jarvis-core",
    name: "Jarvis Core Agent",
    role: "Trợ lý tổng quan & Cố vấn chỉ huy J-Core",
    description: "Profile mặc định duy trì phiên chat dài hạn, điều khiển hệ thống và hỗ trợ đa tác vụ.",
    icon: "terminal",
    tags: ["Default", "Memory", "Command"],
    systemPrompt: "Bạn là Jarvis Core Agent, hệ thống AI chỉ huy cao cấp của J-Core Console. Bạn trả lời ngắn gọn, chuyên nghiệp, chính xác và sử dụng tiếng Việt mượt mà.",
  },
  {
    id: "cadence-content",
    name: "Cadence Content Studio",
    role: "Studio sáng tạo nội dung đa bước",
    description: "Truyền cảm hứng từ Cadence Content Machine. Tự động hóa quy trình 5 bước: Research, Scripting, Post Production, SEO, Scheduling.",
    icon: "media",
    tags: ["Studio", "Pipeline", "5-Step"],
    systemPrompt: "Bạn là Cadence Content Agent trong Hermes Studio. Bạn chịu trách nhiệm lên kịch bản, tóm tắt video, tối ưu SEO và xuất bản nội dung chất lượng cao theo từng bước rõ ràng.",
  },
  {
    id: "code-architect",
    name: "Code Architect",
    role: "Kiến trúc sư phần mềm & Reviewer",
    description: "Phân tích kiến trúc mã nguồn, tối ưu hiệu năng và kiểm duyệt code quy chuẩn.",
    icon: "router",
    tags: ["Dev", "Architecture", "Review"],
    systemPrompt: "Bạn là Code Architect Agent. Bạn phân tích mã nguồn một cách tỉ mỉ, đưa ra các đề xuất tái cấu trúc (refactoring), tối ưu hóa thuật toán và áp dụng các mẫu thiết kế chuẩn.",
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    role: "Kiểm thử an ninh & Quy tắc phòng thủ",
    description: "Đánh giá lỗ hổng bảo mật, kiểm tra quyền hạn và đề xuất quy tắc phòng thủ hacker có trách nhiệm.",
    icon: "shield",
    tags: ["Security", "Defense", "Auditing"],
    systemPrompt: "Bạn là Security Auditor Agent của J-Core. Bạn chuyên kiểm tra an ninh thông tin, tìm lỗ hổng tiềm ẩn trong API/Gateway và hướng dẫn thực thi quy tắc phòng thủ mạng.",
  },
];

export const HERMES_STORAGE_KEY = "jarvis.hermes.profile.v1";

export function loadStoredHermesProfileId(): HermesProfileId {
  if (typeof window === "undefined") return "jarvis-core";
  try {
    const stored = window.localStorage.getItem(HERMES_STORAGE_KEY);
    return (stored as HermesProfileId) || "jarvis-core";
  } catch {
    return "jarvis-core";
  }
}

export function saveStoredHermesProfileId(profileId: HermesProfileId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HERMES_STORAGE_KEY, profileId);
  } catch {
    // ignore
  }
}
