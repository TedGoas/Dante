# Sumble prototype — agent notes

Read this before working in `sumble/`. It is the handoff doc for Cursor, Claude Code, or any other agent picking this back up. The root [`AGENTS.md`](../AGENTS.md) still applies for repo-wide rules (ask before new deps, Ted handles merges, never edit `dist/`), **except** the rules about the main site's stack and visual design, which do **not** apply here.

## Goal

- Build a **standalone product prototype** that looks and feels like [sumble.com](https://sumble.com/) (account and people intelligence for go-to-market teams).
- **The prototype's actual purpose and flow are not defined yet.** The Sumble app is form- and table-heavy, so we started with a reusable data table and component kit to build around.
- It lives at **`tedgoas.com/sumble`** and must stay **hidden**: nothing on the site links to it, it's not in the sitemap or RSS, and it's `noindex`.
- It must **not inherit anything from Dante** (the main site): no shared CSS, tokens, fonts, layouts, scripts or Eleventy templates. Treat it as a separate app that happens to deploy alongside the site.

## Status (as of 2026-11-04)

- Branch: `sumble` (off `main`). First commit: `14d7e92 feat(sumble): add unlinked prototype with accounts data table`. Not pushed or merged yet.
- What exists: an app shell (top nav, breadcrumb, page title, tabs) around an **Accounts** data table using fake data.
- Verified: type-check passes, production build passes, the page renders correctly in a headless Chrome screenshot, and no Eleventy output references `sumble`.
- **Not yet verified by clicking:** sorting, filters, selection, menus, tooltips. The Chrome extension wasn't connected, so do this first next session.
- **Not yet done:** inspecting the logged-in Sumble app (read-only, in Ted's Chrome) to tune table and filter styling. So far the design only reflects the public marketing site.

## Precedent

This follows the **WorkOS** prototype pattern (PR #212, removed in PR #215). That was also a top-level Vite + React + Tailwind + shadcn app built into `dist/<name>/`. To see how it was wired: `git show 7eeee62 --stat` (the removal commit) and `git show 7eeee62^:workos/<path>`.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn-style components (Radix primitives + `class-variance-authority` + `tailwind-merge`) + `lucide-react` icons + **TanStack Table v9**.

Ted approved this stack for the prototype, overriding the root rule of "vanilla only, no React/Tailwind" **for `sumble/` only**. Adding further npm dependencies still needs his approval.

### TanStack Table v9 (important)

v9 has a **different API from v8**, and most online examples (including shadcn's "data-table" docs) are v8. Don't copy v8 code. Key differences:

- Use `useTable` (not `useReactTable`) and an explicit **feature registry** from `tableFeatures({...})`. Ours is `dataTableFeatures` in `src/components/data-table/features.ts`.
- Row models, `sortFns` and `filterFns` are registered **in the feature registry**, not as table options. Columns refer to them by string name (`sortFn: 'basic'`, `filterFn: 'inSet'`).
- Read render state from `table.state` (e.g. `table.state.pagination`). Render cells with `<table.FlexRender cell={cell} />`.
- Column helper: `createColumnHelper<DataTableFeatures, Account>()`. Wrap the column array in `helper.columns([...])`.
- Helpers that take a `Header` or `Column` must be generic over `TValue` (see `SortableHeader` / `FacetedFilter`), or TypeScript reports "two different types with this name exist".
- Authoritative docs ship inside the package: `sumble/node_modules/@tanstack/react-table/skills/` and `sumble/node_modules/@tanstack/table-core/skills/` (getting-started, table-features/references/*.md, table-state). Read those, not the web.

## Commands

Run from the repo root:

| Command | What it does |
|---------|--------------|
| `npm install` | Installs the site; `postinstall` also runs `npm install --prefix sumble` |
| `npm run start:sumble` | Vite dev server with hot reload → **http://localhost:5174/sumble/** |
| `npm run build:sumble` | Type-checks (`tsc -b`) and builds into `dist/sumble/` |
| `npm run build` | Full production build: Eleventy, then `build:sumble` (what Netlify runs) |

- `npm start` (Eleventy on :8080) does **not** start the Sumble dev server. http://localhost:8080/sumble/ only shows the **last** `build:sumble` output and doesn't hot-reload. Use :5174 while iterating.
- If `npm run build` fails with `ENOTEMPTY` in `rimraf dist`, an `npm start` server is probably writing to `dist/`. Don't kill Ted's server. Run `npm run build:sumble` on its own instead.
- No lint or tests. Check with `npm run build:sumble` (type-check + build), then look at the page in a browser.

## How it's wired (and kept hidden)

| Piece | Location |
|-------|----------|
| App root | `sumble/` (sibling of `src/`, so Eleventy never processes it) |
| Base path + output | `sumble/vite.config.ts`: `base: '/sumble/'`, `outDir: ../dist/sumble`, port 5174 |
| Root scripts | `package.json`: `postinstall`, `build:sumble`, `start:sumble`, `build` |
| noindex | `sumble/index.html` `<meta name="robots">` + `netlify.toml` `X-Robots-Tag` for `/sumble/*` |
| CSP | The site CSP allows same-origin scripts/styles only (plus Google Fonts). **Don't add CDN scripts, external fonts, or third-party APIs** without updating `netlify.toml`, and asking first |

Never add a link to `/sumble` anywhere in `src/`, and never import from `src/`, `themes/`, or `lib/` into `sumble/`.

## Design direction (from inspecting sumble.com)

Sumble has no public design system to install, but their marketing site uses **stock Tailwind v4** (built CSS header: `tailwindcss v4.3.3`), so matching them is mostly using Tailwind defaults.

- **Neutrals:** Tailwind `slate`. Text slate-800/900, secondary text slate-500, borders slate-200, subtle surfaces slate-50. Page background `#fefefe`.
- **Accent:** Tailwind `green`. Primary button green-700, link hover green-700, pills green-100 bg / green-950 text.
- **Type:** the system UI font stack. Their display fonts (NEXT Poster / NEXT Book) are **licensed. Don't copy them**; use system sans for headings too unless Ted picks a free alternative.
- **Radius:** sm .25rem, md .375rem, lg .5rem, xl .75rem (Tailwind defaults). Cards and menus use `rounded-xl`.
- **Shadows:** menus use `0 28px 70px rgba(15,23,42,.18), 0 8px 24px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.03)` (our `shadow-menu`); cards use `0 2px 6px rgba(0,0,0,.08)` (our `shadow-card`).
- **Components:** they use Headless UI with shadcn-style `data-slot` names (`field`, `dialog-header`, `filter-menu-list`, `breadcrumb-link`, `card-actions`). We use Radix + shadcn conventions with matching `data-slot` names.
- **Don't** copy Sumble's logo, imagery, real customer names, or copy text. Use the placeholder "S" mark and made-up data.

All tokens live in `sumble/src/index.css` (`@theme`). Change colors there, not in components.

## Code map

```
sumble/src/
  App.tsx                         App shell: nav, breadcrumb, title, tabs → <AccountsTable/>
  index.css                       Tailwind import + Sumble @theme tokens
  lib/utils.ts                    cn() = clsx + tailwind-merge
  components/ui/                  Local shadcn-style kit (edit freely; not a package)
    button, badge, avatar, checkbox, input, popover, dropdown-menu, tooltip, icon-button, table
  components/data-table/          Generic, reusable for any table
    features.ts                   dataTableFeatures registry (+ custom `inSet` filter)
    DataTable.tsx                 Renders any table: header/body/empty state/pagination footer
    SortableHeader.tsx            Sort-cycling header button (asc/desc/none icons)
    FacetedFilter.tsx             Multi-select filter chip with live facet counts
  features/accounts/              First use of the table
    columns.tsx                   Column defs with rich cells
    AccountsTable.tsx             useTable + toolbar (search, filters, reset, bulk actions)
  data/accounts.ts                40 fake companies, seeded PRNG so they're identical on every load
```

### Adding a new table (e.g. People)

1. Add a data file in `src/data/` (made-up data, stable `id` per row).
2. Create `src/features/<name>/columns.tsx` with `createColumnHelper<DataTableFeatures, Row>()`. Use `SortableHeader` in headers. Put `meta: { align, width }` on columns that need it.
3. Create `src/features/<name>/<Name>Table.tsx`: `useTable({ features: dataTableFeatures, columns, data, getRowId })`, build a toolbar, then render `<DataTable table={table} toolbar={toolbar} />`.
4. For array-valued columns you want to facet-filter, set `filterFn: 'arrIncludesSome'` and `getUniqueValues: (row) => row.field`. For scalar columns, use `filterFn: 'inSet'`.
5. If you need a new sort or filter function, register it in `features.ts` first.

### Conventions

- Icon-only buttons use `IconButton` (required `label` → `aria-label` + tooltip).
- Row checkboxes use `onClick={row.getToggleSelectedHandler()}` (not `onCheckedChange`) so shift-click range selection works.
- Keep column defs and data at module scope so they stay stable (v9 re-computes row models when these change).

## Open questions / next steps

1. **What is the prototype?** Ask Ted what flow or feature it should demonstrate (e.g. account research, list building, scoring, territory planning, CRM cleanup; those are Sumble's guide topics). Everything so far is scaffolding.
2. Click through the table interactions in a real browser and fix anything broken.
3. With Ted logged in, inspect the Sumble **app** (read-only) and tune the table, filter and form styling to match.
4. Likely next components, given the app is form-heavy: field/label/help text (`data-slot="field"`), select/combobox, dialog, sheet/drawer, card, empty states.
5. Decide whether the prototype needs multiple views or routing (none yet; tabs and nav are static).
6. When the work is done or abandoned, remove it the same way WorkOS was removed (see PR #215): delete `sumble/`, the root scripts, the `netlify.toml` header block, and the `AGENTS.md` notes.
