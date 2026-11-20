(function () {
  const TOTAL = 4961;
  const ACCEPTANCE_PCT = 57;
  const VOTES = 1909;
  const SEGMENTS = [
    { id: 'accepted', label: 'Accepted', value: 2811 },
    { id: 'answered', label: 'Answered', value: 1609 },
    { id: 'unanswered', label: 'Unanswered', value: 541 }
  ];
  const DONUT_CX = 90;
  const DONUT_CY = 90;
  const DONUT_R = 68;
  const DONUT_STROKE = 22;
  const DONUT_R_OUT = DONUT_R + DONUT_STROKE / 2;
  const DONUT_R_IN = DONUT_R - DONUT_STROKE / 2;
  // Visible gap between slices along the mid ring, and corner radius on
  // each annular sector (filled paths — stroke-linecap can't do 4px).
  const ARC_GAP = 3;
  const ARC_CORNER = 4;

  /*
   * Sequence beats (ms) — tweak here only.
   * play delay → soft exit → chrome enter → donut/counters/line →
   * trophy note → empty card → tips ready
   */
  const PLAY_DELAY_MS = 60;
  const EXIT_MS = 150;
  const SETTLE_MS = 180;
  const CHROME_MS = 200;
  const DONUT_MS = 700;
  const LINE_MS = 700;
  const LINE_DELAY = 280;
  const NOTE_AT = DONUT_MS;
  const EMPTY_AT = 900;
  const EMPTY_FADE_MS = 320;
  const HOLD_MS = 40;
  const TIP_MS = 140;
  const TOTAL_MS = EMPTY_AT + EMPTY_FADE_MS + HOLD_MS;

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
  const noteEl = app.querySelector('.ot__note');
  const clipRect = app.querySelector('.ot__line-clip-rect');
  const donutRoot = app.querySelector('.ot__donut');
  const donutSvg = app.querySelector('.ot__donut-svg');
  const donutTooltip = document.getElementById('ot-donut-tooltip');
  const donutTipName = document.getElementById('ot-donut-tooltip-name');
  const donutTipCount = document.getElementById('ot-donut-tooltip-count');
  const donutTipPct = document.getElementById('ot-donut-tooltip-pct');
  const votesHit = document.getElementById('ot-votes-hit');
  const votesHover = document.getElementById('ot-votes-hover');
  const votesMarker = app.querySelector('.ot__hover-marker');
  const votesTipDate = document.getElementById('ot-votes-tooltip-date');
  const votesTipValue = document.getElementById('ot-votes-tooltip-value');
  const votesTipDelta = document.getElementById('ot-votes-tooltip-delta');
  const votesTipDeltaValue = document.getElementById('ot-votes-tooltip-delta-value');
  const votesTipDeltaIcon = votesTipDelta
    ? votesTipDelta.querySelector('.ot__delta-icon img')
    : null;
  const legendButtons = Array.from(app.querySelectorAll('.ot__legend-button'));
  const ARROW_UP =
    '/assets/img/stackoverflow/prototypes/overview-thumb/icon-arrow-up.svg';
  const ARROW_DOWN =
    '/assets/img/stackoverflow/prototypes/overview-thumb/icon-arrow-down.svg';
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

  const SEGMENT_LAYOUT = (function buildSegmentLayout() {
    const gapAngle = ARC_GAP / DONUT_R;
    let angle = 0;
    return SEGMENTS.map((seg) => {
      const fullAngle = (seg.value / TOTAL) * Math.PI * 2;
      const visualStart = angle + gapAngle / 2;
      const visualEnd = angle + fullAngle - gapAngle / 2;
      const item = {
        id: seg.id,
        label: seg.label,
        value: seg.value,
        len: Math.max(0, (visualEnd - visualStart) * DONUT_R),
        offset: visualStart * DONUT_R,
        visualStart,
        visualEnd,
        startAngle: angle,
        endAngle: angle + fullAngle
      };
      angle += fullAngle;
      return item;
    });
  })();

  let runToken = 0;
  let timers = [];
  let rafId = 0;
  let pinnedSlice = null;
  let hoverSlice = null;
  let tooltipsReady = false;
  let votesPointIndex = 0;
  let votesKeyboardActive = false;
  let lastNumberKey = '';
  let tipWarm = false;
  let votesHideTimer = 0;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function syncCssBeats() {
    app.style.setProperty('--ot-exit-ms', `${EXIT_MS}ms`);
    app.style.setProperty('--ot-chrome-ms', `${CHROME_MS}ms`);
    app.style.setProperty('--ot-empty-ms', `${EMPTY_FADE_MS}ms`);
    app.style.setProperty('--ot-tip-ms', `${TIP_MS}ms`);
    app.style.setProperty('--ot-settle-ms', `${SETTLE_MS}ms`);
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (votesHideTimer) {
      window.clearTimeout(votesHideTimer);
      votesHideTimer = 0;
    }
  }

  function wait(ms, token) {
    return new Promise((resolve) => {
      const id = window.setTimeout(() => {
        if (token === runToken) {
          resolve();
        }
      }, ms);
      timers.push(id);
    });
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

  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }

  function polar(r, a) {
    return {
      x: DONUT_CX + r * Math.cos(a),
      y: DONUT_CY + r * Math.sin(a)
    };
  }

  function roundedAnnularSector(a0, a1, corner) {
    const span = a1 - a0;
    if (span <= 0.0001) {
      return '';
    }

    const halfThick = (DONUT_R_OUT - DONUT_R_IN) / 2;
    const maxCorner = Math.min(
      corner,
      halfThick - 0.01,
      (span * DONUT_R_IN) / 2 - 0.01
    );
    if (maxCorner < 0.5) {
      const large = span > Math.PI ? 1 : 0;
      const o0 = polar(DONUT_R_OUT, a0);
      const o1 = polar(DONUT_R_OUT, a1);
      const i1 = polar(DONUT_R_IN, a1);
      const i0 = polar(DONUT_R_IN, a0);
      return [
        `M ${o0.x} ${o0.y}`,
        `A ${DONUT_R_OUT} ${DONUT_R_OUT} 0 ${large} 1 ${o1.x} ${o1.y}`,
        `L ${i1.x} ${i1.y}`,
        `A ${DONUT_R_IN} ${DONUT_R_IN} 0 ${large} 0 ${i0.x} ${i0.y}`,
        'Z'
      ].join(' ');
    }

    const cr = maxCorner;
    const δOut = cr / DONUT_R_OUT;
    const δIn = cr / DONUT_R_IN;
    const large = span - δOut * 2 > Math.PI ? 1 : 0;

    const outerStart = polar(DONUT_R_OUT, a0 + δOut);
    const outerEnd = polar(DONUT_R_OUT, a1 - δOut);
    const innerEnd = polar(DONUT_R_IN, a1 - δIn);
    const innerStart = polar(DONUT_R_IN, a0 + δIn);
    const tipOutStart = polar(DONUT_R_OUT, a0);
    const tipOutEnd = polar(DONUT_R_OUT, a1);
    const tipInEnd = polar(DONUT_R_IN, a1);
    const tipInStart = polar(DONUT_R_IN, a0);
    const radOutStart = polar(DONUT_R_OUT - cr, a0);
    const radOutEnd = polar(DONUT_R_OUT - cr, a1);
    const radInEnd = polar(DONUT_R_IN + cr, a1);
    const radInStart = polar(DONUT_R_IN + cr, a0);

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${DONUT_R_OUT} ${DONUT_R_OUT} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
      `Q ${tipOutEnd.x} ${tipOutEnd.y} ${radOutEnd.x} ${radOutEnd.y}`,
      `L ${radInEnd.x} ${radInEnd.y}`,
      `Q ${tipInEnd.x} ${tipInEnd.y} ${innerEnd.x} ${innerEnd.y}`,
      `A ${DONUT_R_IN} ${DONUT_R_IN} 0 ${large} 0 ${innerStart.x} ${innerStart.y}`,
      `Q ${tipInStart.x} ${tipInStart.y} ${radInStart.x} ${radInStart.y}`,
      `L ${radOutStart.x} ${radOutStart.y}`,
      `Q ${tipOutStart.x} ${tipOutStart.y} ${outerStart.x} ${outerStart.y}`,
      'Z'
    ].join(' ');
  }

  function setArcs(progress) {
    // One continuous sweep from the top: each slice fills only after
    // the head has reached its start angle around the ring.
    const drawnAngle = Math.PI * 2 * easeOutCubic(clamp01(progress));
    SEGMENT_LAYOUT.forEach((seg) => {
      const arc = arcs[seg.id];
      if (!arc) {
        return;
      }
      const visibleEnd = Math.min(seg.visualEnd, Math.max(seg.visualStart, drawnAngle));
      arc.setAttribute(
        'd',
        roundedAnnularSector(seg.visualStart, visibleEnd, ARC_CORNER)
      );
    });
  }

  function setLineReveal(progress) {
    if (!clipRect) {
      return;
    }
    const width = 220 * easeOutCubic(clamp01(progress));
    clipRect.setAttribute('width', String(Math.max(0.001, width)));
  }

  function setEmptyVisible(visible) {
    if (!emptyCard) {
      return;
    }
    emptyCard.classList.toggle('is-visible', visible);
  }

  function setNoteVisible(visible) {
    if (!noteEl) {
      return;
    }
    noteEl.classList.toggle('is-visible', visible);
  }

  function setNumbers(progress) {
    const t = easeOutCubic(clamp01(progress));
    const key = `${Math.round(ACCEPTANCE_PCT * t)}|${Math.round(VOTES * t)}|${Math.round(SEGMENTS[0].value * t)}`;
    if (key === lastNumberKey) {
      return;
    }
    lastNumberKey = key;

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
    if (!tooltipsReady) {
      tipWarm = false;
      app.classList.remove('is-tip-warm');
    }
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
    // Unanswered is the small top slice — sit just inside the ring so the
    // tip hangs slightly below the yellow without covering it.
    const radius = seg.id === 'unanswered' ? DONUT_R * 0.42 : DONUT_R;
    let tipX = DONUT_CX + Math.cos(screenAngle) * radius - tipW / 2;
    let tipY = DONUT_CY + Math.sin(screenAngle) * radius - tipH / 2;
    tipX = Math.max(4, Math.min(tipX, 180 - tipW - 4));
    tipY = Math.max(4, Math.min(tipY, 180 - tipH - 4));

    donutTipName.textContent = seg.label;
    donutTipCount.textContent = formatCount(seg.value);
    donutTipPct.textContent = formatSegmentPct(seg.value);
    donutTooltip.style.setProperty('--ot-tip-x', `${Math.round(tipX)}px`);
    donutTooltip.style.setProperty('--ot-tip-y', `${Math.round(tipY)}px`);
    donutTooltip.classList.add('is-active');
    donutTooltip.setAttribute('aria-hidden', 'false');
    if (!tipWarm) {
      tipWarm = true;
      app.classList.add('is-tip-warm');
    }
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

    const seg = SEGMENT_LAYOUT.find((item) => item.id === activeId);
    if (!seg) {
      hideDonutTooltip();
      return;
    }

    showDonutTooltip(seg);
  }

  function hideVotesTooltip(immediate) {
    if (!votesHover) {
      return;
    }

    if (votesHideTimer) {
      window.clearTimeout(votesHideTimer);
      votesHideTimer = 0;
    }

    votesHover.classList.remove('is-active');
    votesHover.setAttribute('aria-hidden', 'true');

    if (immediate || prefersReducedMotion()) {
      votesHover.classList.remove('is-flip');
      if (!tooltipsReady) {
        tipWarm = false;
        app.classList.remove('is-tip-warm');
      }
      return;
    }

    // Keep is-flip until fade finishes so the tip doesn't jump sides.
    votesHideTimer = window.setTimeout(() => {
      votesHideTimer = 0;
      if (!votesHover.classList.contains('is-active')) {
        votesHover.classList.remove('is-flip');
        if (!tooltipsReady) {
          tipWarm = false;
          app.classList.remove('is-tip-warm');
        }
      }
    }, TIP_MS);
  }

  function syncVotesHitValue(point, index) {
    if (!votesHit || !point) {
      return;
    }
    votesHit.setAttribute('aria-valuenow', String(index));
    votesHit.setAttribute(
      'aria-valuetext',
      `${point.label}, ${point.value} votes, ${point.trend === 'down' ? 'down' : 'up'} ${point.delta}%`
    );
  }

  function showVotesTooltip(point, plotWidth, plotHeight) {
    if (!votesHover || !tooltipsReady) {
      return;
    }

    const ratio = point.x / 220;
    const leftPx = ratio * plotWidth;
    const flip = ratio > 0.5;
    const height = plotHeight || (votesHit ? votesHit.getBoundingClientRect().height : 110);
    const markerTop = (point.y / 110) * height;

    votesTipDate.textContent = point.label;
    votesTipValue.textContent = `${point.value} votes`;
    votesTipDeltaValue.textContent = `${point.delta}%`;
    votesTipDelta.classList.toggle('ot__delta--down', point.trend === 'down');
    votesTipDelta.classList.toggle('ot__delta--up', point.trend === 'up');
    if (votesTipDeltaIcon) {
      votesTipDeltaIcon.src = point.trend === 'up' ? ARROW_UP : ARROW_DOWN;
    }

    votesHover.style.left = `${Math.round(leftPx)}px`;
    if (votesMarker) {
      votesMarker.style.top = `${Math.round(markerTop)}px`;
    }
    if (votesHideTimer) {
      window.clearTimeout(votesHideTimer);
      votesHideTimer = 0;
    }
    votesHover.classList.toggle('is-flip', flip);
    votesHover.classList.add('is-active');
    votesHover.setAttribute('aria-hidden', 'false');
    if (!tipWarm) {
      tipWarm = true;
      app.classList.add('is-tip-warm');
    }
  }

  function activateVotesPoint(index, plotWidth, plotHeight) {
    const clamped = Math.max(0, Math.min(VOTE_POINTS.length - 1, index));
    votesPointIndex = clamped;
    const point = VOTE_POINTS[clamped];
    const width = plotWidth || (votesHit ? votesHit.getBoundingClientRect().width : 0);
    const height = plotHeight || (votesHit ? votesHit.getBoundingClientRect().height : 0);
    if (!point || width <= 0) {
      return;
    }
    syncVotesHitValue(point, clamped);
    showVotesTooltip(point, width, height);
  }

  function setTooltipsReady(ready) {
    tooltipsReady = ready;
    app.classList.toggle('is-tooltips-ready', ready);
    if (!ready) {
      hoverSlice = null;
      tipWarm = false;
      app.classList.remove('is-tip-warm');
      hideDonutTooltip();
      hideVotesTooltip(true);
      syncSliceIsolation();
      return;
    }

    // Re-activate under a parked pointer/focus.
    if (donutSvg && donutSvg.matches(':hover')) {
      const rect = donutSvg.getBoundingClientRect();
      const hit = hitTestDonut({
        clientX: rect.left + rect.width * 0.5,
        clientY: rect.top + rect.height * 0.35
      });
      if (hit) {
        hoverSlice = hit.id;
        syncSliceIsolation();
      }
    }
    syncDonutTooltip();

    if (votesHit && (votesHit.matches(':hover') || document.activeElement === votesHit)) {
      activateVotesPoint(votesPointIndex);
    }
  }

  function clearSliceIsolation() {
    pinnedSlice = null;
    hoverSlice = null;
    syncSliceIsolation();
    hideDonutTooltip();
  }

  function setFinishedFrame() {
    app.classList.remove('is-playing', 'is-exiting', 'is-entering', 'is-resetting');
    lastNumberKey = '';
    setArcs(1);
    setLineReveal(1);
    setNumbers(1);
    setEmptyVisible(true);
    setNoteVisible(true);
    syncSliceIsolation();
    setTooltipsReady(true);
  }

  function setEmptyFrame() {
    app.classList.remove('is-playing', 'is-entering');
    clearSliceIsolation();
    votesKeyboardActive = false;
    setTooltipsReady(false);
    lastNumberKey = '';
    setArcs(0);
    setLineReveal(0);
    setNumbers(0);
    setEmptyVisible(false);
    setNoteVisible(false);
  }

  async function runEntrance(token) {
    if (prefersReducedMotion()) {
      setFinishedFrame();
      return;
    }

    // Soft exit of the finished frame before collapsing to empty.
    setTooltipsReady(false);
    hideVotesTooltip();
    hideDonutTooltip();
    clearSliceIsolation();
    votesKeyboardActive = false;
    app.classList.add('is-exiting');
    await wait(EXIT_MS, token);
    if (token !== runToken) {
      return;
    }

    setEmptyFrame();
    app.classList.remove('is-exiting');
    app.classList.add('is-entering');
    void app.offsetWidth;
    app.classList.add('is-playing');

    await wait(CHROME_MS, token);
    if (token !== runToken) {
      return;
    }

    app.classList.remove('is-entering');

    const start = performance.now();
    let noteShown = false;
    let emptyShown = false;

    await new Promise((resolve) => {
      function tick(now) {
        if (token !== runToken) {
          rafId = 0;
          resolve();
          return;
        }

        const elapsed = now - start;
        const ringProgress = elapsed / DONUT_MS;
        setNumbers(ringProgress);
        setArcs(ringProgress);
        setLineReveal((elapsed - LINE_DELAY) / LINE_MS);

        if (!noteShown && elapsed >= NOTE_AT) {
          noteShown = true;
          setNoteVisible(true);
        }

        if (!emptyShown && elapsed >= EMPTY_AT) {
          emptyShown = true;
          setEmptyVisible(true);
        }

        if (elapsed < TOTAL_MS) {
          rafId = window.requestAnimationFrame(tick);
          return;
        }

        rafId = 0;
        resolve();
      }

      rafId = window.requestAnimationFrame(tick);
    });

    if (token === runToken) {
      setFinishedFrame();
    }
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    clearSliceIsolation();
    votesKeyboardActive = false;
    hideVotesTooltip(true);
    tipWarm = false;
    app.classList.remove('is-tip-warm');

    if (prefersReducedMotion() || !app.classList.contains('is-playing')) {
      setFinishedFrame();
      return;
    }

    app.classList.add('is-resetting');
    app.classList.remove('is-playing', 'is-exiting', 'is-entering');
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token !== runToken) {
        return;
      }
      setFinishedFrame();
    }, SETTLE_MS);
    timers.push(id);
  }

  function playDemo() {
    runToken += 1;
    clearTimers();
    clearSliceIsolation();
    votesKeyboardActive = false;
    hideVotesTooltip(true);
    tipWarm = false;
    app.classList.remove('is-tip-warm', 'is-resetting');
    setTooltipsReady(false);
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runEntrance(token);
      }
    }, PLAY_DELAY_MS);
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
      SEGMENT_LAYOUT.find((seg) => angle >= seg.startAngle && angle < seg.endAngle) ||
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
      if (!tooltipsReady || votesKeyboardActive) {
        return;
      }
      const nearest = nearestVotePoint(event);
      if (!nearest) {
        hideVotesTooltip();
        return;
      }
      const index = VOTE_POINTS.indexOf(nearest.point);
      votesPointIndex = index >= 0 ? index : 0;
      syncVotesHitValue(nearest.point, votesPointIndex);
      showVotesTooltip(
        nearest.point,
        nearest.plotWidth,
        votesHit.getBoundingClientRect().height
      );
    });

    votesHit.addEventListener('pointerleave', () => {
      if (votesKeyboardActive) {
        return;
      }
      hideVotesTooltip();
    });

    votesHit.addEventListener('focus', () => {
      if (!tooltipsReady) {
        return;
      }
      votesKeyboardActive = true;
      activateVotesPoint(votesPointIndex);
    });

    votesHit.addEventListener('blur', () => {
      votesKeyboardActive = false;
      hideVotesTooltip();
    });

    votesHit.addEventListener('keydown', (event) => {
      if (!tooltipsReady) {
        return;
      }

      let next = votesPointIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next += 1;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next -= 1;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = VOTE_POINTS.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      votesKeyboardActive = true;
      activateVotesPoint(next);
    });
  }

  legendButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const sliceId = button.getAttribute('data-slice');
      pinnedSlice = pinnedSlice === sliceId ? null : sliceId;
      hoverSlice = null;
      syncSliceIsolation();
      syncDonutTooltip();
    });

    button.addEventListener('focus', () => {
      if (!tooltipsReady) {
        return;
      }
      hoverSlice = button.getAttribute('data-slice');
      syncSliceIsolation();
      syncDonutTooltip();
    });

    button.addEventListener('blur', () => {
      hoverSlice = null;
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

  syncCssBeats();
  setFinishedFrame();
})();
