# Step 7: Pipe and Paste Mode

Now the tool works without a file — you can pipe code into it or just paste directly.

## What's new from Step 6
- **Pipe mode**: `cat file.js | node cli.js`
- **Interactive paste mode**: Just run `node cli.js`, paste code, press Enter twice
- The tool checks `process.stdin.isTTY` to know if it's receiving piped input

## Run it

```bash
# Normal file mode (same as before)
node cli.js sample.js

# Pipe mode — send code through a pipe
cat sample.js | node cli.js

# Paste mode — just run it and paste
node cli.js
# (paste your code, press Enter twice)
```

## Key concept: stdin

When you run a command in a terminal, it has access to "stdin" (standard input).

- If you pipe something (`cat file | node cli.js`), stdin receives that data
- If you run it normally, stdin is your keyboard

We check which one it is:
```js
if (!process.stdin.isTTY) {
  // Piped input — read until it ends
  code = await readStdin();
} else {
  // Interactive — read until two newlines
  code = await readInteractive();
}
```

For interactive mode, we listen line by line and stop when we see an empty line (Enter pressed twice).
