# Step 22: Visual Diff

Ever wanted to show the difference between two files in a blog post or slide? This tool generates a beautiful, color-coded visual diff image.

## What you'll learn
- Calculating line-by-line differences with the `diff` library.
- Using Shiki's `diff` language support for syntax highlighting.
- Rendering multi-file comparisons.

## Run it

```bash
node cli.js tool diff file1.js file2.js --bg ocean
```

## Key concept: The Diff Protocol

We use the `diffLines` function to compare two strings and get an array of "parts". We then format these into a standard diff format (`+` for additions, `-` for removals) that Shiki understands.

```js
import { diffLines } from 'diff';

const diff = diffLines(oldCode, newCode);
diff.forEach(part => {
  const prefix = part.added ? '+' : (part.removed ? '-' : ' ');
  // ... build the highlighted string
});
```

This turns raw code changes into a professional, shareable graphic.
