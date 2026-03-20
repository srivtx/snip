# Step 8: Clipboard Copy

After generating the image, we automatically copy it to the system clipboard so you can paste it directly into Twitter, Slack, or Discord.

## What's new from Step 7
- After saving the PNG, we call a system command to copy the image to clipboard
- The terminal shows `✔ copied to clipboard`
- Works on macOS, Linux (with xclip), and Windows
- Added `--no-copy` flag if you don't want clipboard copy

## Run it

```bash
node cli.js sample.js
# Now Cmd+V to paste the image anywhere!
```

## Key concept: System commands from Node.js

We use `child_process.execSync` to run OS-level commands:

```js
import { execSync } from 'child_process';

// macOS — uses AppleScript to set clipboard
execSync(`osascript -e 'set the clipboard to (read (POSIX file "/path/to/image.png") as «class PNGf»)'`);

// Linux — uses xclip
execSync(`xclip -selection clipboard -t image/png -i "/path/to/image.png"`);
```

Each OS has a different way to copy images to clipboard, so we check `process.platform` and run the right command.
