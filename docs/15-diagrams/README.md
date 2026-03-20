# Step 15: Mermaid.js Diagrams

Visualizing logic is a core part of a developer's job. This step adds the ability to generate professional diagrams directly from text using **Mermaid.js**.

## What you'll learn
- Rendering diagrams from text with Mermaid.js.
- Combining Puppeteer with external CDNs.
- Translating simple "arrow" syntax into complex diagram code.

## Run it

You don't need any new libraries installed locally (we load Mermaid in the browser), but make sure you have Puppeteer ready.

Run it with a simple "arrow" string:

```bash
node cli.js --diagram "Client -> Load Balancer -> Server -> Database"
```

Or run it with a file containing raw Mermaid syntax:

```bash
node cli.js --diagram architecture.mmd
```

## Key concept: The Mermaid Engine

Mermaid is a browser-based library. To make it work in our CLI, we follow these steps:

1.  **Input Translation**: If a user types `A -> B`, we wrap it in Mermaid's `graph LR` syntax.
2.  **HTML Generation**: We create an HTML string that loads the Mermaid library from a CDN and contains our diagram text.
3.  **Headless Rendering**: Puppeteer opens that HTML, Mermaid renders the SVG, and we take a screenshot of the resulting "card".

### The Translation Logic
Inside `src/mermaid.js`, we have a simple parser:

```js
export function simpleToMermaid(input) {
    // If it's already Mermaid syntax, leave it
    if (input.startsWith('graph') || input.startsWith('flowchart')) return input;

    // Otherwise, turn "A -> B" into "graph LR; A --> B"
    const parts = input.split('->').map(p => p.trim());
    let output = 'graph LR\n';
    for (let i = 0; i < parts.length - 1; i++) {
        output += `    ${parts[i]} --> ${parts[i+1]}\n`;
    }
    return output;
}
```

### The HTML Template
We inject the Mermaid library via a script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<div class="mermaid">
    ${mermaidCode}
</div>
<script>
    mermaid.initialize({ startOnLoad: true });
</script>
```

This turns `snip` into a powerful visualization tool for everything from simple app flows to complex system architectures.
