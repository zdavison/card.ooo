# card.ooo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone package that exports `renderCard(data)` returning a self-contained HTML page with 3D tilt/shine effects.

**Architecture:** Server-side TypeScript composes an HTML document from typed card data — CSS, client-side JS, and canvas shine logic are all inlined as strings. QR codes are generated at render time. The client-side script handles mouse/accelerometer input, CSS 3D transforms, and canvas-based specular highlights.

**Tech Stack:** Bun, TypeScript, `qrcode` npm package, vanilla JS + Canvas API (client-side)

---

## File Map

| File                   | Responsibility                                                    |
|----------------------- |------------------------------------------------------------------ |
| `package.json`         | Package metadata, dependencies, scripts                           |
| `tsconfig.json`        | TypeScript config                                                 |
| `CLAUDE.md`            | Project-specific instructions                                     |
| `src/types.ts`         | `CardData` and `ThemeOptions` interfaces                          |
| `src/qr.ts`            | vCard string builder + QR SVG generation via `qrcode`             |
| `src/styles.ts`        | Returns CSS string for card layout, responsive scaling, 3D setup  |
| `src/script.ts`        | Returns client-side JS string for tilt, canvas shine, input       |
| `src/template.ts`      | Composes full HTML document from parts                            |
| `src/index.ts`         | Public API — exports `renderCard()`                               |
| `test/render.test.ts`  | Tests for renderCard output correctness                           |
| `test/qr.test.ts`      | Tests for vCard generation and QR code behavior                   |
| `dev/server.ts`        | Dev server with example cards for visual iteration                |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `CLAUDE.md`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "card.ooo",
  "version": "0.0.1",
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "dev": "bun --hot dev/server.ts",
    "test": "bun test"
  },
  "dependencies": {
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.5",
    "bun-types": "latest"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun-types"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src", "test", "dev"]
}
```

- [ ] **Step 3: Create CLAUDE.md**

```markdown
# card.ooo

NOT-RELEASED

Standalone 3D virtual business card renderer. `renderCard(data)` returns a self-contained HTML page.

## Commands

- `bun dev` — dev server with example cards
- `bun test` — run tests
```

- [ ] **Step 4: Install dependencies**

Run: `cd /home/z/Desktop/work/card.ooo && bun install`
Expected: `bun.lock` created, `node_modules/` populated, `qrcode` and types installed.

- [ ] **Step 5: Initialize git and commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git init
git add package.json tsconfig.json CLAUDE.md bun.lock docs/
git commit -m "chore: scaffold card.ooo package"
```
Expected: Clean initial commit.

---

### Task 2: Types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write type definitions**

```ts
/** @example { background: "#111", text: "#fff", accent: "rgba(255,255,255,0.4)" } */
export interface ThemeOptions {
  /** Card background color. @default "#111" */
  background?: string;
  /** Primary text color. @default "#fff" */
  text?: string;
  /** Secondary text and divider color. @default "rgba(255,255,255,0.4)" */
  accent?: string;
}

export interface CardData {
  /** Full display name. @example "Zachary Davison" */
  name: string;
  /** Job title / role. @example "Co-Founder" */
  jobTitle: string;
  /** Organization name. @example "Little Tone Records" */
  org: string;
  /** Contact email. @example "label@littletonerecords.com" */
  email: string;
  /** Phone number with country code. @example "+353834840209" */
  phone: string;
  /** Website URL. @example "https://littletonerecords.com" */
  url: string;
  /** URL or path to logo image. @example "/assets/logo.png" */
  logo?: string;
  /** Theme color overrides. */
  theme?: ThemeOptions;
  /** Custom QR code SVG string. If omitted, a vCard QR is auto-generated. @example "<svg>...</svg>" */
  qrCode?: string;
}

export interface ResolvedTheme {
  background: string;
  text: string;
  accent: string;
}

export const DEFAULT_THEME: ResolvedTheme = {
  background: "#111",
  text: "#fff",
  accent: "rgba(255,255,255,0.4)",
};
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/types.ts
git commit -m "feat: add CardData and ThemeOptions types"
```

---

### Task 3: QR Code Generation

**Files:**
- Create: `src/qr.ts`
- Create: `test/qr.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { test, expect, describe } from "bun:test";
import { buildVCardString, generateQrSvg } from "../src/qr";

describe("buildVCardString", () => {
  test("produces valid vCard 3.0 format", () => {
    const result = buildVCardString({
      name: "Jane Doe",
      org: "Acme Inc",
      jobTitle: "Engineer",
      email: "jane@acme.com",
      phone: "+1234567890",
      url: "https://acme.com",
    });
    expect(result).toStartWith("BEGIN:VCARD");
    expect(result).toContain("VERSION:3.0");
    expect(result).toContain("FN:Jane Doe");
    expect(result).toContain("ORG:Acme Inc");
    expect(result).toContain("TITLE:Engineer");
    expect(result).toContain("EMAIL:jane@acme.com");
    expect(result).toContain("TEL:+1234567890");
    expect(result).toContain("URL:https://acme.com");
    expect(result).toEndWith("END:VCARD");
  });
});

describe("generateQrSvg", () => {
  test("returns an SVG string", async () => {
    const svg = await generateQrSvg("test data");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  test("uses currentColor for fill", async () => {
    const svg = await generateQrSvg("test data");
    expect(svg).toContain('fill="currentColor"');
    expect(svg).not.toContain('fill="#ffffff"');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/z/Desktop/work/card.ooo && bun test test/qr.test.ts`
Expected: FAIL — module `../src/qr` not found.

- [ ] **Step 3: Implement qr.ts**

```ts
import QRCode from "qrcode";

interface VCardFields {
  name: string;
  org: string;
  jobTitle: string;
  email: string;
  phone: string;
  url: string;
}

export function buildVCardString(fields: VCardFields): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fields.name}`,
    `ORG:${fields.org}`,
    `TITLE:${fields.jobTitle}`,
    `EMAIL:${fields.email}`,
    `TEL:${fields.phone}`,
    `URL:${fields.url}`,
    "END:VCARD",
  ].join("\n");
}

export async function generateQrSvg(data: string): Promise<string> {
  const svg = await QRCode.toString(data, {
    type: "svg",
    margin: 0,
    color: { dark: "#ffffff", light: "#00000000" },
  });
  return svg.replace(/fill="#ffffff"/g, 'fill="currentColor"');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/z/Desktop/work/card.ooo && bun test test/qr.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/qr.ts test/qr.test.ts
git commit -m "feat: add vCard string builder and QR SVG generation"
```

---

### Task 4: Styles

**Files:**
- Create: `src/styles.ts`

- [ ] **Step 1: Implement styles.ts**

This returns a CSS string parameterized by theme colors. The CSS handles:
- Page centering with neutral background
- Fixed 3.5:2 aspect ratio card, scaled to fit viewport
- 3D perspective container
- Card inner layout (top section with logo/name, divider, bottom section with contact/QR)
- Name auto-fit (handled by JS, but the CSS sets up `white-space: nowrap; overflow: hidden`)
- Layered box shadows
- Canvas overlay positioning

```ts
import type { ResolvedTheme } from "./types";

export function buildStyles(theme: ResolvedTheme): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      background: #e8e4df;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      height: 100%;
      overflow: hidden;
    }

    .card-page {
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .card-perspective {
      perspective: 800px;
    }

    .card {
      aspect-ratio: 3.5 / 2;
      width: min(500px, 85vw, 85vh * 1.75);
      background: ${theme.background};
      border-radius: 6px;
      position: relative;
      transform-style: preserve-3d;
      will-change: transform;
      box-shadow:
        0 2px 4px rgba(0,0,0,0.2),
        0 8px 16px rgba(0,0,0,0.18),
        0 20px 40px rgba(0,0,0,0.15),
        0 40px 80px rgba(0,0,0,0.12);
    }

    .card-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: 6px;
      z-index: 10;
    }

    .card-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2rem;
      width: 100%;
      height: 100%;
      color: ${theme.text};
    }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .card-logo {
      width: 3.2rem;
      height: auto;
      opacity: 0.5;
      flex-shrink: 0;
      filter: invert(1);
    }

    .card-main {
      min-width: 0;
    }

    .card-name {
      font-weight: 700;
      font-size: 1.6rem;
      letter-spacing: 0.02em;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
    }

    .card-title {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${theme.accent};
      margin-top: 0.35rem;
    }

    .card-divider {
      height: 1px;
      background: ${theme.accent};
      opacity: 0.4;
      margin: 0.4rem 0 0;
    }

    .card-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .card-contact {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .card-contact span {
      font-size: 0.72rem;
      color: ${theme.accent};
      letter-spacing: 0.02em;
    }

    .card-qr {
      flex-shrink: 0;
      width: 5rem;
      height: 5rem;
      opacity: 0.7;
      color: ${theme.text};
    }

    .card-qr svg, .card-qr img {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 768px) {
      .card-page {
        padding: 1rem;
      }
    }
  `;
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/styles.ts
git commit -m "feat: add card CSS styles with theme support"
```

---

### Task 5: Client-Side Script (Tilt + Canvas Shine)

**Files:**
- Create: `src/script.ts`

- [ ] **Step 1: Implement script.ts**

This returns a self-contained JS string that runs in the browser. It handles:
1. Mouse tracking → tilt
2. Accelerometer → tilt
3. Idle animation fallback
4. rAF loop: lerp tilt values, apply CSS transform, paint canvas shine
5. Name auto-fit

```ts
export function buildScript(): string {
  return `
(function() {
  var card = document.querySelector('.card');
  var canvas = document.querySelector('.card-canvas');
  var ctx = canvas.getContext('2d');

  // State
  var targetX = 0; // rotateY target (-1 to 1)
  var targetY = 0; // rotateX target (-1 to 1)
  var currentX = 0;
  var currentY = 0;
  var MAX_TILT = 15;
  var LERP = 0.08;
  var inputActive = false;
  var idleTime = 0;

  // Resize canvas to match card pixel dimensions
  function resizeCanvas() {
    var rect = card.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Input: Mouse ---
  document.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
    targetY = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight / 2)));
    inputActive = true;
  });

  document.addEventListener('mouseleave', function() {
    targetX = 0;
    targetY = 0;
    inputActive = false;
  });

  // --- Input: Accelerometer ---
  var hasGyro = false;

  function handleOrientation(e) {
    if (e.gamma === null) return;
    hasGyro = true;
    targetX = Math.max(-1, Math.min(1, e.gamma / 30));
    targetY = Math.max(-1, Math.min(1, e.beta / 30 - 1));
    inputActive = true;
  }

  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ — need user gesture
      document.addEventListener('click', function iosPermission() {
        DeviceOrientationEvent.requestPermission().then(function(state) {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        });
        document.removeEventListener('click', iosPermission);
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  // --- Idle animation ---
  function idleTilt(t) {
    targetX = Math.sin(t * 0.0005) * 0.15;
    targetY = Math.cos(t * 0.0007) * 0.1;
  }

  // --- Canvas shine ---
  function paintShine(w, h, lx, ly) {
    ctx.clearRect(0, 0, w, h);

    // Specular highlight — moves opposite to tilt
    var specX = w * (0.5 - lx * 0.4);
    var specY = h * (0.5 - ly * 0.4);
    var specRadius = Math.max(w, h) * 0.7;
    var grad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specRadius);
    grad.addColorStop(0, 'rgba(255,255,255,0.12)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.04)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Edge glow on the side nearest the light
    var edgeGrad;
    if (Math.abs(lx) > Math.abs(ly)) {
      var ex = lx < 0 ? 0 : w;
      edgeGrad = ctx.createLinearGradient(ex, 0, ex + (lx < 0 ? w * 0.3 : -w * 0.3), 0);
    } else {
      var ey = ly < 0 ? 0 : h;
      edgeGrad = ctx.createLinearGradient(0, ey, 0, ey + (ly < 0 ? h * 0.3 : -h * 0.3));
    }
    edgeGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
    edgeGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- Animation loop ---
  function frame(t) {
    if (!inputActive) {
      idleTime = t;
      idleTilt(t);
    }

    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    var rotY = currentX * MAX_TILT;
    var rotX = -currentY * MAX_TILT;

    card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

    // Shadow shifts opposite to tilt
    var sx = -currentX * 20;
    var sy = currentY * 20;
    card.style.boxShadow =
      (sx * 0.1) + 'px ' + (sy * 0.1 + 2) + 'px 4px rgba(0,0,0,0.2), ' +
      (sx * 0.3) + 'px ' + (sy * 0.3 + 8) + 'px 16px rgba(0,0,0,0.18), ' +
      (sx * 0.6) + 'px ' + (sy * 0.6 + 20) + 'px 40px rgba(0,0,0,0.15), ' +
      (sx) + 'px ' + (sy + 40) + 'px 80px rgba(0,0,0,0.12)';

    var rect = card.getBoundingClientRect();
    paintShine(rect.width, rect.height, currentX, currentY);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // --- Name auto-fit ---
  function fitName() {
    var el = document.querySelector('.card-name');
    var container = el && el.closest('.card-main');
    if (!el || !container) return;
    el.style.fontSize = '';
    var size = parseFloat(window.getComputedStyle(el).fontSize);
    while (el.scrollWidth > container.offsetWidth && size > 8) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }
  requestAnimationFrame(fitName);
  window.addEventListener('resize', fitName);
})();
  `;
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/script.ts
git commit -m "feat: add client-side 3D tilt and canvas shine script"
```

---

### Task 6: HTML Template

**Files:**
- Create: `src/template.ts`

- [ ] **Step 1: Implement template.ts**

Composes the full HTML document from card data, styles, script, and QR code.

```ts
import type { CardData, ResolvedTheme } from "./types";

interface TemplateInput {
  data: CardData;
  theme: ResolvedTheme;
  css: string;
  js: string;
  qrSvg: string;
}

export function buildTemplate(input: TemplateInput): string {
  const { data, theme, css, js, qrSvg } = input;
  const displayUrl = data.url.replace(/^https?:\/\//, "");

  const logoHtml = data.logo
    ? `<img class="card-logo" src="${escapeAttr(data.logo)}" alt="${escapeAttr(data.org)}">`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.name)} — ${escapeHtml(data.org)}</title>
  <meta name="theme-color" content="${escapeAttr(theme.background)}">
  <style>${css}</style>
</head>
<body>
  <div class="card-page">
    <div class="card-perspective">
      <div class="card">
        <canvas class="card-canvas"></canvas>
        <div class="card-inner">
          <div class="card-top">
            ${logoHtml}
            <div class="card-main">
              <div class="card-name">${escapeHtml(data.name)}</div>
              <div class="card-title">${escapeHtml(data.jobTitle)}</div>
            </div>
          </div>
          <div class="card-divider"></div>
          <div class="card-bottom">
            <div class="card-contact">
              <span>${escapeHtml(data.email)}</span>
              <span>${escapeHtml(data.phone)}</span>
              <span>${escapeHtml(displayUrl)}</span>
            </div>
            <div class="card-qr">${qrSvg}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>${js}</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/template.ts
git commit -m "feat: add HTML template composition"
```

---

### Task 7: renderCard() — Public API

**Files:**
- Create: `src/index.ts`
- Create: `test/render.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { test, expect, describe } from "bun:test";
import { renderCard } from "../src/index";

const sampleData = {
  name: "Jane Doe",
  jobTitle: "Engineer",
  org: "Acme Inc",
  email: "jane@acme.com",
  phone: "+1234567890",
  url: "https://acme.com",
};

describe("renderCard", () => {
  test("returns a complete HTML document", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  test("includes card data in output", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Engineer");
    expect(html).toContain("jane@acme.com");
    expect(html).toContain("+1234567890");
    expect(html).toContain("acme.com");
  });

  test("auto-generates QR code when not provided", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("<svg");
    expect(html).toContain("BEGIN:VCARD");
  });

  test("uses custom QR code when provided", async () => {
    const customQr = '<svg class="custom-qr"><rect/></svg>';
    const html = await renderCard({ ...sampleData, qrCode: customQr });
    expect(html).toContain('class="custom-qr"');
    // Should NOT contain auto-generated vCard QR
    expect(html).not.toContain("BEGIN:VCARD");
  });

  test("applies default theme when none provided", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("#111");
    expect(html).toContain("#fff");
  });

  test("applies custom theme colors", async () => {
    const html = await renderCard({
      ...sampleData,
      theme: { background: "#222", text: "#eee" },
    });
    expect(html).toContain("#222");
    expect(html).toContain("#eee");
  });

  test("includes inline script for 3D effects", async () => {
    const html = await renderCard(sampleData);
    expect(html).toContain("requestAnimationFrame");
    expect(html).toContain("rotateX");
    expect(html).toContain("rotateY");
  });

  test("includes logo when provided", async () => {
    const html = await renderCard({ ...sampleData, logo: "/logo.png" });
    expect(html).toContain('src="/logo.png"');
  });

  test("omits logo element when not provided", async () => {
    const html = await renderCard(sampleData);
    expect(html).not.toContain("card-logo");
  });

  test("strips protocol from displayed URL", async () => {
    const html = await renderCard(sampleData);
    // Should show "acme.com" not "https://acme.com" in the contact section
    expect(html).toContain(">acme.com<");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/z/Desktop/work/card.ooo && bun test test/render.test.ts`
Expected: FAIL — module `../src/index` has no export `renderCard`.

- [ ] **Step 3: Implement index.ts**

```ts
import type { CardData, ResolvedTheme } from "./types";
import { DEFAULT_THEME } from "./types";
import { buildVCardString, generateQrSvg } from "./qr";
import { buildStyles } from "./styles";
import { buildScript } from "./script";
import { buildTemplate } from "./template";

export type { CardData, ThemeOptions } from "./types";

export async function renderCard(data: CardData): Promise<string> {
  const theme: ResolvedTheme = {
    background: data.theme?.background ?? DEFAULT_THEME.background,
    text: data.theme?.text ?? DEFAULT_THEME.text,
    accent: data.theme?.accent ?? DEFAULT_THEME.accent,
  };

  let qrSvg: string;
  if (data.qrCode) {
    qrSvg = data.qrCode;
  } else {
    const vcard = buildVCardString({
      name: data.name,
      org: data.org,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      url: data.url,
    });
    qrSvg = await generateQrSvg(vcard);
  }

  const css = buildStyles(theme);
  const js = buildScript();

  return buildTemplate({ data, theme, css, js, qrSvg });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/z/Desktop/work/card.ooo && bun test`
Expected: All tests PASS (both `test/qr.test.ts` and `test/render.test.ts`).

- [ ] **Step 5: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add src/index.ts test/render.test.ts
git commit -m "feat: implement renderCard public API"
```

---

### Task 8: Dev Server

**Files:**
- Create: `dev/server.ts`

- [ ] **Step 1: Implement dev server with example cards**

```ts
import { renderCard } from "../src/index";

const darkCard = await renderCard({
  name: "Zachary Davison",
  jobTitle: "Co-Founder",
  org: "Little Tone Records",
  email: "label@littletonerecords.com",
  phone: "+353834840209",
  url: "https://littletonerecords.com",
  logo: "https://littletonerecords.com/assets/littletone-logo-no-text.png",
});

const lightCard = await renderCard({
  name: "Jane Smith",
  jobTitle: "Senior Engineer",
  org: "Acme Corp",
  email: "jane@acme.com",
  phone: "+1234567890",
  url: "https://acme.com",
  theme: {
    background: "#f5f2ed",
    text: "#111",
    accent: "rgba(0,0,0,0.4)",
  },
});

const indexHtml = `<!DOCTYPE html>
<html><head><title>card.ooo dev</title>
<style>
  body { font-family: system-ui; max-width: 600px; margin: 2rem auto; }
  a { display: block; margin: 1rem 0; font-size: 1.2rem; }
</style></head>
<body>
  <h1>card.ooo dev server</h1>
  <a href="/dark">Dark theme (Little Tone)</a>
  <a href="/light">Light theme (Acme)</a>
</body></html>`;

Bun.serve({
  port: 3000,
  routes: {
    "/": new Response(indexHtml, {
      headers: { "content-type": "text/html" },
    }),
    "/dark": new Response(darkCard, {
      headers: { "content-type": "text/html" },
    }),
    "/light": new Response(lightCard, {
      headers: { "content-type": "text/html" },
    }),
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Dev server running at http://localhost:3000");
```

- [ ] **Step 2: Test the dev server manually**

Run: `cd /home/z/Desktop/work/card.ooo && bun dev`
Expected: Server starts on port 3000. Visit http://localhost:3000/dark and http://localhost:3000/light to see cards with 3D tilt effects. Ctrl+C to stop.

- [ ] **Step 3: Commit**

Run:
```bash
cd /home/z/Desktop/work/card.ooo
git add dev/server.ts
git commit -m "feat: add dev server with dark and light example cards"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run all tests**

Run: `cd /home/z/Desktop/work/card.ooo && bun test`
Expected: All tests pass.

- [ ] **Step 2: Run dev server and verify both cards render**

Run: `cd /home/z/Desktop/work/card.ooo && bun dev`
Expected: Both `/dark` and `/light` routes render cards with:
- Correct layout (name, title, contact, QR code)
- 3D tilt following mouse movement
- Canvas shine overlay responding to tilt
- Dynamic shadow shifting
- Name auto-fit working

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `cd /home/z/Desktop/work/card.ooo && bunx tsc --noEmit`
Expected: No errors.
