# Spider OSM Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real OpenStreetMap-backed Spider map for saving personal food, drink, play, and todo locations without Google billing.

**Architecture:** `SpiderPersonalHub.tsx` owns the personal node data, MapLibre map instance, marker lifecycle, and panel interactions. `src/styles.css` owns the Spider HUD and MapLibre marker styling. Existing localStorage data migrates in-place by adding `lng/lat` where absent.

**Tech Stack:** React 19, Vite, TypeScript, MapLibre GL, OpenStreetMap raster tiles, Web Audio sound manager.

## Global Constraints

No Google Maps API key, billing setup, or paid geocoding.
No copied Spider-Man audio or third-party sound assets.
Do not add a new map dependency; use existing `maplibre-gl`.
Keep saved localStorage nodes and migrate them without data loss.
Address search is out of scope for this pass.

---

### Task 1: Real Map Surface

**Files:**
- Modify: `src/components/orb/SpiderPersonalHub.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `PersonalNode`, `KINDS`, `soundManager`.
- Produces: `mapRef`, `mapContainerRef`, `markersRef`, `setDraftLocation(lngLat)`, and real MapLibre map rendering.

- [ ] **Step 1: Add MapLibre imports and coordinate types**

```ts
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type DraftLocation = { lng: number; lat: number };
type PersonalNode = {
  id: string;
  kind: LinkKind;
  title: string;
  note: string;
  done?: boolean;
  x?: number;
  y?: number;
  lng?: number;
  lat?: number;
};
```

- [ ] **Step 2: Replace decorative `WorldMap` usage with a `div` map container**

```tsx
<div ref={mapContainerRef} className="spidey-real-map" aria-label="Spider personal map" />
```

- [ ] **Step 3: Initialize MapLibre once**

```ts
const map = new maplibregl.Map({
  container: mapContainerRef.current,
  center: [106.7009, 10.7769],
  zoom: 12,
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "OpenStreetMap",
      },
    },
    layers: [{ id: "osm", type: "raster", source: "osm" }],
  },
});
```

- [ ] **Step 4: Store clicked coordinates**

```ts
map.on("click", (event) => {
  setDraftLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
  setPanel("compose");
  soundManager.play("beep");
});
```

### Task 2: Node Migration And Markers

**Files:**
- Modify: `src/components/orb/SpiderPersonalHub.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `nodes`, `visibleNodes`, `selectedId`, `setSelectedId`, `setPanel`.
- Produces: migrated node coordinates and DOM markers keyed by node id.

- [ ] **Step 1: Add migration helpers**

```ts
const SAIGON_CENTER = { lng: 106.7009, lat: 10.7769 };

function xyToLngLat(x = 50, y = 50) {
  return {
    lng: SAIGON_CENTER.lng + ((x - 50) / 100) * 0.18,
    lat: SAIGON_CENTER.lat - ((y - 50) / 100) * 0.14,
  };
}

function migrateNode(node: PersonalNode) {
  if (typeof node.lng === "number" && typeof node.lat === "number") return node;
  return { ...node, ...xyToLngLat(node.x, node.y) };
}
```

- [ ] **Step 2: Apply migration during load**

```ts
return parsed.map(migrateNode);
```

- [ ] **Step 3: Sync MapLibre markers to visible nodes**

```ts
visibleNodes.forEach((node) => {
  if (typeof node.lng !== "number" || typeof node.lat !== "number") return;
  const el = document.createElement("button");
  el.type = "button";
  el.className = `spidey-map-marker pin-${node.kind}`;
  el.textContent = KINDS.find((item) => item.id === node.kind)?.short || node.kind;
  el.addEventListener("click", () => {
    setSelectedId(node.id);
    setPanel("detail");
    soundManager.play("click");
  });
  markersRef.current[node.id] = new maplibregl.Marker({ element: el })
    .setLngLat([node.lng, node.lat])
    .addTo(map);
});
```

### Task 3: Compose And Detail Behavior

**Files:**
- Modify: `src/components/orb/SpiderPersonalHub.tsx`

**Interfaces:**
- Consumes: `draftLocation`, `selected`.
- Produces: saved nodes with `lng/lat`, map fly-to on select, and manual map opening.

- [ ] **Step 1: Save clicked coordinates when adding a node**

```ts
const location = draftLocation || SAIGON_CENTER;
const node: PersonalNode = {
  id: `${Date.now()}`,
  kind,
  title: draft.trim(),
  note: note.trim() || "Chua co dia chi, link hoac ghi chu",
  lng: location.lng,
  lat: location.lat,
};
```

- [ ] **Step 2: Fly to selected node**

```ts
if (selected?.lng && selected?.lat) {
  mapRef.current?.flyTo({ center: [selected.lng, selected.lat], zoom: 14, speed: 0.8 });
}
```

- [ ] **Step 3: Open selected coordinates in external map**

```ts
window.open(`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`, "_blank", "noopener,noreferrer");
```

### Task 4: Verification

**Files:**
- Modify only if verification reveals a bug: `src/components/orb/SpiderPersonalHub.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: typecheck/build pass.

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: exits with code 0.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: exits with code 0 and emits built assets.

- [ ] **Step 3: Inspect local UI if a dev server starts cleanly**

Run: `npm run dev`
Expected: Vite serves the app and Spider mode can display the real map surface.
