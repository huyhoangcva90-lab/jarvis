import { spawn } from "node:child_process";
import { once } from "node:events";

const gatewayPort = 18887;
const env = {
  ...process.env,
  JCORE_GATEWAY_HOST: "127.0.0.1",
  JCORE_GATEWAY_PORT: String(gatewayPort),
  JCORE_AUTH_USERNAME: "prod-check",
  JCORE_AUTH_PASSWORD: "prod-check-password",
  JCORE_WEB_ROOT: "dist",
  HERMES_DASHBOARD_PROXY_PORT: "19121",
  OPENCLAW_DASHBOARD_PROXY_PORT: "19791",
  NINEROUTER_DASHBOARD_PROXY_PORT: "29130",
  JCORE_NATIVE_DASHBOARD_PROXY_HOST: "127.0.0.1",
  JCORE_CORS_ORIGIN: "",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const gateway = spawn(process.execPath, ["server/gateway.mjs"], {
  cwd: process.cwd(),
  env,
  stdio: ["ignore", "pipe", "pipe"],
});

let gatewayOutput = "";
gateway.stdout.on("data", (chunk) => { gatewayOutput += chunk; });
gateway.stderr.on("data", (chunk) => { gatewayOutput += chunk; });

try {
  const deadline = Date.now() + 5000;
  while (!gatewayOutput.includes("J-Core server")) {
    if (Date.now() > deadline) throw new Error(`JARVIS server did not start:\n${gatewayOutput}`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const base = `http://127.0.0.1:${gatewayPort}`;
  const shell = await fetch(`${base}/`);
  const shellText = await shell.text();
  assert(shell.ok && shellText.includes('id="root"'), `Production shell failed: ${shell.status}`);

  const scriptPath = shellText.match(/<script[^>]+src="([^"]+\.js)"/)?.[1]?.replace(/^\.\//, "/");
  assert(scriptPath, "Production shell did not reference a JavaScript asset");
  const script = await fetch(`${base}${scriptPath}`);
  const scriptText = await script.text();
  assert(script.ok && scriptText.includes("/api/auth/session"), `Production script asset failed: ${script.status}`);

  const unauthenticatedHealth = await fetch(`${base}/health`);
  assert(unauthenticatedHealth.status === 401, `Expected unauthenticated /health 401, received ${unauthenticatedHealth.status}`);

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-proto": "https",
    },
    body: JSON.stringify({ username: "prod-check", password: "prod-check-password" }),
  });
  const loginBody = await login.json();
  const setCookie = login.headers.get("set-cookie") || "";
  const authCookie = setCookie.split(";", 1)[0] || "";
  assert(login.ok && loginBody.authenticated && authCookie, `Login failed: ${JSON.stringify(loginBody)}`);
  assert(/HttpOnly/i.test(setCookie), "Auth cookie must be HttpOnly");
  assert(/Secure/i.test(setCookie), "Auth cookie must be Secure behind HTTPS forwarding");
  assert(/SameSite=Strict/i.test(setCookie), "Auth cookie must be SameSite=Strict behind HTTPS forwarding");

  const session = await fetch(`${base}/api/auth/session`, { headers: { cookie: authCookie } });
  const sessionBody = await session.json();
  assert(session.ok && sessionBody.authenticated && sessionBody.connection?.mode === "same-origin", `Session failed: ${JSON.stringify(sessionBody)}`);

  const health = await fetch(`${base}/health`, { headers: { cookie: authCookie } });
  const healthBody = await health.json();
  assert(health.ok && healthBody.gateway?.online && healthBody.services?.hermes, `Authenticated /health failed: ${JSON.stringify(healthBody)}`);

  const dashboards = await fetch(`${base}/api/native-dashboards`, { headers: { cookie: authCookie } });
  const dashboardBody = await dashboards.json();
  assert(dashboards.ok, `Native dashboard metadata failed: ${JSON.stringify(dashboardBody)}`);
  assert(Object.values(dashboardBody.dashboards || {}).every((url) => String(url).startsWith("/api/proxy/")), "Native dashboard URLs must remain behind authenticated same-origin proxy routes");

  console.log("Production serving check passed: dist assets, auth session, /health, and same-origin dashboard metadata.");
} finally {
  gateway.kill();
  await Promise.race([
    once(gateway, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}
