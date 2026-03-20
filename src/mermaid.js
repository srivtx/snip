import { getBackground } from './backgrounds.js';

/**
 * Converts a simple "A -> B -> C" string into Mermaid syntax.
 */
export function simpleToMermaid(input) {
    // If it looks like raw Mermaid syntax (e.g. starts with graph, flowchart, sequenceDiagram etc.), return it
    const mermaidKeywords = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'gitGraph'];
    if (mermaidKeywords.some(keyword => input.trim().startsWith(keyword))) {
        return input;
    }

    // Otherwise, convert "A -> B -> C" to Mermaid flowchart
    // Replace " -> " with " --> "
    const parts = input.split('->').map(p => p.trim());
    if (parts.length < 2) return input; // Not a chain

    let output = 'graph LR\n';
    for (let i = 0; i < parts.length - 1; i++) {
        output += `    ${parts[i]} --> ${parts[i+1]}\n`;
    }
    return output;
}

/**
 * Generates the HTML for rendering Mermaid diagrams.
 */
export function renderMermaidHTML(mermaidCode, options = {}) {
    const {
        background = 'candy',
        padding = 42,
        style = 'default', // default or hand-drawn
        dark = false,
    } = options;

    const bg = getBackground(background);
    const isHandDrawn = style === 'hand-drawn';
    const cardBg = dark ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = dark ? '#cdd6f4' : '#45475a';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Architects+Daughter&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    margin: 0;
    padding: 0;
    display: inline-block;
  }

  .bg-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${padding + 16}px;
    background: ${bg.css};
    min-height: 100px;
  }

  .card {
    background: ${cardBg};
    backdrop-filter: blur(10px);
    border-radius: 14px;
    overflow: hidden;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.15),
      0 20px 60px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.06);
    padding: 30px;
    border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
  }

  .mermaid {
    font-family: ${isHandDrawn ? "'Architects Daughter', cursive" : "'JetBrains Mono', monospace"} !important;
    color: ${textColor};
  }
</style>
</head>
<body>
  <div class="bg-wrapper">
    <div class="card">
      <div class="mermaid">
  ${mermaidCode}
      </div>
    </div>
  </div>
  <script>
    mermaid.initialize({ 
        startOnLoad: true, 
        theme: '${isHandDrawn ? 'neutral' : (dark ? 'dark' : 'default')}',
        look: '${isHandDrawn ? 'hand-drawn' : 'classic'}',
        fontFamily: '${isHandDrawn ? 'Architects Daughter' : 'JetBrains Mono'}'
    });
  </script>
</body>
</html>`;
}
