import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const distIndex = join(root, "dist", "index.html");
const distDevIndex = join(root, "dist", "index.dev.html");
const distAssets = join(root, "dist", "assets");

// (javis-os dashboard publisher removed — submodule deleted)


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
  publishSpideyOriginalSnapshot();
}

try {
  const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
  const result = spawnSync(process.execPath, [viteBin, "build"], { cwd: root, env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  const builtIndex = existsSync(distIndex) ? distIndex : distDevIndex;
  if (!existsSync(builtIndex) || !existsSync(distAssets)) {
    throw new Error("Vite build did not produce deploy artifacts.");
  }
  if (builtIndex !== distIndex) copyFileSync(builtIndex, distIndex);
  publishOriginalSubApps();
} catch (error) {
  console.error(error);
  process.exit(1);
}
