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
  if (typeof window === "undefined") return "orange";

  try {
    const raw = window.localStorage.getItem(ORB_UI_STORAGE_KEY);
    if (!raw) return "orange";
    const stored = JSON.parse(raw) as { palette?: unknown };
    if (!isEnergyPalette(stored.palette) || stored.palette === "world" || stored.palette === "javis") {
      saveStoredEnergyPalette("orange");
      return "orange";
    }
    return stored.palette;
  } catch {
    return "orange";
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
