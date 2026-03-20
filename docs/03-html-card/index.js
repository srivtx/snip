import fs from 'fs';
import { createHighlighter } from 'shiki';

const file = process.argv[2];

if (!file) {
    console.log('Usage: node index.js <file>');
    process.exit(1);
}

const code = fs.readFileSync(file, 'utf-8');

// Highlight the code (same as Step 2)
const highlighter = await createHighlighter({
    themes: ['dracula'],
    langs: ['javascript'],
});

const highlighted = highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme: 'dracula',
});

// Now wrap it in a nice HTML card
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* The gradient background behind the card */
  body {
    display: inline-flex;
    padding: 58px;
    background: linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%);
  }

  /* The dark code card */
  .card {
    background: #1e1e2e;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    min-width: 400px;
  }

  /* macOS window dots */
  .dots {
    display: flex;
    gap: 7px;
    padding: 14px 18px 0 18px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.red    { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green  { background: #28c840; }

  /* The code area */
  .code-body {
    padding: 20px 24px 24px 24px;
  }

  .code-body pre {
    margin: 0;
    background: transparent !important;
  }

  .code-body code {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 14px !important;
    line-height: 1.65 !important;
  }

  .shiki { background: transparent !important; }
</style>
</head>
<body>
  <div class="card">
    <div class="dots">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="code-body">
      ${highlighted}
    </div>
  </div>
</body>
</html>`;

// Save to a file so you can open it in your browser
fs.writeFileSync('output.html', html);
console.log('✔ saved output.html — open it in your browser!');
