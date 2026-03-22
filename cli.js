#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { renderHTML, detectLang, THEMES } from './src/renderer.js';
import { captureScreenshot } from './src/screenshot.js';
import { listBackgrounds, DEFAULT_BG } from './src/backgrounds.js';
import { guessLang } from './src/detect.js';
import { renderPostHTML } from './src/post.js';
import { loadConfig, saveConfig, getConfigPath } from './src/config.js';
import { simpleToMermaid, renderMermaidHTML } from './src/mermaid.js';
import { getColorData, printColorPalette } from './src/color.js';
import { renderMockupHTML } from './src/mockup.js';
import { renderDiffHTML } from './src/diff.js';
import { renderOGHTML } from './src/og.js';
import { captureVideo } from './src/video.js';
import { captureProductVideo } from './src/product-video.js';
import { findCommand } from './src/rag.js';
import * as p from '@clack/prompts';
import pc from 'picocolors';

const SNIPS_DIR = path.join(os.homedir(), 'Desktop', 'snips');

const program = new Command();

program
    .name('snip')
    .description('✂️  Beautiful developer utilities from your terminal')
    .version('1.0.0')
    .allowUnknownOption();

// ── DEFAULT ACTION (Code Snippets) ──
program
    .argument('[file]', 'Source code file')
    .option('-t, --theme <theme>', `Syntax theme (${THEMES.join(', ')})`, 'dracula')
    .option('-b, --bg <background>', 'Background gradient preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output PNG file path')
    .option('--no-lines', 'Hide line numbers')
    .option('--no-copy', 'Skip copying image to clipboard')
    .option('-l, --lang <language>', 'Override language detection')
    .option('-p, --padding <px>', 'Card outer padding in px', '42')
    .action(async (file, opts) => {
        let langHint = null;
        let inputCode = '';
        let filename = '';

        if (file) {
            if (file.startsWith('.') && !fs.existsSync(path.resolve(file))) {
                langHint = detectLang('file' + file);
            } else {
                const filePath = path.resolve(file);
                if (!fs.existsSync(filePath)) {
                    // ── OFFLINE RAG FALLBACK ──
                    const match = findCommand(process.argv.slice(2).join(' '));
                    const isRecursive = process.env.SNIP_AUTORUN === '1';

                    if (match && match.score > 8 && !isRecursive) {
                        const args = match.extracted.join(' ');
                        const proposed = match.command.replace(/<.*?>/g, args || '[path]');
                        
                        if (match.score > 25) {
                            console.log(`\n  > Intent: ${match.command}`);
                            console.log(`  > Auto-running: ${proposed}...\n`);
                            try {
                                const cmdToExec = proposed.replace('snip', `node "${process.argv[1]}"`);
                                execSync(cmdToExec, { 
                                    stdio: 'inherit',
                                    env: { ...process.env, SNIP_AUTORUN: '1' } 
                                });
                                process.exit(0);
                            } catch (e) {
                                process.exit(1);
                            }
                        }

                        console.error(`\n  ✖ Unknown: "${file}"`);
                        console.log(`  > Did you mean: ${match.command}?`);
                        console.log(`  > Try running: ${proposed}\n`);
                        process.exit(1);
                    }
                    console.log(`\n  ${pc.red('✖')} File not found: ${pc.red(file)}\n`);
                    process.exit(1);
                }
                inputCode = fs.readFileSync(filePath, 'utf-8');
                filename = path.basename(filePath);
            }
        }

        if (!inputCode && !process.stdin.isTTY) {
            inputCode = await readStdin();
        } else if (!inputCode) {
            if (langHint) {
                console.log(`\x1b[90m(lang: ${langHint} — paste your code, press Enter twice)\x1b[0m`);
            } else {
                console.log(`\x1b[90m(Paste your code, press Enter twice to generate)\x1b[0m`);
            }
            inputCode = await readInteractive();
            if (inputCode.trim().length === 0) {
                console.log(`\n\x1b[33m⚠\x1b[0m no code pasted, exiting\n`);
                return;
            }
        }

        let lang = opts.lang || langHint || (filename ? detectLang(filename) : (guessLang(inputCode) || 'javascript'));
        const theme = (program.opts().theme !== 'dracula' ? program.opts().theme : opts.theme);
        const background = (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg);
        const showLineNumbers = opts.lines !== false;
        const padding = parseInt(opts.padding, 10) || 42;

        if (!THEMES.includes(theme)) {
            console.error(`\n  ✖ Unknown theme: "${theme}"`);
            process.exit(1);
        }

        let outputPath = opts.output ? path.resolve(opts.output) : null;
        if (!outputPath) {
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const base = filename ? path.basename(filename, path.extname(filename)) : 'snip';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            outputPath = path.join(SNIPS_DIR, `${base}-${timestamp}.png`);
        }

        console.log(`\nsnip v1.0.9`);
        console.log(`\x1b[90mtheme: ${theme} | bg: ${background} | lang: ${lang}\x1b[0m\n`);

        const html = await renderHTML(inputCode, { theme, lang, background, showLineNumbers, filename, padding });
        const buffer = await captureScreenshot(html);
        fs.writeFileSync(outputPath, buffer);

        let displayPath = outputPath.startsWith(os.homedir()) ? outputPath.replace(os.homedir(), '~') : outputPath;
        console.log(`\x1b[32m✔\x1b[0m saved to \x1b[1m${displayPath}\x1b[0m`);

        if (opts.copy !== false) {
            try {
                copyImageToClipboard(outputPath);
                console.log(`\x1b[32m✔\x1b[0m copied to clipboard\n`);
            } catch {
                console.log(`\x1b[33m⚠\x1b[0m failed to copy to clipboard\n`);
            }
        }
    });

// ── VIDEO COMMAND ──
program
    .command('video')
    .description('Generate a smoothly scrolling MP4 video of a code snippet')
    .argument('[file]', 'Source code file')
    .option('-t, --theme <theme>', `Syntax theme (${THEMES.join(', ')})`, 'dracula')
    .option('-b, --bg <background>', 'Background gradient preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output MP4 file path')
    .option('--no-lines', 'Hide line numbers')
    .option('-l, --lang <language>', 'Override language detection')
    .option('-p, --padding <px>', 'Card outer padding in px', '42')
    .action(async (file, opts) => {
        let langHint = null;
        let inputCode = '';
        let filename = '';

        if (file) {
            if (file.startsWith('.') && !fs.existsSync(path.resolve(file))) {
                langHint = detectLang('file' + file);
            } else {
                const filePath = path.resolve(file);
                if (!fs.existsSync(filePath)) {
                    console.error(`\n  ✖ File not found: ${file}\n`);
                    process.exit(1);
                }
                inputCode = fs.readFileSync(filePath, 'utf-8');
                filename = path.basename(filePath);
            }
        }

        if (!inputCode && !process.stdin.isTTY) {
            inputCode = await readStdin();
        } else if (!inputCode) {
            console.log(`\x1b[90m(Paste your code, press Enter twice to generate video)\x1b[0m`);
            inputCode = await readInteractive();
            if (inputCode.trim().length === 0) {
                console.log(`\n\x1b[33m⚠\x1b[0m no code pasted, exiting\n`);
                return;
            }
        }

        let lang = opts.lang || langHint || (filename ? detectLang(filename) : (guessLang(inputCode) || 'javascript'));
        const theme = (program.opts().theme !== 'dracula' ? program.opts().theme : opts.theme);
        const background = (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg);
        const showLineNumbers = opts.lines !== false;
        const padding = parseInt(opts.padding, 10) || 42;

        if (!THEMES.includes(theme)) {
            console.error(`\n  ✖ Unknown theme: "${theme}"`);
            process.exit(1);
        }

        let outputPath = opts.output ? path.resolve(opts.output) : null;
        if (!outputPath) {
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const base = filename ? path.basename(filename, path.extname(filename)) : 'snip';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            outputPath = path.join(SNIPS_DIR, `${base}-${timestamp}.mp4`);
        }

        console.log(`\n  \x1b[90mRendering HTML for video...\x1b[0m`);
        const html = await renderHTML(inputCode, { theme, lang, background, showLineNumbers, filename, padding });

        try {
            await captureVideo(html, outputPath);
            let displayPath = outputPath.startsWith(os.homedir()) ? outputPath.replace(os.homedir(), '~') : outputPath;
            console.log(`\n  \x1b[32m✔\x1b[0m Video saved to \x1b[1m${displayPath}\x1b[0m\n`);
        } catch (err) {
            console.error(`\n  \x1b[31m✖\x1b[0m Video generation failed: ${err.message}\n`);
        }
    });

// ── DIAGRAM COMMAND ──
program
    .command('diagram')
    .description('Generate a diagram from a string or file path')
    .argument('[input]', 'Arrow-syntax string (A -> B) or path to .mmd file')
    .option('-s, --style <style>', 'Diagram style (default, hand-drawn)', 'default')
    .option('-d, --dark', 'Use dark theme for diagrams')
    .option('-b, --bg <background>', 'Background gradient preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output PNG file path')
    .option('-p, --padding <px>', 'Card outer padding in px', '42')
    .action(async (input, opts) => {
        let diagramInput = input;

        if (!diagramInput && !process.stdin.isTTY) {
            diagramInput = await readStdin();
        } else if (!diagramInput) {
            console.log(`\x1b[90m(Type your diagram e.g. A -> B, press Enter twice)\x1b[0m`);
            diagramInput = await readInteractive();
        }

        if (!diagramInput || !diagramInput.trim()) {
            console.error('No diagram input provided');
            return;
        }

        const inputPath = path.resolve(diagramInput);
        if (fs.existsSync(inputPath) && fs.lstatSync(inputPath).isFile()) {
            console.log(`\n  \x1b[90mReading diagram from file: ${path.basename(inputPath)}...\x1b[0m`);
            diagramInput = fs.readFileSync(inputPath, 'utf-8');
        }

        try {
            const mermaidCode = simpleToMermaid(diagramInput);
            const html = renderMermaidHTML(mermaidCode, {
                background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg),
                padding: parseInt(opts.padding, 10) || 42,
                style: opts.style,
                dark: opts.dark,
            });

            const buffer = await captureScreenshot(html);
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `diagram-${timestamp}.png`);
            fs.writeFileSync(outputPath, buffer);

            let displayPath = outputPath.startsWith(os.homedir()) ? outputPath.replace(os.homedir(), '~') : outputPath;
            console.log(`\n  \x1b[32m✔\x1b[0m saved to \x1b[1m${displayPath}\x1b[0m`);

            try {
                copyImageToClipboard(outputPath);
                console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
            } catch {
                console.log(`  \x1b[33m⚠\x1b[0m failed to copy to clipboard\n`);
            }
        } catch (err) {
            console.error(`\n  \x1b[31m✖\x1b[0m Diagram generation failed: ${err.message}\n`);
        }
    });

// ── MOCKUP COMMAND ──
program
    .command('mockup')
    .description('Wrap an image or code in a MacOS/Browser frame')
    .argument('<path>', 'Path to image file or code file')
    .option('-t, --type <type>', 'Mockup type (macos, browser)', 'macos')
    .option('-b, --bg <background>', 'Background preset', DEFAULT_BG)
    .option('-d, --dark', 'Use dark theme')
    .option('-o, --output <path>', 'Output file path')
    .action(async (input, opts) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ File not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mGenerating mockup for ${path.basename(inputPath)}...\x1b[0m`);
        try {
            // Simple heuristic: if it's an image, render image mockup
            const ext = path.extname(inputPath).toLowerCase();
            const isImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);

            let content = inputPath;
            if (!isImage) {
                // If it's code, we should really highlight it first.
                // For now, let's keep it simple and just do images.
                console.error('\n  ✖ Mockup currently only supports image files.\n');
                return;
            }

            const html = renderMockupHTML(content, {
                background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg),
                type: opts.type,
                isImage: true,
                dark: opts.dark,
            });

            const buffer = await captureScreenshot(html);
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const timestamp = new Date().getTime();
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `mockup-${timestamp}.png`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Mockup failed: ${err.message}\n`);
        }
    });

// ── SITE COMMAND ──
program
    .command('site')
    .description('Capture a screenshot of a website')
    .argument('<url>', 'URL of the website')
    .option('-f, --full', 'Full page screenshot')
    .option('-w, --width <number>', 'Viewport width', '1280')
    .option('-h, --height <number>', 'Viewport height', '800')
    .option('-o, --output <path>', 'Output file path')
    .action(async (url, opts) => {
        let fullUrl = url.startsWith('http') ? url : `https://${url}`;
        console.log(`\n  \x1b[90mCapturing screenshot of ${fullUrl}...\x1b[0m`);
        try {
            const buffer = await captureScreenshot(fullUrl, {
                isUrl: true,
                fullPage: opts.full,
                width: parseInt(opts.width, 10),
                height: parseInt(opts.height, 10),
            });

            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const timestamp = new Date().getTime();
            const domain = new URL(fullUrl).hostname.replace(/\./g, '-');
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `site-${domain}-${timestamp}.png`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Site capture failed: ${err.message}\n`);
        }
    });

// ── IMAGE COMMANDS ──
const image = program.command('image').description('Image processing utilities');

image.command('bg-remove')
    .description('Remove background from an image')
    .argument('<path>', 'Path to image file')
    .option('-o, --output <path>', 'Output file path')
    .action(async (input, opts) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mRemoving background from ${path.basename(inputPath)}...\x1b[0m`);
        try {
            const { removeBackground } = await import('@imgly/background-removal-node');
            const blob = await removeBackground(inputPath);
            const buffer = Buffer.from(await blob.arrayBuffer());

            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const ext = path.extname(inputPath);
            const base = path.basename(inputPath, ext);
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `${base}-nobg.png`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Failed: ${err.message}\n`);
        }
    });

image.command('ocr')
    .description('Extract text from an image')
    .argument('<path>', 'Path to image file')
    .action(async (input) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mExtracting text from ${path.basename(inputPath)}...\x1b[0m`);
        try {
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(inputPath);
            await worker.terminate();

            if (!text.trim()) {
                console.log(`\n  ⚠ No text found\n`);
                return;
            }

            console.log(`\n\x1b[90m── Extracted Text ──\x1b[0m\n${text.trim()}\n\x1b[90m────────────────────\x1b[0m\n`);
            copyTextToClipboard(text.trim());
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ OCR failed: ${err.message}\n`);
        }
    });

image.command('compress')
    .description('Optimize and compress an image')
    .argument('<path>', 'Path to image file')
    .option('-q, --quality <number>', 'Compression quality (1-100)', '80')
    .option('-o, --output <path>', 'Output file path')
    .action(async (input, opts) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        const quality = parseInt(opts.quality, 10) || 80;
        console.log(`\n  \x1b[90mCompressing ${path.basename(inputPath)} (quality: ${quality})...\x1b[0m`);

        try {
            const { default: sharp } = await import('sharp');
            const ext = path.extname(inputPath).toLowerCase();
            const base = path.basename(inputPath, ext);

            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const outExt = ext || '.png';
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `${base}-opt${outExt}`);

            const originalSize = fs.statSync(inputPath).size;
            const image = sharp(inputPath);

            if (outExt === '.jpg' || outExt === '.jpeg') image.jpeg({ quality, mozjpeg: true });
            else if (outExt === '.png') image.png({ quality, palette: true, compressionLevel: 9 });
            else if (outExt === '.webp') image.webp({ quality });

            await image.toFile(outputPath);
            const newSize = fs.statSync(outputPath).size;
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            console.log(`  \x1b[90mOriginal: ${(originalSize / 1024).toFixed(1)}KB | Compressed: ${(newSize / 1024).toFixed(1)}KB | Saved: ${savings}%\x1b[0m\n`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Compression failed: ${err.message}\n`);
        }
    });

image.command('palette')
    .description('Extract dominant colors from an image')
    .argument('<path>', 'Path to image file')
    .action(async (input) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mExtracting color palette from ${path.basename(inputPath)}...\x1b[0m\n`);
        try {
            const { default: sharp } = await import('sharp');
            const { default: getPalette } = await import('get-rgba-palette');

            const { data } = await sharp(inputPath)
                .resize(200, 200, { fit: 'inside' })
                .raw()
                .toBuffer({ resolveWithObject: true });

            const colors = getPalette(data, 5);

            colors.forEach((c) => {
                const hex = `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1).toUpperCase()}`;
                const r = c[0], g = c[1], b = c[2];
                console.log(`  \x1b[48;2;${r};${g};${b}m      \x1b[0m  \x1b[1m${hex}\x1b[0m   \x1b[90mrgb(${r}, ${g}, ${b})\x1b[0m`);
            });

            const hexCodes = colors.map(c => `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1).toUpperCase()}`).join(', ');
            copyTextToClipboard(hexCodes);
            console.log(`\n  \x1b[32m✔\x1b[0m hex codes copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Failed: ${err.message}\n`);
        }
    });

image.command('resize')
    .description('Resize an image')
    .argument('<path>', 'Path to image file')
    .option('-w, --width <number>', 'Width in pixels')
    .option('-h, --height <number>', 'Height in pixels')
    .option('-o, --output <path>', 'Output file path')
    .action(async (input, opts) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        const width = opts.width ? parseInt(opts.width, 10) : null;
        const height = opts.height ? parseInt(opts.height, 10) : null;

        if (!width && !height) {
            console.error('\n  ✖ Please provide either --width or --height\n');
            return;
        }

        console.log(`\n  \x1b[90mResizing ${path.basename(inputPath)}...\x1b[0m`);
        try {
            const { default: sharp } = await import('sharp');
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const ext = path.extname(inputPath);
            const base = path.basename(inputPath, ext);
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `${base}-resized${ext}`);

            await sharp(inputPath).resize(width, height).toFile(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Resize failed: ${err.message}\n`);
        }
    });

// ── TOOL COMMANDS ──
const tool = program.command('tool').description('Developer productivity tools');

tool.command('qr')
    .description('Generate a QR code')
    .argument('<text>', 'Text or URL for the QR code')
    .option('-o, --output <path>', 'Output file path')
    .action(async (text, opts) => {
        console.log(`\n  \x1b[90mGenerating QR code for "${text}"...\x1b[0m`);
        try {
            const QRCode = await import('qrcode');
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `qr-${timestamp}.png`);

            await QRCode.toFile(outputPath, text, { scale: 10, margin: 2 });
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ failed: ${err.message}\n`);
        }
    });

tool.command('svg')
    .description('Convert SVG to PNG')
    .argument('<path>', 'Path to SVG file')
    .option('-o, --output <path>', 'Output file path')
    .action(async (input, opts) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ SVG not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mConverting ${path.basename(inputPath)} to PNG...\x1b[0m`);
        try {
            const { default: sharp } = await import('sharp');
            const base = path.basename(inputPath, '.svg');
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `${base}.png`);

            await sharp(inputPath).png().toFile(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ failed: ${err.message}\n`);
        }
    });

tool.command('favicon')
    .description('Generate web favicons from a square image')
    .argument('<path>', 'Path to source square image')
    .action(async (input) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ Image not found: ${input}\n`);
            return;
        }

        console.log(`\n  \x1b[90mGenerating web icons from ${path.basename(inputPath)}...\x1b[0m\n`);
        try {
            const { default: sharp } = await import('sharp');
            const timestamp = new Date().getTime();
            const outputDir = path.join(SNIPS_DIR, `favicon-${timestamp}`);
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            const sizes = [
                { name: 'favicon-16x16.png', size: 16 },
                { name: 'favicon-32x32.png', size: 32 },
                { name: 'apple-touch-icon.png', size: 180 },
                { name: 'android-chrome-192x192.png', size: 192 },
                { name: 'android-chrome-512x512.png', size: 512 },
            ];

            for (const s of sizes) {
                await sharp(inputPath).resize(s.size, s.size).toFile(path.join(outputDir, s.name));
                console.log(`  \x1b[32m✔\x1b[0m generated ${s.name}`);
            }

            console.log(`\n  \x1b[32m✔\x1b[0m all icons saved to \x1b[1m${outputDir.replace(os.homedir(), '~')}\x1b[0m\n`);
        } catch (err) {
            console.error(`\n  ✖ Failed: ${err.message}\n`);
        }
    });

tool.command('base64')
    .description('Encode an image or file to Base64')
    .argument('<path>', 'Path to file')
    .action(async (input) => {
        const inputPath = path.resolve(input);
        if (!fs.existsSync(inputPath)) {
            console.error(`\n  ✖ File not found: ${input}\n`);
            return;
        }

        try {
            const data = fs.readFileSync(inputPath);
            const ext = path.extname(inputPath).slice(1) || 'png';
            const b64 = `data:image/${ext};base64,${data.toString('base64')}`;

            copyTextToClipboard(b64);
            console.log(`\n  \x1b[32m✔\x1b[0m Base64 string (data URI) copied to clipboard`);
            console.log(`  \x1b[90mLength: ${b64.length} characters\x1b[0m\n`);
        } catch (err) {
            console.error(`\n  ✖ Failed: ${err.message}\n`);
        }
    });

tool.command('product-video')
    .description('Generate a cinematic product tour video of a website')
    .argument('<url>', 'URL of the website')
    .option('-b, --bg <background>', 'Background preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output file path')
    .option('--duration <ms>', 'Duration of the scroll in milliseconds', '8000')
    .option('--no-window', 'Record the real website only (no mockup frame)')
    .option('--linear', 'Use a constant linear scroll speed instead of dynamic easing')
    .action(async (url, opts) => {
        let fullUrl = url.startsWith('http') ? url : `https://${url}`;
        if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
        const timestamp = new Date().getTime();
        const domain = new URL(fullUrl).hostname.replace(/\./g, '-');
        const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `product-${domain}-${timestamp}.mp4`);

        try {
            await captureProductVideo(fullUrl, outputPath, {
                background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg),
                duration: parseInt(opts.duration, 10),
                noWindow: opts.window === false,
                linear: !!opts.linear,
            });
            let displayPath = outputPath.startsWith(os.homedir()) ? outputPath.replace(os.homedir(), '~') : outputPath;
            console.log(`\n  \x1b[32m✔\x1b[0m Product video saved to \x1b[1m${displayPath}\x1b[0m\n`);
        } catch (err) {
            console.error(`\n  ✖ Product video failed: ${err.message}\n`);
        }
    });

tool.command('color')
    .description('Analyze a hex color and get complementary shades')
    .argument('<hex>', 'Hex color code (e.g. #ff0055)')
    .action((hex) => {
        const data = getColorData(hex);
        if (!data) {
            console.error(`\n  ✖ Invalid hex color: ${hex}\n`);
            return;
        }
        printColorPalette(data);
        copyTextToClipboard(data.hex);
        console.log(`  \x1b[32m✔\x1b[0m hex code copied to clipboard\n`);
    });

tool.command('diff')
    .description('Generate a visual diff between two files')
    .argument('<file1>', 'First file')
    .argument('<file2>', 'Second file')
    .option('-b, --bg <background>', 'Background preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output file path')
    .action(async (file1, file2, opts) => {
        if (!fs.existsSync(path.resolve(file1)) || !fs.existsSync(path.resolve(file2))) {
            console.error('\n  ✖ One or both files not found\n');
            return;
        }

        console.log(`\n  \x1b[90mGenerating visual diff...\x1b[0m`);
        try {
            const html = await renderDiffHTML(file1, file2, { background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg) });
            const buffer = await captureScreenshot(html);
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const timestamp = new Date().getTime();
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `diff-${timestamp}.png`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ Diff failed: ${err.message}\n`);
        }
    });

tool.command('og')
    .description('Generate an Open Graph (OG) social share image')
    .argument('<title>', 'Title for the OG image')
    .argument('[description]', 'Description for the OG image')
    .option('-b, --bg <background>', 'Background preset', DEFAULT_BG)
    .option('-o, --output <path>', 'Output file path')
    .option('--light', 'Use light theme')
    .action(async (title, description, opts) => {
        const config = loadConfig();
        console.log(`\n  \x1b[90mGenerating OG image...\x1b[0m`);

        try {
            const html = renderOGHTML(title, description, {
                background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg),
                author: config.author,
                handle: config.handle,
                pic: config.pic,
                dark: !opts.light,
            });

            const buffer = await captureScreenshot(html, { width: 1200, height: 630 });
            if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
            const timestamp = new Date().getTime();
            const outputPath = opts.output ? path.resolve(opts.output) : path.join(SNIPS_DIR, `og-${timestamp}.png`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
            copyImageToClipboard(outputPath);
            console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
        } catch (err) {
            console.error(`\n  ✖ OG generation failed: ${err.message}\n`);
        }
    });

// ── SYSTEM COMMANDS (post, config, dump, list) ──
program.command('post')
    .description('Create a social media style post card')
    .argument('[text]', 'Post content')
    .option('-b, --bg <background>', 'Background preset', DEFAULT_BG)
    .option('--light', 'Use light theme')
    .action(async (text, opts) => {
        const config = loadConfig();
        let content = text;
        if (!content) {
            console.log(`\x1b[90m(Type your post, press Enter twice to generate)\x1b[0m`);
            content = await readInteractive();
        }
        if (!content || !content.trim()) return;

        const html = renderPostHTML(content.trim(), {
            background: (program.opts().bg !== DEFAULT_BG ? program.opts().bg : opts.bg),
            author: config.author,
            handle: config.handle,
            pic: config.pic,
            dark: !opts.light,
        });

        const buffer = await captureScreenshot(html);
        if (!fs.existsSync(SNIPS_DIR)) fs.mkdirSync(SNIPS_DIR, { recursive: true });
        const outputPath = path.join(SNIPS_DIR, `post-${new Date().getTime()}.png`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`\n  \x1b[32m✔\x1b[0m saved to \x1b[1m${outputPath.replace(os.homedir(), '~')}\x1b[0m`);
        copyImageToClipboard(outputPath);
        console.log(`  \x1b[32m✔\x1b[0m copied to clipboard\n`);
    });

program.command('config')
    .description('Manage configuration')
    .option('--init', 'Interactive setup wizard')
    .option('--author <name>', 'Set author name')
    .option('--handle <handle>', 'Set social handle')
    .option('--pic <path>', 'Set profile picture path')
    .action(async (opts) => {
        if (opts.init) {
            const p = await import('@clack/prompts');
            const pc = (await import('picocolors')).default;
            const config = loadConfig();

            console.log('');
            p.intro(pc.bgMagenta(pc.black(' SNIP SETUP WIZARD ')));

            const group = await p.group({
                theme: () => p.select({
                    message: 'Select your preferred syntax theme',
                    options: THEMES.map(t => ({ value: t, label: t })),
                    initialValue: config.theme || 'dracula'
                }),
                bg: () => p.select({
                    message: 'Select your preferred background',
                    options: listBackgrounds().map(b => ({ value: b.key, label: b.name })),
                    initialValue: config.bg || 'candy'
                }),
                author: () => p.text({
                    message: 'Your display name (e.g. John Doe)',
                    initialValue: config.author || '',
                    placeholder: 'skip'
                }),
                handle: () => p.text({
                    message: 'Your social handle (e.g. @johndoe)',
                    initialValue: config.handle || '',
                    placeholder: 'skip'
                }),
                pic: () => p.text({
                    message: 'Absolute path to your avatar image (png/jpg)',
                    initialValue: config.pic || '',
                    placeholder: 'skip'
                })
            }, {
                onCancel: () => {
                    p.cancel('Setup cancelled.');
                    process.exit(0);
                }
            });

            saveConfig(group);
            p.outro(pc.green('✔ Configuration saved beautifully!'));
            return;
        }

        const validKeys = ['author', 'handle', 'pic'];
        const updates = Object.keys(opts).filter(k => validKeys.includes(k)).reduce((acc, key) => { acc[key] = opts[key]; return acc; }, {});

        if (Object.keys(updates).length > 0) {
            saveConfig(updates);
            console.log(`\n  \x1b[32m✔\x1b[0m config saved to ${getConfigPath()}\n`);
        } else {
            const config = loadConfig();
            console.log('\nCurrent Config:');
            console.log(`  Theme:  ${config.theme || 'dracula'}`);
            console.log(`  BG:     ${config.bg || 'candy'}`);
            console.log(`  Author: ${config.author || '(none)'}`);
            console.log(`  Handle: ${config.handle || '(none)'}`);
            console.log(`  Pic:    ${config.pic || '(none)'}\n`);
        }
    });

program.command('dump')
    .description('Clear the snips directory')
    .action(() => {
        if (fs.existsSync(SNIPS_DIR)) {
            const files = fs.readdirSync(SNIPS_DIR);
            files.forEach(f => {
                const fullPath = path.join(SNIPS_DIR, f);
                fs.rmSync(fullPath, { recursive: true, force: true });
            });
            console.log(`\n  \x1b[32m✔\x1b[0m cleared all files and folders from ~/Desktop/snips\n`);
        }
    });

program.command('list')
    .description('List available themes and backgrounds')
    .option('--themes', 'List themes')
    .option('--bgs', 'List backgrounds')
    .action((opts) => {
        if (opts.themes) THEMES.forEach(t => console.log(` • ${t}`));
        if (opts.bgs) listBackgrounds().forEach(b => console.log(` • ${b.key.padEnd(12)} ${b.name}`));
    });

// ── HELPERS ──
function copyImageToClipboard(imagePath) {
    const abs = path.resolve(imagePath);
    if (process.platform === 'darwin') execSync(`osascript -e 'set the clipboard to (read (POSIX file "${abs}") as «class PNGf»)'`);
    else if (process.platform === 'linux') execSync(`xclip -selection clipboard -t image/png -i "${abs}"`);
    else if (process.platform === 'win32') execSync(`powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${abs}'))"`);
}

function copyTextToClipboard(text) {
    const escapedText = text.replace(/'/g, "'\\''");
    if (process.platform === 'darwin') execSync(`echo '${escapedText}' | pbcopy`);
    else if (process.platform === 'linux') execSync(`echo '${escapedText}' | xclip -selection clipboard`);
    else if (process.platform === 'win32') execSync(`echo ${escapedText} | clip`);
}

function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => data += chunk);
        process.stdin.on('end', () => resolve(data));
    });
}

function readInteractive() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
            if (data.endsWith('\n\n') || data.endsWith('\r\n\r\n')) {
                process.stdin.pause();
                resolve(data.trimEnd());
            }
        });
    });
}

// ── OFFLINE RAG LAYER ──
program
    .command('find')
    .description('› Find the right command using natural language (Offline RAG)')
    .argument('<prompt>', 'What do you want to do?')
    .action(async (prompt) => {
        const match = findCommand(prompt);
        if (match) {
            console.log(`\n  > Intent: ${match.command}`);
            console.log(`    ${match.desc}`);
            console.log(`\n  Example: ${match.example}\n`);
        } else {
            console.log(`\n  ✖ Command not found for "${prompt}".`);
        }
    });

// ── SUGGESTION ENGINE (Automatic Intent Mapping) ──
program.on('command:*', function () {
    const input = process.argv.slice(2).join(' ');
    const match = findCommand(input);
    
    // Prevent Infinite Loops
    const isRecursive = process.env.SNIP_AUTORUN === '1';

    if (match && match.score > 8 && !isRecursive) {
        const args = match.extracted.join(' ');
        const proposed = match.command.replace(/<.*?>/g, args || '[path]');
        
        if (match.score > 25) {
            console.log(`\n  > Intent: ${match.command}`);
            console.log(`  > Auto-running: ${proposed}...\n`);
            try {
                const cmdToExec = proposed.replace('snip', `node "${process.argv[1]}"`);
                execSync(cmdToExec, { 
                    stdio: 'inherit',
                    env: { ...process.env, SNIP_AUTORUN: '1' } 
                });
                process.exit(0);
            } catch (e) {
                process.exit(1);
            }
        }

        console.error(`\n  ✖ Unknown command: "${process.argv[2]}"`);
        console.log(`  > Did you mean: ${match.command}?`);
        console.log(`  > Try running: ${proposed}\n`);
    } else {
        console.error(`\n  ✖ Unknown: "${process.argv[2]}"\n`);
    }
    process.exit(1);
});

program.parse();
