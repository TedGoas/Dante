# Work gallery figure templates

Paste into a case study `<section class="work-gallery">`. Replace caption, description, paths, dimensions, and `aria-label` text.

## Single image (default)

```html
<figure class="work-gallery__item">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <img src="/assets/img/example/example.svg" alt="Descriptive alt." loading="lazy">
</figure>
```

## Hero secondary — desktop + mobile (Dialpad “Live charts”)

Flush bottom. Manual warm-light backdrop shown; omit backdrop classes for auto-assign.

```html
<figure class="work-gallery__item work-gallery__item--hero-secondary">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--hero-secondary work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-warm-light" aria-label="Summary of both images.">
    <div class="work-gallery__backdrop" aria-hidden="true"></div>
    <img class="work-gallery__media-main" src="/assets/img/example/main.webp" alt="Main view." width="620" height="780" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/img/example/secondary.webp" alt="Secondary view." width="320" height="780" loading="lazy">
  </div>
</figure>
```

## Email duo — two emails (Stack Overflow “From product to promotion”)

Add `work-gallery__item--email-duo` for wider columns.

```html
<figure class="work-gallery__item work-gallery__item--hero-secondary work-gallery__item--email-duo">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--hero-secondary work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-amber-dusk" aria-label="Summary of both emails.">
    <div class="work-gallery__backdrop" aria-hidden="true"></div>
    <img class="work-gallery__media-main" src="/assets/img/example/email-a.svg" alt="First email." width="680" height="808" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/img/example/email-b.svg" alt="Second email." width="400" height="1062" loading="lazy">
  </div>
</figure>
```

## Canfield duo — email + mobile app

```html
<figure class="work-gallery__item work-gallery__item--hero-secondary work-gallery__item--canfield-duo">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--hero-secondary" aria-label="Email and mobile app.">
    <img class="work-gallery__media-main" src="/assets/img/example/email.png" alt="Email design." width="1280" height="2000" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/img/example/app.jpg" alt="Mobile app." width="1536" height="2048" loading="lazy">
  </div>
</figure>
```

## Sidebar quad — four panels (Dialpad “Raising the floor”)

```html
<figure class="work-gallery__item work-gallery__item--sidebar-quad">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--sidebar-quad work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-cool-dark" aria-label="Four sidebar panels.">
    <div class="work-gallery__backdrop" aria-hidden="true"></div>
    <div class="work-gallery__sidebar-quad">
      <div class="work-gallery__sidebar-quad__col">
        <img src="/assets/img/example/panel-a.svg" alt="Panel A." loading="lazy">
        <img src="/assets/img/example/panel-b.svg" alt="Panel B." loading="lazy">
      </div>
      <div class="work-gallery__sidebar-quad__col">
        <img src="/assets/img/example/panel-c.svg" alt="Panel C." loading="lazy">
        <img src="/assets/img/example/panel-d.svg" alt="Panel D." loading="lazy">
      </div>
    </div>
  </div>
</figure>
```

## Integrations stack — overlapping cards (Stack Overflow “Playing well with others”)

Stage aspect ratio 1151×450; back top-left, front bottom-right.

```html
<figure class="work-gallery__item work-gallery__item--integrations-stack">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--integrations-stack work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-cool-dark" aria-label="Integration previews.">
    <div class="work-gallery__backdrop" aria-hidden="true"></div>
    <div class="work-gallery__integrations-stack__stage">
      <img class="work-gallery__integrations-stack__back" src="/assets/img/example/back.svg" alt="Back card." width="678" height="425" loading="lazy">
      <img class="work-gallery__integrations-stack__front" src="/assets/img/example/front.svg" alt="Front card." width="678" height="412" loading="lazy">
    </div>
  </div>
</figure>
```

## Experiment grid — tone hero + 3-column sidebar (Stack Overflow “Side projects, serious ideas”)

Tone centered above a 3-column grid (2 / 3 / 2 cards). Columns vertically centered. Card order matches Figma `8125:80684`.

```html
<figure class="work-gallery__item work-gallery__item--experiment-grid">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--experiment-grid work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-warm-light" aria-label="Tone assistant and sidebar notification concepts.">
    <div class="work-gallery__backdrop" aria-hidden="true"></div>
    <img class="work-gallery__experiment-grid__tone" src="/assets/img/example/tone.svg" alt="Tone assistant exploration." width="791" height="710" loading="lazy">
    <div class="work-gallery__experiment-grid__sidebar">
      <div class="work-gallery__experiment-grid__col">
        <img src="/assets/img/example/sidebar-a.svg" alt="Sidebar card A." width="300" height="99" loading="lazy">
        <img src="/assets/img/example/sidebar-b.svg" alt="Sidebar card B." width="300" height="113" loading="lazy">
      </div>
      <div class="work-gallery__experiment-grid__col">
        <img src="/assets/img/example/sidebar-c.svg" alt="Sidebar card C." width="300" height="89" loading="lazy">
        <img src="/assets/img/example/sidebar-d.svg" alt="Sidebar card D." width="300" height="120" loading="lazy">
        <img src="/assets/img/example/sidebar-e.svg" alt="Sidebar card E." width="300" height="115" loading="lazy">
      </div>
      <div class="work-gallery__experiment-grid__col">
        <img src="/assets/img/example/sidebar-f.svg" alt="Sidebar card F." width="300" height="101" loading="lazy">
        <img src="/assets/img/example/sidebar-g.svg" alt="Sidebar card G." width="300" height="99" loading="lazy">
      </div>
    </div>
  </div>
</figure>
```

## Follow-up copy + thumbnail grid (after hero)

Hook stays above the hero; process / outcome copy and supporting thumbs go below. Follow-up stays in the lead column; thumbs use the media breakout width.

### With real images (thirds example)

```html
<figure class="work-gallery__item">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Short hook above the hero.</p>
  <img src="/assets/img/example/hero.webp" alt="Hero." loading="lazy">
  <p class="work-gallery__followup">Process or outcome paragraph under the hero.</p>
  <div class="work-gallery__thumbs work-gallery__thumbs--thirds">
    <figure class="work-gallery__thumb">
      <img src="/assets/img/example/thumb-a.webp" alt="Thumb A." loading="lazy">
      <figcaption class="work-gallery__thumb-caption">Caption A.</figcaption>
    </figure>
    <figure class="work-gallery__thumb">
      <img src="/assets/img/example/thumb-b.webp" alt="Thumb B." loading="lazy">
      <figcaption class="work-gallery__thumb-caption">Caption B.</figcaption>
    </figure>
    <figure class="work-gallery__thumb">
      <img src="/assets/img/example/thumb-c.webp" alt="Thumb C." loading="lazy">
      <figcaption class="work-gallery__thumb-caption">Caption C.</figcaption>
    </figure>
  </div>
</figure>
```

### Placeholder artwork (until assets arrive)

```html
<div class="work-gallery__thumbs work-gallery__thumbs--halves">
  <figure class="work-gallery__thumb">
    <div class="work-gallery__thumb-media work-gallery__thumb-media--placeholder" aria-hidden="true"></div>
    <figcaption class="work-gallery__thumb-caption">Placeholder caption</figcaption>
  </figure>
  <figure class="work-gallery__thumb">
    <div class="work-gallery__thumb-media work-gallery__thumb-media--placeholder" aria-hidden="true"></div>
    <figcaption class="work-gallery__thumb-caption">Placeholder caption</figcaption>
  </figure>
</div>
```

### Inset asset (odd aspect, sibling-matched frame)

Use when a thumb asset is narrower/taller than siblings and should sit in a shared frame at intrinsic size — centered horizontally, bottom-aligned with inset padding (e.g. chatbot response / feedback next to a full-bleed attachment thumb).

```html
<figure class="work-gallery__thumb">
  <div class="work-gallery__thumb-media work-gallery__thumb-media--inset">
    <img src="/assets/img/example/inset.svg" alt="Inset asset." loading="lazy">
  </div>
  <figcaption class="work-gallery__thumb-caption">Caption.</figcaption>
</figure>
```

### Inset card (short asset, padded in matte)

Use when a short/wide asset should fill the content width inside a sibling-matched matte (e.g. Scorecards unclear-term next to a taller weekly report). Add `--inset-card` on top of `--inset`: centered, padded, white surface, drop-shadow.

```html
<figure class="work-gallery__thumb">
  <div class="work-gallery__thumb-media work-gallery__thumb-media--inset work-gallery__thumb-media--inset-card">
    <img src="/assets/img/example/short-card.svg" alt="Short card." loading="lazy">
  </div>
  <figcaption class="work-gallery__thumb-caption">Caption.</figcaption>
</figure>
```

### Layout modifiers

| Class | Columns |
|-------|---------|
| `work-gallery__thumbs--halves` | `1fr 1fr` (~50% / ~50%) |
| `work-gallery__thumbs--thirds` | `1fr 1fr 1fr` (~33% each) |
| `work-gallery__thumbs--wide-narrow` | `2fr 1fr` (~67% / ~33%) |

Stacks to one column below 640px.

| Media class | Role |
|-------------|------|
| `work-gallery__thumb-media--placeholder` | Gray empty frame |
| `work-gallery__thumb-media--inset` | Sibling-ratio frame; image centered, bottom-padded |
| `work-gallery__thumb-media--inset-card` | With `--inset`: full-width padded card in matte (705/400 default) |
## Atmosphere palettes

| Class | Use when |
|-------|----------|
| `work-gallery__media--atmosphere-warm-light` | Bright, neutral glow |
| `work-gallery__media--atmosphere-amber-dusk` | Warmer accent pools (pairs well with cool-dark below) |
| `work-gallery__media--atmosphere-cool-dark` | Deep blue-grey night |

New palette: duplicate an existing `--atmosphere-*` block in `styles.css` and set `--work-gallery-atmosphere-*` variables; add the modifier name to `PALETTES` in `workGalleryAtmosphere.js` only if it should participate in auto-assign.

## CSS tokens (styles.css :root)

| Token | Role |
|-------|------|
| `--work-gallery-atmosphere-frame-padding` | Backdrop inset (hero-secondary: not bottom) |
| `--space-work-gallery-card-padding` | Non-backdrop hero-secondary inset |
| `--work-gallery-email-media-gap` | Grid gap between main/secondary |
| `--work-gallery-sidebar-quad-gap` | Gap in quad layout |
| `--work-gallery-thumbs-gap` | Gap in captioned thumbnail grids |
| `--work-gallery-thumb-inset-aspect-ratio` | Sibling-matched frame for `--inset` thumbs (470 / 400) |
| `--work-gallery-thumb-inset-padding` | Bottom padding inside `--inset` frames |
| `--work-gallery-thumb-inset-card-aspect-ratio` | Sibling-matched frame for `--inset-card` (705 / 400) |
| `--work-gallery-thumb-inset-card-padding` | Uniform padding inside `--inset-card` frames |
| `--work-gallery-experiment-grid-gap` | Gap between sidebar columns and cards |
| `--work-gallery-experiment-tone-gap` | Gap between tone hero and sidebar grid (3× grid gap) |
| `--work-gallery-experiment-tone-max-width` | Tone hero max width (791px) |
| `--work-gallery-experiment-sidebar-column-width` | Sidebar card column width (300px) |
| `--work-gallery-media-max-inline-size` | Gallery breakout max (90rem) |
