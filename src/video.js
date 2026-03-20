import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';

// Tell fluent-ffmpeg where to find the static ffmpeg binary
process.env.FFMPEG_PATH = ffmpegStatic;

export async function captureVideo(html, outputPath, options = {}) {
    const {
        width = 1200,
        height = 800,
        deviceScaleFactor = 2,
        fps = 30,
        scrollSpeed = 5,
    } = options;

    console.log(`\n  \x1b[90mStarting headless browser for recording...\x1b[0m`);
    
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
    await page.setViewport({ width, height, deviceScaleFactor });

    // ── CENTER THE CONTENT ──
    // We wrap the provided HTML in a centering flexbox container
    const centeredHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start; /* Start at top for scrolling */
                    background: transparent;
                }
                #centering-wrapper {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    min-height: 100%;
                    padding: 80px 0; /* Add some vertical breathing room */
                }
            </style>
        </head>
        <body>
            <div id="centering-wrapper">
                ${html}
            </div>
        </body>
        </html>
    `;

    await page.setContent(centeredHTML, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    const recorder = new PuppeteerScreenRecorder(page, {
        ffmpeg_Path: ffmpegStatic,
        fps,
        videoFrame: { width, height },
    });

    console.log(`  \x1b[90mRecording centered cinematic video...\x1b[0m`);
    await recorder.start(outputPath);

    await new Promise(r => setTimeout(r, 1000));

    // Scroll Logic (now scrolling the page itself)
    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    
    if (maxScroll > 0) {
        await page.evaluate(async (speed, max) => {
            await new Promise(resolve => {
                let scrolled = 0;
                const timer = setInterval(() => {
                    window.scrollBy(0, speed);
                    scrolled += speed;
                    if (scrolled >= max) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 16);
            });
        }, scrollSpeed, maxScroll);
    }

    await new Promise(r => setTimeout(r, 1000));
    await recorder.stop();
    await browser.close();
}
