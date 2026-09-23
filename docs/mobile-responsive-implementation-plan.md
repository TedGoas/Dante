# Mobile Responsive Implementation Plan

**Purpose:** Actionable plan for a local Cursor agent to fix mobile responsive issues with images and prototypes.

**Testing approach:** Run `npm start` and use Chrome DevTools device simulation (iPhone 14 Pro, ~390-430px width) to verify each fix before committing.

---

## Task 1: Fix Homepage Thumbnail Clipping (Low-Hanging Fruit)

**Priority:** High  
**Effort:** CSS-only  
**Files to modify:** `src/assets/css/styles.css`

### Problem

The homepage showcase thumbnails use `object-fit: cover` which clips images on mobile. The grid cells don't match image aspect ratios.

### Current CSS (lines ~1643-1652)

```css
.home-work-grid__media {
  position: absolute;
  top: calc(-1 * var(--home-work-grid-media-offset));
  left: calc(-1 * var(--home-work-grid-media-offset));
  width: calc(100% * var(--home-work-grid-media-scale));
  height: calc(100% * var(--home-work-grid-media-scale));
  max-width: none;
  display: block;
  object-fit: cover;
  object-position: top left;
}
```

### Proposed Fix

Add a mobile breakpoint that changes the layout to show full images:

```css
@media (max-width: 640px) {
  .home-work-grid__media-frame {
    position: relative;
    inset: auto;
  }
  
  .home-work-grid__media {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
  }
}
```

**Alternative approach:** Keep `object-fit: cover` but adjust the cell aspect ratios to better match the images on mobile. This preserves the "peek" aesthetic but reduces clipping.

### Testing Steps

1. Run `npm start`
2. Open `http://localhost:8080` in Chrome
3. Open DevTools → Device Toolbar → iPhone 14 Pro
4. Scroll to dark showcase band
5. Verify thumbnails show full content without clipping
6. Check that the visual hierarchy still works (text blocks, spacing)

---

## Task 2: Verify Chatbot Prototype (Quick Check)

**Priority:** Medium  
**Effort:** Verify only, likely no changes needed

### Details

The AI Chatbot prototype uses a narrow 384×600px format that should already fit mobile viewports.

**File:** `src/work/2022-01-01-dialpad-team.md` (line ~70)  
**Shortcode:** `{% prototypeEmbed "ai-chatbot", "Dialpad chatbot design.", 384, 600, "/assets/img/dialpad-team/dialpad-team-chatbot-bg.jpg" %}`

### Testing Steps

1. Navigate to `http://localhost:8080/work/dialpad-team/`
2. Set viewport to 390px width
3. Scroll to "From basic to genuinely helpful" section
4. Check if the chatbot widget displays without horizontal clipping
5. If it fits: **No changes needed**
6. If it clips: Add mobile-specific CSS to scale or center

---

## Task 3: Prototype Embed Mobile Behavior (Needs Discussion)

**Priority:** Medium  
**Effort:** Depends on chosen approach

### Problem

The large prototype embeds (Scorecards, AnalyticsGPT, Launchpad) are built as fixed 1440×900px layouts. On mobile, the poster images get clipped by `object-fit: cover`.

### Current CSS (lines ~3995-4004)

```css
.prototype-embed__poster {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
}
```

### Options to Implement

#### Option A: Scale-down with letterboxing (CSS-only)

Show the full prototype at a smaller scale on mobile. May become hard to read but shows complete UI.

```css
@media (max-width: 640px) {
  .prototype-embed__frame {
    aspect-ratio: auto;
    height: auto;
  }
  
  .prototype-embed__poster {
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
  }
}
```

#### Option B: Horizontal scroll (CSS-only)

Allow horizontal scrolling to see the full prototype. Common pattern for desktop-only dashboards.

```css
@media (max-width: 640px) {
  .prototype-embed__frame {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .prototype-embed__poster {
    width: var(--prototype-embed-width);
    min-width: var(--prototype-embed-width);
    height: auto;
    object-fit: contain;
  }
}
```

#### Option C: Static poster with desktop link (HTML + CSS)

On mobile, show a static poster with a link to view the full prototype. Requires adding fallback markup.

**CSS:**
```css
@media (max-width: 640px) {
  .prototype-embed__frame,
  .prototype-embed__replay {
    display: none;
  }
  
  .prototype-embed__fallback {
    display: block;
  }
}
```

The fallback markup already exists in the partial (`src/_includes/components/prototype-embed.njk`) for `prefers-reduced-motion`.

#### Option D: Rebuild prototype bundles (Most effort)

Rebuild the prototype bundles in `src/work/img/{case}/prototypes/{slug}/` with responsive CSS. This is the most work but produces the best result.

**Not recommended for initial fix** — requires external build process.

### Testing Steps

1. Navigate to `http://localhost:8080/work/dialpad/`
2. Set viewport to 390px width
3. Scroll to "QA at scale" section (Scorecards prototype)
4. Test chosen option:
   - Option A: Verify full UI visible, check readability
   - Option B: Verify horizontal scroll works smoothly
   - Option C: Verify static poster displays with link
5. Repeat for AnalyticsGPT and Launchpad on `/work/dialpad-team/`

---

## Task 4: Click-to-Play Video Posters (Optional)

**Priority:** Low  
**Effort:** CSS-only

### Problem

Click-to-play video posters use same `object-fit: cover` pattern.

### Current CSS (lines ~3737-3744)

```css
.click-to-play__poster,
.click-to-play__video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
```

### Proposed Fix

Same approach as prototype embeds—choose scale-down or horizontal scroll.

### Testing Steps

1. Find a case study page with click-to-play video
2. Test on mobile viewport
3. Verify poster shows full content

---

## Implementation Order

1. **Task 1** (Homepage thumbnails) — Quick CSS fix, high visibility
2. **Task 2** (Chatbot verify) — Just check if it works
3. **Task 3** (Prototype embeds) — Pick one option, implement, get feedback
4. **Task 4** (Click-to-play) — If time permits

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/assets/css/styles.css` | Main stylesheet, all CSS changes go here |
| `src/index.njk` | Homepage template |
| `src/work/2021-01-01-dialpad.md` | Dialpad case study (Scorecards) |
| `src/work/2022-01-01-dialpad-team.md` | Dialpad Team case study (AnalyticsGPT, Launchpad, Chatbot) |
| `src/work/2020-01-01-stack-overflow.md` | Stack Overflow case study (responsive reference) |
| `src/_includes/components/prototype-embed.njk` | Prototype embed partial |
| `src/_includes/components/click-to-play-video.njk` | Click-to-play partial |

---

## Dev Server Commands

```bash
# Start dev server with live reload
npm start

# Server runs at http://localhost:8080
# CSS changes are picked up automatically by the watcher
```

---

## Testing Checklist

- [ ] Homepage thumbnails show full content on mobile
- [ ] Chatbot prototype fits mobile viewport
- [ ] Scorecards prototype has acceptable mobile experience
- [ ] AnalyticsGPT prototype has acceptable mobile experience
- [ ] Launchpad prototype has acceptable mobile experience
- [ ] No regressions on desktop viewport (1440px+)
- [ ] No regressions on tablet viewport (768px)
