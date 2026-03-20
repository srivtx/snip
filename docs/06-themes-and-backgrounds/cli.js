import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { renderHTML, THEMES } from './render.js';
import { takeScreenshot } from './screenshot.js';
import { listBackgrounds } from './backgrounds.js';

const program = new Command();

program
    .name('snip')
    .argument('<file>', 'code file to snapshot')
    .option('-t, --theme <theme>', 'syntax theme', 'dracula')
    .option('-b, --bg <background>', 'background gradient', 'candy')
    .option('-o, --output <path>', 'output file path')
    .option('--list-themes', 'show all themes')
    .option('--list-bgs', 'show all backgrounds')
    .action(async (file, opts) => {
        if (opts.listThemes) {
            console.log('\nAvailable themes:\n');
            THEMES.forEach((t) => console.log(`  • ${t}`));
            console.log();
            return;
        }

        if (opts.listBgs) {
            console.log('\nAvailable backgrounds:\n');
            listBackgrounds().forEach((b) => console.log(`  • ${b.key.padEnd(12)} ${b.name}`));
            console.log();
            return;
        }

        const filePath = path.resolve(file);
        const code = fs.readFileSync(filePath, 'utf-8');
        const filename = path.basename(filePath);
        const base = path.basename(filename, path.extname(filename));
        const outputPath = opts.output || `${base}-snip.png`;

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

program.parse();
