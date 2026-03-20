import fs from 'fs';
import path from 'path';

// Note: Ensure you have installed tesseract.js
// npm install tesseract.js

async function main() {
    const args = process.argv.slice(2);
    const inputPath = args[0];

    if (!inputPath) {
        console.error('Usage: node ocr.js <path-to-image>');
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: File not found: ${inputPath}`);
        process.exit(1);
    }

    console.log(`\nExtracting text from ${path.basename(inputPath)}...`);

    try {
        // Dynamically import tesseract
        const { createWorker } = await import('tesseract.js');
        
        // Initialize worker
        const worker = await createWorker('eng');
        
        // Run OCR
        const { data: { text } } = await worker.recognize(inputPath);
        
        // Clean up
        await worker.terminate();

        if (!text || !text.trim()) {
            console.log('No text found in image.');
        } else {
            console.log('\n── Extracted Text ──');
            console.log(text.trim());
            console.log('────────────────────\n');
        }

    } catch (err) {
        console.error(`✖ OCR failed: ${err.message}\n`);
    }
}

main().catch(console.error);
