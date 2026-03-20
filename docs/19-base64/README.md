# Step 19: Base64 Encoding

Sometimes you need to inline a small image directly into your CSS, HTML, or JSON. This final tool converts any file into a Base64-encoded Data URI string.

## What you'll learn
- Converting binary data to Base64 strings in Node.js.
- Constructing Data URIs for browser use.

## Run it

```bash
node cli.js tool base64 icon.png
```

## Key concept: Data URIs

A Base64 string allows you to represent an entire binary file (like a PNG) as a text string. A **Data URI** adds a prefix to that string so the browser knows how to interpret it.

```js
// 1. Read binary data
const data = fs.readFileSync(inputPath);

// 2. Convert to Base64 string
const base64Str = data.toString('base64');

// 3. Build the Data URI
const dataUri = `data:image/png;base64,${base64Str}`;
```

### Use Case
You can use the result directly in your CSS:

```css
.icon {
    background: url('data:image/png;base64,...');
}
```

This is perfect for reducing HTTP requests for small, repeated icons in a web application.
