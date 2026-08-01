import { createServer, request as httpRequest } from "node:http";
import { randomUUID } from "node:crypto";
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
const CORS_ORIGINS = (process.env.JCORE_CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const IS_LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]).has(HOST);
const STARTED_AT = Date.now();
const CIRCUIT_FAILURE_THRESHOLD = Number(process.env.JCORE_CIRCUIT_FAILURE_THRESHOLD || 3);
const CIRCUIT_OPEN_MS = Number(process.env.JCORE_CIRCUIT_OPEN_MS || 30000);
const DASHBOARD_SESSION_TTL_MS = Number(process.env.JCORE_DASHBOARD_SESSION_TTL_MS || 30 * 60 * 1000);
const HERMES_BASE_URL = process.env.HERMES_BASE_URL || "http://127.0.0.1:8642";
const HERMES_DEFAULT_PROFILE = process.env.HERMES_DEFAULT_PROFILE || "jarvis";
const HERMES_MULTIPLEX_PROFILES = /^(1|true|yes|on)$/i.test(process.env.HERMES_MULTIPLEX_PROFILES || "false");
const HERMES_ALLOWED_PROFILES = new Set(
  (process.env.HERMES_ALLOWED_PROFILES || "jarvis,cadence-content,code-architect,security-auditor")
    .split(",")
    .map((profile) => profile.trim())
    .filter(Boolean),
);
HERMES_ALLOWED_PROFILES.add(HERMES_DEFAULT_PROFILE);
const HERMES_SESSION_MODE = process.env.HERMES_SESSION_MODE === "telegram" ? "telegram" : "web";
const HERMES_SESSION_ID = process.env.HERMES_SESSION_ID || "jarvis-web-primary";
const HERMES_SESSION_KEY = process.env.HERMES_SESSION_KEY || "agent:jarvis:web:dm:owner";

const gatewayStats = {
  requests: 0,
  aiRequests: 0,
  successes: 0,
  failures: 0,
};

const upstreamCircuits = new Map();
const dashboardSessions = new Map();

if (!TOKEN && !IS_LOOPBACK) {
  throw new Error("JCORE_GATEWAY_TOKEN is required when the gateway listens beyond localhost.");
}

const services = {
  hermes: {
    base: HERMES_BASE_URL,
    health: process.env.HERMES_HEALTH_URL || `${HERMES_BASE_URL.replace(/\/+$/, "")}/v1/models`,
    chat: process.env.HERMES_CHAT_URL || `${HERMES_BASE_URL.replace(/\/+$/, "")}/v1/chat/completions`,
    apiKey: process.env.HERMES_API_KEY || "",
    model: process.env.HERMES_MODEL || "hermes-agent",
  },
  openclaw: {
    base: process.env.OPENCLAW_BASE_URL || "http://127.0.0.1:18789",
    health: process.env.OPENCLAW_HEALTH_URL || "http://127.0.0.1:18789/v1/models",
    chat: process.env.OPENCLAW_CHAT_URL || "",
    task: process.env.OPENCLAW_TASK_URL || "",
    apiKey: process.env.OPENCLAW_API_KEY || "",
    model: process.env.OPENCLAW_MODEL || "openclaw/default",
  },
  nineRouter: {
    base: process.env.NINEROUTER_BASE_URL || "http://127.0.0.1:20128",
    health: process.env.NINEROUTER_HEALTH_URL || "http://127.0.0.1:20128/v1/models",
    chat: process.env.NINEROUTER_CHAT_URL || "",
    apiKey: process.env.NINEROUTER_API_KEY || "",
    model: process.env.NINEROUTER_MODEL || "Code",
  },
  claude: {
    base: process.env.CLAUDE_BASE_URL || "http://127.0.0.1:3001",
    health: process.env.CLAUDE_HEALTH_URL || "http://127.0.0.1:3001/health",
    chat: process.env.CLAUDE_CHAT_URL || "",
    apiKey: process.env.CLAUDE_API_KEY || "",
  },
};

function getCorsOrigin(req) {
  const requestOrigin = (req.headers.origin || "").replace(/\/+$/, "");
  if (CORS_ORIGINS.includes("*")) return requestOrigin || "*";
  if (requestOrigin && CORS_ORIGINS.includes(requestOrigin)) return requestOrigin;
  return CORS_ORIGINS[0] || "null";
}

function sendJson(req, res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "x-request-id": req.requestId,
    "access-control-allow-origin": getCorsOrigin(req),
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-request-id",
    "access-control-expose-headers": "x-request-id,x-jcore-upstream,server-timing",
    "access-control-allow-credentials": "true",
    "access-control-max-age": "86400",
    "vary": "Origin",
    ...extraHeaders,
  });
  res.end(JSON.stringify({ requestId: req.requestId, ...payload }));
}

function authorized(req) {
  if (!TOKEN) return true;
  return req.headers.authorization === `Bearer ${TOKEN}`;
}

function cookieValue(req, name) {
  const cookies = String(req.headers.cookie || "").split(";");
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

function authorizedDashboardSession(req) {
  const sessionId = cookieValue(req, "jcore_9router_session");
  const expiresAt = dashboardSessions.get(sessionId) || 0;
  if (!sessionId || expiresAt <= Date.now()) {
    if (sessionId) dashboardSessions.delete(sessionId);
    return false;
  }
  return true;
}

function issueDashboardSession(req) {
  const sessionId = randomUUID();
  dashboardSessions.set(sessionId, Date.now() + DASHBOARD_SESSION_TTL_MS);
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = forwardedProto === "https" || (!forwardedProto && !IS_LOOPBACK);
  const attributes = [
    `jcore_9router_session=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${Math.floor(DASHBOARD_SESSION_TTL_MS / 1000)}`,
    secure ? "SameSite=None" : "SameSite=Lax",
  ];
  if (secure) attributes.push("Secure", "Partitioned");
  return attributes.join("; ");
}

async function readJson(req) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > 1024 * 1024) {
      const error = new Error("payload_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function probe(url, apiKey = "") {
  const started = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    const headers = apiKey ? { authorization: `Bearer ${apiKey}` } : {};
    const response = await fetch(url, { method: "GET", headers, signal: controller.signal });
    clearTimeout(timeout);
    return {
      online: response.ok || response.status < 500,
      status: response.status,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      online: false,
      status: 0,
      latencyMs: Date.now() - started,
      error: error?.name === "AbortError" ? "timeout" : "offline",
    };
  }
}

async function fetchJson(url, apiKey = "", timeoutMs = 5000) {
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = apiKey ? { authorization: `Bearer ${apiKey}` } : {};
    const response = await fetch(url, { method: "GET", headers, signal: controller.signal });
    const text = await response.text();
    let data = text;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // Preserve non-JSON upstream responses for diagnostics.
    }
    return {
      ok: response.ok,
      status: response.status,
      data,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: error?.name === "AbortError" ? "upstream_timeout" : "upstream_offline" },
      latencyMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function proxyNineRouter(req, res) {
  return new Promise((resolve) => {
    const upstreamBase = new URL(services.nineRouter.base);
    const headers = { ...req.headers, host: upstreamBase.host };
    delete headers.authorization;
    delete headers["x-forwarded-host"];
    delete headers["x-forwarded-proto"];

    const upstream = httpRequest({
      protocol: upstreamBase.protocol,
      hostname: upstreamBase.hostname,
      port: upstreamBase.port || 80,
      method: req.method,
      path: req.url,
      headers,
    }, (upstreamResponse) => {
      const responseHeaders = { ...upstreamResponse.headers };
      responseHeaders["cache-control"] = responseHeaders["cache-control"] || "no-store";
      responseHeaders["x-content-type-options"] = "nosniff";
      delete responseHeaders["x-frame-options"];
      const frameAncestors = CORS_ORIGINS.includes("*")
        ? "*"
        : CORS_ORIGINS.map((origin) => origin.replace(/\/+$/, "")).join(" ");
      const upstreamCsp = String(responseHeaders["content-security-policy"] || "")
        .replace(/(?:^|;)\s*frame-ancestors\s+[^;]*/gi, "")
        .replace(/^;\s*|\s*;$/g, "");
      responseHeaders["content-security-policy"] = [
        upstreamCsp,
        `frame-ancestors ${frameAncestors || "'self'"}`,
      ].filter(Boolean).join("; ");
      res.writeHead(upstreamResponse.statusCode || 502, responseHeaders);
      upstreamResponse.pipe(res);
      upstreamResponse.on("end", resolve);
    });

    upstream.on("error", () => {
      if (!res.headersSent) {
        sendJson(req, res, 502, { error: "ninerouter_dashboard_offline" });
      } else {
        res.end();
      }
      resolve();
    });
    req.pipe(upstream);
  });
}

function getCircuit(name) {
  if (!upstreamCircuits.has(name)) {
    upstreamCircuits.set(name, {
      failures: 0,
      openUntil: 0,
      lastStatus: null,
      lastLatencyMs: null,
      lastError: null,
    });
  }
  return upstreamCircuits.get(name);
}

function circuitSnapshot(name) {
  const circuit = getCircuit(name);
  return {
    state: circuit.openUntil > Date.now() ? "open" : circuit.failures > 0 ? "degraded" : "closed",
    failures: circuit.failures,
    retryAt: circuit.openUntil > Date.now() ? new Date(circuit.openUntil).toISOString() : null,
    lastStatus: circuit.lastStatus,
    lastLatencyMs: circuit.lastLatencyMs,
    lastError: circuit.lastError,
  };
}

function recordUpstreamResult(name, result) {
  const circuit = getCircuit(name);
  circuit.lastStatus = result.status;
  circuit.lastLatencyMs = result.latencyMs;
  circuit.lastError = result.ok ? null : result.error;
  if (result.ok) {
    circuit.failures = 0;
    circuit.openUntil = 0;
    return;
  }
  circuit.failures += 1;
  if (circuit.failures >= CIRCUIT_FAILURE_THRESHOLD) {
    circuit.openUntil = Date.now() + CIRCUIT_OPEN_MS;
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

async function proxyJson(url, payload, apiKey = "", extraHeaders = {}) {
  const started = Date.now();
  const headers = { "content-type": "application/json", ...extraHeaders };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await response.text();
    let data = text;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // keep raw text
    }
    return {
      ok: response.ok,
      status: response.status,
      data,
      latencyMs: Date.now() - started,
      error: response.ok ? null : normalizeReply(data) || data?.error || `upstream_${response.status}`,
      upstreamHeaders: {
        sessionId: response.headers.get("x-hermes-session-id") || "",
        sessionKey: response.headers.get("x-hermes-session-key") || "",
        completed: response.headers.get("x-hermes-completed") || "",
        partial: response.headers.get("x-hermes-partial") || "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: error?.name === "AbortError" ? "upstream_timeout" : "upstream_offline" },
      latencyMs: Date.now() - started,
      error: error?.name === "AbortError" ? "upstream_timeout" : "upstream_offline",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function safeHermesIdentifier(value) {
  const normalized = String(value || "").trim();
  return /^[a-zA-Z0-9._:@-]{1,256}$/.test(normalized) ? normalized : "";
}

function normalizeHermesProfile(value) {
  const profile = String(value || HERMES_DEFAULT_PROFILE).trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(profile)) return "";
  return HERMES_ALLOWED_PROFILES.has(profile) ? profile : "";
}

function hermesChatUrl(profile) {
  if (profile === HERMES_DEFAULT_PROFILE) return services.hermes.chat;
  if (!HERMES_MULTIPLEX_PROFILES) return "";
  const target = new URL(services.hermes.chat);
  const endpointPath = target.pathname.startsWith("/") ? target.pathname : `/${target.pathname}`;
  target.pathname = `/p/${encodeURIComponent(profile)}${endpointPath}`;
  return target.toString();
}

function hermesSessionHeaders() {
  if (!services.hermes.apiKey) return {};
  const sessionId = safeHermesIdentifier(HERMES_SESSION_ID);
  const sessionKey = safeHermesIdentifier(HERMES_SESSION_KEY);
  return {
    ...(sessionId ? { "x-hermes-session-id": sessionId } : {}),
    ...(sessionKey ? { "x-hermes-session-key": sessionKey } : {}),
  };
}

async function proxyHermesChat(body, requestedProfile) {
  const profile = normalizeHermesProfile(requestedProfile);
  if (!profile) return { configError: "hermes_profile_not_allowed", status: 400 };
  const endpoint = hermesChatUrl(profile);
  if (!endpoint) return { configError: "hermes_profile_multiplex_disabled", status: 409, profile };

  const sessionHeaders = hermesSessionHeaders();
  const payload = toOpenAiPayload(body, services.hermes.model);
  if (sessionHeaders["x-hermes-session-id"] && body.message) {
    payload.messages = [{ role: "user", content: String(body.message) }];
  }
  const result = await proxyJson(endpoint, payload, services.hermes.apiKey, sessionHeaders);
  return { result, profile };
}

function toOpenAiPayload(payload, model) {
  const messages = Array.isArray(payload.messages)
    ? payload.messages
    : payload.message
      ? [{ role: "user", content: String(payload.message) }]
      : [];
  const result = {
    model: payload.model || model,
    messages,
    stream: false,
  };
  if (payload.operator) result.user = String(payload.operator);
  if (payload.temperature !== undefined) result.temperature = payload.temperature;
  if (payload.max_tokens !== undefined) result.max_tokens = payload.max_tokens;
  return result;
}

const server = createServer(async (req, res) => {
  const suppliedRequestId = String(req.headers["x-request-id"] || "");
  req.requestId = /^[a-zA-Z0-9._:-]{8,128}$/.test(suppliedRequestId) ? suppliedRequestId : randomUUID();
  if (req.method === "OPTIONS") return sendJson(req, res, 204, {});
  gatewayStats.requests += 1;

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const hasGatewayAuthorization = authorized(req);
    const hasDashboardSession = authorizedDashboardSession(req);

    if (!hasGatewayAuthorization && hasDashboardSession) {
      return proxyNineRouter(req, res);
    }
    if (!hasGatewayAuthorization) {
      return sendJson(req, res, 401, { error: "unauthorized" });
    }

    if (req.method === "GET" && url.pathname === "/health") {
      const healthStarted = Date.now();
      const [hermes, openclaw, nineRouter, claude] = await Promise.all([
        probe(services.hermes.health, services.hermes.apiKey),
        probe(services.openclaw.health, services.openclaw.apiKey),
        probe(services.nineRouter.health, services.nineRouter.apiKey),
        probe(services.claude.health, services.claude.apiKey),
      ]);
      return sendJson(req, res, 200, {
        gateway: {
          online: true,
          host: HOST,
          port: PORT,
          startedAt: new Date(STARTED_AT).toISOString(),
          uptimeSeconds: Math.floor((Date.now() - STARTED_AT) / 1000),
          latencyMs: Date.now() - healthStarted,
          stats: { ...gatewayStats },
        },
        services: {
          hermes: { ...hermes, configured: Boolean(services.hermes.chat), circuit: circuitSnapshot("hermes") },
          openclaw: { ...openclaw, configured: Boolean(services.openclaw.chat || services.openclaw.task), circuit: circuitSnapshot("openclaw") },
          nineRouter: { ...nineRouter, configured: Boolean(services.nineRouter.chat), circuit: circuitSnapshot("nineRouter") },
          claude: { ...claude, configured: Boolean(services.claude.chat), circuit: circuitSnapshot("claude") },
        },
      }, { "server-timing": `gateway;dur=${Date.now() - healthStarted}` });
    }

    if (req.method === "POST" && url.pathname === "/api/session/9router") {
      const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
      const protocol = forwardedProto || (IS_LOOPBACK ? "http" : "https");
      const origin = `${protocol}://${req.headers.host}`;
      return sendJson(req, res, 200, {
        dashboardUrl: `${origin}/dashboard`,
        expiresInSeconds: Math.floor(DASHBOARD_SESSION_TTL_MS / 1000),
      }, {
        "set-cookie": issueDashboardSession(req),
      });
    }

    if (req.method === "GET" && url.pathname === "/api/9router/models") {
      const result = await fetchJson(`${services.nineRouter.base.replace(/\/+$/, "")}/v1/models`, services.nineRouter.apiKey);
      return sendJson(req, res, result.ok ? 200 : 502, {
        source: "nineRouter",
        upstreamStatus: result.status,
        latencyMs: result.latencyMs,
        models: Array.isArray(result.data?.data) ? result.data.data : [],
        raw: result.data,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/hermes/capabilities") {
      const [capabilities, models] = await Promise.all([
        fetchJson(`${services.hermes.base.replace(/\/+$/, "")}/v1/capabilities`, services.hermes.apiKey),
        fetchJson(`${services.hermes.base.replace(/\/+$/, "")}/v1/models`, services.hermes.apiKey),
      ]);
      const ok = capabilities.ok || models.ok;
      return sendJson(req, res, ok ? 200 : 502, {
        source: "hermes",
        configured: Boolean(services.hermes.chat),
        model: services.hermes.model,
        defaultProfile: HERMES_DEFAULT_PROFILE,
        profiles: [...HERMES_ALLOWED_PROFILES],
        multiplexProfiles: HERMES_MULTIPLEX_PROFILES,
        session: {
          mode: HERMES_SESSION_MODE,
          continuity: Boolean(services.hermes.apiKey && safeHermesIdentifier(HERMES_SESSION_ID)),
          memoryScope: Boolean(services.hermes.apiKey && safeHermesIdentifier(HERMES_SESSION_KEY)),
          transcriptSource: HERMES_SESSION_MODE === "telegram" ? "telegram" : "web",
        },
        upstreamStatus: capabilities.ok ? capabilities.status : models.status,
        latencyMs: Math.max(capabilities.latencyMs, models.latencyMs),
        capabilities: capabilities.ok ? capabilities.data : {},
        models: Array.isArray(models.data?.data) ? models.data.data : [],
        diagnostics: {
          capabilitiesStatus: capabilities.status,
          modelsStatus: models.status,
        },
      });
    }

    if (req.method === "GET" && url.pathname === "/api/claude/capabilities") {
      const [health, models] = await Promise.all([
        fetchJson(services.claude.health, services.claude.apiKey),
        fetchJson(`${services.claude.base.replace(/\/+$/, "")}/v1/models`, services.claude.apiKey),
      ]);
      const ok = health.ok || models.ok;
      return sendJson(req, res, ok ? 200 : 502, {
        source: "claude",
        configured: Boolean(services.claude.chat),
        upstreamStatus: health.ok ? health.status : models.status,
        latencyMs: Math.max(health.latencyMs, models.latencyMs),
        capabilities: health.ok ? health.data : {},
        models: Array.isArray(models.data?.data) ? models.data.data : [],
        diagnostics: {
          healthStatus: health.status,
          modelsStatus: models.status,
        },
      });
    }

    if (req.method === "GET" && url.pathname === "/api/openclaw/models") {
      const result = await fetchJson(`${services.openclaw.base.replace(/\/+$/, "")}/v1/models`, services.openclaw.apiKey);
      return sendJson(req, res, result.ok ? 200 : 502, {
        source: "openclaw",
        upstreamStatus: result.status,
        latencyMs: result.latencyMs,
        models: Array.isArray(result.data?.data) ? result.data.data : [],
        raw: result.data,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/ai/chat") {
      gatewayStats.aiRequests += 1;
      const body = await readJson(req);
      const attempts = [];

      if (services.hermes.chat && getCircuit("hermes").openUntil <= Date.now()) {
        const hermes = await proxyHermesChat(body, HERMES_DEFAULT_PROFILE);
        if (hermes.result) {
          recordUpstreamResult("hermes", hermes.result);
          attempts.push({
            source: "hermes",
            status: hermes.result.status,
            latencyMs: hermes.result.latencyMs,
            error: hermes.result.error,
            circuit: circuitSnapshot("hermes").state,
          });
          if (hermes.result.ok) {
            gatewayStats.successes += 1;
            return sendJson(req, res, 200, {
              reply: normalizeReply(hermes.result.data),
              upstreamStatus: hermes.result.status,
              raw: hermes.result.data,
              source: "hermes",
              profile: hermes.profile,
              session: {
                mode: HERMES_SESSION_MODE,
                continuity: Boolean(hermes.result.upstreamHeaders?.sessionId),
                memoryScope: Boolean(hermes.result.upstreamHeaders?.sessionKey),
              },
              attempts,
            }, {
              "x-jcore-upstream": "hermes",
              "server-timing": `hermes;dur=${hermes.result.latencyMs}`,
            });
          }
        }
      }

      const configuredCandidates = [
        ["nineRouter", services.nineRouter.chat, services.nineRouter.apiKey, services.nineRouter.model],
        ["openclaw", services.openclaw.chat, services.openclaw.apiKey, services.openclaw.model],
        ["claude", services.claude.chat, services.claude.apiKey, ""],
      ].filter(([, endpoint]) => Boolean(endpoint));

      if (!services.hermes.chat && !configuredCandidates.length) {
        gatewayStats.failures += 1;
        return sendJson(req, res, 503, { error: "ai_not_configured" });
      }

      const availableCandidates = configuredCandidates.filter(([name]) => getCircuit(name).openUntil <= Date.now());
      const candidates = availableCandidates.length
        ? availableCandidates
        : [...configuredCandidates].sort(([a], [b]) => getCircuit(a).openUntil - getCircuit(b).openUntil).slice(0, 1);
      for (const [name, endpoint, apiKey, model] of candidates) {
        const result = await proxyJson(endpoint, toOpenAiPayload(body, model), apiKey);
        recordUpstreamResult(name, result);
        attempts.push({
          source: name,
          status: result.status,
          latencyMs: result.latencyMs,
          error: result.error,
          circuit: circuitSnapshot(name).state,
        });
        if (result.ok) {
          gatewayStats.successes += 1;
          return sendJson(req, res, 200, {
            reply: normalizeReply(result.data),
            upstreamStatus: result.status,
            raw: result.data,
            source: name,
            attempts,
          }, {
            "x-jcore-upstream": name,
            "server-timing": attempts.map((attempt) => `${attempt.source};dur=${attempt.latencyMs}`).join(", "),
          });
        }
      }

      gatewayStats.failures += 1;
      return sendJson(req, res, 502, {
        error: "all_ai_upstreams_failed",
        attempts,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/hermes/profiles") {
      return sendJson(req, res, 200, {
        source: "hermes",
        defaultProfile: HERMES_DEFAULT_PROFILE,
        multiplexProfiles: HERMES_MULTIPLEX_PROFILES,
        profiles: [
          { id: "jarvis", name: "Jarvis Orchestrator", role: "Trợ lý điều phối mặc định của J-Core", icon: "terminal" },
          { id: "cadence-content", name: "Cadence Content Studio", role: "Studio sáng tạo nội dung đa bước (Cadence)", icon: "media" },
          { id: "code-architect", name: "Code Architect", role: "Kiến trúc sư phần mềm & Reviewer", icon: "router" },
          { id: "security-auditor", name: "Security Auditor", role: "Kiểm thử an ninh & Quy tắc phòng thủ", icon: "shield" },
        ].filter((profile) => HERMES_ALLOWED_PROFILES.has(profile.id)),
      });
    }

    if (req.method === "POST" && url.pathname === "/api/hermes/chat") {
      const body = await readJson(req);
      if (!services.hermes.chat) {
        return sendJson(req, res, 503, { error: "hermes_not_configured" });
      }

      const proxied = await proxyHermesChat(body, body.profile || HERMES_DEFAULT_PROFILE);
      if (proxied.configError) {
        return sendJson(req, res, proxied.status || 400, {
          error: proxied.configError,
          profile: proxied.profile || String(body.profile || ""),
        });
      }
      const { result, profile } = proxied;
      recordUpstreamResult("hermes", result);
      return sendJson(req, res, result.ok ? 200 : 502, {
        reply: normalizeReply(result.data),
        upstreamStatus: result.status,
        raw: result.data,
        source: "hermes",
        profile,
        session: {
          mode: HERMES_SESSION_MODE,
          continuity: Boolean(result.upstreamHeaders?.sessionId),
          memoryScope: Boolean(result.upstreamHeaders?.sessionKey),
          transcriptSource: HERMES_SESSION_MODE === "telegram" ? "telegram" : "web",
        },
      }, {
        "x-jcore-upstream": "hermes",
        "server-timing": `hermes;dur=${result.latencyMs}`,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/workspace/tree") {
      try {
        const rootDir = process.cwd();
        const readDirRecursive = (dir, depth = 0) => {
          if (depth > 3) return [];
          const entries = readdirSync(dir, { withFileTypes: true });
          const items = [];
          for (const entry of entries) {
            if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") continue;
            const fullPath = join(dir, entry.name);
            const relPath = relative(rootDir, fullPath).replace(/\\/g, "/");
            if (entry.isDirectory()) {
              items.push({ name: entry.name, path: relPath, type: "directory", children: readDirRecursive(fullPath, depth + 1) });
            } else {
              items.push({ name: entry.name, path: relPath, type: "file" });
            }
          }
          return items;
        };
        return sendJson(req, res, 200, { root: rootDir, tree: readDirRecursive(rootDir) });
      } catch (err) {
        return sendJson(req, res, 500, { error: "failed_to_read_tree", details: String(err) });
      }
    }

    if (req.method === "GET" && url.pathname === "/api/workspace/file") {
      try {
        const rootDir = process.cwd();
        const fileRel = url.searchParams.get("path");
        if (!fileRel) return sendJson(req, res, 400, { error: "missing_path" });
        const targetPath = resolve(rootDir, fileRel);
        if (!targetPath.startsWith(rootDir)) return sendJson(req, res, 403, { error: "access_denied" });
        const content = readFileSync(targetPath, "utf-8");
        return sendJson(req, res, 200, { path: fileRel, content });
      } catch (err) {
        return sendJson(req, res, 404, { error: "file_not_found", details: String(err) });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/9router/chat") {
      const body = await readJson(req);
      if (!services.nineRouter.chat) {
        return sendJson(req, res, 503, { error: "ninerouter_not_configured" });
      }
      const result = await proxyJson(
        services.nineRouter.chat,
        toOpenAiPayload(body, services.nineRouter.model),
        services.nineRouter.apiKey,
      );
      return sendJson(req, res, result.ok ? 200 : 502, {
        reply: normalizeReply(result.data),
        upstreamStatus: result.status,
        raw: result.data,
        source: "nineRouter",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/claude/chat") {
      const body = await readJson(req);
      if (!services.claude.chat) {
        return sendJson(req, res, 503, { error: "claude_not_configured" });
      }
      const result = await proxyJson(services.claude.chat, body, services.claude.apiKey);
      return sendJson(req, res, result.ok ? 200 : 502, {
        reply: normalizeReply(result.data),
        upstreamStatus: result.status,
        raw: result.data,
        source: "claude",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/openclaw/task") {
      const body = await readJson(req);
      if (!services.openclaw.task) {
        return sendJson(req, res, 503, { error: "openclaw_not_configured" });
      }
      const result = await proxyJson(services.openclaw.task, body, services.openclaw.apiKey);
      return sendJson(req, res, result.ok ? 200 : 502, {
        reply: normalizeReply(result.data),
        upstreamStatus: result.status,
        raw: result.data,
        source: "openclaw",
      });
    }

    if (authorizedDashboardSession(req)) {
      return proxyNineRouter(req, res);
    }

    return sendJson(req, res, 404, { error: "not_found" });
  } catch (error) {
    const status = Number(error?.statusCode) || (error instanceof SyntaxError ? 400 : 500);
    return sendJson(req, res, status, { error: error?.message || "gateway_error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`J-Core local gateway: http://${HOST}:${PORT}`);
  console.log(`Hermes: ${services.hermes.base}`);
  console.log(`OpenClaw: ${services.openclaw.base}`);
  console.log(`9Router: ${services.nineRouter.base}`);
  console.log(`Claude bridge: ${services.claude.base}`);
});
