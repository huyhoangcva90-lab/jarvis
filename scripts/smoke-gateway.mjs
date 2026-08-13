import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const gatewayPort = 18787;
const upstreamPort = 30129;
const token = "jcore-smoke-token";
const hermesRequests = [];
const configDirectory = mkdtempSync(join(tmpdir(), "jcore-config-smoke-"));
const configPath = join(configDirectory, "openclaw.json");
writeFileSync(configPath, '{"mode":"before"}\n', "utf8");

const upstream = createServer(async (req, res) => {
  if (req.url === "/v1/models") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ data: [{ id: "Code" }, { id: "Combofree" }] }));
    return;
  }
  if (req.url === "/v1/capabilities") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ features: { chat_completions: true } }));
    return;
  }
  if (req.url === "/v1/profiles") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ profiles: [{ id: "jarvis", name: "Jarvis Live", palette: "orange", tags: ["Ubuntu", "Memory"], model: "hermes-agent" }] }));
    return;
  }
  if (req.url === "/dashboard") {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "x-frame-options": "SAMEORIGIN",
    });
    res.end("<!doctype html><title>9Router Smoke Dashboard</title><h1>9Router ready</h1>");
    return;
  }
  if (req.url === "/api/settings") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ requireLogin: false, nativeAdmin: true }));
    return;
  }
  if ((req.url === "/v1/chat/completions" || req.url === "/p/cadence-content/v1/chat/completions") && req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    if (req.headers["x-hermes-session-id"]) {
      hermesRequests.push({ url: req.url, headers: req.headers, body });
    }
    res.writeHead(200, {
      "content-type": "application/json",
      ...(req.headers["x-hermes-session-id"] ? {
        "x-hermes-session-id": req.headers["x-hermes-session-id"],
        "x-hermes-session-key": req.headers["x-hermes-session-key"],
      } : {}),
    });
    res.end(JSON.stringify({ choices: [{ message: { content: "smoke-ok" } }] }));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

await new Promise((resolve, reject) => {
  upstream.once("error", reject);
  upstream.listen(upstreamPort, "127.0.0.1", resolve);
});

const gateway = spawn(process.execPath, ["server/gateway.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    JCORE_GATEWAY_HOST: "127.0.0.1",
    JCORE_GATEWAY_PORT: String(gatewayPort),
    JCORE_GATEWAY_TOKEN: token,
    HERMES_DASHBOARD_PROXY_PORT: "19120",
    OPENCLAW_DASHBOARD_PROXY_PORT: "19790",
    NINEROUTER_DASHBOARD_PROXY_PORT: "29129",
    JCORE_AUTH_USERNAME: "smoke-admin",
    JCORE_AUTH_PASSWORD: "smoke-password",
    JCORE_OPENCLAW_CONFIG_PATH: configPath,
    JCORE_APP_CONFIG_WRITE_ENABLED: "true",
    JCORE_CORS_ORIGIN: "http://127.0.0.1:4173",
    JCORE_WORKSPACE_ROOT: process.cwd(),
    JCORE_TERMINAL_ENABLED: "true",
    HERMES_BASE_URL: `http://127.0.0.1:${upstreamPort}`,
    HERMES_HEALTH_URL: `http://127.0.0.1:${upstreamPort}/v1/models`,
    HERMES_CHAT_URL: `http://127.0.0.1:${upstreamPort}/v1/chat/completions`,
    HERMES_API_KEY: "hermes-smoke-api-key",
    HERMES_DEFAULT_PROFILE: "jarvis",
    HERMES_ALLOWED_PROFILES: "jarvis",
    HERMES_MULTIPLEX_PROFILES: "false",
    HERMES_SESSION_MODE: "web",
    HERMES_SESSION_ID: "jarvis-web-primary",
    HERMES_SESSION_KEY: "agent:jarvis:web:dm:owner",
    OPENCLAW_BASE_URL: `http://127.0.0.1:${upstreamPort}`,
    OPENCLAW_HEALTH_URL: `http://127.0.0.1:${upstreamPort}/v1/models`,
    OPENCLAW_CHAT_URL: `http://127.0.0.1:${upstreamPort}/v1/chat/completions`,
    NINEROUTER_BASE_URL: `http://127.0.0.1:${upstreamPort}`,
    NINEROUTER_HEALTH_URL: `http://127.0.0.1:${upstreamPort}/v1/models`,
    NINEROUTER_CHAT_URL: `http://127.0.0.1:${upstreamPort}/v1/chat/completions`,
    CLAUDE_BASE_URL: `http://127.0.0.1:${upstreamPort}`,
    CLAUDE_HEALTH_URL: `http://127.0.0.1:${upstreamPort}/v1/models`,
    CLAUDE_CHAT_URL: `http://127.0.0.1:${upstreamPort}/v1/chat/completions`,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let gatewayOutput = "";
gateway.stdout.on("data", (chunk) => { gatewayOutput += chunk; });
gateway.stderr.on("data", (chunk) => { gatewayOutput += chunk; });

try {
  const deadline = Date.now() + 5000;
  while (!gatewayOutput.includes("J-Core local gateway")) {
    if (Date.now() > deadline) throw new Error(`Gateway did not start:\n${gatewayOutput}`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const base = `http://127.0.0.1:${gatewayPort}`;
  const unauthorized = await fetch(`${base}/health`);
  if (unauthorized.status !== 401) throw new Error(`Expected health 401, received ${unauthorized.status}`);

  const rejectedLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "smoke-admin", password: "wrong" }),
  });
  if (rejectedLogin.status !== 401) throw new Error(`Expected login 401, received ${rejectedLogin.status}`);

  const acceptedLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "smoke-admin", password: "smoke-password" }),
  });
  const loginBody = await acceptedLogin.json();
  const authCookie = acceptedLogin.headers.get("set-cookie")?.split(";")[0] || "";
  if (!acceptedLogin.ok || !loginBody.authenticated || !authCookie) throw new Error(`Login failed: ${JSON.stringify(loginBody)}`);

  const authenticatedSession = await fetch(`${base}/api/auth/session`, { headers: { cookie: authCookie } });
  const authenticatedSessionBody = await authenticatedSession.json();
  if (!authenticatedSessionBody.authenticated || authenticatedSessionBody.connection?.mode !== "same-origin") {
    throw new Error(`Session lookup failed: ${JSON.stringify(authenticatedSessionBody)}`);
  }

  const nativeDashboards = await fetch(`${base}/api/native-dashboards`, { headers: { cookie: authCookie } });
  const nativeDashboardsBody = await nativeDashboards.json();
  if (!nativeDashboards.ok || nativeDashboardsBody.dashboards?.openclaw !== "http://127.0.0.1:19790/") {
    throw new Error(`LAN native dashboard URL failed: ${JSON.stringify(nativeDashboardsBody)}`);
  }

  const configRead = await fetch(`${base}/api/apps/config?service=openclaw`, { headers: { cookie: authCookie } });
  const configBody = await configRead.json();
  if (!configRead.ok || !configBody.content?.includes("before")) throw new Error(`Config read failed: ${JSON.stringify(configBody)}`);
  const configWrite = await fetch(`${base}/api/apps/config`, {
    method: "PUT",
    headers: { cookie: authCookie, "content-type": "application/json" },
    body: JSON.stringify({ service: "openclaw", content: '{"mode":"after"}\n', expectedModifiedAt: configBody.modifiedAt }),
  });
  if (!configWrite.ok || !readFileSync(configPath, "utf8").includes("after")) throw new Error(`Config write failed: ${await configWrite.text()}`);

  const authHeaders = { authorization: `Bearer ${token}` };
  const health = await fetch(`${base}/health`, { headers: authHeaders });
  const healthBody = await health.json();
  if (!health.ok || !healthBody.services?.nineRouter?.online) {
    throw new Error(`Health failed: ${JSON.stringify(healthBody)}`);
  }

  const models = await fetch(`${base}/api/9router/models`, { headers: authHeaders });
  const modelsBody = await models.json();
  if (!models.ok || modelsBody.models?.length !== 2) {
    throw new Error(`Models failed: ${JSON.stringify(modelsBody)}`);
  }

  const roots = await fetch(`${base}/api/workspace/roots`, { headers: authHeaders });
  const rootsBody = await roots.json();
  if (!roots.ok || rootsBody.roots?.length !== 1 || rootsBody.roots[0]?.id !== "workspace") {
    throw new Error(`Workspace roots failed: ${JSON.stringify(rootsBody)}`);
  }
  if (JSON.stringify(rootsBody).includes(process.cwd())) {
    throw new Error("Workspace API leaked an absolute server path");
  }

  const workspaceTree = await fetch(`${base}/api/workspace/tree?root=workspace&path=`, { headers: authHeaders });
  const workspaceTreeBody = await workspaceTree.json();
  if (!workspaceTree.ok || !workspaceTreeBody.entries?.some((entry) => entry.path === "package.json")) {
    throw new Error(`Workspace tree failed: ${JSON.stringify(workspaceTreeBody)}`);
  }

  const workspaceFile = await fetch(`${base}/api/workspace/file?root=workspace&path=package.json`, { headers: authHeaders });
  const workspaceFileBody = await workspaceFile.json();
  if (!workspaceFile.ok || !workspaceFileBody.content?.includes('"name": "j-core-console"')) {
    throw new Error(`Workspace file failed: ${JSON.stringify(workspaceFileBody)}`);
  }

  const traversal = await fetch(`${base}/api/workspace/file?root=workspace&path=${encodeURIComponent("../package.json")}`, { headers: authHeaders });
  if (traversal.status !== 403) {
    throw new Error(`Workspace traversal should be rejected: ${traversal.status} ${await traversal.text()}`);
  }

  const terminalHelp = await fetch(`${base}/api/system/terminal`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ command: "help" }),
  });
  const terminalHelpBody = await terminalHelp.json();
  if (!terminalHelp.ok || terminalHelpBody.mode !== "read-only" || !terminalHelpBody.output?.includes("Ubuntu command broker")) {
    throw new Error(`Terminal help failed: ${JSON.stringify(terminalHelpBody)}`);
  }

  const terminalInjection = await fetch(`${base}/api/system/terminal`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ command: "ls ; whoami" }),
  });
  if (terminalInjection.status !== 400) {
    throw new Error(`Terminal shell injection should be rejected: ${terminalInjection.status} ${await terminalInjection.text()}`);
  }

  const privateTerminalDisabled = await fetch(`${base}/api/system/private-terminal`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ command: "whoami" }),
  });
  if (privateTerminalDisabled.status !== 403) {
    throw new Error(`Private terminal must be disabled by default: ${privateTerminalDisabled.status} ${await privateTerminalDisabled.text()}`);
  }

  const privatePtyDisabled = await fetch(`${base}/api/system/terminal/session`, { method: "POST", headers: authHeaders });
  if (privatePtyDisabled.status !== 403) {
    throw new Error(`Private PTY ticket must be disabled by default: ${privatePtyDisabled.status} ${await privatePtyDisabled.text()}`);
  }

  const dashboardCommand = await fetch(`${base}/api/system/dashboard-command`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ service: "9router", action: "models" }),
  });
  const dashboardCommandBody = await dashboardCommand.json();
  if (!dashboardCommand.ok || dashboardCommandBody.mode !== "dashboard-allowlist" || !dashboardCommandBody.output?.includes("Code")) {
    throw new Error(`Dashboard command failed: ${JSON.stringify(dashboardCommandBody)}`);
  }

  const dashboardRejected = await fetch(`${base}/api/system/dashboard-command`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ service: "openclaw", action: "restart" }),
  });
  if (dashboardRejected.status !== 400) {
    throw new Error(`Dashboard command allowlist failed: ${dashboardRejected.status} ${await dashboardRejected.text()}`);
  }

  const [hermesCapabilities, claudeCapabilities] = await Promise.all([
    fetch(`${base}/api/hermes/capabilities`, { headers: authHeaders }),
    fetch(`${base}/api/claude/capabilities`, { headers: authHeaders }),
  ]);
  const [hermesBody, claudeBody] = await Promise.all([
    hermesCapabilities.json(),
    claudeCapabilities.json(),
  ]);
  if (!hermesCapabilities.ok || !hermesBody.configured || hermesBody.models?.length !== 2) {
    throw new Error(`Hermes capabilities failed: ${JSON.stringify(hermesBody)}`);
  }
  if (!claudeCapabilities.ok || !claudeBody.configured || claudeBody.models?.length !== 2) {
    throw new Error(`Claude capabilities failed: ${JSON.stringify(claudeBody)}`);
  }

  const profiles = await fetch(`${base}/api/hermes/profiles`, { headers: authHeaders });
  const profilesBody = await profiles.json();
  if (!profiles.ok || profilesBody.defaultProfile !== "jarvis" || profilesBody.profiles?.length !== 1 || profilesBody.profiles[0]?.name !== "Jarvis Live" || profilesBody.profiles[0]?.palette !== "orange") {
    throw new Error(`Hermes single-profile default failed: ${JSON.stringify(profilesBody)}`);
  }

  const voiceCapabilities = await fetch(`${base}/api/hermes/voice/capabilities`, { headers: authHeaders });
  const voiceBody = await voiceCapabilities.json();
  if (!voiceCapabilities.ok || voiceBody.stt?.configured !== false || voiceBody.tts?.configured !== false) {
    throw new Error(`Voice fallback capabilities failed: ${JSON.stringify(voiceBody)}`);
  }

  const [hermesChat, claudeChat] = await Promise.all([
    fetch(`${base}/api/hermes/chat`, {
      method: "POST",
      headers: { ...authHeaders, "content-type": "application/json" },
      body: JSON.stringify({ message: "ping", messages: [{ role: "user", content: "ping" }] }),
    }),
    fetch(`${base}/api/claude/chat`, {
      method: "POST",
      headers: { ...authHeaders, "content-type": "application/json" },
      body: JSON.stringify({ message: "ping", messages: [{ role: "user", content: "ping" }] }),
    }),
  ]);
  if (!hermesChat.ok || !claudeChat.ok) {
    throw new Error(`Service chat failed: Hermes ${hermesChat.status}, Claude ${claudeChat.status}`);
  }
  const hermesChatBody = await hermesChat.json();
  if (hermesChatBody.profile !== "jarvis" || !hermesChatBody.session?.continuity) {
    throw new Error(`Hermes default profile/session failed: ${JSON.stringify(hermesChatBody)}`);
  }
  if (JSON.stringify(hermesChatBody).includes("jarvis-web-primary") || JSON.stringify(hermesChatBody).includes("agent:jarvis:web:dm:owner")) {
    throw new Error("Hermes session identifiers leaked to the browser response");
  }

  const routedChat = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ message: "router ping", messages: [{ role: "user", content: "router ping" }] }),
  });
  const routedChatBody = await routedChat.json();
  if (!routedChat.ok || routedChatBody.source !== "hermes" || routedChatBody.profile !== "jarvis") {
    throw new Error(`Hermes-first routing failed: ${JSON.stringify(routedChatBody)}`);
  }

  const secondaryProfile = await fetch(`${base}/api/hermes/chat`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ profile: "cadence-content", message: "cadence ping" }),
  });
  if (secondaryProfile.status !== 400) {
    throw new Error(`Hermes secondary profile should be disabled: ${secondaryProfile.status} ${await secondaryProfile.text()}`);
  }
  const invalidProfile = await fetch(`${base}/api/hermes/chat`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ profile: "../../outside", message: "reject me" }),
  });
  if (invalidProfile.status !== 400) {
    throw new Error(`Hermes profile allowlist failed: ${invalidProfile.status} ${await invalidProfile.text()}`);
  }
  if (
    hermesRequests.length !== 2 ||
    hermesRequests[0].url !== "/v1/chat/completions" ||
    hermesRequests[1].url !== "/v1/chat/completions" ||
    hermesRequests.some((request) => request.headers["x-hermes-session-id"] !== "jarvis-web-primary") ||
    hermesRequests.some((request) => request.headers["x-hermes-session-key"] !== "agent:jarvis:web:dm:owner") ||
    hermesRequests.some((request) => "profile" in request.body || "session_id" in request.body)
  ) {
    throw new Error(`Hermes upstream contract failed: ${JSON.stringify(hermesRequests)}`);
  }

  const session = await fetch(`${base}/api/session/9router`, {
    method: "POST",
    headers: { ...authHeaders, origin: "http://127.0.0.1:4173" },
  });
  const sessionBody = await session.json();
  const cookie = session.headers.get("set-cookie")?.split(";")[0] || "";
  if (!session.ok || !cookie || !sessionBody.dashboardUrl) {
    throw new Error(`Session failed: ${JSON.stringify(sessionBody)}`);
  }
  if (
    session.headers.get("access-control-allow-origin") !== "http://127.0.0.1:4173" ||
    session.headers.get("access-control-allow-credentials") !== "true"
  ) {
    throw new Error("Session response is missing credentialed CORS headers");
  }

  const dashboard = await fetch(`${base}/dashboard`, { headers: { cookie } });
  const dashboardBody = await dashboard.text();
  if (!dashboard.ok || !dashboardBody.includes("9Router ready")) {
    throw new Error(`Dashboard proxy failed: ${dashboard.status} ${dashboardBody}`);
  }
  if (dashboard.headers.get("x-frame-options")) {
    throw new Error("Dashboard proxy did not remove x-frame-options");
  }

  const nativeSettings = await fetch(`${base}/api/settings`, { headers: { cookie } });
  const nativeSettingsBody = await nativeSettings.json();
  if (!nativeSettings.ok || nativeSettingsBody.nativeAdmin !== true) {
    throw new Error(`Native management API proxy failed: ${JSON.stringify(nativeSettingsBody)}`);
  }

  console.log("Gateway smoke test passed: login session, live app config, workspace, terminal guards, Hermes metadata, routing and dashboard proxy.");
} finally {
  gateway.kill();
  upstream.close();
  await Promise.race([
    once(gateway, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
  rmSync(configDirectory, { recursive: true, force: true });
}
