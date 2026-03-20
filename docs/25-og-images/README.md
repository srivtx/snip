# Step 25: Open Graph (OG) Images

Open Graph images are the images that appear when you share a link on social media (Twitter, LinkedIn, Discord). This tool automates the creation of professional OG images for your blog posts or projects.

## What you'll learn
- Standard social share dimensions (1200x630).
- Building structured layouts with CSS Flexbox.
- Reusing user configuration (author, handle, pic) across different tools.

## Run it

```bash
node cli.js tool og "My Amazing Blog Post" "A deep dive into building CLI tools with Node.js" --bg midnight
```

## Key concept: Structured Metadata Visuals

Unlike a simple code snippet, an OG image needs a clear hierarchy:
1.  **Title**: The most prominent element (large font size).
2.  **Description**: Supporting text to provide context.
3.  **Branding/Author**: Identification of who created the content.

### Implementation Details
We use a fixed viewport size in Puppeteer to ensure every OG image is exactly 1200x630 pixels:

```js
const buffer = await captureScreenshot(html, { width: 1200, height: 630 });
```

We also use `backdrop-filter: blur(20px)` on the card to create a modern "glassmorphism" effect that looks great on top of our gradient backgrounds.

This tool saves you from opening a design app every time you want to share a new link!
