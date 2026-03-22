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
    } = options;

    const bg = getBackground(background);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--font-render-hinting=none'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });

    console.log(`\n  \x1b[90mPreparing cinematic tour: ${url}...\x1b[0m`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (noWindow) {
        // ── Pure Mode (Full Viewport) ──
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

        await page.evaluate(async (scrollDuration) => {
            const wait = (ms) => new Promise(r => setTimeout(r, ms));
            await wait(1000);
            const totalToScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalToScroll > 0) {
                const startTime = performance.now();
                await new Promise(resolve => {
                    function step(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / scrollDuration, 1);
                        const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
                        window.scrollTo(0, totalToScroll * ease);
                        if (progress < 1) window.requestAnimationFrame(step);
                        else resolve();
                    }
                    window.requestAnimationFrame(step);
                });
            }
            await wait(2000);
        }, duration);
        await recorder.stop();
        console.log = _log; // Restore original logger
    } else {
        // ── Framed Mode (Magic Container) ──
        await page.evaluate((bgCSS, hostname) => {
            const bodyStyle = window.getComputedStyle(document.body);
            const originalBg = bodyStyle.backgroundColor;
            const originalBgImg = bodyStyle.backgroundImage !== 'none' ? bodyStyle.backgroundImage : '';
            const originalColor = bodyStyle.color;
            const originalChildren = Array.from(document.body.children);
            const bodyClasses = document.body.className;
            
            const wrapper = document.createElement('div');
            wrapper.id = 'snip-main-wrapper';
            wrapper.style.cssText = `
                background: ${bgCSS}; width: 100vw; height: 100vh;
                display: flex; align-items: center; justify-content: center;
                position: fixed; inset: 0; z-index: 2147483647; overflow: hidden;
            `;

            wrapper.innerHTML = `
                <div id="snip-window" style="width: 85%; height: 80%; background: ${originalBg}; border-radius: 12px; box-shadow: 0 50px 100px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); position: relative;">
                    <div id="snip-bar" style="height: 40px; background: ${originalBg}; filter: brightness(1.1); display: flex; align-items: center; padding: 0 15px; gap: 8px; border-bottom: 1px solid rgba(0,0,0,0.1); flex-shrink: 0;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f57;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #febc2e;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #28c840;"></div>
                        <div style="flex: 1; text-align: center; font-family: sans-serif; font-size: 12px; color: ${originalColor}; opacity: 0.5; padding-right: 40px;">${hostname}</div>
                    </div>
                    <div id="snip-scroller" class="${bodyClasses}" style="flex: 1; overflow-y: auto; background-color: ${originalBg}; background-image: ${originalBgImg}; position: relative; transform: translateZ(0); -webkit-overflow-scrolling: touch;">
                    </div>
                </div>
            `;

            document.body.appendChild(wrapper);
            const scroller = document.getElementById('snip-scroller');
            originalChildren.forEach(child => { if (child.id !== 'snip-main-wrapper') scroller.appendChild(child); });
            document.body.style.overflow = 'hidden';
        }, bg.css, new URL(url).hostname);

        // Force browser to wait for the DOM reflow to finish visually painting before starting FFmpeg!
        // This is necessary because Bun executes so fast that FFmpeg spawns before Chromium repaints the UI.
        await new Promise(r => setTimeout(r, 2000));

        const recorder = new PuppeteerScreenRecorder(page, { ffmpeg_Path: ffmpegStatic, fps, videoFrame: { width, height } });
        console.log(`  \x1b[90mRecording cinematic tour...\x1b[0m`);

        // Suppress noisy FFmpeg MJPEG overread warnings from the library deeply
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

        await page.evaluate(async (scrollDuration) => {
            const scroller = document.getElementById('snip-scroller');
            const wait = (ms) => new Promise(r => setTimeout(r, ms));
            await wait(1500);

            const totalToScroll = scroller.scrollHeight - scroller.clientHeight;
            if (totalToScroll > 0) {
                const startTime = performance.now();
                await new Promise(resolve => {
                    function step(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / scrollDuration, 1);
                        const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
                        scroller.scrollTop = totalToScroll * ease;
                        if (progress < 1) window.requestAnimationFrame(step);
                        else resolve();
                    }
                    window.requestAnimationFrame(step);
                });
            }
            await wait(2000);
        }, duration);

        await recorder.stop();
        console.log = _log; // Restore original logger
        console.error = _error;
        process.stderr.write = _stderrWrite;
        process.stdout.write = _stdoutWrite;
    }

    await browser.close();
}
