import * as THREE from "three";
import type { AiActivity } from "../../App";

export function activityEnergy(activity: AiActivity) {
  if (activity === "speaking") return 1.42;
  if (activity === "thinking") return 1.24;
  if (activity === "listening") return 0.78;
  return 1;
}

export function activitySpeed(activity: AiActivity) {
  if (activity === "speaking") return 1.7;
  if (activity === "thinking") return 1.28;
  if (activity === "listening") return 0.62;
  return 0.86;
}

export function activityPulse(activity: AiActivity, time: number, phase = 0) {
  const frequency = activity === "speaking" ? 8.4 : activity === "thinking" ? 4.6 : activity === "listening" ? 1.2 : 1.8;
  const amplitude = activity === "speaking" ? 0.12 : activity === "thinking" ? 0.065 : activity === "listening" ? 0.025 : 0.038;
  return 1 + Math.sin(time * frequency + phase) * amplitude;
}

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function segmentGeometry(segments: Array<[THREE.Vector3, THREE.Vector3]>) {
  const positions = new Float32Array(segments.length * 6);
  segments.forEach(([a, b], index) => {
    const offset = index * 6;
    positions[offset] = a.x;
    positions[offset + 1] = a.y;
    positions[offset + 2] = a.z;
    positions[offset + 3] = b.x;
    positions[offset + 4] = b.y;
    positions[offset + 5] = b.z;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

export function pathGeometry(paths: THREE.Vector3[][]) {
  const segments: Array<[THREE.Vector3, THREE.Vector3]> = [];
  paths.forEach((path) => {
    for (let index = 1; index < path.length; index += 1) {
      segments.push([path[index - 1], path[index]]);
    }
  });
  return segmentGeometry(segments);
}
