# Spider OSM Map Design

## Goal

Replace Spider mode's decorative map with a real map for saving personal food, drink, play, and todo locations without Google Maps billing.

## Decision

Use the existing `maplibre-gl` dependency with OpenStreetMap raster tiles. This avoids adding a new package, avoids Google API keys, and gives Spider mode a real pan/zoom/click map.

## User Experience

Spider mode keeps the current `spideytracker.com` inspired frame: blue/red pixel HUD, left category rail, message center, ticker, and sound feedback. The central surface becomes a real map. Clicking the map stores the clicked coordinates as the draft location. The compose panel can save a title, category, and note. Saved locations render as styled Spider pins on the map and remain editable in localStorage.

## Data Model

Nodes keep the existing fields and add coordinates:

```ts
type PersonalNode = {
  id: string;
  kind: "eat" | "drink" | "play" | "todo";
  title: string;
  note: string;
  done?: boolean;
  x?: number;
  y?: number;
  lng?: number;
  lat?: number;
};
```

Existing `x/y` nodes migrate to approximate Saigon coordinates so no saved data disappears.

## Boundaries

No Google Maps API key, billing setup, or paid geocoding. No copied Spider-Man audio or third-party sound assets. Address search is out of scope for this pass; notes and links can still store addresses manually.

## Error Handling

If map tiles fail to load, the HUD stays usable and existing panels still work. Pins are derived from local data, so saved nodes remain visible again when tiles recover.

## Verification

Run TypeScript typecheck and production build. If a dev server is available, inspect Spider mode to confirm the map container renders, pins appear, and panels still open.
