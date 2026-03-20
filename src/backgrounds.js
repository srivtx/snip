// Curated gradient backgrounds — each one designed to look stunning behind a code card
const backgrounds = {
  // Default — deep purple to pink aurora
  candy: {
    name: 'Candy',
    css: 'linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%)',
  },
  // Deep ocean blue
  ocean: {
    name: 'Ocean',
    css: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
  },
  // Sunset warm tones
  sunset: {
    name: 'Sunset',
    css: 'linear-gradient(135deg, #F12711 0%, #f5af19 100%)',
  },
  // Cool mint
  mint: {
    name: 'Mint',
    css: 'linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)',
  },
  // Midnight purple
  midnight: {
    name: 'Midnight',
    css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  // Neon cyberpunk
  neon: {
    name: 'Neon',
    css: 'linear-gradient(135deg, #FF0099 0%, #493240 50%, #00DBDE 100%)',
  },
  // Soft lavender
  breeze: {
    name: 'Breeze',
    css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  // Carbon black (minimal)
  noir: {
    name: 'Noir',
    css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  // Aurora borealis
  aurora: {
    name: 'Aurora',
    css: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
  },
  // Peach warm
  peach: {
    name: 'Peach',
    css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
};

export const DEFAULT_BG = 'candy';

export function getBackground(name) {
  return backgrounds[name] || backgrounds[DEFAULT_BG];
}

export function listBackgrounds() {
  return Object.entries(backgrounds).map(([key, val]) => ({
    key,
    name: val.name,
    css: val.css,
  }));
}

export default backgrounds;
