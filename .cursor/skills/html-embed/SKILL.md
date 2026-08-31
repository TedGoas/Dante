---
name: html-embed
description: >-
  Work gallery large iframe HTML mocks — passthrough bundles under
  src/work/img/{case}/prototypes/{slug}/, scaled native-size embed markup,
  Click around host cue, and dante-html-embed-interacted postMessage. Use when
  adding or reusing full-artboard interactive mocks (not prototypeEmbed heroes
  or thumbPrototype thumbs).
---

# HTML embed (large iframe mock)

Use when a work case study **hero figure** should be a **live HTML/CSS/JS mock** at fixed artboard size, scaled inside the gallery breakout. Bundles stay in-repo under [`src/work/img/{case}/prototypes/{slug}/`](../../../src/work/img/) so product styles never collide with the main site.

**Canonical detail:** [AGENTS.md](../../../AGENTS.md) (*Work gallery: HTML embed prototypes*).  
**Reference implementation:** Stack Overflow dashboard — [`src/work/img/stackoverflow/prototypes/dashboard/`](../../../src/work/img/stackoverflow/prototypes/dashboard/) on [`src/work/2020-01-01-stack-overflow.md`](../../../src/work/2020-01-01-stack-overflow.md).

## When to run

- User asks to add a large interactive iframe mock to a case study (not a scroll-gated Dialpad hero or a captioned thumb)
- Reusing the “Click around” cue pattern on another figure
- Debugging cue dismissal, iframe scaling, or passthrough deploy for html-embed bundles

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
      <iframe src="/assets/img/{case}/prototypes/{slug}/" title="…" width="1100" height="1510" loading="lazy"></iframe>
    </div>
  </div>
</figure>
```

Replace `width` / `height` with the bundle artboard. Styles in [`styles.css`](../../../src/assets/css/styles.css) assume scaling from native width via container query (`100cqi / W`).

## Bundle workflow

1. Build the mock as a self-contained folder: `index.html`, local CSS/JS, `img/` assets.
2. Copy into `src/work/img/{case}/prototypes/{slug}/`.
3. Keep product colors/fonts **inside the bundle** — do not map to Dante theme tokens in the iframe.
4. Ensure [`src/.eleventyignore`](../../../src/.eleventyignore) still ignores `work/img/**` from template processing (passthrough only).
5. If the dev watcher does not copy passthrough edits to `dist/`, run `npm run build` or manually sync the bundle path under `dist/assets/img/`.

## Host-page behavior (already wired — do not duplicate)

| Piece | Location |
|-------|----------|
| Embed + cue CSS | [`src/assets/css/styles.css`](../../../src/assets/css/styles.css) — search `html-embed` |
| Cue dismiss | [`src/assets/js/work-html-embed.js`](../../../src/assets/js/work-html-embed.js) — listens for `dante-html-embed-interacted` |
| Build output | [`src/misc/work-html-embed.js.njk`](../../../src/misc/work-html-embed.js.njk) |
| Load scope | [`src/_includes/layouts/work.njk`](../../../src/_includes/layouts/work.njk) `footerScripts` |

Cue fades when: host `:hover` / `:focus-within` on `[data-html-embed]`, or host receives `is-interacted` after iframe postMessage.

## In-bundle conventions

When the mock should dismiss the host cue on first use:

```js
var hasNotifiedParent = false;

function notifyParent() {
  if (hasNotifiedParent || window.parent === window) return;
  hasNotifiedParent = true;
  window.parent.postMessage({ type: 'dante-html-embed-interacted' }, '*');
}
```

Call `notifyParent()` on first meaningful interaction (e.g. chart pointer move or keyboard focus). Fire **once** per iframe load.

Do **not** reuse Dialpad prototype message types (`dante-prototype-*`, `dante-thumb-prototype-*`) unless the host script explicitly handles them.

## Checklist (new html-embed figure)

1. Bundle at `src/work/img/{case}/prototypes/{slug}/` with fixed artboard dimensions documented.
2. Case study figure: `work-gallery__item--media-native` + markup above with matching iframe `width` / `height`.
3. Interactive JS inside bundle + `notifyParent()` if the cue should dismiss on use.
4. Build; open `/work/{slug}/`; confirm scaling, cue visible at rest, cue fades after interaction.
5. Stage only html-embed-related paths when committing (see **commit** skill).

## Do not

- Load `work-html-embed.js` on the default (non-work) layout for a one-off.
- Put the “Click around” cue inside the iframe (host Swiss red + Geist only).
- Use `prototypeEmbed` scroll-gating for these full-page mocks unless explicitly redesigning the pattern.
- Add npm dependencies to the bundle without approval.
