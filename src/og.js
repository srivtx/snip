import { getBackground } from './backgrounds.js';
import fs from 'fs';
import path from 'path';

export function renderOGHTML(title, description, options = {}) {
    const {
        background = 'candy',
        author = '',
        handle = '',
        pic = '',
        dark = true,
    } = options;

    const bg = getBackground(background);
    
    // Convert profile pic to base64 if provided
    let picBase64 = '';
    if (pic && fs.existsSync(path.resolve(pic))) {
        const ext = path.extname(pic).replace('.', '').toLowerCase();
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        const data = fs.readFileSync(path.resolve(pic));
        picBase64 = `data:${mime};base64,${data.toString('base64')}`;
    }

    const textColor = dark ? '#ffffff' : '#000000';
    const subColor = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
    const cardBg = dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
    const accentColor = '#6C3CE1'; // Primary brand purple

    // Dynamic title size based on length
    const titleSize = title.length > 40 ? '56px' : (title.length > 20 ? '72px' : '88px');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Plus+Jakarta+Sans:wght@800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${bg.css};
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── Decorative Background Elements ── */
  .noise {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  .flare {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    top: -200px;
    right: -100px;
    pointer-events: none;
  }

  /* ── Main Card ── */
  .card {
    width: 1080px;
    height: 510px;
    background: ${cardBg};
    backdrop-filter: blur(30px) saturate(150%);
    border-radius: 40px;
    padding: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 
      0 4px 24px rgba(0,0,0,0.1),
      0 40px 80px rgba(0,0,0,0.3);
    position: relative;
    z-index: 10;
  }

  .content-header {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .badge {
    display: inline-block;
    padding: 6px 16px;
    background: ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    color: ${subColor};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    width: fit-content;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: ${titleSize};
    font-weight: 800;
    color: ${textColor};
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-top: 10px;
  }

  .description {
    font-size: 30px;
    color: ${subColor};
    line-height: 1.5;
    max-width: 850px;
    font-weight: 400;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: auto;
  }

  .author-group {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 24px; /* Squircle */
    background: linear-gradient(135deg, #6C3CE1, #E14B9E);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 28px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .author-name {
    font-weight: 700;
    font-size: 24px;
    color: ${textColor};
  }

  .author-handle {
    font-size: 18px;
    color: ${dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)'};
    font-weight: 500;
  }

  .brand-mark {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .brand-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 32px;
    color: ${textColor};
    letter-spacing: -1.5px;
    opacity: 0.8;
  }
</style>
</head>
<body>
  <div class="noise"></div>
  <div class="flare"></div>
  
  <div class="card">
    <div class="content-header">
      <div class="badge">Article</div>
      <h1 class="title">${escapeHtml(title)}</h1>
      ${description ? `<p class="description">${escapeHtml(description)}</p>` : ''}
    </div>
    
    <div class="footer">
      ${author ? `
      <div class="author-group">
        <div class="avatar">
          ${picBase64 ? `<img src="${picBase64}" alt="">` : author.charAt(0).toUpperCase()}
        </div>
        <div class="author-info">
          <span class="author-name">${escapeHtml(author)}</span>
          ${handle ? `<span class="author-handle">@${escapeHtml(handle)}</span>` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="brand-mark">
        <span class="brand-text">snip</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
