# Site Build Rules & Guidelines

## 1. Background

### Project Overview
- **Purpose**: Personal website for Ted Goas - product designer, researcher, and front-end developer
- **Content**: Background, skills overview, work case studies, blog, newsletter hub
- **Current Site**: https://www.tedgoas.com/
- **Current Repo**: https://github.com/TedGoas/Dante

### The Golden Rule
**When unsure about implementation details, ALWAYS ask first before making changes.**

## 2. Sitemap Structure

### Core Pages
1. **Homepage** - Landing page with overview
2. **Work** - Case studies and portfolio
3. **Bio** - Background and about information
4. **Blog** - Articles and posts
5. **Newsletter** - Newsletter hub/subscription
6. **Values** - Personal values and principles
7. **Labs** - Experimental projects and experiments
8. **RSS** - Feed for blog posts

## 3. Visual Design Guidelines

Canonical constraints for typography roles, color directions, frozen homepage regions, theme experiments, and reference aesthetics live in **[docs/visual-design-language.md](docs/visual-design-language.md)**. Follow that document for any visual or theme work so experiments stay within agreed guardrails.

### Logo
- Reuse the current logo from the existing site

### Typography
- **Three roles** (structure locked): **Redaction** for display/headings, **Instrument Sans** for body, **Atkinson Hyperlegible Mono** for captions, metadata, labels, navigation, and footer — see the linked doc for full rules.
- **Inspiration**: Typography from https://linear.app/change

### Components
- **Buttons**: Subtle styling, avoid high-contrast solid backgrounds
- **General**: Clean, minimal approach

### Colors
- **Default launch**: Warm brown-black canvas with amber accent (see [`themes/theme.css`](themes/theme.css)).
- **Inspiration**: Visual design of https://www.adaline.ai/

## 4. Technology Stack

### Framework
- **Static Site Generator**: 11ty (Eleventy)

### CSS Approach
- **Method**: Custom CSS with variables (no Tailwind import)
- **Variables**: Create CSS variables for colors, typography, and spacing
- **Inspiration**: Use Tailwind concepts but implement locally
- **Scope**: All CSS variables and classes should be local

### HTML Standards
- **Semantic HTML**: Use `<nav>`, `<article>`, and other semantic elements
- **Structure**: Minimize unnecessary nested `<div>` elements
- **Attributed quotes**: In Markdown, optional pattern for this site: finish the quoted line with a dash and a Markdown citation link—for example `- [Author Name](https://example.com/source)`—and Eleventy will move that link into `<footer>...</footer>` automatically (hyphen or en-dash before the `[` matches). Alternatively, use raw HTML `<footer>...</footer>` or `<cite>...</cite>` after the quoted `<p>` for explicit control or non-link attributions.

### Dependencies
- **Philosophy**: Keep npm installs minimal
- **Goal**: Easy local environment setup
- **Rule**: No new dependencies without explicit approval

### Deployment
- **Repository**: Public GitHub repo
- **Deployment**: Netlify — automatic deploys from the connected production branch (e.g. `master`)
- **Commits**: Handled by Ted (no automatic commits)

### RSS
- **Requirement**: Include RSS feed for all blog posts

### Work gallery: video figures (click-to-play)

Use this pattern when a work case study figure should show a **static poster** first and **lazy-load** an MP4 on demand. Native browser `<video>` controls appear after the first play; audio stays **muted**.

**Authoring (Markdown work pages):**

```njk
{% clickToPlayVideo "/path/to/poster.svg", "/path/to/video.mp4", "Descriptive alt text.", WIDTH, HEIGHT %}
```

Optional sixth argument: either a CSS `object-view-box` for the poster when the SVG export includes extra canvas (e.g. Launchpad: `"xywh(92px 8px 1440px 900px)"`), or a background image path (e.g. `.jpg`). Do not pass an empty string before a background path — Eleventy drops empty shortcode args.

When the sixth argument is a background image, the frame is **1440px max width** and **tall enough for 32px padding + `HEIGHT` + 32px padding** (derived from the overlay dimensions, not the wallpaper file size). The JPG fills the frame (`object-fit: cover`). The poster SVG still shows centered on top as the pre-play preview, with a visible play affordance over it; the video stays at native `WIDTH` × `HEIGHT` with `--radius-click-to-play` corners until play.

Poster and video should match the same artboard dimensions (`WIDTH` × `HEIGHT` in pixels) for the overlay.

**Implementation map:**

| Piece | Location |
|-------|----------|
| Shortcode | [`lib/shortcodes/clickToPlayVideo.js`](lib/shortcodes/clickToPlayVideo.js) |
| Markup partial | [`src/_includes/components/click-to-play-video.njk`](src/_includes/components/click-to-play-video.njk) |
| Shortcode expansion before Markdown | [`lib/preprocessors/expandClickToPlayVideo.js`](lib/preprocessors/expandClickToPlayVideo.js) (wired in [`.eleventy.js`](.eleventy.js) on the markdown library) |
| DOM for gallery figures | [`lib/transforms/workGalleryDivider.js`](lib/transforms/workGalleryDivider.js) — keeps media outside `.work-gallery__intro` |
| Script (vanilla, deferred) | [`src/assets/js/click-to-play-video.js`](src/assets/js/click-to-play-video.js) via [`src/misc/click-to-play.js.njk`](src/misc/click-to-play.js.njk) |
| Script load scope | [`src/_includes/layouts/work.njk`](src/_includes/layouts/work.njk) `footerScripts` only (not site-wide) |
| Gallery breakout + component styles | [`src/assets/css/styles.css`](src/assets/css/styles.css) (`.click-to-play` / `.writing .work-gallery__item > .work-gallery__media.click-to-play`) |
| Corner radius token (16px) | [`themes/tokens-base.css`](themes/tokens-base.css) `--radius-click-to-play` |

**UX notes:** Hover or keyboard focus on the wallpaper reveals a centered play affordance; `prefers-reduced-motion: reduce` shows the poster only (no video or start control). Do not widen `.work-body` or load this script on the default layout for a single figure.

### Work gallery: multi-image layouts

Reusable BEM layouts for case study figures with more than one asset. Styles live in [`src/assets/css/styles.css`](src/assets/css/styles.css) (search `Reusable figure pattern`). Copy-paste HTML: [`.cursor/skills/work-gallery-figures/reference.md`](.cursor/skills/work-gallery-figures/reference.md). Agent skill: [`.cursor/skills/work-gallery-figures/SKILL.md`](.cursor/skills/work-gallery-figures/SKILL.md).

| Figure modifier | Media modifier | Purpose |
|-----------------|----------------|---------|
| `work-gallery__item--hero-secondary` | `work-gallery__media--hero-secondary` | Grid: large main + smaller secondary, bottom-aligned |
| `work-gallery__item--email-duo` | *(with hero-secondary)* | Wider email columns (680px / 400px) |
| `work-gallery__item--canfield-duo` | *(with hero-secondary)* | Email + tall mobile (640px / 768px) |
| `work-gallery__item--sidebar-quad` | `work-gallery__media--sidebar-quad` | Four images in two columns |
| `work-gallery__item--integrations-stack` | `work-gallery__media--integrations-stack` | Overlapping back/front cards on a fixed stage |
| `work-gallery__item--media-native` | click-to-play or large native asset | Centered native width |
| `work-gallery__item--media-radius-lg` | single `img` | Larger corner radius |

Image classes inside hero-secondary: `work-gallery__media-main`, `work-gallery__media-secondary`. Integrations stack: `work-gallery__integrations-stack__stage`, `__back`, `__front`. Sidebar quad: `work-gallery__sidebar-quad`, `__col`.

**Padding:** Hero-secondary frames are **flush at the bottom** (no bottom padding; top and sides use `--work-gallery-atmosphere-frame-padding` with backdrop, or `--space-work-gallery-card-padding` without).

### Work gallery: multi-image figure backdrops

CSS atmosphere backdrops on multi-image gallery frames (`hero-secondary`, `sidebar-quad`, `integrations-stack`). Foreground UI stays sharp; layered radial gradients mimic soft photographic light — no image assets.

**Automatic assignment:** The `workGalleryAtmosphere` transform ([`lib/transforms/workGalleryAtmosphere.js`](lib/transforms/workGalleryAtmosphere.js)) runs on work pages after `workGalleryDivider`. It injects backdrop markup and picks one of three palettes per figure using a stable hash of page slug + figure index (same result every build).

**Production palettes:**

| Modifier | Feel |
|----------|------|
| `work-gallery__media--atmosphere-warm-light` | Bright window glow |
| `work-gallery__media--atmosphere-amber-dusk` | Accent amber light pools |
| `work-gallery__media--atmosphere-cool-dark` | Deep night blue-grey |

**Manual override:** Add `work-gallery__media--has-backdrop`, your chosen `--atmosphere-*` class, and `<div class="work-gallery__backdrop" aria-hidden="true"></div>` in the case study HTML; the transform skips injecting markup but **still advances the figure index** so auto-assigned siblings keep stable palettes.

```html
<div class="work-gallery__media work-gallery__media--sidebar-quad work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-warm-light">
  <div class="work-gallery__backdrop" aria-hidden="true"></div>
  <div class="work-gallery__sidebar-quad">…panels…</div>
</div>
```

Each palette sets `--work-gallery-atmosphere-*` custom properties (base, glow-a, glow-b, vignette, wash). Add new palettes by defining those variables on a new `--atmosphere-*` modifier in [`src/assets/css/styles.css`](src/assets/css/styles.css).

**Implementation map:**

| Piece | Location |
|-------|----------|
| Atmosphere styles | [`src/assets/css/styles.css`](src/assets/css/styles.css) (`.work-gallery__media--has-backdrop`, `--backdrop-atmosphere`, `--atmosphere-*`) |
| Cool palette tokens | [`themes/theme.css`](themes/theme.css) |
| Build transform | [`lib/transforms/workGalleryAtmosphere.js`](lib/transforms/workGalleryAtmosphere.js) (wired in [`.eleventy.js`](.eleventy.js) after `workGalleryDivider`) |

## 5. What NOT to Do

### Dependencies
- ❌ Introduce new dependencies without asking first
- ❌ Add unnecessary npm packages

### Code Style
- ❌ Over-engineer with excessive div nesting
- ❌ Import full Tailwind CSS framework
- ❌ Use non-semantic HTML where semantic alternatives exist

## 6. Development Workflow

### Before Writing Code
1. Review and approve this rules file
2. Discuss remaining design and technical decisions
3. Clarify any ambiguous requirements
4. Get explicit approval for any deviations from these guidelines

### Communication
- Always ask before making changes when uncertain
- Discuss implementation approaches before coding
- Get approval for any new dependencies or major changes

## Design Context

For visual or UX work, read these before changing UI (Impeccable / agent design flows):

- **[PRODUCT.md](PRODUCT.md)** — Register (`brand`), users (hiring managers), personality, anti-references, strategic principles
- **[DESIGN.md](DESIGN.md)** — Tokens, typography, components, named rules (north star: *The Editorial Lab*)
- **[.impeccable/design.json](.impeccable/design.json)** — Machine-readable sidecar (ramps, component snippets) for live design tooling

`docs/visual-design-language.md` remains the guardrail doc for frozen homepage regions and theme experiments. Re-run `/impeccable document` after major palette or component changes.

---

*This document should be reviewed and updated as needed throughout the project.* 