# Design — Ransu Portfolio

A locked design system for this portfolio. Read this file before making visual changes.

## Genre

An old-school 90s personal homepage, built the way GeoCities pages were: a table layout centred on a tiled GIF wallpaper, system fonts, underlined links, grey Windows buttons, and lots of small pixel GIFs (88x31 buttons, blinkies, spinning stars, an under-construction sign). It should look hand-made, a little uneven, and never like a polished modern "retro theme". The projects still stay easy to read.

The previous, more polished retro version (pixel web fonts, a Win98 window around every section, CSS-drawn badges) is saved as tag `retro-v1` and branch `retro-v1-snapshot`. Restore it with `git checkout retro-v1 -- .`.

## Audience and task

- Primary audience: recruiters and potential collaborators.
- Primary task: evaluate the work, then contact Lance.
- Content rule: projects are proof. Decorations live in the sidebar, banner and footer, and never sit between a visitor and a project.

## Macrostructure

One page, in this order: Banner → Marquee → flame divider → (Sidebar | Welcome → Projects → Skills → About → Contact) → Footer.

- **Page width:** fixed at 780px (the 800x600 era), centred on the wallpaper. Nothing is sticky.
- **Banner:** the page's only `<h1>`, as WordArt between two spinning-star GIFs, plus a Comic Sans tagline.
- **Marquee:** a black strip with bold orange Arial news (`app/data/badges.ts`). It pauses on hover.
- **Sidebar:** a tan, ridge-bordered column holding:
  - a red "Navigation" header cell and the links, with GIF bullets and `<<` beside the current section;
  - the status table;
  - the LED hit counter;
  - the blinkies;
  - the 88x31 wall;
  - a "thanks 4 visiting!" line.
- **Sections:** each one is a WordArt `<h2>`, then an image divider (flame, stars or beads, varied on purpose), then a cream ridge-bordered panel, then an "↑ back to top" link (`app/components/retro/Section.tsx`).
- **Welcome:** a Comic Sans greeting, grey buttons, the under-construction GIF, and the lanyard badge.
- **Projects:** rows split by `<hr>`. Each row puts a screenshot in a small Win98 "browser" window (`RetroWindow`, the only place window chrome is used) beside the text. The featured project spans the full width and gets a NEW! GIF. Links are bracketed text: `[ Live site ] [ Source code ]`.
- **Skills, About, Contact:** bordered tables with tan header cells. The About photo floats left, with the text wrapping around it.
- **Footer:** a bead divider, bracketed links, "last updated", "best viewed at 800x600".

## Colour

- **Brand oxblood** (`--color-brand-deep` `#60241E`, `--color-brand-primary` `#95271D`): the wallpaper and the WordArt extrusion.
- **Orange and red accents:** `#FF9900`, `#FF6600`, `#FF3300`, `#CC0000`.
- **Yellow gold:** titles only (`--wordart-fill`, `#FFFF99` → `#FFCC00` → `#E6A100`). The hazard yellow on the construction sign is the only other yellow.
- **Panels:** cream paper. The sidebar and table headers are tan.
- **Links:** classic underlined `#CC3300`; visited `#800040`, hover `#FF6600`. On the wallpaper, links are amber.
- **Buttons:** Windows grey `#C0C0C0` with white and dark bevel borders.
- **Project screenshot windows:** the Win98 navy-to-blue title bar, kept on purpose as a "browser" cue.

## Typography

System fonts only; no web fonts.

- **WordArt titles:** Arial Black / Impact, with the gold gradient fill, a 1px ink stroke and a red-then-black `drop-shadow` extrusion (`.wordart`).
- **Body:** Times New Roman, 17px.
- **Sidebar, tables, footer and small print:** Verdana at 11–14px.
- **Greetings, captions and asides:** Comic Sans MS.
- **Project titles, the marquee and the email address:** bold Arial.
- **Counter digits:** Courier New.

## Pixel GIFs

- `scripts/make-retro-assets.py` draws every decoration with Pillow, pixel by pixel, using a hand-made 5x7 bitmap font. It writes `public/retro/*.gif`, plus a `.png` still of each GIF's first frame. Re-run it after changing anything.
- Nothing is hotlinked or downloaded.
- Render GIFs with `RetroImg` (`app/components/retro/Badges.tsx`), always at their native size with `image-rendering: pixelated`. It serves the `.png` still to reduced-motion visitors.
- Decorative images have empty alt text. Meaningful ones (NEW!, the 88x31 buttons, the blinkies) have real alt text.
- Dividers are repeat-x backgrounds of small GIF tiles.

## Motion

- The GIFs carry most of the motion.
- The marquee loops in 40s, and the cursor trail is 18 recycled sparkles on fine pointers.
- The lanyard is the one physical motion. It drops in, swings on a spring and can be dragged (swing capped at 90° each side, card tilt at 20°).
- **Reduced motion:** still PNGs replace the GIFs (including the wallpaper, bullets and flame divider), the marquee becomes a static wrapped list, the trail is removed, and the lanyard hangs still.

## Microinteractions and accessibility

- Grey buttons press in: the border bevel inverts on `:active`.
- Focus rings are a 2px dotted outline, ink on panels and amber on the wallpaper.
- Touch targets are at least 44px for buttons, nav links, bracketed project links, back-to-top links and footer links. The 88x31 buttons are 31px tall by definition, so they only ever duplicate links found elsewhere.
- Under 48rem, the sidebar's links become a `[ Home | Projects | … ]` bar under the banner, and the extras move below the content.

## Files

- Tokens: `tokens.css`
- Styles: `app/globals.css`
- Asset script: `scripts/make-retro-assets.py` → `public/retro/`
- Retro components: `app/components/retro/` (`Section`, `RetroWindow`, `Marquee`, `HitCounter`, `CursorTrail`, `Badges`)
- Shell: `app/page.tsx`, `app/components/sections/Sidebar.tsx`, `Footer.tsx`
- Badge: `app/components/ui/HeroLanyard.tsx`
