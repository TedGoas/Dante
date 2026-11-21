# Sumble prototype — agent notes

Read this before working in `sumble/`. It is the handoff doc for Cursor, Claude Code, or any other agent picking this back up. The root [`AGENTS.md`](../AGENTS.md) still applies for repo-wide rules (ask before new deps, Ted handles merges, never edit `dist/`), **except** the rules about the main site's stack and visual design, which do **not** apply here.

## Goal

- Build a **standalone product prototype** that looks and feels like [sumble.com](https://sumble.com/) (account and people intelligence for go-to-market teams).
- **What it demonstrates:** a product design exercise (see *The exercise*). Sumble's Intelligence Brief now costs a credit to generate, so the before, during, and after moments are redesigned on a Clio org page. The target user is an AE or SDR who wants to be on the phone, not reading. Desktop only, designed at 1440x900.
- It lives at **`tedgoas.com/sumble`** and must stay **hidden**: nothing on the site links to it, it's not in the sitemap or RSS, and it's `noindex`.
- It must **not inherit anything from Dante** (the main site): no shared CSS, tokens, fonts, layouts, scripts or Eleventy templates. Treat it as a separate app that happens to deploy alongside the site.

## The exercise

3-hour timebox, started 9:06 AM, submit by about 12:00. Sumble (account intelligence for sales teams) is making its AI Intelligence Brief cost credits, so users must click to generate one. Redesign:

1. **Before generation:** discovery, value, cost, and the decision to spend.
2. **During generation:** setting expectations.
3. **After generation:** a scannable brief with a clear next step.

**Deliverables:** design artifacts (one screen at higher visual fidelity) and a short video covering problems prioritized, the proposal, key visual details, assumptions and tradeoffs, how Ted would validate it, and how AI was used (where it helped, what was changed or rejected). They value a few considered decisions over every state.

### Problems prioritized

- **No basis for spending:** the current popover shows the same 5 checkmarks on every account, with no account-specific value, data quality, or cost.
- **Paying for empty sections:** some briefs return "No summary available."
- **Two disconnected entry points:** a floating popover plus a green "how is this calculated" banner. Dismissing the popover buries it.
- **Wall of text:** angle, person, reason, and timing are buried in paragraphs, names don't link, and the only action is "Ask a follow-up."
- **No visible evidence:** claims have no sources, against Sumble's "no black boxes" principle.

### Assumptions

- The user is a salesperson (AE or SDR) who skims.
- 1 credit per brief, 200 credits a month (142 left in examples).
- Reopening is free, refreshing costs 1 credit, and follow-ups on a brief are free.
- Generation takes about 20 seconds and the page stays usable.
- Sumble can estimate per-section data coverage before generating.
- The brief stays tailored to the customer's ICP. The sample ICP is a team-inbox or email collaboration tool (TeamInbox).

### Other artifacts

- Figma file "Sumble-exercise": foundations board (color and size variables, color and text styles, logo, Button, Input, Badge, Table Cell, Nav item, Filter button, Checkbox, Star components), a rebuilt Organizations screen, and a "What I saw" section with annotated screenshots of the current brief.
- Lo-fi wireframes (3 directions) on a Claude Design canvas.

## Status (as of 2026-11-10)

- Branch: `sumble` (off `main`), local commits only. Not pushed or merged yet.
- Verified at 1440x900 in scripted headless Chrome: every brief state, tab and arrow-key navigation, the draft drawer, citations, and reduced motion. Production build passes.
- **Not verified:** how the motion feels. It was only checked from individual frames, so a person should judge it.

### What's built

- **Shell:** 190px sidebar with a gliding hover highlight, org header, 12 tabs with a gliding underline. The Brief tab shows a spinner while generating and a green dot when ready. Tabs other than Overview and Brief are placeholders.
- **Overview:** the brief tile replaces the popover and green banner, so the brief has one home. Also Technologies (empty state), Top People, Headcount by Persona, Top Teams, Recent Changes. People and teams are real Clio data from sumble.com.
- **Brief tile states:** before generation (coverage dots, See example, 0-credit state), generating (8 seconds simulated, labeled "about 20 seconds"), ready.
- **Ready tile:** widens from half to two-thirds with a one-time reveal. Headline "Start with Alex, not the CFO.", three angle cards that open the brief on that angle, and Draft to Alex. Footer is Open full brief, Refresh, and the credits line.
- **Brief tab:** chat on the left (40%), document on the right (60%). The selected angle is the headline, the top 3 contacts show with "Show 2 more", citations highlight sources, and source links show a placeholder alert.
- **Draft drawer:** the message is tinted by where the language came from (sources, team playbook, past conversations), with a key underneath.
- **Credits line:** "n of 200 credits left this month" and "How is this calculated?" stay visible in every brief state.
- **Dev toolbar:** bottom right. Jumps between states for demo recording, and **Hide** tucks it away. "Ready tile" replays the reveal without a full run.

### Decisions to keep, or revisit on purpose

- The existing kit won over Ted's original brief: `lucide-react` instead of Iconoir (a new dependency), `green-700` instead of `#00c950` (white on that green is about 2.2:1), 32px buttons, tokens in `@theme`.
- Layout combines Option A's overview tile with Option C's chat and brief split.
- Alex MacGillivray is the first contact, above the higher-scoring CFO. "Why Alex over the CFO?" stays as a follow-up chip in the brief chat.
- Chosen as defaults when Ted didn't pick otherwise: selected angle as headline with compact selectors, top 3 contacts first, two-thirds ready tile, big numbers instead of sparklines.
- Type: no uppercase eyebrows. Sizes are 24, 20, 16, 14, 13.5 (`text-body`), and 12. Weights 400, 500, 600.
- Text colors: slate-900 primary, slate-600 secondary, slate-500 tertiary.
- Only one solid green per screen. Score badges are tinted.
- Motion borrows from [beautifului.dev](https://www.beautifului.dev/), rebuilt in our own CSS: curve `cubic-bezier(0.23, 1, 0.32, 1)` (`ease-quint`), opacity and small moves only, everything off with reduced motion.

### Considered and parked (mention in the video)

- Brief as its own full page with an angle rail. The angle picker idea stayed.
- Full copilot from the start, before generation. Too big a change, so copilot is only used after generation.

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
- **Shadows:** menus use `0 28px 70px rgba(15,23,42,.18), 0 8px 24px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.03)` (our `shadow-menu`). Ted's brief is "no shadows except overlays", so cards, outline buttons, and inputs have none.
- **Components:** they use Headless UI with shadcn-style `data-slot` names (`field`, `dialog-header`, `filter-menu-list`, `breadcrumb-link`, `card-actions`). We use Radix + shadcn conventions with matching `data-slot` names.
- **Don't** copy Sumble's logo or imagery. Use the placeholder "S" mark. Data is made up, with one exception Ted specified: the Clio org details and the people and teams on Overview come from sumble.com. See *Open questions* before pushing.

All tokens live in `sumble/src/index.css` (`@theme`). Change colors there, not in components.

### Target visual system (Ted's spec)

Designer Carla's recent UI redesign is well loved, so extend it and don't reinvent it.

| Area | Values |
|------|--------|
| Type | System font (SF Pro). Sizes 12, 13.5 body, 16, 20, 24 |
| Text | `#1d293d` primary, `#030712` strong, `#45556c` secondary, `#62748e` muted, `#90a1b9` subtle |
| Backgrounds | `#f3f4f6` app, `#fff` surface, `#f9fafb` table header, `#f1f5f9` chips and hover, `#e5e7eb` active nav |
| Borders | `#e5e7eb` dividers, `#e2e8f0` inputs and cards |
| Accent | Green `#00c950` fills and score badges, `#00a63e` pressed, `#16a34a` logo, tint `#cee3db`. Blue `#1863dc` links and focus. Red `#c10007` urgent pills only |
| Shape | Radius 5, 7, pill. Buttons 30px (26 small). Table rows 40px |
| Feel | Iconoir icons. Dense, calm, 1px borders, no gradients |

**Where the prototype currently differs:** primary fills are `green-700` and score badges are tinted, not `#00c950`. Links and focus are green, not blue. Buttons are 32px with a 26px small size. Icons are lucide. Row titles use 14px. The body text is slate-900 rather than `#1d293d`. Table rows are 44px. The draft drawer uses kit blue and violet tints to mark language origins. These came from a contrast fix, the existing kit, or the hierarchy and density polish pass. They're the list to work through for polish priority 4.

## Code map

```
sumble/src/
  App.tsx                         Sidebar + OrgPage + drawer, toast, dev toolbar
  index.css                       Tailwind import, @theme tokens, keyframes, reduced-motion rule
  lib/utils.ts                    cn() = clsx + tailwind-merge (registers text-body)
  data/clio.ts                    All fake content and the TIMING object. Single source for both tabs
  components/shell/Sidebar.tsx
  components/ui/                  Local shadcn-style kit (edit freely; not a package)
    button, badge, avatar, card, checkbox, dialog (native <dialog>), input, popover,
    dropdown-menu, score-badge, tooltip, icon-button, table
  features/org/
    OrgPage.tsx                   Header, meta row, keyboard tabs
    OverviewTab.tsx               Card grid and the data cards
  features/brief/
    BriefContext.tsx              Single store: status, credits, tab, angle, chat. Holds the generation timer
    BriefTile.tsx                 Card that switches between the three states
    BeforeGeneration, Generating, BriefReadyTile, AngleLaunchCard
    CreditsMeta, HowCalculated, ExampleModal, Toast, DevToolbar
    BriefTab.tsx                  Tile while not ready, otherwise the split
    BriefDocument, AngleCards, BriefChat, Citation
    OutreachDrawer.tsx            Draft email with language origins
  components/data-table/          Generic, reusable for any table (not currently rendered)
    features.ts                   dataTableFeatures registry (+ custom `inSet` filter)
    DataTable.tsx                 Renders any table: header/body/empty state/pagination footer
    SortableHeader.tsx            Sort-cycling header button (asc/desc/none icons)
    FacetedFilter.tsx             Multi-select filter chip with live facet counts
  features/accounts/              First use of the table (not currently rendered)
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

### Gotchas

- `lib/utils.ts` registers `text-body` with `tailwind-merge`. Any new custom font size needs the same, or it gets treated as a color and dropped.
- Don't put a tooltip on a button that takes focus when a dialog opens. The tooltip swallows Esc. That's why dialog and toast close buttons are plain `Button`s.
- The draft message is `contentEditable` and memoized so React doesn't overwrite edits. Copy reads `innerText`.
- The tile is a fixed 264px, or 384px when ready. If its content grows, raise the height in `BriefTile.tsx`.
- Editing `BriefContext.tsx` can throw "must be used inside BriefProvider" during hot reload. Refresh the page before treating it as a bug.
- `openBrief()` with no arguments lands on the recommended angle. Pass `{ angleId }` or `{ prompt }` to deep-link. A prompt must match a `FOLLOW_UPS` entry to get its real answer.

## Finishing the exercise

### Polish priorities, in order

1. **Brief tab visual hierarchy:** the angle line reads first, consistent spacing rhythm, citation markers small but clear, contact rows scannable at a glance. *Done in the polish pass. Ted to review.*
2. **Credit clarity everywhere:** every action that spends a credit says so on the button, and nothing else implies cost. *Done: Generate and Refresh both say "1 credit". The balance is always visible.*
3. **Overview tile:** same height across states, or a brief height animation, with subtle generating motion. *Done: 264px before and during, animating to 384px when ready.*
4. **Consistency with Sumble tokens:** remove any off-system colors, shadows, or font sizes. *Open. See "Where the prototype currently differs" above. The kit won earlier on Ted's instruction, so confirm with Ted before changing any of it.*
5. **Accessibility pass:** focus states, contrast, keyboard for angle cards and tabs. *Partly done: keyboard paths and focus movement are tested. No full contrast audit was run.*
6. **Demo readiness:** clear dev toolbar labels and a clean path for the video. *Path works: Overview idle, generate, toast, Brief tab, pick an angle, follow-up, Draft outreach.*

### Remaining after polish

- Export the hi-fi Brief screen (screenshot into Figma) with short annotations.
- Record the video (about 20 minutes reserved, around 11:25).
- Submit via the Google form.

## Open questions / next steps

1. **Before pushing:** the people on Overview are real data from sumble.com, and the Brief tab pairs them with invented reasons. The playbook line and "9 of your last 12 booked meetings" are also made up. `tedgoas.com/sumble` is public even though it's noindex, so Ted should decide whether the names stay.
2. Have a person judge the motion and the ready tile reveal in a real browser.
3. Long titles and locations in the People table truncate, with the full text on hover.
4. When the work is done or abandoned, remove it the same way WorkOS was removed (see PR #215): delete `sumble/`, the root scripts, the `netlify.toml` header block, and the `AGENTS.md` notes.
