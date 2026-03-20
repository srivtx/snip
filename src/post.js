// Renders a beautiful X/Twitter-style text post card
// Used for sharing quotes, thoughts, announcements — not code

import fs from 'fs';
import path from 'path';

export function renderPostHTML(text, options = {}) {
  const {
    background = 'candy',
    author = '',
    handle = '',
    pic = '',
    dark = true,
  } = options;

  // Convert profile pic to base64 if provided
  let picBase64 = '';
  if (pic && fs.existsSync(pic)) {
    const ext = path.extname(pic).replace('.', '').toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const data = fs.readFileSync(pic);
    picBase64 = `data:${mime};base64,${data.toString('base64')}`;
  }

  // Import background CSS from existing backgrounds module
  const bgMap = {
    candy: 'linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%)',
    ocean: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
    sunset: 'linear-gradient(135deg, #F12711 0%, #f5af19 100%)',
    mint: 'linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)',
    midnight: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    neon: 'linear-gradient(135deg, #FF0099 0%, #493240 50%, #00DBDE 100%)',
    breeze: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    noir: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    aurora: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
    peach: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  };

  const bgCSS = bgMap[background] || bgMap.candy;

  const cardBg = dark ? '#15202b' : '#ffffff';
  const textColor = dark ? '#e7e9ea' : '#0f1419';
  const subColor = dark ? '#71767b' : '#536471';
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // Escape HTML
  const safeText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: ${bgCSS};
  }

  .post {
    background: ${cardBg};
    border-radius: 16px;
    padding: 28px 28px 20px 28px;
    width: 520px;
    font-family: 'Inter', -apple-system, sans-serif;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 20px 50px rgba(0, 0, 0, 0.25);
    border: 1px solid ${borderColor};
  }

  /* Author row */
  .author-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6C3CE1, #E14B9E);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .author-info {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: 700;
    font-size: 15px;
    color: ${textColor};
    line-height: 1.2;
  }

  .author-handle {
    font-size: 14px;
    color: ${subColor};
    line-height: 1.3;
  }

  /* Post text */
  .post-text {
    font-size: 17px;
    line-height: 1.55;
    color: ${textColor};
    letter-spacing: -0.01em;
    margin-bottom: 18px;
    word-wrap: break-word;
  }

  /* Timestamp */
  .timestamp {
    font-size: 13px;
    color: ${subColor};
    padding-top: 14px;
    border-top: 1px solid ${borderColor};
  }

  /* Engagement row (fake metrics) */
  .engagement {
    display: flex;
    gap: 24px;
    padding-top: 14px;
    border-top: 1px solid ${borderColor};
    margin-top: 14px;
  }

  .metric {
    font-size: 13px;
    color: ${subColor};
  }

  .metric strong {
    color: ${textColor};
    font-weight: 700;
  }

  /* Watermark */
  .watermark {
    text-align: right;
    font-size: 10px;
    color: ${subColor};
    opacity: 0.5;
    margin-top: 8px;
    font-family: 'Inter', sans-serif;
  }
</style>
</head>
<body>
  <div class="post">
    ${author ? `
    <div class="author-row">
      <div class="avatar">${picBase64 ? `<img src="${picBase64}" alt="">` : author.charAt(0).toUpperCase()}</div>
      <div class="author-info">
        <span class="author-name">${escapeHtml(author)}</span>
        ${handle ? `<span class="author-handle">@${escapeHtml(handle)}</span>` : ''}
      </div>
    </div>` : ''}
    <div class="post-text">${safeText}</div>
    <div class="timestamp">${time} · ${date}</div>
    <div class="watermark">snip</div>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
