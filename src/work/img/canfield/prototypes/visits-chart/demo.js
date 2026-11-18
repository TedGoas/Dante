(function () {
  /*
   * Absolute segment heights from th-canfield-graph.svg (baseline y=284).
   * Totals vary: 195 / 226 / 212 / 252 / … so stacks do not all reach the top.
   */
  const COLUMNS = [
    { missed: 28, late: 22, upcoming: 37, on: 108 },
    { missed: 38, late: 41, upcoming: 52, on: 95 },
    { missed: 19, late: 41, upcoming: 42, on: 110 },
    { missed: 28, late: 59, upcoming: 36, on: 129 },
    { missed: 38, late: 41, upcoming: 52, on: 95 },
    { missed: 28, late: 59, upcoming: 36, on: 129 },
    { missed: 19, late: 41, upcoming: 42, on: 110 },
    { missed: 28, late: 22, upcoming: 37, on: 108 }
  ];

  const ACTIVE_INDEX = 2;

  const app = document.getElementById('app');
  const bars = document.getElementById('bars');
  const tooltip = document.getElementById('tooltip');
  const cursor = document.getElementById('cursor');

  let runToken = 0;
  let timers = [];
  let columnEls = [];

  cursor.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5.5 3.5L18.2 11.1L12.4 12.7L15.2 20.1L12.5 21.2L9.6 13.6L5.5 16.8V3.5Z" fill="#111" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';

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

  function renderBars() {
    bars.replaceChildren();
    columnEls = COLUMNS.map((col, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'vc__col';
      wrap.dataset.index = String(index);

      wrap.append(
        segment('missed', col.missed),
        segment('late', col.late),
        segment('upcoming', col.upcoming),
        segment('on', col.on)
      );

      bars.appendChild(wrap);
      return wrap;
    });
  }

  function showCursor(visible) {
    cursor.hidden = !visible;
    cursor.classList.toggle('is-visible', visible);
  }

  function moveCursorTo(el, offsetX, offsetY) {
    const root = app.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const x = box.left - root.left + offsetX;
    const y = box.top - root.top + offsetY;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  function showTooltip(visible) {
    tooltip.hidden = !visible;
    tooltip.classList.toggle('is-visible', visible);
  }

  function setRestingFrame() {
    app.classList.remove('is-playing');
    columnEls.forEach((col) => {
      col.classList.remove('is-growing', 'is-active');
      col.style.transitionDelay = '0ms';
    });
    showTooltip(false);
    showCursor(false);
  }

  async function runDemo(token) {
    setRestingFrame();
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
    await wait(55 * columnEls.length + 580, token);
    if (token !== runToken) {
      return;
    }

    const active = columnEls[ACTIVE_INDEX];
    showCursor(true);
    moveCursorTo(active, 10, 36);
    await wait(420, token);
    if (token !== runToken) {
      return;
    }

    active.classList.add('is-active');
    moveCursorTo(active, 14, 18);
    await wait(280, token);
    if (token !== runToken) {
      return;
    }

    showTooltip(true);
    moveCursorTo(tooltip, 88, 48);
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
        runDemo(token);
      }
    }, 80);
    timers.push(id);
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

  renderBars();
  setRestingFrame();
})();
