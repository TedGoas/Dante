(function () {
  /*
   * Absolute segment heights from th-canfield-graph.svg (baseline y=284).
   * Tooltip counts are fabricated to track those stacks; Jan 16 keeps the
   * real crop values from the original SVG.
   */
  const COLUMNS = [
    {
      date: 'January 2, 2020',
      missed: 28,
      late: 22,
      upcoming: 37,
      on: 108,
      counts: { on: 98, upcoming: 28, late: 32, missed: 14 }
    },
    {
      date: 'January 9, 2020',
      missed: 38,
      late: 41,
      upcoming: 52,
      on: 95,
      counts: { on: 88, upcoming: 42, late: 48, missed: 20 }
    },
    {
      date: 'January 16, 2020',
      missed: 19,
      late: 41,
      upcoming: 42,
      on: 110,
      counts: { on: 114, upcoming: 35, late: 55, missed: 11 }
    },
    {
      date: 'January 19, 2020',
      missed: 28,
      late: 59,
      upcoming: 36,
      on: 129,
      counts: { on: 132, upcoming: 30, late: 68, missed: 16 }
    },
    {
      date: 'January 22, 2020',
      missed: 38,
      late: 41,
      upcoming: 52,
      on: 95,
      counts: { on: 90, upcoming: 40, late: 46, missed: 22 }
    },
    {
      date: 'January 25, 2020',
      missed: 28,
      late: 59,
      upcoming: 36,
      on: 129,
      counts: { on: 128, upcoming: 32, late: 70, missed: 15 }
    },
    {
      date: 'January 28, 2020',
      missed: 19,
      late: 41,
      upcoming: 42,
      on: 110,
      counts: { on: 108, upcoming: 36, late: 52, missed: 12 }
    },
    {
      date: 'January 31, 2020',
      missed: 28,
      late: 22,
      upcoming: 37,
      on: 108,
      counts: { on: 102, upcoming: 26, late: 30, missed: 16 }
    }
  ];

  /*
   * Sequence beats (ms) — tweak here only.
   * play delay → soft exit fade → collapse → staggered grow → tips ready
   */
  const PLAY_DELAY_MS = 60;
  const START_DELAY_MS = 40;
  const EXIT_MS = 160;
  const BAR_STAGGER_MS = 55;
  const BAR_GROW_MS = 550;
  const TIPS_READY_BUFFER_MS = 40;
  const TIP_MS = 140;
  const SETTLE_MS = 200;
  const TIP_PAD = 8;
  const TIP_GAP = 10;

  const app = document.getElementById('app');
  const bars = document.getElementById('bars');
  const tooltip = document.getElementById('tooltip');
  const tipDate = document.getElementById('tooltip-date');
  const tipOn = document.getElementById('tooltip-on');
  const tipUpcoming = document.getElementById('tooltip-upcoming');
  const tipLate = document.getElementById('tooltip-late');
  const tipMissed = document.getElementById('tooltip-missed');
  const tipTotal = document.getElementById('tooltip-total');

  let columnEls = [];
  let activeCol = null;
  let runToken = 0;
  let timers = [];
  let tipsReady = true;
  let tipHideTimer = 0;
  let tipWarm = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
    if (tipHideTimer) {
      window.clearTimeout(tipHideTimer);
      tipHideTimer = 0;
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

  function segment(name, height) {
    const el = document.createElement('div');
    el.className = `vc__seg vc__seg--${name}`;
    el.style.height = `${height}px`;
    return el;
  }

  function totalCounts(counts) {
    return counts.on + counts.upcoming + counts.late + counts.missed;
  }

  function fillTooltip(data) {
    tipDate.textContent = data.date;
    tipOn.textContent = String(data.counts.on);
    tipUpcoming.textContent = String(data.counts.upcoming);
    tipLate.textContent = String(data.counts.late);
    tipMissed.textContent = String(data.counts.missed);
    tipTotal.textContent = String(totalCounts(data.counts));
  }

  function positionTooltip(col) {
    const tipWidth = tooltip.offsetWidth || 176;
    const tipHeight = tooltip.offsetHeight || 168;
    const appBox = app.getBoundingClientRect();
    const colBox = col.getBoundingClientRect();
    const colLeft = colBox.left - appBox.left;
    const colRight = colBox.right - appBox.left;
    const colTop = colBox.top - appBox.top;
    const colBottom = colBox.bottom - appBox.top;
    const colCenterX = colLeft + colBox.width / 2;
    const colMidY = colTop + colBox.height / 2;
    const maxLeft = appBox.width - tipWidth - TIP_PAD;
    const maxTop = appBox.height - tipHeight - TIP_PAD;
    const barOnRight = colCenterX >= appBox.width / 2;

    let left;
    let top;

    // Edge bars: park the tooltip on the open side so it stays in-frame.
    if (barOnRight) {
      left = colLeft - tipWidth - TIP_GAP;
      if (left < TIP_PAD) {
        left = TIP_PAD;
      }
    } else {
      left = colRight + TIP_GAP;
      if (left > maxLeft) {
        left = Math.max(TIP_PAD, maxLeft);
      }
    }

    // Prefer vertically centered on the bar; fall back above, then below.
    top = colMidY - tipHeight / 2;
    if (top < TIP_PAD) {
      top = colTop - tipHeight - TIP_GAP;
    }
    if (top < TIP_PAD) {
      top = colBottom + TIP_GAP;
    }

    left = Math.max(TIP_PAD, Math.min(left, maxLeft));
    top = Math.max(TIP_PAD, Math.min(top, maxTop));

    tooltip.style.setProperty('--vc-tip-x', `${Math.round(left)}px`);
    tooltip.style.setProperty('--vc-tip-y', `${Math.round(top)}px`);
  }

  function hideTooltipImmediate() {
    if (tipHideTimer) {
      window.clearTimeout(tipHideTimer);
      tipHideTimer = 0;
    }
    tooltip.classList.remove('is-visible');
    tooltip.hidden = true;
    tipWarm = false;
    app.classList.remove('is-tip-warm');
  }

  function clearActive(immediate) {
    activeCol = null;
    app.classList.remove('has-active');
    columnEls.forEach((col) => col.classList.remove('is-active'));

    if (immediate || prefersReducedMotion() || tooltip.hidden) {
      hideTooltipImmediate();
      return;
    }

    tooltip.classList.remove('is-visible');
    if (tipHideTimer) {
      window.clearTimeout(tipHideTimer);
    }
    tipHideTimer = window.setTimeout(() => {
      tipHideTimer = 0;
      if (!tooltip.classList.contains('is-visible')) {
        tooltip.hidden = true;
        tipWarm = false;
        app.classList.remove('is-tip-warm');
      }
    }, TIP_MS);
  }

  function setTipsReady(ready) {
    tipsReady = ready;
    if (!ready) {
      clearActive(true);
      return;
    }

    const hovered = columnEls.find((col) => col.matches(':hover'));
    const focused = columnEls.find((col) => col === document.activeElement);
    if (hovered) {
      activateCol(hovered);
    } else if (focused) {
      activateCol(focused);
    }
  }

  function activateCol(col) {
    if (!tipsReady) {
      return;
    }

    const index = Number(col.dataset.index);
    const data = COLUMNS[index];

    if (!data) {
      return;
    }

    if (tipHideTimer) {
      window.clearTimeout(tipHideTimer);
      tipHideTimer = 0;
    }

    activeCol = col;
    app.classList.add('has-active');
    columnEls.forEach((item) => {
      item.classList.toggle('is-active', item === col);
    });

    fillTooltip(data);
    tooltip.hidden = false;
    // Measure after unhiding so width/height are real.
    positionTooltip(col);
    void tooltip.offsetWidth;
    tooltip.classList.add('is-visible');
    if (!tipWarm) {
      tipWarm = true;
      app.classList.add('is-tip-warm');
    }
  }

  function clearBarMotionClasses() {
    app.classList.remove('is-playing', 'is-exiting', 'is-resetting');
    columnEls.forEach((col) => {
      col.classList.remove('is-growing');
      col.style.removeProperty('--vc-bar-delay');
    });
  }

  function setRestingFrame(immediate) {
    clearBarMotionClasses();
    if (immediate) {
      clearActive(true);
    } else {
      clearActive(false);
    }
    setTipsReady(true);
  }

  async function runGrow(token) {
    clearActive(true);
    setTipsReady(false);
    clearBarMotionClasses();

    if (prefersReducedMotion()) {
      setTipsReady(true);
      return;
    }

    await wait(START_DELAY_MS, token);
    if (token !== runToken) {
      return;
    }

    // Soft exit: fade the finished bars, then collapse while faded.
    app.classList.add('is-exiting');
    await wait(EXIT_MS, token);
    if (token !== runToken) {
      return;
    }

    columnEls.forEach((col, index) => {
      col.classList.add('is-growing');
      col.style.setProperty('--vc-bar-delay', `${index * BAR_STAGGER_MS}ms`);
    });

    // Double rAF so scaleY(0) sticks before grow without a visible snap.
    await new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });
    if (token !== runToken) {
      return;
    }

    app.classList.remove('is-exiting');
    app.classList.add('is-playing');

    const growTotal =
      BAR_STAGGER_MS * Math.max(0, columnEls.length - 1) +
      BAR_GROW_MS +
      TIPS_READY_BUFFER_MS;
    await wait(growTotal, token);
    if (token !== runToken) {
      return;
    }

    // Drop play classes so sibling dim can win on hover.
    app.classList.remove('is-playing');
    columnEls.forEach((col) => {
      col.classList.remove('is-growing');
      col.style.removeProperty('--vc-bar-delay');
    });
    setTipsReady(true);
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();

    if (prefersReducedMotion() || !app.classList.contains('is-playing')) {
      setRestingFrame(true);
      return;
    }

    // Short settle instead of a full grow catch-up.
    app.classList.add('is-resetting');
    app.classList.remove('is-playing', 'is-exiting');
    columnEls.forEach((col) => {
      col.classList.remove('is-growing');
      col.style.setProperty('--vc-bar-delay', '0ms');
    });
    clearActive(true);
    setTipsReady(false);

    const token = runToken;
    const id = window.setTimeout(() => {
      if (token !== runToken) {
        return;
      }
      app.classList.remove('is-resetting');
      setTipsReady(true);
    }, SETTLE_MS);
    timers.push(id);
  }

  function playDemo() {
    runToken += 1;
    clearTimers();
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runGrow(token);
      }
    }, PLAY_DELAY_MS);
    timers.push(id);
  }

  function renderBars() {
    bars.replaceChildren();
    columnEls = COLUMNS.map((col, index) => {
      const wrap = document.createElement('button');
      wrap.type = 'button';
      wrap.className = 'vc__col';
      wrap.dataset.index = String(index);
      wrap.setAttribute('aria-label', `${col.date} visit status`);

      wrap.append(
        segment('missed', col.missed),
        segment('late', col.late),
        segment('upcoming', col.upcoming),
        segment('on', col.on)
      );

      wrap.addEventListener('pointerenter', () => activateCol(wrap));
      wrap.addEventListener('focus', () => activateCol(wrap));

      bars.appendChild(wrap);
      return wrap;
    });
  }

  bars.addEventListener('pointerleave', (event) => {
    if (!bars.contains(event.relatedTarget)) {
      clearActive(false);
    }
  });

  app.addEventListener('focusout', (event) => {
    if (!app.contains(event.relatedTarget)) {
      clearActive(false);
    }
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

  renderBars();
  setRestingFrame(true);
})();
