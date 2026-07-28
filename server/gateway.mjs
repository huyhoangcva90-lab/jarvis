import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

const PORT = Number(process.env.JCORE_GATEWAY_PORT || 8787);
const HOST = process.env.JCORE_GATEWAY_HOST || "127.0.0.1";
const TOKEN = process.env.JCORE_GATEWAY_TOKEN || "";
const CORS_ORIGIN = process.env.JCORE_CORS_ORIGIN || "*";

const services = {
  hermes: {
    base: process.env.HERMES_BASE_URL || "http://127.0.0.1:8080",
    health: process.env.HERMES_HEALTH_URL || "http://127.0.0.1:8080/health",
    chat: process.env.HERMES_CHAT_URL || "",
    apiKey: process.env.HERMES_API_KEY || "",
  },
  openclaw: {
    base: process.env.OPENCLAW_BASE_URL || "http://127.0.0.1:18789",
    health: process.env.OPENCLAW_HEALTH_URL || "http://127.0.0.1:18789/health",
    task: process.env.OPENCLAW_TASK_URL || "",
    apiKey: process.env.OPENCLAW_API_KEY || "",
  },
  nineRouter: {
    base: process.env.NINEROUTER_BASE_URL || "http://127.0.0.1:9000",
    health: process.env.NINEROUTER_HEALTH_URL || "http://127.0.0.1:9000/health",
    chat: process.env.NINEROUTER_CHAT_URL || "",
    apiKey: process.env.NINEROUTER_API_KEY || "",
  },
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": CORS_ORIGIN,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
  });
  res.end(JSON.stringify(payload));
}

function authorized(req) {
  if (!TOKEN) return true;
  return req.headers.authorization === `Bearer ${TOKEN}`;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function probe(url) {
  const started = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    const response = await fetch(url, { method: "GET", signal: controller.signal });
    clearTimeout(timeout);
    return {
      online: response.ok || response.status < 500,
      status: response.status,
      latencyMs: Date.now() - started,
      url,
    };
  } catch (error) {
    return {
      online: false,
      status: 0,
      latencyMs: Date.now() - started,
      url,
      error: error?.name === "AbortError" ? "timeout" : "offline",
    };
  }
}

function normalizeReply(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  return (
    data.reply ||
    data.message ||
    data.content ||
    data.output ||
    data.response ||
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.text ||
    ""
  );
}

async function proxyJson(url, payload, apiKey = "") {
  const headers = { "content-type": "application/json" };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // keep raw text
  }
  return { ok: response.ok, status: response.status, data };
}

function mockReply(message) {
  return `J-Core local gateway online. Hermes thật chưa được cấu hình HERMES_CHAT_URL, nên mình đang trả lời mock cho: "${message || "ping"}".`;
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (!authorized(req)) return sendJson(res, 401, { error: "unauthorized" });

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/health") {
      const [hermes, openclaw, nineRouter] = await Promise.all([
        probe(services.hermes.health),
        probe(services.openclaw.health),
        probe(services.nineRouter.health),
      ]);
      return sendJson(res, 200, {
        gateway: { online: true, host: HOST, port: PORT },
        services: { hermes, openclaw, nineRouter },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/hermes/chat") {
      const body = await readJson(req);
      if (!services.hermes.chat) {
        return sendJson(res, 200, { reply: mockReply(body.message || body.prompt), source: "mock" });
      }
      const result = await proxyJson(services.hermes.chat, body, services.hermes.apiKey);
      return sendJson(res, result.ok ? 200 : 502, {
        reply: normalizeReply(result.data),
        upstreamStatus: result.status,
        raw: result.data,
        source: "hermes",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/9router/chat") {
      const body = await readJson(req);
      if (!services.nineRouter.chat) {
        return sendJson(res, 200, { reply: "9Router proxy chưa cấu hình NINEROUTER_CHAT_URL.", source: "mock" });
      }
      const result = await proxyJson(services.nineRouter.chat, body, services.nineRouter.apiKey);
      return sendJson(res, result.ok ? 200 : 502, { upstreamStatus: result.status, raw: result.data, source: "nineRouter" });
    }

    if (req.method === "POST" && url.pathname === "/api/openclaw/task") {
      const body = await readJson(req);
      if (!services.openclaw.task) {
        return sendJson(res, 200, { ok: true, message: "OpenClaw proxy chưa cấu hình OPENCLAW_TASK_URL.", source: "mock" });
      }
      const result = await proxyJson(services.openclaw.task, body, services.openclaw.apiKey);
      return sendJson(res, result.ok ? 200 : 502, { upstreamStatus: result.status, raw: result.data, source: "openclaw" });
    }

    return sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    return sendJson(res, 500, { error: error?.message || "gateway_error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`J-Core local gateway: http://${HOST}:${PORT}`);
  console.log(`Hermes: ${services.hermes.base}`);
  console.log(`OpenClaw: ${services.openclaw.base}`);
  console.log(`9Router: ${services.nineRouter.base}`);
});
