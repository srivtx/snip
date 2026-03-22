import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, 'index.json');

/**
 * Dice's Coefficient for string similarity (0 to 1)
 */
function fuzzyMatch(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Simple bigram overlap
    const getBigrams = (s) => {
        const bigrams = new Set();
        for (let i = 0; i < s.length - 1; i++) bigrams.add(s.substring(i, i + 2));
        return bigrams;
    };
    
    const b1 = getBigrams(s1);
    const b2 = getBigrams(s2);
    let intersect = 0;
    for (let itm of b1) if (b2.has(itm)) intersect++;
    
    return (2.0 * intersect) / (b1.size + b2.size) || 0;
}

/**
 * Extract arguments (files, URLs, flags, and values) from a natural language prompt
 */
function extractArgs(prompt, item) {
    const words = prompt.split(/\s+/);
    const args = [];
    
    const isUrl = (w) => /^(https?:\/\/)?([\w-]+\.)+[\w-]+/.test(w);
    const isFile = (w) => /\.(js|jsx|ts|tsx|css|html|md|png|jpg|jpeg|svg|mmd|mp4)$/i.test(w);
    const isFlag = (w) => w.startsWith('--');
    const isNumeric = (w) => /^\d+$/.test(w);

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const clean = word.replace(/['",]/g, '');
        
        if (isFlag(clean)) {
            args.push(clean);
            // If the next word is a value (numeric or quoted), capture it too
            if (i + 1 < words.length) {
                const next = words[i + 1].replace(/['",]/g, '');
                if (isNumeric(next) || !isFlag(next)) {
                    args.push(next);
                    i++; // Skip the next word since we consumed it
                }
            }
        } else if ((isUrl(clean) || isFile(clean)) && !item.keywords.includes(clean.toLowerCase())) {
            args.push(clean);
        }
    }
    return args;
}

/**
 * Enhanced RAG: Local Fuzzy Semantic Search with Argument Awareness
 */
export function findCommand(prompt) {
    if (!fs.existsSync(INDEX_PATH)) return null;
    
    const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
    const input = prompt.toLowerCase().trim();
    const words = input.split(/\W+/).filter(w => w.length > 2);
    
    let bestMatch = null;
    let maxScore = 0;

    for (const item of index) {
        let score = 0;
        
        // 1. Full command fuzzy match
        const cmdSim = fuzzyMatch(input, item.command.replace(/snip\s*/, ''));
        score += cmdSim * 30;

        // 2. Keyword hits
        for (const word of words) {
            for (const kw of item.keywords) {
                const sim = fuzzyMatch(word, kw);
                if (sim > 0.8) score += sim * 15;
                else if (sim > 0.6) score += sim * 5;
            }
            if (item.desc.toLowerCase().includes(word)) score += 5;
        }

        // 3. Action Verb Bonus
        const actionVerbs = ["make", "create", "render", "show", "generate", "take", "capture", "remove"];
        for (const v of actionVerbs) {
            if (input.startsWith(v)) score += 5;
        }

        if (score > maxScore) {
            maxScore = score;
            const extracted = extractArgs(prompt, item);
            bestMatch = { ...item, score, extracted };
        }
    }

    return maxScore > 10 ? bestMatch : null;
}
