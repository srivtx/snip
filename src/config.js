// Persistent config for snip
// Stored in ~/.sniprc.json

import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.sniprc.json');

const DEFAULTS = {
    author: '',
    handle: '',
    pic: '',    // absolute path to profile picture
};

export function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
            return { ...DEFAULTS, ...JSON.parse(raw) };
        }
    } catch {
        // corrupted file, reset
    }
    return { ...DEFAULTS };
}

export function saveConfig(updates) {
    const current = loadConfig();
    const merged = { ...current, ...updates };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2));
    return merged;
}

export function getConfigPath() {
    return CONFIG_PATH;
}
