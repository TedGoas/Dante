---
name: Ted Goas — tedgoas.com
description: Editorial portfolio on a warm brown-black canvas with amber accent and three-role typography.
colors:
  site-bg: "#1c1610"
  site-fg: "#fffbeb"
  site-fg-muted: "color-mix(68% site-fg, site-bg)"
  prose-body: "color-mix(88% site-fg, site-fg-muted)"
  accent: "#ffb900"
  accent-hover: "#ffc933"
  highlight: "#ffb900"
  surface-raised: "#241c14"
  surface-tile: "#2a2118"
  surface-tile-muted: "#16110d"
  border-subtle: "rgba(255, 255, 255, 0.1)"
  border-strong: "rgba(255, 255, 255, 0.15)"
typography:
  display:
    fontFamily: "\"Redaction\", Georgia, \"Times New Roman\", Times, serif"
    fontSize: "clamp(2.4rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "normal"
  body:
    fontFamily: "\"Instrument Sans\", ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.95rem + 0.35vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.68
    letterSpacing: "normal"
  label:
    fontFamily: "\"Atkinson Hyperlegible Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
spacing:
  prose-flow: "1.15rem"
  prose-section: "clamp(2.25rem, 5vw, 3.5rem)"
  measure-reading: "min(43rem, 100%)"
  post-measure: "var(--measure-reading)"
  post-body-size: "calc(1.1875rem * 1.1)"
  post-body-leading: "1.65"
  post-paragraph-gap: "1em (scales with body size)"
  blockquote-padding: "clamp(1rem, 3vw, 1.35rem)"
components:
  button-primary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.site-fg-muted}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.75rem"
  button-primary-hover:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.accent-hover}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.75rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.site-fg}"
    typography: "{typography.label}"
    padding: "0"
  home-hero-cta:
    backgroundColor: "transparent"
    textColor: "{colors.site-fg}"
    typography: "{typography.display}"
    padding: "0 0 0.25rem"
---

# Design System: Ted Goas — tedgoas.com

## Overview

**Creative North Star: "The Editorial Lab"**

A hiring-facing portfolio where long-form craft is the interface. Serif display and mono metadata frame Instrument Sans body type on a warm brown-black canvas; amber accent appears sparingly but decisively. Surfaces stay mostly flat; depth comes from tonal steps and hairline rules, not decorative shadow stacks. Interactive elements feel tactile through border and fill shifts on hover, never through loud solid buttons.

The system rejects SaaS landing clichés, generic AI portfolio tropes, Dribbble ornament, and corporate marketing gloss. When a choice reads as "startup landing page," choose editorial restraint instead.

**Key Characteristics:**

- Three locked type roles: Redaction (display), Instrument Sans (body), Atkinson Hyperlegible Mono (labels/nav/footer)
- Warm brown-black canvas (`#1c1610`) with amber accent used as punctuation, not wallpaper
- Tonal layering over shadow stacks; shadows reserved for tooltips and rare overlays
- Hairline borders (`1px`, low-opacity rgba) define chrome and tiles
- Prose measure capped near 66ch; generous section spacing via fluid clamps
- CSS custom properties in `themes/theme.css` and `themes/tokens-base.css`; no utility frameworks

## Colors

Warm dark brown-black ground with amber accent: editorial night, not pure black.

### Primary

- **Amber Accent** (`#ffb900`, `amber/400`): Links on hover, focus rings, section numbers, pull-quote marks, CTA underlines, key typographic punctuation. Default state stays quiet; accent earns attention on interaction or emphasis.
- **Amber Hover Lift** (`#ffc933`): Hover and active link states; slightly brighter without going neon.
- **Amber Highlight** (`#ffb900`): Blockquote left rule, list markers, attribution links in prose (same ramp as accent).

### Neutral

- **Warm Canvas** (`#1c1610`): Page background, site chrome.
- **Cream Foreground** (`#fffbeb`, `amber/50`): Primary text, headings in strong contexts.
- **Warm Muted** (`color-mix` of cream + canvas): Secondary copy, button default text, de-emphasized UI.
- **Raised Surface** (`#241c14`): Raised surfaces (code blocks, default buttons).
- **Tile Warm** (`#2a2118`): Cards, work tiles, footer tooltips, hover button fill.
- **Tile Deep** (`#16110d`): Muted tile variant (bio timeline cards).
- **Veil Border Subtle** (`rgba(255, 255, 255, 0.1)`): Hairline dividers, default borders.
- **Veil Border Strong** (`rgba(255, 255, 255, 0.15)`): Emphasized rules, link underlines in chrome.

### Editorial divider

Structural separator (not accent): three hollow dots (`--divider-dot-size`, `--divider-gap`) plus a flex-growing hairline (`--divider-color` → `--color-divider`, white at 20% opacity). Markup via `{% from "components/divider.njk" import divider %}` and `{{ divider() }}` (blog headers); work gallery figures get the same markup via build transform. Modifier `divider--strong` uses `--color-border-strong`. Blog figures with captions still use dashed `--figure-rule-dash-*`. Work gallery: divider + caption + description wrapped in `.work-gallery__intro` at `--work-gallery-content-measure` (same as `--measure-reading`), left-aligned with case study intro prose (not centered inside the breakout); screenshots at `--work-gallery-media-max-width` (gallery breakout). Pull quotes in `.content-flow` still break out via negative margin on blockquotes.

### Named Rules

**The Amber Punctuation Rule.** Accent color appears on roughly 10% of any screen: section numerals, pull-quote details, hover states, and one structural emphasis per viewport. If amber fills large backgrounds, the palette has gone loud.

**The No Pure Black Rule.** Backgrounds stay tinted warm brown-black; never `#000000` or untinted neutral gray fields.

## Typography

**Display Font:** Redaction (Georgia, Times New Roman fallback)
**Body Font:** Instrument Sans (system-ui fallback)
**Label/Mono Font:** Atkinson Hyperlegible Mono (locked for captions, metadata, nav, footer)

**Character:** Editorial serif authority paired with a light geometric sans for reading and mono for wayfinding. Hierarchy is scale and weight, not color floods.

### Hierarchy

- **Display** (400, `clamp(2.4rem, 5vw, 4rem)`, 1.12): Homepage hero headline, major page titles. Structure frozen on homepage per visual design language.
- **Headline** (400, `clamp(2.125rem, 5vw, 3.625rem)`, 1.12): Article and case study titles (`--type-h1-size`).
- **Title** (400, `clamp(1.55rem, 3vw, 2.15rem)`, ~1.3): Section headings, post dek.
- **Body** (400, `clamp(1.0625rem, 0.95rem + 0.35vw, 1.1875rem)`, 1.68): Long-form prose; default measure `--measure-prose` (66ch) for general `.content-flow` pages. **Reading prose** (blog `.post-body`, case study `.work-body.writing`, Values `.reading`) shares `--measure-reading` (`min(43rem, 100%)`, ~72 characters at reading body size), ~21px body (110% base), leading 1.65, 1em paragraph gap, `--color-prose-body` with full foreground on `strong`. Blog keeps `--post-measure` as an alias of `--measure-reading` for header/footer width.
- **Label** (400, 0.75rem, 1.4, tracking 0.12–0.14em, uppercase/small caps): Eyebrows, reading time, nav, footer links, figure kickers.

### Named Rules

**The Three-Role Lock Rule.** Redaction for display, Instrument Sans for body, Atkinson Mono for metadata and chrome. Do not swap mono to sans or introduce a fourth display face without explicit approval.

**The Small Caps Metadata Rule.** Category labels, field reports, and secondary labels use mono at small size with increased letter-spacing, not bold colored pills.

## Elevation

Flat-by-default tonal system. Surfaces step through `--color-surface-raised`, `--color-surface-tile`, and `--color-surface-tile-muted` with hairline borders instead of drop shadows. Depth on work tiles uses inset hairlines (`box-shadow: inset 0 0 0 1px …`) rather than floating cards.

Shadows appear only where overlay semantics require it: footer tooltips (`0 0.25rem 1.25rem rgba(0,0,0,0.35–0.45)`). No card-grid elevation stacks.

### Named Rules

**The Tonal Layer Rule.** Prefer raising a surface one token step or strengthening a border before adding `box-shadow`. If a shadow is visible at rest on a content block, reconsider.

## Components

Tactile but quiet: interactions clarify affordance without marketing-button energy.

### Buttons

- **Shape:** Minimal corners (implicit 0; mono label buttons use no radius), hairline border (`1px`)
- **Primary:** Mono 0.875rem, padding `0.4rem 0.75rem`, `--color-surface-raised` fill, `--color-site-fg-muted` text, `--color-border-subtle` border
- **Hover / Focus:** Fill shifts to `--color-surface-tile`, text and border move toward `--color-accent-hover`; focus `outline: 2px solid --color-accent` with 2px offset
- **Ghost pattern:** Text links with underline on hover; homepage CTA uses 4px bottom border in accent, not a filled pill

### Cards / Containers

- **Corner Style:** 0.5rem on work gallery cards (`--radius-work-gallery-card`); blockquotes 0.25rem
- **Work gallery video (click-to-play):** Poster-first figure with lazy MP4; after first play, **native browser video controls** (muted). Rounded container uses **`--radius-click-to-play`** (1rem / 16px) on the media block so poster and video share one clip. See **AGENTS.md → Work gallery: video figures** for authoring and file map.
- **Background:** Tile warm (`#2a2118`) or raised surface for panels
- **Shadow Strategy:** Inset hairline on media; no floating card shadow at rest
- **Border:** `--color-border-subtle` hairline; stronger border on hover for grid cells
- **Internal Padding:** Fluid clamps (`clamp(1.25rem, 4vw, 2.5rem)` for gallery cards; blockquote padding via `--space-blockquote-padding`)

### Inputs / Fields

- **Style:** Not a primary surface on this site; newsletter/subscribe flows should inherit mono labels and hairline borders when added
- **Focus:** 2px accent outline, 2px offset (match buttons/links)
- **Error / Disabled:** De-emphasize with `--color-site-fg-muted`; never red gradient banners

### Navigation

- **Style:** Mono 0.875rem, flex row with generous gap, no background bar
- **Default:** `--color-site-fg`, no underline
- **Hover / Active:** `--color-accent-hover` with underline; focus-visible accent outline
- **Mobile:** Wrap-friendly flex; maintain tap targets without hamburger-first modals

### Homepage Work Grid (signature)

- **Layout:** 4×6 CSS grid, frozen structure; text and media cells with aspect ratio `4/6`
- **Interaction:** Tile background shifts between tile and tile-muted on hover; inset border on media cell
- **Goal:** Craft-forward showcase (marco.fyi direction) within frozen grid geometry

## Do's and Don'ts

### Do:

- **Do** use CSS custom properties from `themes/theme.css` for every color and `tokens-base.css` for type stacks, radii, and spacing.
- **Do** keep prose measure near 66ch and section spacing on `--space-prose-section` clamps.
- **Do** apply amber accent to section numbers, pull-quote marks, hover links, and one CTA underline per hero.
- **Do** use Instrument Sans for body and Atkinson Hyperlegible Mono for metadata to support WCAG AA readability goals.
- **Do** honor `prefers-reduced-motion: reduce` on transitions (footer tooltips, tile animations).
- **Do** use semantic HTML (`nav`, `article`, `footer`) and focus-visible outlines on all interactive elements.

### Don't:

- **Don't** use SaaS landing patterns: hero metrics, identical three-up feature cards, gradient text, modal-first flows, or high-contrast solid CTA walls.
- **Don't** ship generic AI portfolio tropes: Inter/Roboto, purple gradients, decorative glass, side-stripe accent borders thicker than 1px, or predictable card grids.
- **Don't** treat the site like a Dribbble shot: ornament without case-study depth, or animation that overshadows content.
- **Don't** borrow corporate marketing visuals: stock hero blobs, buzzword headlines, logo-wall social proof without context.
- **Don't** hardcode hex in component CSS; reference tokens. Never use pure `#000` / `#fff` neutrals.
- **Don't** change frozen homepage `#home-heading` / `.homepage-showcase` layout, sizing, or positioning during visual experiments.
- **Don't** introduce Tailwind, Bootstrap, or other CSS frameworks.
