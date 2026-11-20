(function () {
  const PROMPT = 'Show me my CSAT';
  const ANSWER_PLAIN = 'Your average CSAT is 4.7, up from 4.5 last week.';
  const ANSWER_HTML =
    'Your average CSAT is <strong>4.7</strong>, up from 4.5 last week.';

  /*
   * Sequence beats (ms) — tweak here only.
   * soft exit answer → type prompt → think → view crossfade →
   * stream answer (chart enter overlaps) → line draw → tips ready
   */
  const PLAY_DELAY_MS = 40;
  const EXIT_MS = 150;
  const SETTLE_MS = 180;
  const START_DELAY_MS = 40;
  const TYPE_MS = 22;
  const ANSWER_TYPE_MS = 8;
  const THINK_MS = 720;
  const VIEW_MS = 250;
  const STREAM_BEFORE_CHART_MS = 380;
  const CHART_ENTER_MS = 180;
  const LINE_MS = 550;
  const TIP_MS = 140;
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
  const tipEl = chartHover ? chartHover.querySelector('.agt__tooltip') : null;

  let runToken = 0;
  let timers = [];
  let rafId = 0;
  let tipsReady = false;
  let tipWarm = false;
  let pointIndex = 0;
  let keyboardActive = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function syncCssBeats() {
    app.style.setProperty('--agt-view-ms', `${VIEW_MS}ms`);
    app.style.setProperty('--agt-chart-enter-ms', `${CHART_ENTER_MS}ms`);
    app.style.setProperty('--agt-tip-ms', `${TIP_MS}ms`);
    app.style.setProperty('--agt-exit-ms', `${EXIT_MS}ms`);
    app.style.setProperty('--agt-settle-ms', `${SETTLE_MS}ms`);
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
      ms += 6;
    }
    if (ch === ',' || ch === '.') {
      ms += 24;
    }
    return Math.max(6, Math.round(ms));
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
    if (!tipsReady) {
      tipWarm = false;
      app.classList.remove('is-tip-warm');
    }
  }

  function setTipsReady(ready) {
    tipsReady = ready;
    if (!ready) {
      hideTooltip();
      keyboardActive = false;
      tipWarm = false;
      app.classList.remove('is-tip-warm');
      return;
    }

    if (chartHit && chartHit.matches(':hover')) {
      const rect = chartHit.getBoundingClientRect();
      const fake = {
        clientX: rect.left + rect.width * 0.5,
        clientY: rect.top + rect.height * 0.5
      };
      const nearest = nearestPoint(fake);
      if (nearest) {
        const index = POINTS.indexOf(nearest.point);
        pointIndex = index >= 0 ? index : 0;
        syncHitValue(nearest.point, pointIndex);
        showTooltip(nearest.point, nearest.plotWidth, nearest.plotHeight);
      }
    } else if (document.activeElement === chartHit) {
      activatePoint(pointIndex);
    }
  }

  function showTooltip(point, plotWidth, plotHeight) {
    if (!chartHover || !tipDate || !tipValue || !hoverMarker || !tipEl) {
      return;
    }

    tipDate.textContent = point.label;
    tipValue.textContent = point.value.toFixed(1);

    const leftPx = (point.x / PLOT_W) * plotWidth;
    const topPx = (point.y / PLOT_H) * plotHeight;
    chartHover.style.left = `${leftPx}px`;
    hoverMarker.style.top = `${topPx}px`;

    tipEl.style.setProperty('--agt-tip-shift', '0px');
    chartHover.classList.add('is-visible');
    chartHover.setAttribute('aria-hidden', 'false');

    const tipRect = tipEl.getBoundingClientRect();
    const plotRect = chartHit.getBoundingClientRect();
    let shiftX = 0;
    if (tipRect.left < plotRect.left + TIP_PAD) {
      shiftX = plotRect.left + TIP_PAD - tipRect.left;
    } else if (tipRect.right > plotRect.right - TIP_PAD) {
      shiftX = plotRect.right - TIP_PAD - tipRect.right;
    }
    tipEl.style.setProperty('--agt-tip-shift', `${Math.round(shiftX)}px`);

    if (!tipWarm) {
      tipWarm = true;
      app.classList.add('is-tip-warm');
    }
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
    app.classList.remove('is-view-transition', 'is-resetting', 'is-exiting-answer');
    composerView.classList.remove('is-exiting');
    answerView.classList.remove('is-entering', 'is-exiting');
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
      'has-text',
      'is-chart-loading'
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

  async function softExitAnswer(token) {
    if (app.dataset.view !== 'answer' || answerView.hidden) {
      return;
    }

    if (prefersReducedMotion()) {
      showComposer();
      return;
    }

    setTipsReady(false);
    hideTooltip();
    app.classList.add('is-exiting-answer');
    answerView.classList.add('is-exiting');
    await wait(EXIT_MS, token);
    if (token !== runToken) {
      return;
    }
    showComposer();
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

  async function enterChart(token) {
    setChartVisible(true, true);
    await wait(CHART_ENTER_MS, token);
    if (token !== runToken) {
      return;
    }
    if (chart) {
      chart.classList.remove('is-entering');
      chart.classList.add('is-ready');
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
    if (prefersReducedMotion()) {
      showAnswerInstant();
      return;
    }

    await softExitAnswer(token);
    if (token !== runToken) {
      return;
    }

    if (app.dataset.view !== 'composer') {
      showComposer();
    }

    await wait(START_DELAY_MS, token);
    if (token !== runToken) {
      return;
    }

    await typePrompt(token);
    if (token !== runToken) {
      return;
    }

    app.classList.add('is-thinking');
    await wait(THINK_MS, token);
    if (token !== runToken) {
      return;
    }

    await crossfadeToAnswer(token);
    if (token !== runToken) {
      return;
    }

    const stream = streamAnswer(token);
    await wait(STREAM_BEFORE_CHART_MS, token);
    if (token !== runToken) {
      return;
    }
    await enterChart(token);
    if (token !== runToken) {
      return;
    }
    await stream;
    if (token !== runToken) {
      return;
    }

    await drawChart(token);
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    hideTooltip();
    tipWarm = false;
    app.classList.remove('is-tip-warm');

    if (prefersReducedMotion()) {
      showAnswerInstant();
      return;
    }

    if (app.dataset.view === 'composer' && !app.classList.contains('is-thinking') && !app.classList.contains('is-typing')) {
      showComposer();
      return;
    }

    // Soft settle back to the prompt resting frame.
    app.classList.add('is-resetting');
    const token = runToken;
    const id = window.setTimeout(() => {
      if (token !== runToken) {
        return;
      }
      showComposer();
    }, SETTLE_MS);
    timers.push(id);
  }

  function playDemo() {
    runToken += 1;
    clearTimers();
    hideTooltip();
    setTipsReady(false);
    tipWarm = false;
    app.classList.remove('is-tip-warm', 'is-resetting');
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

  syncCssBeats();
  // Rest on the prompt; reduced-motion visitors get the finished chart without play.
  if (prefersReducedMotion()) {
    showAnswerInstant();
  } else {
    showComposer();
  }
})();
