import fs from 'fs';

// Note: Ensure you have installed qrcode
// npm install qrcode

async function main() {
    const args = process.argv.slice(2);
    const text = args[0];

    if (!text) {
        console.error('Usage: node qr.js <text-or-url>');
        process.exit(1);
    }

    console.log(`\nGenerating QR code for: "${text}"...`);

    try {
        const QRCode = await import('qrcode');
        const outputPath = 'qr-code.png';

        await QRCode.toFile(outputPath, text, {
            scale: 10,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        console.log(`✔ QR code saved to: ${outputPath}\n`);

    } catch (err) {
        console.error(`✖ QR generation failed: ${err.message}\n`);
    }
}

main().catch(console.error);
