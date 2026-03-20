import { createHighlighter } from 'shiki';
import { getBackground } from './backgrounds.js';

// All themes we ship with
const THEMES = [
  'dracula',
  'nord',
  'github-dark',
  'tokyo-night',
  'monokai',
  'one-dark-pro',
  'vitesse-dark',
  'material-theme-darker',
  'catppuccin-mocha',
  'slack-dark',
];

let highlighterInstance = null;

async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: THEMES,
      langs: [
        'javascript', 'typescript', 'python', 'go', 'rust', 'java',
        'c', 'cpp', 'csharp', 'ruby', 'php', 'swift', 'kotlin',
        'html', 'css', 'json', 'yaml', 'toml', 'markdown',
        'bash', 'shell', 'sql', 'graphql', 'dockerfile',
        'jsx', 'tsx', 'vue', 'svelte',
      ],
    });
  }
  return highlighterInstance;
}

// Map common file extensions to shiki language ids
const EXT_MAP = {
  js: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', mts: 'typescript', cts: 'typescript',
  jsx: 'jsx', tsx: 'tsx',
  py: 'python',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c', h: 'c',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
  cs: 'csharp',
  rb: 'ruby',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin', kts: 'kotlin',
  html: 'html', htm: 'html',
  css: 'css', scss: 'css',
  json: 'json',
  yml: 'yaml', yaml: 'yaml',
  toml: 'toml',
  md: 'markdown',
  sh: 'bash', bash: 'bash', zsh: 'bash',
  sql: 'sql',
  graphql: 'graphql', gql: 'graphql',
  dockerfile: 'dockerfile',
  vue: 'vue',
  svelte: 'svelte',
};

export function detectLang(filename) {
  if (!filename) return 'javascript';
  const ext = filename.split('.').pop().toLowerCase();
  return EXT_MAP[ext] || 'javascript';
}

export async function renderHTML(code, options = {}) {
  const {
    theme = 'dracula',
    lang = 'javascript',
    background = 'candy',
    showLineNumbers = true,
    filename = '',
    padding = 42,
  } = options;

  const highlighter = await getHighlighter();
  const highlightedCode = highlighter.codeToHtml(code.trimEnd(), {
    lang,
    theme,
  });

  const bg = getBackground(background);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    margin: 0;
    padding: 0;
    display: inline-block;
  }

  .bg-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${padding + 16}px;
    background: ${bg.css};
    min-height: 100px;
  }

  .card {
    background: #1e1e2e;
    border-radius: 14px;
    overflow: hidden;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.15),
      0 20px 60px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.06);
    max-width: 800px;
    min-width: 400px;
  }

  /* ── Title bar ── */
  .titlebar {
    display: flex;
    align-items: center;
    padding: 14px 18px 0 18px;
    gap: 8px;
    user-select: none;
  }

  .dots {
    display: flex;
    gap: 7px;
    flex-shrink: 0;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.red    { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green  { background: #28c840; }

  .filename {
    flex: 1;
    text-align: center;
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #6c7086;
    letter-spacing: 0.3px;
    padding-right: 44px; /* offset the dots so text is visually centered */
  }

  /* ── Code area ── */
  .code-body {
    padding: 20px 24px 24px 24px;
  }

  .code-body pre {
    margin: 0;
    padding: 0;
    background: transparent !important;
  }

  .code-body code {
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace !important;
    font-size: 14px !important;
    line-height: 1.65 !important;
    letter-spacing: 0.2px;
  }

  /* Shiki generates a <pre> with background — override */
  .shiki { background: transparent !important; }

  /* ── Line numbers ── */
  .line-numbers {
    display: flex;
  }

  .line-numbers .gutter {
    padding-right: 18px;
    text-align: right;
    user-select: none;
    color: #454759;
    font-family: 'JetBrains Mono', 'SF Mono', monospace;
    font-size: 13px;
    line-height: 1.65;
    min-width: 32px;
    flex-shrink: 0;
  }

  .line-numbers .lines {
    flex: 1;
    overflow-x: auto;
  }

  /* ── Watermark ── */
  .watermark {
    text-align: right;
    padding: 0 24px 12px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #3b3d52;
    letter-spacing: 0.5px;
    user-select: none;
  }
</style>
</head>

<body>
  <div class="bg-wrapper">
    <div class="card">
      <div class="titlebar">
        <div class="dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        ${filename ? `<span class="filename">${escapeHtml(filename)}</span>` : ''}
      </div>
      <div class="code-body">
        ${showLineNumbers ? wrapWithLineNumbers(highlightedCode) : highlightedCode}
      </div>
      <div class="watermark">snip</div>
    </div>
  </div>
</body>
</html>`;
}

function wrapWithLineNumbers(html) {
  // Extract the inner code content from shiki's output
  // Shiki wraps in <pre class="shiki ..."><code>...</code></pre>
  const codeMatch = html.match(/<code>([\s\S]*?)<\/code>/);
  if (!codeMatch) return html;

  const inner = codeMatch[1];
  const lines = inner.split('\n');
  // Remove trailing empty line that shiki adds
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  const gutterLines = lines.map((_, i) => `<div>${i + 1}</div>`).join('\n');
  const codeLines = lines.join('\n');

  // Extract the pre/code classes from original
  const preMatch = html.match(/<pre([^>]*)>/);
  const preAttrs = preMatch ? preMatch[1] : '';

  return `<div class="line-numbers">
    <div class="gutter">${gutterLines}</div>
    <div class="lines"><pre${preAttrs}><code>${codeLines}</code></pre></div>
  </div>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export { THEMES };
