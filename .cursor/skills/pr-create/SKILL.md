---
name: pr-create
description: >-
  Pushes existing local commits to GitHub and opens a pull request with a brief
  plain-English title and a short what-we-did + goal body. Use when the user
  asks to create a PR, open a pull request, or runs /pr-create — not for
  commit-only or push-only requests.
---

# Create pull request (`/pr-create`)

## When to use

- User asks to create a PR, open a pull request, or runs `/pr-create`.
- Not for commit-only work (use [commit](../commit/SKILL.md)) or push-only (use [push](../push/SKILL.md)).

## Workflow

1. **Preflight** — Run `git status` and `git branch --show-current`.
   - **Dirty tree** — If there are unstaged, staged, or untracked files that look like real work, **stop**. List the paths and ask the user to commit first (via `/commit` / the commit skill). Do **not** commit or scoop files in this skill.
   - **On `main` (or the default branch)** — If work that belongs on a feature branch is present (or they want a PR from `main`), **stop** and ask how to proceed. Do not invent a branch name unless the user already named one.
   - **Nothing to push** — If the branch is already up to date with origin and there are no new commits, say so. Still open or report a PR only if that remains the ask and remote commits for the branch exist.

2. **Goal check** — From the chat and commit subjects (`git log` vs the merge-base with `origin/main`), derive a one-line goal.
   - If the goal is **ambiguous**, ask one clarifying question. Do **not** push or open the PR until answered.
   - If the goal is **clear** from chat or commits, continue without an extra confirmation.

3. **Push** — Follow the [push](../push/SKILL.md) skill: `git push -u origin <branch>` when no upstream is set; otherwise `git push`. Never force-push.

4. **Title + body** — Draft from the work:
   - **Title** — Brief plain English (imperative or noun phrase OK). Aim ~50 characters; max **72**. No Conventional Commit prefix. No trailing period.
   - **Body** — Two short parts only:
     - **What we did** — Bullet list or 1–3 sentences from the commits/diff.
     - **Goal** — The stated outcome.
   - Keep it terse. No LinkedIn fluff. No test-plan, review-URL, or labels section unless the user asks.

5. **Create PR** — Base branch: `main`.
   - Open as **ready for review** by default. Create a **draft** only if the user explicitly asks for a draft.
   - Prefer the environment’s PR tool when available (e.g. Cloud Agent `ManagePullRequest`); otherwise use `gh pr create` on the user’s machine.
   - If a PR for this branch already exists, report its URL. Update title/body only when the user asked to refresh; do not open a duplicate.

6. **Report** — Paste the PR URL and note whether it is draft or ready for review.

## Safety

- Run only when the user asked to create a PR / `/pr-create`.
- Never commit inside this skill.
- Never `git push --force` or `--force-with-lease` unless the user explicitly requests it and understands the risk.
- Do not invent goals; ask when ambiguous.
- Auth failures: same as the push skill — fix local Git/GitHub setup; do not put tokens or passwords in chat or in this file.

## Examples

**Title**

- Tighten gallery thumb hover cue
- Add pr-create agent skill
- Fix labs nav link href

**Body**

```markdown
## What we did
- Added `.cursor/skills/pr-create/SKILL.md` for push + open PR
- Linked commit and push skills to pr-create

## Goal
Give agents a single `/pr-create` path to publish local commits and open a brief PR.
```
