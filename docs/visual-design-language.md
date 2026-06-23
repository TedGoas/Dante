# Visual Design Language — Cursor Guardrails

This document defines the visual design constraints and direction for tedgoas.com. Use it as guardrails when generating design variations. The goal is to explore multiple visual themes within these boundaries — not to produce a single final design.

---

## What Not to Touch

These are locked. Do not change structure, layout, size, or position of any of the following:

- **Homepage h1** — The large serif headline with the inline avatar photo and company marks (small inline images inside links). Font family may change, but the layout, sizing, and structure stay exactly as-is.
- **`.homepage-showcase` grid** — The case study thumbnail grid on the homepage. Layout, size, and position are frozen. Text styling inside the tiles is fair game.
- **All written content** — Headlines, body copy, navigation labels, blog posts, case studies, bio, How I Think page. Do not alter any text content anywhere on the site. This is a visual design exercise only.

---

## Typography System

Use a two-font system throughout the site. Role structure is locked.

- **Display / Headings** — [Redaction](https://www.redaction.us/) (editorial serif). h1–h3 and large display text only.
- **Body / UI** — [Geist](https://vercel.com/font) (sans-serif), self-hosted woff2. Everything that is not a heading: body copy, blog posts, case studies, captions, navigation, footer, labels, metadata. Legible at 12–14px and comfortable at 16–18px.
- **No monospace.** The monospace face has been removed. Any text that was previously mono (captions, small labels, nav, footer) is now Geist.

Type scale lives in custom properties (`--text-xs` 0.75rem → `--text-5xl` 4.5rem). Body line-height 1.6; headings 1.1–1.2.

### Typography Details

These stylistic patterns should appear consistently across text-heavy pages (blog posts, case studies, bio, How I Think):

- **Uppercase / small-caps labels** for metadata and category labels (e.g. "FIELD REPORT", "READING TIME"), rendered in Geist — not bold colored pills.
- **Italic serif** for pull quotes and blockquotes.
- **Numbered section headings** where the numeral may use the deep amber accent and the heading text uses primary text color.
- **Accent color** is used sparingly: interactive/hover states plus a small set of editorial moments (pull-quote left rule, section numbers). Do not apply accent to links, callout fills, key stats, or footer flourishes.
- **No drop caps.**

---

## Color

The site uses a single inverted blue scheme:

- **Background** — deep blue (`oklch(40.3% 0.115 257.4)` / `#1A4785`).
- **Text** — cream (`#ECF0ED`, the former page background). Not pure white.
- **Card / surface** — a step lighter than the page background (~6–10%), for image containers and separation.
- **Accent** — deep amber (`#E9AE0F`). The only saturated color. Reserved for interactive states, hover, and intentional moments (e.g. the pull-quote rule).
- **Links** — underline only in prose; chrome links may lift to deep amber on hover.

No theme picker. Build all color, type, and spacing values as CSS custom properties.

---

## Theme System

The site uses CSS custom properties on `:root` for a single production theme: deep blue canvas (`oklch(40.3% 0.115 257.4)`) with cream text and deep amber accent (`oklch(78.5% 0.159 83.5)`).

- Build all color, typography scale, and spacing values as CSS custom properties
- Palette lives in [`themes/theme.css`](../themes/theme.css); structural tokens (type scale, spacing, radii) in [`themes/tokens-base.css`](../themes/tokens-base.css)
- No theme picker, no dark mode

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

### Blog Posts, Case Studies, Bio, How I Think

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

## Image Treatment

Case study thumbnails (homepage grid, work index) sit on a card surface with a quiet, design-tool detail:

- **Card surface** — each image sits on the slightly-darker surface color.
- **Selection-handle corner marks** — small hollow squares (border only, no fill) at the four corners of the card, like a design tool's handles. Muted cream at low opacity; never oversized. On hover they shift to the deep amber accent.
- **Slight bleed** — the image may extend ~8–12px beyond the card edges (top and sides), implying depth. Intentional, not broken.
- No logos, labels, or text overlays on homepage grid image cards.

Implemented with CSS custom properties (`--card-corner-mark-image`, `--card-corner-mark-image-active`, `--card-image-bleed`) and a `::after` pseudo-element — no extra markup or image assets.

---

## Implementation notes (Dante repo)

Factual mapping only — not design direction.

- **Frozen homepage headline**: In [`src/index.njk`](../src/index.njk), `#home-heading` with class `home-hero__headline` (large serif h1, inline avatar `<img>`, company links with inline logo `<img>` elements).
- **Frozen showcase**: Same file — `<section class="homepage-showcase" …>` containing `.home-work-grid` and its grid items/cells. Do not change grid structure, sizing, or positioning.
- **Design tokens today**: [`themes/tokens.css`](../themes/tokens.css) imports [`themes/tokens-base.css`](../themes/tokens-base.css) (type scale, spacing, radii, font stacks) and [`themes/theme.css`](../themes/theme.css) (blue canvas / deep amber accent on `:root`). Fonts load from [`src/assets/css/site-fonts.css`](../src/assets/css/site-fonts.css): **Redaction** (serif, CDN woff2) and **Geist** (body/UI, self-hosted woff2 in [`src/assets/fonts/`](../src/assets/fonts/)). `--font-mono` is retained as an alias of the Geist body stack so legacy call sites restyle without churn. Stylesheet: [`src/assets/css/styles.css`](../src/assets/css/styles.css).
- **Work index**: [`src/work.njk`](../src/work.njk) renders a two-column card grid; all card variants (framed/bleed/atmosphere) now collapse to one uniform light card with corner marks. Atmosphere backdrops on case-study gallery figures are removed (the `workGalleryAtmosphere` transform may still inject markup, but it renders nothing).
