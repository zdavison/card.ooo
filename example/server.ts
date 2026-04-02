import { buildIndexPage } from "./index-page";

// Build the browser bundle on startup
await Bun.build({
  entrypoints: ["src/browser.ts"],
  outdir: "dist",
  target: "browser",
  minify: false,
  naming: "card.js",
});

const indexHtml = buildIndexPage();

Bun.serve({
  port: 3000,
  routes: {
    "/": new Response(indexHtml, {
      headers: { "content-type": "text/html" },
    }),
    "/card.js": new Response(Bun.file("dist/card.js"), {
      headers: { "content-type": "application/javascript" },
    }),
  },
  development: {
    hmr: true,
    console: true,
  },
});

const ip = Object.values(require("os").networkInterfaces())
  .flat()
  .find((i: any) => i?.family === "IPv4" && !i.internal)?.address;

console.log("Dev server running at http://localhost:3000");
if (ip) console.log(`  Network:  http://${ip}:3000`);
