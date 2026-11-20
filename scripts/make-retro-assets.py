"""Draws the site's 90s decorations as real pixel GIFs, the way they were made back then.

Everything is drawn pixel by pixel with a hand-made 5x7 bitmap font, so nothing is
downloaded and nothing is anti-aliased. Re-run after tweaking:

    python scripts/make-retro-assets.py

Output goes to public/retro/: a .gif per asset plus a .png still of its first frame.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "public" / "retro"

# ---------------------------------------------------------------------------
# Palette: brand oxblood plus web-safe oranges and reds. KEY is the transparent colour.
# ---------------------------------------------------------------------------
KEY = (255, 0, 255)
DEEP = (0x60, 0x24, 0x1E)
PRIMARY = (0x95, 0x27, 0x1D)
MID = (0xB3, 0x4A, 0x44)
TERRA = (0xE7, 0x7B, 0x49)
AMBER = (0xFF, 0x99, 0x00)
ORANGE = (0xFF, 0x66, 0x00)
RED = (0xFF, 0x33, 0x00)
CRIMSON = (0xCC, 0x00, 0x00)
GOLD = (0xFF, 0xCC, 0x00)
YELLOW = (0xFF, 0xFF, 0x66)
HAZARD = (0xFF, 0xD7, 0x00)
CREAM = (0xFF, 0xF5, 0xE1)
TAN = (0xE6, 0xD3, 0xB3)
GREY = (0xC0, 0xC0, 0xC0)
DARKGREY = (0x80, 0x80, 0x80)
WHITE = (0xFF, 0xFF, 0xFF)
BLACK = (0x00, 0x00, 0x00)
INK = (0x1A, 0x0A, 0x08)
NAVY = (0x00, 0x00, 0x80)
BLUE = (0x00, 0x33, 0xCC)
SKY = (0x66, 0x99, 0xFF)
LIME = (0x33, 0xFF, 0x33)
PINK = (0xFF, 0x99, 0xCC)
TABBY = (0xFF, 0x88, 0x22)
BURNT = (0xB3, 0x47, 0x00)
# A red night: dark oxblood sky with a warmer haze, to sit with the brand reds.
NIGHT = (0x24, 0x06, 0x08)
DUSK = (0x42, 0x0E, 0x10)

PALETTE = [KEY, DEEP, PRIMARY, MID, TERRA, AMBER, ORANGE, RED, CRIMSON, GOLD, YELLOW, HAZARD,
           CREAM, TAN, GREY, DARKGREY, WHITE, BLACK, INK, NAVY, BLUE, SKY, LIME, PINK, TABBY, BURNT, NIGHT, DUSK]

# ---------------------------------------------------------------------------
# 5x7 bitmap font, drawn by hand. Lowercase is drawn as uppercase.
# ---------------------------------------------------------------------------
FONT_ROWS = {
    "A": ".###. #...# #...# ##### #...# #...# #...#",
    "B": "####. #...# #...# ####. #...# #...# ####.",
    "C": ".###. #...# #.... #.... #.... #...# .###.",
    "D": "####. #...# #...# #...# #...# #...# ####.",
    "E": "##### #.... #.... ####. #.... #.... #####",
    "F": "##### #.... #.... ####. #.... #.... #....",
    "G": ".###. #...# #.... #.### #...# #...# .####",
    "H": "#...# #...# #...# ##### #...# #...# #...#",
    "I": ".###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.",
    "J": "..### ...#. ...#. ...#. ...#. #..#. .##..",
    "K": "#...# #..#. #.#.. ##... #.#.. #..#. #...#",
    "L": "#.... #.... #.... #.... #.... #.... #####",
    "M": "#...# ##.## #.#.# #.#.# #...# #...# #...#",
    "N": "#...# ##..# #.#.# #..## #...# #...# #...#",
    "O": ".###. #...# #...# #...# #...# #...# .###.",
    "P": "####. #...# #...# ####. #.... #.... #....",
    "Q": ".###. #...# #...# #...# #.#.# #..#. .##.#",
    "R": "####. #...# #...# ####. #.#.. #..#. #...#",
    "S": ".#### #.... #.... .###. ....# ....# ####.",
    "T": "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
    "U": "#...# #...# #...# #...# #...# #...# .###.",
    "V": "#...# #...# #...# #...# #...# .#.#. ..#..",
    "W": "#...# #...# #...# #.#.# #.#.# #.#.# .#.#.",
    "X": "#...# #...# .#.#. ..#.. .#.#. #...# #...#",
    "Y": "#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..",
    "Z": "##### ....# ...#. ..#.. .#... #.... #####",
    "0": ".###. #...# #..## #.#.# ##..# #...# .###.",
    "1": "..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.",
    "2": ".###. #...# ....# ...#. ..#.. .#... #####",
    "3": "####. ....# ....# .###. ....# ....# ####.",
    "4": "...#. ..##. .#.#. #..#. ##### ...#. ...#.",
    "5": "##### #.... ####. ....# ....# #...# .###.",
    "6": ".###. #.... #.... ####. #...# #...# .###.",
    "7": "##### ....# ...#. ..#.. .#... .#... .#...",
    "8": ".###. #...# #...# .###. #...# #...# .###.",
    "9": ".###. #...# #...# .#### ....# ....# .###.",
    " ": "..... ..... ..... ..... ..... ..... .....",
    ".": "..... ..... ..... ..... ..... ..... ..#..",
    "!": "..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..",
    "?": ".###. #...# ....# ...#. ..#.. ..... ..#..",
    ":": "..... ..#.. ..... ..... ..... ..#.. .....",
    "-": "..... ..... ..... .###. ..... ..... .....",
    "/": "....# ....# ...#. ..#.. .#... #.... #....",
    "@": ".###. #...# #.### #.#.# #.### #.... .###.",
    "#": ".#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.",
    "&": ".##.. #..#. #.#.. .#... #.#.# #..#. .##.#",
    "'": "..#.. ..#.. ..... ..... ..... ..... .....",
    ",": "..... ..... ..... ..... ..... ..#.. .#...",
    "+": "..... ..#.. ..#.. ##### ..#.. ..#.. .....",
    "<": "...#. ..#.. .#... #.... .#... ..#.. ...#.",
    ">": ".#... ..#.. ...#. ....# ...#. ..#.. .#...",
    "♥": "..... .#.#. ##### ##### .###. ..#.. .....",
    "★": "..#.. ..#.. ##### .###. .#.#. #...# .....",
}
FONT = {ch: [row for row in rows.split()] for ch, rows in FONT_ROWS.items()}
GLYPH_W, GLYPH_H, ADVANCE = 5, 7, 6


def text_width(text: str, scale: int = 1) -> int:
    return (len(text) * ADVANCE - 1) * scale


def draw_text(img: Image.Image, x: int, y: int, text: str, color, scale: int = 1, shadow=None) -> None:
    px = img.load()
    if shadow is not None:
        draw_text(img, x + scale, y + scale, text, shadow, scale)
    for i, ch in enumerate(text.upper()):
        glyph = FONT.get(ch, FONT["?"])
        for gy, row in enumerate(glyph):
            for gx, bit in enumerate(row):
                if bit != "#":
                    continue
                for sy in range(scale):
                    for sx in range(scale):
                        tx = x + (i * ADVANCE + gx) * scale + sx
                        ty = y + gy * scale + sy
                        if 0 <= tx < img.width and 0 <= ty < img.height:
                            px[tx, ty] = color


def centred_x(width: int, text: str, scale: int = 1) -> int:
    return (width - text_width(text, scale)) // 2


# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------
BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def dither_vertical(img: Image.Image, box, top, bottom) -> None:
    """Ordered-dither gradient from `top` to `bottom` colour, the way 256-colour GIFs did it."""
    x0, y0, x1, y1 = box
    px = img.load()
    height = max(1, y1 - y0 - 1)
    for y in range(y0, y1):
        t = (y - y0) / height
        for x in range(x0, x1):
            px[x, y] = bottom if t * 16 > BAYER4[y % 4][x % 4] + 0.5 else top


def bevel(img: Image.Image, light, dark, outline=BLACK) -> None:
    d = ImageDraw.Draw(img)
    w, h = img.size
    d.rectangle([0, 0, w - 1, h - 1], outline=outline)
    d.line([1, 1, w - 2, 1], fill=light)
    d.line([1, 1, 1, h - 2], fill=light)
    d.line([1, h - 2, w - 2, h - 2], fill=dark)
    d.line([w - 2, 1, w - 2, h - 2], fill=dark)


def star_points(cx: float, cy: float, r_out: float, r_in: float, angle_deg: float, points: int = 5):
    pts = []
    for i in range(points * 2):
        r = r_out if i % 2 == 0 else r_in
        a = math.radians(angle_deg + i * 180 / points - 90)
        pts.append((round(cx + r * math.cos(a)), round(cy + r * math.sin(a))))
    return pts


def to_palette(frame: Image.Image) -> Image.Image:
    pal = Image.new("P", (1, 1))
    flat = [c for rgb in PALETTE for c in rgb]
    pal.putpalette(flat + [0] * (768 - len(flat)))
    return frame.convert("RGB").quantize(palette=pal, dither=Image.Dither.NONE)


def save(name: str, frames: list[Image.Image], duration: int | list[int] = 400, transparent: bool = False) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    pframes = [to_palette(f) for f in frames]
    kwargs = {"optimize": False}
    if transparent:
        kwargs["transparency"] = 0
    if len(pframes) > 1:
        kwargs.update(save_all=True, append_images=pframes[1:], duration=duration, loop=0, disposal=2)
    pframes[0].save(OUT / name, **kwargs)
    # A still copy of the first frame for visitors who ask for reduced motion.
    still = pframes[0].convert("RGBA")
    if transparent:
        still.putdata([(0, 0, 0, 0) if p[:3] == KEY else p for p in still.get_flattened_data()])
    still.save(OUT / name.replace(".gif", ".png"))
    print(f"  {name:28s} {frames[0].width}x{frames[0].height}  {len(frames)} frame(s)")


def blank(w: int, h: int, color=KEY) -> Image.Image:
    return Image.new("RGB", (w, h), color)


# ---------------------------------------------------------------------------
# 88x31 buttons. Each one is laid out differently on purpose: real ones never matched.
# ---------------------------------------------------------------------------
def b88_ransu() -> list[Image.Image]:
    frames = []
    for f in range(4):
        img = blank(88, 31)
        dither_vertical(img, (0, 0, 88, 31), DEEP, CRIMSON)
        bevel(img, MID, BLACK)
        draw_text(img, 26, 6, "RANSU", GOLD, shadow=BLACK)
        draw_text(img, 26, 17, ".DEV", AMBER, shadow=BLACK)
        d = ImageDraw.Draw(img)
        d.polygon(star_points(13, 15, 9, 4, f * 18), fill=GOLD, outline=ORANGE)
        frames.append(img)
    return frames


def b88_rust() -> list[Image.Image]:
    img = blank(88, 31, ORANGE)
    d = ImageDraw.Draw(img)
    d.rectangle([2, 2, 28, 28], fill=INK)
    for i in range(8):  # a little gear
        a = math.radians(i * 45)
        cx, cy = 15 + 9 * math.cos(a), 15 + 9 * math.sin(a)
        d.rectangle([round(cx) - 2, round(cy) - 2, round(cx) + 1, round(cy) + 1], fill=ORANGE)
    d.ellipse([7, 7, 23, 23], fill=ORANGE)
    d.ellipse([12, 12, 18, 18], fill=INK)
    bevel(img, AMBER, CRIMSON)
    draw_text(img, 33, 6, "MADE W/", INK)
    draw_text(img, 39, 17, "RUST", WHITE, shadow=INK)
    return [img]


def b88_next() -> list[Image.Image]:
    img = blank(88, 31, BLACK)
    bevel(img, DARKGREY, BLACK, outline=DARKGREY)
    draw_text(img, centred_x(88, "POWERED BY"), 5, "POWERED BY", GREY)
    draw_text(img, centred_x(88, "NEXT.JS", 1) , 17, "NEXT.JS", ORANGE, shadow=CRIMSON)
    return [img]


def b88_ai() -> list[Image.Image]:
    img = blank(88, 31)
    dither_vertical(img, (0, 0, 88, 31), AMBER, RED)
    bevel(img, YELLOW, CRIMSON)
    draw_text(img, 6, 12, "AI", WHITE, scale=1, shadow=INK)
    d = ImageDraw.Draw(img)
    d.line([20, 4, 20, 26], fill=INK)
    draw_text(img, 25, 6, "ASSISTED", INK, shadow=YELLOW)
    draw_text(img, 25, 17, "+ HUMAN", WHITE, shadow=INK)
    return [img]


def b88_github() -> list[Image.Image]:
    img = blank(88, 31)
    dither_vertical(img, (0, 0, 88, 31), BLUE, NAVY)
    bevel(img, SKY, BLACK)
    draw_text(img, centred_x(88, "GITHUB"), 5, "GITHUB", WHITE, shadow=BLACK)
    draw_text(img, centred_x(88, "@RANSUDEV"), 17, "@RANSUDEV", GOLD)
    return [img]


def b88_800() -> list[Image.Image]:
    img = blank(88, 31, GREY)
    bevel(img, WHITE, DARKGREY)
    d = ImageDraw.Draw(img)
    d.rectangle([4, 6, 19, 18], fill=BLACK)  # tiny monitor
    d.rectangle([6, 8, 17, 16], fill=BLUE)
    d.rectangle([9, 19, 14, 20], fill=DARKGREY)
    d.rectangle([7, 21, 16, 22], fill=DARKGREY)
    draw_text(img, 23, 6, "BEST VIEW", CRIMSON)
    draw_text(img, 26, 17, "800X600", BLACK)
    return [img]


def b88_cookies() -> list[Image.Image]:
    img = blank(88, 31, INK)
    bevel(img, PRIMARY, BLACK)
    d = ImageDraw.Draw(img)
    d.ellipse([5, 6, 23, 24], fill=TERRA, outline=AMBER)
    for x, y in [(10, 11), (16, 10), (13, 17), (18, 18)]:
        d.rectangle([x, y, x + 1, y + 1], fill=DEEP)
    d.line([5, 24, 23, 6], fill=RED, width=2)
    draw_text(img, 30, 6, "NO", AMBER)
    draw_text(img, 30, 17, "COOKIES", AMBER)
    return [img]


def b88_html() -> list[Image.Image]:
    img = blank(88, 31, TERRA)
    bevel(img, CREAM, PRIMARY)
    draw_text(img, 5, 6, "<HTML>", INK)
    draw_text(img, 44, 17, "IS ART", CRIMSON, shadow=CREAM)
    return [img]


# ---------------------------------------------------------------------------
# Blinkies: 150x20, flipping between two colourways with sparkle pixels.
# ---------------------------------------------------------------------------
def blinkie(text: str, bg_a, fg_a, bg_b, fg_b, seed: int) -> list[Image.Image]:
    rnd = random.Random(seed)
    # Keep sparkles off the text so it stays legible.
    left = centred_x(150, text) - 2
    right = left + text_width(text) + 4
    sparkles = []
    while len(sparkles) < 10:
        x, y = rnd.randrange(2, 148), rnd.randrange(2, 18)
        if left <= x <= right and 5 <= y <= 15:
            continue
        sparkles.append((x, y))
    frames = []
    for bg, fg, spark in [(bg_a, fg_a, WHITE), (bg_b, fg_b, YELLOW)]:
        img = blank(150, 20, bg)
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, 149, 19], outline=fg)
        px = img.load()
        for i, (x, y) in enumerate(sparkles):
            if (i + (fg == fg_b)) % 2:
                px[x, y] = spark
        draw_text(img, centred_x(150, text), 7, text, fg)
        frames.append(img)
    return frames


# ---------------------------------------------------------------------------
# Small animated bits
# ---------------------------------------------------------------------------
def construction() -> list[Image.Image]:
    """A long, one-line sign: moving hazard stripes at both ends and two lamps flashing in turn.
    180x22 so it shows at exactly 2x (360x44) under the welcome buttons, the same width and height."""
    w, h = 180, 22
    stripe_w = 20
    frames = []
    for f in range(4):
        img = blank(w, h, HAZARD)
        px = img.load()
        for y in range(h):
            for x in list(range(0, stripe_w)) + list(range(w - stripe_w, w)):
                px[x, y] = BLACK if ((x + y + f * 2) // 4) % 2 == 0 else HAZARD
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, w - 1, h - 1], outline=BLACK)
        d.line([stripe_w, 1, stripe_w, h - 2], fill=BLACK)
        d.line([w - stripe_w - 1, 1, w - stripe_w - 1, h - 2], fill=BLACK)
        for i, cx in enumerate((stripe_w + 7, w - stripe_w - 8)):
            on = (f + i) % 2 == 0
            d.ellipse([cx - 5, 5, cx + 5, 15], fill=RED if on else CRIMSON, outline=BLACK)
            if on:
                d.point([(cx - 2, 8), (cx - 1, 8), (cx - 2, 9)], fill=YELLOW)
        text = "UNDER CONSTRUCTION"
        draw_text(img, centred_x(w, text), 7, text, BLACK)
        frames.append(img)
    return frames


def spin_star() -> list[Image.Image]:
    frames = []
    for f in range(5):
        img = blank(17, 17)
        d = ImageDraw.Draw(img)
        d.polygon(star_points(8, 9, 8, 3, f * 14.4), fill=GOLD, outline=ORANGE)
        img.load()[8, 8] = YELLOW
        frames.append(img)
    return frames


def new_burst() -> list[Image.Image]:
    frames = []
    for bg, fg in [(RED, YELLOW), (GOLD, CRIMSON)]:
        img = blank(36, 17)
        d = ImageDraw.Draw(img)
        pts = []
        for i in range(20):
            r = 8 if i % 2 == 0 else 6
            a = math.radians(i * 18)
            pts.append((round(18 + r * 2.1 * math.cos(a)), round(8 + r * math.sin(a))))
        d.polygon(pts, fill=bg, outline=CRIMSON if bg == RED else ORANGE)
        draw_text(img, 7, 5, "NEW!", fg)
        frames.append(img)
    return frames


def mail() -> list[Image.Image]:
    frames = []
    for up in (True, False):
        img = blank(34, 24)
        d = ImageDraw.Draw(img)
        if up:
            d.polygon([(8, 9), (1, 1), (4, 9)], fill=WHITE, outline=DARKGREY)
            d.polygon([(26, 9), (33, 1), (30, 9)], fill=WHITE, outline=DARKGREY)
        else:
            d.polygon([(8, 11), (0, 15), (5, 12)], fill=WHITE, outline=DARKGREY)
            d.polygon([(26, 11), (33, 15), (29, 12)], fill=WHITE, outline=DARKGREY)
        top = 7 if up else 9
        d.rectangle([7, top, 27, top + 13], fill=CREAM, outline=CRIMSON)
        d.line([7, top, 17, top + 7], fill=CRIMSON)
        d.line([27, top, 17, top + 7], fill=CRIMSON)
        d.rectangle([22, top + 2, 25, top + 5], fill=RED)  # stamp
        frames.append(img)
    return frames


def bullet() -> list[Image.Image]:
    frames = []
    for fill, edge in [(AMBER, RED), (ORANGE, CRIMSON)]:
        img = blank(9, 9)
        d = ImageDraw.Draw(img)
        d.polygon([(1, 0), (8, 4), (1, 8)], fill=fill, outline=edge)
        img.load()[2, 3] = YELLOW
        frames.append(img)
    return frames


# ---------------------------------------------------------------------------
# Cats! Drawn as shapes on a transparent canvas, then given a 1px black outline.
# ---------------------------------------------------------------------------
def sprite(w: int, h: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def outlined(img: Image.Image, pad: tuple[int, int] = (1, 1), size: tuple[int, int] | None = None) -> Image.Image:
    """Pad the sprite, wrap it in a black outline, and flatten it onto the transparent key colour."""
    w, h = size or (img.width + pad[0] * 2, img.height + pad[1] * 2)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.paste(img, pad, img)
    mask = canvas.getchannel("A").point(lambda a: 255 if a else 0)
    ring = mask.filter(ImageFilter.MaxFilter(3))
    out = Image.new("RGB", (w, h), KEY)
    out.paste(BLACK, (0, 0, w, h), ring)
    out.paste(canvas.convert("RGB"), (0, 0), mask)
    return out


def walking_cat() -> list[Image.Image]:
    """An orange tabby trotting to the right: four frames of legs, a bobbing body and a swishing tail."""
    frames = []
    for f in range(4):
        img, d = sprite(30, 20)
        bob = f % 2
        swing = [-1, 0, 1, 0][f]
        tip = [(1, 2), (2, 1), (1, 3), (0, 2)][f]
        d.line([(8, 10 + bob), (4, 8 + bob), (2, 5 + bob), tip], fill=TABBY, width=2)
        for i, x in enumerate([9, 12, 18, 21]):
            dx = swing if i % 2 == 0 else -swing
            d.rectangle([x + dx, 13, x + dx + 1, 18], fill=TABBY)
            d.line([x + dx, 18, x + dx + 1, 18], fill=CREAM)
        d.ellipse([6, 7 + bob, 23, 15 + bob], fill=TABBY)
        d.ellipse([9, 12 + bob, 20, 15 + bob], fill=CREAM)
        for x in (10, 13, 16):
            d.line([x, 7 + bob, x, 10 + bob], fill=BURNT)
        d.ellipse([19, 2 + bob, 28, 11 + bob], fill=TABBY)
        d.polygon([(20, 4 + bob), (21, 0 + bob), (23, 3 + bob)], fill=TABBY)
        d.polygon([(24, 3 + bob), (26, 0 + bob), (27, 4 + bob)], fill=TABBY)
        d.point([(21, 2 + bob), (26, 2 + bob)], fill=PINK)
        d.line([22, 3 + bob, 23, 3 + bob], fill=BURNT)
        d.ellipse([24, 7 + bob, 28, 10 + bob], fill=CREAM)
        d.line([24, 5 + bob, 24, 6 + bob], fill=INK)
        d.point([(28, 7 + bob)], fill=PINK)
        frames.append(outlined(img, pad=(1, 2)))
    return frames


def sleeping_cat() -> list[Image.Image]:
    """A curled-up cat breathing slowly, with Zs drifting up."""
    frames = []
    zs = [(30, 6), (33, 3), (36, 0)]
    for f in range(3):
        img, d = sprite(30, 18)
        breathe = f % 2
        d.ellipse([2, 6 - breathe, 24, 16], fill=TABBY)
        for x in (7, 11, 15):
            d.line([x, 7 - breathe, x + 1, 9 - breathe], fill=BURNT)
        d.ellipse([16, 5, 27, 15], fill=TABBY)
        d.polygon([(17, 7), (18, 2), (21, 5)], fill=TABBY)
        d.polygon([(23, 5), (26, 2), (27, 7)], fill=TABBY)
        d.point([(18, 4), (26, 4)], fill=PINK)
        d.ellipse([22, 11, 27, 14], fill=CREAM)
        d.line([20, 10, 22, 10], fill=INK)
        d.point([(26, 12)], fill=PINK)
        d.line([(3, 15), (10, 16), (18, 16)], fill=BURNT, width=2)
        d.point([(18, 16), (19, 16)], fill=CREAM)
        out = outlined(img, pad=(1, 9), size=(41, 28))
        px = out.load()
        for zx, zy in zs[: f + 1]:  # tiny pixel Zs
            for x, y in [(0, 0), (1, 0), (2, 0), (3, 0), (2, 1), (1, 2), (0, 3), (1, 3), (2, 3), (3, 3)]:
                px[zx + x, zy + y] = GOLD
        frames.append(out)
    return frames


def sitting_cat() -> list[Image.Image]:
    """A cat facing you, wagging its tail and blinking now and then."""
    frames = []
    tails = [(21, 15), (22, 12), (21, 9), (22, 12), (21, 15), (22, 12)]
    for f, tip in enumerate(tails):
        img, d = sprite(24, 26)
        d.line([(15, 22), (19, 20), tip], fill=TABBY, width=2)
        d.ellipse([4, 11, 17, 25], fill=TABBY)
        d.ellipse([8, 14, 13, 24], fill=CREAM)
        d.rectangle([6, 23, 8, 25], fill=CREAM)
        d.rectangle([12, 23, 14, 25], fill=CREAM)
        d.ellipse([3, 2, 18, 14], fill=TABBY)
        d.polygon([(4, 5), (5, 0), (9, 3)], fill=TABBY)
        d.polygon([(12, 3), (16, 0), (17, 5)], fill=TABBY)
        d.point([(5, 2), (16, 2)], fill=PINK)
        for x in (8, 10, 12):
            d.line([x, 3, x, 5], fill=BURNT)
        d.ellipse([7, 9, 13, 13], fill=CREAM)
        if f == 4:  # blink
            d.line([6, 8, 8, 8], fill=INK)
            d.line([12, 8, 14, 8], fill=INK)
        else:
            d.rectangle([6, 7, 8, 8], fill=GOLD)
            d.rectangle([12, 7, 14, 8], fill=GOLD)
            d.point([(7, 7), (7, 8), (13, 7), (13, 8)], fill=INK)
        d.point([(10, 10)], fill=PINK)
        out = outlined(img, pad=(3, 1), size=(30, 28))
        draw = ImageDraw.Draw(out)  # whiskers sit on top of the outline
        draw.line([0, 11, 4, 12], fill=DARKGREY)
        draw.line([23, 12, 27, 11], fill=DARKGREY)
        frames.append(out)
    return frames


def divider_paws() -> list[Image.Image]:
    """A trail of paw prints, alternating left and right feet."""
    img = blank(30, 12)
    d = ImageDraw.Draw(img)
    for cx, cy, col in [(6, 7, MID), (21, 3, TERRA)]:
        d.ellipse([cx - 2, cy, cx + 2, cy + 3], fill=col)
        for tx, ty in [(cx - 3, cy - 2), (cx - 1, cy - 3), (cx + 1, cy - 3), (cx + 3, cy - 2)]:
            d.rectangle([tx, ty, tx, ty + 1], fill=col)
    return [img]


def b88_cats() -> list[Image.Image]:
    frames = []
    for blink in (False, False, False, True):
        img = blank(88, 31, CREAM)
        bevel(img, WHITE, TAN)
        d = ImageDraw.Draw(img)
        d.ellipse([5, 8, 24, 26], fill=TABBY, outline=BLACK)
        d.polygon([(6, 13), (7, 4), (13, 9)], fill=TABBY, outline=BLACK)
        d.polygon([(16, 9), (22, 4), (23, 13)], fill=TABBY, outline=BLACK)
        if blink:
            d.line([9, 15, 11, 15], fill=INK)
            d.line([18, 15, 20, 15], fill=INK)
        else:
            d.rectangle([9, 14, 11, 16], fill=GOLD)
            d.rectangle([18, 14, 20, 16], fill=GOLD)
            d.line([10, 14, 10, 16], fill=INK)
            d.line([19, 14, 19, 16], fill=INK)
        d.point([(14, 19), (15, 19)], fill=PINK)
        draw_text(img, 32, 6, "I \u2665", CRIMSON)
        draw_text(img, 32, 17, "CATS", BURNT)
        frames.append(img)
    return frames


# ---------------------------------------------------------------------------
# Banner: a night sky over rooftops, with a moon and a black cat on the roof.
# ---------------------------------------------------------------------------
def banner_sky() -> list[Image.Image]:
    """A tileable starry sky that glows oxblood towards the horizon. Stars twinkle across 3 frames."""
    w, h = 128, 176
    base = blank(w, h)
    # Dithered bands: night at the top, dusk, then brand oxblood glowing near the rooftops.
    dither_vertical(base, (0, 0, w, 70), NIGHT, DUSK)
    dither_vertical(base, (0, 70, w, 130), DUSK, DEEP)
    dither_vertical(base, (0, 130, w, h), DEEP, PRIMARY)
    rnd = random.Random(1997)
    stars = [(rnd.randrange(w), rnd.randrange(0, 120), rnd.choice([WHITE, WHITE, YELLOW, GOLD, AMBER]), rnd.randrange(3))
             for _ in range(46)]
    big = [(18, 22), (77, 48), (108, 14), (46, 90)]
    frames = []
    for f in range(3):
        img = base.copy()
        px = img.load()
        for x, y, col, phase in stars:
            if phase != f:  # each star is off in one frame of three
                px[x, y] = col
        for i, (x, y) in enumerate(big):  # four-point twinklers
            col = WHITE if (i + f) % 3 else GOLD
            px[x, y] = col
            if (i + f) % 2 == 0:
                for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                    px[(x + dx) % w, y + dy] = col
        frames.append(img)
    return frames


def banner_roofs() -> list[Image.Image]:
    """A tileable strip of rooftop silhouettes with a few lit windows."""
    w, h = 96, 30
    img = blank(w, h)
    d = ImageDraw.Draw(img)
    # Building outlines: (x0, x1, top). Peaked roofs where marked.
    for x0, x1, top, peak in [(0, 19, 12, False), (20, 41, 6, True), (42, 57, 15, False),
                              (58, 79, 9, True), (80, 95, 13, False)]:
        d.rectangle([x0, top, x1, h - 1], fill=INK)
        if peak:
            mid = (x0 + x1) // 2
            d.polygon([(x0, top), (mid, top - 6), (x1, top)], fill=INK)
    d.rectangle([28, 0, 31, 6], fill=INK)  # chimney
    d.rectangle([84, 6, 86, 13], fill=INK)  # antenna mast
    d.line([81, 7, 89, 7], fill=INK)
    for x, y in [(5, 17), (11, 22), (25, 12), (34, 19), (47, 21), (64, 14), (70, 22), (88, 18)]:
        d.rectangle([x, y, x + 2, y + 2], fill=GOLD if (x + y) % 3 else AMBER)
    return [img]


def banner_moon() -> list[Image.Image]:
    img, d = sprite(26, 26)
    d.ellipse([1, 1, 24, 24], fill=CREAM)
    d.ellipse([1, 1, 24, 24], outline=YELLOW)
    for box in ([6, 7, 10, 11], [14, 14, 19, 19], [15, 5, 17, 7], [7, 16, 9, 18]):
        d.ellipse(box, fill=TAN)
    out = Image.new("RGB", (26, 26), KEY)
    out.paste(img.convert("RGB"), (0, 0), img.getchannel("A").point(lambda a: 255 if a else 0))
    return [out]


def roof_cat() -> list[Image.Image]:
    """A black cat silhouette sitting on the roof, swishing its tail and blinking its gold eyes."""
    frames = []
    tails = [(15, 11), (16, 8), (15, 5), (16, 8)]
    for f, tip in enumerate(tails):
        img = blank(18, 20)
        d = ImageDraw.Draw(img)
        d.line([(10, 18), (14, 16), tip], fill=INK, width=2)
        d.ellipse([2, 8, 12, 19], fill=INK)
        d.ellipse([2, 2, 11, 10], fill=INK)
        d.polygon([(2, 5), (3, 0), (6, 3)], fill=INK)
        d.polygon([(7, 3), (10, 0), (11, 5)], fill=INK)
        if f != 3:
            d.point([(4, 6), (8, 6)], fill=GOLD)
        frames.append(img)
    return frames


# ---------------------------------------------------------------------------
# Divider tiles (repeat-x as backgrounds) and the page wallpaper
# ---------------------------------------------------------------------------
def divider_stars() -> list[Image.Image]:
    img = blank(24, 11)
    d = ImageDraw.Draw(img)
    d.polygon(star_points(5, 6, 5, 2, 0), fill=GOLD, outline=ORANGE)
    for x in (13, 17, 21):
        d.point([(x, 5)], fill=ORANGE)
    return [img]


def divider_beads() -> list[Image.Image]:
    img = blank(10, 8)
    d = ImageDraw.Draw(img)
    d.ellipse([1, 1, 7, 7], fill=RED, outline=CRIMSON)
    img.load()[3, 3] = YELLOW
    d.line([8, 4, 9, 4], fill=DARKGREY)
    return [img]


def page_sky() -> list[Image.Image]:
    """The page background: the banner's red night sky, stretched down a whole screen.
    It repeats sideways and is pinned to the bottom of the window, so the oxblood glow always sits
    at the bottom of the screen and the starry night fills the top. Stars twinkle over 3 frames."""
    w, h = 128, 900
    base = blank(w, h)
    dither_vertical(base, (0, 0, w, 400), NIGHT, DUSK)
    dither_vertical(base, (0, 400, w, 680), DUSK, DEEP)
    dither_vertical(base, (0, 680, w, 820), DEEP, PRIMARY)
    dither_vertical(base, (0, 820, w, h), PRIMARY, MID)
    rnd = random.Random(1999)
    stars = [(rnd.randrange(w), rnd.randrange(0, 620), rnd.choice([WHITE, WHITE, CREAM, YELLOW, GOLD, AMBER]), rnd.randrange(3))
             for _ in range(110)]
    big = [(18, 40), (90, 130), (52, 260), (110, 380), (30, 470), (76, 560)]
    frames = []
    for f in range(3):
        img = base.copy()
        px = img.load()
        for x, y, col, phase in stars:
            if phase != f:
                px[x, y] = col
        for i, (x, y) in enumerate(big):
            col = WHITE if (i + f) % 3 else GOLD
            px[x, y] = col
            if (i + f) % 2 == 0:
                for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                    px[(x + dx) % w, y + dy] = col
        frames.append(img)
    return frames


def main() -> None:
    print(f"Writing to {OUT}")
    save("88-ransu.gif", b88_ransu(), duration=180)
    save("88-rust.gif", b88_rust())
    save("88-nextjs.gif", b88_next())
    save("88-ai.gif", b88_ai())
    save("88-github.gif", b88_github())
    save("88-800x600.gif", b88_800())
    save("88-cookies.gif", b88_cookies())
    save("88-html.gif", b88_html())
    save("88-cats.gif", b88_cats(), duration=[900, 900, 900, 160])

    save("blinkie-ship.gif", blinkie("BREAK IT FIX IT SHIP IT", DEEP, GOLD, GOLD, DEEP, 1), duration=500)
    save("blinkie-windows.gif", blinkie("♥ I ♥ WINDOWS APIS ♥", ORANGE, INK, INK, ORANGE, 2), duration=450)
    save("blinkie-coffee.gif", blinkie("POWERED BY COFFEE", RED, YELLOW, CRIMSON, AMBER, 3), duration=550)
    save("blinkie-work.gif", blinkie("★ OPEN TO WORK ★", INK, LIME, DEEP, GOLD, 4), duration=500)
    save("blinkie-meow.gif", blinkie("♥ MEOW MEOW MEOW ♥", PINK, INK, INK, PINK, 5), duration=450)

    save("construction.gif", construction(), duration=160)
    save("star.gif", spin_star(), duration=110, transparent=True)
    save("new.gif", new_burst(), duration=400, transparent=True)
    save("mail.gif", mail(), duration=300, transparent=True)
    save("bullet.gif", bullet(), duration=500, transparent=True)

    save("cat-walk.gif", walking_cat(), duration=120, transparent=True)
    save("cat-sleep.gif", sleeping_cat(), duration=700, transparent=True)
    save("cat-sit.gif", sitting_cat(), duration=[260, 260, 260, 260, 180, 260], transparent=True)

    save("divider-paws.gif", divider_paws(), transparent=True)
    save("divider-stars.gif", divider_stars(), transparent=True)
    save("divider-beads.gif", divider_beads(), transparent=True)

    save("page-sky.gif", page_sky(), duration=[650, 500, 600])
    save("banner-sky.gif", banner_sky(), duration=[700, 500, 600])
    save("banner-roofs.gif", banner_roofs(), transparent=True)
    save("banner-moon.gif", banner_moon(), transparent=True)
    save("roof-cat.gif", roof_cat(), duration=[400, 400, 400, 900], transparent=True)


if __name__ == "__main__":
    main()
