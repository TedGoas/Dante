---
name: optimize-images
description: >-
  Optimize Dante image assets in place — resize/recompress JPEG, convert large
  PNG to WebP with path-aware Markdown updates, slim SVG embeds + SVGO. Use when
  the user runs /optimize-images, asks to optimize images, or after adding or
  changing files under src/assets/, src/posts/img/, or src/work/img/.
---

# Optimize images

Offline asset optimization for this 11ty site. **No new npm packages.** Do not install `@11ty/eleventy-img` / sharp here — that is a separate proposal ([docs/responsive-image-shortcode-proposal.md](../../../docs/responsive-image-shortcode-proposal.md)).

**Do not** wrap SVG thumbs/gallery SVGs in `<picture>` / WebP `<source>`s.

## When to run

- User says `/optimize-images` or “optimize images”
- After adding or replacing assets under:
  - `src/assets/work/`
  - `src/assets/img/`
  - `src/posts/img/`
  - `src/work/img/`

Prefer **explicit paths** the user just added. Full-tree scan is for audits.

## Workflow

1. Confirm targets (paths from the user, or `git status` / recent asset adds).
2. Run the script (requires **Pillow**; SVGO via ephemeral `npx`, not `package.json`):

```bash
# Specific new/changed files (always processed)
python3 .cursor/skills/optimize-images/scripts/optimize_images.py \
  src/posts/img/my-new-hero.jpg \
  src/assets/work/new-figure.png

# Dry-run first if unsure
python3 .cursor/skills/optimize-images/scripts/optimize_images.py --dry-run src/posts/img/foo.jpg

# Audit: large files across asset roots (≥300KB)
python3 .cursor/skills/optimize-images/scripts/optimize_images.py
```

3. If PNG → WebP, skim `git diff` / status for Markdown/HTML ref updates. Fix any missed refs manually (script uses path-aware replacements; skips ambiguous bare basenames like `hero.png` when multiple exist).
4. Update `width`/`height` on `<img>` if dimensions changed meaningfully.
5. Spot-check with `npm run build` when many files changed.
6. Summarize before/after sizes for the user. Do **not** commit unless asked.

## Rules (match prior run)

| Type | Action |
|------|--------|
| **JPEG** | Max edge **1600px**; quality **82**, progressive; same filename |
| **PNG** | → **WebP** (q **80**); delete PNG; update refs; keep alpha as WebP when needed |
| **WebP** | Resize + recompress in place if oversized |
| **SVG** | Recompress embedded base64 rasters to WebP (max edge 1600); SVGO multipass when file still ≥200KB (`convertPathData` off) |

## Out of scope

- Hand-authored `<picture>` / `srcset` trees
- Adding npm dependencies
- Prototype hashed JS/CSS bundles (wallpapers like `aerolabs-bg.jpg` are OK)
- Generating content or inventing image paths

## Agent checklist

```
- [ ] Ran script on intended paths
- [ ] PNG→WebP refs updated (or verified none needed)
- [ ] No ambiguous hero.png-style basename breakage
- [ ] Reported size deltas
- [ ] Did not add package.json deps
```
