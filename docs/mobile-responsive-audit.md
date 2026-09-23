# Mobile Responsive Audit

**Date:** September 23, 2026  
**Branch:** `cursor/mobile-responsive-audit-0770`  
**Viewport tested:** iPhone 14 Pro Max (~430px width)

## Executive Summary

Several images and interactive prototypes on the site are getting **clipped on mobile** due to `object-fit: cover` CSS rules. The Stack Overflow dashboard HTML embed demonstrates the correct responsive approach: fluid layout with `width: 100%` and `height: auto` instead of cover-fit clipping.

---

## Issues by Category

### 1. Homepage Showcase Thumbnails (CLIPPED)

**Location:** Dark band section on homepage (`src/index.njk`)  
**CSS:** `.home-work-grid__media` in `src/assets/css/styles.css`

**Problem CSS:**
```css
.home-work-grid__media {
  object-fit: cover;
  object-position: top left;
}
```

**What's happening:** Grid cells have a fixed aspect ratio, and images are scaled to fill using `object-fit: cover`. On mobile, the single-column layout with `grid-auto-rows: minmax(8rem, auto)` creates cells that don't match image aspect ratios, causing clipping.

**Affected thumbnails:**
- `th-dialpad-scorecards.svg` (600×600) — shows Dialpad inbox UI
- `th-dialpad-analyticsgpt.svg` (300×300) — shows AnalyticsGPT chat
- `th-stackoverflow-dashboard.svg` (600×600) — shows analytics dashboard
- `th-canfield-graph.svg` (600×300) — horizontal chart
- `th-cerberus.svg` (300×300) — logo mark

**Classification:** **Low-hanging fruit** — These are static SVG thumbnails that can scale proportionally. Replace `object-fit: cover` with `object-fit: contain` or change the mobile grid layout to allow cells to size based on content.

---

### 2. Prototype Embeds (CLIPPED)

**Location:** Dialpad and Dialpad Team case study pages  
**CSS:** `.prototype-embed__poster`, `.prototype-embed__frame` in `src/assets/css/styles.css`

**Problem CSS:**
```css
.prototype-embed__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.prototype-embed__frame {
  aspect-ratio: var(--prototype-embed-aspect-ratio);
}
```

**What's happening:** The prototype poster images are being cropped to fit the frame's aspect ratio. The frame maintains the original 1440×900 aspect ratio, but on narrow viewports, the poster image gets heavily cropped.

#### 2a. Scorecards Prototype (`/work/dialpad/`)

**Shortcode:** `{% prototypeEmbed "scorecards", "Dialpad IC scorecards summary design.", 1440, 900 %}`  
**Native size:** 1440×900px  
**Mobile behavior:** Clipped — sidebar navigation and metrics cut off

**Classification:** **Needs discussion** — The prototype bundle is a React/Vue app with fixed-width layout. Making it responsive requires rebuilding the bundle with responsive CSS.

#### 2b. AnalyticsGPT Prototype (`/work/dialpad-team/`)

**Shortcode:** `{% prototypeEmbed "analytics-gpt", "Dialpad AnalyticsGPT design.", 1440, 900 %}`  
**Native size:** 1440×900px  
**Mobile behavior:** Clipped — left sidebar and chat interface cropped

**Classification:** **Needs discussion** — Same issue as Scorecards. The embedded app would need responsive layout work.

#### 2c. Launchpad Prototype (`/work/dialpad-team/`)

**Shortcode:** `{% prototypeEmbed "launchpad", "Dialpad Launchpad design.", 1440, 900 %}`  
**Native size:** 1440×900px (with object-view-box crop)  
**Mobile behavior:** Clipped — sidebar navigation cut off

**Classification:** **Needs discussion** — Same as above.

#### 2d. AI Chatbot Prototype (`/work/dialpad-team/`)

**Shortcode:** `{% prototypeEmbed "ai-chatbot", "Dialpad chatbot design.", 384, 600, "/assets/img/dialpad-team/dialpad-team-chatbot-bg.jpg" %}`  
**Native size:** 384×600px (narrow widget format)  
**Mobile behavior:** **Likely OK** — Already narrow format, may fit mobile without clipping

**Classification:** **Low-hanging fruit** — Narrow widget format already fits mobile viewport. Verify and potentially no changes needed.

---

### 3. Click-to-Play Videos (CLIPPED)

**CSS:** `.click-to-play__poster`, `.click-to-play__video`

**Problem CSS:**
```css
.click-to-play__poster,
.click-to-play__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
```

**Classification:** **Low-hanging fruit for poster** — The poster image can use `object-fit: contain`. The video itself may need different handling depending on content.

---

### 4. Stack Overflow Dashboard HTML Embed (RESPONSIVE ✅)

**Location:** `/work/stack-overflow/`  
**Pattern:** HTML embed with fluid layout

**Why it works:**
```css
.so-dashboard {
  width: 100%;
  max-width: 1266px;
  height: auto;
}
```

The dashboard bundle is built with responsive CSS:
- Uses flexbox and grid with `min-width: 0` to prevent overflow
- Has media queries at 900px and 640px breakpoints
- Components reflow and scale on narrow viewports

**Classification:** **Reference implementation** — Use this pattern for future interactive embeds.

---

## Recommendations

### Low-Hanging Fruit (Straightforward Fixes)

| Item | Fix | Effort |
|------|-----|--------|
| Homepage thumbnails | Change `.home-work-grid__media` from `object-fit: cover` to `contain`, or adjust mobile grid to use `aspect-ratio: auto` with cell height based on image | CSS-only |
| AI Chatbot prototype | Already narrow (384px) — verify it fits, may need no changes | Verify |
| Click-to-play posters | Consider `object-fit: contain` for poster images | CSS-only |

### Medium Effort

| Item | Fix | Effort |
|------|-----|--------|
| Prototype embed frame | Add mobile breakpoint that shows prototype at full width with `aspect-ratio: auto` and allows horizontal scroll, OR scales down with letterboxing | CSS + UX decision |

### Needs Discussion (More Complex)

| Item | Issue | Options |
|------|-------|---------|
| Scorecards prototype | Fixed 1440px layout in bundle | A) Accept horizontal scroll / scale-down on mobile B) Rebuild bundle with responsive CSS C) Show static poster on mobile with "View on desktop" link |
| AnalyticsGPT prototype | Fixed 1440px layout in bundle | Same options as above |
| Launchpad prototype | Fixed 1440px layout in bundle | Same options as above |

---

## Proposed CSS Fix for Homepage Thumbnails

```css
@media (max-width: 640px) {
  .home-work-grid__media {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
  }
  
  .home-work-grid__cell--media {
    aspect-ratio: auto;
    min-height: 0;
  }
  
  .home-work-grid__media-frame {
    position: relative;
    inset: auto;
    aspect-ratio: 1; /* or derive from image */
  }
}
```

---

## Next Steps

1. **Quick win:** Fix homepage thumbnail clipping with CSS media query
2. **Verify:** Check chatbot prototype at mobile width
3. **Discuss:** Decide on approach for Scorecards/AnalyticsGPT/Launchpad prototypes
   - Horizontal scroll with pinch-zoom?
   - CSS scale-down (may become unreadable)?
   - Static poster fallback on mobile?
   - Rebuild bundles with responsive layout?

---

## Screenshots

See `/tmp/computer-use/` for test screenshots:
- `c9c0d.webp` — Homepage showcase clipping
- `27ec7.webp` — Dialpad Scorecards clipping
- `1dda3.webp` — AnalyticsGPT clipping  
- `1ef89.webp` — Stack Overflow responsive (reference)
