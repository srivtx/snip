# Step 10: Background Removal

Sometimes you don't want to capture code—you just want to take an image of yourself or a logo and strip out the background. Instead of relying on a paid API, we can use a local AI model to remove backgrounds right from our CLI!

## What you'll learn
- Running an AI model locally using `@imgly/background-removal-node`
- Why and how to use **Dynamic Imports** in Node.js
- Converting web-standard `Blob` objects into Node.js `Buffer` objects

## Run it

First, install the required library (if you haven't already):

```bash
npm install @imgly/background-removal-node
```

Then run the script with a sample image:

```bash
node bgremove.js /path/to/profile.jpg
```

Output: A new file named `profile-nobg.png` with a transparent background!

---

## Step-by-Step Breakdown

Let's look at the core concepts inside `bgremove.js`.

### 1. The Dynamic Import
Usually, we import packages at the top of our file like `import fs from 'fs'`. But AI models are **heavy**. If we imported the background removal tool at the top of our CLI, it would slow down *every* command—even just generating simple code snippets!

To fix this, we import it **dynamically**, only when the user specifically requests background removal:

```js
// This only runs when we actually need it!
const { removeBackground } = await import('@imgly/background-removal-node');
```

### 2. Processing the Image
The `removeBackground` function is incredibly simple. We just pass it the path to our image. Behind the scenes, it loads an ONNX AI model and separates the subject from the background.

```js
const blob = await removeBackground(inputPath);
```

### 3. Blobs vs. Buffers
The library gives us back a `Blob`. Blobs are standard in web browsers, but Node.js uses `Buffer` objects to write binary data to the filesystem. We need to bridge the gap:

```js
// 1. Get raw binary data from the Blob
const arrayBuffer = await blob.arrayBuffer();

// 2. Convert it into a Node.js Buffer
const buffer = Buffer.from(arrayBuffer);
```

### 4. Saving the Result
Finally, we create a new filename (appending `-nobg.png`) and write the `Buffer` to disk.

```js
// Write the buffer to the filesystem
fs.writeFileSync('output-nobg.png', buffer);
```

And just like that, you have a local, free, offline background remover built right into your code snippet tool!
