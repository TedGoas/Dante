---
name: work-gallery-figures
description: >-
  Work case study gallery figures — multi-image layouts (hero-secondary, email-duo,
  sidebar-quad, integrations-stack), CSS atmosphere backdrops, and palette modifiers.
  Use when adding, editing, or styling work gallery figures in case study HTML.
---

# Work gallery figures

Case studies use a `<section class="work-gallery">` of `<figure class="work-gallery__item">` blocks. Caption + description stay in the figure; build transforms wrap them in `.work-gallery__intro` and keep media outside.

**Canonical reference:** [reference.md](reference.md) (copy-paste HTML templates).  
**Repo rules:** [AGENTS.md](../../../AGENTS.md) (*Work gallery* sections).  
**Styles:** [`src/assets/css/styles.css`](../../../src/assets/css/styles.css) (search `Reusable figure pattern`).  
**Video figures:** use the `clickToPlayVideo` shortcode — see AGENTS.md, not this skill.

## Quick picker

| You need | Figure modifier | Media modifier | Extra |
|----------|-----------------|----------------|-------|
| Single full-width screenshot | *(none)* | `<img>` only | — |
| Desktop + mobile (email digest) | `work-gallery__item--hero-secondary` | `work-gallery__media--hero-secondary` | `work-gallery__media-main` + `work-gallery__media-secondary` |
| Two emails side by side | `…--hero-secondary` + `…--email-duo` | `…--hero-secondary` | Wider column mins (680px / 400px) |
| Email + tall mobile app | `…--hero-secondary` + `…--canfield-duo` | `…--hero-secondary` | Wider columns (640px / 768px) |
| Four panels in two columns | `work-gallery__item--sidebar-quad` | `work-gallery__media--sidebar-quad` | `.work-gallery__sidebar-quad` + `__col` |
| Two overlapping cards | `work-gallery__item--integrations-stack` | `work-gallery__media--integrations-stack` | `__integrations-stack__stage` + `__back` / `__front` |
| Large native asset (e.g. MP4 frame) | `work-gallery__item--media-native` | per click-to-play or img | — |
| Rounded corners on lone img | `work-gallery__item--media-radius-lg` | — | — |

## Atmosphere backdrop (CSS only)

Add on the **media** `div` when the frame should have a gradient “stage” (not on single `<img>` figures):

1. `work-gallery__media--has-backdrop`
2. `work-gallery__media--backdrop-atmosphere`
3. One palette: `work-gallery__media--atmosphere-warm-light` | `…-amber-dusk` | `…-cool-dark`
4. First child: `<div class="work-gallery__backdrop" aria-hidden="true"></div>`

**Auto-assign:** Omit the four classes above; [`workGalleryAtmosphere`](../../../lib/transforms/workGalleryAtmosphere.js) injects them on `hero-secondary`, `sidebar-quad`, and `integrations-stack` media blocks (stable hash per page slug + figure order).

**Manual palette:** Add all backdrop classes + backdrop `div` yourself; transform skips that block but still counts its index so sibling auto figures keep the same palette slot.

**Padding:** Multi-image frames use `--work-gallery-atmosphere-frame-padding` on top/left/right. `hero-secondary` (with or without backdrop) uses **flush bottom** — images align to the frame’s bottom edge (`align-items: end` + zero bottom padding).

**Width:** Backdrop frames use `width: fit-content; max-width: 100%; margin-inline: auto` so the stage hugs content (not full 90rem bleed).

## Checklist for a new multi-image figure

1. Pick layout row from the table; copy the matching template from [reference.md](reference.md).
2. Set `width` / `height` on images; descriptive `alt`; `loading="lazy"`.
3. Add `aria-label` on the media `div` when multiple images need one summary.
4. Choose auto atmosphere or manual palette (see above).
5. Build and check `/work/<slug>/` — spacing, bottom flush on hero-secondary, backdrop width.

## Do not

- Convert case studies to Markdown for gallery HTML.
- Add npm packages or inline styles for gallery layout.
- Hardcode colors — palettes use `--work-gallery-atmosphere-*` and theme tokens.
- Partial manual backdrop on one figure without understanding index order (fixed in transform; manual siblings still need explicit palette if you override any figure on the page).
