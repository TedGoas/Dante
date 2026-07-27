---
name: prototype-embed
description: >-
  Work gallery interactive prototypes — sync static bundles into
  src/assets/work/prototypes/{slug}/, wire prototypeEmbed shortcode, scroll-gated
  iframe activation, autostart demos, and Replay postMessage. Use when adding,
  updating, or debugging Dialpad prototype embeds on case study pages.
---

# Prototype embed

Use when a work case study figure should show a **live interactive prototype** (iframe) instead of a click-to-play video. Bundles stay in-repo under [`src/assets/work/prototypes/{slug}/`](../../../src/assets/work/prototypes/) so prototype CSS/JS never collides with the main site and Netlify does not depend on remote github.io iframes.

**Canonical detail:** [AGENTS.md](../../../AGENTS.md) (*Work gallery: interactive prototypes*).  
**Host page script:** work layout only — [`src/_includes/layouts/work.njk`](../../../src/_includes/layouts/work.njk) `footerScripts`.

## Valid slugs

| Slug | Poster (auto) |
|------|----------------|
| `analytics-gpt` | `/assets/work/dialpad-team-analyticsgpt.svg` |
| `launchpad` | `/assets/work/dialpad-team-launchpad.svg` |
| `ai-chatbot` | `/assets/work/dialpad-team-chatbot.svg` |
| `scorecards` | `/assets/work/dialpad-ic-scorecards.svg` |

Adding a new slug requires updating `VALID_SLUGS` and `POSTER_BY_SLUG` in [`lib/shortcodes/prototypeEmbed.js`](../../../lib/shortcodes/prototypeEmbed.js) (and committing the new bundle). Ask before inventing a fifth slug.

## Authoring (Markdown work pages)

```njk
{% prototypeEmbed "analytics-gpt", "Dialpad AnalyticsGPT design.", 1440, 900 %}
{% prototypeEmbed "ai-chatbot", "Dialpad chatbot design.", 384, 600, "/assets/work/dialpad-team-chatbot-bg.jpg" %}
```

Args: `slug`, `title` (iframe `title`), `width`, `height`, optional `background` image path (same wallpaper pattern as click-to-play). Do not pass an empty string before a background path — Eleventy drops empty shortcode args.

Wrap the figure with `work-gallery__item--media-native` when the embed should sit at native width (see work-gallery-figures).

## Update / sync workflow

1. Rebuild the embed bundle externally (or from a local [`.sizzle-reel/`](../../../.sizzle-reel/) checkout — gitignored, not a submodule).
2. Copy output into `src/assets/work/prototypes/{slug}/` (`index.html` + hashed JS/CSS under `assets/`). Remove stale hashed files from a previous build for that slug.
3. Keep everything in Dante — no remote iframe `src` to github.io or other hosts.
4. Commit only the changed slug folder(s) plus any shortcode/poster wiring (see **commit** skill dirty-tree rules).

## Host-page behavior (do not reimplement ad hoc)

| Behavior | Detail |
|----------|--------|
| Scroll gate | ~35% visible, then **1s** delay before `data-src` → `src?autostart=1` |
| Cancel | Scrolling away before the delay clears the timer |
| Replay | Iframe posts `{ type: 'dante-prototype-demo-complete' }` → centered Replay button; click sends `{ type: 'dante-prototype-replay' }` via `postMessage` (no iframe reload) |
| Reduced motion | Skip activation JS; static poster + link to open prototype in a new tab |

Implementation map: shortcode, Nunjucks partial, markdown preprocessor, [`src/assets/js/prototype-embed.js`](../../../src/assets/js/prototype-embed.js), styles under `.prototype-embed` in `styles.css` — see AGENTS.md table.

## In-bundle demo conventions

When editing prototype bundle JS (cursor autoplay, multi-screen sequences):

- Honor `?autostart=1` (and ignore autoplay under reduced motion inside the iframe when feasible).
- On demo finish, `parent.postMessage({ type: 'dante-prototype-demo-complete' }, '*')`.
- Listen for `message` with `data.type === 'dante-prototype-replay'` and restart the sequence without a full navigation.
- Prefer scripted cursor: hover → click → pause → next screen; keep timing calm, not noisy.

## Checklist

1. Valid slug + matching poster path in shortcode map.
2. Bundle committed under `src/assets/work/prototypes/{slug}/`.
3. Shortcode on the Markdown work page with correct width/height (and background if needed).
4. Build; open `/work/<case-study>/`; scroll into view; confirm autostart, demo complete → Replay, reduced-motion poster path.
5. Stage only prototype-related paths when committing.

## Do not

- Point the iframe at a remote demo host.
- Load `prototype-embed.js` on the default (non-work) layout for a one-off figure.
- Add npm packages for embed chrome — vanilla JS + existing CSS tokens only.
- Scoop unrelated dirty-tree files into the same commit.
