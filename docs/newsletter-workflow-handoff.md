# Newsletter workflow — agent handoff

**Branch:** `feat/html-email-newsletters`  
**Base:** `main`  
**PR:** https://github.com/TedGoas/Dante/pull/246 (opened as draft)  
**Latest scaffolding commit:** `e16c9ef` — `feat(newsletter): add html email workflow scaffolding`  
**Owner:** Ted Goas  
**Status:** Plumbing and rules are done. No real newsletter design, shell design, or issue #48 content yet. Sample issue `999` was verified locally and **deleted** before the scaffolding commit.

Read this file first when continuing newsletter work on another machine or in a new agent session. Also read [AGENTS.md](../AGENTS.md) (*Newsletter (HTML email workflow)*), [PRODUCT.md](../PRODUCT.md), [DESIGN.md](../DESIGN.md), and the three skills under [`.cursor/skills/`](../.cursor/skills/).

---

## Goal (unchanged)

Hand-author each newsletter issue once as HTML with **inline styles**, then produce:

1. **Web page** at `/newsletter/{issue}/` (site header/footer, listed on `/newsletter/`)
2. **Local email HTML** for Email Octopus “Code your own” (`newsletter-email/{issue}.html`, gitignored, never deployed)

No CSS inliner. No new npm dependencies. No Email Octopus API. Free Starter plan merge tags only. Past beehiiv/eomail issues on `/newsletter/` stay untouched. Newsletter issues must **not** enter RSS.

---

## What is already done

### Content model and build plumbing

| Piece | Path |
|-------|------|
| Issue files | `src/newsletter/{issue}/index.njk` (`.njk` on purpose — Nunjucks includes/shortcodes later; `.html` would be Liquid here) |
| Directory data | `src/newsletter/newsletter.11tydata.js` — permalink from `issue`; `draft` excluded from prod + collections; `NEWSLETTER_EMAIL=1` swaps to email layout |
| Collection | `lib/collections/newsletter.js` → `collections.newsletterIssues` (newest first, no drafts) |
| Image passthrough | Per-issue in `.eleventy.js`; production skips draft issue folders entirely |
| Hub listing | `src/newsletter.njk` prepends published issues into the existing Past issues `article-list` (`TLFW {n}: {title}`); beehiiv/eomail fallback below untouched |

### Web output

| Piece | Path |
|-------|------|
| Layout | `src/_includes/layouts/newsletter.njk` — extends `default.njk` via Nunjucks `{% extends %}`, replaces `.site-main` only |
| Default blocks | `src/_includes/layouts/default.njk` — `{% block main %}`, `{% block headExtras %}` (other pages output-identical) |
| Scoped reset | `src/assets/css/newsletter.css` — `.newsletter-issue, .newsletter-issue * { all: revert; }` (newsletter pages only; never edit global `styles.css` for this) |
| Shared shell | `src/_includes/newsletter/shell.njk` — **scaffold only** (600px table, commented masthead/background placeholders) |
| Shared `<style>` | `src/_includes/newsletter/email-styles.njk` — **empty** block; prefix selectors with `.newsletter-issue` |

Bleed survivors kept on purpose: site `a:focus-visible` outline; `prefers-reduced-motion` `!important` rules. Verified at 375px: no horizontal scroll; inline Georgia/Arial win over Redaction/Geist.

### Email output

| Piece | Path |
|-------|------|
| Layout | `src/_includes/layouts/newsletter-email.njk` — preheader from `description`, View-in-browser, `{% raw %}` merge-tag footer |
| Build script | `scripts/build-newsletter-email.js` |
| npm script | `npm run newsletter:email -- {issue}` |
| Output | `newsletter-email/{issue}.html` (gitignored) + temp `.newsletter-email-tmp/` (gitignored) |

Script runs Eleventy via **CLI** with `NEWSLETTER_EMAIL=1` and `--output` to a temp dir (programmatic API let config `dir.output: dist` win and wrote into `dist/` — do not switch back without re-checking). Rewrites relative `src`/`href`/`url()`/`srcset` to absolute `https://www.tedgoas.com`. Warns on WebP/SVG, missing `alt`/`width`, size > 90 KB. Fails on missing/malformed merge tags, remaining relative URLs, or stray `{{`/`}}`/`{%`/`%}`.

Required merge tags (literal, case-sensitive):

- `{{UnsubscribeURL}}` as **text** link `href`
- `{{SenderInfoLine}}`
- `{{RewardsURL}}` as link `href`

### Skills and docs

- `/newsletter-start` — `.cursor/skills/newsletter-start/SKILL.md` (first run: **ask Ted to confirm starting number; believed 48**)
- `/newsletter-build` — `.cursor/skills/newsletter-build/SKILL.md`
- `/newsletter-review` — `.cursor/skills/newsletter-review/SKILL.md`
- Workflow section in `AGENTS.md` (*Newsletter (HTML email workflow)*)

### Decisions already locked

- Issue extension: **`index.njk`**, not `.html`
- Hub: **prepend into the same Past issues list**, same `article-list` row pattern, internal links (no `target="_blank"`)
- Web page includes the **full email shell** (looks like the email between site header and footer)
- No site design tokens/fonts/components on newsletter content
- Ted designs the shell and writes issue HTML; agents provide plumbing and minimal scaffolds only
- Signup form swap (beehiiv → Email Octopus) is **out of scope** for this branch
- Commits: Ted usually handles them; this handoff was committed/pushed at Ted’s request for cross-machine continuity

---

## What is NOT done (next work)

Do **not** invent visual design. Wait for Ted or follow an explicit design brief.

1. **Design the email shell** in `src/_includes/newsletter/shell.njk`  
   Background, outer tables, max-width container, masthead, any shell footer above the merge-tag footer. Email-safe: tables + inline styles.

2. **Fill `email-styles.njk`** with media queries / dark-mode rules as needed (selectors prefixed `.newsletter-issue`).

3. **Polish email-only chrome** in `newsletter-email.njk` if desired (View-in-browser placement, merge-tag footer presentation) — keep required tags intact inside `{% raw %}`.

4. **First real issue**  
   - Run `/newsletter-start` (confirm starting number with Ted — believed **48**)  
   - Author body HTML with inline styles in `src/newsletter/{issue}/index.njk`  
   - Put images in the same folder (JPG/PNG/GIF; always `alt` + `width`; `/optimize-images` after adding)  
   - Preview: `npm start` → `http://localhost:8080/newsletter/{issue}/`  
   - When ready: `/newsletter-build`, then after deploy `/newsletter-review`, then paste into Email Octopus manually  
   - Flip `draft: false` (or remove) to publish the web page and hub listing

5. **Out of scope unless Ted asks**  
   CSS inliner / new deps, Email Octopus API, migrating past issues, RSS changes, beehiiv signup embed swap, inventing issue copy.

---

## How to continue on another computer

```bash
git fetch origin
git checkout feat/html-email-newsletters
git pull
npm install
npm start
# optional smoke: create a draft sample, or jump straight to /newsletter-start
```

Useful commands:

```bash
npm start
npm run build
npm run newsletter:email -- {issue}
```

Canonical rules live in `AGENTS.md`. Per-issue agent workflows: the three `/newsletter-*` skills.

---

## Testing already proven (do not re-litigate unless broken)

- Dev serve of draft sample at `/newsletter/{issue}/`: site chrome, no merge tags, scoped reset works, no phone-width horizontal scroll
- Production build excludes drafts (page + images) from `dist/` and hub; RSS unchanged
- Email build produces absolute URLs, preheader, View-in-browser, all three merge tags; `newsletter-email/` gitignored; no email artifacts in `dist/`
- Published (non-draft) issues prepend correctly on `/newsletter/` and appear in sitemap

---

## Agent norms for this workstream

- Follow **Plan, then one option** for exploratory UI; one visual variable per polish turn once designing the shell
- Ask before new dependencies
- Do not generate fake newsletter content or placeholder issue copy unless Ted asks for a throwaway test again
- Do not commit unless Ted asks; if committing, use the **commit** skill conventions and stay on this feature branch (not `main`)
- Prefer existing skills over reinventing the workflow
