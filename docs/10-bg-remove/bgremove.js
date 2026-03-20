import fs from 'fs';
import path from 'path';

// Note: Ensure you have installed @imgly/background-removal-node
// npm install @imgly/background-removal-node

async function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];

    if (!inputPath) {
        console.error('Usage: node bgremove.js <path-to-image>');
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: File not found: ${inputPath}`);
        process.exit(1);
    }

    console.log(`\nRemoving background from ${path.basename(inputPath)}...`);
    console.log('This may take a few seconds as the local AI model runs.\n');

    try {
        // Dynamically import the heavy background-removal module
        const { removeBackground } = await import('@imgly/background-removal-node');
        
        // Remove the background
        const blob = await removeBackground(inputPath);
        
        // Convert the returned Blob into a Node Buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Figure out the output path
        const ext = path.extname(inputPath);
        const base = path.basename(inputPath, ext);
        const outputPath = `${base}-nobg.png`;

        // Write to disk
        fs.writeFileSync(outputPath, buffer);
        console.log(`✔ Saved successfully to: ${outputPath}\n`);

    } catch (err) {
        console.error(`✖ Failed to remove background: ${err.message}\n`);
    }
}

main().catch(console.error);
