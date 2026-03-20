# Step 23: Image Resizing

A simple, fast utility to resize images without opening a heavy design tool.

## What you'll learn
- Basic image manipulation with `sharp`.
- Handling aspect ratios (resizing by only width or only height).

## Run it

```bash
# Resize to 800px width (height scales automatically)
node cli.js image resize image.png --width 800

# Force specific dimensions
node cli.js image resize image.png --width 400 --height 400
```

## Key concept: Proportional Scaling

By default, if you only provide `width`, `sharp` will calculate the `height` automatically to maintain the image's original aspect ratio.

```js
await sharp(inputPath)
    .resize(width, height) // if height is null, it scales proportionally
    .toFile(outputPath);
```

This is a huge time-saver for developers who just need a "smaller version" of a screenshot for a README or a site.
