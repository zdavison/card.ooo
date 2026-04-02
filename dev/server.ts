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
