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

  const CASE_HREF = '/work/canfield/';
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

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
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

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
  }

  function clearActive() {
    activeCol = null;
    app.classList.remove('has-active');
    columnEls.forEach((col) => col.classList.remove('is-active'));
    tooltip.classList.remove('is-visible');
    tooltip.hidden = true;
  }

  function activateCol(col) {
    const index = Number(col.dataset.index);
    const data = COLUMNS[index];

    if (!data) {
      return;
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
    tooltip.classList.add('is-visible');
  }

  function setRestingFrame() {
    app.classList.remove('is-playing');
    columnEls.forEach((col) => {
      col.classList.remove('is-growing');
      col.style.transitionDelay = '0ms';
    });
    clearActive();
  }

  async function runGrow(token) {
    setRestingFrame();

    if (prefersReducedMotion()) {
      columnEls.forEach((col) => col.classList.add('is-growing'));
      app.classList.add('is-playing');
      return;
    }

    await wait(40, token);
    if (token !== runToken) {
      return;
    }

    columnEls.forEach((col, index) => {
      col.classList.add('is-growing');
      col.style.transitionDelay = `${index * 55}ms`;
    });

    // Force layout so the scaleY(0) state sticks before we grow.
    void bars.offsetHeight;

    app.classList.add('is-playing');

    // Drop stagger delays after the grow so bar-hover opacity snaps together.
    await wait(55 * columnEls.length + 580, token);
    if (token !== runToken) {
      return;
    }

    columnEls.forEach((col) => {
      col.style.transitionDelay = '0ms';
    });
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    setRestingFrame();
  }

  function playDemo() {
    resetDemo();
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runGrow(token);
      }
    }, 80);
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
      clearActive();
    }
  });

  app.addEventListener('focusout', (event) => {
    if (!app.contains(event.relatedTarget)) {
      clearActive();
    }
  });

  // Iframe captures clicks — send the parent tile through to the case study.
  app.addEventListener('click', () => {
    if (window.parent && window.parent !== window) {
      window.parent.location.href = CASE_HREF;
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
  setRestingFrame();
})();
