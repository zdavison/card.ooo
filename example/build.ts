import { mkdir, rm } from "node:fs/promises";
import { buildIndexPage } from "./index-page";

const outDir = "dist";
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

// Bundle renderCard() for the browser
await Bun.build({
  entrypoints: ["src/browser.ts"],
  outdir: outDir,
  target: "browser",
  minify: true,
  naming: "card.js",
});

// Write the editor page
const indexHtml = buildIndexPage();
await Bun.write(`${outDir}/index.html`, indexHtml);

console.log("Built to dist/");
