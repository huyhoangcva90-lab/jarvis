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
  workspace_write_disabled: "Gateway chưa bật quyền sửa workspace. Đặt JCORE_WORKSPACE_WRITE_ENABLED=true rồi khởi động lại gateway.",
  workspace_file_changed: "File đã thay đổi trên máy chủ. Hãy tải lại trước khi lưu để tránh ghi đè.",
  terminal_disabled: "Ubuntu command broker đang bị tắt trên Gateway.",
  terminal_missing_command: "Chưa nhập lệnh Ubuntu.",
  terminal_missing_argument: "Lệnh còn thiếu tham số bắt buộc.",
  terminal_command_rejected: "Lệnh bị từ chối bởi bộ lọc terminal.",
  terminal_command_not_allowed: "Lệnh không nằm trong danh mục vận hành được phép.",
  terminal_service_not_allowed: "Service này không nằm trong danh sách Gateway được quản lý.",
  terminal_private_mode_disabled: "Private Ubuntu shell chưa được bật trên Gateway.",
  terminal_private_mode_requires_ubuntu: "Private shell chỉ chạy trên Ubuntu Gateway host.",
  dashboard_command_not_allowed: "Lệnh dashboard này chưa nằm trong allowlist Gateway.",
  voice_stt_not_configured: "Hermes STT local chưa được cấu hình; J-Core sẽ dùng nhận giọng nói của trình duyệt.",
  voice_tts_not_configured: "Hermes TTS local chưa được cấu hình; J-Core sẽ dùng giọng đọc của trình duyệt.",
  voice_audio_missing: "Chưa nhận được dữ liệu microphone.",
  voice_text_invalid: "Nội dung cần đọc không hợp lệ hoặc quá dài.",
  upstream_timeout: "Dịch vụ phía sau gateway phản hồi quá chậm.",
  upstream_offline: "Dịch vụ phía sau gateway đang offline.",
  app_config_not_configured: "Chưa khai báo file cấu hình của app trên Ubuntu.",
  app_config_not_found: "Không tìm thấy file cấu hình trên Ubuntu.",
  app_config_not_a_file: "Đường dẫn cấu hình không phải file.",
  app_config_type_not_allowed: "Chỉ hỗ trợ JSON, YAML, TOML, INI và CONF.",
  app_config_too_large: "File cấu hình vượt quá 512 KB.",
  app_config_write_disabled: "Quyền sửa cấu hình app đang tắt trên Ubuntu.",
  app_config_changed: "File đã thay đổi; hãy tải lại trước khi lưu.",
};

export function getGatewayConfig(data) {
  const sameOrigin = data?.auth?.sessionMode === "same-origin";
  const gateway = sameOrigin && typeof window !== "undefined"
    ? window.location.origin
    : data?.endpoints?.gateway || DEFAULT_GATEWAY_URL;
  const token = String(data?.endpoints?.gatewayToken || "")
    .trim()
    .replace(/^Bearer\s+/i, "");
  return {
    gateway: String(gateway).trim().replace(/\/+$/, ""),
    token: sameOrigin ? "" : token,
    sameOrigin,
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
      credentials: fetchOptions.credentials || "include",
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

export async function gatewayBinaryFetch(data, path, options = {}) {
  const { gateway, token } = getGatewayConfig(data);
  const { timeoutMs = 60000, headers: optionHeaders, ...fetchOptions } = options;
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, ...(optionHeaders || {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${gateway}${path}`, { ...fetchOptions, credentials: fetchOptions.credentials || "include", headers, signal: controller.signal });
    if (!response.ok) {
      let details = {};
      try { details = await response.json(); } catch { details = {}; }
      const code = details.error || details.message;
      const error = new Error(GATEWAY_ERROR_MESSAGES[code] || code || `Gateway error ${response.status}`);
      error.status = response.status;
      error.details = details;
      error.requestId = response.headers.get("x-request-id") || requestId;
      throw error;
    }
    return response;
  } catch (error) {
    if (error?.name === "AbortError") throw new Error(`Gateway timeout after ${timeoutMs}ms`);
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
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
