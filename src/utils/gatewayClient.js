export const DEFAULT_GATEWAY_URL = "https://jarvisidhuykl.huykl.id.vn";

const GATEWAY_ERROR_MESSAGES = {
  unauthorized: "Gateway token không hợp lệ.",
  hermes_not_configured: "Hermes chưa được cấu hình trên gateway.",
  hermes_profile_not_allowed: "Hermes profile không nằm trong danh sách được phép.",
  hermes_profile_multiplex_disabled: "Hermes profile phụ cần bật multiplex trên Ubuntu.",
  openclaw_not_configured: "OpenClaw task endpoint chưa được cấu hình trên gateway.",
  ninerouter_not_configured: "9Router chat endpoint chưa được cấu hình trên gateway.",
  claude_not_configured: "Claude bridge chưa được cấu hình trên gateway.",
  ai_not_configured: "Chưa có AI upstream nào được cấu hình để trả lời.",
  all_ai_upstreams_failed: "Tất cả AI upstream đã cấu hình đều không phản hồi.",
  payload_too_large: "Dữ liệu gửi lên vượt quá giới hạn gateway.",
  unknown_workspace_root: "Workspace root không tồn tại trong cấu hình Gateway.",
  workspace_root_unavailable: "Workspace root đang không khả dụng trên Ubuntu.",
  workspace_access_denied: "Đường dẫn nằm ngoài workspace được phép.",
  workspace_path_not_found: "Không tìm thấy đường dẫn trên Ubuntu.",
  workspace_not_a_directory: "Đường dẫn này không phải thư mục.",
  workspace_not_a_file: "Đường dẫn này không phải file.",
  workspace_file_too_large: "File vượt quá giới hạn đọc 512 KB.",
  workspace_file_type_not_allowed: "Gateway chỉ cho đọc các định dạng văn bản an toàn.",
  terminal_disabled: "Ubuntu command broker đang bị tắt trên Gateway.",
  terminal_missing_command: "Chưa nhập lệnh Ubuntu.",
  terminal_missing_argument: "Lệnh còn thiếu tham số bắt buộc.",
  terminal_command_rejected: "Lệnh bị từ chối bởi bộ lọc terminal.",
  terminal_command_not_allowed: "Lệnh không nằm trong danh mục vận hành được phép.",
  terminal_service_not_allowed: "Service này không nằm trong danh sách Gateway được quản lý.",
  terminal_private_mode_disabled: "Private Ubuntu shell chưa được bật trên Gateway.",
  terminal_private_mode_requires_ubuntu: "Private shell chỉ chạy trên Ubuntu Gateway host.",
  dashboard_command_not_allowed: "Lệnh dashboard này chưa nằm trong allowlist Gateway.",
  upstream_timeout: "Dịch vụ phía sau gateway phản hồi quá chậm.",
  upstream_offline: "Dịch vụ phía sau gateway đang offline.",
};

export function getGatewayConfig(data) {
  const gateway = data?.endpoints?.gateway || DEFAULT_GATEWAY_URL;
  const token = String(data?.endpoints?.gatewayToken || "")
    .trim()
    .replace(/^Bearer\s+/i, "");
  return {
    gateway: String(gateway).trim().replace(/\/+$/, ""),
    token,
  };
}

function createRequestId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `jcore-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export async function gatewayFetch(data, path, options = {}) {
  const { gateway, token } = getGatewayConfig(data);
  const { timeoutMs = 15000, headers: optionHeaders, ...fetchOptions } = options;
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, ...(optionHeaders || {}) };
  if (fetchOptions.body && !headers["content-type"]) {
    headers["content-type"] = "application/json";
  }
  if (token) headers.authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  if (fetchOptions.signal) {
    if (fetchOptions.signal.aborted) controller.abort();
    else fetchOptions.signal.addEventListener("abort", abortFromCaller, { once: true });
  }
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${gateway}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    const text = await response.text();
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }

    const responseRequestId = response.headers.get("x-request-id") || json.requestId || requestId;
    json.requestId = responseRequestId;
    json.meta = {
      ...(json.meta || {}),
      requestId: responseRequestId,
      upstream: response.headers.get("x-jcore-upstream") || json.source || "",
      serverTiming: response.headers.get("server-timing") || "",
    };

    if (!response.ok) {
      const code = json.error || json.message;
      const error = new Error(GATEWAY_ERROR_MESSAGES[code] || code || `Gateway error ${response.status}`);
      error.status = response.status;
      error.details = json;
      error.requestId = responseRequestId;
      throw error;
    }
    return json;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`Gateway timeout after ${timeoutMs}ms`);
      timeoutError.requestId = requestId;
      throw timeoutError;
    }
    if (error instanceof TypeError) {
      const networkError = new Error("Không thể kết nối gateway. Hãy kiểm tra URL, mạng và CORS.");
      networkError.requestId = requestId;
      throw networkError;
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
    fetchOptions.signal?.removeEventListener("abort", abortFromCaller);
  }
}

export function getGatewayReply(payload) {
  const data = payload?.raw ?? payload;
  if (typeof data === "string") return data;
  return (
    payload?.reply ||
    payload?.message ||
    data?.reply ||
    data?.message ||
    data?.content ||
    data?.output ||
    data?.response ||
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    ""
  );
}
