import fs from 'fs';

// Grab the filename from the command line
// When you run: node index.js sample.js
// process.argv = ['node', 'index.js', 'sample.js']
// So process.argv[2] is the file we want
const file = process.argv[2];

if (!file) {
    console.log('Usage: node index.js <file>');
    process.exit(1);
}

// Read the file contents as a string
const code = fs.readFileSync(file, 'utf-8');

// Just print it for now
console.log(code);
