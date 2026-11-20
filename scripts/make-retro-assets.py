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

from PIL import Image, ImageDraw

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

PALETTE = [KEY, DEEP, PRIMARY, MID, TERRA, AMBER, ORANGE, RED, CRIMSON, GOLD, YELLOW, HAZARD,
           CREAM, TAN, GREY, DARKGREY, WHITE, BLACK, INK, NAVY, BLUE, SKY, LIME]

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
    w, h = 136, 32
    frames = []
    for f in range(4):
        img = blank(w, h, HAZARD)
        px = img.load()
        for y in list(range(0, 7)) + list(range(h - 7, h)):
            for x in range(w):
                px[x, y] = BLACK if ((x + y + f * 3) // 6) % 2 == 0 else HAZARD
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, w - 1, h - 1], outline=BLACK)
        lamp = RED if f % 2 == 0 else CRIMSON
        d.ellipse([4, 10, 15, 21], fill=lamp, outline=BLACK)
        if f % 2 == 0:
            d.point([(7, 13), (8, 13), (7, 14)], fill=YELLOW)
        draw_text(img, 20, 9, "UNDER", BLACK)
        draw_text(img, 20, 17, "CONSTRUCTION", BLACK)
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
# Divider tiles (repeat-x as backgrounds) and the page wallpaper
# ---------------------------------------------------------------------------
def divider_flame() -> list[Image.Image]:
    w, h = 32, 12
    frames = []
    for f in range(3):
        rnd = random.Random(10 + f)
        img = blank(w, h)
        px = img.load()
        for x in range(w):
            height = 4 + int(4 * (1 + math.sin((x + f * 3) * 0.7))) // 2 + rnd.randrange(0, 3)
            for i in range(height):
                y = h - 1 - i
                t = i / max(1, height - 1)
                px[x, y] = CRIMSON if t < 0.3 else RED if t < 0.55 else ORANGE if t < 0.8 else GOLD
        frames.append(img)
    return frames


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


def wallpaper() -> list[Image.Image]:
    rnd = random.Random(1999)
    img = blank(64, 64, DEEP)
    px = img.load()
    # Rough dither: scattered lighter pixels, denser in a diagonal band.
    for y in range(64):
        for x in range(64):
            band = abs(((x + y) % 64) - 32) / 32
            if rnd.random() < 0.10 + 0.12 * (1 - band) and (x + y) % 2 == 0:
                px[x, y] = PRIMARY
    d = ImageDraw.Draw(img)
    for cx, cy, r, col in [(14, 14, 5, MID), (46, 44, 4, TERRA), (50, 10, 2, AMBER), (20, 52, 2, ORANGE)]:
        d.polygon(star_points(cx, cy, r, max(1, r // 2), rnd.randrange(0, 72)), fill=col)
    for x, y in [(34, 22), (6, 36), (58, 60), (30, 6), (40, 56)]:
        px[x, y] = GOLD
    return [img]


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

    save("blinkie-ship.gif", blinkie("BREAK IT FIX IT SHIP IT", DEEP, GOLD, GOLD, DEEP, 1), duration=500)
    save("blinkie-windows.gif", blinkie("♥ I ♥ WINDOWS APIS ♥", ORANGE, INK, INK, ORANGE, 2), duration=450)
    save("blinkie-coffee.gif", blinkie("POWERED BY COFFEE", RED, YELLOW, CRIMSON, AMBER, 3), duration=550)
    save("blinkie-work.gif", blinkie("★ OPEN TO WORK ★", INK, LIME, DEEP, GOLD, 4), duration=500)

    save("construction.gif", construction(), duration=160)
    save("star.gif", spin_star(), duration=110, transparent=True)
    save("new.gif", new_burst(), duration=400, transparent=True)
    save("mail.gif", mail(), duration=300, transparent=True)
    save("bullet.gif", bullet(), duration=500, transparent=True)

    save("divider-flame.gif", divider_flame(), duration=140, transparent=True)
    save("divider-stars.gif", divider_stars(), transparent=True)
    save("divider-beads.gif", divider_beads(), transparent=True)
    save("tile.gif", wallpaper())


if __name__ == "__main__":
    main()
