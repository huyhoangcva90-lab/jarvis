/**
 * Jarvis Infinity System — Router Engine
 * LLM routing logic extracted from nineRouterDashboard
 */

export type RouterCombo = {
  id: string;
  label: string;
  description: string;
  providers: string[];
};

export const ROUTER_COMBOS: RouterCombo[] = [
  {
    id: "balanced",
    label: "Balanced Core",
    description: "Tối ưu hóa giữa chi phí và chất lượng cho các tác vụ hàng ngày.",
    providers: ["Claude 3.5 Sonnet", "GPT-4o mini"],
  },
  {
    id: "code",
    label: "Code Master",
    description: "Cấu hình ưu tiên sửa lỗi, tối ưu thuật toán và giải quyết logic lập trình.",
    providers: ["Claude 3.5 Sonnet", "DeepSeek Coder v2"],
  },
  {
    id: "economy",
    label: "Economy Saver",
    description: "Sử dụng mô hình nhỏ, phản hồi nhanh và cực kỳ tiết kiệm ngân sách.",
    providers: ["GPT-4o mini", "Gemini 1.5 Flash"],
  },
  {
    id: "research",
    label: "Research Deep-Dive",
    description: "Chế độ suy luận sâu chuỗi suy nghĩ dài cho các vấn đề phức tạp.",
    providers: ["o1 Pro", "Claude 3.5 Sonnet"],
  }
];

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateCost(tokens: number, model?: string): number {
  let rate = 0.000015; // default balanced or code
  
  if (model === "research") {
    rate = 0.00003;
  } else if (model === "economy") {
    rate = 0.000002;
  }
  
  return tokens * rate;
}
