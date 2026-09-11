---
name: html-embed
description: >-
  Work gallery large iframe HTML mocks — passthrough bundles under
  src/work/img/{case}/prototypes/{slug}/, scaled native-size embed markup,
  Click around host cue. Use when
  adding or reusing full-artboard interactive mocks (not prototypeEmbed heroes
  or thumbPrototype thumbs).
---

# HTML embed (large iframe mock)

Use when a work case study **hero figure** should be a **live HTML/CSS/JS mock**. Bundles stay in-repo under [`src/work/img/{case}/prototypes/{slug}/`](../../../src/work/img/) so product styles never collide with the main site. Prefer a **fluid responsive layout inside the iframe** (components shrink/reflow) over CSS-scaling a fixed artboard.

**Canonical detail:** [AGENTS.md](../../../AGENTS.md) (*Work gallery: HTML embed prototypes*).  
**Reference implementation:** Stack Overflow dashboard — [`src/work/img/stackoverflow/prototypes/dashboard/`](../../../src/work/img/stackoverflow/prototypes/dashboard/) on [`src/work/2020-01-01-stack-overflow.md`](../../../src/work/2020-01-01-stack-overflow.md).

## When to run

- User asks to add a large interactive iframe mock to a case study (not a scroll-gated Dialpad hero or a captioned thumb)
- Reusing the “Click around” cue pattern on another figure
- Debugging iframe scaling or passthrough deploy for html-embed bundles

## vs other gallery iframe patterns

| | HTML embed | `prototypeEmbed` | `thumbPrototype` |
|--|------------|------------------|------------------|
| Placement | Hero `work-gallery__item--media-native` | Hero `prototypeEmbed` | `work-gallery__thumbs` |
| Load | Immediate iframe `src` | Scroll + delay + autostart | Preload; play on hover/focus |
| Cue | “Click around” on host | None | “Hover me!” on host |
| Shortcode | Raw HTML today (no shortcode yet) | `{% prototypeEmbed %}` | `{% thumbPrototype %}` |

Ask before adding a shortcode — only one production figure uses this pattern today.

## Authoring (Markdown work pages)

```html
<figure class="work-gallery__item work-gallery__item--media-native">
  <figcaption class="work-gallery__caption">…</figcaption>
  <p class="work-gallery__description">…</p>
  <div class="work-gallery__media work-gallery__media--html-embed" data-html-embed>
    <span class="html-embed__cue" aria-hidden="true">
      <span class="html-embed__cue-label">Click around</span>
      <svg class="html-embed__cue-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <polyline points="10 15 15 20 20 15"></polyline>
        <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>
      </svg>
    </span>
    <div class="html-embed__frame">
      <iframe src="/assets/img/{case}/prototypes/{slug}/" title="…" width="1266" height="1560" loading="lazy"></iframe>
    </div>
  </div>
</figure>
```

Replace `width` / `height` with sensible fallbacks. Host CSS sizes the iframe to `width: 100%`; the bundle should post `dante-html-embed-resize` with content height so the host can grow/shrink the iframe (see Stack Overflow dashboard).

## Bundle workflow

1. Build the mock as a self-contained folder: `index.html`, local CSS/JS, `img/` assets.
2. Copy into `src/work/img/{case}/prototypes/{slug}/`.
3. Keep product colors/fonts **inside the bundle** — do not map to Dante theme tokens in the iframe.
4. Ensure [`.eleventy.js`](../../../.eleventy.js) still ignores `src/work/img/**` from template processing via `config.ignores` (passthrough only; keeps `--serve` live reload working).
5. If the dev watcher does not copy passthrough edits to `dist/`, run `npm run build` or manually sync the bundle path under `dist/assets/img/`.

## Host-page behavior (already wired — do not duplicate)

| Piece | Location |
|-------|----------|
| Embed + cue CSS | [`src/assets/css/styles.css`](../../../src/assets/css/styles.css) — search `html-embed` |
| Iframe resize | [`src/assets/js/work-html-embed.js`](../../../src/assets/js/work-html-embed.js) — listens for `dante-html-embed-resize` |
| Build output | [`src/misc/work-html-embed.js.njk`](../../../src/misc/work-html-embed.js.njk) |
| Load scope | [`src/_includes/layouts/work.njk`](../../../src/_includes/layouts/work.njk) `footerScripts` |

Cue stays visible (does not fade on hover or after interaction).

## In-bundle conventions

Report content height whenever layout changes so the host iframe does not clip:

```js
window.parent.postMessage({ type: 'dante-html-embed-resize', height: Math.ceil(root.getBoundingClientRect().height) }, '*');
```

Do **not** reuse Dialpad prototype message types (`dante-prototype-*`, `dante-thumb-prototype-*`) unless the host script explicitly handles them.

## Checklist (new html-embed figure)

1. Bundle at `src/work/img/{case}/prototypes/{slug}/` with a fluid responsive layout (prefer reflow over CSS zoom).
2. Case study figure: `work-gallery__item--media-native` + markup above with fallback iframe `width` / `height`.
3. Interactive JS inside bundle; post `dante-html-embed-resize` on load/resize.
4. Build; open `/work/{slug}/`; confirm no clipping at narrow widths and cue stays visible.
5. Stage only html-embed-related paths when committing (see **commit** skill).
## Do not

- Load `work-html-embed.js` on the default (non-work) layout for a one-off.
- Put the “Click around” cue inside the iframe (host Swiss red + Geist only).
- Use `prototypeEmbed` scroll-gating for these full-page mocks unless explicitly redesigning the pattern.
- Add npm dependencies to the bundle without approval.
