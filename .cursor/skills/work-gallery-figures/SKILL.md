---
name: work-gallery-figures
description: >-
  Work case study gallery figures — multi-image layouts (hero-secondary, email-duo,
  sidebar-quad, integrations-stack, experiment-grid), post-hero follow-up copy,
  captioned thumbnail grids, and border/radius modifiers.
  Use when adding, editing, or styling work gallery figures in case study Markdown.
---

# Work gallery figures

Case studies use a `<section class="work-gallery">` of `<figure class="work-gallery__item">` blocks. Caption + description stay in the figure; build transforms wrap them in `.work-gallery__intro` and keep media outside. Optional follow-up paragraphs and captioned thumbnail grids sit **after** the hero.

**Canonical reference:** [reference.md](reference.md) (copy-paste HTML templates).  
**Repo rules:** [AGENTS.md](../../../AGENTS.md) (*Work gallery* sections).  
**Styles:** [`src/assets/css/styles.css`](../../../src/assets/css/styles.css) (search `Reusable figure pattern` / `captioned thumbnail`).  
**Video figures:** use the `clickToPlayVideo` shortcode — see AGENTS.md, not this skill.  
**Interactive prototypes:** use **[`.cursor/skills/prototype-embed/SKILL.md`](../prototype-embed/SKILL.md)**.

## Quick picker

| You need | Figure modifier | Media modifier | Extra |
|----------|-----------------|----------------|-------|
| Single full-width screenshot | *(none)* | `<img>` only | — |
| Desktop + mobile (email digest) | `work-gallery__item--hero-secondary` | `work-gallery__media--hero-secondary` | `work-gallery__media-main` + `work-gallery__media-secondary` |
| Two emails side by side | `…--hero-secondary` + `…--email-duo` | `…--hero-secondary` | Wider column mins (680px / 400px) |
| Email + tall mobile app | `…--hero-secondary` + `…--canfield-duo` | `…--hero-secondary` | Wider columns (640px / 768px) |
| Four panels in two columns | `work-gallery__item--sidebar-quad` | `work-gallery__media--sidebar-quad` | `.work-gallery__sidebar-quad` + `__col` |
| Two overlapping cards | `work-gallery__item--integrations-stack` | `work-gallery__media--integrations-stack` | `__integrations-stack__stage` + `__back` / `__front` |
| Tone hero + 3-column sidebar cards | `work-gallery__item--experiment-grid` | `work-gallery__media--experiment-grid` | `__experiment-grid__tone` + `__sidebar` + `__col` |
| Large native asset (e.g. MP4 frame) | `work-gallery__item--media-native` | per click-to-play, prototype embed, or img | — |
| No hairline border (keep 8px radius) | `work-gallery__item--borderless` | or `work-gallery__media--borderless` on one img | Dark / wallpaper exceptions |
| No border, no radius | `work-gallery__item--plain` | — | Floating logos |
| Process / outcome copy under hero | *(none)* | `p.work-gallery__followup` after media | Lead-column width (not breakout) |
| Two equal thumbs (~50%) | *(none)* | `work-gallery__thumbs--halves` | 2× `.work-gallery__thumb` |
| Three equal thumbs (~33%) | *(none)* | `work-gallery__thumbs--thirds` | 3× `.work-gallery__thumb` |
| Featured + secondary (~67% / ~33%) | *(none)* | `work-gallery__thumbs--wide-narrow` | 2× `.work-gallery__thumb` |

## Figure order (expanded)

1. `figcaption.work-gallery__caption` + `p.work-gallery__description` (+ optional `p.work-gallery__designers`) → wrapped into `.work-gallery__intro`
2. Hero: `<img>`, `prototypeEmbed`, click-to-play, or multi-image `.work-gallery__media`
3. Optional `p.work-gallery__followup` (one or more) — process / decision / outcome
4. Optional `div.work-gallery__thumbs` with a layout modifier — supporting screens that add something the hero does not already show

Thumbnails: swap `.work-gallery__thumb-media--placeholder` for `<img loading="lazy" …>` when artwork is ready. Captions go in `figcaption.work-gallery__thumb-caption`.

## Atmosphere backdrops (legacy)

Atmosphere radial-gradient “stages” are **visually removed** in the light redesign (backdrop `display: none`; gradient palettes deleted from CSS). Foreground media sits on a plain light card surface.

- The `workGalleryAtmosphere` transform may still inject `.work-gallery__backdrop` markup and `--atmosphere-*` classes for stable figure indexing — treat that as legacy plumbing.
- **Do not** author new figures for the visual effect of atmosphere palettes. Prefer layout modifiers + border/radius exceptions above.
- Full legacy reference (if you must touch the transform): [AGENTS.md](../../../AGENTS.md) (*Work gallery: multi-image figure backdrops*).

**Padding:** Multi-image frames use top/left/right padding tokens. `hero-secondary` uses **flush bottom** — images align to the frame’s bottom edge (`align-items: end` + zero bottom padding).

## Checklist for a new multi-image figure

1. Pick layout row from the table; copy the matching template from [reference.md](reference.md).
2. Set `width` / `height` on images; descriptive `alt`; `loading="lazy"`.
3. Add `aria-label` on the media `div` when multiple images need one summary.
4. Do not add atmosphere classes for new visual design (see legacy note above).
5. Build and check `/work/<slug>/` — spacing, bottom flush on hero-secondary, borders/radius.

## Do not

- Convert case study pages from Markdown to standalone HTML files just to host gallery HTML (HTML blocks inside Markdown are fine).
- Add npm packages or inline styles for gallery layout.
- Hardcode colors — use theme tokens.
- Rely on atmosphere backdrops for new visuals.
- Repeat the hero in the thumbnail row — thumbs should show something new (detail, other screens, process).
