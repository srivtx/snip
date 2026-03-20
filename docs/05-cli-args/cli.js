import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { renderHTML, THEMES } from './render.js';
import { takeScreenshot } from './screenshot.js';

const program = new Command();

program
    .name('snip')
    .description('Generate beautiful code snippet images')
    .argument('<file>', 'code file to snapshot')
    .option('-t, --theme <theme>', `syntax theme (${THEMES.join(', ')})`, 'dracula')
    .option('-o, --output <path>', 'output file path')
    .action(async (file, opts) => {
        // Read the file
        const filePath = path.resolve(file);
        const code = fs.readFileSync(filePath, 'utf-8');
        const filename = path.basename(filePath);

        // Figure out the output filename
        const base = path.basename(filename, path.extname(filename));
        const outputPath = opts.output || `${base}-snip.png`;

        console.log(`snip — theme: ${opts.theme}, file: ${filename}`);

        // Render HTML card
        const html = await renderHTML(code, {
            theme: opts.theme,
            filename,
        });

        // Screenshot to PNG
        const buffer = await takeScreenshot(html);
        fs.writeFileSync(outputPath, buffer);

        console.log(`✔ saved ${outputPath}`);
    });

program.parse();
