# LoanCrate prototype — agent notes

Read this before working in `loancrate/`. The root [`AGENTS.md`](../AGENTS.md) still applies to repo-wide rules (ask before new deps, Ted handles commits and merges, never edit `dist/`). Its rules about the main site's stack and visual design do **not** apply here.

## Goal

- A **standalone product prototype** for a design exercise for [LoanCrate](https://www.loancrate.com/), an AI-assisted mortgage Loan Origination System. AI reviews documents on arrival, auto-processes them, and generates conditions from extracted data.
- **The exercise brief is not known yet.** For now the app is a design-system scaffold: one scrolling style-guide page. Replace or extend `App.tsx` once the brief arrives, and record the brief, problems, and assumptions here (see `sumble/AGENTS.md` for the shape).
- Ted has no product login, so the visual language comes from loancrate.com's marketing site and the product mockup on its homepage.
- It lives at **`tedgoas.com/loancrate`** and must stay **hidden**: nothing on the site links to it, it's not in the sitemap or RSS, and it's `noindex`.
- It must **not inherit anything from Dante**: no shared CSS, tokens, layouts, scripts, or Eleventy templates.

## Stack

Same as `sumble/`: Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn-style components (Radix + `class-variance-authority` + `tailwind-merge`) + `lucide-react` + **TanStack Table v9**. loancrate.com itself is stock Tailwind v4, so tokens map onto Tailwind's default palette. Package set is identical to Sumble's (approved by Ted). Adding any further dependency needs approval. Select and radio are **native** elements styled with Tailwind, so no extra Radix packages.

TanStack Table v9 has a different API from v8. Read the notes in [`sumble/AGENTS.md`](../sumble/AGENTS.md#tanstack-table-v9-important) before touching tables.

## Commands (run from repo root)

| Command | What it does |
|---------|--------------|
| `npm install` | `postinstall` also installs `sumble/` and `loancrate/` |
| `npm run start:loancrate` | Vite dev server → **http://localhost:5175/loancrate/** |
| `npm run build:loancrate` | Type-check + build into `dist/loancrate/` |
| `npm run build` | Full production build (Eleventy, Sumble, LoanCrate) |

## How it's wired (and kept hidden)

| Piece | Location |
|-------|----------|
| App root | `loancrate/` (sibling of `src/`, so Eleventy never processes it) |
| Base path + output | `vite.config.ts`: `base: '/loancrate/'`, `outDir: ../dist/loancrate`, port 5175 |
| Root scripts | `package.json`: `postinstall`, `build:loancrate`, `start:loancrate`, `build` |
| noindex | `index.html` `<meta name="robots">` + `netlify.toml` `X-Robots-Tag` for `/loancrate/*` |
| Fonts | Google Fonts link in `index.html` (Inter, Instrument Serif). The site CSP already allows `fonts.googleapis.com` / `fonts.gstatic.com`. Don't add other CDNs without updating `netlify.toml` and asking |

Never link to `/loancrate` from `src/`, and never import from `src/`, `themes/`, or `lib/`.

## Design direction (from loancrate.com, Nov 2026)

Pulled from `https://www.loancrate.com/assets/css/main.css` and inline styles on the homepage product mockup. All tokens live in `src/index.css` (`@theme`). Change colors there, not in components.

| Area | Values |
|------|--------|
| Fonts | Inter for UI and headings. h1–h4 weight 500, letter-spacing −0.03em, `ss01` + `cv11`. **Instrument Serif** (`font-display`, often italic) for display accents only. Their CSS also loads EB Garamond, which isn't used here |
| Text | Headings gray-900 `#111827`, body gray-600, meta gray-500, placeholder gray-400 |
| Surfaces | White page, gray-50 table header and footer, gray-100 hover and code |
| Borders | gray-200 dividers and inputs, gray-300 checkbox and radio |
| Primary button | `#111827` fill, white text, 36px, `rounded-xl`, `shadow-button` (`0 6px 12px #2f01970a, 0 3px 6px #2f01970f, 0 1px 2px #2f019714`) |
| Secondary button | White, `#e0d8f0` border, `#26114a` text, same shadow |
| Accent | Indigo for AI and "New" (indigo-50 / indigo-500–600). Blue-600 links, blue-500 focus |
| Status | emerald (clear), amber (warning/flag), red-600 (error/destructive) |
| Radius | lg .5rem (small controls), xl .75rem (buttons, inputs), 2xl 1rem (cards), full (badges, chips) |
| Density | App body 14px/22px (their marketing body is 17px/1.8). Table rows about 44px |

Don't copy LoanCrate's logo or imagery. The kit uses a placeholder "L" mark. All loan data is made up.

## Code map

```
loancrate/src/
  App.tsx                    Style guide: typography, buttons, forms, badges & chips, menus, data table
  index.css                  Tailwind import + @theme tokens + base heading styles + reduced motion
  lib/utils.ts               cn() = clsx + tailwind-merge
  data/loans.ts              28 seeded fake loans, stages/programs, stage → badge variant map
  components/ui/             Local kit (edit freely)
    button       default (near-black), secondary (lavender), outline, ghost, destructive, dashed, link
    badge        neutral, outline, indigo, blue, success, warning, danger; optional `dot`
    chip         toggle chip (aria-pressed) or removable applied-filter chip (`onRemove`)
    input, textarea, select (native), radio (native), checkbox (Radix)
    field        Field (label + control + hint/error) and Label
    card, dropdown-menu, popover, tooltip, icon-button, table
  components/data-table/     Generic TanStack v9 table (copied from sumble/)
  features/pipeline/         Loan pipeline table: columns + toolbar (search, Stage/Program facets, bulk)
```

## Conventions

- Icon-only buttons use `IconButton` (its required `label` becomes the `aria-label` and the tooltip).
- Row checkboxes use `onClick={row.getToggleSelectedHandler()}` so shift-click range selection works.
- Form controls: give `Field` the control's `id` as `htmlFor`. Controls with hint or error text set `aria-describedby="{id}-hint"`, and controls in an error state set `aria-invalid`.
- One `default` (near-black) button per view. Use `secondary` for the rest.
