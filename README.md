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

## Ultra-Fast Execution (Highly Recommended)
Add this alias to your `~/.zshrc` or `~/.bashrc` to run the tool through Bun's engine. This makes execution near-instant by skipping Node's startup overhead:
```bash
alias snip="bunx --bun @srivtx/snip"
```

To remove the alias, run `unalias snip` or delete the line from your shell profile.
```

## Setup & Configuration
You can set your default author name, social handle, and profile picture so you don't have to type them as flags every time.
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

### 2. Website Product Tours
Generate professional, cinematically scrolling videos of any landing page.
```bash
# Standard tour with MacOS window frame
snip tool product-video my-site.com --duration 12000

# Professional linear tour (perfect constant speed)
snip tool product-video my-site.com --linear

# Pure tour (real website only, no frame)
snip tool product-video my-site.com --no-window
```

### 3. Open Graph & Social Cards
Generate social share images or text-based achievement cards.
```bash
# Open Graph (OG) Image
snip tool og "How to Build a CLI" --description "A deep dive into Node.js"

# Achievement Post
snip post "Just reached 1000 stars on GitHub!" --bg candy
```

### 4. Mockups & Screenshots
Wrap elements in high-quality hardware frames.
```bash
# Wrap a screenshot in a MacOS frame
snip mockup screenshot.png --type macos

# High-res website screenshot
snip site google.com --full
```

### 5. Diagrams
Render Mermaid.js diagrams to high-res PNGs.
```bash
snip diagram architecture.mmd
snip diagram --paste
```

---

## Image & Developer Utilities

Local, privacy-first processing tools. No data ever leaves your machine.

- `snip image bg-remove profile.jpg` (Remove background with AI)
- `snip image compress heavy.png --quality 80`
- `snip image ocr screenshot.png` (Extract text)
- `snip image resize hero.png --width 1200`
- `snip image palette photo.jpg` (Extract hex codes)

- `snip tool qr https://google.com`
- `snip tool svg logo.svg` (SVG to PNG)
- `snip tool favicon logo.png` (Generate all favicon sizes)
- `snip tool color #ff0055` (Color analysis)
- `snip tool diff file1.js file2.js` (Visual code diff)

---

## Themes & Backgrounds
Most commands support the `--bg` flag. Available presets:
- `ocean`, `sunset`, `aurora`, `neon`, `midnight`, `dawn`, `candy`, `emerald`, `boring`.

---

## License
MIT
