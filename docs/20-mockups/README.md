# Step 20: Window Mockups

Give your images a premium feel by wrapping them in a MacOS or Browser window frame.

## What you'll learn
- Using CSS to build realistic window decorations (dots, address bars).
- Using "Glassmorphism" (backdrop-filter) for premium UI effects.
- Embedding images into dynamic HTML using Base64.

## Run it

```bash
node cli.js mockup profile.jpg --type macos --bg neon
```

## Key concept: The Frame Template

We build a custom HTML wrapper that places your image inside a "mockup container".

```js
const html = `
<div class="mockup-container">
  <div class="title-bar">
    <div class="dots">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
  </div>
  <div class="content-area">
    <img src="data:image/png;base64,..." />
  </div>
</div>
`;
```

This turns a plain screenshot into a professional marketing asset instantly.
