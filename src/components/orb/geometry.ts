import * as THREE from "three";
import { seeded } from "./materials";

export type RingSpec = {
  radius: number;
  tilt: number;
  yaw: number;
  roll: number;
  speed: number;
  opacity: number;
  segments: number;
};

export function makeBrokenRingGeometry(radius: number, parts: number, keep = 0.56) {
  const vertices: number[] = [];
  for (let i = 0; i < parts; i += 1) {
    const n = seeded(i * 9.13 + radius * 11.7);
    if (n > keep) continue;
    const start = (i / parts) * Math.PI * 2 + n * 0.04;
    const length = (Math.PI * 2 / parts) * (0.28 + n * 0.88);
    const steps = 4 + Math.floor(n * 6);
    for (let s = 0; s < steps; s += 1) {
      const a = start + (length * s) / steps;
      const b = start + (length * (s + 1)) / steps;
      vertices.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      vertices.push(Math.cos(b) * radius, Math.sin(b) * radius, 0);
    }
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
}

export function ellipsePoint(radius: number, tilt: number, angle: number, rotation: THREE.Euler) {
  const point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * tilt, 0);
  return point.applyEuler(rotation);
}

export function makeArcGeometry(radius: number, tilt: number, start: number, length: number, rotation: THREE.Euler, steps = 96) {
  const vertices: number[] = [];
  let previous = ellipsePoint(radius, tilt, start, rotation);
  for (let i = 1; i <= steps; i += 1) {
    const a = start + (length * i) / steps;
    const next = ellipsePoint(radius, tilt, a, rotation);
    vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
    previous = next;
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
}
