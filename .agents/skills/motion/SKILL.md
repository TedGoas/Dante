---
name: motion
description: >-
  Motion and interaction craft for Dante — homepage thumbs, work-gallery
  embeds, site chrome, and future subtle UI motion. Purpose/frequency gates,
  two speeds, ease-out craft, soft exits, staged entrances, tip groups,
  choreography, reduced-motion, and vanilla-only constraints. Use when adding
  or polishing animation, transitions, hover demos, play/reset sequences,
  tooltips with motion, or when the user mentions motion, animation,
  interaction polish, easing, or prefers-reduced-motion.
---

# Motion & interaction

Quiet, purposeful motion. Confidence comes from timing and restraint — not
ornament. Every motion has a cause; simplify to what the viewer needs; the
resting/poster frame must tell the story alone.

Vanilla CSS/JS only; no motion libraries unless Ted explicitly approves.

**Related wiring skills (do not duplicate):**  
[`thumb-prototype`](../thumb-prototype/SKILL.md) · [`prototype-embed`](../prototype-embed/SKILL.md) · [`html-embed`](../html-embed/SKILL.md)  
Homepage host: [`src/assets/js/home-work-thumb.js`](../../../src/assets/js/home-work-thumb.js) (`dante-home-thumb-play` / `reset`).

**Reference bundles (motion already at this bar):**  
[`analyticsgpt-thumb`](../../../src/work/img/dialpad-team/prototypes/analyticsgpt-thumb/) · [`visits-chart`](../../../src/work/img/canfield/prototypes/visits-chart/) · [`overview-thumb`](../../../src/work/img/stackoverflow/prototypes/overview-thumb/)

## When to use

- Polishing or authoring animated thumbs, prototype demos, or site transitions
- Play → hold → reset sequences; tooltip / marker entrance; crossfades
- User asks for motion/interaction upgrades or “make it feel smoother”

## Decide

1. **Purpose first** — Before animating: what does this clarify or respond to?
   If the answer is only “delight” and the control is high-frequency, skip or
   keep near-zero duration.
2. **Frequency gate** — Hover/list/keyboard paths used many times per session:
   prefer **no animation** (or opacity only at ~0–100ms). Never delay
   keyboard-driven selection with motion.
3. **Two speeds** — Site chrome / press feedback stays **under ~300ms** (often
   120–180ms). Storytelling thumbs/demos may run longer (e.g. chart draw
   ~700ms) but stay front-loaded via ease-out; don’t slow feedback to match
   story timing.

## Craft

1. **Soft swaps** — Never hard-cut finished → empty in one paint. Fade/scale
   out (~140–180ms), settle, then build. Keep elements mounted through exit
   when a transition is visible.
2. **Stage before content** — Short chrome/card enter (opacity + small
   `translateY` / `scale`), then the chart or demo motion.
3. **Transform & opacity only** — Prefer `transform` / `opacity`. Avoid
   animating layout (`height`, `top`/`left` thrash). Position tips with CSS
   vars + `translate3d` when gliding.
4. **Ease-out, never ease-in for enter/exit** — Default: `easeOutCubic`
   (`1 - (1 - t)^3`) or CSS `cubic-bezier(0.33, 1, 0.68, 1)`. Built-in CSS
   easings are often too soft — prefer a custom ease-out. Emphatic grow may use
   a stronger ease-out; keep one family per composition.
5. **Enter from scale ≥ ~0.9** — Don’t animate from `scale(0)`; ~0.93–0.97
   feels natural. Press feedback on site chrome: `:active` `scale(0.97)` when
   it fits (not required inside every product-mock iframe).
6. **Origin-aware** — Popovers/menus scale from the trigger
   (`transform-origin` toward the opener), not default center.
7. **Tips are soft** — Opacity + slight scale (~120–160ms). Fade out before
   `hidden`. Gate tips until the entrance finishes; on unlock, activate under
   `:hover` / `:focus` if the pointer is parked.
8. **Tooltip groups** — First tip in a group may delay slightly; once one is
   open, subsequent tips in the same group open **instantly with no enter
   animation**.
9. **Blur last resort** — Tiny `filter: blur()` on a crossfade only when
   opacity alone still feels harsh; never as default decoration.

## Choreograph

1. **Centralize beats** — Named `*_MS` constants + a short beat comment at the
   top of the demo/script. Drive CSS durations from custom properties when JS
   waits on them (no magic `0.55s` vs `580` drift).
2. **Cause** — Every move has a cause. Leave/reset may snap while hidden or use
   a short settle (~200ms); never play a story **backwards** in view (soft exit
   → rebuild, not reverse rewind).
3. **Beats with a payoff** — Demos: about 3–5 beats max; cut motion that doesn’t
   clarify. Overlap related responses; stagger groups ~40–80ms in reading order.
4. **Change only what changed** — Prefer updating the digits or state that
   changed; avoid full-string thrash when cheap. Reserve width for counting
   metrics so siblings don’t slide.
5. **Payoff holds** — After the climax, hold. Homepage thumbs: play once, hold —
   don’t invent loops by default.

```text
play → soft exit finished → staged chrome enter → content build → tips ready → hold
```

Site chrome (nav, markers, small UI) usually only needs soft enter/exit +
reduced-motion — not a full play sequence.

## Ship

1. **Token-safe play/reset** — Bump a run token; clear timers/RAF; strip
   transition classes. Mid-leave reset must not leave stuck dual states.
2. **Reduced motion** — `prefers-reduced-motion: reduce` → jump to the calm
   resting/final frame; kill typewriter, fades, draws, and new transitions in
   CSS `@media`. Host may skip play entirely (homepage thumbs already do).
3. **Resting frame = final** — First paint, poster, and reset target match the
   hold state (no blank flash, no layout jump). The still must tell the story
   alone.

### Host message contracts

| Context | Play | Reset |
|---------|------|-------|
| Homepage work thumbs | `dante-home-thumb-play` | `dante-home-thumb-reset` |
| Work gallery thumbs | `dante-thumb-prototype-play` | `dante-thumb-prototype-reset` |
| Hero prototypes | scroll gate + `autostart`; Replay via `dante-prototype-*` | see prototype-embed |

Do not mix message types across hosts.

### QA checklist

- No vertical jump or hard blank flash on play
- Soft exit → stage → build → tips (or calm chrome-only fade)
- Leave/reset mid-sequence: no stuck classes or dual views
- Tips only after ready; parked hover still tips when unlocked; tip groups instant after first
- `prefers-reduced-motion`: final/resting frame only
- Verify **source** files (not `dist/`); give the exact local URL

## Don't

- Add npm motion libraries (`motion`, GSAP, Framer, Stageshow kit, etc.) without asking
- Import Stageshow React/`film.mjs`/faux cursors as a default for Dante thumbs
- Use marketing “hero loop 10–16s” as a homepage rule — play once on hover, hold
- Animate layout properties or use `!important` to force transitions
- Ease-in for enter/exit, or animate from `scale(0)`
- Delay keyboard selection or high-frequency hover with motion
- Invent a third mobile/host strategy when an existing embed skill already defines one
- Duplicate host/shortcode docs here — link the wiring skill instead

## References

- [Emil Kowalski — You Don’t Need Animations](https://emilkowal.ski/ui/you-dont-need-animations)
- [Emil Kowalski — 7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips)
- [Benji Taylor — Stageshow](https://benji.org/stageshow#for-now)
- [benjitaylor/skills — stageshow](https://github.com/benjitaylor/skills/tree/main/stageshow)
