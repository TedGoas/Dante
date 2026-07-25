# Visual Design Language — Cursor Guardrails

This document defines the visual design constraints and direction for tedgoas.com. Use it as guardrails when generating design variations. The goal is to explore within these boundaries — not to invent a new palette or layout system.

---

## What Not to Touch

These are locked. Do not change structure, layout, size, or position of any of the following:

- **Homepage h1** — The large serif headline with the inline avatar photo and company marks (small inline images inside links). Font family may change, but the layout, sizing, and structure stay exactly as-is.
- **`.homepage-showcase` grid** — The case study thumbnail grid on the homepage. Layout, size, and position are frozen. Text styling inside the tiles is fair game.
- **All written content** — Headlines, body copy, navigation labels, blog posts, case studies, bio, How I Think page. Do not alter any text content anywhere on the site. This is a visual design exercise only.

Swiss chrome and token restyles already shipped (light header, dark footer, red interactive accent) are in scope for maintenance; do not revert to the former blue canvas.

---

## Typography System

Use a two-font system throughout the site. Role structure is locked.

- **Display / Headings** — [Redaction](https://www.redaction.us/) (editorial serif). h1–h3 and large display text only.
- **Body / UI** — [Geist](https://vercel.com/font) (sans-serif), self-hosted woff2. Everything that is not a heading: body copy, blog posts, case studies, captions, navigation, footer, labels, metadata. Legible at 12–14px and comfortable at 16–18px.
- **No monospace.** The monospace face has been removed. Any text that was previously mono (captions, small labels, nav, footer) is now Geist.

### Display titles

Page titles (homepage hero, index h1s, case study titles, blog post titles) share one scale:

- Size: `clamp(2.75rem, 8.2vw, 7.375rem)` (`--type-display-title-size`)
- Weight: `400`
- Leading: `0.864` (`--type-display-title-leading`)
- Tracking: `-0.015em`
- Titles span the full layout width; body copy does not

Type scale lives in custom properties (`--text-xs` 0.75rem → `--text-5xl` 4.5rem). Body line-height ~1.6; display titles use the tighter leading above.

### Typography Details

These stylistic patterns should appear consistently across text-heavy pages (blog posts, case studies, bio, How I Think):

- **Uppercase / small-caps labels** for metadata and category labels, rendered in Geist — not bold colored pills.
- **Italic serif** for pull quotes and blockquotes.
- **Swiss red** for interactive chrome (nav/footer hover, focus rings) and the blog title end-dot exception.
- **Deep amber** only for sparse editorial moments (homepage text markers, pull-quote left rule). Not default link hover.
- **No drop caps.**

---

## Color

The site uses a single Swiss light theme with dark bands:

- **Page canvas** — light gray (`#f3f3f3` / `--color-swiss-bg-light`).
- **Text** — near-black (`#141414` / `--color-swiss-fg-light`). Softened for prose via `--color-prose-body`.
- **Dark bands** — near-black (`#141414` / `--color-swiss-bg-dark`) for site footer (all pages) and homepage showcase.
- **Interactive accent** — Swiss red (`#c41230` / `--color-swiss-accent`). Nav/chrome hover, focus rings, work-index title hover. Also the blog post title end-dot (documented exception to “interactive only”).
- **Editorial accent** — deep amber (`#E9AE0F` / `--color-accent`). Homepage belief markers and pull-quote left rule only — not default link hover.
- **Links** — prose: underline-only in near-black; chrome: lift to Swiss red on hover.

No theme picker. Build all color, type, and spacing values as CSS custom properties. `html { color-scheme: light }`.

---

## Theme System

Single production theme on `:root` in [`themes/theme.css`](../themes/theme.css): Swiss light canvas with near-black text, Swiss red interactive accent, deep amber editorial accent, dark footer tokens.

- Structural tokens (type scale, spacing, radii, `--measure-lead`, display title tokens) live in [`themes/tokens-base.css`](../themes/tokens-base.css)
- Entry import: [`themes/tokens.css`](../themes/tokens.css) → base + theme
- No theme picker, no dark mode toggle (dark bands are intentional page sections, not a mode)

---

## Editorial Layout

Homepage rhythm sets the pattern for the rest of the site:

- **Display titles** — full layout width at the display scale above.
- **Body / lede column** — left-aligned at `--measure-lead: 56ch` (not a centered reading column).
- **Work case studies** — same site shell (`--layout-site-max: 1200px`) and left-aligned lead column as other pages.
- **Blog post header** — `.post-header__stack` with equal `--post-header-inner-gap` between date, title, and dek; `--post-header-rule-gap` (~1.5× inner) before the divider.
- **Figures / gallery media** — media flush within the layout shell (no dark band, no extra padding); captions stay in the lead column.

---

## Page-Specific Design Direction

### Homepage

- Light hero → dark `.homepage-showcase` → dark footer
- The h1 and showcase grid geometry are frozen (see above)
- Squared CTAs: filled primary + outlined secondary; Swiss red on hover
- Amber text markers only inside the dark showcase band

### Most pages (Bio, How I Think, Blog, Work index, Newsletter)

- Light canvas throughout; dark footer only
- Full-width display h1; left-aligned `--measure-lead` body/lists as appropriate
- Index UIs (article list, work cards, newsletter signup) may use full layout width

### Case studies

- Light through `work-header`, intro prose, gallery captions, and media
- Gallery media flush to layout width (no dark band wrapper or extra padding); captions stay in the lead column above media
- Light card surfaces may still frame multi-image layouts on the light canvas

### Work / Case Study Index

- Card grid on light gray tiles; titles lift to Swiss red on hover
- Title hover uses Swiss red

---

## Reference Aesthetic

These sites informed earlier direction. Study them, don't copy them:

- **warman.life/blog** — Editorial serif typography, sparse accent, small caps metadata
- **vercel.com/design** — Confident use of scale
- **linear.app/change** — Typography rhythm inspiration
- **adaline.ai** — Visual restraint inspiration (palette is now Swiss light, not blue)

---

## General Principles

- Avoid generic AI defaults: no Inter, no Roboto, no purple gradients, no predictable layouts
- Swiss red punches interactive chrome; amber is rare editorial punctuation
- Performance matters. Prefer CSS solutions over JavaScript. Vanilla JS only when no CSS alternative exists.
- No external CSS frameworks (no Tailwind, no utility libraries). Native HTML and CSS only.
- When in doubt, go more editorial and less startup-landing-page.

---

## Image Treatment

Case study thumbnails (homepage grid, work index) sit on square stages:

- **Stage** — `1 / 1` aspect ratio with a subtle hairline border (`--work-index-card-border`).
- No logos, labels, or text overlays on homepage grid image cards.

---

## Implementation notes (Dante repo)

Factual mapping only — not design direction.

- **Frozen homepage headline**: In [`src/index.njk`](../src/index.njk), `#home-heading` with class `home-hero__headline` (large serif h1, inline avatar `<img>`, company links with inline logo `<img>` elements).
- **Frozen showcase**: Same file — `<section class="homepage-showcase" …>` containing `.home-work-grid` and its grid items/cells. Do not change grid structure, sizing, or positioning.
- **Design tokens today**: [`themes/tokens.css`](../themes/tokens.css) imports [`themes/tokens-base.css`](../themes/tokens-base.css) (type scale, spacing, radii, font stacks, `--measure-lead`, display titles) and [`themes/theme.css`](../themes/theme.css) (Swiss light / dark / red / amber on `:root`). Fonts load from [`src/assets/css/site-fonts.css`](../src/assets/css/site-fonts.css): **Redaction** (serif, CDN woff2) and **Geist** (body/UI, self-hosted woff2 in [`src/assets/fonts/`](../src/assets/fonts/)). `--font-mono` is retained as an alias of the Geist body stack so legacy call sites restyle without churn. Stylesheet: [`src/assets/css/styles.css`](../src/assets/css/styles.css).
- **Work index**: [`src/work.njk`](../src/work.njk) renders a card grid; card variants collapse to light tiles. Atmosphere backdrops on case-study gallery figures are visually removed (the `workGalleryAtmosphere` transform may still inject markup, but it renders nothing). Gallery media is flush to the layout shell (no dark-band wrapper).
