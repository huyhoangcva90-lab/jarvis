import { createServer, request as httpRequest } from "node:http";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, isAbsolute, join, relative, resolve } from "node:path";
import { WebSocketServer } from "ws";

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
const CORS_ORIGINS = (process.env.JCORE_CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const IS_LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]).has(HOST);
const STARTED_AT = Date.now();
const CIRCUIT_FAILURE_THRESHOLD = Number(process.env.JCORE_CIRCUIT_FAILURE_THRESHOLD || 3);
const CIRCUIT_OPEN_MS = Number(process.env.JCORE_CIRCUIT_OPEN_MS || 30000);
const DASHBOARD_SESSION_TTL_MS = Number(process.env.JCORE_DASHBOARD_SESSION_TTL_MS || 30 * 60 * 1000);
const AUTH_USERNAME = process.env.JCORE_AUTH_USERNAME || "admin";
const AUTH_PASSWORD = process.env.JCORE_AUTH_PASSWORD || "";
const AUTH_SESSION_TTL_MS = Math.min(30 * 24 * 60 * 60 * 1000, Math.max(15 * 60 * 1000, Number(process.env.JCORE_AUTH_SESSION_TTL_MS || 7 * 24 * 60 * 60 * 1000)));
const WEB_ROOT = resolve(process.env.JCORE_WEB_ROOT || join(process.cwd(), "dist"));
const APP_CONFIG_WRITE_ENABLED = /^(1|true|yes|on)$/i.test(process.env.JCORE_APP_CONFIG_WRITE_ENABLED || "true");
const HERMES_BASE_URL = process.env.HERMES_BASE_URL || "http://127.0.0.1:8642";
const HERMES_DEFAULT_PROFILE = process.env.HERMES_DEFAULT_PROFILE || "jarvis";
const HERMES_MULTIPLEX_PROFILES = /^(1|true|yes|on)$/i.test(process.env.HERMES_MULTIPLEX_PROFILES || "false");
const HERMES_ALLOWED_PROFILES = new Set(
  (process.env.HERMES_ALLOWED_PROFILES || "jarvis")
    .split(",")
    .map((profile) => profile.trim())
    .filter(Boolean),
);
HERMES_ALLOWED_PROFILES.add(HERMES_DEFAULT_PROFILE);
const HERMES_PROFILE_METADATA_TTL_MS = Math.max(5000, Number(process.env.HERMES_PROFILE_METADATA_TTL_MS || 30000));
const HERMES_PROFILE_CATALOG = [
  { id: "jarvis", name: "Jarvis Orchestrator", role: "Trợ lý điều phối mặc định của J-Core", description: "Profile điều phối chính trên Ubuntu.", icon: "terminal", palette: "orange", tags: ["Default", "Memory", "Command"] },
  { id: "ev-personal", name: "E.V Personal Link", role: "Trợ lý hoạch định đời sống và liên kết cá nhân", description: "Profile riêng cho Spider Mode và personal planning.", icon: "router", palette: "spider", tags: ["Personal", "Planner", "OpenClaw"] },
  { id: "cadence-content", name: "Cadence Content Studio", role: "Studio sáng tạo nội dung đa bước", description: "Pipeline research, scripting, SEO và scheduling.", icon: "media", palette: "violet", tags: ["Studio", "Pipeline"] },
  { id: "code-architect", name: "Code Architect", role: "Kiến trúc sư phần mềm và reviewer", description: "Phân tích kiến trúc và chất lượng code.", icon: "router", palette: "blue", tags: ["Dev", "Architecture"] },
  { id: "security-auditor", name: "Security Auditor", role: "Kiểm thử an ninh và phòng thủ", description: "Đánh giá quyền hạn, cấu hình và bề mặt tấn công.", icon: "shield", palette: "red", tags: ["Security", "Defense"] },
];
let hermesProfileMetadataCache = { expiresAt: 0, profiles: [] };
const HERMES_SESSION_MODE = process.env.HERMES_SESSION_MODE === "telegram" ? "telegram" : "web";
const HERMES_SESSION_ID = process.env.HERMES_SESSION_ID || "jarvis-web-primary";
const HERMES_SESSION_KEY = process.env.HERMES_SESSION_KEY || "agent:jarvis:web:dm:owner";
const HERMES_STT_URL = process.env.HERMES_STT_URL || "";
const HERMES_STT_API_KEY = process.env.HERMES_STT_API_KEY || "";
const HERMES_STT_MODEL = process.env.HERMES_STT_MODEL || "whisper-1";
const HERMES_TTS_URL = process.env.HERMES_TTS_URL || "";
const HERMES_TTS_API_KEY = process.env.HERMES_TTS_API_KEY || "";
const HERMES_TTS_MODEL = process.env.HERMES_TTS_MODEL || "tts-1";
const HERMES_TTS_VOICE = process.env.HERMES_TTS_VOICE || "alloy";
const WORKSPACE_ROOT = resolve(process.env.JCORE_WORKSPACE_ROOT || process.cwd());
const OBSIDIAN_ROOT = process.env.JCORE_OBSIDIAN_ROOT ? resolve(process.env.JCORE_OBSIDIAN_ROOT) : "";
const WORKSPACE_WRITE_ENABLED = /^(1|true|yes|on)$/i.test(process.env.JCORE_WORKSPACE_WRITE_ENABLED || "false");
const TERMINAL_ENABLED = !/^(0|false|no|off)$/i.test(process.env.JCORE_TERMINAL_ENABLED || "true");
const TERMINAL_PRIVATE_MODE = /^(1|true|yes|on)$/i.test(process.env.JCORE_TERMINAL_PRIVATE_MODE || "false");
const TERMINAL_TIMEOUT_MS = Math.min(30000, Math.max(1000, Number(process.env.JCORE_TERMINAL_TIMEOUT_MS || 10000)));
const TERMINAL_OUTPUT_LIMIT = Math.min(1024 * 1024, Math.max(16384, Number(process.env.JCORE_TERMINAL_OUTPUT_LIMIT || 262144)));
const TERMINAL_SESSION_TTL_MS = Math.min(8 * 60 * 60 * 1000, Math.max(60 * 1000, Number(process.env.JCORE_TERMINAL_SESSION_TTL_MS || 30 * 60 * 1000)));
const TERMINAL_TICKET_TTL_MS = Math.min(120000, Math.max(10000, Number(process.env.JCORE_TERMINAL_TICKET_TTL_MS || 60000)));
const MANAGED_SERVICES = new Set(
  (process.env.JCORE_MANAGED_SERVICES || "j-core-gateway,hermes,openclaw,9router")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => /^[a-zA-Z0-9_.@-]{1,80}$/.test(name)),
);
const TEXT_FILE_EXTENSIONS = new Set([
  ".c", ".conf", ".cpp", ".css", ".csv", ".go", ".h", ".html", ".ini", ".java", ".js", ".json",
  ".jsx", ".log", ".md", ".mjs", ".py", ".rs", ".scss", ".sh", ".sql", ".svg", ".toml", ".ts",
  ".tsx", ".txt", ".vue", ".xml", ".yaml", ".yml",
]);
const FILE_READ_LIMIT = 512 * 1024;
const DIRECTORY_ENTRY_LIMIT = 500;
const JCORE_CONFIG_ROOT = resolve(process.env.JCORE_CONFIG_ROOT || join(process.cwd(), ".jcore", "apps"));
const NATIVE_DASHBOARD_PORTS = {
  hermes: Number(process.env.HERMES_DASHBOARD_PROXY_PORT || 9120),
  openclaw: Number(process.env.OPENCLAW_DASHBOARD_PROXY_PORT || 18790),
  nineRouter: Number(process.env.NINEROUTER_DASHBOARD_PROXY_PORT || 20129),
};
const NATIVE_DASHBOARD_PROXY_HOST = process.env.JCORE_NATIVE_DASHBOARD_PROXY_HOST || "127.0.0.1";

const managedConfigDefaults = {
  hermes: { service: "hermes", enabled: true, profile: HERMES_DEFAULT_PROFILE, model: process.env.HERMES_MODEL || "hermes-agent" },
  openclaw: { service: "openclaw", enabled: true, model: "openclaw/default", taskMode: "local" },
  "9router": { service: "9router", enabled: true, model: "Code", routing: "local" },
  claude: { service: "claude", enabled: true, bridge: "local", permissions: "project" },
};

const workspaceRoots = new Map([
  ["workspace", { id: "workspace", label: "Ubuntu Workspace", path: WORKSPACE_ROOT }],
  ...(OBSIDIAN_ROOT ? [["obsidian", { id: "obsidian", label: "Obsidian Vault", path: OBSIDIAN_ROOT }]] : []),
]);

const appConfigPaths = new Map([
  ["hermes", { service: "hermes", label: "Hermes", envName: "JCORE_HERMES_CONFIG_PATH", managed: !process.env.JCORE_HERMES_CONFIG_PATH, path: resolve(process.env.JCORE_HERMES_CONFIG_PATH || join(JCORE_CONFIG_ROOT, "hermes.json")) }],
  ["openclaw", { service: "openclaw", label: "OpenClaw", envName: "JCORE_OPENCLAW_CONFIG_PATH", managed: !process.env.JCORE_OPENCLAW_CONFIG_PATH, path: resolve(process.env.JCORE_OPENCLAW_CONFIG_PATH || join(JCORE_CONFIG_ROOT, "openclaw.json")) }],
  ["9router", { service: "9router", label: "9Router", envName: "JCORE_9ROUTER_CONFIG_PATH", managed: !process.env.JCORE_9ROUTER_CONFIG_PATH, path: resolve(process.env.JCORE_9ROUTER_CONFIG_PATH || join(JCORE_CONFIG_ROOT, "9router.json")) }],
  ["claude", { service: "claude", label: "Claude", envName: "JCORE_CLAUDE_CONFIG_PATH", managed: !process.env.JCORE_CLAUDE_CONFIG_PATH, path: resolve(process.env.JCORE_CLAUDE_CONFIG_PATH || join(JCORE_CONFIG_ROOT, "claude.json")) }],
]);

mkdirSync(JCORE_CONFIG_ROOT, { recursive: true });
for (const config of appConfigPaths.values()) {
  if (!config.managed || existsSync(config.path)) continue;
  writeFileSync(config.path, `${JSON.stringify(managedConfigDefaults[config.service], null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
}

const gatewayStats = {
  requests: 0,
  aiRequests: 0,
  successes: 0,
  failures: 0,
};

const upstreamCircuits = new Map();
const dashboardSessions = new Map();
const terminalTickets = new Map();
const terminalAudit = [];
const authSessions = new Map();
const nineRouterUpstreamSessions = new Map();
const loginAttempts = new Map();

if (!AUTH_PASSWORD) {
  throw new Error("JCORE_AUTH_PASSWORD is required for server-side session authentication.");
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
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-request-id",
    "access-control-expose-headers": "x-request-id,x-jcore-upstream,server-timing",
    "access-control-allow-credentials": "true",
    "access-control-max-age": "86400",
    "vary": "Origin",
    ...extraHeaders,
  });
  res.end(JSON.stringify({ requestId: req.requestId, ...payload }));
}

function sendBuffer(req, res, status, payload, contentType = "application/octet-stream", extraHeaders = {}) {
  res.writeHead(status, {
    "content-type": contentType,
    "content-length": payload.length,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "x-request-id": req.requestId,
    "access-control-allow-origin": getCorsOrigin(req),
    "access-control-expose-headers": "x-request-id,x-jcore-upstream,server-timing",
    "vary": "Origin",
    ...extraHeaders,
  });
  res.end(payload);
}

function sameSecret(left, right) {
  const leftHash = createHash("sha256").update(String(left)).digest();
  const rightHash = createHash("sha256").update(String(right)).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function authSession(req) {
  const sessionId = cookieValue(req, "jcore_session");
  const session = authSessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    if (sessionId) authSessions.delete(sessionId);
    return null;
  }
  session.expiresAt = Date.now() + AUTH_SESSION_TTL_MS;
  return session;
}

function issueAuthCookie(req, username) {
  const sessionId = randomUUID();
  authSessions.set(sessionId, { username, expiresAt: Date.now() + AUTH_SESSION_TTL_MS });
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = forwardedProto === "https";
  return [
    `jcore_session=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${Math.floor(AUTH_SESSION_TTL_MS / 1000)}`,
    secure ? "SameSite=Strict" : "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

function clearAuthCookie(req) {
  const sessionId = cookieValue(req, "jcore_session");
  if (sessionId) authSessions.delete(sessionId);
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = forwardedProto === "https" || Boolean(req.socket.encrypted);
  return [
    "jcore_session=; Path=/; HttpOnly; Max-Age=0",
    secure ? "SameSite=Strict" : "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

function loginAllowed(req) {
  const key = String(req.socket.remoteAddress || "unknown");
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= Date.now()) {
    loginAttempts.set(key, { count: 0, resetAt: Date.now() + 15 * 60 * 1000 });
    return true;
  }
  return current.count < 5;
}

function recordLoginFailure(req) {
  const key = String(req.socket.remoteAddress || "unknown");
  const current = loginAttempts.get(key) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  current.count += 1;
  loginAttempts.set(key, current);
  return Math.max(0, 5 - current.count);
}

const STATIC_CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
};

function serveWebAsset(req, res, pathname) {
  if (!existsSync(WEB_ROOT)) return false;
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const candidate = resolve(WEB_ROOT, requested);
  if (!pathIsInside(WEB_ROOT, candidate) || !existsSync(candidate) || !statSync(candidate).isFile()) {
    if (extname(requested)) return false;
    const fallback = resolve(WEB_ROOT, "index.html");
    if (!existsSync(fallback)) return false;
    const payload = readFileSync(fallback);
    sendBuffer(req, res, 200, payload, "text/html; charset=utf-8", { "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' ws: wss: https:; frame-src https://www.youtube-nocookie.com 'self'" });
    return true;
  }
  const payload = readFileSync(candidate);
  const contentType = STATIC_CONTENT_TYPES[extname(candidate).toLowerCase()] || "application/octet-stream";
  sendBuffer(req, res, 200, payload, contentType, { "cache-control": requested === "index.html" ? "no-cache" : "public, max-age=31536000, immutable" });
  return true;
}

function authorized(req) {
  if (TOKEN && req.headers.authorization === `Bearer ${TOKEN}`) return true;
  if (authSession(req)) return true;
  return !TOKEN && !AUTH_PASSWORD;
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
  const secure = forwardedProto === "https" || Boolean(req.socket.encrypted);
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

async function readBuffer(req, limit = 16 * 1024 * 1024) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > limit) {
      const error = new Error("payload_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function pathIsInside(rootPath, targetPath) {
  const rel = relative(rootPath, targetPath);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function rootSummary(root) {
  return {
    id: root.id,
    label: root.label,
    available: existsSync(root.path),
    writable: WORKSPACE_WRITE_ENABLED,
  };
}

function getWorkspaceRoot(rootId = "workspace") {
  const root = workspaceRoots.get(String(rootId || "workspace"));
  if (!root) {
    const error = new Error("unknown_workspace_root");
    error.statusCode = 404;
    throw error;
  }
  if (!existsSync(root.path)) {
    const error = new Error("workspace_root_unavailable");
    error.statusCode = 503;
    throw error;
  }
  return root;
}

function resolveWorkspacePath(rootId, requestedPath = "") {
  const root = getWorkspaceRoot(rootId);
  const rootRealPath = realpathSync(root.path);
  const normalizedRequestedPath = String(requestedPath || "").replace(/\\/g, "/");
  const candidate = resolve(root.path, normalizedRequestedPath || ".");
  if (!pathIsInside(root.path, candidate)) {
    const error = new Error("workspace_access_denied");
    error.statusCode = 403;
    throw error;
  }
  if (!existsSync(candidate)) {
    const error = new Error("workspace_path_not_found");
    error.statusCode = 404;
    throw error;
  }
  const targetRealPath = realpathSync(candidate);
  if (!pathIsInside(rootRealPath, targetRealPath)) {
    const error = new Error("workspace_access_denied");
    error.statusCode = 403;
    throw error;
  }
  return {
    root,
    targetPath: targetRealPath,
    relativePath: relative(rootRealPath, targetRealPath).replace(/\\/g, "/"),
  };
}

function hiddenOrSensitiveName(name) {
  const lower = name.toLowerCase();
  return name.startsWith(".") || lower === "node_modules" || lower === "dist" || lower === "coverage"
    || /(?:^|\.)(?:pem|key|p12|pfx|crt|cer|keystore)$/.test(lower);
}

function listWorkspaceDirectory(rootId, requestedPath = "") {
  const resolvedPath = resolveWorkspacePath(rootId, requestedPath);
  const stat = statSync(resolvedPath.targetPath);
  if (!stat.isDirectory()) {
    const error = new Error("workspace_not_a_directory");
    error.statusCode = 400;
    throw error;
  }
  const entries = readdirSync(resolvedPath.targetPath, { withFileTypes: true })
    .filter((entry) => !hiddenOrSensitiveName(entry.name) && !entry.isSymbolicLink())
    .slice(0, DIRECTORY_ENTRY_LIMIT)
    .map((entry) => {
      const entryPath = join(resolvedPath.targetPath, entry.name);
      const entryStat = statSync(entryPath);
      return {
        name: entry.name,
        path: relative(realpathSync(resolvedPath.root.path), entryPath).replace(/\\/g, "/"),
        type: entry.isDirectory() ? "directory" : "file",
        size: entry.isFile() ? entryStat.size : null,
        modifiedAt: entryStat.mtime.toISOString(),
      };
    })
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "directory" ? -1 : 1));
  return { ...resolvedPath, entries, truncated: entries.length >= DIRECTORY_ENTRY_LIMIT };
}

function readWorkspaceFile(rootId, requestedPath) {
  if (!requestedPath) {
    const error = new Error("missing_path");
    error.statusCode = 400;
    throw error;
  }
  const resolvedPath = resolveWorkspacePath(rootId, requestedPath);
  const stat = statSync(resolvedPath.targetPath);
  if (!stat.isFile()) {
    const error = new Error("workspace_not_a_file");
    error.statusCode = 400;
    throw error;
  }
  if (stat.size > FILE_READ_LIMIT) {
    const error = new Error("workspace_file_too_large");
    error.statusCode = 413;
    throw error;
  }
  if (!TEXT_FILE_EXTENSIONS.has(extname(resolvedPath.targetPath).toLowerCase())) {
    const error = new Error("workspace_file_type_not_allowed");
    error.statusCode = 415;
    throw error;
  }
  return {
    ...resolvedPath,
    content: readFileSync(resolvedPath.targetPath, "utf8"),
    size: stat.size,
    modifiedAt: stat.mtime.toISOString(),
  };
}

function writeWorkspaceFile(rootId, requestedPath, content, expectedModifiedAt = "") {
  if (!WORKSPACE_WRITE_ENABLED) {
    const error = new Error("workspace_write_disabled");
    error.statusCode = 403;
    throw error;
  }
  const resolvedPath = resolveWorkspacePath(rootId, requestedPath);
  const stats = statSync(resolvedPath.targetPath);
  if (!stats.isFile()) {
    const error = new Error("workspace_not_a_file");
    error.statusCode = 400;
    throw error;
  }
  if (!TEXT_FILE_EXTENSIONS.has(extname(resolvedPath.targetPath).toLowerCase())) {
    const error = new Error("workspace_file_type_not_allowed");
    error.statusCode = 415;
    throw error;
  }
  if (expectedModifiedAt && Math.abs(new Date(expectedModifiedAt).getTime() - stats.mtimeMs) > 1) {
    const error = new Error("workspace_file_changed");
    error.statusCode = 409;
    throw error;
  }
  const nextContent = String(content ?? "");
  if (Buffer.byteLength(nextContent, "utf8") > FILE_READ_LIMIT) {
    const error = new Error("workspace_file_too_large");
    error.statusCode = 413;
    throw error;
  }
  const temporaryPath = `${resolvedPath.targetPath}.jcore-tmp`;
  try {
    writeFileSync(temporaryPath, nextContent, { encoding: "utf8", mode: stats.mode });
    renameSync(temporaryPath, resolvedPath.targetPath);
  } finally {
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
  const updated = statSync(resolvedPath.targetPath);
  return { ...resolvedPath, size: updated.size, modifiedAt: updated.mtime.toISOString() };
}

const APP_CONFIG_EXTENSIONS = new Set([".conf", ".ini", ".json", ".toml", ".yaml", ".yml"]);

function configuredApp(serviceName) {
  const config = appConfigPaths.get(String(serviceName || "").toLowerCase());
  if (!config) {
    const error = new Error("app_config_unknown_service");
    error.statusCode = 400;
    throw error;
  }
  if (!config.path) {
    const error = new Error("app_config_not_configured");
    error.statusCode = 503;
    error.details = { service: config.service, requiredEnv: config.envName };
    throw error;
  }
  if (!existsSync(config.path)) {
    const error = new Error("app_config_not_found");
    error.statusCode = 404;
    error.details = { service: config.service, requiredEnv: config.envName };
    throw error;
  }
  const stats = statSync(config.path);
  if (!stats.isFile()) {
    const error = new Error("app_config_not_a_file");
    error.statusCode = 400;
    throw error;
  }
  if (!APP_CONFIG_EXTENSIONS.has(extname(config.path).toLowerCase())) {
    const error = new Error("app_config_type_not_allowed");
    error.statusCode = 415;
    throw error;
  }
  if (stats.size > FILE_READ_LIMIT) {
    const error = new Error("app_config_too_large");
    error.statusCode = 413;
    throw error;
  }
  return { config, stats };
}

function readAppConfig(serviceName) {
  const { config, stats } = configuredApp(serviceName);
  return {
    service: config.service,
    label: config.label,
    fileName: basename(config.path),
    format: extname(config.path).slice(1).toLowerCase(),
    managed: config.managed,
    content: readFileSync(config.path, "utf8"),
    modifiedAt: stats.mtime.toISOString(),
    writable: APP_CONFIG_WRITE_ENABLED,
  };
}

function writeAppConfig(serviceName, content, expectedModifiedAt = "") {
  if (!APP_CONFIG_WRITE_ENABLED) {
    const error = new Error("app_config_write_disabled");
    error.statusCode = 403;
    throw error;
  }
  const { config, stats } = configuredApp(serviceName);
  if (expectedModifiedAt && Math.abs(new Date(expectedModifiedAt).getTime() - stats.mtimeMs) > 1) {
    const error = new Error("app_config_changed");
    error.statusCode = 409;
    throw error;
  }
  const nextContent = String(content ?? "");
  if (Buffer.byteLength(nextContent, "utf8") > FILE_READ_LIMIT) {
    const error = new Error("app_config_too_large");
    error.statusCode = 413;
    throw error;
  }
  const temporaryPath = `${config.path}.jcore-tmp`;
  try {
    writeFileSync(temporaryPath, nextContent, { encoding: "utf8", mode: stats.mode });
    renameSync(temporaryPath, config.path);
  } finally {
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
  return readAppConfig(config.service);
}

function collectObsidianNotes() {
  const root = getWorkspaceRoot("obsidian");
  const rootRealPath = realpathSync(root.path);
  const notes = [];
  const queue = [rootRealPath];
  let totalBytes = 0;
  while (queue.length && notes.length < 200 && totalBytes < 4 * 1024 * 1024) {
    const directory = queue.shift();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (hiddenOrSensitiveName(entry.name) || entry.isSymbolicLink()) continue;
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        queue.push(entryPath);
        continue;
      }
      if (!entry.isFile() || extname(entry.name).toLowerCase() !== ".md") continue;
      const stat = statSync(entryPath);
      if (stat.size > FILE_READ_LIMIT || totalBytes + stat.size > 4 * 1024 * 1024) continue;
      notes.push({
        path: relative(rootRealPath, entryPath).replace(/\\/g, "/"),
        content: readFileSync(entryPath, "utf8"),
        modifiedAt: stat.mtime.toISOString(),
      });
      totalBytes += stat.size;
      if (notes.length >= 200) break;
    }
  }
  return { notes, totalBytes, truncated: queue.length > 0 || notes.length >= 200 };
}

function tokenizeTerminalCommand(input) {
  const raw = String(input || "").trim();
  if (!raw || raw.length > 512 || /[;&|><`$\r\n\0]/.test(raw)) {
    const error = new Error("terminal_command_rejected");
    error.statusCode = 400;
    throw error;
  }
  const tokens = [];
  const matcher = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'|([^\s]+)/g;
  let match;
  while ((match = matcher.exec(raw))) tokens.push(match[1] ?? match[2] ?? match[3]);
  if (!tokens.length || tokens.join(" ").length === 0) {
    const error = new Error("terminal_command_rejected");
    error.statusCode = 400;
    throw error;
  }
  return tokens;
}

function parseRootPathSpec(spec = "") {
  const value = String(spec || "");
  const separator = value.indexOf(":");
  if (separator > 0 && workspaceRoots.has(value.slice(0, separator))) {
    return { rootId: value.slice(0, separator), path: value.slice(separator + 1) };
  }
  return { rootId: "workspace", path: value };
}

function runProcess(executable, args, cwd = WORKSPACE_ROOT) {
  return new Promise((resolveProcess) => {
    const startedAt = Date.now();
    let stdout = "";
    let stderr = "";
    let limited = false;
    let timedOut = false;
    let finished = false;
    const child = spawn(executable, args, {
      cwd,
      shell: false,
      windowsHide: true,
      env: { ...process.env, NO_COLOR: "1", TERM: "dumb" },
    });
    const append = (target, chunk) => {
      const next = target + chunk.toString("utf8");
      if (Buffer.byteLength(next) <= TERMINAL_OUTPUT_LIMIT) return next;
      limited = true;
      child.kill();
      return next.slice(0, TERMINAL_OUTPUT_LIMIT);
    };
    child.stdout.on("data", (chunk) => { stdout = append(stdout, chunk); });
    child.stderr.on("data", (chunk) => { stderr = append(stderr, chunk); });
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, TERMINAL_TIMEOUT_MS);
    const finish = (exitCode, error = "") => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      resolveProcess({
        output: [stdout.trimEnd(), stderr.trimEnd(), error].filter(Boolean).join("\n"),
        exitCode,
        durationMs: Date.now() - startedAt,
        timedOut,
        truncated: limited,
      });
    };
    child.once("error", (error) => finish(127, error.code === "ENOENT" ? `${executable}: command not available` : String(error.message || error)));
    child.once("close", (code) => finish(Number.isInteger(code) ? code : 1));
  });
}

function terminalHelp() {
  return [
    "J-Core Ubuntu command broker (read-only)",
    TERMINAL_PRIVATE_MODE ? "private mode available: POST /api/system/private-terminal" : "private mode disabled: set JCORE_TERMINAL_PRIVATE_MODE=true on Ubuntu",
    "help | pwd | roots",
    "ls [path]                 e.g. ls src or ls obsidian:",
    "cat <path>                e.g. cat package.json",
    "find <name> [path]        search names inside an allowed root",
    "system uptime|disk|memory",
    "service <name> status | logs <name> [lines]",
    "hermes status|doctor|sessions|cron",
    "openclaw status|doctor|models|tasks",
    "claude version",
    "9router models",
  ].join("\n");
}

function findWorkspaceEntries(rootId, requestedPath, query) {
  const start = resolveWorkspacePath(rootId, requestedPath);
  if (!statSync(start.targetPath).isDirectory()) return [];
  const matches = [];
  const queue = [start.targetPath];
  let visited = 0;
  while (queue.length && matches.length < 100 && visited < 1000) {
    const directory = queue.shift();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      visited += 1;
      if (hiddenOrSensitiveName(entry.name) || entry.isSymbolicLink()) continue;
      const entryPath = join(directory, entry.name);
      if (entry.name.toLowerCase().includes(query.toLowerCase())) {
        matches.push(relative(realpathSync(start.root.path), entryPath).replace(/\\/g, "/"));
      }
      if (entry.isDirectory() && visited < 1000) queue.push(entryPath);
      if (matches.length >= 100 || visited >= 1000) break;
    }
  }
  return matches;
}

async function executeTerminalCommand(rawCommand) {
  if (!TERMINAL_ENABLED) {
    const error = new Error("terminal_disabled");
    error.statusCode = 503;
    throw error;
  }
  const tokens = tokenizeTerminalCommand(rawCommand);
  const command = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (command === "help") return { output: terminalHelp(), exitCode: 0, durationMs: 0 };
  if (command === "pwd") return { output: "workspace:/", exitCode: 0, durationMs: 0 };
  if (command === "roots") {
    const output = [...workspaceRoots.values()].map((root) => `${root.id.padEnd(10)} ${existsSync(root.path) ? "READY" : "UNAVAILABLE"}  read-only`).join("\n");
    return { output, exitCode: 0, durationMs: 0 };
  }
  if (command === "ls") {
    const spec = parseRootPathSpec(args[0] || "");
    const listed = listWorkspaceDirectory(spec.rootId, spec.path);
    const output = listed.entries.map((entry) => `${entry.type === "directory" ? "d" : "-"} ${String(entry.size ?? "-").padStart(9)}  ${entry.path}`).join("\n");
    return { output: output || "(empty)", exitCode: 0, durationMs: 0 };
  }
  if (command === "cat") {
    const spec = parseRootPathSpec(args[0] || "");
    const file = readWorkspaceFile(spec.rootId, spec.path);
    return { output: file.content, exitCode: 0, durationMs: 0 };
  }
  if (command === "find") {
    if (!args[0]) {
      const error = new Error("terminal_missing_argument");
      error.statusCode = 400;
      throw error;
    }
    const spec = parseRootPathSpec(args[1] || "");
    const matches = findWorkspaceEntries(spec.rootId, spec.path, args[0]);
    return { output: matches.join("\n") || "No matching paths.", exitCode: 0, durationMs: 0 };
  }
  if (command === "system") {
    if (process.platform !== "linux") return { output: "System metrics commands run on the Ubuntu gateway host.", exitCode: 1, durationMs: 0 };
    const systemCommands = {
      uptime: ["uptime", []],
      disk: ["df", ["-h", "--output=source,size,used,avail,pcent,target"]],
      memory: ["free", ["-h"]],
    };
    const processSpec = systemCommands[String(args[0] || "").toLowerCase()];
    if (!processSpec) {
      const error = new Error("terminal_command_not_allowed");
      error.statusCode = 400;
      throw error;
    }
    return runProcess(processSpec[0], processSpec[1]);
  }
  if (command === "service" || command === "logs") {
    if (process.platform !== "linux") return { output: "systemd commands run on the Ubuntu gateway host.", exitCode: 1, durationMs: 0 };
    const serviceName = command === "service" ? args[0] : args[0];
    if (!MANAGED_SERVICES.has(serviceName)) {
      const error = new Error("terminal_service_not_allowed");
      error.statusCode = 403;
      throw error;
    }
    if (command === "service" && String(args[1] || "status").toLowerCase() !== "status") {
      const error = new Error("terminal_command_not_allowed");
      error.statusCode = 400;
      throw error;
    }
    if (command === "service") return runProcess("systemctl", ["status", "--no-pager", "--lines=30", serviceName]);
    const lines = Math.min(200, Math.max(10, Number(args[1] || 60) || 60));
    return runProcess("journalctl", ["-u", serviceName, "--no-pager", "-n", String(lines)]);
  }
  if (command === "hermes") {
    const actions = {
      status: ["gateway", "status"],
      doctor: ["doctor"],
      sessions: ["sessions", "list"],
      cron: ["cron", "list"],
      profiles: ["profile", "list"],
      config: ["config", "get", "gateway.multiplex_profiles"],
    };
    const action = actions[String(args[0] || "status").toLowerCase()];
    if (!action) {
      const error = new Error("terminal_command_not_allowed");
      error.statusCode = 400;
      throw error;
    }
    return runProcess(process.env.JCORE_HERMES_CLI || "jarvis", action);
  }
  if (command === "openclaw") {
    const actions = {
      status: ["status"],
      doctor: ["doctor"],
      models: ["models", "list"],
      tasks: ["tasks", "list"],
    };
    const action = actions[String(args[0] || "status").toLowerCase()];
    if (!action) {
      const error = new Error("terminal_command_not_allowed");
      error.statusCode = 400;
      throw error;
    }
    return runProcess(process.env.JCORE_OPENCLAW_CLI || "openclaw", action);
  }
  if (command === "claude") {
    const actions = {
      version: ["--version"],
      status: ["--version"],
      doctor: ["doctor"],
      auth: ["auth", "status"],
    };
    const action = actions[String(args[0] || "version").toLowerCase()];
    if (!action) {
      const error = new Error("terminal_command_not_allowed");
      error.statusCode = 400;
      throw error;
    }
    return runProcess(process.env.JCORE_CLAUDE_CLI || "claude", action);
  }
  if (command === "9router" && String(args[0] || "models").toLowerCase() === "models") {
    const result = await fetchJson(`${services.nineRouter.base.replace(/\/+$/, "")}/v1/models`, services.nineRouter.apiKey);
    const models = Array.isArray(result.data?.data) ? result.data.data.map((model) => model.id || model.name).filter(Boolean) : [];
    return { output: models.join("\n") || normalizeReply(result.data) || `9Router returned HTTP ${result.status}`, exitCode: result.ok ? 0 : 1, durationMs: result.latencyMs };
  }
  const error = new Error("terminal_command_not_allowed");
  error.statusCode = 400;
  throw error;
}

async function executePrivateTerminalCommand(rawCommand) {
  if (!TERMINAL_ENABLED || !TERMINAL_PRIVATE_MODE) {
    const error = new Error("terminal_private_mode_disabled");
    error.statusCode = 403;
    throw error;
  }
  if (process.platform !== "linux") {
    const error = new Error("terminal_private_mode_requires_ubuntu");
    error.statusCode = 409;
    throw error;
  }
  const raw = String(rawCommand || "").trim();
  if (!raw || raw.length > 4096 || /[\0\r]/.test(raw)) {
    const error = new Error("terminal_command_rejected");
    error.statusCode = 400;
    throw error;
  }
  const shell = process.env.JCORE_TERMINAL_SHELL || process.env.SHELL || "/bin/bash";
  return runProcess(shell, ["-lc", raw]);
}

async function executeDashboardCommand(body = {}) {
  const service = String(body.service || "").trim().toLowerCase();
  const action = String(body.action || "status").trim().toLowerCase();
  const lines = Math.min(200, Math.max(10, Number(body.lines || 60) || 60));
  const commandCatalog = {
    hermes: {
      status: "hermes status",
      doctor: "hermes doctor",
      sessions: "hermes sessions",
      cron: "hermes cron",
      profiles: "hermes profiles",
      config: "hermes config",
    },
    openclaw: {
      status: "openclaw status",
      doctor: "openclaw doctor",
      models: "openclaw models",
      tasks: "openclaw tasks",
    },
    claude: {
      version: "claude version",
      status: "claude version",
      doctor: "claude doctor",
      auth: "claude auth",
    },
    "9router": {
      models: "9router models",
      status: "9router models",
    },
    ninerouter: {
      models: "9router models",
      status: "9router models",
    },
    system: {
      uptime: "system uptime",
      disk: "system disk",
      memory: "system memory",
    },
  };
  if (service === "logs") {
    const serviceName = String(body.name || "").trim();
    return executeTerminalCommand(`logs ${serviceName} ${lines}`);
  }
  const command = commandCatalog[service]?.[action];
  if (!command) {
    const error = new Error("dashboard_command_not_allowed");
    error.statusCode = 400;
    throw error;
  }
  return executeTerminalCommand(command);
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

function nativeDashboardUrl(req, port, pathname = "/") {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const protocol = forwardedProto || (req.socket.encrypted ? "https" : "http");
  const requestHost = String(req.headers.host || `${HOST}:${PORT}`).replace(/^\[|\]$|:\d+$/g, "");
  const hostname = NATIVE_DASHBOARD_PROXY_HOST === "127.0.0.1" ? "127.0.0.1" : requestHost;
  return `${protocol}://${hostname}:${port}${pathname}`;
}

function rewriteDashboardHeaders(headers, req, upstreamBase) {
  const responseHeaders = { ...headers };
  delete responseHeaders["x-frame-options"];
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const protocol = forwardedProto || (req.socket.encrypted ? "https" : "http");
  const parentHost = String(req.headers.host || `${HOST}:${PORT}`).replace(/:\d+$/, `:${PORT}`);
  const parentOrigin = `${protocol}://${parentHost}`;
  const upstreamCsp = String(responseHeaders["content-security-policy"] || "")
    .replace(/(?:^|;)\s*frame-ancestors\s+[^;]*/gi, "")
    .replace(/^;\s*|\s*;$/g, "");
  responseHeaders["content-security-policy"] = [upstreamCsp, `frame-ancestors 'self' ${parentOrigin}`].filter(Boolean).join("; ");
  if (responseHeaders.location) {
    responseHeaders.location = String(responseHeaders.location).replace(upstreamBase.origin, `${protocol}://${req.headers.host}`);
  }
  responseHeaders["cache-control"] = responseHeaders["cache-control"] || "no-store";
  return responseHeaders;
}

async function ensureNineRouterUpstreamSession(req, upstreamUrl) {
  const jcoreSessionId = cookieValue(req, "jcore_session");
  const cached = nineRouterUpstreamSessions.get(jcoreSessionId);
  if (cached?.expiresAt > Date.now()) return cached.cookie;
  const dashboardPassword = process.env.NINEROUTER_DASHBOARD_PASSWORD || "";
  if (!dashboardPassword) return "";
  const response = await fetch(new URL("/api/auth/login", upstreamUrl), {
    method: "POST",
    headers: { "content-type": "application/json", "x-9r-real-ip": "j-core-local" },
    body: JSON.stringify({ password: dashboardPassword }),
  });
  if (!response.ok) return "";
  const setCookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie") || ""];
  const cookie = setCookies.map((value) => value.split(";", 1)[0]).filter(Boolean).join("; ");
  if (cookie) nineRouterUpstreamSessions.set(jcoreSessionId, { cookie, expiresAt: Date.now() + DASHBOARD_SESSION_TTL_MS });
  return cookie;
}

async function proxyNativeDashboard(req, res, upstreamUrl, serviceKey = "") {
  return new Promise((resolveProxy) => {
    if (!authSession(req)) {
      res.writeHead(401, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
      res.end("J-Core session required");
      resolveProxy();
      return;
    }
    const upstreamBase = new URL(upstreamUrl);
    const startProxy = async () => {
      const upstreamCookie = serviceKey === "nineRouter" ? await ensureNineRouterUpstreamSession(req, upstreamUrl) : "";
      const headers = { ...req.headers, host: upstreamBase.host };
      if (upstreamCookie) headers.cookie = upstreamCookie;
      delete headers.authorization;
      const upstream = httpRequest({
        protocol: upstreamBase.protocol,
        hostname: upstreamBase.hostname,
        port: upstreamBase.port || 80,
        method: req.method,
        path: req.url,
        headers,
      }, (upstreamResponse) => {
        res.writeHead(upstreamResponse.statusCode || 502, rewriteDashboardHeaders(upstreamResponse.headers, req, upstreamBase));
        upstreamResponse.pipe(res);
        upstreamResponse.on("end", resolveProxy);
      });
      upstream.on("error", () => {
        if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("Native dashboard is offline");
        resolveProxy();
      });
      req.pipe(upstream);
    };
    void startProxy().catch(() => {
      if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
      res.end("Native dashboard session could not be created");
      resolveProxy();
    });
  });
}

function proxyNativeUpgrade(req, socket, head, upstreamUrl) {
  if (!authSession(req)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  const upstreamBase = new URL(upstreamUrl);
  const headers = { ...req.headers, host: upstreamBase.host };
  const upstream = httpRequest({
    protocol: upstreamBase.protocol,
    hostname: upstreamBase.hostname,
    port: upstreamBase.port || 80,
    method: req.method,
    path: req.url,
    headers,
  });
  upstream.on("upgrade", (upstreamResponse, upstreamSocket, upstreamHead) => {
    const statusLine = `HTTP/${upstreamResponse.httpVersion} ${upstreamResponse.statusCode} ${upstreamResponse.statusMessage}\r\n`;
    const headerLines = upstreamResponse.rawHeaders.reduce((result, value, index) => result + (index % 2 ? `${value}\r\n` : `${value}: `), "");
    socket.write(`${statusLine}${headerLines}\r\n`);
    if (upstreamHead.length) socket.write(upstreamHead);
    if (head.length) upstreamSocket.write(head);
    upstreamSocket.pipe(socket).pipe(upstreamSocket);
  });
  upstream.on("error", () => socket.destroy());
  upstream.end();
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

async function transcribeVietnameseAudio(audio, mimeType = "audio/webm") {
  if (!HERMES_STT_URL) return { ok: false, status: 503, error: "voice_stt_not_configured" };
  const form = new FormData();
  const extension = mimeType.includes("ogg") ? "ogg" : mimeType.includes("wav") ? "wav" : "webm";
  form.append("file", new Blob([audio], { type: mimeType }), `jcore-voice.${extension}`);
  form.append("model", HERMES_STT_MODEL);
  form.append("language", "vi");
  const headers = HERMES_STT_API_KEY ? { authorization: `Bearer ${HERMES_STT_API_KEY}` } : {};
  const startedAt = Date.now();
  try {
    const response = await fetch(HERMES_STT_URL, { method: "POST", headers, body: form, signal: AbortSignal.timeout(60000) });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { text }; }
    return { ok: response.ok, status: response.status, data, latencyMs: Date.now() - startedAt, error: response.ok ? null : data?.error || `upstream_${response.status}` };
  } catch (error) {
    return { ok: false, status: 0, error: error?.name === "TimeoutError" ? "upstream_timeout" : "upstream_offline", latencyMs: Date.now() - startedAt };
  }
}

async function synthesizeVietnameseSpeech(text, voice) {
  if (!HERMES_TTS_URL) return { ok: false, status: 503, error: "voice_tts_not_configured" };
  const headers = { "content-type": "application/json" };
  if (HERMES_TTS_API_KEY) headers.authorization = `Bearer ${HERMES_TTS_API_KEY}`;
  const startedAt = Date.now();
  try {
    const response = await fetch(HERMES_TTS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: HERMES_TTS_MODEL, voice: voice || HERMES_TTS_VOICE, input: text, language: "vi-VN", response_format: "mp3" }),
      signal: AbortSignal.timeout(60000),
    });
    const audio = Buffer.from(await response.arrayBuffer());
    return { ok: response.ok, status: response.status, audio, contentType: response.headers.get("content-type") || "audio/mpeg", latencyMs: Date.now() - startedAt };
  } catch (error) {
    return { ok: false, status: 0, error: error?.name === "TimeoutError" ? "upstream_timeout" : "upstream_offline", latencyMs: Date.now() - startedAt };
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

function safeProfileMetadata(value, fallback = {}) {
  if (!value || typeof value !== "object") return null;
  const id = normalizeHermesProfile(value.id || fallback.id);
  if (!id) return null;
  const palette = /^(gold|blue|green|red|violet|orange|spider)$/.test(String(value.palette || fallback.palette || ""))
    ? String(value.palette || fallback.palette)
    : "gold";
  const tags = Array.isArray(value.tags || fallback.tags)
    ? (value.tags || fallback.tags).map((tag) => String(tag).slice(0, 32)).filter(Boolean).slice(0, 8)
    : [];
  return {
    id,
    name: String(value.name || value.title || fallback.name || id).slice(0, 96),
    role: String(value.role || fallback.role || "Hermes profile").slice(0, 180),
    description: String(value.description || value.summary || fallback.description || `Profile ${id} trên Hermes Ubuntu.`).slice(0, 320),
    icon: String(value.icon || fallback.icon || "terminal").slice(0, 32),
    palette,
    tags,
    defaultModel: String(value.defaultModel || value.model || fallback.defaultModel || services.hermes.model).slice(0, 128),
  };
}

function configuredProfileMetadata() {
  let configured = [];
  try {
    const parsed = JSON.parse(process.env.HERMES_PROFILE_METADATA_JSON || "[]");
    configured = Array.isArray(parsed) ? parsed : Object.entries(parsed).map(([id, metadata]) => ({ id, ...(metadata || {}) }));
  } catch {
    configured = [];
  }
  const fallbackById = new Map(HERMES_PROFILE_CATALOG.map((profile) => [profile.id, profile]));
  const configuredById = new Map(configured.map((profile) => [String(profile?.id || ""), profile]));
  return [...HERMES_ALLOWED_PROFILES].map((id) => safeProfileMetadata(configuredById.get(id) || {}, fallbackById.get(id) || { id })).filter(Boolean);
}

async function loadHermesProfileMetadata() {
  if (hermesProfileMetadataCache.expiresAt > Date.now()) return hermesProfileMetadataCache.profiles;
  const localProfiles = configuredProfileMetadata();
  const localById = new Map(localProfiles.map((profile) => [profile.id, profile]));
  const upstream = await fetchJson(`${services.hermes.base.replace(/\/+$/, "")}/v1/profiles`, services.hermes.apiKey, 3500);
  const upstreamProfiles = Array.isArray(upstream.data?.profiles)
    ? upstream.data.profiles
    : Array.isArray(upstream.data?.data)
      ? upstream.data.data
      : Array.isArray(upstream.data)
        ? upstream.data
        : [];
  const profiles = upstreamProfiles.length
    ? upstreamProfiles.map((profile) => safeProfileMetadata(profile, localById.get(String(profile?.id || "")) || {})).filter(Boolean)
    : localProfiles;
  hermesProfileMetadataCache = { expiresAt: Date.now() + HERMES_PROFILE_METADATA_TTL_MS, profiles };
  return profiles;
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

function terminalSessionAvailable() {
  return TERMINAL_ENABLED && TERMINAL_PRIVATE_MODE && process.platform === "linux";
}

function recordTerminalAudit(event) {
  terminalAudit.push({ at: new Date().toISOString(), ...event });
  if (terminalAudit.length > 200) terminalAudit.splice(0, terminalAudit.length - 200);
}

function issueTerminalTicket(req) {
  if (!terminalSessionAvailable()) {
    const error = new Error(!TERMINAL_PRIVATE_MODE ? "terminal_private_mode_disabled" : "terminal_private_mode_requires_ubuntu");
    error.statusCode = 403;
    throw error;
  }
  const ticket = randomUUID();
  const sessionId = randomUUID();
  terminalTickets.set(ticket, {
    sessionId,
    expiresAt: Date.now() + TERMINAL_TICKET_TTL_MS,
    origin: String(req.headers.origin || ""),
    remoteAddress: String(req.socket.remoteAddress || ""),
  });
  recordTerminalAudit({ event: "ticket-issued", sessionId, remoteAddress: String(req.socket.remoteAddress || "") });
  return { ticket, sessionId, expiresInSeconds: Math.floor(TERMINAL_TICKET_TTL_MS / 1000) };
}

function consumeTerminalTicket(ticket, req) {
  const entry = terminalTickets.get(ticket);
  terminalTickets.delete(ticket);
  if (!entry || entry.expiresAt < Date.now()) return null;
  const origin = String(req.headers.origin || "");
  if (entry.origin && origin && entry.origin !== origin) return null;
  return entry;
}

const server = createServer(async (req, res) => {
  const suppliedRequestId = String(req.headers["x-request-id"] || "");
  req.requestId = /^[a-zA-Z0-9._:-]{8,128}$/.test(suppliedRequestId) ? suppliedRequestId : randomUUID();
  if (req.method === "OPTIONS") return sendJson(req, res, 204, {});
  gatewayStats.requests += 1;

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      if (!loginAllowed(req)) return sendJson(req, res, 429, { error: "login_rate_limited" });
      const body = await readJson(req);
      const valid = sameSecret(body.username || "", AUTH_USERNAME) && sameSecret(body.password || "", AUTH_PASSWORD);
      if (!valid) {
        const remaining = recordLoginFailure(req);
        return sendJson(req, res, 401, { error: "invalid_credentials", remaining });
      }
      loginAttempts.delete(String(req.socket.remoteAddress || "unknown"));
      return sendJson(req, res, 200, {
        authenticated: true,
        user: { username: AUTH_USERNAME },
        connection: { mode: "same-origin", automatic: true },
      }, { "set-cookie": issueAuthCookie(req, AUTH_USERNAME) });
    }

    if (req.method === "GET" && url.pathname === "/api/auth/session") {
      const session = authSession(req);
      return sendJson(req, res, 200, {
        authenticated: Boolean(session),
        user: session ? { username: session.username } : null,
        connection: { mode: "same-origin", automatic: true },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      const sessionId = cookieValue(req, "jcore_session");
      if (sessionId) authSessions.delete(sessionId);
      return sendJson(req, res, 200, { authenticated: false }, { "set-cookie": clearAuthCookie(req) });
    }

    if ((req.method === "GET" || req.method === "HEAD") && !url.pathname.startsWith("/api/") && url.pathname !== "/health" && url.pathname !== "/dashboard") {
      if (serveWebAsset(req, res, url.pathname)) return;
    }

    const hasGatewayAuthorization = authorized(req);
    const hasDashboardSession = authorizedDashboardSession(req);

    if (!hasGatewayAuthorization && hasDashboardSession) {
      return proxyNineRouter(req, res);
    }
    if (!hasGatewayAuthorization) {
      return sendJson(req, res, 401, { error: "unauthorized" });
    }

    if (req.method === "GET" && url.pathname === "/api/native-dashboards") {
      return sendJson(req, res, 200, {
        dashboards: {
          hermes: nativeDashboardUrl(req, NATIVE_DASHBOARD_PORTS.hermes),
          openclaw: nativeDashboardUrl(req, NATIVE_DASHBOARD_PORTS.openclaw),
          nineRouter: nativeDashboardUrl(req, NATIVE_DASHBOARD_PORTS.nineRouter, "/dashboard"),
        },
      });
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
      const [capabilities, models, profileMetadata] = await Promise.all([
        fetchJson(`${services.hermes.base.replace(/\/+$/, "")}/v1/capabilities`, services.hermes.apiKey),
        fetchJson(`${services.hermes.base.replace(/\/+$/, "")}/v1/models`, services.hermes.apiKey),
        loadHermesProfileMetadata(),
      ]);
      const ok = capabilities.ok || models.ok;
      return sendJson(req, res, ok ? 200 : 502, {
        source: "hermes",
        configured: Boolean(services.hermes.chat),
        model: services.hermes.model,
        defaultProfile: HERMES_DEFAULT_PROFILE,
        profiles: [...HERMES_ALLOWED_PROFILES],
        profileMetadata,
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
      const profiles = await loadHermesProfileMetadata();
      return sendJson(req, res, 200, {
        source: "hermes",
        defaultProfile: HERMES_DEFAULT_PROFILE,
        multiplexProfiles: HERMES_MULTIPLEX_PROFILES,
        profiles,
        metadataSource: profiles.some((profile) => profile.defaultModel !== services.hermes.model) ? "hermes" : "configured-fallback",
      });
    }

    if (req.method === "GET" && url.pathname === "/api/hermes/voice/capabilities") {
      return sendJson(req, res, 200, {
        source: "hermes-voice",
        stt: { configured: Boolean(HERMES_STT_URL), model: HERMES_STT_URL ? HERMES_STT_MODEL : "browser-speech-recognition", language: "vi-VN" },
        tts: { configured: Boolean(HERMES_TTS_URL), model: HERMES_TTS_URL ? HERMES_TTS_MODEL : "browser-speech-synthesis", voice: HERMES_TTS_URL ? HERMES_TTS_VOICE : "system-vi", language: "vi-VN" },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/hermes/voice/transcribe") {
      const audio = await readBuffer(req, 16 * 1024 * 1024);
      if (!audio.length) return sendJson(req, res, 400, { error: "voice_audio_missing" });
      const result = await transcribeVietnameseAudio(audio, String(req.headers["content-type"] || "audio/webm").split(";")[0]);
      if (!result.ok) return sendJson(req, res, result.status || 502, { error: result.error || "voice_transcription_failed" });
      return sendJson(req, res, 200, {
        source: "hermes-stt",
        transcript: String(result.data?.text || result.data?.transcript || ""),
        language: result.data?.language || "vi",
        latencyMs: result.latencyMs,
      }, { "x-jcore-upstream": "hermes-stt", "server-timing": `stt;dur=${result.latencyMs}` });
    }

    if (req.method === "POST" && url.pathname === "/api/hermes/voice/synthesize") {
      const body = await readJson(req);
      const text = String(body.text || "").trim();
      if (!text || text.length > 5000) return sendJson(req, res, 400, { error: "voice_text_invalid" });
      const result = await synthesizeVietnameseSpeech(text, String(body.voice || ""));
      if (!result.ok) return sendJson(req, res, result.status || 502, { error: result.error || "voice_synthesis_failed" });
      return sendBuffer(req, res, 200, result.audio, result.contentType, { "x-jcore-upstream": "hermes-tts", "server-timing": `tts;dur=${result.latencyMs}` });
    }

    if (req.method === "POST" && url.pathname === "/api/hermes/chat") {
      const body = await readJson(req);
      let proxied = null;

      if (services.hermes.chat && getCircuit("hermes").openUntil <= Date.now()) {
        proxied = await proxyHermesChat(body, body.profile || HERMES_DEFAULT_PROFILE);
      }

      // If Hermes returned a valid response, return it
      if (proxied?.result?.ok) {
        const { result, profile } = proxied;
        recordUpstreamResult("hermes", result);
        return sendJson(req, res, 200, {
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

      // Fallback 1: 9Router
      if (services.nineRouter.chat && getCircuit("nineRouter").openUntil <= Date.now()) {
        const fallbackResult = await proxyJson(services.nineRouter.chat, toOpenAiPayload(body, services.nineRouter.model), services.nineRouter.apiKey);
        recordUpstreamResult("nineRouter", fallbackResult);
        if (fallbackResult.ok) {
          return sendJson(req, res, 200, {
            reply: normalizeReply(fallbackResult.data),
            upstreamStatus: fallbackResult.status,
            raw: fallbackResult.data,
            source: "nineRouter",
            profile: body.profile || "jarvis",
          }, {
            "x-jcore-upstream": "9router",
            "server-timing": `9router;dur=${fallbackResult.latencyMs}`,
          });
        }
      }

      // Fallback 2: OpenClaw
      if (services.openclaw.chat && getCircuit("openclaw").openUntil <= Date.now()) {
        const fallbackResult = await proxyJson(services.openclaw.chat, toOpenAiPayload(body, "openclaw/default"), services.openclaw.apiKey);
        recordUpstreamResult("openclaw", fallbackResult);
        if (fallbackResult.ok) {
          return sendJson(req, res, 200, {
            reply: normalizeReply(fallbackResult.data),
            upstreamStatus: fallbackResult.status,
            raw: fallbackResult.data,
            source: "openclaw",
            profile: body.profile || "jarvis",
          }, {
            "x-jcore-upstream": "openclaw",
            "server-timing": `openclaw;dur=${fallbackResult.latencyMs}`,
          });
        }
      }

      if (proxied?.configError) {
        return sendJson(req, res, proxied.status || 400, {
          error: proxied.configError,
          profile: proxied.profile || String(body.profile || ""),
        });
      }

      if (!services.hermes.chat && !services.nineRouter.chat && !services.openclaw.chat) {
        return sendJson(req, res, 503, { error: "ai_not_configured" });
      }

      const failedResult = proxied?.result || { status: 502, data: { error: "upstream_offline" }, latencyMs: 0 };
      recordUpstreamResult("hermes", failedResult);
      return sendJson(req, res, 502, {
        error: "all_ai_upstreams_failed",
        message: "Hermes, 9Router và OpenClaw hiện không phản hồi.",
        upstreamStatus: failedResult.status,
        source: "gateway",
      });
    }

    if (req.method === "GET" && url.pathname === "/api/workspace/roots") {
      return sendJson(req, res, 200, {
        roots: [...workspaceRoots.values()].map(rootSummary),
        readOnly: !WORKSPACE_WRITE_ENABLED,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/workspace/tree") {
      const rootId = url.searchParams.get("root") || "workspace";
      const requestedPath = url.searchParams.get("path") || "";
      const listed = listWorkspaceDirectory(rootId, requestedPath);
      return sendJson(req, res, 200, {
        root: rootSummary(listed.root),
        path: listed.relativePath,
        entries: listed.entries,
        truncated: listed.truncated,
        readOnly: !WORKSPACE_WRITE_ENABLED,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/workspace/file") {
      const rootId = url.searchParams.get("root") || "workspace";
      const requestedPath = url.searchParams.get("path") || "";
      const file = readWorkspaceFile(rootId, requestedPath);
      return sendJson(req, res, 200, {
        root: rootSummary(file.root),
        path: file.relativePath,
        content: file.content,
        size: file.size,
        modifiedAt: file.modifiedAt,
        readOnly: !WORKSPACE_WRITE_ENABLED,
      });
    }

    if (req.method === "PUT" && url.pathname === "/api/workspace/file") {
      const body = await readJson(req);
      const saved = writeWorkspaceFile(body.root || "workspace", body.path || "", body.content, body.expectedModifiedAt || "");
      return sendJson(req, res, 200, {
        root: rootSummary(saved.root),
        path: saved.relativePath,
        size: saved.size,
        modifiedAt: saved.modifiedAt,
        saved: true,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/apps/config") {
      return sendJson(req, res, 200, readAppConfig(url.searchParams.get("service") || ""));
    }

    if (req.method === "PUT" && url.pathname === "/api/apps/config") {
      const body = await readJson(req);
      const saved = writeAppConfig(body.service, body.content, body.expectedModifiedAt || "");
      return sendJson(req, res, 200, { ...saved, saved: true });
    }

    if (req.method === "GET" && url.pathname === "/api/obsidian/notes") {
      const vault = collectObsidianNotes();
      return sendJson(req, res, 200, {
        root: rootSummary(getWorkspaceRoot("obsidian")),
        notes: vault.notes,
        totalBytes: vault.totalBytes,
        truncated: vault.truncated,
        readOnly: true,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/system/terminal/session") {
      const session = issueTerminalTicket(req);
      return sendJson(req, res, 200, {
        ...session,
        websocketPath: "/ws/terminal",
        mode: "private-ubuntu-pty",
        audit: true,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/system/terminal/audit") {
      return sendJson(req, res, 200, { events: terminalAudit.slice(-100), total: terminalAudit.length });
    }

    if (req.method === "POST" && url.pathname === "/api/system/terminal") {
      const body = await readJson(req);
      const command = String(body.command || "").trim();
      if (!command) return sendJson(req, res, 400, { error: "terminal_missing_command" });
      const result = await executeTerminalCommand(command);
      return sendJson(req, res, 200, {
        command,
        output: result.output || "",
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        timedOut: Boolean(result.timedOut),
        truncated: Boolean(result.truncated),
        mode: "read-only",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/system/private-terminal") {
      const body = await readJson(req);
      const command = String(body.command || "").trim();
      if (!command) return sendJson(req, res, 400, { error: "terminal_missing_command" });
      const result = await executePrivateTerminalCommand(command);
      return sendJson(req, res, 200, {
        command,
        output: result.output || "",
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        timedOut: Boolean(result.timedOut),
        truncated: Boolean(result.truncated),
        mode: "private-ubuntu-shell",
      });
    }

    if (req.method === "POST" && url.pathname === "/api/system/dashboard-command") {
      const body = await readJson(req);
      const result = await executeDashboardCommand(body);
      return sendJson(req, res, 200, {
        service: String(body.service || ""),
        action: String(body.action || "status"),
        output: result.output || "",
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        timedOut: Boolean(result.timedOut),
        truncated: Boolean(result.truncated),
        mode: "dashboard-allowlist",
      });
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
    return sendJson(req, res, status, { error: error?.message || "gateway_error", ...(error?.details || {}) });
  }
});

const terminalWss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

server.on("upgrade", (req, socket, head) => {
  let url;
  try { url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`); } catch { socket.destroy(); return; }
  if (url.pathname !== "/ws/terminal") { socket.destroy(); return; }
  const requestOrigin = String(req.headers.origin || "").replace(/\/+$/, "");
  if (!CORS_ORIGINS.includes("*") && requestOrigin && !CORS_ORIGINS.includes(requestOrigin)) {
    socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  const terminalSession = consumeTerminalTicket(String(url.searchParams.get("ticket") || ""), req);
  if (!terminalSession || !terminalSessionAvailable()) {
    socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  terminalWss.handleUpgrade(req, socket, head, (websocket) => {
    terminalWss.emit("connection", websocket, req, terminalSession);
  });
});

terminalWss.on("connection", (websocket, req, session) => {
  const shell = process.env.JCORE_TERMINAL_SHELL || process.env.SHELL || "/bin/bash";
  const cwd = existsSync(WORKSPACE_ROOT) ? WORKSPACE_ROOT : process.cwd();
  const terminal = spawn("script", ["-qefc", shell, "/dev/null"], {
    cwd,
    env: { ...process.env, TERM: "xterm-256color", JCORE_TERMINAL_SESSION_ID: session.sessionId },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let closed = false;
  let inputBytes = 0;
  let outputBytes = 0;
  const startedAt = Date.now();
  const sessionTimer = setTimeout(() => websocket.close(4000, "session-expired"), TERMINAL_SESSION_TTL_MS);
  const send = (payload) => {
    if (websocket.readyState === 1) websocket.send(JSON.stringify(payload));
  };
  const sendOutput = (stream, chunk) => {
    outputBytes += chunk.length;
    send({ type: "output", stream, data: chunk.toString("utf8") });
  };
  terminal.stdout.on("data", (chunk) => sendOutput("stdout", chunk));
  terminal.stderr.on("data", (chunk) => sendOutput("stderr", chunk));
  terminal.on("error", (error) => send({ type: "error", message: error.message }));
  terminal.on("close", (code, signal) => {
    send({ type: "exit", code, signal });
    if (websocket.readyState === 1) websocket.close(1000, "process-exited");
  });
  websocket.on("message", (raw) => {
    let payload;
    try { payload = JSON.parse(String(raw)); } catch { payload = { type: "input", data: String(raw) }; }
    if (payload.type !== "input") return;
    const input = String(payload.data || "");
    if (!input || input.length > 8192) return;
    inputBytes += Buffer.byteLength(input);
    terminal.stdin.write(input);
  });
  const cleanup = () => {
    if (closed) return;
    closed = true;
    clearTimeout(sessionTimer);
    if (!terminal.killed) terminal.kill("SIGHUP");
    recordTerminalAudit({
      event: "session-closed",
      sessionId: session.sessionId,
      durationMs: Date.now() - startedAt,
      inputBytes,
      outputBytes,
      remoteAddress: String(req.socket.remoteAddress || ""),
    });
  };
  websocket.on("close", cleanup);
  websocket.on("error", cleanup);
  recordTerminalAudit({ event: "session-opened", sessionId: session.sessionId, remoteAddress: String(req.socket.remoteAddress || "") });
  send({ type: "ready", sessionId: session.sessionId, cwd: ".", expiresInSeconds: Math.floor(TERMINAL_SESSION_TTL_MS / 1000) });
});

server.listen(PORT, HOST, () => {
  console.log(`J-Core server: http://${HOST}:${PORT}`);
  console.log(`J-Core local gateway: http://${HOST}:${PORT}`);
  console.log(`Hermes: ${services.hermes.base}`);
  console.log(`OpenClaw: ${services.openclaw.base}`);
  console.log(`9Router: ${services.nineRouter.base}`);
  console.log(`Claude bridge: ${services.claude.base}`);
  console.log(`Private terminal PTY: ${terminalSessionAvailable() ? "enabled" : "disabled"}`);
});

const nativeDashboardTargets = [
  ["Hermes", "hermes", NATIVE_DASHBOARD_PORTS.hermes, services.hermes.base],
  ["OpenClaw", "openclaw", NATIVE_DASHBOARD_PORTS.openclaw, services.openclaw.base],
  ["9Router", "nineRouter", NATIVE_DASHBOARD_PORTS.nineRouter, services.nineRouter.base],
];

for (const [label, serviceKey, port, upstream] of nativeDashboardTargets) {
  const nativeServer = createServer((req, res) => void proxyNativeDashboard(req, res, upstream, serviceKey));
  nativeServer.on("upgrade", (req, socket, head) => proxyNativeUpgrade(req, socket, head, upstream));
  nativeServer.listen(port, NATIVE_DASHBOARD_PROXY_HOST, () => console.log(`${label} native dashboard proxy: http://${NATIVE_DASHBOARD_PROXY_HOST}:${port}`));
}
