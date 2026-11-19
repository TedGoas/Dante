(function () {
  const PROMPT = 'Show me my CSAT';
  const TYPE_MS = 28;
  const THINK_MS = 780;
  const LINE_MS = 700;
  const PLOT_W = 240;
  const PLOT_H = 110;
  const TIP_PAD = 6;

  // viewBox coords; Y maps score 4.4→bottomish / 4.9→topish
  const POINTS = [
    { x: 0, y: 72, label: 'Mon', value: 4.5 },
    { x: 60, y: 58, label: 'Tue', value: 4.6 },
    { x: 120, y: 42, label: 'Wed', value: 4.7 },
    { x: 180, y: 28, label: 'Thu', value: 4.8 },
    { x: 240, y: 36, label: 'Fri', value: 4.7 }
  ];

  const app = document.getElementById('app');
  const composerView = document.getElementById('composer-view');
  const answerView = document.getElementById('answer-view');
  const composerText = document.getElementById('composer-text');
  const caret = document.getElementById('caret');
  const thinking = document.getElementById('thinking');
  const sendBtn = document.getElementById('send-btn');
  const clipRect = app.querySelector('.agt__line-clip-rect');
  const chartHit = document.getElementById('chart-hit');
  const chartHover = document.getElementById('chart-hover');
  const tipDate = document.getElementById('tip-date');
  const tipValue = document.getElementById('tip-value');
  const hoverMarker = app.querySelector('.agt__hover-marker');

  let runToken = 0;
  let timers = [];
  let rafId = 0;
  let tipsReady = false;
  let pointIndex = 0;
  let keyboardActive = false;

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

  function setClipWidth(width) {
    if (clipRect) {
      clipRect.setAttribute('width', String(width));
    }
  }

  function hideTooltip() {
    if (!chartHover) {
      return;
    }
    chartHover.classList.remove('is-visible');
    chartHover.setAttribute('aria-hidden', 'true');
  }

  function setTipsReady(ready) {
    tipsReady = ready;
    if (!ready) {
      hideTooltip();
      keyboardActive = false;
    }
  }

  function showTooltip(point, plotWidth, plotHeight) {
    if (!chartHover || !tipDate || !tipValue || !hoverMarker) {
      return;
    }

    tipDate.textContent = point.label;
    tipValue.textContent = point.value.toFixed(1);
    chartHover.classList.add('is-visible');
    chartHover.setAttribute('aria-hidden', 'false');

    const leftPx = (point.x / PLOT_W) * plotWidth;
    const topPx = (point.y / PLOT_H) * plotHeight;
    chartHover.style.left = `${leftPx}px`;
    hoverMarker.style.top = `${topPx}px`;

    const tip = chartHover.querySelector('.agt__tooltip');
    if (!tip) {
      return;
    }

    tip.style.transform = 'translate(-50%, calc(-100% - 10px))';
    const tipRect = tip.getBoundingClientRect();
    const plotRect = chartHit.getBoundingClientRect();
    let shiftX = 0;
    if (tipRect.left < plotRect.left + TIP_PAD) {
      shiftX = plotRect.left + TIP_PAD - tipRect.left;
    } else if (tipRect.right > plotRect.right - TIP_PAD) {
      shiftX = plotRect.right - TIP_PAD - tipRect.right;
    }
    tip.style.transform = `translate(calc(-50% + ${shiftX}px), calc(-100% - 10px))`;
  }

  function syncHitValue(point, index) {
    if (!chartHit) {
      return;
    }
    chartHit.setAttribute('aria-valuenow', String(index));
    chartHit.setAttribute('aria-valuetext', `${point.label}, ${point.value.toFixed(1)} CSAT`);
  }

  function activatePoint(index) {
    const clamped = Math.max(0, Math.min(POINTS.length - 1, index));
    pointIndex = clamped;
    const point = POINTS[clamped];
    const rect = chartHit.getBoundingClientRect();
    syncHitValue(point, clamped);
    showTooltip(point, rect.width, rect.height);
  }

  function nearestPoint(event) {
    if (!chartHit) {
      return null;
    }
    const rect = chartHit.getBoundingClientRect();
    if (rect.width <= 0) {
      return null;
    }
    const x = ((event.clientX - rect.left) / rect.width) * PLOT_W;
    let best = POINTS[0];
    let bestDist = Math.abs(best.x - x);
    for (let i = 1; i < POINTS.length; i += 1) {
      const dist = Math.abs(POINTS[i].x - x);
      if (dist < bestDist) {
        best = POINTS[i];
        bestDist = dist;
      }
    }
    return { point: best, plotWidth: rect.width, plotHeight: rect.height };
  }

  function setComposerText(text) {
    composerText.textContent = text;
    app.classList.toggle('has-text', text.length > 0);
  }

  function showComposer() {
    app.dataset.view = 'composer';
    composerView.hidden = false;
    answerView.hidden = true;
    thinking.hidden = true;
    app.classList.remove('is-focused', 'is-typing', 'is-sending', 'has-text');
    setComposerText('');
    caret.hidden = true;
    setClipWidth(0);
    setTipsReady(false);
    hideTooltip();
  }

  function showAnswer(instant) {
    app.dataset.view = 'answer';
    composerView.hidden = true;
    answerView.hidden = false;
    thinking.hidden = true;
    app.classList.remove('is-focused', 'is-typing', 'is-sending', 'has-text');
    caret.hidden = true;

    if (instant) {
      setClipWidth(PLOT_W);
      setTipsReady(true);
      return;
    }

    setClipWidth(0);
    setTipsReady(false);
  }

  async function drawChart(token) {
    if (prefersReducedMotion()) {
      setClipWidth(PLOT_W);
      setTipsReady(true);
      return;
    }

    const start = performance.now();

    await new Promise((resolve) => {
      function tick(now) {
        if (token !== runToken) {
          rafId = 0;
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / LINE_MS);
        const eased = 1 - Math.pow(1 - t, 3);
        setClipWidth(PLOT_W * eased);
        if (t < 1) {
          rafId = window.requestAnimationFrame(tick);
          return;
        }
        rafId = 0;
        resolve();
      }
      rafId = window.requestAnimationFrame(tick);
    });

    if (token === runToken) {
      setClipWidth(PLOT_W);
      setTipsReady(true);
    }
  }

  async function typePrompt(token) {
    app.classList.add('is-focused', 'is-typing');
    caret.hidden = false;
    setComposerText('');

    if (prefersReducedMotion()) {
      setComposerText(PROMPT);
      caret.hidden = true;
      return;
    }

    for (let i = 1; i <= PROMPT.length; i += 1) {
      if (token !== runToken) {
        return;
      }
      setComposerText(PROMPT.slice(0, i));
      await wait(TYPE_MS, token);
    }

    caret.hidden = true;
    app.classList.remove('is-typing');
  }

  async function runSequence(token) {
    showComposer();

    if (prefersReducedMotion()) {
      showAnswer(true);
      return;
    }

    await wait(120, token);
    if (token !== runToken) {
      return;
    }

    await typePrompt(token);
    if (token !== runToken) {
      return;
    }

    app.classList.add('is-sending');
    await wait(180, token);
    if (token !== runToken) {
      return;
    }
    app.classList.remove('is-sending');

    app.dataset.view = 'thinking';
    thinking.hidden = false;
    await wait(THINK_MS, token);
    if (token !== runToken) {
      return;
    }

    showAnswer(false);
    await wait(40, token);
    if (token !== runToken) {
      return;
    }

    await drawChart(token);
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    showComposer();
  }

  function playDemo() {
    runToken += 1;
    clearTimers();
    hideTooltip();
    setTipsReady(false);
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token === runToken) {
        runSequence(token);
      }
    }, 60);
    timers.push(id);
  }

  if (chartHit) {
    chartHit.addEventListener('pointermove', (event) => {
      if (!tipsReady || keyboardActive) {
        return;
      }
      const nearest = nearestPoint(event);
      if (!nearest) {
        hideTooltip();
        return;
      }
      const index = POINTS.indexOf(nearest.point);
      pointIndex = index >= 0 ? index : 0;
      syncHitValue(nearest.point, pointIndex);
      showTooltip(nearest.point, nearest.plotWidth, nearest.plotHeight);
    });

    chartHit.addEventListener('pointerleave', () => {
      if (keyboardActive) {
        return;
      }
      hideTooltip();
    });

    chartHit.addEventListener('focus', () => {
      if (!tipsReady) {
        return;
      }
      keyboardActive = true;
      activatePoint(pointIndex);
    });

    chartHit.addEventListener('blur', () => {
      keyboardActive = false;
      hideTooltip();
    });

    chartHit.addEventListener('keydown', (event) => {
      if (!tipsReady) {
        return;
      }

      let next = pointIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next += 1;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next -= 1;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = POINTS.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      keyboardActive = true;
      activatePoint(next);
    });
  }

  // sendBtn is decorative in the thumb demo
  if (sendBtn) {
    sendBtn.addEventListener('click', (event) => event.preventDefault());
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

  showComposer();
})();
