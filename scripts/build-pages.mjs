import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const devIndex = join(root, "index.dev.html");
const deployIndex = join(root, "index.html");
const distIndex = join(root, "dist", "index.html");
const distAssets = join(root, "dist", "assets");
const deployAssets = join(root, "assets");
const previousIndex = existsSync(deployIndex) ? readFileSync(deployIndex, "utf8") : "";

try {
  copyFileSync(devIndex, deployIndex);
  const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
  const result = spawnSync(process.execPath, [viteBin, "build"], { cwd: root, env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    writeFileSync(deployIndex, previousIndex);
    process.exit(result.status ?? 1);
  }
  if (!existsSync(distIndex) || !existsSync(distAssets)) {
    writeFileSync(deployIndex, previousIndex);
    throw new Error("Vite build did not produce deploy artifacts.");
  }
  mkdirSync(deployAssets, { recursive: true });
  rmSync(deployAssets, { recursive: true, force: true });
  cpSync(distAssets, deployAssets, { recursive: true });
  copyFileSync(distIndex, deployIndex);
} catch (error) {
  writeFileSync(deployIndex, previousIndex);
  console.error(error);
  process.exit(1);
}
