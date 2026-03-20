# Step 11: OCR (Extract Text from Image)

Ever seen a screenshot of code on Twitter or a slide and wished you could just copy it? This step adds Optical Character Recognition (OCR) to our tool.

## What you'll learn
- Using `tesseract.js` for local OCR.
- Handling asynchronous worker lifecycles.
- Extracting raw text from binary image data.

## Run it

First, install the OCR engine:

```bash
npm install tesseract.js
```

Then run it on an image:

```bash
node ocr.js sample-screenshot.png
```

## Key concept: Tesseract Workers

`tesseract.js` uses "Workers" to handle the heavy lifting of image processing without blocking the main thread.

```js
const { createWorker } = await import('tesseract.js');

// 1. Initialize the worker with a language (e.g., 'eng')
const worker = await createWorker('eng');

// 2. Recognize text from the image path
const { data: { text } } = await worker.recognize(imagePath);

// 3. Clean up the worker to free memory
await worker.terminate();

console.log(text);
```

By adding this to our CLI, we turn "static" images back into "dynamic" editable code.
