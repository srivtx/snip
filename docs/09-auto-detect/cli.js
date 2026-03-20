import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Command } from 'commander';
import { renderHTML, THEMES, detectLang } from './render.js';
import { takeScreenshot } from './screenshot.js';
import { listBackgrounds } from './backgrounds.js';
import { guessLang } from './detect.js';

const program = new Command();

program
    .name('snip')
    .argument('[file]', 'code file, language shorthand (.js, .rs), or "dump"')
    .option('-t, --theme <theme>', 'syntax theme', 'dracula')
    .option('-b, --bg <background>', 'background gradient', 'candy')
    .option('-o, --output <path>', 'output file path')
    .option('-l, --lang <language>', 'override language detection')
    .option('--no-copy', 'skip copying to clipboard')
    .option('--list-themes', 'show all themes')
    .option('--list-bgs', 'show all backgrounds')
    .action(async (file, opts) => {
        if (opts.listThemes) { THEMES.forEach((t) => console.log(`  • ${t}`)); return; }
        if (opts.listBgs) { listBackgrounds().forEach((b) => console.log(`  • ${b.key}`)); return; }

        // NEW: Language shorthand — "snip .js" or "snip .rs"
        let langHint = null;
        if (file && file.startsWith('.') && !fs.existsSync(path.resolve(file))) {
            langHint = detectLang('file' + file);
            file = null; // switch to interactive mode
        }

        let code, filename = '';

        if (file) {
            code = fs.readFileSync(path.resolve(file), 'utf-8');
            filename = path.basename(file);
        } else if (!process.stdin.isTTY) {
            code = await readStdin();
        } else {
            if (langHint) {
                console.log(`(lang: ${langHint} — paste your code, press Enter twice)`);
            } else {
                console.log('(Paste your code, press Enter twice to generate)');
            }
            code = await readInteractive();
        }

        if (!code || !code.trim()) { console.log('No code provided'); return; }

        // NEW: Language priority chain
        // --lang flag > .ext shorthand > file extension > auto-detect > fallback
        let lang;
        if (opts.lang) {
            lang = opts.lang;
        } else if (langHint) {
            lang = langHint;
        } else if (filename) {
            lang = detectLang(filename);
        } else {
            lang = guessLang(code) || 'javascript';
        }

        const outputPath = opts.output || `${filename ? path.basename(filename, path.extname(filename)) : 'snip'}-snip.png`;

        console.log(`\nsnip v1.0.0`);
        console.log(`theme: ${opts.theme} | bg: ${opts.bg} | lang: ${lang}\n`);

        const html = await renderHTML(code, { theme: opts.theme, background: opts.bg, filename, lang });
        const buffer = await takeScreenshot(html);
        fs.writeFileSync(outputPath, buffer);
        console.log(`✔ saved ${outputPath}`);

        if (opts.copy !== false) {
            try {
                copyToClipboard(path.resolve(outputPath));
                console.log('✔ copied to clipboard');
            } catch {
                console.log('⚠ could not copy to clipboard');
            }
        }
        console.log();
    });

function copyToClipboard(imagePath) {
    if (process.platform === 'darwin') {
        execSync(`osascript -e 'set the clipboard to (read (POSIX file "${imagePath}") as «class PNGf»)'`);
    } else if (process.platform === 'linux') {
        execSync(`xclip -selection clipboard -t image/png -i "${imagePath}"`);
    }
}

function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => { data += chunk; });
        process.stdin.on('end', () => resolve(data));
    });
}

function readInteractive() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
            if (data.endsWith('\n\n')) { process.stdin.pause(); resolve(data.trimEnd()); }
        });
    });
}

program.parse();
