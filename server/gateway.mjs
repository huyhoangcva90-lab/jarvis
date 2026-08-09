import { createServer, request as httpRequest } from "node:http";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

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
  (process.env.HERMES_ALLOWED_PROFILES || "jarvis")
    .split(",")
    .map((profile) => profile.trim())
    .filter(Boolean),
);
HERMES_ALLOWED_PROFILES.add(HERMES_DEFAULT_PROFILE);
const HERMES_SESSION_MODE = process.env.HERMES_SESSION_MODE === "telegram" ? "telegram" : "web";
const HERMES_SESSION_ID = process.env.HERMES_SESSION_ID || "jarvis-web-primary";
const HERMES_SESSION_KEY = process.env.HERMES_SESSION_KEY || "agent:jarvis:web:dm:owner";
const WORKSPACE_ROOT = resolve(process.env.JCORE_WORKSPACE_ROOT || process.cwd());
const OBSIDIAN_ROOT = process.env.JCORE_OBSIDIAN_ROOT ? resolve(process.env.JCORE_OBSIDIAN_ROOT) : "";
const WORKSPACE_WRITE_ENABLED = /^(1|true|yes|on)$/i.test(process.env.JCORE_WORKSPACE_WRITE_ENABLED || "false");
const TERMINAL_ENABLED = !/^(0|false|no|off)$/i.test(process.env.JCORE_TERMINAL_ENABLED || "true");
const TERMINAL_PRIVATE_MODE = /^(1|true|yes|on)$/i.test(process.env.JCORE_TERMINAL_PRIVATE_MODE || "false");
const TERMINAL_TIMEOUT_MS = Math.min(30000, Math.max(1000, Number(process.env.JCORE_TERMINAL_TIMEOUT_MS || 10000)));
const TERMINAL_OUTPUT_LIMIT = Math.min(1024 * 1024, Math.max(16384, Number(process.env.JCORE_TERMINAL_OUTPUT_LIMIT || 262144)));
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

const workspaceRoots = new Map([
  ["workspace", { id: "workspace", label: "Ubuntu Workspace", path: WORKSPACE_ROOT }],
  ...(OBSIDIAN_ROOT ? [["obsidian", { id: "obsidian", label: "Obsidian Vault", path: OBSIDIAN_ROOT }]] : []),
]);

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
  if (command === "claude" && String(args[0] || "version").toLowerCase() === "version") {
    return runProcess(process.env.JCORE_CLAUDE_CLI || "claude", ["--version"]);
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
          { id: "ev-personal", name: "E.V Personal Link", role: "Trợ lý hoạch định đời sống và liên kết cá nhân", icon: "router" },
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
