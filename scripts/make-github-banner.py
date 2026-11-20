"""Renders the site banner (red night sky, rooftops, moon, roof cat, spinning stars, RANSU.DEV)
as an animated GIF for the GitHub profile README.

    python scripts/make-github-banner.py [output.gif]

It reuses the pixel art from make-retro-assets.py and the Pixelify Sans font from the site build,
so run `npm run build` (for the font) before this.
"""

from __future__ import annotations

import glob
import importlib.util
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("assets", ROOT / "scripts" / "make-retro-assets.py")
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)

NATIVE_W, NATIVE_H = 420, 100  # drawn at native pixel size...
SCALE = 3  # ...then blown up to 1260x300 with hard pixels
FRAMES = 60  # lcm of the sky (3), cat (4) and star (5) loops, so the GIF loops cleanly
FRAME_MS = 120
TITLE = "RANSU.DEV"


def pixelify() -> ImageFont.FreeTypeFont:
    for path in glob.glob(str(ROOT / "out" / "_next" / "static" / "media" / "*.woff2")):
        font = ImageFont.truetype(path, 40)
        if font.getname()[0] == "Pixelify Sans":
            break
    else:
        raise SystemExit("Pixelify Sans not found: run `npm run build` first.")
    font = ImageFont.truetype(path, 84)
    try:
        font.set_variation_by_axes([700])  # bold, like the site
    except (OSError, AttributeError):
        pass
    return font


def keyed(img: Image.Image) -> Image.Image:
    """The asset sprites use magenta as transparent; turn that into real alpha."""
    rgba = img.convert("RGBA")
    rgba.putdata([(0, 0, 0, 0) if p[:3] == A.KEY else p for p in rgba.get_flattened_data()])
    return rgba


def zigzag(d: ImageDraw.ImageDraw, x: int, y: int, color) -> None:
    """Three slanted strokes, a pixel stand-in for the 彡 next to the title."""
    for i in range(3):
        oy = y + i * 4
        d.line([(x, oy + 3), (x + 6, oy)], fill=color)


def background_frames(title_left: int, title_right: int) -> list[Image.Image]:
    """`title_left`/`title_right` are the title's edges in native pixels; the stars and strokes sit just outside them."""
    sky = A.banner_sky()
    roofs = keyed(A.banner_roofs()[0])
    moon = keyed(A.banner_moon()[0])
    cats = [keyed(f) for f in A.roof_cat()]
    stars = [keyed(f) for f in A.spin_star()]

    frames = []
    for f in range(FRAMES):
        img = Image.new("RGBA", (NATIVE_W, NATIVE_H))
        sky_tile = sky[(f // 4) % 3].convert("RGBA")
        sky_tile = sky_tile.crop((0, sky_tile.height - NATIVE_H, sky_tile.width, sky_tile.height))
        for x in range(0, NATIVE_W, sky_tile.width):
            img.paste(sky_tile, (x, 0))
        for x in range(0, NATIVE_W, roofs.width):
            img.alpha_composite(roofs, (x, NATIVE_H - roofs.height))
        img.alpha_composite(moon, (NATIVE_W - moon.width - 14, 8))
        img.alpha_composite(cats[f % 4], (41, NATIVE_H - roofs.height + 15 - 20))

        star = stars[f % 5]
        gap = 5
        img.alpha_composite(star, (title_left - gap - 7 - 4 - star.width, 28))
        img.alpha_composite(star, (title_right + gap + 7 + 4, 28))
        d = ImageDraw.Draw(img)
        zigzag(d, title_left - gap - 7, 30, A.GOLD)
        zigzag(d, title_right + gap, 30, A.GOLD)

        # The site's orange ridge border.
        d.rectangle([0, 0, NATIVE_W - 1, NATIVE_H - 1], outline=A.ORANGE)
        d.rectangle([1, 1, NATIVE_W - 2, NATIVE_H - 2], outline=A.CRIMSON)
        frames.append(img)
    return frames


def title_layer(size: tuple[int, int]) -> tuple[Image.Image, tuple[int, int]]:
    """RANSU.DEV as WordArt: gold gradient fill, dark outline, and a red-then-black extrusion."""
    w, h = size
    font = pixelify()
    probe = ImageDraw.Draw(Image.new("L", (1, 1)))
    left, top, right, bottom = probe.textbbox((0, 0), TITLE, font=font)
    x = (w - (right - left)) // 2 - left
    y = int(h * 0.40) - (bottom - top) // 2 - top

    def mask(dx: int = 0, dy: int = 0, stroke: int = 0) -> Image.Image:
        m = Image.new("L", size, 0)
        ImageDraw.Draw(m).text((x + dx, y + dy), TITLE, font=font, fill=255, stroke_width=stroke, stroke_fill=255)
        return m

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    e = 5  # extrusion depth in final pixels, about the same share of the letter size as on the site
    layer.paste(A.INK + (255,), (0, 0), mask(e * 2, e * 2, 3))
    layer.paste(A.PRIMARY + (255,), (0, 0), mask(e, e, 3))
    layer.paste(A.INK + (255,), (0, 0), mask(0, 0, 3))

    gradient = Image.new("RGBA", size)
    gd = ImageDraw.Draw(gradient)
    stops = [(0.0, (0xFF, 0xFF, 0x99)), (0.45, (0xFF, 0xCC, 0x00)), (0.7, (0xFF, 0xCC, 0x00)), (1.0, (0xE6, 0xA1, 0x00))]
    text_top, text_bottom = y + top, y + bottom
    for yy in range(h):
        t = min(1.0, max(0.0, (yy - text_top) / max(1, text_bottom - text_top)))
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                k = (t - t0) / (t1 - t0)
                color = tuple(round(a + (b - a) * k) for a, b in zip(c0, c1))
                break
        gd.line([(0, yy), (w, yy)], fill=color + (255,))
    layer.paste(gradient, (0, 0), mask())
    return layer, ((x + left) // SCALE, (x + right) // SCALE)


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "github-banner.gif"
    final_size = (NATIVE_W * SCALE, NATIVE_H * SCALE)
    title, (title_left, title_right) = title_layer(final_size)
    frames = []
    for bg in background_frames(title_left, title_right):
        big = bg.resize(final_size, Image.NEAREST)
        big.alpha_composite(title)
        frames.append(big.convert("RGB"))

    # One shared palette keeps every frame's colours identical, so nothing flickers.
    palette = frames[0].quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pframes = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
    pframes[0].save(out, save_all=True, append_images=pframes[1:], duration=FRAME_MS, loop=0, optimize=True, disposal=1)
    frames[0].save(out.with_suffix(".png"))
    print(f"{out}  {final_size[0]}x{final_size[1]}  {FRAMES} frames  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
