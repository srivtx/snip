# Step 17: Color Palette Extraction

Developers often need to grab colors from a design or an image to use in their CSS or themes. This step adds a utility to extract the dominant colors from any image.

## What you'll learn
- Extracting raw pixel data with `sharp`.
- Using `get-rgba-palette` to find dominant colors.
- Displaying "truecolor" swatches in the terminal using ANSI escape codes.

## Run it

First, install the palette library:

```bash
npm install get-rgba-palette
```

Then run the extractor:

```bash
node cli.js image palette logo.png
```

## Key concept: Pixel Analysis

To find the dominant colors, we don't need to look at every single pixel of a 4K image. We resize it down first to save memory and time:

```js
const { data } = await sharp(inputPath)
    .resize(200, 200) // Small enough to be fast, large enough to be accurate
    .raw()
    .toBuffer({ resolveWithObject: true });

const colors = getPalette(data, 5); // Get top 5 colors
```

### Terminal Color Swatches
To show the colors directly in your terminal, we use ANSI "truecolor" codes (`\x1b[48;2;R;G;Bm`):

```js
// This prints a colored block in your terminal
console.log(`\x1b[48;2;${r};${g};${b}m      \x1b[0m #FFFFFF`);
```
