import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Command } from 'commander';
import { renderHTML, THEMES } from './render.js';
import { takeScreenshot } from './screenshot.js';
import { listBackgrounds } from './backgrounds.js';

const program = new Command();

program
    .name('snip')
    .argument('[file]', 'code file (optional)')
    .option('-t, --theme <theme>', 'syntax theme', 'dracula')
    .option('-b, --bg <background>', 'background gradient', 'candy')
    .option('-o, --output <path>', 'output file path')
    .option('--no-copy', 'skip copying to clipboard')  // NEW
    .option('--list-themes', 'show all themes')
    .option('--list-bgs', 'show all backgrounds')
    .action(async (file, opts) => {
        if (opts.listThemes) { THEMES.forEach((t) => console.log(`  • ${t}`)); return; }
        if (opts.listBgs) { listBackgrounds().forEach((b) => console.log(`  • ${b.key}`)); return; }

        let code, filename = '';

        if (file) {
            code = fs.readFileSync(path.resolve(file), 'utf-8');
            filename = path.basename(file);
        } else if (!process.stdin.isTTY) {
            code = await readStdin();
        } else {
            console.log('(Paste your code, press Enter twice to generate)');
            code = await readInteractive();
        }

        if (!code || !code.trim()) { console.log('No code provided'); return; }

        const outputPath = opts.output || `${filename ? path.basename(filename, path.extname(filename)) : 'snip'}-snip.png`;

        console.log(`\nsnip v1.0.0`);
        console.log(`theme: ${opts.theme} | bg: ${opts.bg}\n`);

        const html = await renderHTML(code, { theme: opts.theme, background: opts.bg, filename });
        const buffer = await takeScreenshot(html);
        fs.writeFileSync(outputPath, buffer);
        console.log(`✔ saved ${outputPath}`);

        // NEW: Copy to clipboard
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

// NEW: Copy a PNG to the system clipboard
function copyToClipboard(imagePath) {
    if (process.platform === 'darwin') {
        // macOS: AppleScript
        execSync(`osascript -e 'set the clipboard to (read (POSIX file "${imagePath}") as «class PNGf»)'`);
    } else if (process.platform === 'linux') {
        // Linux: xclip
        execSync(`xclip -selection clipboard -t image/png -i "${imagePath}"`);
    } else if (process.platform === 'win32') {
        // Windows: PowerShell
        execSync(`powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${imagePath}'))"`);
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
