import puppeteer from 'puppeteer';

/**
 * Takes HTML string or URL → renders it in a headless browser → returns a PNG buffer.
 */
export async function captureScreenshot(htmlOrUrl, options = {}) {
    const {
        fullPage = false,
        width = 1200,
        height = 800,
        deviceScaleFactor = 2,
        isUrl = false,
    } = options;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--font-render-hinting=none',
        ],
    });

    const page = await browser.newPage();

    // High DPI for crisp text (2x retina)
    await page.setViewport({ width, height, deviceScaleFactor });

    if (isUrl) {
        await page.goto(htmlOrUrl, { waitUntil: 'networkidle2' });
    } else {
        await page.setContent(htmlOrUrl, { waitUntil: 'networkidle0' });
    }

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    let screenshotOptions = {
        type: 'png',
        omitBackground: false,
    };

    if (fullPage) {
        screenshotOptions.fullPage = true;
    } else {
        // Get the actual bounding box of the body content
        const bodyHandle = await page.$('body');
        const boundingBox = await bodyHandle.boundingBox();
        screenshotOptions.clip = {
            x: 0,
            y: 0,
            width: Math.ceil(boundingBox.width),
            height: Math.ceil(boundingBox.height),
        };
    }

    const buffer = await page.screenshot(screenshotOptions);

    await browser.close();
    return buffer;
}
