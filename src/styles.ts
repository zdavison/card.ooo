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
