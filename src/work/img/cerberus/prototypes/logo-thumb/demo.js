(function () {
  /*
   * Sequence beats (ms) — tweak here only.
   * hover: sides exit + letters stagger-drop + center scales
   * leave: scrub progress backward from wherever it stopped
   */
  const PLAY_MS = 520;
  const WOLF_EXIT_PX = 340;
  const HEAD_SCALE = 1.3;
  const BRACKET_DRIFT_PX = 24;
  const LETTER_STAGGER = 0.08;
  const LETTER_SPAN = 0.22;
  const LETTER_DROP_PX = 56;
  // Mesh + white fill kick in late (after sides/letters mostly clear).
  const FINISH_START = 0.55;

  const app = document.getElementById('app');
  const letters = app
    ? Array.from(app.querySelectorAll('.cb__letter'))
    : [];

  let progress = 0;
  let direction = 0;
  let rafId = 0;
  let lastTs = 0;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function apply(p) {
    if (!app) {
      return;
    }

    const side = easeOutCubic(clamp(p / 0.7, 0, 1));
    const head = easeOutCubic(p);
    const finish = easeOutCubic(clamp((p - FINISH_START) / (1 - FINISH_START), 0, 1));
    app.style.setProperty('--cb-wolf-left-x', `${-WOLF_EXIT_PX * side}px`);
    app.style.setProperty('--cb-wolf-right-x', `${WOLF_EXIT_PX * side}px`);
    app.style.setProperty('--cb-head-scale', String(1 + (HEAD_SCALE - 1) * head));
    app.style.setProperty('--cb-bracket-left-x', `${-BRACKET_DRIFT_PX * head}px`);
    app.style.setProperty('--cb-bracket-right-x', `${BRACKET_DRIFT_PX * head}px`);
    app.style.setProperty('--cb-mesh-opacity', String(finish));
    app.style.setProperty('--cb-fill-white', `${Math.round(finish * 100)}%`);
    app.style.setProperty('--cb-canvas-opacity', String(1 - finish));

    letters.forEach((el, i) => {
      const start = i * LETTER_STAGGER;
      const local = clamp((p - start) / LETTER_SPAN, 0, 1);
      const drop = easeOutCubic(local);
      el.style.setProperty('--cb-letter-y', `${LETTER_DROP_PX * drop}px`);
      el.style.setProperty('--cb-letter-opacity', String(1 - drop));
    });
  }

  function stopRaf() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastTs = 0;
  }

  function tick(ts) {
    if (!lastTs) {
      lastTs = ts;
    }
    const dt = ts - lastTs;
    lastTs = ts;

    progress = clamp(progress + (direction * dt) / PLAY_MS, 0, 1);
    apply(progress);

    const playing = direction > 0 && progress < 1;
    const reversing = direction < 0 && progress > 0;
    if (playing || reversing) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }

    direction = 0;
    rafId = 0;
    lastTs = 0;
  }

  function start(dir) {
    if (prefersReducedMotion()) {
      progress = dir > 0 ? 1 : 0;
      direction = 0;
      stopRaf();
      apply(progress);
      return;
    }

    if (direction === dir && rafId) {
      return;
    }

    direction = dir;
    stopRaf();
    rafId = window.requestAnimationFrame(tick);
  }

  function playDemo() {
    start(1);
  }

  function resetDemo() {
    start(-1);
  }

  window.addEventListener('message', (event) => {
    const type = event.data?.type;
    if (type === 'dante-home-thumb-play') {
      playDemo();
      return;
    }
    if (type === 'dante-home-thumb-reset') {
      resetDemo();
    }
  });

  apply(0);
})();
