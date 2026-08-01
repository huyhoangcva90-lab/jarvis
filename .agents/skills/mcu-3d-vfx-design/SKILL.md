---
name: mcu_3d_vfx_design
description: Guidelines and shader patterns for MCU-grade 3D VFX design, Tesseract crystal glass materials, 4D hypercube projections, volumetric cosmic nebulae, space wormholes, and reactive AI activity feedback.
---

# MCU 3D VFX & Holographic Interface Design Skill

This skill provides design standards, GLSL shaders, and React Three Fiber pattern guidelines inspired by Marvel Cinematic Universe (MCU) technologies (J.A.R.V.I.S., Friday, Vision, and the Space Stone / Tesseract in *The Avengers* and *Loki*).

## 1. Core Color Palette
- **ICE Cyan**: `#dcfbff` (Primary intense core glow, energy lines, high-frequency vertices)
- **Cosmic Blue**: `#22b8ff` (Mid-tone volumetric energy, magnetic field lines, secondary rays)
- **Deep Space**: `#0757ff` (Deep ambient glow, backface shadows, space-time distortion boundaries)

## 2. Component Design Standards

### A. Translucent Physical Glass Shell (`MeshPhysicalMaterial`)
- Use physical glass transmission (`transmission: 0.85`, `roughness: 0.1`, `metalness: 0.1`, `clearcoat: 1.0`, `ior: 1.52`).
- Combine with an inner shell glow shader and procedural electric lightning tendrils mapped to geometry edges.
- Boost opacity and electric arc frequency when state transitions to `thinking` or `speaking`.

### B. Volumetric Cosmic Nebula Core
- Render a 3D procedural noise field inside the volumetric container using 3D Simplex/Perlin Noise GLSL shaders.
- Place an octahedral Space Stone core emitting penetrating volumetric light beams and energy pulses.

### C. Electric 4D Hypercube Matrix
- Project 16 vertices of a 4D tesseract hypercube $(x, y, z, w)$ into 3D coordinates using double-axis 4D rotation matrices.
- Render edges using laser-glow line segments and place glowing instanced vertex nodes at the 16 corners.
- Animate node pulses in sync with AI activity energy levels.

### D. Wormhole Vortex & Starlight Tunnel
- Create a 3D cylindrical/funnel geometry positioned behind the core.
- Particle dust (Starlight Particles) should spiral along helical vectors towards/away from the central rift.

### E. Space-Time Distortion Shockwaves
- Generate conical/radial shockwave rings expanding outwards during active AI voice/thought synthesis.
- Use additive blending GLSL shaders with ripple distance attenuation.

## 3. React Three Fiber Optimization Rules
- Wrap geometries and shader uniforms in `useMemo`.
- Perform matrix updates and vertex position transformations in `useFrame` using zero-allocation TypedArray operations.
- Set `depthWrite={false}` and `blending={THREE.AdditiveBlending}` on glow/wireframe passes to prevent depth-sorting artifacts.
