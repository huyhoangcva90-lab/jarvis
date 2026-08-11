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
