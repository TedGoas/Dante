---
name: push
description: >-
  Pushes the current branch to origin on GitHub (git push, set upstream when
  missing). Use when the user asks to push, publish the branch, or ship to
  GitHub — not for composing commit messages or local commits only.
---

# Push

## Workflow

1. **Confirm** — Push only when the user asked to push (or clearly meant publish to GitHub), or when another skill (e.g. [pr-create](../pr-create/SKILL.md)) invokes this workflow as its push step.

2. **Preflight** — Run before **every** `git push`, including after refusing `main` and switching to a feature branch. Do not skip ahead to push.
   1. **Branch** — `git branch --show-current`.
      - If on `main` (or the default branch), **refuse** unless the user explicitly asked to push `main` this turn. Ask for a feature branch name (do not invent one unless they already named it). After `git checkout -b <name>` or checkout of an existing feature branch, **re-run this entire preflight** from the top before pushing. Never `git push origin main` by default.
   2. **Unique commits** — Compare to the upstream tracking branch if set, otherwise to `origin/main`.
      - If this branch has **no commits unique** to publish: **do not push**. Say there is nothing to publish. Do **not** create an empty remote branch that only matches `main`. Treat this as a skipped push (success for callers such as pr-create), not a failure that aborts the rest of their workflow.
      - If there **are** unique commits, continue.
   3. **Dirty tree** — List unstaged, staged, and untracked paths that look like real work.
      - If there are **no unique commits** and the tree is dirty: **stop** and ask the user to commit first (via `/commit` / the commit skill). Uncommitted-only work must not become an empty remote branch.
      - If there **are** unique commits and leftovers remain: leave them unstaged (same spirit as the commit skill). Note that they stay local. **Do not** hard-stop the push of commits that are already done. Only ask/stop if the dirty paths look like they were meant to be part of this push and you are unsure.

3. **Push** — Only when preflight found unique commits to publish. If no upstream is set: `git push -u origin <branch>`. Otherwise: `git push`.

## Rejected push

If the remote rejects (e.g. behind `origin`), explain briefly, then suggest `git pull --rebase` or merge **only after the user approves**, then push again (re-run preflight first).

## Safety

- Never push `main` / never `git push origin main` unless the user explicitly asked to push `main`.
- Never skip unique-commit checks after a `main` refusal or branch switch.
- Never hard-stop a valid push solely because unrelated leftovers are unstaged.
- Never `git push --force` or `--force-with-lease` unless the user explicitly requests it and understands the risk.

## Authentication

The agent does not hold GitHub credentials. `git push` uses **the user’s machine**: SSH keys, HTTPS credential helper, or GitHub CLI (`gh auth login`). If auth fails, fix local Git/GitHub setup; do not put tokens or passwords in chat or in this file.

## After push

If the user also wants a pull request, use **[pr-create](../pr-create/SKILL.md)** (`/pr-create`) — do not open a PR from this skill alone.

## Examples

```bash
git push -u origin 2026-refresh   # first push for branch
git push                          # when upstream exists
```
