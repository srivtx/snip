# Step 5: CLI Arguments

Now we make it feel like a real CLI tool using **Commander.js** to handle flags and arguments.

## What's new from Step 4
- We use Commander.js to parse arguments properly
- You can now pass `--theme` to choose a syntax theme
- The code is split into 3 files for better organization
- We auto-detect the language from the file extension

## Run it

```bash
node cli.js sample.js
node cli.js sample.js --theme tokyo-night
```

## Files

| File | Purpose |
|------|---------|
| `cli.js` | Entry point — parses arguments, orchestrates everything |
| `render.js` | Reads code, highlights it, builds the HTML card |
| `screenshot.js` | Takes HTML → PNG (same as Step 4) |

## Key concept: Commander.js

```js
import { Command } from 'commander';

const program = new Command();
program
  .argument('<file>', 'code file to snapshot')
  .option('-t, --theme <theme>', 'syntax theme', 'dracula')
  .action((file, opts) => {
    console.log(file);       // "sample.js"
    console.log(opts.theme); // "dracula" or whatever was passed
  });
program.parse();
```

Commander handles all the argument parsing for you. Flags, defaults, help text — everything.
