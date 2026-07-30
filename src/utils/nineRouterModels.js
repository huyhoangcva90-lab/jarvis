export const DEFAULT_NINEROUTER_MODEL = "Code";

export const NINEROUTER_MODELS = [
  { id: "Code", label: "Code", detail: "Lập trình mặc định" },
  { id: "Combofree", label: "Combo Free", detail: "Định tuyến tiết kiệm" },
  { id: "Gemini", label: "Gemini", detail: "Đa phương thức" },
  { id: "claudecode", label: "Claude Code", detail: "Tác vụ coding dài" },
];

export function getNineRouterModel(data) {
  return data?.endpoints?.nineRouterModel?.trim() || DEFAULT_NINEROUTER_MODEL;
}
