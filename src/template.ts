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
  <style>${data.fontFaces || ""}${css}</style>
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
              <a href="mailto:${escapeAttr(data.email)}"><span>${escapeHtml(data.email)}</span></a>
              <a href="tel:${escapeAttr(data.phone)}"><span>${escapeHtml(data.phone)}</span></a>
              <a href="${escapeAttr(data.url)}"><span>${escapeHtml(displayUrl)}</span></a>
            </div>
            <div class="card-qr">${qrSvg}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-qr-overlay">
    <div class="card-qr-overlay-inner">${qrSvg}</div>
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
