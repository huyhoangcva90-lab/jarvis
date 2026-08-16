import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

globalThis.window = {
  location: {
    origin: "https://jarvis.example.test",
    protocol: "https:",
    hostname: "jarvis.example.test",
  },
};

const capturedFetches = [];
globalThis.fetch = async (url, options = {}) => {
  capturedFetches.push({ url: String(url), options });
  return {
    ok: true,
    headers: new Map([
      ["content-type", "application/json"],
      ["x-request-id", "self-hosted-check"],
    ]),
    async text() {
      return '{"ok":true}';
    },
  };
};

const [{ gatewayFetch, getGatewayConfig }, { defaultData }] = await Promise.all([
  import("../src/utils/gatewayClient.js"),
  import("../src/utils/storage.js"),
]);

const legacyBrowserState = {
  ...defaultData,
  auth: {},
  endpoints: {
    gateway: "https://legacy-gateway.example",
    gatewayToken: "legacy-token",
  },
};

const config = getGatewayConfig(legacyBrowserState);
assert(config.sameOrigin === true, "gateway client must default to same-origin mode");
assert(config.token === "", "gateway client must not expose or send a browser gateway token");

await gatewayFetch(legacyBrowserState, "/health", { method: "GET" });
assert(capturedFetches.length === 1, "gatewayFetch should perform one request");
assert(capturedFetches[0].url === "/health", `gatewayFetch should use a relative URL, received ${capturedFetches[0].url}`);
assert(!("authorization" in capturedFetches[0].options.headers), "gatewayFetch must not send browser Authorization headers");

assert(!("gatewayToken" in (defaultData.endpoints || {})), "default browser state must not include a gateway token");
assert(!defaultData.endpoints?.gateway, "default browser state must not require a gateway URL");

const forbiddenBundleTerms = [
  "JCORE_GATEWAY_TOKEN",
  "HERMES_API_KEY",
  "OPENCLAW_API_KEY",
  "NINEROUTER_API_KEY",
  "CLAUDE_API_KEY",
  "jarvisidhuykl.huykl.id.vn",
];

const sourceText = [
  readFileSync("src/utils/gatewayClient.js", "utf8"),
  readFileSync("src/utils/storage.js", "utf8"),
  readFileSync("src/App.tsx", "utf8"),
  readFileSync("src/components/AuthScreen.jsx", "utf8"),
].join("\n");

for (const term of forbiddenBundleTerms) {
  assert(!sourceText.includes(term), `frontend source contains forbidden production term: ${term}`);
}

try {
  const distFiles = readdirSync("dist/assets", { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(js|css)$/.test(entry.name))
    .map((entry) => join("dist/assets", entry.name));
  const distText = distFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  for (const term of forbiddenBundleTerms) {
    assert(!distText.includes(term), `frontend bundle contains forbidden production term: ${term}`);
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

console.log("Self-hosted contract check passed: relative API paths, no browser gateway token, no bundled service secrets.");
