import Jimp from 'jimp';

async function cropIcon() {
    // Read the AI-generated icon (which has a lot of white padding)
    const image = await Jimp.read('/Users/zen/.gemini/antigravity/brain/615feed0-42f9-44c2-b825-d6ee9713f688/snip_icon_isolated_1773084102629.png');

    // The generated image is 1024x1024, but the squircle itself is roughly 600x600 in the center.
    // We'll crop out the white padding to make it a tight 800x800 square, 
    // then we'll make any remaining pure white pixels transparent.

    // 1. Crop the center squircle
    // The actual icon usually sits right in the middle 
    const width = image.getWidth();
    const height = image.getHeight();

    // Find the bounding box of non-white pixels
    let top = height, bottom = 0, left = width, right = 0;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // If not pure white
        if (r < 250 || g < 250 || b < 250) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
            if (x < left) left = x;
            if (x > right) right = x;
        }
    });

    // Add a tiny bit of padding (5% on each side)
    const w = right - left;
    const h = bottom - top;
    const padUrl = Math.floor(w * 0.05);

    // Crop down to just the icon itself
    image.crop(
        Math.max(0, left - padUrl),
        Math.max(0, top - padUrl),
        Math.min(width, w + (padUrl * 2)),
        Math.min(height, h + (padUrl * 2))
    );

    // 2. Make the background transparent
    // We'll assume the top-left pixel is the background color we want to drop
    const bgPixelColor = image.getPixelColor(0, 0);

    image.scan(0, 0, image.getWidth(), image.getHeight(), function (x, y, idx) {
        const color = this.getPixelColor(x, y);
        // If it's pure white (or very close), set alpha to 0 and color to transparent
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        if (r > 245 && g > 245 && b > 245) {
            this.bitmap.data[idx + 3] = 0; // Alpha
        }
    });

    // 3. Resize back to a crisp 1024x1024
    image.resize(1024, 1024, Jimp.RESIZE_BICUBIC);

    await image.writeAsync('/tmp/snip_icon_transparent.png');
    console.log('Successfully cropped and made transparent!');
}

cropIcon().catch(console.error);
