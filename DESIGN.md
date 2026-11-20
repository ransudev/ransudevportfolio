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

- **Banner:** the page's only `<h1>` ("Ransu.dev") in Pixelify Sans with stacked hard text shadows, plus the tagline "Break it. Fix it. Ship it."
- **Marquee:** a sunken "screen" strip with site news (`app/data/badges.ts`). Pauses on hover.
- **Sidebar** (sticky on desktop): the nav window with active-section highlight, `status.txt`, the hit counter, blinkies and the 88x31 button wall. Under 48rem the nav becomes a sticky one-row bar at the top and the extras move below the content.
- **Welcome** (`welcome.html` window): greeting, CTAs ("See my projects", "Get in touch"), an under-construction sign, and the lanyard ID badge.
- **Projects:** one window per project, titled `name.exe`, with an address bar, a sunken screenshot frame, and a NEW! tag on the featured project. The featured project's screenshot spans the full width; the rest sit media-left, text-right. Projects without a screenshot get a scanlined poster in their tone colour with a file icon.
- **Skills** (`C:\RANSU\TOOLS`), **About** (`about_me.txt`), **Contact** (`new_message.eml`): windows holding lists and beveled tables.
- Section titles are `<h2>`s in gold Pixelify Sans with ✦ ornaments, sitting directly on the wallpaper.

## Theme

The four brand colours (supplied by Lance) stay the backbone:

- `--color-brand-deep` `#60241E` · `--color-brand-primary` `#95271D` · `--color-brand-mid` `#B34A44` · `--color-brand-highlight` `#E77B49`

Around them:

- **Wallpaper:** a 64px pixel-star tile in the brand colours (an inline SVG data URI in `globals.css`).
- **Panels:** cream paper (`--color-paper`) with two-tone Win9x bevels (`--bevel-out`, `--bevel-in`).
- **Title bars:** a gradient from brand-deep to brand-mid, with light text. Don't run it to terracotta, because white text on it fails contrast.
- **Accents:** gold (`--color-gold`) for headings on dark backgrounds, and terminal green (`--color-screen-text`) only for the counter digits.
- **Links:** brand-primary, underlined; visited links go to brand-deep, and hover fills them with terracotta.
- No rounded corners, soft shadows, glass or gradients-as-decoration beyond title bars and the footer rule.

## Typography

- **Display:** Pixelify Sans 400/700, for the banner, section titles, window titles, nav and project names.
- **Terminal:** VT323, for buttons, labels, metadata, the marquee, the counter, badges and the lanyard text.
- **Body:** a Times New Roman / Georgia system serif stack, the authentic browser default. Keep it for paragraphs; it's what keeps long text readable.

## Motion

- Everything blinks in `steps()`, never eased: the NEW! tag, blinkies, the active-nav arrow and the bobbing mail icon.
- **Marquee:** 45s linear loop with duplicated content.
- **Cursor trail:** a pool of 18 recycled sparkles, on fine pointers only.
- **Lanyard:** the one physical motion. It drops in, swings on a spring and can be dragged (swing capped at 90° each side, card tilt at 20°).
- **Reduced motion:** blinking stops, the marquee becomes a static wrapped list, the trail is removed, and the lanyard hangs still.

## Microinteractions

- Buttons press in: the bevel inverts on `:active`.
- Focus rings are a 3px dotted outline, red on paper and gold on dark backgrounds.
- Touch targets are at least 44px for buttons, nav links and footer links. The 88x31 buttons are 31px tall by definition, so they only ever duplicate links that exist elsewhere.

## Decorations

All decorations are made in CSS: 88x31 buttons, blinkies, the under-construction sign and the counter. Don't hotlink third-party GIFs. Add new badges in `app/data/badges.ts`. Decorative pieces are `aria-hidden`.

## Files

- Tokens: `tokens.css`
- Styles: `app/globals.css`
- Retro components: `app/components/retro/` (`RetroWindow`, `Marquee`, `HitCounter`, `CursorTrail`, `Badges`)
- Shell: `app/page.tsx`, `app/components/sections/Sidebar.tsx`, `Footer.tsx`
- Badge: `app/components/ui/HeroLanyard.tsx`
