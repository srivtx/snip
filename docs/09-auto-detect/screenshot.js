import puppeteer from 'puppeteer';

export async function takeScreenshot(html) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const body = await page.$('body');
    const box = await body.boundingBox();
    const buffer = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: Math.ceil(box.width), height: Math.ceil(box.height) },
    });
    await browser.close();
    return buffer;
}
