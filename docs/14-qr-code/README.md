# Step 14: QR Code Generation

The final utility: generating QR codes directly from the terminal. Perfect for sharing links from your laptop to your phone instantly.

## What you'll learn
- Generating complex matrix barcodes programmatically.
- Using `qrcode` to export images.

## Run it

Install the QR library:

```bash
npm install qrcode
```

Generate a code:

```bash
node qr.js "https://google.com"
```

## Key concept: The QR Pipeline

We take a string (URL or text) and use the `qrcode` library to calculate the grid of squares and save it as an image.

```js
import QRCode from 'qrcode';

await QRCode.toFile('qr-code.png', 'Your text here', {
    scale: 10,       // Makes the image larger/crisper
    margin: 2,      // Adds a white border around the code
    color: {
        dark: '#000000',  // The black squares
        light: '#ffffff'  // The white background
    }
});
```
