export const DEFAULT_GATEWAY_URL = "https://jarvisidhuykl.huykl.id.vn";

const GATEWAY_ERROR_MESSAGES = {
  unauthorized: "Gateway token không hợp lệ.",
  hermes_not_configured: "Hermes chưa được cấu hình trên gateway.",
  openclaw_not_configured: "OpenClaw task endpoint chưa được cấu hình trên gateway.",
  ninerouter_not_configured: "9Router chat endpoint chưa được cấu hình trên gateway.",
  claude_not_configured: "Claude bridge chưa được cấu hình trên gateway.",
  ai_not_configured: "Chưa có Hermes, 9Router hoặc Claude bridge nào được cấu hình để trả lời.",
  all_ai_upstreams_failed: "Tất cả AI upstream đã cấu hình đều không phản hồi.",
  payload_too_large: "Dữ liệu gửi lên vượt quá giới hạn gateway.",
  upstream_timeout: "Dịch vụ phía sau gateway phản hồi quá chậm.",
  upstream_offline: "Dịch vụ phía sau gateway đang offline.",
};

export function getGatewayConfig(data) {
  const gateway = data?.endpoints?.gateway || DEFAULT_GATEWAY_URL;
  const token = data?.endpoints?.gatewayToken || "";
  return {
    gateway: gateway.replace(/\/+$/, ""),
    token,
  };
}

export async function gatewayFetch(data, path, options = {}) {
  const { gateway, token } = getGatewayConfig(data);
  const { timeoutMs = 15000, headers: optionHeaders, ...fetchOptions } = options;
  const headers = { ...(optionHeaders || {}) };
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
    if (!response.ok) {
      const code = json.error || json.message;
      const error = new Error(GATEWAY_ERROR_MESSAGES[code] || code || `Gateway error ${response.status}`);
      error.status = response.status;
      error.details = json;
      throw error;
    }
    return json;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Gateway timeout after ${timeoutMs}ms`);
    }
    if (error instanceof TypeError) {
      throw new Error("Không thể kết nối gateway. Hãy kiểm tra URL, mạng và CORS.");
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
