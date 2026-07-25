---
name: Ted Goas — tedgoas.com
description: Editorial portfolio on a Swiss light canvas with near-black text, Swiss red interactive accent, deep amber editorial punctuation, and two-role typography.
colors:
  site-bg: "#f3f3f3"
  site-fg: "#141414"
  site-fg-muted: "color-mix(55% site-fg, site-bg)"
  prose-body: "color-mix(82% site-fg, site-bg)"
  swiss-accent: "#c41230"
  swiss-accent-hover: "#e0183a"
  accent: "oklch(78.5% 0.159 83.5)"
  accent-hover: "oklch(83.5% 0.154 88.2)"
  highlight: "site-fg-muted (quiet meta tone)"
  surface-raised: "#ffffff"
  surface-tile: "#e8e8e8"
  surface-tile-muted: "#dedede"
  border-subtle: "rgb(20 20 20 / 0.14)"
  border-strong: "rgb(20 20 20 / 0.22)"
  footer-bg: "#141414"
  footer-fg: "#f5f5f5"
typography:
  display:
    fontFamily: "\"Redaction\", Georgia, \"Times New Roman\", Times, serif"
    fontSize: "clamp(2.75rem, 8.2vw, 7.375rem)"
    fontWeight: 400
    lineHeight: 0.864
    letterSpacing: "-0.015em"
  body:
    fontFamily: "\"Geist\", ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.95rem + 0.35vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "\"Geist\", ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
spacing:
  prose-flow: "1.15rem"
  prose-section: "clamp(2.25rem, 5vw, 3.5rem)"
  measure-lead: "56ch"
  measure-reading: "min(43rem, 100%)"
  post-measure: "var(--measure-lead)"
  post-body-size: "calc(1.1875rem * 1.1)"
  post-body-leading: "1.65"
  post-paragraph-gap: "1em (scales with body size)"
  post-header-inner-gap: "calc(32 / 24 * date-size)"
  post-header-rule-gap: "calc(48 / 24 * date-size)"
  blockquote-padding: "clamp(1rem, 3vw, 1.35rem)"
components:
  button-primary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.site-fg-muted}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.75rem"
  button-primary-hover:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.site-fg}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.75rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.site-fg}"
    typography: "{typography.label}"
    padding: "0"
  home-hero-cta-primary:
    backgroundColor: "{colors.site-fg}"
    textColor: "{colors.site-bg}"
    rounded: "0"
    padding: "1.125rem 1.375rem"
  home-hero-cta-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.site-fg}"
    rounded: "0"
    padding: "1.125rem 1.375rem"
---

# Design System: Ted Goas — tedgoas.com

## Overview

**Creative North Star: "The Editorial Lab"**

A hiring-facing portfolio where long-form craft is the interface. Serif display frames Geist body type on a Swiss light canvas; Swiss red handles interactive chrome; deep amber appears only as rare editorial punctuation. Surfaces step off the light field; dark bands (footer, homepage showcase) create rhythm without a theme picker.

The system rejects SaaS landing clichés, generic AI portfolio tropes, Dribbble ornament, and corporate marketing gloss. When a choice reads as "startup landing page," choose editorial restraint instead.

**Key Characteristics:**

- Two locked type roles: Redaction (display) and Geist (body, UI, labels, nav, footer). No monospace.
- Swiss light canvas (`#f3f3f3`) with near-black text (`#141414`); dark bands at `#141414`
- Swiss red (`#c41230`) for interactive chrome; deep amber for editorial moments only
- Full-width display titles; left-aligned `--measure-lead` (56ch) body column
- Tonal layering over shadow stacks; image cards use a slight bleed past the tile
- Hairline borders (`1px`, low-opacity ink) define chrome where needed; whitespace does most of the work
- CSS custom properties in `themes/theme.css` and `themes/tokens-base.css`; no utility frameworks

## Colors

Swiss light ground with red interactive accent and amber editorial punctuation.

### Primary (interactive)

- **Swiss Red** (`#c41230` / `--color-swiss-accent`): Nav/chrome hover, focus rings, work-index title hover, homepage CTA hover. Default `--link-hover-color`.
- **Swiss Red Hover Lift** (`#e0183a`): Stronger hover where needed.
- **Blog title end-dot exception**: `.post-header__title .title-tail::after` uses Swiss red (allowed break from “interactive only”).

### Editorial (non-interactive)

- **Deep Amber** (`#e9ae0f` / `--color-accent`): Homepage text markers on the dark showcase band; pull-quote left rule. Not default link hover or focus rings.

### Neutral

- **Light Canvas** (`#f3f3f3`): Page background, site header, main.
- **Near-Black Foreground** (`#141414`): Primary text, headings.
- **Muted Foreground** (`color-mix` of near-black + light): Secondary copy, meta.
- **Raised Surface** (`#ffffff`): Raised panels, default buttons.
- **Card Tile** (`#e8e8e8`): Image cards, work tiles.
- **Tile Muted** (`#dedede`): Deeper tile variant (bio timeline cards).
- **Hairline Subtle** (`rgb(20 20 20 / 0.14)`): Default borders.
- **Hairline Strong** (`rgb(20 20 20 / 0.22)`): Emphasized rules.
- **Dark Band / Footer** (`#141414` bg, `#f5f5f5` fg): Site footer (all pages); homepage showcase.

### Image cards

Case study thumbnails sit on square stages (`--work-index-stage-ratio: 1 / 1`) with a hairline border (`--work-index-card-border` / `--color-border-subtle`).

### Editorial divider

Structural separator: hollow dots plus a flex-growing hairline (`--divider-color`). Markup via `{% from "components/divider.njk" import divider %}`. Work gallery: divider + caption + description in `.work-gallery__intro` at `--work-gallery-content-measure` (alias of `--measure-lead`). Pull quotes keep a deep amber left rule.

### Named Rules

**The Swiss Red Interactive Rule.** Interactive chrome — hover, focus-visible, chrome link color — uses Swiss red. Amber is not the default interactive color.

**The Amber Editorial Punctuation Rule.** Deep amber appears sparingly: text markers on the dark homepage showcase, pull-quote left rules. If amber fills large backgrounds or becomes default link hover, the palette has gone loud.

**The Light Canvas / Dark Band Rule.** Default pages are light with a dark footer. Homepage adds a dark showcase band. Case studies keep captions on light and put dark full-bleed bands only behind gallery media.

## Typography

**Display Font:** Redaction (Georgia, Times New Roman fallback) — h1–h3 and large display only.
**Body / UI Font:** Geist (system-ui fallback), self-hosted — body, blog, case studies, captions, nav, footer, labels, metadata.

**Character:** Editorial serif authority paired with Geist for reading and wayfinding. No monospace. Hierarchy is scale and weight, not color floods.

### Hierarchy

- **Display** (400, `clamp(2.75rem, 8.2vw, 7.375rem)`, 0.864, `-0.015em`): Homepage hero, index h1s, case study titles, blog post titles (`--type-display-title-*`). Full layout width.
- **Title** (400, section clamps): In-page h2/h3; post dek uses `--type-dek-*` / lede sizes.
- **Body** (400, reading size ~21px at 110% base, leading 1.65): Long-form prose. Editorial lead column `--measure-lead` (56ch), left-aligned — not a centered `--measure-reading` column.
- **Label** (500, 0.875rem+, Geist): Eyebrows, dates, nav, footer — muted near-black.

### Named Rules

**The Two-Role Lock Rule.** Redaction for display, Geist for everything else. No monospace; do not introduce a third display face without explicit approval.

**The Quiet Metadata Rule.** Category labels and secondary labels use Geist at small size (uppercase where helpful), not bold colored pills.

**The Full-Width Title / Left Lead Rule.** Display titles span the layout; body, dek, bylines, and gallery intros sit in a left-aligned `--measure-lead` column.

## Elevation

Flat-by-default tonal system. Surfaces step through `--color-surface-raised`, `--color-surface-tile`, and `--color-surface-tile-muted` with hairline borders instead of drop shadows.

Shadows appear only where overlay semantics require it: footer tooltips. No card-grid elevation stacks.

### Named Rules

**The Tonal Layer Rule.** Prefer raising a surface one token step or strengthening a border before adding `box-shadow`.

## Components

Tactile but quiet: interactions clarify affordance without marketing-button energy.

### Buttons

- **Shape:** Minimal / squared corners, hairline border
- **Primary (`.btn`)**: Geist small, raised fill, muted text; hover strengthens border/fill; focus `outline: 2px solid --color-swiss-accent`
- **Homepage CTAs**: Squared filled primary + outlined secondary; Swiss red hover — not an amber underline CTA

### Cards / Containers

- **Corner Style:** 0.5rem on work gallery cards; blockquotes 0.25rem
- **Work gallery video (click-to-play):** See **AGENTS.md → Work gallery: video figures**
- **Background:** Light card tile or raised white on the light canvas
- **Shadow Strategy:** Inset hairline on media; no floating card shadow at rest
- **Border:** `--color-border-subtle` hairline

### Links

- **Prose**: Underline-only in near-black (`--link-prose-underline`); no color change to red/amber in dense paragraphs
- **Chrome** (nav, footer, article-list titles, hero company links): Hover/focus Swiss red with underline
- **Focus**: `2px solid --color-swiss-accent`, 2px offset

Card/tile links and `.btn` are separate components—not these patterns.

### Navigation

- Light header, black logo filter (`brightness(0)`), Geist labels
- Hover/active: Swiss red underline; focus-visible Swiss red outline

### Homepage Work Grid (signature)

- Frozen 4×4-ish grid geometry inside dark `.homepage-showcase`
- Corner marks on media cells; amber text markers in belief cells only

### Case study gallery

- Intro (divider, caption, description) on light lead column
- Media siblings flush to layout width (no dark band or extra padding)

## Do's and Don'ts

### Do:

- **Do** use CSS custom properties from `themes/theme.css` for every color and `tokens-base.css` for type stacks, radii, and spacing.
- **Do** keep editorial body at `--measure-lead` (56ch), left-aligned; display titles full width.
- **Do** apply Swiss red to interactive/hover/focus chrome; reserve deep amber for editorial markers and pull-quote rules.
- **Do** use Geist for body, UI, and metadata; keep prose links underline-only.
- **Do** honor `prefers-reduced-motion: reduce` on transitions.
- **Do** use semantic HTML and focus-visible outlines on all interactive elements.

### Don't:

- **Don't** use SaaS landing patterns: hero metrics, identical three-up feature cards, gradient text, modal-first flows, or high-contrast solid CTA walls.
- **Don't** ship generic AI portfolio tropes: Inter/Roboto, purple gradients, decorative glass, side-stripe accent borders thicker than 1px.
- **Don't** treat the site like a Dribbble shot: ornament without case-study depth.
- **Don't** borrow corporate marketing visuals: stock hero blobs, buzzword headlines, logo-wall social proof without context.
- **Don't** hardcode hex in component CSS; reference tokens. Don't revive the blue canvas / cream text palette.
- **Don't** use deep amber as default link hover or focus ring color.
- **Don't** change frozen homepage `#home-heading` / `.homepage-showcase` layout, sizing, or positioning during visual experiments.
- **Don't** introduce Tailwind, Bootstrap, or other CSS frameworks.
