// Auto-detect language from code content
// We check common patterns for each language and score them

const patterns = [
    { lang: 'rust', rules: [/\bfn\s+\w+\s*\(/, /\blet\s+mut\b/, /println!\(/, /\bpub\s+fn\b/] },
    { lang: 'go', rules: [/\bfunc\s+\w+\(/, /\bpackage\s+\w+/, /\bfmt\./, /:=\s*/] },
    { lang: 'python', rules: [/\bdef\s+\w+\(/, /\bimport\s+\w+/, /\bprint\s*\(/] },
    { lang: 'typescript', rules: [/:\s*(string|number|boolean)\b/, /\binterface\s+\w+/, /\btype\s+\w+\s*=/] },
    { lang: 'javascript', rules: [/\bconst\s+\w+\s*=/, /\bconsole\.log\(/, /\brequire\s*\(/, /=>\s*\{/] },
    { lang: 'java', rules: [/\bpublic\s+class\b/, /\bSystem\.out\.print/] },
    { lang: 'cpp', rules: [/#include\s*<\w+>/, /\bstd::/, /\bcout\s*<</] },
    { lang: 'c', rules: [/#include\s*<stdio\.h>/, /\bprintf\s*\(/] },
    { lang: 'ruby', rules: [/\bputs\s+/, /\bend\s*$/, /\battr_accessor\b/] },
    { lang: 'php', rules: [/<\?php/, /\$\w+\s*=/] },
    { lang: 'swift', rules: [/\bfunc\s+\w+\(/, /\bguard\s+let\b/] },
    { lang: 'bash', rules: [/^#!/, /\becho\s+/, /\bif\s+\[/] },
    { lang: 'html', rules: [/<!DOCTYPE/i, /<html[\s>]/, /<div[\s>]/] },
    { lang: 'css', rules: [/\{[\s\S]*?:.*;\s*\}/, /@media\s*\(/] },
    { lang: 'sql', rules: [/\bSELECT\s+/i, /\bFROM\s+/i, /\bCREATE\s+TABLE\b/i] },
    { lang: 'json', rules: [/^\s*\{[\s\S]*"[\w]+":/] },
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
