export function buildIndexPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>card.ooo — 3D virtual business cards</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #faf9f7;
      color: #222;
      line-height: 1.6;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    header {
      margin-bottom: 2rem;
    }
    header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    header p {
      color: #666;
      margin-top: 0.25rem;
    }
    .editor {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 800px) {
      .editor {
        grid-template-columns: 1fr;
      }
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .form label {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #555;
    }
    .form input {
      padding: 0.5rem 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.85rem;
      font-family: inherit;
      background: #fff;
      transition: border-color 0.15s;
    }
    .form input:focus, .form select:focus {
      outline: none;
      border-color: #888;
    }
    .form select {
      padding: 0.5rem 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.85rem;
      font-family: inherit;
      background: #fff;
      transition: border-color 0.15s;
      width: 100%;
    }
    .form-section {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #999;
      margin-top: 0.5rem;
    }
    .color-row {
      display: flex;
      gap: 0.5rem;
    }
    .color-row label {
      flex: 1;
    }
    .color-row input[type="color"] {
      padding: 0.2rem;
      height: 2rem;
      cursor: pointer;
    }
    .preview-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .preview-frame {
      width: 100%;
      aspect-ratio: 16 / 10;
      border: 1px solid #e0ddd8;
      border-radius: 8px;
      background: #e8e4df;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary {
      background: #111;
      color: #fff;
    }
    .btn-secondary {
      background: #e8e4df;
      color: #333;
    }
    .btn-success {
      background: #2d7d46;
      color: #fff;
    }
    .fullscreen-link {
      font-size: 0.8rem;
      color: #888;
      text-decoration: none;
    }
    .fullscreen-link:hover { color: #444; }
    .usage {
      margin-top: 3rem;
      border-top: 1px solid #e0ddd8;
      padding-top: 2rem;
    }
    .usage h2 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }
    .usage p {
      margin: 0.5rem 0;
      color: #444;
    }
    .usage pre {
      background: #1a1a1a;
      color: #e0e0e0;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0.75rem 0;
      font-size: 0.75rem;
      line-height: 1.5;
    }
    .usage code {
      font-family: "SF Mono", "Fira Code", monospace;
    }
    .usage p code {
      background: #eee;
      padding: 0.15em 0.35em;
      border-radius: 3px;
      font-size: 0.8em;
    }
  </style>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>card.ooo</h1>
      <p>Interactive 3D virtual business cards. Edit below, copy the HTML, host it anywhere.</p>
    </header>

    <div class="editor">
      <div class="form">
        <label>Name <input type="text" id="f-name" value="Zachary Davison"></label>
        <label>Job Title <input type="text" id="f-jobTitle" value="Co-Founder"></label>
        <label>Organization <input type="text" id="f-org" value="Little Tone Records"></label>
        <label>Email <input type="email" id="f-email" value="hello@example.com"></label>
        <label>Phone <input type="text" id="f-phone" value="+1 555 867 5309"></label>
        <label>Website <input type="url" id="f-url" value="https://example.com"></label>
        <label>Logo URL <input type="text" id="f-logo" value="" placeholder="optional"></label>

        <div class="form-section">Theme</div>
        <label>Font
          <select id="f-font">
            <option value="system-ui, -apple-system, sans-serif">System UI</option>
            <option value="'Inter', sans-serif" data-gfont="Inter">Inter</option>
            <option value="'DM Sans', sans-serif" data-gfont="DM+Sans">DM Sans</option>
            <option value="'Space Grotesk', sans-serif" data-gfont="Space+Grotesk">Space Grotesk</option>
            <option value="'IBM Plex Sans', sans-serif" data-gfont="IBM+Plex+Sans">IBM Plex Sans</option>
            <option value="'JetBrains Mono', monospace" data-gfont="JetBrains+Mono">JetBrains Mono</option>
            <option value="Georgia, 'Times New Roman', serif">Georgia</option>
          </select>
        </label>
        <div class="color-row">
          <label>Background <input type="color" id="f-bg" value="#111111"></label>
          <label>Text <input type="color" id="f-text" value="#ffffff"></label>
          <label>Accent <input type="color" id="f-accent" value="#666666"></label>
        </div>

        <div style="margin-top: 0.5rem">
          <div class="actions">
            <button class="btn btn-primary" id="btn-copy">Copy HTML</button>
            <a class="btn btn-secondary" id="btn-fullscreen" href="about:blank" target="_blank">Open fullscreen</a>
          </div>
        </div>
      </div>

      <div class="preview-area">
        <iframe class="preview-frame" id="preview" sandbox="allow-scripts"></iframe>
      </div>
    </div>

    <div class="usage">
      <h2>Use in code</h2>
      <p>Install the package to dynamically generate cards in your app:</p>
      <pre class="language-bash"><code class="language-bash">bun add card.ooo</code></pre>
      <p>Then call <code>renderCard()</code> and serve the result:</p>
      <pre class="language-typescript"><code class="language-typescript" id="code-usage"></code></pre>
      <p><code>renderCard()</code> returns a self-contained HTML page with all CSS, JS, and 3D effects inlined. No runtime dependencies — just serve the string.</p>
    </div>
  </div>

  <script src="./card.js"><\/script>
  <script>
    var fields = ['name', 'jobTitle', 'org', 'email', 'phone', 'url', 'logo'];
    var colorFields = { bg: 'background', text: 'text', accent: 'accent' };
    var preview = document.getElementById('preview');
    var btnCopy = document.getElementById('btn-copy');
    var btnFullscreen = document.getElementById('btn-fullscreen');
    var debounceTimer;
    var lastHtml = '';

    var loadedFonts = {};
    var fontSelect = document.getElementById('f-font');
    var defaultFont = 'system-ui, -apple-system, sans-serif';

    function loadGoogleFont(gfont) {
      if (!gfont || loadedFonts[gfont]) return;
      loadedFonts[gfont] = true;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=' + gfont + ':wght@400;700&display=swap';
      document.head.appendChild(link);
    }

    function getFormData() {
      var data = {};
      fields.forEach(function(f) {
        data[f] = document.getElementById('f-' + f).value;
      });
      var selectedOption = fontSelect.options[fontSelect.selectedIndex];
      var gfont = selectedOption.getAttribute('data-gfont');
      if (gfont) loadGoogleFont(gfont);
      var fontFamily = fontSelect.value;
      data.theme = {
        background: document.getElementById('f-bg').value,
        text: document.getElementById('f-text').value,
        accent: document.getElementById('f-accent').value,
        fontFamily: fontFamily,
      };
      if (gfont) {
        data.fontFaces = '@import url("https://fonts.googleapis.com/css2?family=' + gfont + ':wght@400;700&display=swap");';
      }
      if (!data.logo) delete data.logo;
      return data;
    }

    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function buildCodeSnippet(data) {
      var pad = '  ';
      var lines = ['import { renderCard } from "card.ooo";', '', 'const html = await renderCard({'];
      lines.push(pad + 'name:     "' + escHtml(data.name) + '",');
      lines.push(pad + 'jobTitle: "' + escHtml(data.jobTitle) + '",');
      lines.push(pad + 'org:      "' + escHtml(data.org) + '",');
      lines.push(pad + 'email:    "' + escHtml(data.email) + '",');
      lines.push(pad + 'phone:    "' + escHtml(data.phone) + '",');
      lines.push(pad + 'url:      "' + escHtml(data.url) + '",');
      if (data.logo) {
        lines.push(pad + 'logo:     "' + escHtml(data.logo) + '",');
      }
      var bg = data.theme.background;
      var tx = data.theme.text;
      var ac = data.theme.accent;
      var ff = data.theme.fontFamily;
      var hasTheme = bg !== '#111111' || tx !== '#ffffff' || ac !== '#666666' || ff !== defaultFont;
      if (hasTheme) {
        lines.push(pad + 'theme: {');
        if (bg !== '#111111') lines.push(pad + '  background: "' + bg + '",');
        if (tx !== '#ffffff') lines.push(pad + '  text:       "' + tx + '",');
        if (ac !== '#666666') lines.push(pad + '  accent:     "' + ac + '",');
        if (ff !== defaultFont) lines.push(pad + '  fontFamily: "' + escHtml(ff) + '",');
        lines.push(pad + '},');
      }
      lines.push('});');
      lines.push('');
      lines.push('Bun.serve({');
      lines.push('  routes: {');
      lines.push('    "/card": () =&gt; new Response(html, {');
      lines.push('      headers: { "content-type": "text/html" },');
      lines.push('    }),');
      lines.push('  },');
      lines.push('});');
      return lines.join('\\n');
    }

    function updateCode(data) {
      var el = document.getElementById('code-usage');
      el.innerHTML = buildCodeSnippet(data);
      if (window.Prism) Prism.highlightElement(el);
    }

    function update() {
      var data = getFormData();
      updateCode(data);
      renderCard(data).then(function(html) {
        lastHtml = html;
        preview.srcdoc = html;
        var blob = new Blob([html], { type: 'text/html' });
        btnFullscreen.href = URL.createObjectURL(blob);
      });
    }

    function debouncedUpdate() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(update, 200);
    }

    // Bind all inputs
    fields.forEach(function(f) {
      document.getElementById('f-' + f).addEventListener('input', debouncedUpdate);
    });
    Object.keys(colorFields).forEach(function(f) {
      document.getElementById('f-' + f).addEventListener('input', debouncedUpdate);
    });
    fontSelect.addEventListener('change', debouncedUpdate);

    // Copy button
    btnCopy.addEventListener('click', function() {
      if (!lastHtml) return;
      navigator.clipboard.writeText(lastHtml).then(function() {
        var orig = btnCopy.textContent;
        btnCopy.textContent = 'Copied!';
        btnCopy.className = 'btn btn-success';
        setTimeout(function() {
          btnCopy.textContent = orig;
          btnCopy.className = 'btn btn-primary';
        }, 1500);
      });
    });

    // Initial render
    update();
  <\/script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-typescript.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"><\/script>
</body>
</html>`;
}
