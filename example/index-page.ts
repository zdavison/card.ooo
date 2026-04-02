export function buildIndexPage(readmeMd: string, linkPrefix = "/"): string {
  const readmeHtml = markdownToHtml(readmeMd);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>card.ooo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #faf9f7;
      color: #222;
      line-height: 1.6;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    .examples {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }
    .examples a {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      background: #111;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: opacity 0.15s;
    }
    .examples a:hover { opacity: 0.8; }
    .examples a.light {
      background: #e8e4df;
      color: #111;
    }
    .readme h1 { font-size: 2rem; margin: 1.5rem 0 0.5rem; }
    .readme h2 { font-size: 1.3rem; margin: 2rem 0 0.5rem; border-bottom: 1px solid #e0ddd8; padding-bottom: 0.3rem; }
    .readme p { margin: 0.5rem 0; }
    .readme img { max-width: 100%; border-radius: 8px; margin: 1rem auto; display: block; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
    .readme pre {
      background: #1a1a1a;
      color: #e0e0e0;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0.5rem 0;
      font-size: 0.75rem;
      line-height: 1.5;
    }
    .readme code {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 0.75em;
    }
    .readme p code, .readme li code {
      background: #eee;
      padding: 0.15em 0.35em;
      border-radius: 3px;
    }
    .readme pre code {
      background: none;
      padding: 0;
      border-radius: 0;
      color: inherit;
    }
    .readme ul, .readme ol { padding-left: 1.5rem; margin: 0.5rem 0; }
    .readme li { margin: 0.25rem 0; }
    .readme strong { font-weight: 600; }
  </style>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css">
</head>
<body>
  <div class="container">
    <div class="examples">
      <a href="${linkPrefix}dark">Example: Dark</a>
      <a href="${linkPrefix}light" class="light">Example: Light</a>
    </div>
    <div class="readme">
      ${readmeHtml}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-typescript.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"><\/script>
</body>
</html>`;
}

function markdownToHtml(md: string): string {
  let html = md;

  html = html.replace(/^# .+\n\n?/, "");
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langMap: Record<string, string> = { ts: "typescript", sh: "bash", js: "javascript" };
    const cls = lang ? ` class="language-${langMap[lang] || lang}"` : "";
    return `<pre${cls}><code${cls}>${escapeHtml(code.trim())}</code></pre>`;
  });
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>\n$1</ul>");

  const preBlocks: string[] = [];
  html = html.replace(/<pre[\s\S]*?<\/pre>/g, (match) => {
    preBlocks.push(match);
    return `%%PRE${preBlocks.length - 1}%%`;
  });

  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("%%PRE") ||
        trimmed.startsWith("<img")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n\n");

  html = html.replace(/%%PRE(\d+)%%/g, (_, i) => preBlocks[parseInt(i)]);

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
