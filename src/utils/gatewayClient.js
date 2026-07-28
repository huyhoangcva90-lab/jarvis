export function getGatewayConfig(data) {
  const gateway = data?.endpoints?.gateway || "http://127.0.0.1:8787";
  const token = data?.endpoints?.gatewayToken || "";
  return {
    gateway: gateway.replace(/\/+$/, ""),
    token,
  };
}

export async function gatewayFetch(data, path, options = {}) {
  const { gateway, token } = getGatewayConfig(data);
  const headers = {
    "content-type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${gateway}${path}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!response.ok) {
    throw new Error(json.error || json.message || `Gateway error ${response.status}`);
  }
  return json;
}
