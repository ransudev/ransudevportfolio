# Design — Ransu Portfolio

A locked design system for this portfolio. Read this file before making visual changes.

## Genre

A 90s personal homepage, in the Neocities / GeoCities tradition: tiled wallpaper, a sidebar of links, beveled Win9x windows, 88x31 buttons, blinkies, a marquee and a hit counter. It should feel hand-made and a little goofy, but the projects stay easy to find and read.

## Audience and task

- Primary audience: recruiters and potential collaborators.
- Primary task: evaluate the work, then contact Lance.
- Content rule: projects are proof. Decorations live in the sidebar, banner and footer; they never sit between a visitor and a project.

## Macrostructure

One page, in this order: Banner → Marquee → (Sidebar | Welcome → Projects → Skills → About → Contact) → Footer.

- **Banner:** the page's only `<h1>` ("Ransu.dev") in Pixelify Sans with stacked hard text shadows (no tagline). It sits on a pixel night scene: a twinkling, tileable red night sky that glows oxblood towards the horizon, a repeat-x strip of rooftops with lit windows, a full moon in the top-right corner and a black cat on the roof that swishes its tail and blinks (`banner-sky`, `banner-roofs`, `banner-moon`, `roof-cat` in `public/retro/`).
- **Marquee:** a sunken "screen" strip with site news (`app/data/badges.ts`). Pauses on hover.
- **Sidebar** (sticky on desktop): the nav window with active-section highlight, `status.txt`, the hit counter, blinkies and the 88x31 button wall. Under 48rem the nav becomes a sticky one-row bar at the top and the extras move below the content.
- **Welcome** (`welcome.html` window): greeting, CTAs ("See my projects", "Get in touch"), an under-construction sign, and the lanyard ID badge.
- **Projects:** one window per project, titled `name.exe`, with an address bar, a sunken screenshot frame, and a NEW! tag on the featured project. The featured project's screenshot spans the full width; the rest sit media-left, text-right. Projects without a screenshot get a scanlined poster in their tone colour with a file icon.
- **Skills** (`C:\RANSU\TOOLS`), **About** (`about_me.txt`), **Contact** (`new_message.eml`): windows holding lists and beveled tables.
- Section titles are `<h2>`s in WordArt Pixelify Sans with ✦ ornaments, sitting directly on the wallpaper.

## Theme

The four brand colours (supplied by Lance) stay the backbone:

- `--color-brand-deep` `#60241E` · `--color-brand-primary` `#95271D` · `--color-brand-mid` `#B34A44` · `--color-brand-highlight` `#E77B49`

Around them:

- **Wallpaper:** the original 64px pixel-star tile in the brand colours (an inline SVG data URI in `globals.css`). Lance tried a dark and a red night-sky wallpaper and preferred this one.
- **Panels:** cream paper (`--color-paper`) with two-tone Win9x bevels (`--bevel-out`, `--bevel-in`).
- **Accents:** orange and red only. They're flat web-safe colours rather than the brand terracotta, which reads as too dusty and modern for decorations: `--color-retro-amber` `#FF9900`, `--color-retro-orange` `#FF6600`, `--color-retro-red` `#FF3300` and `--color-retro-crimson` `#CC0000`. Yellow gold is reserved for titles (see below); the only other yellow is the DeskPeek poster tone, which comes from the project data. Terminal green (`--color-screen-text`) is only for the counter digits.
- **Title bars:** a gradient from brand-deep to crimson. The badge header uses the same gradient.
- **WordArt titles:** the banner and section titles are yellow gold. They use `--wordart-fill`, which runs from `#FFFF99` at the top through `#FFCC00` to `#E6A100`. It's clipped to the text, with a 1px ink stroke and a stacked red-then-black `drop-shadow` extrusion. The banner's ★彡 stars are gold too; the ✦ ornaments on section titles stay orange.

## Typography

- **Display:** Pixelify Sans 400/700, for the banner, section titles, window titles, nav and project names.
- **Terminal:** VT323, for buttons, labels, metadata, the marquee, the counter, badges and the lanyard text.
- **Body:** a Times New Roman / Georgia system serif stack, the authentic browser default. Keep it for paragraphs; it's what keeps long text readable.

## Motion

- The pixel GIFs carry most of the blinking: spinning stars, the NEW! burst, blinkies, the flapping mail icon, the flashing construction sign, the nav bullets and the cats. CSS motion stays in `steps()`, never eased. Two tabbies walk back and forth over paw-print trails, one under the marquee and one above the footer: a CSS `left` animation that flips the sprite instantly at each end, with the second cat offset so the two are out of step. No fire anywhere.
- **Marquee:** 45s linear loop with duplicated content.
- **Cursor trail:** a pool of 18 recycled sparkles, on fine pointers only.
- **Lanyard:** the one physical motion. It drops in, swings on a spring and can be dragged (swing capped at 90° each side, card tilt at 20°).
- **Reduced motion:** blinking stops, the marquee becomes a static wrapped list, the trail is removed, and the lanyard hangs still.

## Microinteractions

- Buttons press in: the bevel inverts on `:active`.
- Focus rings are a 3px dotted outline, red on paper and amber on dark backgrounds.
- Touch targets are at least 44px for buttons, nav links and footer links. The 88x31 buttons are 31px tall by definition, so they only ever duplicate links that exist elsewhere.

## Decorations

- **The GIFs:** `scripts/make-retro-assets.py` draws them with Pillow, pixel by pixel, using a hand-made 5x7 bitmap font. That covers the 88x31 buttons, blinkies, spinning star, NEW! burst, mail icon, under-construction sign, nav bullet, the cats (walking, sleeping, sitting), the I-love-cats button, the meow blinkie and the paws/stars/beads divider tiles. It writes `public/retro/*.gif` plus a `.png` still of each first frame. Re-run it after changing anything.
- **Where they go:** list the buttons and blinkies in `app/data/badges.ts`. Render the GIFs with `RetroImg` (`app/components/retro/Badges.tsx`), which keeps them crisp at native size and serves the still `.png` to reduced-motion visitors.
- **Dividers:** these are repeat-x GIF strips: paw prints under the Projects and Contact titles and beneath the walking cats; beads under Skills; stars under About.
- **Cats:** components are in `app/components/retro/Cats.tsx`. `WalkingCat` handles the strolling ones, `Perch` sits a cat on a window (a napping cat on Skills, a sitting cat on Contact), and `Cat` places a single cat (the one beside the counter). They are drawn as orange tabbies to match the palette and shown at 2x. Reduced-motion visitors get still cats that stay put.
- **Other touches:** every section ends with an "↑ back to top" link. The footer shows "last updated" (`lastUpdated` in `badges.ts`) and "best viewed at 800x600". Contact has a guestbook row that honestly says there isn't one yet.
- **Rules:** don't hotlink third-party GIFs. Decorative GIFs have empty alt text; meaningful ones (NEW!, the 88x31 buttons, the blinkies) have real alt text.
- **Still CSS-drawn:** the counter, the windows and the lanyard badge.

## Files

- Tokens: `tokens.css`
- Styles: `app/globals.css`
- Retro components: `app/components/retro/` (`RetroWindow`, `Marquee`, `HitCounter`, `CursorTrail`, `Badges`)
- Shell: `app/page.tsx`, `app/components/sections/Sidebar.tsx`, `Footer.tsx`
- Badge: `app/components/ui/HeroLanyard.tsx`
