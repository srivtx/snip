import tinycolor from 'tinycolor2';

/**
 * Returns a sleek color palette (shades, tints, complementary) for a hex code.
 */
export function getColorData(hex) {
    const color = tinycolor(hex);
    if (!color.isValid()) return null;

    return {
        hex: color.toHexString().toUpperCase(),
        rgb: color.toRgbString(),
        complementary: color.complement().toHexString().toUpperCase(),
        shades: [
            color.clone().darken(10).toHexString().toUpperCase(),
            color.clone().darken(20).toHexString().toUpperCase(),
            color.clone().darken(30).toHexString().toUpperCase(),
        ],
        tints: [
            color.clone().lighten(10).toHexString().toUpperCase(),
            color.clone().lighten(20).toHexString().toUpperCase(),
            color.clone().lighten(30).toHexString().toUpperCase(),
        ],
        analogous: color.analogous().map(c => c.toHexString().toUpperCase()),
    };
}

/**
 * Renders the color palette in the terminal with ANSI swatches.
 */
export function printColorPalette(data) {
    const { hex, rgb, complementary, shades, tints, analogous } = data;

    const swatch = (h) => {
        const c = tinycolor(h).toRgb();
        return `\x1b[48;2;${c.r};${c.g};${c.b}m      \x1b[0m`;
    };

    console.log(`\n  \x1b[1mColor Analysis: ${hex}\x1b[0m`);
    console.log(`  \x1b[90m${rgb}\x1b[0m\n`);

    console.log(`  ${swatch(hex)}  \x1b[1mPrimary\x1b[0m`);
    console.log(`  ${swatch(complementary)}  \x1b[1mComplementary\x1b[0m\n`);

    console.log(`  \x1b[90mShades:\x1b[0m`);
    shades.forEach(s => console.log(`  ${swatch(s)}  ${s}`));
    
    console.log(`\n  \x1b[90mTints:\x1b[0m`);
    tints.forEach(t => console.log(`  ${swatch(t)}  ${t}`));

    console.log(`\n  \x1b[90mAnalogous:\x1b[0m`);
    analogous.forEach(a => console.log(`  ${swatch(a)}  ${a}`));
    console.log();
}
