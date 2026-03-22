import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import ffmpegStatic from 'ffmpeg-static';
import { getBackground } from './backgrounds.js';

process.env.FFMPEG_PATH = ffmpegStatic;

export async function captureProductVideo(url, outputPath, options = {}) {
    const {
        background = 'candy',
        width = 1440,
        height = 900,
        fps = 30,
        duration = 8000, 
        click = null,
        noWindow = false,
        linear = false,
    } = options;

    const bg = getBackground(background);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', 
            '--font-render-hinting=none',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });

    const stabilizePage = async (frameOrPage) => {
        console.log(`  \x1b[90mPre-loading assets and stabilizing scroll...\x1b[0m`);
        await frameOrPage.evaluate(async () => {
            const style = document.createElement('style');
            style.innerHTML = `* { scroll-behavior: auto !important; } html, body { scroll-behavior: auto !important; }`;
            document.head.appendChild(style);
            window.scrollTo(0, document.documentElement.scrollHeight);
            await new Promise(r => setTimeout(r, 1200));
            window.scrollTo(0, 0);
            await new Promise(r => setTimeout(r, 1000));
        });
    };

    console.log(`\n  \x1b[90mPreparing cinematic tour: ${url}...\x1b[0m`);

    if (noWindow) {
        // ── Pure Mode (Full Viewport) ──
        await page.goto(url, { waitUntil: 'networkidle2' });
        await stabilizePage(page);
        await new Promise(r => setTimeout(r, 2000));
        const recorder = new PuppeteerScreenRecorder(page, { ffmpeg_Path: ffmpegStatic, fps, videoFrame: { width, height } });
        console.log(`  \x1b[90mRecording native site tour...\x1b[0m`);
        
        // Suppress noisy FFmpeg MJPEG overread warnings from the library
        const _log = console.log;
        console.log = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Error unable to capture video stream')) return;
            _log(...args);
        };
        
        await recorder.start(outputPath);

        await page.evaluate(async (scrollDuration, useLinear) => {
            const wait = (ms) => new Promise(r => setTimeout(r, ms));
            await wait(1000);
            const totalToScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalToScroll > 0) {
                const startTime = performance.now();
                await new Promise(resolve => {
                    function step(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / scrollDuration, 1);
                        const p = progress;
                        const customEase = p < 0.1 ? (p * p * 50) / 9 : p > 0.9 ? 1 - ((1 - p) * (1 - p) * 50) / 9 : (p * 10 / 9) - (1 / 18);
                        const ease = useLinear ? p : customEase;
                        window.scrollTo(0, totalToScroll * ease);
                        if (progress < 1) window.requestAnimationFrame(step);
                        else resolve();
                    }
                    window.requestAnimationFrame(step);
                });
            }
            await wait(2000);
        }, duration, linear);
        await recorder.stop();
        console.log = _log; // Restore original logger
    } else {
        // ── Framed Mode (Magic Iframe) ──
        await page.goto('about:blank');
        const hostname = new URL(url).hostname;
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        margin: 0; padding: 0; width: 100vw; height: 100vh;
                        background: ${bg.css}; background-attachment: fixed;
                        display: flex; align-items: center; justify-content: center;
                        overflow: hidden; font-family: sans-serif;
                    }
                    #snip-window {
                        width: 1224px; height: 720px;
                        border-radius: 12px; box-shadow: 0 50px 100px rgba(0,0,0,0.5);
                        display: flex; flex-direction: column; overflow: hidden;
                        border: 1px solid rgba(255,255,255,0.1); position: relative;
                        background: #000;
                    }
                    #snip-bar {
                        height: 40px; background: #1a1a1a; display: flex; align-items: center;
                        padding: 0 15px; gap: 8px; border-bottom: 1px solid rgba(0,0,0,0.3); flex-shrink: 0;
                    }
                    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
                    .d-red { background: #ff5f57; }
                    .d-yel { background: #febc2e; }
                    .d-grn { background: #28c840; }
                    #snip-title { flex: 1; text-align: center; font-size: 12px; color: #fff; opacity: 0.5; padding-right: 40px; pointer-events: none; }
                    iframe { flex: 1; border: none; width: 100%; height: 100%; background: #fff; }
                </style>
            </head>
            <body>
                <div id="snip-window">
                    <div id="snip-bar">
                        <div class="dot d-red"></div>
                        <div class="dot d-yel"></div>
                        <div class="dot d-grn"></div>
                        <div id="snip-title">${hostname}</div>
                    </div>
                    <iframe id="target-frame" src="${url}"></iframe>
                </div>
            </body>
            </html>
        `;
        await page.setContent(html);
        
        // Wait for iframe to logically load
        console.log(`  \x1b[90mWaiting for iframe to paint...\x1b[0m`);
        const frameHandle = await page.waitForSelector('#target-frame');
        const frame = await frameHandle.contentFrame();
        
        // Wait for network to slow down inside the iframe
        await new Promise(r => setTimeout(r, 4000));

        await stabilizePage(frame);

        const recorder = new PuppeteerScreenRecorder(page, { ffmpeg_Path: ffmpegStatic, fps, videoFrame: { width, height } });
        console.log(`  \x1b[90mRecording cinematic tour...\x1b[0m`);

        // Suppress noisy FFmpeg MJPEG overread warnings
        const _stderrWrite = process.stderr.write;
        process.stderr.write = function (string, encoding, fd) {
            if (string.includes('Error unable to capture video stream')) return;
            return _stderrWrite.apply(process.stderr, arguments);
        };
        const _stdoutWrite = process.stdout.write;
        process.stdout.write = function (string, encoding, fd) {
            if (string.includes('Error unable to capture video stream')) return;
            return _stdoutWrite.apply(process.stdout, arguments);
        };

        const _log = console.log;
        const _error = console.error;
        console.log = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Error unable to capture video stream')) return;
            _log(...args);
        };
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Error unable to capture video stream')) return;
            _error(...args);
        };

        await recorder.start(outputPath);

        // Scroll inside the isolated iframe context!
        await frame.evaluate(async (scrollDuration, useLinear) => {
            const wait = (ms) => new Promise(r => setTimeout(r, ms));
            await wait(1500);

            // Document dimensions within the iframe
            const totalToScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalToScroll > 0) {
                const startTime = performance.now();
                await new Promise(resolve => {
                    function step(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / scrollDuration, 1);
                        const p = progress;
                        const customEase = p < 0.1 ? (p * p * 50) / 9 : p > 0.9 ? 1 - ((1 - p) * (1 - p) * 50) / 9 : (p * 10 / 9) - (1 / 18);
                        const ease = useLinear ? p : customEase;
                        window.scrollTo(0, totalToScroll * ease);
                        if (progress < 1) window.requestAnimationFrame(step);
                        else resolve();
                    }
                    window.requestAnimationFrame(step);
                });
            }
            await wait(2000);
        }, duration, linear);

        await recorder.stop();
        console.log = _log; // Restore original logger
        console.error = _error;
        process.stderr.write = _stderrWrite;
        process.stdout.write = _stdoutWrite;
    }

    await browser.close();
}
