# Build Snip from Scratch

A step-by-step guide to building a CLI tool that generates beautiful code snippet images — like Carbon, but from your terminal.

Each step is a **working, runnable version** of the tool. Start from Step 1 and work your way up. Every step adds one new concept on top of the previous one.

## Steps

| Step | What you'll learn | Files |
|------|-------------------|-------|
| [01](./01-read-a-file/) | Read a file from disk | `index.js` |
| [02](./02-syntax-highlighting/) | Highlight code with Shiki | `index.js` |
| [03](./03-html-card/) | Wrap code in a styled HTML card | `index.js` |
| [04](./04-screenshot/) | Screenshot HTML → PNG with Puppeteer | `index.js`, `screenshot.js` |
| [05](./05-cli-args/) | Parse CLI arguments with Commander.js | `cli.js`, `render.js`, `screenshot.js` |
| [06](./06-themes-and-backgrounds/) | Add multiple themes + gradient backgrounds | `cli.js`, `render.js`, `screenshot.js`, `backgrounds.js` |
| [07](./07-pipe-and-paste/) | Pipe input + interactive paste mode | `cli.js`, `render.js`, `screenshot.js`, `backgrounds.js` |
| [08](./08-clipboard/) | Auto-copy image to clipboard | all files |
| [09](./09-auto-detect/) | Auto-detect language from code content | all files + `detect.js` |
| [10](./10-bg-remove/) | Local AI background removal | `cli.js`, `bgremove.js` |
| [11](./11-ocr/) | Extract text from images (OCR) | `cli.js`, `ocr.js` |
| [12](./12-compression/) | Professional image optimization | `cli.js`, `compress.js` |
| [13](./13-svg-to-png/) | SVG vector to PNG conversion | `cli.js`, `svg2png.js` |
| [14](./14-qr-code/) | Terminal QR code generator | `cli.js`, `qr.js` |
| [15](./15-diagrams/) | Mermaid.js diagram generator | `cli.js`, `src/mermaid.js` |
| [16](./16-subcommands/) | Refactoring to Subcommands | `cli.js` |
| [17](./17-color-palette/) | Dominant color extraction | `cli.js` |
| [18](./18-favicons/) | Web favicon asset generator | `cli.js` |
| [19](./19-base64/) | Base64 file encoding | `cli.js` |
| [20](./20-mockups/) | MacOS/Browser Window Mockups | `cli.js`, `src/mockup.js` |
| [21](./21-site-screenshots/) | Website high-res screenshots | `cli.js`, `src/screenshot.js` |
| [22](./22-visual-diff/) | Visual code difference images | `cli.js`, `src/diff.js` |
| [23](./23-image-resize/) | Fast image resizing | `cli.js` |
| [24](./24-color-theory/) | Terminal color analysis utility | `cli.js`, `src/color.js` |
| [25](./25-og-images/) | Open Graph social share images | `cli.js`, `src/og.js` |
| [26](./26-video/) | Cinematic Code Videos | `cli.js`, `src/video.js` |
| [27](./27-product-tours/) | Website Product Tours | `cli.js`, `src/product-video.js` |
| [29](./29-centering/) | Vertical & Horizontal Centering | `src/video.js` |

## Prerequisites

```bash
npm init -y
npm install shiki puppeteer commander
```

## How to use each step

```bash
cd docs/01-read-a-file
node index.js
```

Each folder has its own `README.md` explaining exactly what's happening.
