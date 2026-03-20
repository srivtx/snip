# Step 24: Color Theory Utility

Stuck on what colors to use for your UI? Pass a hex code and get a full color analysis directly in your terminal.

## What you'll learn
- Manipulating colors programmatically with `tinycolor2`.
- Understanding color relationships (Complementary, Analogous).
- Generating Shades (Darker) and Tints (Lighter).

## Run it

```bash
node cli.js tool color "#ff0055"
```

## Key concept: Color Harmony

Colors aren't just random numbers. They have relationships. `tinycolor2` helps us calculate these:

- **Complementary**: The color directly opposite on the color wheel.
- **Analogous**: Colors next to each other (looks great for gradients).
- **Shades/Tints**: Perfect for building "Hover" or "Disabled" states in CSS.

```js
const color = tinycolor("#ff0055");
const complementary = color.complement();
const shade = color.darken(10);
const tint = color.lighten(10);
```

Our tool prints these as visual swatches so you can "see" the palette before you even touch your code.
