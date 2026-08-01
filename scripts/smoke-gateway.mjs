import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";

const gatewayPort = 18787;
const upstreamPort = 20129;
const token = "jcore-smoke-token";
const hermesRequests = [];

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
    JCORE_CORS_ORIGIN: "http://127.0.0.1:4173",
    HERMES_BASE_URL: `http://127.0.0.1:${upstreamPort}`,
    HERMES_HEALTH_URL: `http://127.0.0.1:${upstreamPort}/v1/models`,
    HERMES_CHAT_URL: `http://127.0.0.1:${upstreamPort}/v1/chat/completions`,
    HERMES_API_KEY: "hermes-smoke-api-key",
    HERMES_DEFAULT_PROFILE: "jarvis",
    HERMES_ALLOWED_PROFILES: "jarvis,cadence-content",
    HERMES_MULTIPLEX_PROFILES: "true",
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

  const cadenceChat = await fetch(`${base}/api/hermes/chat`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ profile: "cadence-content", message: "cadence ping" }),
  });
  if (!cadenceChat.ok) throw new Error(`Hermes multiplex profile failed: ${await cadenceChat.text()}`);
  const invalidProfile = await fetch(`${base}/api/hermes/chat`, {
    method: "POST",
    headers: { ...authHeaders, "content-type": "application/json" },
    body: JSON.stringify({ profile: "../../outside", message: "reject me" }),
  });
  if (invalidProfile.status !== 400) {
    throw new Error(`Hermes profile allowlist failed: ${invalidProfile.status} ${await invalidProfile.text()}`);
  }
  if (
    hermesRequests.length !== 3 ||
    hermesRequests[0].url !== "/v1/chat/completions" ||
    hermesRequests[2].url !== "/p/cadence-content/v1/chat/completions" ||
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

  console.log("Gateway smoke test passed: auth, Hermes-first profile/session routing, capabilities, credentialed dashboard session and native management API.");
} finally {
  gateway.kill();
  upstream.close();
  await Promise.race([
    once(gateway, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}
