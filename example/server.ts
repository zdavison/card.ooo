import { darkCard, lightCard } from "./cards";
import { buildIndexPage } from "./index-page";

const readmeMd = await Bun.file("README.md").text();
const indexHtml = buildIndexPage(readmeMd, "/");

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
    "/assets/*": async (req) => {
      const path = new URL(req.url).pathname;
      const file = Bun.file(`.${path}`);
      if (await file.exists()) return new Response(file);
      return new Response("Not found", { status: 404 });
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Dev server running at http://localhost:3000");
