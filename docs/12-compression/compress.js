import fs from 'fs';
import path from 'path';

// Note: Ensure you have installed sharp
// npm install sharp

async function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];
    const quality = parseInt(args[1], 10) || 80;

    if (!inputPath) {
        console.error('Usage: node compress.js <path-to-image> [quality]');
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: File not found: ${inputPath}`);
        process.exit(1);
    }

    console.log(`\nCompressing ${path.basename(inputPath)} (quality: ${quality})...`);

    try {
        const { default: sharp } = await import('sharp');
        const ext = path.extname(inputPath);
        const base = path.basename(inputPath, ext);
        const outputPath = `${base}-optimized.png`;

        const originalSize = fs.statSync(inputPath).size;

        await sharp(inputPath)
            .png({ quality, palette: true, compressionLevel: 9 })
            .toFile(outputPath);

        const newSize = fs.statSync(outputPath).size;
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

        console.log(`✔ Saved to: ${outputPath}`);
        console.log(`Original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(`Optimized: ${(newSize / 1024).toFixed(1)}KB`);
        console.log(`Total Savings: ${savings}%\n`);

    } catch (err) {
        console.error(`✖ Compression failed: ${err.message}\n`);
    }
}

main().catch(console.error);
