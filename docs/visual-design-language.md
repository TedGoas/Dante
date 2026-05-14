# Visual Design Language — Cursor Guardrails

This document defines the visual design constraints and direction for tedgoas.com. Use it as guardrails when generating design variations. The goal is to explore multiple visual themes within these boundaries — not to produce a single final design.

---

## What Not to Touch

These are locked. Do not change structure, layout, size, or position of any of the following:

- **Homepage h1** — The large serif headline with the inline avatar photo and company marks (small inline images inside links). Font family may change, but the layout, sizing, and structure stay exactly as-is.
- **`.homepage-showcase` grid** — The case study thumbnail grid on the homepage. Layout, size, and position are frozen. Text styling inside the tiles is fair game.
- **All written content** — Headlines, body copy, navigation labels, blog posts, case studies, bio, values page. Do not alter any text content anywhere on the site. This is a visual design exercise only.

---

## Typography System

Use a three-font system throughout the site. This structure is locked; individual font choices within each role may be explored as part of theme variations.

- **Display / Headings** — A high-contrast editorial serif. Should feel refined and magazine-like. Open to change.
- **Body** — A clean, readable sans-serif. Comfortable at paragraph sizes. Open to change.
- **Captions / Metadata / Labels** — The current monospace font. Locked. Do not change.

### Typography Details

These stylistic patterns should appear consistently across all text-heavy pages (blog posts, case studies, bio, values):

- **Small caps** for metadata, category labels, and secondary labels (e.g. "FIELD REPORT", "READING TIME", section tags)
- **Italic serif** for pull quotes and blockquotes
- **Numbered section headings** where the numeral uses the accent color (e.g. `01`, `02`) and the heading text is in the primary text color
- **Accent color** applied sparingly but consistently throughout — on pull quote marks, section numbers, key stats, left borders on callout blocks, and other typographic details
- **No drop caps**

---

## Color

The site is not locked to dark mode. When generating theme variations, consider:

1. **Full dark** — Warm dark background (think deep brown-black, not pure `#000000`), light text
2. **Full light** — A warm or tinted light background (not just white or neutral gray), dark text
3. **Mixed** — Dark hero/header area, light background for body content, dark footer

Whatever scheme is chosen, a single **accent color** should carry through all text-heavy pages. The accent should feel warm (coral, salmon, amber, or similar) and be used sparingly for maximum impact.

---

## Theme System

The site uses CSS custom properties for theming. Each visual theme overrides these properties by applying a `data-theme` attribute to the root element.

- Build all color, typography scale, and spacing values as CSS custom properties
- Each theme is a self-contained set of overrides
- A **theme picker** should appear in the navigation (end of the nav bar). It is for development use only — it does not need to look good. A simple `<select>` or set of buttons is fine.
- The site will likely launch with a single theme and the picker hidden; for now, keep it visible

---

## Page-Specific Design Direction

### Homepage

- The h1 and `.homepage-showcase` grid are frozen (see above)
- Animated case study thumbnails on hover/click — each tile is made of layered image pieces that subtly animate. The whole tile still clicks through to the case study. New layered images will be provided; plan the markup to support stacked/layered elements inside each tile.
- A possible h1 entrance animation on page load is worth exploring, but flag it as optional — the h1 already has a lot going on visually.

### Work / Case Study Index

- One case study per row
- Consistent layout: text on the left, large image on the right — every time, no alternating
- Each entry should include: category label (small caps), title, short description, one or two key outcomes or stats, and a CTA link
- More editorial than a thumbnail grid

### Blog Posts, Case Studies, Bio, Values

- Apply the full typographic treatment described above
- Accent color should appear naturally throughout — in pull quotes, section numbers, callout borders, and key details
- Body text should be highly readable; generous line height and comfortable measure

---

## Reference Aesthetic

These sites informed the direction. Study them, don't copy them:

- **warman.life/blog** — Editorial serif typography, warm dark palette, sparse accent color, small caps metadata, numbered sections. The overall feel to aim for.
- **vercel.com/design** — Bold, heavy sans-serif headlines. Confident use of scale.
- **marco.fyi** — Animated case study tiles on the homepage.
- **andrewreff.com/work** — Case study index layout with text + large image.

---

## General Principles

- Avoid generic AI defaults: no Inter, no Roboto, no purple gradients, no predictable layouts
- Accent color should punch. Use it in 10% of places for 90% of the visual interest.
- Performance matters. Prefer CSS solutions over JavaScript. Vanilla JS only when no CSS alternative exists.
- No external CSS frameworks (no Tailwind, no utility libraries). Native HTML and CSS only.
- When in doubt, go more editorial and less startup-landing-page.

---

## Implementation notes (Dante repo)

Factual mapping only — not design direction.

- **Frozen homepage headline**: In [`src/index.njk`](../src/index.njk), `#home-heading` with class `home-hero__headline` (large serif h1, inline avatar `<img>`, company links with inline logo `<img>` elements).
- **Frozen showcase**: Same file — `<section class="homepage-showcase" …>` containing `.home-work-grid` and its grid items/cells. Do not change grid structure, sizing, or positioning when exploring themes.
- **Design tokens today**: Semantic variables live in [`themes/tokens.css`](../themes/tokens.css), imported from [`src/assets/css/styles.css`](../src/assets/css/styles.css). Multi-theme `[data-theme]` overrides and a nav theme picker are planned engineering work (see [`cursor.md`](../cursor.md) theming section); this document governs how they should behave once built.
- **Work index**: [`src/work.njk`](../src/work.njk) is currently a minimal link list. The editorial “text left / image right” layout above is the target spec for a future redesign, not the current markup.
