import fs from 'fs';
import { createHighlighter } from 'shiki';

// Map file extensions to Shiki language names
const EXT_MAP = {
    js: 'javascript', ts: 'typescript', py: 'python',
    go: 'go', rs: 'rust', rb: 'ruby', java: 'java',
    c: 'c', cpp: 'cpp', css: 'css', html: 'html',
    json: 'json', sh: 'bash', md: 'markdown',
};

// Figure out the language from the filename
function detectLang(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return EXT_MAP[ext] || 'javascript';
}

// All themes we support
const THEMES = ['dracula', 'nord', 'github-dark', 'tokyo-night', 'monokai'];

let highlighter = null;

export async function renderHTML(code, options = {}) {
    const { theme = 'dracula', filename = '' } = options;
    const lang = detectLang(filename);

    // Create highlighter (only once, reuse it)
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: THEMES,
            langs: Object.values(EXT_MAP),
        });
    }

    const highlighted = highlighter.codeToHtml(code, { lang, theme });

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: inline-flex;
    padding: 58px;
    background: linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%);
  }
  .card {
    background: #1e1e2e;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    min-width: 400px;
  }
  .titlebar { display: flex; align-items: center; padding: 14px 18px 0 18px; gap: 8px; }
  .dots { display: flex; gap: 7px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot.red    { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green  { background: #28c840; }
  .filename {
    flex: 1; text-align: center;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: #6c7086; padding-right: 44px;
  }
  .code-body { padding: 20px 24px 24px 24px; }
  .code-body pre { margin: 0; background: transparent !important; }
  .code-body code {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 14px !important; line-height: 1.65 !important;
  }
  .shiki { background: transparent !important; }
</style>
</head>
<body>
  <div class="card">
    <div class="titlebar">
      <div class="dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      ${filename ? `<span class="filename">${filename}</span>` : ''}
    </div>
    <div class="code-body">${highlighted}</div>
  </div>
</body>
</html>`;
}

export { THEMES };
