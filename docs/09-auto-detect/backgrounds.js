// A collection of gradient backgrounds for the card
// Each one has a key (used in CLI), a display name, and a CSS gradient

const backgrounds = {
    candy: {
        name: 'Candy',
        css: 'linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%)',
    },
    ocean: {
        name: 'Ocean',
        css: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
    },
    sunset: {
        name: 'Sunset',
        css: 'linear-gradient(135deg, #F12711 0%, #f5af19 100%)',
    },
    mint: {
        name: 'Mint',
        css: 'linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)',
    },
    midnight: {
        name: 'Midnight',
        css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    },
    neon: {
        name: 'Neon',
        css: 'linear-gradient(135deg, #FF0099 0%, #493240 50%, #00DBDE 100%)',
    },
    breeze: {
        name: 'Breeze',
        css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    },
    noir: {
        name: 'Noir',
        css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    aurora: {
        name: 'Aurora',
        css: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
    },
    peach: {
        name: 'Peach',
        css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
};

// Get a background by key, fallback to "candy"
export function getBackground(name) {
    return backgrounds[name] || backgrounds.candy;
}

// List all backgrounds (for --list-bgs)
export function listBackgrounds() {
    return Object.entries(backgrounds).map(([key, val]) => ({
        key,
        name: val.name,
    }));
}

export default backgrounds;
