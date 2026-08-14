import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

function read(path) {
  const full = join(root, path);
  if (!existsSync(full)) {
    failures.push(`Missing ${path}`);
    return "";
  }
  return readFileSync(full, "utf8");
}

function expectIncludes(path, text, label = text) {
  const body = read(path);
  if (!body.includes(text)) failures.push(`${path} missing ${label}`);
}

function expectExcludes(path, text, label = text) {
  const body = read(path);
  if (body.includes(text)) failures.push(`${path} still contains ${label}`);
}

expectIncludes("src/components/orb/SpiderPersonalHub.tsx", "./spideytracker/index.html", "local Spidey clawweb route");
expectIncludes("src/components/orb/WorldMonitorHub.tsx", "./worldmonitor/index.html", "local World Monitor route");
expectExcludes("src/components/orb/WorldMonitorHub.tsx", "https://www.worldmonitor.app/dashboard", "external World Monitor redirect");
expectIncludes("scripts/build-pages.mjs", "publishWorldMonitorDashboard", "World Monitor publisher");
expectIncludes("scripts/build-pages.mjs", "jcore-spidey-free-map", "Spidey free-map injector");
expectIncludes("scripts/build-pages.mjs", "jcore-javis-auth-bypass", "Javis auth bypass patch");
expectIncludes("scripts/build-pages.mjs", "jcore-worldmonitor-local-pro", "World Monitor local pro patch");
expectExcludes("scripts/build-pages.mjs", "attributes: true", "attribute-observing MutationObserver");
expectIncludes("scripts/build-pages.mjs", "node.dataset.jcoreHidden === \"true\"", "idempotent Javis overlay hiding");
expectIncludes("src/App.tsx", "SESSION_CHECK_TIMEOUT_MS", "bounded auth session probe timeout");
expectIncludes("src/App.tsx", "AbortController", "abortable auth session probe");
expectIncludes("src/App.tsx", "jarvis.huykl.id.vn", "custom domain static-host detection");
expectIncludes("src/App.tsx", "isStaticShell", "static shell auth bypass");
expectIncludes("src/components/AuthScreen.jsx", "isStaticShell", "custom domain static login fallback");

if (existsSync(join(root, "dist", "spideytracker", "index.html"))) {
  expectIncludes("dist/spideytracker/index.html", "jcore-spidey-free-map", "built Spidey free-map marker");
  expectIncludes("dist/spideytracker/index.html", "maplibregl", "built Spidey MapLibre runtime");
}

if (existsSync(join(root, "dist", "javis-os", "index.html"))) {
  expectIncludes("dist/javis-os/index.html", "jcore-javis-auth-bypass", "built Javis auth bypass marker");
}

if (existsSync(join(root, "dist", "worldmonitor", "index.html"))) {
  expectIncludes("dist/worldmonitor/index.html", "jcore-worldmonitor-local-pro", "built World Monitor local pro marker");
  expectExcludes("dist/worldmonitor/index.html", "wm-pro-banner-reserved", "World Monitor pro banner reservation");
}

if (failures.length) {
  console.error("Local mode verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Local mode verification passed.");
