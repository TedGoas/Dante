# Work gallery figure templates

Paste into a case study `<section class="work-gallery">`. Replace caption, description, paths, dimensions, and `aria-label` text.

## Single image (default)

```html
<figure class="work-gallery__item">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <img src="/assets/work/example.svg" alt="Descriptive alt." loading="lazy">
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
    <img class="work-gallery__media-main" src="/assets/work/main.webp" alt="Main view." width="620" height="780" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/work/secondary.webp" alt="Secondary view." width="320" height="780" loading="lazy">
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
    <img class="work-gallery__media-main" src="/assets/work/email-a.svg" alt="First email." width="680" height="808" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/work/email-b.svg" alt="Second email." width="400" height="1062" loading="lazy">
  </div>
</figure>
```

## Canfield duo — email + mobile app

```html
<figure class="work-gallery__item work-gallery__item--hero-secondary work-gallery__item--canfield-duo">
  <figcaption class="work-gallery__caption">Caption</figcaption>
  <p class="work-gallery__description">Description.</p>
  <div class="work-gallery__media work-gallery__media--hero-secondary" aria-label="Email and mobile app.">
    <img class="work-gallery__media-main" src="/assets/work/email.png" alt="Email design." width="1280" height="2000" loading="lazy">
    <img class="work-gallery__media-secondary" src="/assets/work/app.jpg" alt="Mobile app." width="1536" height="2048" loading="lazy">
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
        <img src="/assets/work/panel-a.svg" alt="Panel A." loading="lazy">
        <img src="/assets/work/panel-b.svg" alt="Panel B." loading="lazy">
      </div>
      <div class="work-gallery__sidebar-quad__col">
        <img src="/assets/work/panel-c.svg" alt="Panel C." loading="lazy">
        <img src="/assets/work/panel-d.svg" alt="Panel D." loading="lazy">
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
      <img class="work-gallery__integrations-stack__back" src="/assets/work/back.svg" alt="Back card." width="678" height="425" loading="lazy">
      <img class="work-gallery__integrations-stack__front" src="/assets/work/front.svg" alt="Front card." width="678" height="412" loading="lazy">
    </div>
  </div>
</figure>
```

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
| `--work-gallery-media-max-inline-size` | Gallery breakout max (90rem) |
