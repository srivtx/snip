# Step 13: SVG to PNG Conversion

Developers often deal with SVG icons but need PNGs for presentations, social media, or documentation. Since we already have `sharp`, this is an easy addition!

## What you'll learn
- Converting vector graphics (SVG) to raster images (PNG).
- Handling different input formats with the same engine.

## Run it

```bash
node svg2png.js icon.svg
```

## Key concept: Vector to Raster

SVGs are XML code (vectors), while PNGs are pixels (rasters). `sharp` handles the "rasterization" process automatically.

```js
import sharp from 'sharp';

await sharp('icon.svg')
    .png() // Convert the input stream to PNG
    .toFile('icon.png');
```

This is much faster and simpler than opening a design tool like Figma or Inkscape just to export a single icon.
