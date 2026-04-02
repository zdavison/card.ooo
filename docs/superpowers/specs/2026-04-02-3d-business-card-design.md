# card.ooo — 3D Virtual Business Card Package

## Overview

A standalone package that renders interactive 3D virtual business cards. Consumers call `renderCard(data)` and get back a self-contained HTML string they can serve from any route on any Bun server. The card tilts and shines based on mouse position (desktop) or accelerometer data (mobile).

## Status

NOT-RELEASED — local development only.

## API

```ts
import { renderCard } from "card.ooo";

const html = renderCard({
  // Required
  name: "Zachary Davison",
  jobTitle: "Co-Founder",
  org: "Little Tone Records",
  email: "label@littletonerecords.com",
  phone: "+353834840209",
  url: "https://littletonerecords.com",

  // Optional
  logo: "/assets/littletone-logo.png",
  theme: {
    background: "#111",
    text: "#fff",
    accent: "rgba(255,255,255,0.4)",
  },
  qrCode: "<svg>...</svg>", // override auto-generated vCard QR
});
```

Returns a complete HTML document string with all CSS, JS, and canvas logic inlined. No external runtime dependencies.

### QR Code Behavior

- If `qrCode` is provided, it is used directly (SVG string or `<img>` tag).
- If `qrCode` is omitted, a vCard QR code is auto-generated from the contact fields using the `qrcode` npm package at render time.

### Integration

```ts
Bun.serve({
  routes: {
    "/zac": () => new Response(renderCard(data), {
      headers: { "content-type": "text/html" },
    }),
  },
});
```

## Card Layout

```
┌──────────────────────────────────────────────┐
│  [logo]  Name                                │
│          Job Title                           │
│  ──────────────────────────────────────────  │
│                                              │
│  email@example.com              ┌─────────┐  │
│  +1 234 567 890                 │  QR     │  │
│  example.com                    │  Code   │  │
│                                 └─────────┘  │
└──────────────────────────────────────────────┘
```

- Fixed 3.5:2 aspect ratio (standard business card) on all screen sizes
- Card is centered on the page, scaled to fit the viewport with empty space around it on wider displays
- No viewport-filling mode — consistent aspect ratio always
- Name auto-shrinks if it overflows its container
- Page background is a muted neutral (e.g. `#e8e4df`), card floats centered with layered box shadows

## 3D Effect System

Three layers composited together:

### 1. CSS 3D Transform (card tilt)

- Card sits in a `perspective(800px)` container
- `rotateX` / `rotateY` applied based on input, capped at ±15 degrees
- Dynamic box shadow shifts opposite to tilt direction (fixed "above" light source)
- Smooth interpolation via `requestAnimationFrame` lerp (not CSS transitions, to avoid sluggish feel)

### 2. Canvas Shine Overlay

- Transparent `<canvas>` absolutely positioned over the card face
- Primary specular highlight: soft radial gradient that tracks the "light reflection point" — moves opposite to tilt, simulating a fixed overhead light
- Edge glow: subtle bright falloff along card edges nearest the light source
- Both effects painted per-frame in the same rAF loop as the tilt

### 3. Input Sources

- **Desktop**: mouse position relative to card center. Card tilts as if viewed from the mouse position. Always active, no click required.
- **Mobile**: `DeviceOrientationEvent` (with permission request on iOS via user gesture). Maps device beta/gamma to rotateX/Y.
- **Fallback**: if no accelerometer permission granted or no mouse detected, card has a subtle idle animation (slow gentle rock).

All client-side logic (tilt, canvas, input handling) is inlined into the HTML output as `<script>` and `<canvas>` elements. No external JS files.

## Theming

### Current (v1)

Minimal theming via the `theme` option:

| Field        | Type   | Default                    | Description              |
|------------- |--------|--------------------------- |------------------------- |
| `background` | string | `"#111"`                   | Card background color    |
| `text`       | string | `"#fff"`                   | Primary text color       |
| `accent`     | string | `"rgba(255,255,255,0.4)"`  | Secondary text / divider |

### Future

Preset named themes (dark, light, minimal, etc.) selectable by name with color overrides. Not in scope for v1.

## Package Structure

```
card.ooo/
├── package.json          # name: "card.ooo", main: "src/index.ts"
├── src/
│   ├── index.ts          # exports renderCard()
│   ├── template.ts       # HTML template with card markup
│   ├── styles.ts         # CSS string (layout, responsive, 3D container)
│   ├── script.ts         # client-side JS string (tilt, canvas shine, input)
│   ├── qr.ts             # vCard string builder + QR SVG generation
│   └── types.ts          # CardData, ThemeOptions interfaces
├── dev/
│   └── server.ts         # bun dev server with example cards
├── test/
│   └── render.test.ts    # tests for renderCard output
├── CLAUDE.md
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-02-3d-business-card-design.md
```

## Technology

- **Runtime**: Bun
- **Language**: TypeScript
- **Dependencies**: `qrcode` (render-time only, for vCard QR generation)
- **Client-side**: vanilla JS + Canvas API, zero runtime dependencies
- **Testing**: `bun test`
- **Dev server**: `bun dev` via `dev/server.ts` using `Bun.serve()`

## Migration Path

Once the package is built, both littletonerecords.com and zac.ooo can replace their current card implementations by importing `renderCard` and serving the result from their existing card routes.
