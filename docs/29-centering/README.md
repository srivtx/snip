# Step 29: Cinematic Centering

In previous steps, our videos just rendered the code card at the top-left of the screen. In this step, we upgrade the production quality by centering the content and adding smooth padding.

## What you'll learn
- Using Flexbox to center dynamic content in a Puppeteer viewport.
- Handling scrolling logic for centered containers.
- Adding "breathing room" (vertical padding) to generated videos.

## Key concept: The Centering Wrapper

We wrap the generated code HTML in a new parent container that uses CSS Flexbox to ensure the card is always perfectly horizontal-centered, regardless of its width.

```css
#centering-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 80px 0; /* Vertical breathing room */
}
```

### Scrolling Impact
Because the content is now inside a centered wrapper, we had to update our scrolling engine to scroll the **entire page** (`document.documentElement`) instead of just the internal code card. This makes the video feel more cinematic, like a camera panning over a document.

```js
const maxScroll = await page.evaluate(() => 
    document.documentElement.scrollHeight - window.innerHeight
);

window.scrollTo(0, totalToScroll * ease);
```

This tiny adjustment makes your generated videos look 10x more professional!
