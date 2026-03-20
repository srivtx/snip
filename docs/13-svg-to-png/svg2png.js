import fs from 'fs';
import path from 'path';

// Note: Ensure you have installed sharp
// npm install sharp

async function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];

    if (!inputPath || !inputPath.endsWith('.svg')) {
        console.error('Usage: node svg2png.js <path-to-svg>');
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: File not found: ${inputPath}`);
        process.exit(1);
    }

    console.log(`\nConverting ${path.basename(inputPath)} to PNG...`);

    try {
        const { default: sharp } = await import('sharp');
        const base = path.basename(inputPath, '.svg');
        const outputPath = `${base}.png`;

        await sharp(inputPath)
            .png()
            .toFile(outputPath);

        console.log(`✔ Successfully converted to: ${outputPath}\n`);

    } catch (err) {
        console.error(`✖ Conversion failed: ${err.message}\n`);
    }
}

main().catch(console.error);
