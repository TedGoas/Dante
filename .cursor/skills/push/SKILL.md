---
name: push
description: >-
  Pushes the current branch to origin on GitHub (git push, set upstream when
  missing). Use when the user asks to push, publish the branch, or ship to
  GitHub — not for composing commit messages or local commits only.
---

# Push

## Workflow

1. **Confirm** — Push only when the user asked to push (or clearly meant publish to GitHub).

2. **Preflight** — Run before **every** `git push`, including after refusing `main` and switching to a feature branch. Do not skip ahead to push.
   1. **Branch** — `git branch --show-current`.
      - If on `main` (or the default branch), **refuse** unless the user explicitly asked to push `main` this turn. Ask for a feature branch name (do not invent one unless they already named it). After `git checkout -b <name>` or checkout of an existing feature branch, **re-run this entire preflight** from the top before pushing. Never `git push origin main` by default.
   2. **Dirty tree** — If there are unstaged, staged, or untracked files that look like real work, **stop**. List the paths and ask the user to commit first (via `/commit` / the commit skill). Do **not** push; uncommitted work would not be on the remote branch.
   3. **Unique commits** — Compare to the upstream tracking branch if set, otherwise to `origin/main`. If there are no commits unique to this branch (nothing to publish), **stop** and say so. Do not create an empty remote branch that only matches `main`.

3. **Push** — Only after preflight passes. If no upstream is set: `git push -u origin <branch>`. Otherwise: `git push`.

## Rejected push

If the remote rejects (e.g. behind `origin`), explain briefly, then suggest `git pull --rebase` or merge **only after the user approves**, then push again (re-run preflight first).

## Safety

- Never push `main` / never `git push origin main` unless the user explicitly asked to push `main`.
- Never skip dirty-tree or unique-commit checks after a `main` refusal or branch switch.
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
