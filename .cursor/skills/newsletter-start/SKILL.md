---
name: newsletter-start
description: >-
  Scaffold a new tedgoas.com newsletter issue under src/newsletter/{issue}/
  for the hand-authored HTML email workflow. Use when the user runs
  /newsletter-start or asks to start a new newsletter issue.
---

# Newsletter start

Scaffolds one new issue for the workflow in [AGENTS.md](../../../AGENTS.md) (*Newsletter*). Ted hand-writes the HTML; this only creates the file. **No new npm packages. Do not invent design or copy.**

## Workflow

1. Determine the next issue number: list folders in `src/newsletter/` (`src/newsletter/*/`). Next = highest number + 1.
   - **If no issue folders exist yet (first run), stop and ask Ted to confirm the starting number before creating anything.** It is believed to be **48**. Do not create files until he confirms.
2. Create `src/newsletter/{issue}/index.njk` with today's date (`date +%F`) and exactly this scaffold:

```njk
---
issue: {issue}
title: ""
description: ""
date: {today}
draft: true
---
{# Issue body: hand-written HTML with inline styles. Tables for layout. #}
{# Reusable blocks can live in src/_includes/newsletter/ later. #}
```

3. Leave `title` (subject line) and `description` (preview text / meta description) empty for Ted to fill in.

## Remind Ted

- Images go in the same folder (`src/newsletter/{issue}/`), referenced relatively (`src="hero.jpg"`). Prefer JPG, PNG, or GIF — not WebP or SVG (unreliable in email).
- Every `<img>` needs descriptive `alt` and a `width` attribute.
- Run `/optimize-images` after adding images.
- Web preview (with `npm start` running): `http://localhost:8080/newsletter/{issue}/` — drafts render locally but are excluded from production and the `/newsletter/` listing until `draft` is flipped to `false` or removed.

## Do not

- Set `permalink` by hand (derived from `issue` in `src/newsletter/newsletter.11tydata.js`).
- Add site design tokens, site fonts, or site components to the issue.
- Commit. Ted handles commits.
