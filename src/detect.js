// Language auto-detection from code content using simple heuristics.
// This is NOT perfect, but handles the most common cases well enough
// for a CLI tool that generates code screenshots.

const patterns = [
    // Rust
    { lang: 'rust', rules: [/\bfn\s+\w+\s*\(/, /\blet\s+mut\b/, /\bimpl\b/, /\bpub\s+fn\b/, /->.*\{/, /println!\(/, /use\s+std::/] },
    // Go
    { lang: 'go', rules: [/\bfunc\s+\w+\(/, /\bpackage\s+\w+/, /\bfmt\./, /\bgo\s+func/, /:=\s*/] },
    // Python
    { lang: 'python', rules: [/\bdef\s+\w+\(/, /\bimport\s+\w+/, /\bfrom\s+\w+\s+import/, /\bclass\s+\w+.*:/, /\bprint\s*\(/] },
    // TypeScript (check before JS since TS is a superset)
    { lang: 'typescript', rules: [/:\s*(string|number|boolean|any|void)\b/, /\binterface\s+\w+/, /\btype\s+\w+\s*=/, /<\w+>\s*\(/, /\bas\s+\w+/] },
    // JSX / TSX
    { lang: 'jsx', rules: [/\breturn\s*\(\s*</, /<\w+[\s>].*\/>/, /className=/] },
    // JavaScript
    { lang: 'javascript', rules: [/\bconst\s+\w+\s*=/, /\bfunction\s+\w+/, /\bconsole\.log\(/, /\brequire\s*\(/, /=>\s*\{/, /\bexport\s+(default\s+)?/] },
    // Java
    { lang: 'java', rules: [/\bpublic\s+class\b/, /\bprivate\s+\w+/, /\bSystem\.out\.print/, /\bpublic\s+static\s+void\s+main/] },
    // C++
    { lang: 'cpp', rules: [/#include\s*<\w+>/, /\bstd::/, /\bcout\s*<</, /\bint\s+main\s*\(/, /\btemplate\s*</] },
    // C
    { lang: 'c', rules: [/#include\s*<stdio\.h>/, /\bprintf\s*\(/, /\bint\s+main\s*\(.*\)\s*\{/, /\bmalloc\s*\(/] },
    // C#
    { lang: 'csharp', rules: [/\busing\s+System/, /\bnamespace\s+\w+/, /\bConsole\.Write/] },
    // Ruby
    { lang: 'ruby', rules: [/\bputs\s+/, /\bdef\s+\w+\s*$/, /\bend\s*$/, /\brequire\s+['"]/, /\battr_accessor\b/] },
    // PHP
    { lang: 'php', rules: [/<\?php/, /\$\w+\s*=/, /\becho\s+/, /\bfunction\s+\w+\s*\(/] },
    // Swift
    { lang: 'swift', rules: [/\bvar\s+\w+\s*:/, /\blet\s+\w+\s*:/, /\bfunc\s+\w+\(/, /\bguard\s+let\b/, /\bimport\s+Foundation/] },
    // Kotlin
    { lang: 'kotlin', rules: [/\bfun\s+\w+\(/, /\bval\s+\w+/, /\bvar\s+\w+/, /\bprintln\s*\(/] },
    // SQL
    { lang: 'sql', rules: [/\bSELECT\s+/i, /\bFROM\s+/i, /\bINSERT\s+INTO\b/i, /\bCREATE\s+TABLE\b/i] },
    // HTML
    { lang: 'html', rules: [/<!DOCTYPE\s+html>/i, /<html[\s>]/, /<div[\s>]/, /<head>/, /<body>/] },
    // CSS
    { lang: 'css', rules: [/\{[\s\S]*?:\s*[\w#]+;/, /@media\s*\(/, /\.[\w-]+\s*\{/, /#[\w-]+\s*\{/] },
    // Bash
    { lang: 'bash', rules: [/^#!/, /\becho\s+/, /\bif\s+\[/, /\bfi\s*$/, /\bdo\s*$/] },
    // JSON
    { lang: 'json', rules: [/^\s*\{[\s\S]*"[\w]+":\s*/, /^\s*\[[\s\S]*\]\s*$/] },
    // YAML
    { lang: 'yaml', rules: [/^\w+:\s*\n/, /^\s+-\s+\w+/] },
];

export function guessLang(code) {
    const scores = {};

    for (const { lang, rules } of patterns) {
        let score = 0;
        for (const rule of rules) {
            if (rule.test(code)) score++;
        }
        if (score > 0) scores[lang] = score;
    }

    if (Object.keys(scores).length === 0) return null;

    // Return the language with the highest score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
}
