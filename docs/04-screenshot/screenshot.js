import puppeteer from 'puppeteer';

// Takes an HTML string and returns a PNG buffer (image data)
export async function takeScreenshot(html) {
    // Launch a headless (invisible) Chrome browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a high DPI so text looks crisp (2x = retina quality)
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

    // Load our HTML card into the browser
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to finish loading
    await page.evaluate(() => document.fonts.ready);

    // Figure out how big the card is
    const body = await page.$('body');
    const box = await body.boundingBox();

    // Take a screenshot of just the card (not the whole page)
    const buffer = await page.screenshot({
        type: 'png',
        clip: {
            x: 0,
            y: 0,
            width: Math.ceil(box.width),
            height: Math.ceil(box.height),
        },
    });

    await browser.close();
    return buffer;
}
