(function () {
  const TOTAL = 4961;
  const ACCEPTANCE_PCT = 57;
  const VOTES = 1909;
  const SEGMENTS = [
    { id: 'accepted', label: 'Accepted', value: 2811 },
    { id: 'answered', label: 'Answered', value: 1609 },
    { id: 'unanswered', label: 'Unanswered', value: 541 }
  ];
  const CIRC = 2 * Math.PI * 68;
  const DONUT_CX = 90;
  const DONUT_CY = 90;
  const DONUT_R = 68;
  const DONUT_STROKE = 22;
  const COUNT_MS = 620;
  const DONUT_MS = 700;
  const LINE_MS = 700;
  const LINE_DELAY = 280;
  const EMPTY_AT = 900;
  const TOTAL_MS = EMPTY_AT + 350;

  // Path vertices (viewBox 220×110); Y maps 0→100 / 110→0.
  const VOTE_POINTS = [
    { x: 0, y: 42, label: 'Oct 1', value: 62, delta: 6, trend: 'down' },
    { x: 36, y: 55, label: 'Oct 5', value: 50, delta: 11, trend: 'down' },
    { x: 73, y: 38, label: 'Oct 10', value: 65, delta: 12, trend: 'up' },
    { x: 110, y: 48, label: 'Oct 15', value: 56, delta: 8, trend: 'down' },
    { x: 147, y: 52, label: 'Oct 20', value: 53, delta: 5, trend: 'down' },
    { x: 183, y: 60, label: 'Oct 24', value: 45, delta: 11, trend: 'down' },
    { x: 220, y: 72, label: 'Oct 29', value: 35, delta: 11, trend: 'down' }
  ];

  const app = document.getElementById('app');
  const totalEl = document.getElementById('ot-total');
  const votesEl = document.getElementById('ot-votes');
  const emptyCard = document.getElementById('ot-empty');
  const clipRect = app.querySelector('.ot__line-clip-rect');
  const donutRoot = app.querySelector('.ot__donut');
  const donutSvg = app.querySelector('.ot__donut-svg');
  const donutTooltip = document.getElementById('ot-donut-tooltip');
  const donutTipName = document.getElementById('ot-donut-tooltip-name');
  const donutTipCount = document.getElementById('ot-donut-tooltip-count');
  const donutTipPct = document.getElementById('ot-donut-tooltip-pct');
  const votesHit = document.getElementById('ot-votes-hit');
  const votesHover = document.getElementById('ot-votes-hover');
  const votesTipDate = document.getElementById('ot-votes-tooltip-date');
  const votesTipValue = document.getElementById('ot-votes-tooltip-value');
  const votesTipDelta = document.getElementById('ot-votes-tooltip-delta');
  const votesTipDeltaValue = document.getElementById('ot-votes-tooltip-delta-value');
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
  let hoverSlice = null;
  let tooltipsReady = false;

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

  function formatSegmentPct(value) {
    return `${Math.round((value / TOTAL) * 100)}%`;
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
      const item = {
        id: seg.id,
        label: seg.label,
        value: seg.value,
        len,
        offset,
        startAngle: (offset / CIRC) * Math.PI * 2,
        endAngle: ((offset + len) / CIRC) * Math.PI * 2
      };
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

  function activeSliceId() {
    return hoverSlice != null ? hoverSlice : pinnedSlice;
  }

  function syncSliceIsolation() {
    const activeId = activeSliceId();
    const isolated = activeId != null;
    app.classList.toggle('is-slice-isolated', isolated);

    SEGMENTS.forEach((seg) => {
      const arc = arcs[seg.id];
      if (!arc) {
        return;
      }
      const isActive = activeId === seg.id;
      arc.classList.toggle('is-active', isolated && isActive);
      arc.classList.toggle('is-faded', isolated && !isActive);
    });

    legendButtons.forEach((button) => {
      const sliceId = button.getAttribute('data-slice');
      const isPinned = pinnedSlice === sliceId;
      const isActive = activeId === sliceId;
      button.classList.toggle('is-faded', isolated && !isActive);
      button.setAttribute('aria-pressed', isPinned ? 'true' : 'false');
    });
  }

  function hideDonutTooltip() {
    if (!donutTooltip) {
      return;
    }
    donutTooltip.classList.remove('is-active');
    donutTooltip.setAttribute('aria-hidden', 'true');
  }

  function showDonutTooltip(seg) {
    if (!donutTooltip || !donutRoot || !tooltipsReady) {
      return;
    }

    const mid = (seg.startAngle + seg.endAngle) / 2;
    // SVG is rotated -90deg; screen angle = mid - π/2 from +x.
    const screenAngle = mid - Math.PI / 2;
    const tipW = 120;
    const tipH = 44;
    const radius = DONUT_R;
    let tipX = DONUT_CX + Math.cos(screenAngle) * radius - tipW / 2;
    let tipY = DONUT_CY + Math.sin(screenAngle) * radius - tipH / 2;
    tipX = Math.max(4, Math.min(tipX, 180 - tipW - 4));
    tipY = Math.max(4, Math.min(tipY, 180 - tipH - 4));

    donutTipName.textContent = seg.label;
    donutTipCount.textContent = formatCount(seg.value);
    donutTipPct.textContent = formatSegmentPct(seg.value);
    donutTooltip.style.left = `${Math.round(tipX)}px`;
    donutTooltip.style.top = `${Math.round(tipY)}px`;
    donutTooltip.classList.add('is-active');
    donutTooltip.setAttribute('aria-hidden', 'false');
  }

  function syncDonutTooltip() {
    if (!tooltipsReady) {
      hideDonutTooltip();
      return;
    }

    const activeId = activeSliceId();
    if (!activeId) {
      hideDonutTooltip();
      return;
    }

    const seg = segmentLengths().find((item) => item.id === activeId);
    if (!seg) {
      hideDonutTooltip();
      return;
    }

    showDonutTooltip(seg);
  }

  function hideVotesTooltip() {
    if (!votesHover) {
      return;
    }
    votesHover.classList.remove('is-active', 'is-flip');
    votesHover.setAttribute('aria-hidden', 'true');
  }

  function showVotesTooltip(point, plotWidth) {
    if (!votesHover || !tooltipsReady) {
      return;
    }

    const ratio = point.x / 220;
    const leftPx = ratio * plotWidth;
    const flip = ratio > 0.5;

    votesTipDate.textContent = point.label;
    votesTipValue.textContent = `${point.value} votes`;
    votesTipDeltaValue.textContent = `${point.delta}%`;
    votesTipDelta.classList.toggle('ot__delta--down', point.trend === 'down');
    votesTipDelta.classList.toggle('ot__delta--up', point.trend === 'up');

    votesHover.style.left = `${Math.round(leftPx)}px`;
    votesHover.classList.toggle('is-flip', flip);
    votesHover.classList.add('is-active');
    votesHover.setAttribute('aria-hidden', 'false');
  }

  function clearHoverState() {
    hoverSlice = null;
    hideDonutTooltip();
    hideVotesTooltip();
    syncSliceIsolation();
  }

  function setTooltipsReady(ready) {
    tooltipsReady = ready;
    app.classList.toggle('is-tooltips-ready', ready);
    if (!ready) {
      hoverSlice = null;
      hideDonutTooltip();
      hideVotesTooltip();
      syncSliceIsolation();
      return;
    }
    syncDonutTooltip();
  }

  function clearSliceIsolation() {
    pinnedSlice = null;
    hoverSlice = null;
    syncSliceIsolation();
    hideDonutTooltip();
  }

  function setFinishedFrame() {
    app.classList.remove('is-empty', 'is-playing');
    setArcs(1);
    setLineReveal(1);
    setNumbers(1);
    setEmptyVisible(true);
    syncSliceIsolation();
    setTooltipsReady(true);
  }

  function setEmptyFrame() {
    app.classList.add('is-empty');
    app.classList.remove('is-playing');
    clearSliceIsolation();
    setTooltipsReady(false);
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
    setTooltipsReady(false);

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
    hideVotesTooltip();
    setFinishedFrame();
  }

  function playDemo() {
    runToken += 1;
    clearTimers();
    clearSliceIsolation();
    hideVotesTooltip();
    setTooltipsReady(false);
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runEntrance(token);
      }
    }, 80);
    timers.push(id);
  }

  function hitTestDonut(event) {
    if (!donutSvg || !tooltipsReady) {
      return null;
    }

    const rect = donutSvg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 180;
    const y = ((event.clientY - rect.top) / rect.height) * 180;
    const dx = x - DONUT_CX;
    const dy = y - DONUT_CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const inner = DONUT_R - DONUT_STROKE / 2;
    const outer = DONUT_R + DONUT_STROKE / 2;

    if (dist < inner || dist > outer) {
      return null;
    }

    // Match SVG rotate(-90deg): angle 0 starts at top, clockwise in SVG dash space.
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) {
      angle += Math.PI * 2;
    }

    return (
      segmentLengths().find((seg) => angle >= seg.startAngle && angle < seg.endAngle) ||
      null
    );
  }

  function nearestVotePoint(event) {
    if (!votesHit) {
      return null;
    }
    const rect = votesHit.getBoundingClientRect();
    if (rect.width <= 0) {
      return null;
    }
    const xRatio = (event.clientX - rect.left) / rect.width;
    const x = xRatio * 220;
    let best = VOTE_POINTS[0];
    let bestDist = Math.abs(best.x - x);
    for (let i = 1; i < VOTE_POINTS.length; i += 1) {
      const dist = Math.abs(VOTE_POINTS[i].x - x);
      if (dist < bestDist) {
        best = VOTE_POINTS[i];
        bestDist = dist;
      }
    }
    return { point: best, plotWidth: rect.width };
  }

  if (donutSvg) {
    donutSvg.addEventListener('pointermove', (event) => {
      if (!tooltipsReady) {
        return;
      }
      const hit = hitTestDonut(event);
      const nextId = hit ? hit.id : null;
      if (nextId === hoverSlice) {
        if (nextId) {
          syncDonutTooltip();
        }
        return;
      }
      hoverSlice = nextId;
      syncSliceIsolation();
      syncDonutTooltip();
    });

    donutSvg.addEventListener('pointerleave', () => {
      hoverSlice = null;
      syncSliceIsolation();
      syncDonutTooltip();
    });
  }

  if (votesHit) {
    votesHit.addEventListener('pointermove', (event) => {
      if (!tooltipsReady) {
        return;
      }
      const nearest = nearestVotePoint(event);
      if (!nearest) {
        hideVotesTooltip();
        return;
      }
      showVotesTooltip(nearest.point, nearest.plotWidth);
    });

    votesHit.addEventListener('pointerleave', () => {
      hideVotesTooltip();
    });
  }

  legendButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const sliceId = button.getAttribute('data-slice');
      pinnedSlice = pinnedSlice === sliceId ? null : sliceId;
      syncSliceIsolation();
      syncDonutTooltip();
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
