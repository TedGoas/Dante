---
name: commit
description: >-
  Proposes a title-only Conventional Commit subject, then runs git status/diff,
  stages changes, and git commit -m. Use when the user asks for a commit message,
  to stage and commit, or to save work locally — not when they only want to push.
---

# Commit

## Commit subject

- **One line only** — subject; no body unless the user asks.
- **Imperative mood, present tense** — “Add…”, “Fix…”, “Update…” (not “Added”).
- **Length** — aim ~50 characters; max **72**.
- **No trailing period.**
- **Format:** `type(optional-scope): description` with lowercase description after the colon ([Conventional Commits](https://www.conventionalcommits.org/) style).

### Types (this repo)

| type | Use when |
|------|----------|
| `feat` | New user-facing behavior or sections |
| `fix` | Bugs (layout, links, build) |
| `content` | Copy, posts, work case studies, metadata |
| `style` | CSS / visual-only |
| `perf` | Faster loads, images, fewer requests |
| `a11y` | Accessibility |
| `chore` | Tooling, config, refactors with no user-visible change |

### Path hints

- `src/posts/`, work entries → `content` or `feat`
- `src/assets/css/`, themes → `style` or `perf`
- `.eleventy.js`, `_data`, layouts, includes → `chore` or `fix`
- `.cursor/`, `AGENTS.md`, agent skills → `chore`

## Workflow

1. **Review** — `git status`; `git diff` (staged and unstaged) so the message matches what will be committed.
2. **Dirty tree** — List every modified/untracked path. Separate **this task** from leftovers (other agents, WIP, unrelated experiments).
3. **Stage selectively** — `git add <paths>` or `git add -p` for **only** the task paths. Never `git add -A` / `git add .` when unrelated changes exist.
4. **Refuse scooping** — If unrelated dirty files are present, leave them unstaged. If the user asked to “commit everything,” confirm first. If unsure which paths belong to the task, ask before staging.
5. **Commit** — `git commit -m "type(scope): description"`.

Do **not** run `git push` here. If the user wants to publish, use the **push** skill after committing.

## Safety

- Commit only when the user asked to commit (see project `AGENTS.md`).
- Do not commit secrets, `.env`, or accidental unrelated changes.
- Do not commit `.impeccable/live/` or `.impeccable/critique/` (gitignored ephemeral output).
- After commit, run `git status` and confirm leftovers (if any) remain unstaged as expected.

## Examples

- `fix(nav): correct labs link href`
- `content(blog): publish post on interviewing designers`
- `style(css): tighten focus ring on skip link`
- `chore(11ty): add passthrough copy for assets`
- `chore(agents): add prototype-embed skill`
