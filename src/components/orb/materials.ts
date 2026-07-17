import * as THREE from "three";

export const GOLD = new THREE.Color("#ffb83d");
export const HOT = new THREE.Color("#fff6cf");
export const AMBER = new THREE.Color("#ff7a1f");

export function additiveLine(color = GOLD, opacity = 0.5) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

export function seeded(seed: number) {
  const value = Math.sin(seed * 78.233 + 12.9898) * 43758.5453123;
  return value - Math.floor(value);
}
