---
name: component-pattern
description: >-
  11ty component structure — Nunjucks/HTML partials in _includes/components/
  with BEM classes and theme tokens; styles live in the main stylesheet (or
  themes/), not a separate css/components/ tree.
---

# Component pattern

11ty UI pieces are a Nunjucks or HTML partial in [`src/_includes/components/`](../../../src/_includes/components/) plus styles that use BEM and theme tokens. Most site CSS lives in [`src/assets/css/styles.css`](../../../src/assets/css/styles.css); tokens and theme values live in [`themes/`](../../../themes/). Do **not** add a parallel `css/components/` folder unless the user explicitly asks for that structure.

## Partial

- Uses BEM class names rooted at the component name
- Accepts data via Nunjucks macro parameters or 11ty page data
- No inline styles

## CSS

- Scoped to the component’s root BEM class (or a documented gallery modifier)
- References only CSS custom properties for colors, spacing, type, and radii
- Linked from the base layout (site stylesheet) — no per-component CSS entry point today

## Documented exceptions

- **Click-to-play video (work gallery):** Partial in `_includes/components/click-to-play-video.njk`; styles next to other `.work-gallery` rules in `styles.css`; JS only on the work layout. See **[AGENTS.md](../../../AGENTS.md)** (*Work gallery: video figures*).
- **Prototype embeds:** Partial + shortcode + work-layout JS — **[`.cursor/skills/prototype-embed/SKILL.md`](../prototype-embed/SKILL.md)**.
- **Multi-image gallery figures:** BEM layout classes in `styles.css`, authored as HTML in Markdown case studies. See **[`.cursor/skills/work-gallery-figures/SKILL.md`](../work-gallery-figures/SKILL.md)** and AGENTS.md (*Work gallery: multi-image layouts*).
