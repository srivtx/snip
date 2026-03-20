import { getBackground } from './backgrounds.js';
import fs from 'fs';
import path from 'path';

/**
 * Generates HTML for a mockup frame (MacOS/Browser) around an image or HTML content.
 */
export function renderMockupHTML(content, options = {}) {
    const {
        background = 'candy',
        padding = 64,
        type = 'macos', // macos or browser
        isImage = true,
        dark = true,
    } = options;

    const bg = getBackground(background);
    
    let innerContent = '';
    if (isImage) {
        const imageBuffer = fs.readFileSync(path.resolve(content));
        const base64Image = imageBuffer.toString('base64');
        const ext = path.extname(content).slice(1);
        innerContent = `<img src="data:image/${ext};base64,${base64Image}" style="display: block; width: 100%; height: auto;" />`;
    } else {
        innerContent = content;
    }

    const titleBarBg = dark ? '#2e2e3e' : '#f0f0f0';
    const textColor = dark ? '#cdd6f4' : '#45475a';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
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
    padding: ${padding}px;
    background: ${bg.css};
    min-height: 100px;
  }

  .mockup-container {
    background: ${dark ? '#1e1e2e' : '#ffffff'};
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    max-width: 1000px;
    width: 100%;
  }

  /* ── Title Bar (MacOS Style) ── */
  .title-bar {
    background: ${titleBarBg};
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  }

  .dots {
    display: flex;
    gap: 7px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.red    { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green  { background: #28c840; }

  .url-bar {
    flex: 1;
    background: ${dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)'};
    height: 24px;
    border-radius: 6px;
    margin: 0 40px 0 20px;
    display: ${type === 'browser' ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 11px;
    color: ${textColor};
    opacity: 0.6;
  }

  .content-area {
    position: relative;
    background: ${dark ? '#1e1e2e' : '#ffffff'};
  }
</style>
</head>
<body>
  <div class="bg-wrapper">
    <div class="mockup-container">
      <div class="title-bar">
        <div class="dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="url-bar">example.com</div>
      </div>
      <div class="content-area">
        ${innerContent}
      </div>
    </div>
  </div>
</body>
</html>`;
}
