# Step 12: Image Compression

High-quality screenshots can be several megabytes in size. For sharing on the web, we want them optimized. This step adds professional-grade image compression.

## What you'll learn
- High-performance image processing with `sharp`.
- Calculating file size savings.
- Balancing quality vs. file size.

## Run it

Install the `sharp` library:

```bash
npm install sharp
```

Run the optimizer:

```bash
# Compress with default (80%) quality
node compress.js image.png
```

## Key concept: Multi-format Compression

`sharp` is a lightning-fast Node.js module that supports JPEG, PNG, WEBP, and more. Different formats require different compression strategies:

- **JPEG**: Best for photos. We use `mozjpeg: true` for even better optimization.
- **PNG**: Best for screenshots and graphics. We use `palette: true` to reduce the color count.
- **WEBP**: A modern format that provides great compression for both photos and graphics.

```js
const ext = path.extname(inputPath).toLowerCase();
const image = sharp(inputPath);

if (ext === '.jpg' || ext === '.jpeg') {
    image.jpeg({ quality, mozjpeg: true });
} else if (ext === '.png') {
    image.png({ quality, palette: true });
} else if (ext === '.webp') {
    image.webp({ quality });
}

await image.toFile(outputPath);
```

## Calculating Savings
To show the user the benefit, we compare the file sizes before and after:

```js
const originalSize = fs.statSync(inputPath).size;
const newSize = fs.statSync(outputPath).size;
const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
```
