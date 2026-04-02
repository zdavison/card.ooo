import { mkdir } from "node:fs/promises";
import { darkCard, lightCard } from "./cards";
import { buildIndexPage } from "./index-page";

const readmeMd = await Bun.file("README.md").text();
const indexHtml = buildIndexPage(readmeMd, "./");

const outDir = "dist";
await mkdir(outDir, { recursive: true });
await mkdir(`${outDir}/dark`, { recursive: true });
await mkdir(`${outDir}/light`, { recursive: true });
await mkdir(`${outDir}/assets`, { recursive: true });

await Promise.all([
  Bun.write(`${outDir}/index.html`, indexHtml),
  Bun.write(`${outDir}/dark/index.html`, darkCard),
  Bun.write(`${outDir}/light/index.html`, lightCard),
  Bun.file("assets/screenshot.png").exists().then(async (exists) => {
    if (exists) {
      await Bun.write(`${outDir}/assets/screenshot.png`, Bun.file("assets/screenshot.png"));
    }
  }),
]);

console.log("Built to dist/");
