# Step 4: Screenshot → PNG

This is the magic step. We take our HTML card and screenshot it into an actual PNG image using **Puppeteer** (a headless browser).

## What's new from Step 3
- We split the code into two files: `index.js` and `screenshot.js`
- `screenshot.js` opens a headless Chrome browser, loads the HTML, and takes a screenshot
- The output is a real `.png` file you can share on Twitter/X

## Run it

```bash
node index.js sample.js
```

Output: `snippet.png`

## Key concept: Puppeteer

Puppeteer is a library that controls Chrome without opening a visible window.
We use it to:
1. Load our HTML card
2. Wait for fonts to load
3. Take a screenshot of just the card
4. Save it as a PNG

```js
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html);
const screenshot = await page.screenshot({ type: 'png' });
await browser.close();
```

## Why two files now?

We're starting to separate concerns:
- `index.js` → reads code, highlights it, builds the HTML
- `screenshot.js` → takes HTML and converts it to an image

This makes the code easier to understand and change.
