(function () {
  const PROMPT = 'Show me my CSAT';
  const ANSWER_PLAIN = 'Your average CSAT is 4.7, up from 4.5 last week.';
  const ANSWER_HTML =
    'Your average CSAT is <strong>4.7</strong>, up from 4.5 last week.';

  /*
   * Sequence beats (ms) — tweak here only.
   * play delay → type prompt → send pulse → think → view crossfade →
   * stream answer → chart enter → spinner load → line draw → tips ready
   */
  const PLAY_DELAY_MS = 60;
  const START_DELAY_MS = 80;
  const TYPE_MS = 28;
  const ANSWER_TYPE_MS = 14;
  const SEND_PULSE_MS = 180;
  const THINK_MS = 720;
  const VIEW_MS = 300;
  const CHART_ENTER_MS = 220;
  const CHART_LOAD_MS = 550;
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
  const sendBtn = document.getElementById('send-btn');
  const answerCopy = document.getElementById('answer-copy');
  const chart = document.getElementById('chart');
  const chartValue = document.getElementById('chart-value');
  const chartLoading = document.getElementById('chart-loading');
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

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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

  function charDelay(base, ch) {
    let ms = base + (Math.random() * 8 - 4);
    if (ch === ' ') {
      ms += 8;
    }
    if (ch === ',' || ch === '.') {
      ms += 36;
    }
    return Math.max(8, Math.round(ms));
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

  function setAnswerFinal() {
    if (answerCopy) {
      answerCopy.innerHTML = ANSWER_HTML;
    }
  }

  function clearAnswerCopy() {
    if (answerCopy) {
      answerCopy.textContent = '';
    }
  }

  function setChartVisible(on, entering) {
    if (!chart) {
      return;
    }

    if (!on) {
      chart.hidden = true;
      chart.classList.remove('is-entering', 'is-ready');
      if (chartValue) {
        chartValue.classList.remove('is-revealed');
      }
      return;
    }

    chart.hidden = false;

    if (entering) {
      chart.classList.remove('is-ready', 'is-entering');
      if (chartValue) {
        chartValue.classList.remove('is-revealed');
      }
      void chart.offsetWidth;
      chart.classList.add('is-entering');
      return;
    }

    chart.classList.remove('is-entering');
    chart.classList.add('is-ready');
    if (chartValue) {
      chartValue.classList.add('is-revealed');
    }
  }

  function setChartLoading(on) {
    app.classList.toggle('is-chart-loading', on);
    if (chartLoading) {
      chartLoading.hidden = !on;
      chartLoading.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  }

  function clearViewTransitionClasses() {
    app.classList.remove('is-view-transition');
    composerView.classList.remove('is-exiting');
    answerView.classList.remove('is-entering');
  }

  function showComposer() {
    app.dataset.view = 'composer';
    composerView.hidden = false;
    answerView.hidden = true;
    clearViewTransitionClasses();
    app.classList.remove(
      'is-focused',
      'is-typing',
      'is-sending',
      'is-thinking',
      'is-chart-loading',
      'has-text'
    );
    setComposerText('');
    clearAnswerCopy();
    setChartLoading(false);
    setChartVisible(false, false);
    caret.hidden = true;
    setClipWidth(0);
    setTipsReady(false);
    hideTooltip();
  }

  function showAnswerInstant() {
    app.dataset.view = 'answer';
    composerView.hidden = true;
    answerView.hidden = false;
    clearViewTransitionClasses();
    app.classList.remove(
      'is-focused',
      'is-typing',
      'is-sending',
      'is-thinking',
      'has-text'
    );
    caret.hidden = true;
    setAnswerFinal();
    setChartLoading(false);
    setChartVisible(true, false);
    if (chartValue) {
      chartValue.classList.add('is-revealed');
    }
    setClipWidth(PLOT_W);
    setTipsReady(true);
  }

  async function crossfadeToAnswer(token) {
    app.classList.remove(
      'is-focused',
      'is-typing',
      'is-sending',
      'is-thinking',
      'has-text'
    );
    caret.hidden = true;
    clearAnswerCopy();
    setChartLoading(false);
    setChartVisible(false, false);
    setClipWidth(0);
    setTipsReady(false);

    if (prefersReducedMotion()) {
      composerView.hidden = true;
      answerView.hidden = false;
      app.dataset.view = 'answer';
      return;
    }

    answerView.hidden = false;
    app.classList.add('is-view-transition');
    void answerView.offsetWidth;

    app.dataset.view = 'answer';
    composerView.classList.add('is-exiting');
    answerView.classList.add('is-entering');

    await wait(VIEW_MS, token);
    if (token !== runToken) {
      return;
    }

    composerView.hidden = true;
    clearViewTransitionClasses();
  }

  async function typeText(target, fullText, baseMs, token, onChar) {
    if (!target) {
      return;
    }

    if (prefersReducedMotion()) {
      onChar(fullText);
      return;
    }

    onChar('');
    for (let i = 1; i <= fullText.length; i += 1) {
      if (token !== runToken) {
        return;
      }
      const slice = fullText.slice(0, i);
      onChar(slice);
      const ch = fullText.charAt(i - 1);
      await wait(charDelay(baseMs, ch), token);
    }
  }

  async function streamAnswer(token) {
    await typeText(answerCopy, ANSWER_PLAIN, ANSWER_TYPE_MS, token, (text) => {
      if (answerCopy) {
        answerCopy.textContent = text;
      }
    });
    if (token === runToken) {
      setAnswerFinal();
    }
  }

  async function drawChart(token) {
    if (prefersReducedMotion()) {
      setClipWidth(PLOT_W);
      if (chartValue) {
        chartValue.classList.add('is-revealed');
      }
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
        setClipWidth(PLOT_W * easeOutCubic(t));
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
      if (chartValue) {
        chartValue.classList.add('is-revealed');
      }
      setTipsReady(true);
    }
  }

  async function typePrompt(token) {
    app.classList.add('is-focused', 'is-typing');
    caret.hidden = false;
    setComposerText('');

    await typeText(composerText, PROMPT, TYPE_MS, token, setComposerText);

    if (token !== runToken) {
      return;
    }

    caret.hidden = true;
    app.classList.remove('is-typing');
  }

  async function runSequence(token) {
    showComposer();

    if (prefersReducedMotion()) {
      showAnswerInstant();
      return;
    }

    await wait(START_DELAY_MS, token);
    if (token !== runToken) {
      return;
    }

    await typePrompt(token);
    if (token !== runToken) {
      return;
    }

    app.classList.add('is-sending');
    await wait(SEND_PULSE_MS, token);
    if (token !== runToken) {
      return;
    }
    app.classList.remove('is-sending');

    app.classList.add('is-thinking');
    await wait(THINK_MS, token);
    if (token !== runToken) {
      return;
    }

    await crossfadeToAnswer(token);
    if (token !== runToken) {
      return;
    }

    await streamAnswer(token);
    if (token !== runToken) {
      return;
    }

    setChartVisible(true, true);
    await wait(CHART_ENTER_MS, token);
    if (token !== runToken) {
      return;
    }
    if (chart) {
      chart.classList.remove('is-entering');
      chart.classList.add('is-ready');
    }

    setChartLoading(true);
    await wait(CHART_LOAD_MS, token);
    if (token !== runToken) {
      return;
    }
    setChartLoading(false);

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
    }, PLAY_DELAY_MS);
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
