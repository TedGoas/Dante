(function () {
  const TOTAL = 4961;
  const ACCEPTANCE_PCT = 57;
  const VOTES = 1909;
  const SEGMENTS = [
    { id: 'accepted', value: 2811 },
    { id: 'answered', value: 1609 },
    { id: 'unanswered', value: 541 }
  ];
  const CIRC = 2 * Math.PI * 68;
  const COUNT_MS = 620;
  const DONUT_MS = 700;
  const LINE_MS = 700;
  const LINE_DELAY = 280;
  const EMPTY_AT = 900;
  const TOTAL_MS = EMPTY_AT + 350;

  const app = document.getElementById('app');
  const totalEl = document.getElementById('ot-total');
  const votesEl = document.getElementById('ot-votes');
  const emptyCard = document.getElementById('ot-empty');
  const clipRect = app.querySelector('.ot__line-clip-rect');
  const legendButtons = Array.from(app.querySelectorAll('.ot__legend-button'));
  const arcs = {
    accepted: app.querySelector('[data-arc="accepted"]'),
    answered: app.querySelector('[data-arc="answered"]'),
    unanswered: app.querySelector('[data-arc="unanswered"]')
  };
  const valueEls = {
    accepted: document.getElementById('ot-accepted'),
    answered: document.getElementById('ot-answered'),
    unanswered: document.getElementById('ot-unanswered')
  };

  let runToken = 0;
  let timers = [];
  let rafId = 0;
  let pinnedSlice = null;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function formatCount(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function formatPct(n) {
    return `${Math.round(n)}%`;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }

  function segmentLengths() {
    let offset = 0;
    return SEGMENTS.map((seg) => {
      const len = (seg.value / TOTAL) * CIRC;
      const item = { id: seg.id, len, offset };
      offset += len;
      return item;
    });
  }

  function setArcs(progress) {
    segmentLengths().forEach((seg, index) => {
      const arc = arcs[seg.id];
      if (!arc) {
        return;
      }
      const start = index * 0.12;
      const local = clamp01((progress - start) / Math.max(0.001, 1 - start * 0.45));
      const visible = seg.len * easeOutQuart(local);
      arc.style.strokeDasharray = `${visible} ${CIRC}`;
      arc.style.strokeDashoffset = String(-seg.offset);
    });
  }

  function setLineReveal(progress) {
    if (!clipRect) {
      return;
    }
    const width = 220 * easeOutQuart(clamp01(progress));
    clipRect.setAttribute('width', String(Math.max(0.001, width)));
  }

  function setEmptyVisible(visible) {
    if (!emptyCard) {
      return;
    }
    emptyCard.classList.toggle('is-visible', visible);
  }

  function setNumbers(progress) {
    const t = easeOutCubic(clamp01(progress));
    SEGMENTS.forEach((seg) => {
      const el = valueEls[seg.id];
      if (el) {
        el.textContent = formatCount(seg.value * t);
      }
    });
    if (totalEl) {
      totalEl.textContent = formatPct(ACCEPTANCE_PCT * t);
    }
    if (votesEl) {
      votesEl.textContent = formatCount(VOTES * t);
    }
  }

  function syncSliceIsolation() {
    const isolated = pinnedSlice != null;
    app.classList.toggle('is-slice-isolated', isolated);

    SEGMENTS.forEach((seg) => {
      const arc = arcs[seg.id];
      if (!arc) {
        return;
      }
      const isActive = pinnedSlice === seg.id;
      arc.classList.toggle('is-active', isolated && isActive);
      arc.classList.toggle('is-faded', isolated && !isActive);
    });

    legendButtons.forEach((button) => {
      const sliceId = button.getAttribute('data-slice');
      const isActive = pinnedSlice === sliceId;
      button.classList.toggle('is-faded', isolated && !isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function clearSliceIsolation() {
    pinnedSlice = null;
    syncSliceIsolation();
  }

  function setFinishedFrame() {
    app.classList.remove('is-empty', 'is-playing');
    setArcs(1);
    setLineReveal(1);
    setNumbers(1);
    setEmptyVisible(true);
    syncSliceIsolation();
  }

  function setEmptyFrame() {
    app.classList.add('is-empty');
    app.classList.remove('is-playing');
    clearSliceIsolation();
    setArcs(0);
    setLineReveal(0);
    setNumbers(0);
    setEmptyVisible(false);
  }

  function runEntrance(token) {
    setEmptyFrame();

    if (prefersReducedMotion()) {
      setFinishedFrame();
      return;
    }

    app.classList.remove('is-empty');
    app.classList.add('is-playing');

    const start = performance.now();

    function tick(now) {
      if (token !== runToken) {
        return;
      }

      const elapsed = now - start;
      setNumbers(elapsed / COUNT_MS);
      setArcs(elapsed / DONUT_MS);
      setLineReveal((elapsed - LINE_DELAY) / LINE_MS);

      if (elapsed >= EMPTY_AT) {
        setEmptyVisible(true);
      }

      if (elapsed < TOTAL_MS) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      rafId = 0;
      setFinishedFrame();
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    clearSliceIsolation();
    setFinishedFrame();
  }

  function playDemo() {
    resetDemo();
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runEntrance(token);
      }
    }, 80);
    timers.push(id);
  }

  legendButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const sliceId = button.getAttribute('data-slice');
      pinnedSlice = pinnedSlice === sliceId ? null : sliceId;
      syncSliceIsolation();
    });
  });

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

  setFinishedFrame();
})();
