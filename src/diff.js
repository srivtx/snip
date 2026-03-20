import { createHighlighter } from 'shiki';
import { diffLines } from 'diff';
import { getBackground } from './backgrounds.js';

export async function renderDiffHTML(file1, file2, options = {}) {
    const {
        background = 'candy',
        padding = 42,
        theme = 'dracula',
    } = options;

    const content1 = fs.readFileSync(path.resolve(file1), 'utf-8');
    const content2 = fs.readFileSync(path.resolve(file2), 'utf-8');
    const filename1 = path.basename(file1);
    const filename2 = path.basename(file2);

    const diff = diffLines(content1, content2);
    
    // Construct a diff string for Shiki's 'diff' language
    let diffStr = '';
    diff.forEach((part) => {
        const prefix = part.added ? '+' : (part.removed ? '-' : ' ');
        const lines = part.value.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();
        lines.forEach(line => {
            diffStr += `${prefix}${line}\n`;
        });
    });

    const highlighter = await createHighlighter({
        themes: [theme],
        langs: ['diff'],
    });

    const highlighted = highlighter.codeToHtml(diffStr, { lang: 'diff', theme });
    const bg = getBackground(background);

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${padding + 16}px;
    background: ${bg.css};
  }
  .card {
    background: #1e1e2e;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    min-width: 600px;
  }
  .title-bar {
    padding: 14px 18px;
    background: rgba(0,0,0,0.2);
    color: #6c7086;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    display: flex;
    justify-content: center;
  }
  .code-body { padding: 20px; }
  .shiki { background: transparent !important; }
  code { font-family: 'JetBrains Mono', monospace !important; font-size: 14px !important; }
</style>
</head>
<body>
  <div class="card">
    <div class="title-bar">${filename1} vs ${filename2}</div>
    <div class="code-body">
      ${highlighted}
    </div>
  </div>
</body>
</html>`;
}

import fs from 'fs';
import path from 'path';
