import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { renderHTML, THEMES } from './render.js';
import { takeScreenshot } from './screenshot.js';
import { listBackgrounds } from './backgrounds.js';

const program = new Command();

program
    .name('snip')
    .argument('[file]', 'code file (optional — you can also pipe or paste)')
    .option('-t, --theme <theme>', 'syntax theme', 'dracula')
    .option('-b, --bg <background>', 'background gradient', 'candy')
    .option('-o, --output <path>', 'output file path')
    .option('--list-themes', 'show all themes')
    .option('--list-bgs', 'show all backgrounds')
    .action(async (file, opts) => {
        if (opts.listThemes) {
            THEMES.forEach((t) => console.log(`  • ${t}`));
            return;
        }
        if (opts.listBgs) {
            listBackgrounds().forEach((b) => console.log(`  • ${b.key.padEnd(12)} ${b.name}`));
            return;
        }

        // ── Three ways to get code ──
        let code;
        let filename = '';

        if (file) {
            // 1. File argument
            const filePath = path.resolve(file);
            code = fs.readFileSync(filePath, 'utf-8');
            filename = path.basename(filePath);

        } else if (!process.stdin.isTTY) {
            // 2. Piped input: cat file.js | snip
            code = await readStdin();

        } else {
            // 3. Interactive paste mode
            console.log('(Paste your code, press Enter twice to generate)');
            code = await readInteractive();
        }

        if (!code || !code.trim()) {
            console.log('No code provided');
            return;
        }

        const outputPath = opts.output || `${filename ? path.basename(filename, path.extname(filename)) : 'snip'}-snip.png`;

        console.log(`snip — theme: ${opts.theme} | bg: ${opts.bg}`);

        const html = await renderHTML(code, {
            theme: opts.theme,
            background: opts.bg,
            filename,
        });

        const buffer = await takeScreenshot(html);
        fs.writeFileSync(outputPath, buffer);
        console.log(`✔ saved ${outputPath}`);
    });

// Read all data from a pipe until it closes
function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => { data += chunk; });
        process.stdin.on('end', () => resolve(data));
    });
}

// Read interactively until the user presses Enter on an empty line
function readInteractive() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
            // Two newlines in a row = user pressed Enter on empty line
            if (data.endsWith('\n\n')) {
                process.stdin.pause();
                resolve(data.trimEnd());
            }
        });
    });
}

program.parse();
