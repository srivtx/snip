# Step 2: Syntax Highlighting

Now we make the code look pretty using **Shiki** — the same syntax highlighter that powers VS Code.

## What's new from Step 1
- Instead of printing raw text, we convert the code to **highlighted HTML**
- Shiki takes plain code and returns HTML with `<span>` elements for each token, colored by the theme

## Run it

```bash
node index.js sample.js
```

## What happens
It reads `sample.js`, highlights it with the Dracula theme, and prints the resulting HTML to your terminal.

The output will look like a bunch of HTML tags — that's normal! In the next step we'll wrap this HTML in a nice card template.

## Key concept: Shiki
```js
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['dracula'],
  langs: ['javascript'],
});

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'dracula',
});
```

That's the core of it. Give Shiki some code + a language + a theme → it returns beautiful HTML.
