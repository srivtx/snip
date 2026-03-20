# Step 9: Auto-Detect Language

The final piece — the tool can now figure out what language your code is written in, even without a file extension.

## What's new from Step 8
- A new `detect.js` file with heuristic-based language detection
- If you paste code without specifying a language, it analyzes patterns in the code
- `snip .js` shorthand to specify language quickly without a file
- Priority chain: `--lang` flag > `.ext` shorthand > file extension > auto-detect > fallback

## Run it

```bash
# Auto-detects JavaScript from file extension
node cli.js sample.js

# Shorthand: tell it the language, then paste
node cli.js .rs
# (paste Rust code, press Enter twice)

# Just paste — it figures it out
node cli.js
# (paste any code, press Enter twice)

# Pipe some Python — auto-detected
echo "def hello(): print('hi')" | node cli.js
```

## Key concept: Pattern matching

We check the code against common syntax patterns for each language:

```js
const patterns = [
  { lang: 'rust',   rules: [/\bfn\s+\w+/, /\blet\s+mut\b/, /println!\(/] },
  { lang: 'python', rules: [/\bdef\s+\w+\(/, /\bimport\s+\w+/] },
  { lang: 'go',     rules: [/\bfunc\s+\w+\(/, /\bpackage\s+\w+/] },
];
```

Each language has a set of regex rules. We count how many rules match, and the language with the highest score wins. It's not perfect, but it handles the common cases well.
