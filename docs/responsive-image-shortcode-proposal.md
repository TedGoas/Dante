# Proposal: raster `<picture>` shortcode via `@11ty/eleventy-img`

**Status:** Needs explicit npm approval before install.  
**Context:** Offline SVG/raster slimming is done; this is the optional next step for true `srcset` / format negotiation (as in [Stefan Judis’s picture snippet](https://www.stefanjudis.com/snippets/a-picture-element-to-load-correctly-resized-webp-images-in-html/)), without a Contentful-style image API.

## Why

Dante still authors most rasters as a single `<img src>`. CSS scales display size; the browser still downloads one file. A build-time shortcode can emit:

- `<picture>` with WebP (and optional AVIF) `<source>`s
- width-based `srcset` + layout-accurate `sizes`
- fallback `<img>` with `width` / `height` / `loading` / `decoding`

SVGs stay plain `<img>` — they are resolution-independent and must not go through this pipeline.

## Dependency (blocked on approval)

| Package | Role |
|---------|------|
| `@11ty/eleventy-img` | Generate resized WebP/JPEG (and optional AVIF) at build; return HTML or metadata |

`sharp` is pulled in transitively by `@11ty/eleventy-img`. That is a real native dependency and the main cost of this change (install size, Cloud Agent / CI Node compatibility). No other new packages should be added for this feature.

**Do not install until Ted approves.**

## Suggested API

Nunjucks / Markdown (after shortcode expansion, same pattern as `clickToPlayVideo`):

```njk
{% responsiveImage "/assets/img/sustainable-email/hero.jpg", "Alt text.", "(max-width: 48rem) 100vw, 42rem" %}
```

Optional args (later): CSS class, `loading` (`lazy` default; `eager` for LCP), widths override.

### Output shape (target)

```html
<picture>
  <source type="image/webp" srcset="…/hero-640.webp 640w, …/hero-1280.webp 1280w" sizes="…">
  <img
    src="…/hero-1280.jpeg"
    srcset="…/hero-640.jpeg 640w, …/hero-1280.jpeg 1280w"
    sizes="…"
    alt="…"
    width="1280"
    height="…"
    loading="lazy"
    decoding="async">
</picture>
```

Skip AVIF in v1 unless approval includes it (extra formats, longer builds).

## Implementation sketch (after approval)

1. `npm install --save-dev @11ty/eleventy-img`
2. Add [`lib/shortcodes/responsiveImage.js`](../lib/shortcodes/responsiveImage.js) — call `Image(src, { widths: [640, 960, 1280, 1600], formats: ['webp', 'jpeg'], outputDir: 'dist/assets/img/opt/', urlPath: '/assets/img/opt/' })`, return `Image.generateHTML(…)` or a Nunjucks partial.
3. Register in [`.eleventy.js`](../.eleventy.js) next to existing shortcodes.
4. Optional Markdown preprocessor (mirror [`lib/preprocessors/expandClickToPlayVideo.js`](../lib/preprocessors/expandClickToPlayVideo.js)) if figures live in Markdown shortcode calls.
5. Cache: commit nothing under `dist/`; let Eleventy rebuild optimized files each production build (or use `.cache` gitignored if the plugin’s cache is enabled).

### `sizes` defaults

| Surface | Suggested `sizes` |
|---------|-------------------|
| Blog body (`.post-body`) | `(max-width: 48rem) calc(100vw - 2rem), 42rem` (tune to real measure) |
| Work gallery breakout | `(max-width: 90rem) calc(100vw - 2rem), 1440px` |
| Bio grid | `(max-width: 40rem) 100vw, 400px` |

Hardcode per call site rather than guessing globally.

## Scope (v1)

**In:** New or edited blog/bio rasters; wallpaper JPGs passed to click-to-play / prototype embeds if those shortcodes are taught to accept optimized URLs later.  
**Out:** SVG work thumbs and gallery SVGs; prototype iframe internal assets; hand-authored Contentful-style trees in every Markdown figure.

## Migration

No big-bang rewrite. Convert figures opportunistically when editing a post or case study. Existing single-`src` WebP/JPG (already resized offline) remain valid until replaced.

## Approval checklist

- [ ] Approve adding `@11ty/eleventy-img` (and transitive `sharp`) as a **devDependency**
- [ ] Confirm formats: WebP + JPEG only (recommended) vs + AVIF
- [ ] Confirm widths: `[640, 960, 1280, 1600]` vs tighter set for faster builds
