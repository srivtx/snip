# Step 27: Website Product Tours

Standard screenshots are good, but a cinematic video tour is how you truly showcase a product. This step adds the ability to generate a professional video "walkthrough" of any live website.

## What you'll learn
- Injecting a browser mockup UI (MacOS frames) into a live website.
- Creating a smooth "Cinematic Script" using `requestAnimationFrame`.
- Matching site themes (background colors) for seamless recording.

## Run it

First, make sure we have the required libraries:

```bash
npm install puppeteer-screen-recorder ffmpeg-static
```

Then generate a product tour of your landing page:

```bash
# Standard tour with MacOS window frame
node cli.js tool product-video my-cool-site.com --bg neon --duration 12000

# Pure tour (real website only, no frame)
node cli.js tool product-video my-cool-site.com --no-window --duration 15000
```

## Key concept: The Magic Container

To solve the "navbar floating outside the window" problem and bypass security blocks (iframes), we use a **Magic Container** approach:

1.  **DOM Hijack**: Instead of an iframe, we move the website's entire original `<body>` content into our custom-built MacOS window container.
2.  **Viewport Trapping**: We use CSS (`transform: translateZ(0)`) to trap fixed and sticky elements (like navbars) inside the mockup window so they don't leak out into the background.
3.  **Theme Awareness**: We detect the site's computed background color and apply it to the window frame for a perfect match.

### Cinematic Scrolling
We use a **Quadratic Ease-In-Out** function for scrolling. This means the motion starts slowly, speeds up in the middle, and slows down gracefully at the end—mimicking how a professional video editor would pan across a website.

This turns any live URL into a high-quality video production instantly!
