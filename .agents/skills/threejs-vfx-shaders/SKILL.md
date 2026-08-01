---
name: threejs_vfx_shaders
description: Technical standards for Three.js, React Three Fiber (R3F), GLSL shader programming, 3D particle systems, post-processing bloom, and WebGL 60 FPS performance optimization.
---

# Three.js 3D VFX & GLSL Shader Art Skill

This skill documents high-performance 3D visual effects, custom shader math, instanced mesh setups, and React Three Fiber architecture based on top GitHub 3D graphics practices (AxiomeCG/awesome-threejs, Book of Shaders, R3F Drei).

## 1. Custom GLSL Shader Architecture
- **Vertex Shaders**: Use 3D Simplex/Perlin noise displacement, normal matrix transformations, and dynamic position morphing driven by uniform time (`uTime`) and energy (`uEnergy`).
- **Fragment Shaders**: Combine Fresnel edge illumination, raymarching volumetric density, distance field attenuation (`smoothstep`), and additive blending.
- **Raymarching & Volumetric Lighting**: Render volumetric clouds, nebulae, or crystal interiors by sampling 3D noise along camera ray vectors.

## 2. High-Performance WebGL Practices (60 FPS)
- **Zero Allocation in `useFrame`**: Reuse scratch objects (`THREE.Vector3`, `THREE.Matrix4`, `THREE.Quaternion`) and mutate TypedArrays (`Float32Array`) directly.
- **Instanced Mesh Rendering**: Use `<instancedMesh>` for particle swarms, node arrays, or repeated geometric slices instead of individual meshes.
- **Geometry & Material Caching**: Wrap buffer geometries, line segments, and shader materials inside `useMemo`.
- **Post-Processing Optimization**: Set `multisampling={0}` on `EffectComposer` when using bloom filters to maximize frame rates.
