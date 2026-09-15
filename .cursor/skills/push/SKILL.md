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
2. **Branch** — `git branch --show-current` (or equivalent) for the branch name.
   - If on `main` (or the default branch), **refuse**. Ask for a feature branch name (do not invent one unless the user already named it). After checkout onto that branch, resume. Never `git push origin main`.
3. **Push** — If no upstream is set: `git push -u origin <branch>`. Otherwise: `git push`.

## Rejected push

If the remote rejects (e.g. behind `origin`), explain briefly, then suggest `git pull --rebase` or merge **only after the user approves**, then push again.

## Safety

- Never push `main` / never `git push origin main`.
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
