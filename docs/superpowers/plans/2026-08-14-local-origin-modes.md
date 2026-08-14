# Local Origin Modes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Spider, Javis OS, and World Monitor open as local first-party modes with original/clawed designs, no login gate, no footer/pro clutter, and a free-map Spider fallback.

**Architecture:** Keep the original upstream assets as the source of truth and patch only the deploy output. Main J-Core mode launchers route to local sub-app paths, while `scripts/build-pages.mjs` publishes and sanitizes each sub-app during the normal build.

**Tech Stack:** Vite, React, static HTML publish transforms, MapLibre/OpenStreetMap-compatible browser script injection, Node build verification.

## Global Constraints

- Do not iframe GitHub or external websites as the primary mode.
- Preserve the clawed SpideyTracker hub design; only replace the broken Google map surface with a free-map layer.
- Do not show sample Spider places before the user saves data.
- Remove login/auth overlays from Javis OS publish output.
- Remove World Monitor login/pro/footer/promo clutter from local publish output.
- Keep changes scoped to launchers, build transforms, and verification.

---

### Task 1: Add source/output verification

**Files:**
- Create: `scripts/verify-local-modes.mjs`

**Interfaces:**
- Consumes: source files and built `dist` output.
- Produces: exit code `0` when local mode requirements are met.

- [ ] Write a Node script that checks launcher source paths and built publish markers.
- [ ] Run it before implementation and confirm it fails on the current redirect/custom tracker behavior.

### Task 2: Restore Spider clawweb hub as primary mode

**Files:**
- Modify: `src/components/orb/SpiderPersonalHub.tsx`
- Modify: `scripts/build-pages.mjs`

**Interfaces:**
- Produces: `./spideytracker/index.html` as the Spider mode target.
- Produces: `jcore-spidey-free-map` marker in the generated Spidey output.

- [ ] Change the Spider launcher to `./spideytracker/index.html`.
- [ ] Inject a free-map layer into the clawed Spidey snapshot without replacing the original shell.
- [ ] Keep the logo home link and footer cleanup patch.

### Task 3: Publish Javis OS without login gate

**Files:**
- Modify: `scripts/build-pages.mjs`

**Interfaces:**
- Produces: `jcore-javis-auth-bypass` marker in `dist/javis-os/index.html`.

- [ ] Keep copying `external/javis-os/dashboard`.
- [ ] Inject CSS/JS that hides auth/setup modals and seeds a local “ungated” browser session hint.

### Task 4: Publish World Monitor locally without auth/pro/footer clutter

**Files:**
- Modify: `src/components/orb/WorldMonitorHub.tsx`
- Modify: `scripts/build-pages.mjs`

**Interfaces:**
- Produces: `./worldmonitor/index.html` as the World Monitor mode target.
- Produces: `jcore-worldmonitor-local-pro` marker in the generated World Monitor output.

- [ ] Route World Monitor to local publish output.
- [ ] Publish a local World Monitor static shell from the upstream repo.
- [ ] Strip pro banner reservation, pricing/footer navigation, and set a local pro entitlement hint.

### Task 5: Verify, commit, push

**Files:**
- Modify only scoped source/build/test files and generated deploy assets required by the build.

**Interfaces:**
- Consumes: `pnpm run build`, `node scripts/verify-local-modes.mjs`, git.

- [ ] Run the full build.
- [ ] Run local mode verification.
- [ ] Stage only relevant files.
- [ ] Commit and push to `main`.
