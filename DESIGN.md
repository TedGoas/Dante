---
name: Ted Goas — tedgoas.com
description: Editorial portfolio on a medium blue canvas with cream text, deep amber accent, and two-role typography.
colors:
  site-bg: "oklch(40.3% 0.115 257.4)"
  site-fg: "oklch(95.1% 0.006 153.8)"
  site-fg-muted: "color-mix(in oklch, site-fg 62%, site-bg)"
  prose-body: "color-mix(in oklch, site-fg 88%, site-fg-muted)"
  accent: "oklch(78.5% 0.159 83.5)"
  accent-hover: "oklch(83.5% 0.154 88.2)"
  highlight: "site-fg-muted (quiet meta tone; accent is set explicitly where used)"
  surface-raised: "color-mix(88% site-bg, site-fg)"
  surface-tile: "color-mix(84% site-bg, site-fg)"
  surface-tile-muted: "color-mix(78% site-bg, site-fg)"
  border-subtle: "color-mix(12% site-fg, transparent)"
  border-strong: "color-mix(20% site-fg, transparent)"
typography:
  display:
    fontFamily: "\"Redaction\", Georgia, \"Times New Roman\", Times, serif"
    fontSize: "clamp(2.4rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "normal"
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
    textColor: "{colors.site-fg}"
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

A hiring-facing portfolio where long-form craft is the interface. Serif display frames Geist body type on a medium blue canvas; a deep amber accent appears sparingly and decisively. Surfaces step lighter on the blue field; depth comes from tonal steps and a quiet selection-handle detail on image cards, not decorative shadow stacks.

The system rejects SaaS landing clichés, generic AI portfolio tropes, Dribbble ornament, and corporate marketing gloss. When a choice reads as "startup landing page," choose editorial restraint instead.

**Key Characteristics:**

- Two locked type roles: Redaction (display) and Geist (body, UI, labels, nav, footer). No monospace.
- Deep blue canvas (`oklch(40.3% 0.115 257.4)`) with cream text; deep amber accent used as punctuation, not wallpaper
- Deep amber is the only saturated color; links are underline-only with no color change
- Tonal layering over shadow stacks; image cards carry Figma-style corner marks and a slight image bleed
- Hairline borders (`1px`, low-opacity ink) define chrome where needed; whitespace does most of the work
- Prose measure capped near 66ch; generous section spacing via fluid clamps
- CSS custom properties in `themes/theme.css` and `themes/tokens-base.css`; no utility frameworks

## Colors

Deep blue ground with deep amber accent: confident editorial, not pure black on white.

### Primary

- **Deep Amber Accent** (`#e9ae0f`): Interactive/hover states, focus rings, the pull-quote left rule, blog title dots, and section numbers. The only saturated color; not used on links or buttons.
- **Deep Amber Hover Lift** (`#f2c23a`): Hover and active states for chrome links and card titles.

### Neutral

- **Blue Canvas** (`oklch(40.3% 0.115 257.4)`): Page background, site chrome.
- **Cream Foreground** (`#ecf0ed`): Primary text, headings in strong contexts.
- **Cream Muted** (`color-mix` of cream + blue): Secondary copy, button default text, de-emphasized UI.
- **Raised Surface** (`color-mix(88% blue, cream)`): Raised surfaces (code blocks, default buttons), ~12% lighter.
- **Card Tile** (`color-mix(84% blue, cream)`): Image cards, work tiles, footer tooltips, ~16% lighter.
- **Tile Muted** (`color-mix(78% blue, cream)`): Deeper tile variant (bio timeline cards), ~22% lighter.
- **Cream Border Subtle** (`color-mix(14% cream, transparent)`): Hairline dividers, default borders.
- **Cream Border Strong** (`color-mix(24% cream, transparent)`): Emphasized rules.

### Image cards

Case study thumbnails (homepage grid, work index) sit on the card tile surface with **Figma-style selection-handle corner marks** (small hollow squares at the four corners, muted cream at low opacity, shifting to deep amber on hover) and a **slight image bleed** (~8–12px beyond the card on top and sides). Tokens: `--card-corner-mark-image`, `--card-corner-mark-image-active`, `--card-corner-mark-size`, `--card-image-bleed`. No extra markup or image assets.

### Editorial divider

Structural separator (not accent): a hollow dot (`--divider-dot-size`, `--divider-gap`) plus a flex-growing hairline (`--divider-color` → `--color-divider`, cream at low opacity). Markup via `{% from "components/divider.njk" import divider %}` and `{{ divider() }}` (blog headers); work gallery figures get the same markup via build transform. Modifier `divider--strong` uses `--color-border-strong`. Figure captions are quiet Geist text above the figure (the former dashed kicker/rule scaffolding has been removed). Work gallery: divider + caption + description wrapped in `.work-gallery__intro` at `--work-gallery-content-measure` (same as `--measure-reading`), left-aligned with case study intro prose; screenshots at `--work-gallery-media-max-width` (gallery breakout). Pull quotes in `.content-flow` still break out via negative margin on blockquotes (deep amber left rule).

### Named Rules

**The Deep Amber Punctuation Rule.** Accent appears on roughly 10% of any screen: interactive/hover states, the pull-quote rule, section numerals, blog title dots, and one structural emphasis per viewport. Accent never appears on links or buttons. If deep amber fills large backgrounds, the palette has gone loud.

**The No Pure White/Black Rule.** Backgrounds stay tinted blue; text stays cream. Never `#ffffff`, `#000000`, or untinted neutral gray fields.

## Typography

**Display Font:** Redaction (Georgia, Times New Roman fallback) — h1–h3 and large display only.
**Body / UI Font:** Geist (system-ui fallback), self-hosted — body, blog, case studies, captions, nav, footer, labels, metadata.

**Character:** Editorial serif authority paired with Geist for reading and wayfinding. No monospace. Hierarchy is scale and weight, not color floods.

### Hierarchy

- **Display** (400, `clamp(2.4rem, 5vw, 4rem)`, 1.12): Homepage hero headline, major page titles. Structure frozen on homepage per visual design language.
- **Headline** (400, `clamp(2.125rem, 5vw, 3.625rem)`, 1.12): Article and case study titles (`--type-h1-size`).
- **Title** (400, `clamp(1.55rem, 3vw, 2.15rem)`, ~1.3): Section headings, post dek.
- **Body** (400, `clamp(1.0625rem, 0.95rem + 0.35vw, 1.1875rem)`, 1.68): Long-form prose; default measure `--measure-prose` (66ch) for general `.content-flow` pages. **Reading prose** (blog `.post-body`, case study `.work-body.writing`, How I Think `.reading`) shares `--measure-reading` (`min(43rem, 100%)`, ~72 characters at reading body size), ~21px body (110% base), leading 1.65, 1em paragraph gap, `--color-prose-body` with full foreground on `strong`. Blog keeps `--post-measure` as an alias of `--measure-reading` for header/footer width.
- **Label** (500, 0.875rem, 1.4, uppercase where used for category labels): Eyebrows, reading time, nav, footer links — all Geist.

### Named Rules

**The Two-Role Lock Rule.** Redaction for display, Geist for everything else (body, UI, labels, nav, footer). No monospace; do not introduce a third display face without explicit approval.

**The Quiet Metadata Rule.** Category labels, field reports, and secondary labels use Geist at small size (uppercase where helpful), not bold colored pills.

## Elevation

Flat-by-default tonal system. Surfaces step through `--color-surface-raised`, `--color-surface-tile`, and `--color-surface-tile-muted` with hairline borders instead of drop shadows. Depth on work tiles uses inset hairlines (`box-shadow: inset 0 0 0 1px …`) rather than floating cards.

Shadows appear only where overlay semantics require it: footer tooltips (`0 0.25rem 1.25rem rgba(0,0,0,0.35–0.45)`). No card-grid elevation stacks.

### Named Rules

**The Tonal Layer Rule.** Prefer raising a surface one token step or strengthening a border before adding `box-shadow`. If a shadow is visible at rest on a content block, reconsider.

## Components

Tactile but quiet: interactions clarify affordance without marketing-button energy.

### Buttons

- **Shape:** Minimal corners (implicit 0), hairline border (`1px`)
- **Primary:** Geist 0.875rem, padding `0.4rem 0.75rem`, `--color-surface-raised` fill, `--color-site-fg-muted` text, `--color-border-subtle` border
- **Hover / Focus:** Fill shifts to `--color-surface-tile`, text stays `--color-site-fg`, border strengthens; focus `outline: 2px solid --color-accent` with 2px offset
- **Ghost pattern:** Text links with underline on hover; homepage CTA uses 4px bottom border in accent, not a filled pill

### Cards / Containers

- **Corner Style:** 0.5rem on work gallery cards (`--radius-work-gallery-card`); blockquotes 0.25rem
- **Work gallery video (click-to-play):** Poster-first figure with lazy MP4; after first play, **native browser video controls** (muted). Rounded container uses **`--radius-click-to-play`** (1rem / 16px) on the media block so poster and video share one clip. See **AGENTS.md → Work gallery: video figures** for authoring and file map.
- **Background:** Card tile (`--color-surface-tile`) or raised surface for panels
- **Shadow Strategy:** Inset hairline on media; no floating card shadow at rest
- **Border:** `--color-border-subtle` hairline; stronger border on hover for grid cells
- **Internal Padding:** Fluid clamps (`clamp(1.25rem, 4vw, 2.5rem)` for gallery cards; blockquote padding via `--space-blockquote-padding`)

### Inputs / Fields

- **Style:** Not a primary surface on this site; newsletter/subscribe flows should inherit Geist labels and hairline borders when added
- **Focus:** 2px accent outline, 2px offset (match buttons/links)
- **Error / Disabled:** De-emphasize with `--color-site-fg-muted`; never red gradient banners

### Links

Two core text-link patterns plus one homepage exception. Tokens: `--link-prose-underline`, `--link-hover-color`, `--link-chrome-underline-offset`, `--link-emphasis-border-width`.

- **Prose** (`.post-body`, `.work-body.writing`, `.content-flow > .reading`): Underline-only. Body text color at rest with a `1px` `border-bottom` in a lighter value of the text color (`--link-prose-underline`), never the accent. Hover/focus deepens text and rule to full ink — no color change. Used where links sit inside dense paragraphs.
- **Chrome** (nav, footer, `.article-list__link`, hero company links, newsletter archive titles): No default underline; context signals affordance. Hover/focus: `--link-hover-color` text with underline (`--link-chrome-underline-offset`).
- **Emphasis CTA** (`.home-hero__cta` only): Display type + `--link-emphasis-border-width` bottom rule in accent; hover lifts to `--link-hover-color`. Not a filled button.

Card/tile links (work index, homepage grid) and `.btn` are separate components—not these patterns.

### Navigation

- **Style:** Geist 0.875rem, flex row with generous gap, no background bar
- **Default:** `--color-site-fg`, no underline (chrome link pattern)
- **Hover / Active:** `--link-hover-color` with underline; focus-visible accent outline
- **Mobile:** Wrap-friendly flex; maintain tap targets without hamburger-first modals

### Homepage Work Grid (signature)

- **Layout:** 4×6 CSS grid, frozen structure; text and media cells with aspect ratio `4/6`
- **Interaction:** Image cards carry Figma-style corner marks that shift to deep amber on hover; image bleeds slightly beyond the card
- **Goal:** Craft-forward showcase (marco.fyi direction) within frozen grid geometry

## Do's and Don'ts

### Do:

- **Do** use CSS custom properties from `themes/theme.css` for every color and `tokens-base.css` for type stacks, radii, and spacing.
- **Do** keep prose measure near 66ch and section spacing on `--space-prose-section` clamps.
- **Do** apply deep amber accent to interactive/hover states, the pull-quote rule, section numbers, and blog title dots — never to links or buttons.
- **Do** use Geist for body, UI, and metadata to support WCAG AA readability goals; keep links underline-only.
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
