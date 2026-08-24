---
name: thumb-prototype
description: >-
  Work gallery hover/focus thumbnail prototypes — sync static bundles into
  src/work/img/{case}/prototypes/{slug}/, wire thumbPrototype shortcode, preload
  iframe resting frame, play/reset postMessage, and Hover me! cue. Use when the
  user runs /thumb-prototype, asks to replace a static thumb with a hover demo,
  or when adding, updating, or debugging interactive gallery thumbs (not scroll-gated hero embeds).
---

# Thumb prototype

Use when a work case study **captioned thumbnail** should show a **live interactive demo** on hover/focus instead of a static SVG/PNG. Bundles stay in-repo under [`src/work/img/{case}/prototypes/{slug}/`](../../../src/work/img/) so prototype CSS/JS never collides with the main site.

**Not for hero figures** — those use [`prototype-embed`](../prototype-embed/SKILL.md) (scroll gate, autostart, Replay). Thumb prototypes never scroll-autostart.

**Canonical detail:** [AGENTS.md](../../../AGENTS.md) (*Work gallery: thumbnail prototypes*).  
**Host page script:** work layout only — [`src/_includes/layouts/work.njk`](../../../src/_includes/layouts/work.njk) `footerScripts`.

## When to run

- User says `/thumb-prototype` or asks to swap a static gallery thumb for a hover/focus demo
- Adding a new slug, syncing a bundle, or debugging thumb play/reset / Hover me cue behavior

## vs hero `prototypeEmbed`

| | Thumb (`thumbPrototype`) | Hero (`prototypeEmbed`) |
|--|--------------------------|-------------------------|
| Placement | Inside `work-gallery__thumbs` | Figure hero media |
| Activation | Hover / keyboard focus | Scroll into view (~35%) + 1s delay |
| Resting art | Live iframe first frame | Separate poster SVG |
| Autostart / Replay | No | Yes (`autostart=1`, Replay button) |
| Cue | Soft-red “Hover me!” + icon (always) | None |

Static SVG/PNG thumbs do **not** get the Hover me cue — only interactive `thumbPrototype` embeds.

## Valid slugs

| Slug | Case folder |
|------|-------------|
| `quick-reply` | `dialpad` |

Adding a new slug requires updating `VALID_SLUGS` and `CASE_BY_SLUG` in [`lib/shortcodes/thumbPrototype.js`](../../../lib/shortcodes/thumbPrototype.js) (and committing the new bundle). Ask before inventing slugs.

## Authoring (Markdown work pages)

```njk
{% thumbPrototype "quick-reply", "Omnichannel quick reply demo.", 470, 400 %}
```

Args: `slug`, `title` (iframe `title`), `width`, `height`.

Place inside a captioned thumb figure under `div.work-gallery__thumbs` (see [`work-gallery-figures`](../work-gallery-figures/SKILL.md)). The “Hover me!” cue is built into [`thumb-prototype.njk`](../../../src/_includes/components/thumb-prototype.njk) — do not strip it for interactive thumbs; do not add it to static `<img>` thumbs.

## Update / sync workflow

1. Rebuild the embed bundle externally (or from a local [`.sizzle-reel/`](../../../.sizzle-reel/) checkout — gitignored, not a submodule).
2. Copy output into `src/work/img/{case}/prototypes/{slug}/` (`index.html` + hashed JS/CSS). Rewrite absolute asset URLs in `index.html` to `/assets/img/{case}/prototypes/{slug}/…`. Remove stale hashed files from a previous build for that slug.
3. Keep everything in Dante — no remote iframe `src`.
4. Commit only the changed slug folder(s) plus any shortcode wiring (see **commit** skill dirty-tree rules).

## Host-page behavior (do not reimplement ad hoc)

| Behavior | Detail |
|----------|--------|
| Preload | On page load, host sets iframe `src` from `data-src` (resting frame visible immediately) |
| Play | `pointerenter` / `focusin` → `{ type: 'dante-thumb-prototype-play' }` + `.is-active` |
| Reset | `pointerleave` / `focusout` → `{ type: 'dante-thumb-prototype-reset' }` |
| Cue | Soft Swiss red (~50% opacity), −6° tilt, Feather `corner-right-down`, above top-left; fades while `.is-active` / hover / focus-within |
| Reduced motion | Preload only; skip play/reset; show open-in-new-tab fallback link |
| Chrome | `pointer-events: none` on iframe; host `tabindex="0"`; overflow visible so the cue can hang |

Implementation map: shortcode, Nunjucks partial, markdown preprocessor, [`src/assets/js/thumb-prototype.js`](../../../src/assets/js/thumb-prototype.js), styles under `.thumb-prototype` in [`styles.css`](../../../src/assets/css/styles.css) — see AGENTS.md table.

## In-bundle demo conventions

When authoring or editing thumb bundle JS:

- Listen for `message` with `data.type === 'dante-thumb-prototype-play'` and `dante-thumb-prototype-reset` only — do **not** use hero `autostart` / `dante-prototype-replay` / `dante-prototype-demo-complete`.
- First paint must be a calm resting frame suitable as the thumbnail; reset must return there.
- Do not autoplay on iframe load; wait for host play.
- Keep demos short and scripted (cursor / UI steps), calm timing; the story should land without free clicking inside the iframe.
- Host owns hover/focus; avoid in-iframe pointer or focus behavior that fights the outer gate.
- Under `prefers-reduced-motion: reduce` inside the bundle when feasible, stay on the resting frame.

## Layout tip

When pairing with a static sibling thumb, match visual height via gallery CSS (e.g. frame `aspect-ratio`) using existing `work-gallery__thumbs--*` patterns — see [`work-gallery-figures`](../work-gallery-figures/SKILL.md). Do not invent a second layout system here.

## Checklist

1. Valid slug + case folder in shortcode maps.
2. Bundle committed under `src/work/img/{case}/prototypes/{slug}/`.
3. Shortcode on the Markdown work page with correct width/height inside a thumbs row.
4. Build; open `/work/<case-study>/`; confirm resting frame, Hover me cue, hover/focus play + reset, cue fade, reduced-motion path.
5. Stage only thumb-prototype-related paths when committing.

## Do not

- Use `prototypeEmbed` for captioned thumbs (or `thumbPrototype` for hero figures).
- Ship a separate poster SVG as the resting thumbnail — the iframe first frame is the rest state.
- Strip the Hover me cue from interactive thumbs, or add it to static images.
- Point the iframe at a remote demo host.
- Load `thumb-prototype.js` on the default (non-work) layout for a one-off figure.
- Add npm packages for thumb chrome — vanilla JS + existing CSS tokens only.
- Scoop unrelated dirty-tree files into the same commit.
