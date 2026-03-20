import fs from 'fs';
import { createHighlighter } from 'shiki';

const file = process.argv[2];

if (!file) {
    console.log('Usage: node index.js <file>');
    process.exit(1);
}

const code = fs.readFileSync(file, 'utf-8');

// Create a Shiki highlighter
// We load just "dracula" theme and "javascript" for now
const highlighter = await createHighlighter({
    themes: ['dracula'],
    langs: ['javascript'],
});

// Convert plain code → colored HTML
const html = highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme: 'dracula',
});

// Print the HTML (it'll be a bunch of <span> tags with colors)
console.log(html);
