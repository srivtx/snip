# Step 16: Refactoring to Subcommands

As our CLI grew from a simple "code to image" tool into a full developer toolkit (OCR, compression, diagrams, etc.), the number of flags became overwhelming. In this final step, we refactored the entire architecture to use **Subcommands**.

## What you'll learn
- How to structure a professional CLI with categories.
- Using `commander.js` subcommands (`.command()`).
- Improving help documentation and discoverability.

## The Problem: "Flag Bloat"
Before this refactor, our CLI had flags for everything at once:
```bash
snip --bg candy --theme dracula --ocr path.png --diagram "A->B" --quality 50
```
This was confusing! A user just wanting a code snippet shouldn't have to see flags for QR codes or OCR.

## The Solution: Subcommands
We reorganized the tool into logical categories:
1.  **`snip [file]`** (The default action for code snippets)
2.  **`snip diagram`** (Anything visual/logic based)
3.  **`snip image`** (Anything that processes an existing image: ocr, compress, bg-remove)
4.  **`snip qr`** & **`snip svg`** (Standalone utilities)

## Key concept: Commander.js Commands

Instead of one `.action()` at the root, we define multiple commands:

```js
const program = new Command();

// 1. Root command (default)
program
    .argument('[file]')
    .action(async (file) => { /* Code snippet logic */ });

// 2. Nested commands
const image = program.command('image').description('Process images');

image.command('ocr')
    .argument('<path>')
    .action(async (path) => { /* OCR logic */ });

image.command('compress')
    .argument('<path>')
    .option('-q, --quality <n>', 'Quality', '80')
    .action(async (path, opts) => { /* Compression logic */ });
```

### Benefits of this architecture:
- **Discoverability**: When a user types `snip --help`, they see a clean list of "categories".
- **Contextual Help**: Running `snip image --help` only shows image-related flags.
- **Scalability**: We can add 10 more "image" tools without cluttering the root command.

## Summary
Building a great CLI isn't just about what features it has—it's about how easy those features are to find and use. Moving to subcommands turned `snip` from a "one-off script" into a "developer platform."
