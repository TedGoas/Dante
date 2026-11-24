# LoanCrate prototype — agent notes

Read this before working in `loancrate/`. The root [`AGENTS.md`](../AGENTS.md) still applies to repo-wide rules (ask before new deps, Ted handles commits and merges, never edit `dist/`). Its rules about the main site's stack and visual design do **not** apply here.

## Goal

- A **standalone product prototype** for a design exercise for [LoanCrate](https://www.loancrate.com/), an AI-assisted mortgage Loan Origination System. AI reviews documents on arrival, auto-processes them, and generates conditions from extracted data.
- **The exercise brief is not known yet.** For now the app is a toolkit: a style guide, a pipeline, and an example loan detail view (see *Exercise toolkit*). Replace or extend `App.tsx` once the brief arrives, and record the brief, problems, and assumptions here (see `sumble/AGENTS.md` for the shape).
- Ted has no product login, so the visual language comes from loancrate.com's marketing site and the product mockup on its homepage.
- It lives at **`tedgoas.com/loancrate`** and must stay **hidden**: nothing on the site links to it, it's not in the sitemap or RSS, and it's `noindex`.
- It must **not inherit anything from Dante**: no shared CSS, tokens, layouts, scripts, or Eleventy templates.

## Domain

**Read [`DOMAIN.md`](DOMAIN.md) before designing anything.** It covers the mortgage domain: the loan lifecycle, roles, the 1003, conditions, the large-deposit/LOX rule, post-closing QC, and what all of that means for design. Use its vocabulary in UI copy and seed data. The exercise may be mortgage-specific or a generic problem with parallels to it. Either way, frame decisions the way LoanCrate would: humans decide and AI prepares, show the evidence, exceptions first, and keep an audit trail.

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
  App.tsx                      Top bar + hash routes: #/kit[/section], #/pipeline, #/loan/{id}. ToastProvider + TooltipProvider
  index.css                    Tailwind + @theme tokens (incl. --color-ai*, paper, motion keyframes), dialog motion, reduced motion
  lib/
    utils.ts                   cn() = clsx + tailwind-merge
    seed.ts                    mulberry32 PRNG, FIXED_NOW (2026-11-23), daysFromNow/daysUntil/relativeTime, money formatters
    use-media-query.ts         useMediaQuery()
  data/                        All fake + seeded. Vocabulary from DOMAIN.md
    loans.ts                   Pipeline. loan-0…3 are rich files (DEMO_LOAN_ID = loan-0); closing + rate-lock dates
    documents.ts               Documents → pages of positioned blocks → extracted fields with % regions + confidence
    conditions.ts              Conditions with category/status/source/owner/due, AI "why", full history; CURRENT_USER
    application.ts             Stated 1003 values + compareApplication(loanId) → match / mismatch / missing
  components/ui/               Kit (edit freely)
    button badge chip card field input textarea select radio checkbox
    dropdown-menu popover tooltip icon-button table
    dialog (Dialog + Sheet, native <dialog>)  tabs (roving tabindex)  toast (provider + useToast)
    skeleton  empty-state  kbd  progress (Spinner, Progress, AiWorking)
  components/ai/
    confidence.ts              CONFIDENCE thresholds (only place) + confidenceLevel()
    ConfidenceIndicator.tsx    icon + text; full | compact
    AiSuggestion.tsx           AI value with accept / modify / reject / why; cell | field | card; useAiSuggestion()
    AiConditionCard.tsx        Condition with trigger, rule, evidence, status actions, waive/dismiss/reject dialogs
    ActivityLog.tsx            Audit trail, AI vs human actors
  components/evidence/
    DocumentPage.tsx           Renders a fake page (container-query type, so zoom = width)
    DocumentViewer.tsx         Page + highlights + field list; pages, zoom, versions; loading/failed/low-quality; focusField()
    reviews.ts                 useFieldReviews(): shared accept/modify/reject state per field
  components/data-table/       Generic TanStack v9 table (+ onRowClick)
  features/
    kit/                       StyleGuide.tsx, ToolkitSections.tsx (every component, every state), layout.tsx
    pipeline/                  PipelinePage, PipelineTable, columns (loan # links to #/loan/{id})
    loan/
      LoanDetailShell.tsx      Layout with slots: header / documents / documentsCompact / viewer / panel
      LoanHeader.tsx           Identity + Deadline (closing, rate lock urgency)
      DocumentList.tsx         Grouped by type, filters, status, version, to-review count; DocumentPicker
      LoanPanel.tsx            Tabs: Conditions / Data (1003 vs docs) / Activity
      LoanDetail.tsx           Example composition wiring all of the above. Copy this to start a screen
```

## Exercise toolkit

Generic pieces for "AI working on a loan file". Recombine; don't treat `LoanDetail` as the answer.

| Need | Use |
|------|-----|
| AI-extracted value anywhere | `<AiSuggestion density="cell" \| "field" \| "card">`. Local state: `{...useAiSuggestion({ value })}`. Shared state: `useFieldReviews().handlersFor(field)` |
| Show confidence | `<ConfidenceIndicator value={0.82} />` (compact in tables). Change thresholds only in `confidence.ts` |
| "Why did the AI do this?" | Condition `why` block in `AiConditionCard`, or pass `onShowEvidence` to `AiSuggestion` |
| Jump to evidence | `viewerRef.current.focusField(fieldId)` or `activeFieldId` prop on `DocumentViewer` |
| A new screen | Copy `features/loan/LoanDetail.tsx`, keep `LoanDetailShell`, swap the slots |
| Queue / list of work | `DataTable` + a `columns.tsx` (see `features/pipeline/`); `onRowClick` for mouse, a link in the first cell for keyboard |
| Confirm a consequential action | `Dialog` with a required `Field` (see `ReasonDialog` in `AiConditionCard`) |
| Side detail without leaving | `Sheet` |
| Feedback after an action | `useToast().toast({ tone, title, action: { label: 'Undo', onClick } })` |
| AI in progress | `AiWorking`, `Progress tone="ai"`, `Skeleton`, `AiSuggestion state="loading"` |
| Audit trail | `ActivityLog` with `activityForLoan(conditions)` or your own `HistoryEntry[]` |
| Deadline urgency | `Deadline` from `LoanHeader.tsx` |

**Seed data worth knowing (loan-0, Avery Brennan, purchase):** $48,500 Oct 14 deposit (AI LOX condition), stale Oct 13 paystub, W-2 name "Avery M. Brenan", blurry Sep statement (0.42 balance confidence), Oct statement v1 → v2, unsigned handwritten LOX (rejected, re-requested), undisclosed Lakeshore auto loan (1003 $640/mo vs credit $1,015/mo), appraisal still processing, rate lock expiring in 2 days. loan-1 (refinance): $12,000 deposit with no LOX (refinance exception), failed tax-return upload. loan-2: gift letter + matching wire. loan-3: $60,000 transfer, AI condition **waived**.

**Decisions:** the "dismiss as not applicable" action sets status `waived` with action text "Dismissed as not applicable" (no separate status, to keep the 7 statuses from the brief). Rejecting a received item records "Rejected" and then "Re-requested" and returns the condition to `requested`. The current user is a processor (`CURRENT_USER`). Times are relative to `FIXED_NOW`, not the real clock.

## Conventions

- Icon-only buttons use `IconButton` (its required `label` becomes the `aria-label` and the tooltip).
- Row checkboxes use `onClick={row.getToggleSelectedHandler()}` so shift-click range selection works.
- Form controls: give `Field` the control's `id` as `htmlFor`. Controls with hint or error text set `aria-describedby="{id}-hint"`, and controls in an error state set `aria-invalid`.
- One `default` (near-black) button per view. Use `secondary` for the rest. Cards in lists never use `default`.
- AI marking is indigo (`text-ai`, `bg-ai-soft`, `border-ai-border`) and always paired with the sparkle icon or the word "AI". Status and confidence are never color alone.
- Anything that animates must be fine with the global reduced-motion rule (it kills all animation and transition). Programmatic scrolling checks `prefers-reduced-motion` for `behavior`.
- Status changes the user didn't directly cause (AI results, toasts) go through `aria-live`.
