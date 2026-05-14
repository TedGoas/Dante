# cursor.md

@import ./agents.md

---

# Project: Personal Portfolio & Blog (engineering)

This section complements **Site Build Rules & Guidelines** above. For sitemap, visual design, and workflow, see the imported doc.

## Stack (additional constraints)

- **Languages**: Native HTML and CSS — no Tailwind, no CSS-in-JS, no utility frameworks
- **JavaScript**: Only when there is no CSS alternative; keep it minimal and dependency-free
- **Deployment**: Netlify (see Technology Stack in imported doc for repo / branch notes)

## Core principles

- **Performance first**: Favor fast loads and snappy interaction; avoid render-blocking resources; lazy-load images; minimize HTTP requests
- **No unnecessary dependencies**: Before adding a third-party package, confirm it is truly needed
- **Content is provided by the human**: Do not generate placeholder copy, fake case studies, or dummy blog posts
- **Native platform features**: Prefer HTML and CSS over JavaScript; prefer browser-native behavior over polyfills

## Theming

- Design tokens (color, spacing, typography, radius, etc.) are CSS custom properties on `:root`
- The site launches with a single dark theme
- Architecture must support multiple themes and a theme switcher UI; the switcher is not shown at launch
- Theme custom properties live in a dedicated `themes/` directory, one file per theme
- Multi-theme work, frozen layout regions, and theme-picker behavior during exploration are defined in **[docs/visual-design-language.md](docs/visual-design-language.md)**

## CSS architecture

- BEM-inspired class naming (`block__element--modifier`)
- One CSS file per component or layout, imported via Eleventy’s asset pipeline or `<link>` tags
- No inline styles
- No `!important` unless unavoidable, with a comment explaining why
