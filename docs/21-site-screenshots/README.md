# Step 21: Site Screenshots

Turn your terminal into a mini-browser. Capture high-resolution screenshots of any website with a single command.

## What you'll learn
- Navigating to URLs with Puppeteer (`page.goto`).
- Handling "Full Page" vs "Viewport" screenshots.
- Smart URL detection (adding https:// automatically).

## Run it

```bash
# Standard screenshot
node cli.js site google.com

# Full page screenshot
node cli.js site github.com --full

# Mobile view
node cli.js site apple.com --width 375 --height 812
```

## Key concept: page.goto()

Unlike previous steps where we used `page.setContent(html)`, here we tell the headless browser to visit a real web address.

```js
await page.goto(url, { waitUntil: 'networkidle2' });
```

We use `networkidle2` to ensure the screenshot only happens after most images and scripts have finished loading.
