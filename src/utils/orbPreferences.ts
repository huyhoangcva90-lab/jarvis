export const ORB_UI_STORAGE_KEY = "jarvis.commandOrb.v2";

export const ENERGY_PALETTES = [
  "gold",
  "blue",
  "green",
  "red",
  "violet",
  "orange",
  "spider",
] as const;

export type EnergyPalette = (typeof ENERGY_PALETTES)[number];

const ENERGY_PALETTE_SET = new Set<string>(ENERGY_PALETTES);

export function isEnergyPalette(value: unknown): value is EnergyPalette {
  return typeof value === "string" && ENERGY_PALETTE_SET.has(value);
}

export function loadStoredEnergyPalette(): EnergyPalette {
  if (typeof window === "undefined") return "gold";

  try {
    const raw = window.localStorage.getItem(ORB_UI_STORAGE_KEY);
    if (!raw) return "gold";
    const stored = JSON.parse(raw) as { palette?: unknown };
    return isEnergyPalette(stored.palette) ? stored.palette : "gold";
  } catch {
    return "gold";
  }
}

export function saveStoredEnergyPalette(palette: EnergyPalette) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(ORB_UI_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    window.localStorage.setItem(ORB_UI_STORAGE_KEY, JSON.stringify({ ...stored, palette }));
  } catch {
    window.localStorage.setItem(ORB_UI_STORAGE_KEY, JSON.stringify({ palette }));
  }
}
