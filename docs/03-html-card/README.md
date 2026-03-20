# Step 3: HTML Card Template

Now we wrap the highlighted code inside a beautiful HTML card — with a dark background, rounded corners, padding, and macOS-style window dots.

## What's new from Step 2
- We build a full HTML page with CSS styling
- The card has a dark background, padding, rounded corners
- macOS-style red/yellow/green dots at the top
- Uses JetBrains Mono font (loaded from Google Fonts)
- The HTML is saved to a file so you can open it in your browser

## Run it

```bash
node index.js sample.js
```

Then open `output.html` in your browser to see the result.

## Key concept: HTML template

We're building an HTML string with template literals:

```js
const fullHTML = `
<html>
<head><style>
  .card {
    background: #1e1e2e;
    border-radius: 14px;
    padding: 24px;
  }
</style></head>
<body>
  <div class="card">${highlightedCode}</div>
</body>
</html>`;
```

This is the "template" that makes it look like a code card instead of raw code.
