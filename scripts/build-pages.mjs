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
    writeFileSync(indexPath, html);
  }
}

function publishSpideyOriginalSnapshot() {
  const source = join(root, "external", "spideytracker-snapshot", "after-interactions.html");
  const fallbackSource = join(root, "external", "spideytracker-snapshot", "rendered.html");
  const htmlSource = existsSync(source) ? source : fallbackSource;
  const target = join(root, "dist", "spideytracker");

  if (!existsSync(htmlSource)) return;

  mkdirSync(target, { recursive: true });
  const html = readFileSync(htmlSource, "utf8")
    .replaceAll('href="./_astro/', 'href="https://spideytracker.net/_astro/')
    .replaceAll('src="./_astro/', 'src="https://spideytracker.net/_astro/')
    .replaceAll('href="./images/', 'href="https://spideytracker.net/images/')
    .replaceAll('src="./images/', 'src="https://spideytracker.net/images/')
    .replaceAll('href="./fonts/', 'href="https://spideytracker.net/fonts/')
    .replaceAll('src="./fonts/', 'src="https://spideytracker.net/fonts/')
    .replaceAll('href="./data/', 'href="https://spideytracker.net/data/')
    .replaceAll('src="./data/', 'src="https://spideytracker.net/data/');

  writeFileSync(join(target, "index.html"), html);
}

function publishOriginalSubApps() {
  publishJavisOriginalDashboard();
  publishSpideyOriginalSnapshot();
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
