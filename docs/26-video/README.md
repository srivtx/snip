# Step 26: Cinematic Code Videos

Sometimes an image isn't enough to capture a large piece of code, or you want to share an engaging, smoothly scrolling animation on LinkedIn or Twitter. This step adds the ability to generate **MP4 videos** of your code snippets!

## What you'll learn
- Capturing a video stream from a headless Puppeteer browser.
- Controlling smooth scrolling via `page.evaluate`.
- Using `ffmpeg-static` so users don't have to manually install FFmpeg on their system.

## Run it

First, make sure we have the required libraries:

```bash
npm install puppeteer-screen-recorder ffmpeg-static
```

Then generate a video of a long code file:

```bash
node cli.js video my-long-script.js --theme tokyo-night
```

## Key concept: Headless Video Recording

We use `puppeteer-screen-recorder`, which hooks into Puppeteer and pipes the browser frames directly into `ffmpeg`. 

### The Scrolling Logic
To make the video engaging, we calculate if the code is taller than the viewport. If it is, we inject a script into the headless browser to slowly scroll down while recording:

```js
await page.evaluate(async (speed) => {
    await new Promise(resolve => {
        let scrolled = 0;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        const timer = setInterval(() => {
            window.scrollBy(0, speed);
            scrolled += speed;
            if (scrolled >= maxScroll) {
                clearInterval(timer);
                resolve();
            }
        }, 16); // ~60fps
    });
}, 5); // Scroll 5 pixels per frame
```

This creates a highly professional, cinematic presentation of your code!
