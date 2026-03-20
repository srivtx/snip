# Step 6: Themes and Backgrounds

Now we add variety — multiple syntax themes and gradient backgrounds.

## What's new from Step 5
- A new `backgrounds.js` file with 10 curated gradient presets
- The `--bg` flag lets you pick a background gradient
- `--list-themes` and `--list-bgs` to discover what's available
- The background gradient is applied to the outer area around the card

## Run it

```bash
node cli.js sample.js --theme tokyo-night --bg midnight
node cli.js sample.js --theme nord --bg ocean
node cli.js sample.js --list-themes
node cli.js sample.js --list-bgs
```

## Key concept: Separating data from logic

Instead of hardcoding colors in the template, we keep them in `backgrounds.js`:

```js
const backgrounds = {
  candy: {
    name: 'Candy',
    css: 'linear-gradient(135deg, #6C3CE1, #E14B9E, #F7971E)',
  },
  ocean: {
    name: 'Ocean',
    css: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
  },
};
```

Then in the template we just plug in `${bg.css}`. Easy to add new ones later.
