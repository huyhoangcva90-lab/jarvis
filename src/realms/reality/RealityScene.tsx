import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AiActivity } from "../../App";
import { activityEnergy, activityPulse, activitySpeed, seededRandom } from "../shared/coreMotion";

// ============================================================================
// MCU RED AETHER STONE — FAITHFUL CONCEPT ART PALETTE
// Reference: Dark cloud with selective red glow, NOT a bright red ball
// ============================================================================
const VOID_BLACK = "#050002";
const DARK_MATTER = "#180006";
const CHARRED_METAL = "#1f0a10";
const BLOOD_CRIMSON = "#8b001a";
const BLAZING_RED = "#d81b3a";
const SCARLET_ENERGY = "#ff2a4d";
const HOT_CORE_PINK = "#ffa8b8";
const WHITE_HOT = "#ffffff";
const RUNIC_GOLD = "#ffc04d";

// ============================================================================
// GLSL — SIMPLEX 3D NOISE (shared)
// ============================================================================
const SIMPLEX_3D = /* glsl */ `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// ============================================================================
// GLSL — DARK AETHER CLOUD (NormalBlending — mostly DARK, red glow at edges)
// This is the KEY difference: reference shows dark storm, not bright red ball
// ============================================================================
const darkCloudVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying float vNoise;
  ${SIMPLEX_3D}
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    // Cyclone twist
    float tw = uTime * 1.2 + position.y * 2.5;
    float ca = cos(tw * 0.15), sa = sin(tw * 0.15);
    vec3 twisted = vec3(position.x*ca - position.z*sa, position.y, position.x*sa + position.z*ca);
    float n1 = snoise(twisted * 2.0 + vec3(0.0, uTime*0.8, uTime*0.5));
    float n2 = snoise(twisted * 3.5 - vec3(uTime*1.0, uTime*0.4, 0.0)) * 0.5;
    float n3 = snoise(twisted * 6.0 + vec3(uTime*1.4, 0.0, uTime*0.8)) * 0.25;
    float totalNoise = n1 + n2 + n3;
    vNoise = totalNoise;
    float displacement = totalNoise * 0.35 * (0.8 + uEnergy * 0.6);
    float taper = 1.0 - smoothstep(0.35, 1.5, abs(position.y)) * 0.4;
    vec3 displaced = position + normal * displacement * taper;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDirection = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// DARK cloud fragment — mostly black, red glow only at edges/veins
const darkCloudFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying float vNoise;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDirection);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);

    // Dark matter veins (thick black channels absorbing light)
    float swirl = sin(vPosition.y * 8.0 + vPosition.x * 6.0 + uTime * 2.5);
    float veins = pow(abs(sin(vPosition.z * 12.0 + swirl * 2.0 - uTime * 2.0 + vNoise * 3.0)), 5.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + vPosition.y * 5.0);

    // Predominantly DARK base — matching concept art
    vec3 voidBlack = vec3(0.015, 0.0, 0.006);
    vec3 darkMaroon = vec3(0.08, 0.0, 0.018);
    vec3 deepCrimson = vec3(0.35, 0.02, 0.06);
    vec3 hotEdge = vec3(0.7, 0.04, 0.12);

    // Build up from dark base
    vec3 color = mix(voidBlack, darkMaroon, 0.3 + vNoise * 0.2);
    // Veins create even DARKER channels (absorbing light)
    color = mix(color, voidBlack, veins * 0.7);
    // Fresnel edge glow — only edges get bright
    color = mix(color, deepCrimson, fresnel * 0.55);
    color = mix(color, hotEdge, pow(fresnel, 3.5) * 0.5);
    // Subtle inner pulse
    color += deepCrimson * pulse * 0.08 * (1.0 - veins);

    // Semi-opaque dark cloud (NOT additive)
    float alpha = (0.82 + fresnel * 0.18) * (0.8 + uEnergy * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

// BRIGHT inner core fragment — additive glow from the heart of the storm
const brightCoreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying float vNoise;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDirection);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 5.0 + vPosition.y * 7.0);

    vec3 crimson = vec3(0.9, 0.06, 0.18);
    vec3 hotPink = vec3(1.0, 0.6, 0.72);

    vec3 color = mix(crimson, hotPink, fresnel * 0.6 + pulse * 0.2);
    float coreDist = length(vPosition);
    float innerGlow = 1.0 - smoothstep(0.0, 0.6, coreDist);
    color = mix(color, vec3(1.0, 0.9, 0.95), innerGlow * 0.5);

    float alpha = (fresnel * 0.4 + innerGlow * 0.5 + pulse * 0.1) * 0.55 * (0.7 + uEnergy * 0.4);
    gl_FragColor = vec4(color * (1.2 + uEnergy * 0.5), alpha);
  }
`;

// ============================================================================
// GLSL — RUNIC OVERLAY SHELL (projected on sphere surface — VFX Layer 4)
// "RUNIC PATTERN OVERLAY (Reality Anchor)" from the concept VFX breakdown
// ============================================================================
const runicOverlayVertexShader = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDirection = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const runicOverlayFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  float hash(float n) { return fract(sin(n * 127.1 + 7.3) * 43758.5453); }

  // Procedural rune glyph (same generator as mandala)
  float runeGlyph(vec2 uv, float id) {
    float h1 = hash(id);
    float h2 = hash(id + 31.7);
    float h3 = hash(id + 59.3);
    float h4 = hash(id + 97.1);
    float x = uv.x * 2.0;
    float y = uv.y;
    float g = 0.0;
    float staveX = (h1 - 0.5) * 0.25;
    g += smoothstep(0.14, 0.0, abs(x - staveX)) * step(0.1, y) * step(y, 0.9);
    float brDir = sign(h3 - 0.5);
    g += smoothstep(0.12, 0.0, abs(x - staveX - brDir * (y - 0.72) * 2.2)) * step(0.58, y) * step(y, 0.88) * step(0.25, h2);
    g += smoothstep(0.12, 0.0, abs(x - staveX - brDir * (y - 0.38) * 2.2)) * step(0.22, y) * step(y, 0.52) * step(0.45, h3);
    g += smoothstep(0.10, 0.0, abs(y - (0.3 + h2 * 0.4))) * step(abs(x), 0.35) * step(0.35, h4);
    float diagDir = sign(h4 - 0.5);
    g += smoothstep(0.12, 0.0, abs(x - staveX - diagDir * (y - 0.5) * 1.8)) * step(0.15, y) * step(y, 0.85) * step(0.30, h1 * h3);
    g += smoothstep(0.12, 0.0, abs(x - staveX + diagDir * (y - 0.5) * 1.8)) * step(0.15, y) * step(y, 0.85) * step(0.6, h2 * h4);
    float dCenter = 0.5 + (h2 - 0.5) * 0.2;
    float diamond = abs(x - staveX) * 0.9 + abs(y - dCenter) * 1.4;
    g += (smoothstep(0.42, 0.36, diamond) - smoothstep(0.34, 0.28, diamond)) * step(0.72, h1);
    g += smoothstep(0.10, 0.0, length(vec2(x - staveX + brDir * 0.25, y - 0.78))) * step(0.65, h3);
    return clamp(g, 0.0, 1.0);
  }

  // Distance to line segment
  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    // Spherical UV from position
    float theta = atan(vPosition.z, vPosition.x);
    float phi = acos(clamp(vPosition.y / length(vPosition), -1.0, 1.0));
    float u = (theta + 3.14159) / 6.28318;
    float v = phi / 3.14159;

    // Map to polar for circular patterns
    vec2 centered = vec2(u - 0.5, v - 0.5) * 2.0;
    float r = length(centered);
    float a = atan(centered.y, centered.x);

    float pattern = 0.0;

    // ── Concentric structural rings ──
    pattern += smoothstep(0.014, 0.0, abs(r - 0.88)) * 0.9;
    pattern += smoothstep(0.010, 0.0, abs(r - 0.72)) * 0.7;
    pattern += smoothstep(0.012, 0.0, abs(r - 0.52)) * 0.6;
    pattern += smoothstep(0.010, 0.0, abs(r - 0.35)) * 0.5;

    // ── Pentagram (5-pointed star) — key missing element from concept art ──
    float starR = 0.52;
    for (int i = 0; i < 5; i++) {
      float a1 = float(i) * 1.2566 - 1.5708 + uTime * 0.03;
      float a2 = float(i) * 1.2566 + 2.5133 - 1.5708 + uTime * 0.03;
      vec2 p1 = vec2(cos(a1), sin(a1)) * starR;
      vec2 p2 = vec2(cos(a2), sin(a2)) * starR;
      float d = sdSegment(centered, p1, p2);
      pattern += smoothstep(0.025, 0.0, d) * 0.8;
    }
    // Pentagon outline
    for (int i = 0; i < 5; i++) {
      float a1 = float(i) * 1.2566 - 1.5708 + uTime * 0.03;
      float a2 = float(i + 1) * 1.2566 - 1.5708 + uTime * 0.03;
      vec2 p1 = vec2(cos(a1), sin(a1)) * starR;
      vec2 p2 = vec2(cos(a2), sin(a2)) * starR;
      float d = sdSegment(centered, p1, p2);
      pattern += smoothstep(0.018, 0.0, d) * 0.5;
    }

    // ── Rune glyphs in outer ring ──
    float numGlyphs = 16.0;
    float normalizedAngle = (a + 3.14159) / 6.28318;
    {
      float segId = floor(normalizedAngle * numGlyphs);
      float segFrac = fract(normalizedAngle * numGlyphs);
      float inBand = step(0.72, r) * step(r, 0.88);
      float localY = (r - 0.72) / 0.16;
      float glyph = runeGlyph(vec2(segFrac - 0.5, localY), segId + 500.0) * inBand;
      float flicker = 0.5 + 0.5 * sin(uTime * 2.0 + segId * 1.93);
      pattern += glyph * flicker * 0.7;
    }

    // ── 8 radial spokes ──
    pattern += smoothstep(0.02, 0.0, abs(sin(a * 4.0))) * step(0.2, r) * step(r, 0.88) * 0.35;

    // ── Scanning beam ──
    float scanAngle = mod(uTime * 0.6, 6.28318) - 3.14159;
    float scan = smoothstep(0.25, 0.0, abs(a - scanAngle)) * step(0.1, r) * step(r, 0.9);
    pattern += scan * 0.4;

    // ── Fresnel fade (only visible at glancing angles) ──
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 1.5);

    vec3 col = mix(vec3(0.8, 0.04, 0.12), vec3(1.0, 0.5, 0.15), pattern * 0.3 + scan * 0.5);
    float alpha = pattern * (0.15 + fresnel * 0.25) * (0.6 + uEnergy * 0.5);

    // Fade at poles
    float poleFade = smoothstep(0.0, 0.15, min(v, 1.0 - v));
    alpha *= poleFade;

    gl_FragColor = vec4(col * (1.5 + uEnergy * 0.5), alpha);
  }
`;

// ============================================================================
// GLSL — RUNIC MANDALA (Floor & Back Halo) with PENTAGRAM
// ============================================================================
const runicMandalaFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n * 127.1 + 7.3) * 43758.5453); }

  float runeGlyph(vec2 uv, float id) {
    float h1 = hash(id), h2 = hash(id+31.7), h3 = hash(id+59.3), h4 = hash(id+97.1);
    float x = uv.x * 2.0, y = uv.y, g = 0.0;
    float sx = (h1 - 0.5) * 0.3;
    g += smoothstep(0.14, 0.0, abs(x - sx)) * step(0.08, y) * step(y, 0.92);
    float bd = sign(h3 - 0.5);
    g += smoothstep(0.12, 0.0, abs(x - sx - bd*(y-0.72)*2.2)) * step(0.58,y) * step(y,0.88) * step(0.25,h2);
    g += smoothstep(0.12, 0.0, abs(x - sx - bd*(y-0.38)*2.2)) * step(0.22,y) * step(y,0.52) * step(0.45,h3);
    g += smoothstep(0.10, 0.0, abs(y - (0.3+h2*0.4))) * step(abs(x), 0.38) * step(0.35, h4);
    float dd = sign(h4-0.5);
    g += smoothstep(0.12, 0.0, abs(x-sx-dd*(y-0.5)*1.8)) * step(0.15,y)*step(y,0.85)*step(0.3,h1*h3);
    g += smoothstep(0.12, 0.0, abs(x-sx+dd*(y-0.5)*1.8)) * step(0.15,y)*step(y,0.85)*step(0.6,h2*h4);
    float dc = 0.5+(h2-0.5)*0.2;
    float dm = abs(x-sx)*0.9+abs(y-dc)*1.4;
    g += (smoothstep(0.42,0.36,dm)-smoothstep(0.34,0.28,dm))*step(0.72,h1);
    g += smoothstep(0.10, 0.0, length(vec2(x-sx+bd*0.25, y-0.78)))*step(0.65,h3);
    return clamp(g, 0.0, 1.0);
  }

  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p-a, ba = b-a;
    float t = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*t);
  }

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    if (r > 1.0) discard;

    float na = (a + 3.14159) / 6.28318;
    float pattern = 0.0;

    // ── Structural rings ──
    pattern += smoothstep(0.016, 0.0, abs(r - 0.97)) * 1.2;
    pattern += smoothstep(0.012, 0.0, abs(r - 0.81));
    pattern += smoothstep(0.014, 0.0, abs(r - 0.69));
    pattern += smoothstep(0.010, 0.0, abs(r - 0.55));
    pattern += smoothstep(0.012, 0.0, abs(r - 0.42));
    pattern += smoothstep(0.010, 0.0, abs(r - 0.30));
    pattern += smoothstep(0.020, 0.0, abs(r - 0.15));

    // ── PENTAGRAM (inscribed star — from concept art) ──
    float starR = 0.42;
    float starOffset = uTime * 0.04;
    for (int i = 0; i < 5; i++) {
      float a1 = float(i) * 1.2566 - 1.5708 + starOffset;
      float a2 = float(i) * 1.2566 + 2.5133 - 1.5708 + starOffset;
      vec2 p1 = vec2(cos(a1), sin(a1)) * starR;
      vec2 p2 = vec2(cos(a2), sin(a2)) * starR;
      float d = sdSegment(p * 2.0, p1, p2);
      pattern += smoothstep(0.028, 0.0, d) * 0.85;
    }
    // Pentagon outline
    for (int i = 0; i < 5; i++) {
      float a1 = float(i) * 1.2566 - 1.5708 + starOffset;
      float a2 = float(i+1) * 1.2566 - 1.5708 + starOffset;
      vec2 p1 = vec2(cos(a1), sin(a1)) * starR;
      vec2 p2 = vec2(cos(a2), sin(a2)) * starR;
      float d = sdSegment(p * 2.0, p1, p2);
      pattern += smoothstep(0.022, 0.0, d) * 0.55;
    }
    // Pentagram vertex dots
    for (int i = 0; i < 5; i++) {
      float ang = float(i) * 1.2566 - 1.5708 + starOffset;
      vec2 pt = vec2(cos(ang), sin(ang)) * starR;
      pattern += smoothstep(0.05, 0.0, length(p * 2.0 - pt)) * 1.2;
    }

    // ── Outer rune ring (18 glyphs) ──
    { float ng = 18.0;
      float segId = floor(na * ng);
      float segFrac = fract(na * ng);
      float inBand = step(0.81, r) * step(r, 0.97);
      float localY = (r - 0.81) / 0.16;
      float glyph = runeGlyph(vec2(segFrac - 0.5, localY), segId + 100.0) * inBand;
      float flicker = 0.6 + 0.4 * sin(uTime * 2.5 + segId * 1.73);
      pattern += glyph * flicker;
    }

    // ── Middle rune ring (24 glyphs) ──
    { float ng = 24.0;
      float segId = floor(na * ng);
      float segFrac = fract(na * ng);
      float inBand = step(0.55, r) * step(r, 0.69);
      float localY = (r - 0.55) / 0.14;
      float glyph = runeGlyph(vec2(segFrac - 0.5, localY), segId + 200.0) * inBand;
      float flicker = 0.5 + 0.5 * sin(uTime * 1.8 + segId * 2.17);
      pattern += glyph * flicker * 0.85;
    }

    // ── Inner rune ring (12 glyphs) ──
    { float ng = 12.0;
      float segId = floor(na * ng);
      float segFrac = fract(na * ng);
      float inBand = step(0.30, r) * step(r, 0.42);
      float localY = (r - 0.30) / 0.12;
      float glyph = runeGlyph(vec2(segFrac - 0.5, localY), segId + 300.0) * inBand;
      float flicker = 0.55 + 0.45 * sin(uTime * 3.2 + segId * 3.51);
      pattern += glyph * flicker * 0.75;
    }

    // ── 8-pointed star spokes ──
    pattern += smoothstep(0.018, 0.0, abs(sin(a*4.0))) * step(0.15,r) * step(r,0.97) * 0.55;
    // ── 16 fine inner spokes ──
    pattern += smoothstep(0.012, 0.0, abs(sin(a*8.0))) * step(0.30,r) * step(r,0.69) * 0.3;

    // ── Center sigil ──
    pattern += (smoothstep(0.065, 0.05, r) - smoothstep(0.04, 0.025, r)) * 1.5;
    pattern += smoothstep(0.02, 0.0, r) * 1.5;

    // ── Scanning beam ──
    float scanAngle = mod(uTime * 0.5, 6.28318) - 3.14159;
    float scan = smoothstep(0.18, 0.0, abs(a - scanAngle)) * step(0.08,r) * step(r,0.97);
    pattern += scan * 0.5;

    // ── Energy ripples ──
    float waves = 0.5 + 0.5 * sin(uTime * 4.5 - r * 16.0);

    vec3 col = mix(uColor, uHotColor, pattern * 0.55 + scan * 0.6 + waves * 0.15);
    float alpha = pattern * (0.45 + waves * 0.35) * (0.8 + uEnergy * 0.45);
    alpha *= smoothstep(1.0, 0.90, r);
    gl_FragColor = vec4(col * (1.4 + uEnergy * 0.6), alpha);
  }
`;

// ============================================================================
// 3D COMPONENTS
// ============================================================================

// 1. Aether Storm Core — DARK cloud with bright inner glow
function AetherStormCore({ activity }: { activity: AiActivity }) {
  const coreRef = useRef<THREE.Group>(null);
  const darkMat = useRef<THREE.ShaderMaterial>(null);
  const brightMat = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime, speed = activitySpeed(activity);
    const energy = activityEnergy(activity), pulse = activityPulse(activity, t, 0.7);
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25 * speed;
      coreRef.current.position.y = Math.sin(t * 0.9) * 0.04;
      coreRef.current.scale.set(1.0 * pulse, 1.42 * pulse, 1.0 * pulse);
    }
    if (darkMat.current) { darkMat.current.uniforms.uTime.value = t; darkMat.current.uniforms.uEnergy.value = energy; }
    if (brightMat.current) { brightMat.current.uniforms.uTime.value = t * 1.3; brightMat.current.uniforms.uEnergy.value = energy * 1.2; }
  });

  return (
    <group ref={coreRef} name="aether-storm-core">
      {/* OUTER: Dark volumetric cloud (NormalBlending — DARK, not bright) */}
      <mesh>
        <icosahedronGeometry args={[0.95, 36]} />
        <shaderMaterial ref={darkMat} vertexShader={darkCloudVertexShader} fragmentShader={darkCloudFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          depthWrite={false} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* INNER: Bright additive core glow (shining through the dark cloud) */}
      <mesh scale={0.65}>
        <icosahedronGeometry args={[0.92, 24]} />
        <shaderMaterial ref={brightMat} vertexShader={darkCloudVertexShader} fragmentShader={brightCoreFragmentShader}
          uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
          blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </mesh>
      {/* Blazing singularity eye */}
      <mesh scale={0.15}>
        <octahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color={WHITE_HOT} toneMapped={false} />
      </mesh>
      <pointLight color={BLAZING_RED} distance={8} intensity={4.5} />
      <pointLight color={HOT_CORE_PINK} distance={3} intensity={3.5} />
    </group>
  );
}

// 2. Runic Overlay Shell (VFX Layer 4 — "RUNIC PATTERN OVERLAY")
function RunicOverlayShell({ activity }: { activity: AiActivity }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime, energy = activityEnergy(activity);
    if (mat.current) { mat.current.uniforms.uTime.value = t; mat.current.uniforms.uEnergy.value = energy; }
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.04 * activitySpeed(activity);
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.12, 1.58, 1.12]} name="runic-overlay-shell">
      <icosahedronGeometry args={[0.96, 24]} />
      <shaderMaterial ref={mat} vertexShader={runicOverlayVertexShader} fragmentShader={runicOverlayFragmentShader}
        uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 } }}
        blending={THREE.AdditiveBlending} depthWrite={false} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// 3. Containment Frame (Curved Obsidian Talons + Floating Shards)
function ContainmentFrame({ activity }: { activity: AiActivity }) {
  const frameRef = useRef<THREE.Group>(null);
  const shardsRef = useRef<THREE.Group>(null);

  const outerClaws = useMemo(() => [
    { angle: 0, scaleY: 1.45, tiltZ: 0.12, radius: 1.42 },
    { angle: Math.PI / 3, scaleY: 1.25, tiltZ: -0.08, radius: 1.36 },
    { angle: (2 * Math.PI) / 3, scaleY: 1.42, tiltZ: 0.10, radius: 1.40 },
    { angle: Math.PI, scaleY: 1.48, tiltZ: -0.12, radius: 1.44 },
    { angle: (4 * Math.PI) / 3, scaleY: 1.28, tiltZ: 0.08, radius: 1.38 },
    { angle: (5 * Math.PI) / 3, scaleY: 1.40, tiltZ: -0.10, radius: 1.41 },
  ], []);

  const shards = useMemo(() => [
    { pos: [0, 1.85, 0] as [number,number,number], rot: [0.1, 0.2, 0.4] as [number,number,number], scale: [0.12, 0.38, 0.08] as [number,number,number] },
    { pos: [0.25, 1.65, 0.18] as [number,number,number], rot: [-0.2, 0.4, -0.3] as [number,number,number], scale: [0.08, 0.26, 0.06] as [number,number,number] },
    { pos: [-0.22, 1.72, -0.15] as [number,number,number], rot: [0.3, -0.1, 0.2] as [number,number,number], scale: [0.09, 0.30, 0.07] as [number,number,number] },
    { pos: [0, -1.65, 0] as [number,number,number], rot: [0, 0, Math.PI] as [number,number,number], scale: [0.10, 0.42, 0.07] as [number,number,number] },
    { pos: [0.18, -1.48, -0.12] as [number,number,number], rot: [0.2, 0, Math.PI - 0.2] as [number,number,number], scale: [0.07, 0.25, 0.05] as [number,number,number] },
    { pos: [-0.15, -1.55, 0.10] as [number,number,number], rot: [-0.1, 0.3, Math.PI + 0.15] as [number,number,number], scale: [0.06, 0.22, 0.05] as [number,number,number] },
  ], []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime, speed = activitySpeed(activity), energy = activityEnergy(activity);
    if (frameRef.current) {
      frameRef.current.rotation.y += delta * 0.06 * speed;
      const flex = 1.0 + Math.sin(t * 1.8) * 0.025 * energy;
      frameRef.current.scale.set(flex, 1.0, flex);
    }
    if (shardsRef.current) {
      shardsRef.current.rotation.y -= delta * 0.12 * speed;
      shardsRef.current.position.y = Math.sin(t * 1.4) * 0.04;
    }
  });

  return (
    <group name="containment-frame">
      <group ref={frameRef}>
        {outerClaws.map((claw, i) => {
          const x = Math.cos(claw.angle) * claw.radius;
          const z = Math.sin(claw.angle) * claw.radius;
          return (
            <group key={i} position={[x, 0, z]} rotation={[0, -claw.angle + Math.PI / 2, claw.tiltZ]}>
              <mesh scale={[0.12, claw.scaleY * 1.35, 0.28]}>
                <coneGeometry args={[1, 2, 4]} />
                <meshStandardMaterial color={CHARRED_METAL} emissive={BLOOD_CRIMSON} emissiveIntensity={0.7} metalness={0.92} roughness={0.22} />
              </mesh>
              <mesh position={[0, claw.scaleY * 1.05, -0.22]} rotation={[-0.82, 0, 0]} scale={[0.08, 0.55, 0.18]}>
                <coneGeometry args={[1, 2, 4]} />
                <meshStandardMaterial color={DARK_MATTER} emissive={SCARLET_ENERGY} emissiveIntensity={1.4} metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, -claw.scaleY * 1.05, -0.22]} rotation={[0.82, 0, 0]} scale={[0.08, 0.55, 0.18]}>
                <coneGeometry args={[1, 2, 4]} />
                <meshStandardMaterial color={DARK_MATTER} emissive={SCARLET_ENERGY} emissiveIntensity={1.4} metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0, 0.14]} scale={[0.025, claw.scaleY * 1.15, 0.04]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color={SCARLET_ENERGY} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
      <group ref={shardsRef}>
        {shards.map((s, i) => (
          <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={CHARRED_METAL} emissive={SCARLET_ENERGY} emissiveIntensity={1.2} metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 4. Dark Void Tendrils
function DarkVoidTendrils({ activity }: { activity: AiActivity }) {
  const ref = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    const rng = seededRandom(8712);
    return Array.from({ length: 14 }, (_, i) => {
      const pts: THREE.Vector3[] = [];
      const base = (i / 14) * Math.PI * 2;
      for (let j = 0; j < 20; j++) {
        const t = j / 20;
        const rad = 0.22 + t * (1.5 + rng() * 0.35);
        const th = base + t * (Math.PI * 1.8) * (i % 2 === 0 ? 1 : -1);
        const y = (t - 0.5) * 2.2 + Math.sin(t * Math.PI * 2) * 0.25;
        pts.push(new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad));
      }
      return new THREE.CatmullRomCurve3(pts);
    });
  }, []);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.42 * activitySpeed(activity);
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <group ref={ref}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 32, 0.018 + (i % 3) * 0.009, 6, false]} />
          <meshStandardMaterial color={i%2===0 ? VOID_BLACK : DARK_MATTER}
            emissive={i%3===0 ? SCARLET_ENERGY : BLOOD_CRIMSON}
            emissiveIntensity={i%2===0 ? 1.6 : 0.8} metalness={0.9} roughness={0.2} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// 5. Runic Resonance Anchor (Floor & Halo Mandalas with Pentagram)
function RunicResonanceAnchor({ activity }: { activity: AiActivity }) {
  const floorMat = useRef<THREE.ShaderMaterial>(null);
  const floorGrp = useRef<THREE.Group>(null);
  const haloMat = useRef<THREE.ShaderMaterial>(null);
  const haloGrp = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime, e = activityEnergy(activity), s = activitySpeed(activity);
    if (floorMat.current) { floorMat.current.uniforms.uTime.value = t; floorMat.current.uniforms.uEnergy.value = e; }
    if (haloMat.current) { haloMat.current.uniforms.uTime.value = t * 0.7; haloMat.current.uniforms.uEnergy.value = e; }
    if (floorGrp.current) floorGrp.current.rotation.z -= delta * 0.06 * s;
    if (haloGrp.current) haloGrp.current.rotation.z += delta * 0.035 * s;
  });

  const uvVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
  return (
    <group>
      <group ref={floorGrp} position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[5.4, 5.4]} />
          <shaderMaterial ref={floorMat} vertexShader={uvVert} fragmentShader={runicMandalaFragmentShader}
            uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 }, uColor: { value: new THREE.Color(SCARLET_ENERGY) }, uHotColor: { value: new THREE.Color(RUNIC_GOLD) } }}
            blending={THREE.AdditiveBlending} depthWrite={false} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={haloGrp} position={[0, 0, -1.4]} rotation={[0.06, 0, 0]}>
        <mesh>
          <planeGeometry args={[5.8, 5.8]} />
          <shaderMaterial ref={haloMat} vertexShader={uvVert} fragmentShader={runicMandalaFragmentShader}
            uniforms={{ uTime: { value: 0 }, uEnergy: { value: 1 }, uColor: { value: new THREE.Color(BLOOD_CRIMSON) }, uHotColor: { value: new THREE.Color(HOT_CORE_PINK) } }}
            blending={THREE.AdditiveBlending} depthWrite={false} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// 6. Aetheric Nebula Dust & Dissolving Embers
function AethericNebulaDust({ activity }: { activity: AiActivity }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1100;
  const { positions, velocities, phases } = useMemo(() => {
    const rng = seededRandom(5521);
    const pos = new Float32Array(count * 3), vel = new Float32Array(count * 3), ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 0.5 + rng() * 3.2, th = rng() * Math.PI * 2, y = (rng() - 0.5) * 4.8;
      pos[i*3] = Math.cos(th)*r; pos[i*3+1] = y; pos[i*3+2] = Math.sin(th)*r*0.85;
      vel[i*3] = (rng()-0.5)*0.25; vel[i*3+1] = 0.3+rng()*0.85; vel[i*3+2] = (rng()-0.5)*0.25;
      ph[i] = rng() * Math.PI * 2;
    }
    return { positions: pos, velocities: vel, phases: ph };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const posA = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posA.array as Float32Array;
    const t = clock.elapsedTime, s = activitySpeed(activity);
    for (let i = 0; i < count; i++) {
      arr[i*3+1] += velocities[i*3+1] * delta * s;
      arr[i*3] += Math.sin(t*1.6+phases[i])*0.006;
      arr[i*3+2] += Math.cos(t*1.6+phases[i])*0.006;
      if (arr[i*3+1] > 2.8) arr[i*3+1] = -2.6;
    }
    posA.needsUpdate = true;
    ref.current.rotation.y = t * 0.035 * s;
  });

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={SCARLET_ENERGY} blending={THREE.AdditiveBlending} depthWrite={false}
        opacity={0.65} size={0.036} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

// 7. Energy Arcs
function EnergyArcs({ activity }: { activity: AiActivity }) {
  const arcCount = 10, segsPerArc = 7;
  const positions = useMemo(() => new Float32Array(arcCount * segsPerArc * 6), []);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime, e = activityEnergy(activity), s = activitySpeed(activity);
    let ptr = 0;
    for (let i = 0; i < arcCount; i++) {
      const angle = (i/arcCount)*Math.PI*2 + t*0.6*s;
      let cx = Math.cos(angle)*0.85, cy = Math.sin(angle*2.2)*0.45, cz = Math.sin(angle)*0.85;
      for (let j = 0; j < segsPerArc; j++) {
        const nx = cx+(Math.sin(t*14+i*7+j)-0.5)*0.32*e;
        const ny = cy+(Math.cos(t*16+i*4+j)-0.5)*0.32*e+0.09;
        const nz = cz+(Math.sin(t*11+j*9)-0.5)*0.32*e;
        positions[ptr++]=cx; positions[ptr++]=cy; positions[ptr++]=cz;
        positions[ptr++]=nx; positions[ptr++]=ny; positions[ptr++]=nz;
        cx=nx; cy=ny; cz=nz;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={HOT_CORE_PINK} blending={THREE.AdditiveBlending} depthWrite={false}
        opacity={0.85} toneMapped={false} transparent />
    </lineSegments>
  );
}

// 8. Background Starfield (atmospheric depth — matching concept art dark space)
function BackgroundStarfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rng = seededRandom(2048);
    const data = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const th = rng() * Math.PI * 2, phi = Math.acos(2 * rng() - 1), r = 5 + rng() * 8;
      data[i*3] = r*Math.sin(phi)*Math.cos(th);
      data[i*3+1] = r*Math.sin(phi)*Math.sin(th);
      data[i*3+2] = r*Math.cos(phi);
    }
    return data;
  }, []);

  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.003; });

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#ff8888" blending={THREE.AdditiveBlending} depthWrite={false}
        opacity={0.3} size={0.015} sizeAttenuation toneMapped={false} transparent />
    </points>
  );
}

// ============================================================================
// MAIN SCENE
// ============================================================================
export function RealityScene({ activity = "idle" }: { activity?: AiActivity }) {
  return (
    <group name="mcu-reality-stone-aether-core" scale={1.08}>
      <ambientLight color={VOID_BLACK} intensity={0.5} />
      <directionalLight color={HOT_CORE_PINK} intensity={1.8} position={[3.0, 4.0, 4.5]} />
      <pointLight color={BLAZING_RED} distance={12} intensity={3.5} position={[-3.0, -1.2, 2.5]} />

      <BackgroundStarfield />
      <RunicResonanceAnchor activity={activity} />
      <AethericNebulaDust activity={activity} />
      <DarkVoidTendrils activity={activity} />
      <ContainmentFrame activity={activity} />
      <RunicOverlayShell activity={activity} />
      <AetherStormCore activity={activity} />
      <EnergyArcs activity={activity} />
    </group>
  );
}

export default RealityScene;
