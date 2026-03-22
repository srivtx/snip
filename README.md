# ✂️ snip

> **The high-fidelity media engine for developers.**
> Generate snippets, diagrams, and cinematic production directly from your CLI.

[![npm version](https://img.shields.io/npm/v/@srivtx/snip.svg)](https://npmjs.org/package/@srivtx/snip)

Snip is the definitive terminal toolkit for engineering communication. Stop context switching to heavy design apps just to share a code block, create an architecture diagram, or generate a social card. 

## Installation

```bash
npm install -g @srivtx/snip
```

## Global Configuration

You can permanently save your author details (for posts/snippets) and preferences so you don't have to type them every time.

```bash
snip config --init
```
This launches an interactive wizard configuring your `~/.sniprc.json`.

---

## 🛠 Core Commands

### 1. Code Snippets
Turn source code into beautiful, syntax-highlighted PNGs within milliseconds.

```bash
# From a file (auto-detects language)
snip src/utils.js

# From clipboard
snip --paste --lang python
```

### 2. Beautiful Text Posts
Generate high-engagement social media posts for X, LinkedIn, or documentation.

```bash
# Inline text
snip post "Just shipped the new rendering engine! 🚀"

# With specific author tags
snip post "Hello World" --author "Zen" --handle "@zen" --bg neon
```

### 3. Website Mockups
Generate gorgeous Safari browser mockups from any URL or local HTML file.

```bash
snip mockup https://github.com/srivtx/snip
```

### 4. Architecture Diagrams (Mermaid)
Render Mermaid.js diagrams directly to high-res PNGs without opening a browser.

```bash
# From file
snip diagram architecture.mmd

# From clipboard
snip diagram --paste
```

### 5. Open Graph (OG) Images
Generate dynamic social preview images for your blog or website.

```bash
snip tool og "How to Build a Media Engine" --bg dawn
```

---

## 🖼 Image Utilities (`snip image`)

- **Remove Backgrounds:** `snip image bg-remove profile.jpg`
- **Compress (TinyPNG-style):** `snip image compress heavy.png --quality 80`
- **OCR (Extract Text):** `snip image ocr screenshot.png`
- **SVG to PNG:** `snip image svg2png logo.svg --width 1200`
- **Resize:** `snip image resize hero.png 1200x800`

## ⚙️ Engineering Tools (`snip tool`)

- **QR Codes:** `snip tool qr https://github.com/srivtx/snip`
- **Color Extraction:** `snip tool colors brand.png`
- **Favicons:** `snip tool favicon logo.png` *(generates all standard sizes)*
- **Base64 Encode:** `snip tool base64 image.png`

## 🎬 Video Production (`snip video`)

Create cinematic product tours and screen recordings from image sequences.

```bash
snip video product ./frames --output trailer.mp4
```

---

## Theming

Snip includes handcrafted, boutique engineering themes out of the box. Use the `--bg` flag on almost any command:

- `ocean` (Deep blues & cyans)
- `sunset` (Warm oranges & purples)
- `aurora` (Vibrant greens & blues)
- `neon` (Cyberpunk pinks & purples)
- `midnight` (Sleek, ultra-dark grayscale)
- `dawn` (Soft morning gradients)

```bash
snip main.rs --bg midnight
```

## License

MIT © Boutique Engineering Toolkit
