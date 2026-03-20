# Step 18: Web Favicon Generator

Whenever you start a new web project, you need a set of icons for the browser tab, the home screen, and the PWA manifest. This step automates the tedious task of resizing icons.

## What you'll learn
- Batch processing images with `sharp`.
- Standard web icon sizes and filenames.

## Run it

```bash
node cli.js tool favicon logo.png
```

## Key concept: Standard Web Icon Sizes

Different platforms require different sizes. We generate the most important ones:

- **16x16 / 32x32**: Traditional favicons for browser tabs.
- **180x180**: Apple Touch Icon for iPhone/iPad home screens.
- **192x192 / 512x512**: PWA icons for Android Chrome and desktop.

### Batch Resizing with Sharp

We loop through a list of sizes and use `sharp` to resize the source image for each:

```js
const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'apple-touch-icon.png', size: 180 },
    // ...
];

for (const s of sizes) {
    await sharp(inputPath)
        .resize(s.size, s.size)
        .toFile(path.join(outputDir, s.name));
}
```

This saves developers from manually using an online "favicon generator" every time they start a project.
