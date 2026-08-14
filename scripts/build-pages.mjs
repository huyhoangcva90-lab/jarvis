import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const devIndex = join(root, "index.dev.html");
const deployIndex = join(root, "index.html");
const distIndex = join(root, "dist", "index.html");
const distDevIndex = join(root, "dist", "index.dev.html");
const distAssets = join(root, "dist", "assets");
const deployAssets = join(root, "assets");
const previousIndex = existsSync(deployIndex) ? readFileSync(deployIndex, "utf8") : "";

function pruneGeneratedAssetHistory(directory, currentFiles, generationsToKeep = 1) {
  const groups = new Map();
  const hashedAsset = /^(.*)-[A-Za-z0-9_-]{8,}\.(js|css|svg)$/;

  for (const name of readdirSync(directory)) {
    const match = name.match(hashedAsset);
    if (!match) continue;
    const key = `${match[1]}.${match[2]}`;
    const entries = groups.get(key) ?? [];
    entries.push({
      name,
      current: currentFiles.has(name),
      modifiedAt: statSync(join(directory, name)).mtimeMs,
    });
    groups.set(key, entries);
  }

  for (const entries of groups.values()) {
    entries.sort((left, right) => Number(right.current) - Number(left.current) || right.modifiedAt - left.modifiedAt);
    for (const stale of entries.slice(generationsToKeep)) {
      unlinkSync(join(directory, stale.name));
    }
  }
}

function publishJavisOriginalDashboard() {
  const source = join(root, "external", "javis-os", "dashboard");
  const target = join(root, "dist", "javis-os");
  const indexPath = join(target, "index.html");

  if (!existsSync(source)) return;

  cpSync(source, target, { recursive: true, force: true });

  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, "utf8")
      .replaceAll("/brand-logo", "./logo.png")
      .replaceAll("/static/", "./");
    writeFileSync(indexPath, patchJavisAuthBypass(html));
  }
}

function patchJavisAuthBypass(html) {
  const patch = `
<style id="jcore-javis-auth-bypass">
  #authOverlay,
  #setupWizard,
  .modal-overlay#authOverlay,
  .modal-overlay#setupWizard {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  body {
    min-height: 100dvh;
    overflow: hidden;
  }
</style>
<script id="jcore-javis-auth-bypass-runtime">
  (function () {
    try {
      localStorage.setItem("javis:jcore:auth-bypass", "true");
      localStorage.setItem("javis:auth:disabled", "true");
      sessionStorage.setItem("javis:jcore:local-session", "operator");
    } catch (error) {}

    var originalFetch = window.fetch ? window.fetch.bind(window) : null;
    if (originalFetch) {
      window.fetch = function (input, init) {
        var url = typeof input === "string" ? input : input && input.url ? input.url : "";
        if (/\\/(auth|setup)\\/(status|me|session)/.test(url) || /\\/api\\/(auth|setup)\\/(status|me|session)/.test(url)) {
          return Promise.resolve(new Response(JSON.stringify({
            ok: true,
            enabled: false,
            authenticated: true,
            configured: true,
            user: "operator",
            mode: "jcore-local"
          }), { status: 200, headers: { "content-type": "application/json" } }));
        }
        return originalFetch(input, init);
      };
    }

    function hideAuth() {
      document.querySelectorAll("#authOverlay,#setupWizard,.modal-overlay#authOverlay,.modal-overlay#setupWizard").forEach(function (node) {
        if (node.dataset.jcoreHidden === "true") return;
        node.dataset.jcoreHidden = "true";
        node.setAttribute("hidden", "");
        node.setAttribute("aria-hidden", "true");
        node.style.display = "none";
        node.style.visibility = "hidden";
        node.style.pointerEvents = "none";
      });
      document.documentElement.classList.add("jcore-javis-ungated");
      if (document.body) document.body.classList.add("jcore-javis-ungated");
    }

    document.addEventListener("DOMContentLoaded", function () {
      hideAuth();
      new MutationObserver(hideAuth).observe(document.documentElement, { childList: true, subtree: true });
    });
  })();
</script>`;
  return html.includes("</head>") ? html.replace("</head>", `${patch}</head>`) : `${patch}${html}`;
}

function publishWorldMonitorDashboard() {
  const source = join(root, "external", "worldmonitor");
  const builtSource = join(source, "dist");
  const publicSource = join(source, "public");
  const target = join(root, "dist", "worldmonitor");

  if (!existsSync(source)) return;
  mkdirSync(target, { recursive: true });

  if (existsSync(builtSource)) {
    cpSync(builtSource, target, { recursive: true, force: true });
    const indexPath = join(target, "index.html");
    if (existsSync(indexPath)) {
      writeFileSync(indexPath, patchWorldMonitorLocalPro(readFileSync(indexPath, "utf8")));
    }
    return;
  }

  if (existsSync(publicSource)) {
    cpSync(publicSource, target, { recursive: true, force: true });
  }
  writeFileSync(join(target, "index.html"), renderWorldMonitorLocalShell());
}

function patchWorldMonitorLocalPro(html) {
  const prepaintPatch = `
<style id="jcore-worldmonitor-local-pro">
  html,
  body,
  #app {
    height: 100dvh !important;
    min-height: 100dvh !important;
    overflow: hidden !important;
  }

  .pro-banner-slot,
  .pro-banner,
  [class*="pro-banner"],
  [data-testid*="pro-banner"],
  footer,
  .site-footer,
  .marketing-footer,
  [href*="/pro#pricing"],
  [href*="/pro"],
  [href*="pricing"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
</style>
<script id="jcore-worldmonitor-local-pro-runtime">
  (function () {
    try {
      localStorage.setItem("wm-entitlement-hint", "pro");
      localStorage.setItem("wm-pro-banner-launched-dismissed", String(Date.now()));
      localStorage.setItem("worldmonitor-theme", "dark");
      localStorage.setItem("worldmonitor-variant", "full");
    } catch (error) {}
    document.documentElement.classList.remove("wm-pro-banner-reserved");
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.variant = "full";
  })();
</script>`;

  return html
    .replaceAll("wm-pro-banner-reserved", "wm-pro-banner-disabled")
    .replaceAll("/favico/", "./favico/")
    .replaceAll('href="/', 'href="./')
    .replaceAll('src="/', 'src="./')
    .replace("</head>", `${prepaintPatch}</head>`);
}

function renderWorldMonitorLocalShell() {
  return `<!doctype html>
<html lang="en" data-theme="dark" data-variant="full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>World Monitor — J-Core Local Pro</title>
  <link rel="icon" href="./favico/favicon.ico">
  <style id="jcore-worldmonitor-local-pro">
    :root{color-scheme:dark;--green:#46ff86;--red:#ff4052;--bg:#050806;--panel:#0b130e;--line:#1e3b29}
    *{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:var(--bg);color:#e7eee9;font-family:"Cascadia Code",ui-monospace,monospace}
    body{background:radial-gradient(circle at 72% 24%,rgba(70,255,134,.13),transparent 28%),linear-gradient(145deg,#07100b,#020403 66%)}
    .wm-local{height:100dvh;display:grid;grid-template-columns:58px minmax(0,1fr) 360px}
    .wm-rail{display:grid;grid-template-rows:64px repeat(7,54px) 1fr;border-right:1px solid rgba(70,255,134,.24);background:#070c08}
    .wm-rail a,.wm-rail button{display:grid;place-items:center;color:#8da99a;border:0;border-bottom:1px solid #132219;background:transparent;text-decoration:none;font:800 10px/1 ui-monospace,monospace;cursor:pointer}
    .wm-rail a:first-child{color:#061109;background:var(--green);font-size:18px}.wm-rail a:hover,.wm-rail button:hover{color:#fff;background:#0f1a12}
    .wm-map{position:relative;overflow:hidden;background:#08120c}.wm-map:before{content:"";position:absolute;inset:-10%;background:url("./textures/earth-blue-marble.jpg") center/cover no-repeat;opacity:.38;filter:saturate(.88) contrast(1.08)}
    .wm-map:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(70,255,134,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(70,255,134,.05) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(circle at 50% 48%,#000 30%,transparent 78%)}
    .wm-globe{position:absolute;left:50%;top:50%;width:min(64vw,780px);aspect-ratio:1;translate:-50% -50%;border:1px solid rgba(70,255,134,.22);border-radius:50%;background:radial-gradient(circle at 39% 38%,rgba(255,255,255,.16),transparent 10%),radial-gradient(circle at 45% 45%,rgba(70,255,134,.22),transparent 34%),rgba(0,0,0,.14);box-shadow:0 0 90px rgba(70,255,134,.12),inset -60px -30px 90px rgba(0,0,0,.72)}
    .wm-scan{position:absolute;inset:7%;border-radius:50%;border:1px dashed rgba(70,255,134,.28);animation:spin 24s linear infinite}.wm-scan:nth-child(2){inset:17%;animation-duration:16s;animation-direction:reverse}.wm-scan:nth-child(3){inset:27%;animation-duration:10s}
    .wm-node{position:absolute;display:grid;gap:4px;padding:8px 10px;border:1px solid rgba(70,255,134,.35);background:rgba(5,12,8,.78);box-shadow:0 0 18px rgba(70,255,134,.08);font-size:9px}.wm-node b{color:var(--green)}.wm-node:nth-of-type(1){left:16%;top:20%}.wm-node:nth-of-type(2){right:18%;top:31%}.wm-node:nth-of-type(3){left:28%;bottom:22%}.wm-node:nth-of-type(4){right:24%;bottom:16%}
    .wm-top{position:absolute;left:22px;right:22px;top:18px;display:flex;justify-content:space-between;align-items:start;z-index:3}.wm-top h1{margin:0;color:#f5fff8;font:500 clamp(28px,4vw,58px)/.96 Georgia,serif;letter-spacing:-.04em}.wm-top span{display:block;margin-bottom:8px;color:var(--green);font-size:8px;letter-spacing:.22em}.wm-clock{color:#9fb8a9;font-size:10px;text-align:right}
    .wm-bottom{position:absolute;left:22px;right:22px;bottom:18px;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.wm-card{min-height:96px;padding:13px;border:1px solid #1e3b29;background:rgba(5,11,7,.82)}.wm-card small{color:#658776;font-size:7px;letter-spacing:.15em}.wm-card b{display:block;margin:16px 0 5px;color:#fff;font:500 23px Georgia,serif}.wm-card span{color:#93aa9c;font-size:9px}
    .wm-panel{display:grid;grid-template-rows:64px minmax(0,1fr) auto;border-left:1px solid rgba(70,255,134,.24);background:rgba(5,10,7,.96)}
    .wm-panel header{display:grid;gap:4px;padding:13px 16px;border-bottom:1px solid #183421}.wm-panel header small{color:var(--green);font-size:8px;letter-spacing:.18em}.wm-panel header b{font:600 15px Georgia,serif}
    .wm-feed{overflow:auto;padding:12px;display:grid;align-content:start;gap:9px}.wm-feed article{padding:12px;border:1px solid #193322;background:#09120c}.wm-feed small{color:#6f8e7d;font-size:7px}.wm-feed b{display:block;margin:7px 0;color:#eaffef;font-size:12px}.wm-feed p{margin:0;color:#9caf9f;font:10px/1.5 Inter,system-ui,sans-serif}
    .wm-chat{padding:12px;border-top:1px solid #183421}.wm-chat label{display:block;margin-bottom:7px;color:#6f8e7d;font-size:7px;letter-spacing:.16em}.wm-chat textarea{width:100%;height:74px;resize:none;padding:10px;color:#eaffef;border:1px solid #2a5136;background:#030604}.wm-chat button{width:100%;height:36px;margin-top:7px;color:#061109;border:0;background:var(--green);font-weight:900;cursor:pointer}
    @keyframes spin{to{transform:rotate(360deg)}}@media(max-width:960px){.wm-local{grid-template-columns:50px 1fr}.wm-panel{position:fixed;right:0;top:0;bottom:0;width:min(360px,calc(100vw - 50px));z-index:8}.wm-bottom{grid-template-columns:1fr 1fr}}
  </style>
  <script id="jcore-worldmonitor-local-pro-runtime">try{localStorage.setItem("wm-entitlement-hint","pro");localStorage.setItem("wm-pro-banner-launched-dismissed",String(Date.now()));}catch(error){}</script>
</head>
<body>
  <main class="wm-local" aria-label="World Monitor local pro dashboard">
    <nav class="wm-rail" aria-label="World Monitor sections"><a href="../" title="Back to J-Core">W</a><button>MAP</button><button>NEWS</button><button>RISK</button><button>MARKET</button><button>AIR</button><button>SEA</button><button>AI</button></nav>
    <section class="wm-map">
      <div class="wm-top"><div><span>WORLD MONITOR // LOCAL PRO</span><h1>Real-time global intelligence.</h1></div><div class="wm-clock" id="wm-clock">LOCAL</div></div>
      <div class="wm-globe"><i class="wm-scan"></i><i class="wm-scan"></i><i class="wm-scan"></i></div>
      <div class="wm-node"><b>CONFLICT</b><span>Live risk watch</span></div><div class="wm-node"><b>MARKETS</b><span>Commodity pressure</span></div><div class="wm-node"><b>INFRA</b><span>Cables / outages</span></div><div class="wm-node"><b>AVIATION</b><span>Flight anomaly layer</span></div>
      <div class="wm-bottom"><article class="wm-card"><small>COUNTRIES</small><b>190+</b><span>Coverage map</span></article><article class="wm-card"><small>FEEDS</small><b>500+</b><span>Curated sources</span></article><article class="wm-card"><small>MODE</small><b>PRO</b><span>Local entitlement</span></article><article class="wm-card"><small>AUTH</small><b>OFF</b><span>No login gate</span></article></div>
    </section>
    <aside class="wm-panel">
      <header><small>ANALYST RAIL</small><b>Ask J-Core about the world</b></header>
      <section class="wm-feed">
        <article><small>NEWS DIGEST</small><b>Global signal feed is ready for gateway data.</b><p>This local shell keeps World Monitor open without pricing, footer, or account blocks.</p></article>
        <article><small>OSINT</small><b>Map, conflict, market, aviation, maritime, and infrastructure modules are unlocked as local pro placeholders.</b><p>When the upstream repo is built into external/worldmonitor/dist, this publisher will copy that full app automatically.</p></article>
        <article><small>J-CORE</small><b>Left rail stays small, dashboard stays full-screen.</b><p>Use this side rail as the compact AI question surface.</p></article>
      </section>
      <form class="wm-chat" onsubmit="event.preventDefault(); alert('J-Core AI rail is local-ready; wire gateway chat next.');"><label>ASK AI</label><textarea placeholder="Ask about news, countries, conflict, markets..."></textarea><button>ASK J-CORE</button></form>
    </aside>
  </main>
  <script>setInterval(function(){var el=document.getElementById("wm-clock");if(el)el.textContent=new Date().toLocaleString();},1000);</script>
</body>
</html>`;
}

function publishSpideyOriginalSnapshot() {
  const source = join(root, "external", "spideytracker-snapshot", "after-interactions.html");
  const fallbackSource = join(root, "external", "spideytracker-snapshot", "rendered.html");
  const htmlSource = existsSync(source) ? source : fallbackSource;
  const assetsManifest = join(root, "external", "spideytracker-snapshot", "assets.json");
  const crawledFiles = join(root, "external", "spideytracker-snapshot", "files");
  const target = join(root, "dist", "spideytracker");

  if (!existsSync(htmlSource)) return;

  mkdirSync(target, { recursive: true });
  if (existsSync(crawledFiles)) {
    cpSync(crawledFiles, join(target, "files"), { recursive: true, force: true });
  }

  let html = readFileSync(htmlSource, "utf8");
  if (existsSync(assetsManifest) && existsSync(crawledFiles)) {
    const files = readdirSync(crawledFiles);
    const normalizedFiles = files.map((name) => ({ name, key: normalizeAssetKey(name) }));
    const assets = JSON.parse(readFileSync(assetsManifest, "utf8"));
    const replacements = new Map();

    for (const asset of assets) {
      const originalUrl = String(asset?.url || "");
      const localFile = findCrawledAsset(originalUrl, normalizedFiles);
      if (!originalUrl || !localFile) continue;
      replacements.set(originalUrl, `./files/${encodeURIComponent(localFile)}`);
    }

    for (const [originalUrl, localUrl] of [...replacements.entries()].sort((left, right) => right[0].length - left[0].length)) {
      html = html.replaceAll(originalUrl, localUrl);
      html = html.replaceAll(originalUrl.replaceAll("&", "&amp;"), localUrl);
    }
    const mainDataFile = findCrawledAsset("./data/main.json", normalizedFiles);
    if (mainDataFile) {
      const mainData = readFileSync(join(crawledFiles, mainDataFile), "utf8").replace(/<\/script/gi, "<\\/script");
      html = html.replace(
        "window.mainData = window.mainData || { init: siteInit };",
        `window.mainData = ${mainData};`
      );
    }
    rewriteSpideyCrawledCss(join(target, "files"), replacements);
    rewriteSpideyCrawledJs(join(target, "files"));
  }
  html = html
    .replace(/<!-- OneTrust Cookies Consent Notice start[\s\S]*?<!-- OneTrust Cookies Consent Notice end for spideytracker\.net -->/g, "")
    .replace(/<script src="\.\/files\/cdn\.cookielaw\.org_[^"]+"[^>]*><\/script>/g, "")
    .replace(/<style id="onetrust-style">[\s\S]*?<\/style>/g, "")
    .replace(/<div id="onetrust-consent-sdk"[\s\S]*?<\/div><\/body><\/html>$/g, "</body></html>")
    .replaceAll("javascript:OneTrust.ToggleInfoDisplay();", "#")
    .replaceAll('"./favicon.png"', '"https://spideytracker.net/favicon.png"')
    .replaceAll('"./images/', '"https://spideytracker.net/images/')
    .replaceAll("'./images/", "'https://spideytracker.net/images/");
  html = hideSpideyFooterBranding(html);
  html = injectSpideyFreeMap(html);

  writeFileSync(join(target, "index.html"), html);
}

function normalizeAssetKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function assetLookupKey(rawUrl) {
  const value = String(rawUrl || "");
  if (!value) return "";
  try {
    const parsed = new URL(value, "https://spideytracker.com/");
    return normalizeAssetKey(`${parsed.hostname}${parsed.pathname}`);
  } catch {
    return normalizeAssetKey(value);
  }
}

function findCrawledAsset(rawUrl, normalizedFiles) {
  const value = String(rawUrl || "");
  const keys = new Set([assetLookupKey(value)]);
  if (value.startsWith("./") || value.startsWith("/")) {
    try {
      const dotCom = new URL(value, "https://spideytracker.com/");
      const dotNet = new URL(value, "https://spideytracker.net/");
      keys.add(normalizeAssetKey(`${dotCom.hostname}${dotCom.pathname}`));
      keys.add(normalizeAssetKey(`${dotNet.hostname}${dotNet.pathname}`));
    } catch {
      // Ignore malformed optional fallback keys.
    }
  }
  const match = normalizedFiles.find((file) => [...keys].some((key) => key && file.key.startsWith(key)));
  return match?.name || "";
}

function rewriteSpideyCrawledCss(filesDirectory, replacements) {
  if (!existsSync(filesDirectory)) return;

  for (const file of readdirSync(filesDirectory)) {
    if (!file.endsWith(".css")) continue;
    const path = join(filesDirectory, file);
    let css = readFileSync(path, "utf8");

    for (const [originalUrl, localUrl] of replacements) {
      const localFileUrl = `./${localUrl.replace(/^\.\/files\//, "")}`;
      const rootUrl = originalUrl.replace(/^\.\//, "/");
      css = css
        .replaceAll(originalUrl, localFileUrl)
        .replaceAll(rootUrl, localFileUrl)
        .replaceAll(originalUrl.replaceAll("&", "&amp;"), localFileUrl)
        .replaceAll(rootUrl.replaceAll("&", "&amp;"), localFileUrl);
    }

    writeFileSync(path, css);
  }
}

function rewriteSpideyCrawledJs(filesDirectory) {
  if (!existsSync(filesDirectory)) return;

  const files = readdirSync(filesDirectory);
  const jsFiles = files.filter((file) => file.endsWith(".js"));
  const normalizedFiles = files.map((name) => ({ name, key: normalizeAssetKey(name) }));

  const findRelativeModule = (specifier, fromFile) => {
    const cleaned = specifier.replace(/^\.\//, "").split(/[?#]/)[0];
    const key = normalizeAssetKey(cleaned);
    if (!key) return "";

    const sameOriginPrefix = fromFile.startsWith("spideytracker.net_")
      ? "spideytracker.net_"
      : fromFile.startsWith("spideytracker.com_")
        ? "spideytracker.com_"
        : "";
    const sameOriginMatch = normalizedFiles.find((file) => (
      file.name.startsWith(sameOriginPrefix)
      && file.key.includes(key)
      && file.name.endsWith(cleaned.match(/\.[a-z0-9]+$/i)?.[0] || ".js")
    ));
    if (sameOriginMatch) return sameOriginMatch.name;

    const anyMatch = normalizedFiles.find((file) => file.key.includes(key));
    return anyMatch?.name || "";
  };

  const relativeModulePattern = /(?<quote>["'])(?<specifier>\.\/[^"']+?)(?<quoteEnd>["'])/g;
  for (const file of jsFiles) {
    const path = join(filesDirectory, file);
    let js = readFileSync(path, "utf8");
    js = js.replace(relativeModulePattern, (match, quote, specifier, quoteEnd) => {
      if (!/\.(?:js|css|json|png|jpg|jpeg|gif|svg|webp|woff2?|mp3|mp4|webm|mov)(?:[?#].*)?$/i.test(specifier)) {
        return match;
      }
      const localFile = findRelativeModule(specifier, file);
      return localFile ? `${quote}./${localFile}${quoteEnd}` : match;
    });
    writeFileSync(path, js);
  }
}

function hideSpideyFooterBranding(html) {
  const css = `
<style id="jcore-spidey-fullscreen">
  .site-footer {
    position: fixed !important;
    left: 50% !important;
    bottom: max(6px, env(safe-area-inset-bottom)) !important;
    z-index: 12 !important;
    width: auto !important;
    min-height: 0 !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    transform: translateX(-50%) !important;
    background: transparent !important;
    pointer-events: none !important;
  }

  .footer-content,
  .footer-logos,
  .footer-logos-main {
    display: flex !important;
    width: auto !important;
    min-height: 0 !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
  }

  .footer-logo {
    display: block !important;
    width: min(180px, 30vw) !important;
    height: auto !important;
    max-height: 52px !important;
    object-fit: contain !important;
    visibility: visible !important;
  }

  .footer-bottom,
  .footer-release-date,
  .footer-samsung,
  .footer-samsung-wrap,
  .footer-samsung-teaser-mode,
  .footer-legal,
  .footer-text,
  .footer-copyright,
  .footer-privacy-choices-group,
  .footer-privacy-link,
  .footer-credits,
  .footer-credits-toggle,
  .footer-credits__panel {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  .tracker-logo {
    cursor: pointer !important;
  }

  html,
  body {
    min-height: 100dvh !important;
    overflow: hidden !important;
  }
</style>`;
  const script = `
<script id="jcore-spidey-home-link">
  document.addEventListener("DOMContentLoaded", function () {
    var logo = document.querySelector(".tracker-logo");
    if (!logo) return;
    logo.setAttribute("role", "link");
    logo.setAttribute("tabindex", "0");
    logo.setAttribute("aria-label", "Back to J-Core home");
    function goHome() { window.location.href = "../"; }
    logo.addEventListener("click", goHome);
    logo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goHome();
      }
    });
  });
</script>`;
  const injection = `${css}${script}`;
  return html.includes("</head>") ? html.replace("</head>", `${injection}</head>`) : `${injection}${html}`;
}

function injectSpideyFreeMap(html) {
  const patch = `
<link id="jcore-spidey-maplibre-css" rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">
<style id="jcore-spidey-free-map-style">
  #jcore-spidey-free-map {
    position: absolute !important;
    inset: 0 !important;
    z-index: 0 !important;
    width: 100% !important;
    height: 100% !important;
    opacity: .98 !important;
    background: #08131f !important;
  }

  #map-vector,
  #map-vector-layer > :not(#jcore-spidey-free-map),
  .gm-style,
  .gmaps-pano-layer {
    opacity: 0 !important;
    pointer-events: none !important;
  }

  #map-view,
  #map-vector-layer,
  #map-pano-layer {
    position: relative !important;
  }

  .map-ui-overlays,
  .map-overlay,
  .map-hud-overlay,
  .spidey-pin-wrap,
  .main-ui-panel,
  .tracker-logo,
  .spidey-dangle {
    position: relative;
    z-index: 4 !important;
  }
</style>
<script id="jcore-spidey-free-map">
  (function () {
    function loadScript(src) {
      return new Promise(function (resolve, reject) {
        if (window.maplibregl) return resolve();
        var script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    function initFreeMap() {
      var host = document.getElementById("map-vector-layer") || document.getElementById("map-view") || document.body;
      if (!host || document.getElementById("jcore-spidey-free-map")) return;
      var container = document.createElement("div");
      container.id = "jcore-spidey-free-map";
      host.prepend(container);
      loadScript("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js").then(function () {
        if (!window.maplibregl) return;
        var map = new maplibregl.Map({
          container: container,
          center: [-73.9857, 40.7484],
          zoom: 10.8,
          minZoom: 2,
          maxZoom: 18,
          attributionControl: false,
          style: {
            version: 8,
            sources: {
              "carto-dark": {
                type: "raster",
                tiles: [
                  "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                  "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                  "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                ],
                tileSize: 256,
                attribution: "© OpenStreetMap © CARTO"
              }
            },
            layers: [{ id: "carto-dark", type: "raster", source: "carto-dark", paint: { "raster-opacity": .92 } }]
          }
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "bottom-right");
        window.jcoreSpideyMap = map;
      }).catch(function () {
        container.innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center;color:#e9f8ff;background:#08131f;font:700 12px monospace;letter-spacing:.12em">FREE MAP OFFLINE</div>';
      });
    }

    document.addEventListener("DOMContentLoaded", initFreeMap);
    window.addEventListener("load", initFreeMap);
  })();
</script>`;
  return html.includes("</head>") ? html.replace("</head>", `${patch}</head>`) : `${patch}${html}`;
}

function publishOriginalSubApps() {
  publishJavisOriginalDashboard();
  publishSpideyOriginalSnapshot();
  publishWorldMonitorDashboard();
}

try {
  copyFileSync(devIndex, deployIndex);
  const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
  const result = spawnSync(process.execPath, [viteBin, "build"], { cwd: root, env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    writeFileSync(deployIndex, previousIndex);
    process.exit(result.status ?? 1);
  }
  const builtIndex = existsSync(distIndex) ? distIndex : distDevIndex;
  if (!existsSync(builtIndex) || !existsSync(distAssets)) {
    writeFileSync(deployIndex, previousIndex);
    throw new Error("Vite build did not produce deploy artifacts.");
  }
  if (builtIndex !== distIndex) copyFileSync(builtIndex, distIndex);
  publishOriginalSubApps();
  mkdirSync(deployAssets, { recursive: true });
  const currentAssets = new Set(readdirSync(distAssets));
  cpSync(distAssets, deployAssets, { recursive: true, force: true });
  pruneGeneratedAssetHistory(deployAssets, currentAssets);
  copyFileSync(builtIndex, deployIndex);
} catch (error) {
  writeFileSync(deployIndex, previousIndex);
  console.error(error);
  process.exit(1);
}
