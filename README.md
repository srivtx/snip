# snip

A fast, local CLI tool for generating high-quality code snippets, social cards, mockups, and diagrams. It runs entirely on your machine without making API calls to third-party services.

[![npm version](https://img.shields.io/npm/v/@srivtx/snip.svg)](https://npmjs.org/package/@srivtx/snip)

## Installation

We heavily recommend using `bun` because it skips the slow Puppeteer Chromium download time. 

**Using Bun (Fastest)**
```bash
bun add -g @srivtx/snip --trusted
```

**Using npm**
```bash
npm install -g @srivtx/snip
```

### Ultra-Fast Execution (Optional)
Even if you install with Bun, the CLI runs on Node.js. To force it to run inside Bun's hyper-fast engine and execute instantly, add this alias to your `~/.zshrc` or `~/.bashrc`:
```bash
alias snip="bunx --bun snip"
```

## Setup

You can set your default author name, social handle, and preferred theme so you don't have to type them as flags every time.

```bash
snip config --init
```

---

## Commands

### 1. Code Snippets
Turn local files or clipboard data into syntax-highlighted PNGs.

```bash
# Reads file and auto-detects language
snip src/utils.js

# Reads directly from clipboard 
snip --paste --lang python
```

### 2. Social Posts
Generate text-based social media cards (like X or LinkedIn posts) with your author attribution.

```bash
snip post "Just shipped the new rendering engine!" --author "Zen" --handle "@zen" --bg neon
```

### 3. Website Mockups
Wrap a URL or local HTML file in a Safari browser frame.

```bash
snip mockup https://github.com/srivtx/snip
```

### 4. Diagrams
Render Mermaid.js diagrams to high-res PNGs.

```bash
snip diagram architecture.mmd
snip diagram --paste
```

### 5. Open Graph Images
Quickly generate an OG image for a blog post or website.

```bash
snip tool og "How to Build a CLI" --bg dawn
```

---

## Image Utilities

We added some local image processing utilities so you don't need to open Photoshop.

- `snip image bg-remove profile.jpg` (Removes background locally using AI)
- `snip image compress heavy.png --quality 80` (Fast TinyPNG alternative)
- `snip image ocr screenshot.png` (Extracts text from images)
- `snip image svg2png logo.svg --width 1200`
- `snip image resize hero.png 1200x800`

## Developer Tools

Quick tools for common web-dev tasks.

- `snip tool qr https://github.com/srivtx/snip`
- `snip tool colors brand.png` (Extract dominant palette)
- `snip tool favicon logo.png` (Generates all standard `.ico` and `.png` sizes)
- `snip tool base64 image.png`

## Video

Generate scrolling `.mp4` videos from code snippets or product UI frames.

```bash
snip video product ./frames --output trailer.mp4
```

---

## Themes

Use the `--bg` flag on almost any command to apply a custom background gradient. Available themes:

- `ocean`
- `sunset`
- `aurora`
- `neon`
- `midnight`
- `dawn`

```bash
snip main.rs --bg midnight
```

## License

MIT
