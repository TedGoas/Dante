(function () {
  const QUESTIONS = [
    {
      text: 'Did the agent greet the customer?',
      points: 10,
      answer: 'Yes',
      options: ['Yes', 'No'],
      evidenceId: 'greet'
    },
    {
      text: 'Did the agent confirm the account information?',
      points: 10,
      answer: 'Yes',
      options: ['Yes', 'No'],
      evidenceId: 'account'
    },
    {
      text: "How was the agent's understanding of the issue?",
      points: 10,
      answer: 'Excellent',
      options: ['Excellent', 'Good', 'Fair', 'Poor'],
      evidenceId: 'understanding'
    },
    {
      text: "Did the agent confirm the customer's issue was resolved?",
      points: 10,
      answer: 'Yes',
      options: ['Yes', 'No'],
      evidenceId: 'resolved'
    },
    {
      text: 'Did the agent provide a call closing statement?',
      points: 10,
      answer: 'Yes',
      options: ['Yes', 'No'],
      evidenceId: 'closing'
    }
  ];

  /*
   * Sequence beats (ms) — tweak here only.
   * hover (from rest): highlighter wipes → answer resolve → interactive
   * leave: soft exit → rest (skipped if already resting)
   */
  const EXIT_MS = 150;
  const SETTLE_MS = 180;
  // Highlight + resolve run at 1.5× prior speed (durations ÷ 1.5).
  const HL_MS = 213;
  const HL_STAGGER_MS = 93;
  const RESOLVE_STEP_MS = 147;
  const HOLD_AFTER_HL_MS = 133;
  const BADGE_PRESS_MS = 140;
  const TIP_MS = 140;
  const SEEK_LOCK_MS = 500;
  const CALL_DURATION_S = 300;

  // Highlight ticks on the play bar — same order/colors as transcript marks.
  const TRACK_MARKS = [
    { t: 2, color: '#00BC7D' },
    { t: 12, color: '#F0B100' },
    { t: 35, color: '#2B7FFF' },
    { t: 70, color: '#FB2C36' },
    { t: 125, color: '#F0B100' },
    { t: 160, color: '#FB2C36' },
    { t: 215, color: '#00BC7D' },
    { t: 260, color: '#2B7FFF' }
  ];

  const TIP_BY_CLASS = {
    'sc__hl--red': { label: 'Frustration', color: '#fed5d7' },
    'sc__hl--blue': { label: 'Interesting question', color: '#d5e5ff' },
    'sc__hl--amber': { label: 'Product mention', color: '#fcf0cc' },
    'sc__hl--green': { label: 'Positive sentiment', color: '#ccefdf' }
  };

  const SPARKLE_SVG =
    '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5l1.2 3.4H13l-2.8 2.1 1.1 3.5L8 8.6l-3.3 2.4 1.1-3.5L3 4.9h3.8L8 1.5z" fill="currentColor"/></svg>';
  const CHECK_SVG =
    '<svg class="sc__answer-check" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2l2.4 2.4 4.6-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const app = document.getElementById('app');
  const questionsRoot = document.getElementById('questions');
  const commentsRoot = document.getElementById('comments');
  const transcriptEl = document.getElementById('transcript');
  const transcriptPane = app ? app.querySelector('.sc__pane--transcript') : null;
  const scorecardPane = app ? app.querySelector('.sc__pane--scorecard') : null;
  const playbackTray = document.getElementById('playback-tray');
  const playbackTrack = document.getElementById('playback-track');
  const hlTip = document.getElementById('hl-tip');
  const hlTipLabel = document.getElementById('hl-tip-label');
  const tabButtons = scorecardPane
    ? Array.from(scorecardPane.querySelectorAll('.sc__tab[data-panel]'))
    : [];

  let runToken = 0;
  let timers = [];
  let interactive = false;
  let resolvedCount = 0;
  let tipWarm = false;
  let seekLockUntil = 0;
  let scrollRaf = 0;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function syncCssBeats() {
    app.style.setProperty('--sc-exit-ms', `${EXIT_MS}ms`);
    app.style.setProperty('--sc-settle-ms', `${SETTLE_MS}ms`);
    app.style.setProperty('--sc-resolve-ms', `${RESOLVE_STEP_MS}ms`);
    app.style.setProperty('--sc-press-ms', `${BADGE_PRESS_MS}ms`);
    app.style.setProperty('--sc-hl-ms', `${HL_MS}ms`);
    app.style.setProperty('--sc-tip-ms', `${TIP_MS}ms`);
  }

  function tipMetaForMark(mark) {
    if (!mark) {
      return null;
    }
    const key = Object.keys(TIP_BY_CLASS).find((cls) => mark.classList.contains(cls));
    return key ? TIP_BY_CLASS[key] : null;
  }

  function hideHlTip(clearWarm) {
    if (!hlTip) {
      return;
    }
    hlTip.classList.remove('is-active');
    hlTip.setAttribute('aria-hidden', 'true');
    if (clearWarm) {
      tipWarm = false;
      app.classList.remove('is-tip-warm');
    }
  }

  function showHlTip(mark) {
    if (!hlTip || !hlTipLabel || !transcriptPane || !mark) {
      return;
    }
    // Tips once a phrase is painted — no need to wait for answer cascade.
    if (!mark.classList.contains('is-painted')) {
      return;
    }

    const meta = tipMetaForMark(mark);
    if (!meta) {
      return;
    }

    hlTipLabel.textContent = meta.label;
    hlTip.style.setProperty('--sc-tip-dot', meta.color);

    const paneRect = transcriptPane.getBoundingClientRect();
    const markRect = mark.getBoundingClientRect();
    const playback = transcriptPane.querySelector('.sc__playback');
    const minY = playback
      ? playback.getBoundingClientRect().bottom - paneRect.top + 4
      : 8;

    // Measure tip while active so we can center it on the mark.
    hlTip.classList.add('is-active');
    const tipRect = hlTip.getBoundingClientRect();
    const tipW = tipRect.width || 120;
    const tipH = tipRect.height || 24;

    let x = markRect.left - paneRect.left + markRect.width / 2 - tipW / 2;
    let y = markRect.top - paneRect.top - tipH - 6;
    if (y < minY) {
      y = markRect.bottom - paneRect.top + 6;
    }
    x = Math.max(8, Math.min(x, paneRect.width - tipW - 8));
    y = Math.max(minY, Math.min(y, paneRect.height - tipH - 8));

    hlTip.style.setProperty('--sc-tip-x', `${Math.round(x)}px`);
    hlTip.style.setProperty('--sc-tip-y', `${Math.round(y)}px`);
    hlTip.setAttribute('aria-hidden', 'false');
    if (!tipWarm) {
      tipWarm = true;
      app.classList.add('is-tip-warm');
    }
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

  function otherOptions(q) {
    return (q.options || []).filter((option) => option !== q.answer);
  }

  function highlightMarks() {
    return Array.from(document.querySelectorAll('[data-hl]'));
  }

  function evidenceMessages() {
    return Array.from(document.querySelectorAll('[data-evidence-id]'));
  }

  function timedMessages() {
    if (!transcriptEl) {
      return [];
    }
    return Array.from(transcriptEl.querySelectorAll('.sc__msg[data-t]'));
  }

  function msgTime(msg) {
    const t = Number(msg?.getAttribute('data-t'));
    return Number.isFinite(t) ? t : 0;
  }

  function renderTrackMarks() {
    if (!playbackTrack) {
      return;
    }
    playbackTrack.innerHTML = TRACK_MARKS.map(
      (mark) =>
        `<span class="sc__playback-tick" style="left:${(mark.t / CALL_DURATION_S) * 100}%;background:${mark.color}"></span>`
    ).join('');
  }

  function setPlayheadSeconds(seconds, animate) {
    if (!app) {
      return;
    }
    const clamped = Math.min(CALL_DURATION_S, Math.max(0, seconds));
    const pct = (clamped / CALL_DURATION_S) * 100;
    app.classList.toggle('is-head-animating', Boolean(animate) && !prefersReducedMotion());
    app.style.setProperty('--sc-head-pct', `${pct}%`);
  }

  function lockSeek(ms) {
    seekLockUntil = Date.now() + (ms || SEEK_LOCK_MS);
  }

  function nearestMessageByTime(seconds) {
    const msgs = timedMessages();
    if (!msgs.length) {
      return null;
    }
    let best = msgs[0];
    let bestDist = Math.abs(msgTime(best) - seconds);
    for (let i = 1; i < msgs.length; i += 1) {
      const dist = Math.abs(msgTime(msgs[i]) - seconds);
      if (dist < bestDist) {
        best = msgs[i];
        bestDist = dist;
      }
    }
    return best;
  }

  function scrollToMessage(msg, smooth) {
    if (!transcriptEl || !msg) {
      return;
    }
    const top = Math.max(0, msg.offsetTop - 20);
    lockSeek(smooth && !prefersReducedMotion() ? SEEK_LOCK_MS : 0);
    setPlayheadSeconds(msgTime(msg), true);
    if (smooth && !prefersReducedMotion()) {
      transcriptEl.scrollTo({ top, behavior: 'smooth' });
    } else {
      transcriptEl.scrollTop = top;
    }
  }

  function syncPlayheadFromScroll() {
    if (!transcriptEl || Date.now() < seekLockUntil) {
      return;
    }
    const msgs = timedMessages();
    if (!msgs.length) {
      return;
    }
    const fog = transcriptEl.querySelector('.sc__fog');
    const topY = transcriptEl.getBoundingClientRect().top + (fog ? fog.offsetHeight : 0) + 8;

    // Interpolate between neighboring messages so the notch eases
    // continuously instead of snapping message-to-message.
    let nextIdx = msgs.findIndex((msg) => msg.getBoundingClientRect().top >= topY);
    if (nextIdx === -1) {
      setPlayheadSeconds(msgTime(msgs[msgs.length - 1]));
      return;
    }
    if (nextIdx === 0) {
      setPlayheadSeconds(msgTime(msgs[0]));
      return;
    }

    const prev = msgs[nextIdx - 1];
    const next = msgs[nextIdx];
    const prevTop = prev.getBoundingClientRect().top;
    const nextTop = next.getBoundingClientRect().top;
    const span = nextTop - prevTop;
    const progress = span > 0 ? Math.min(1, Math.max(0, (topY - prevTop) / span)) : 0;
    const t0 = msgTime(prev);
    const t1 = msgTime(next);
    setPlayheadSeconds(t0 + (t1 - t0) * progress);
  }

  function onTranscriptScroll() {
    hideHlTip(false);
    if (scrollRaf) {
      return;
    }
    scrollRaf = window.requestAnimationFrame(() => {
      scrollRaf = 0;
      syncPlayheadFromScroll();
    });
  }

  function onTrayClick(event) {
    if (!interactive || !playbackTray) {
      return;
    }
    const rect = playbackTray.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const seconds = ratio * CALL_DURATION_S;
    const msg = nearestMessageByTime(seconds);
    if (!msg) {
      return;
    }
    clearEvidence();
    const evidenceId = msg.getAttribute('data-evidence-id');
    if (evidenceId) {
      msg.classList.add('sc__msg--evidence');
      const chip = msg.querySelector('.sc__evidence-chip');
      if (chip) {
        chip.hidden = false;
      }
      const phrase = msg.querySelector(`[data-ev-phrase="${evidenceId}"]`);
      if (phrase) {
        phrase.classList.add('is-painted');
      }
    }
    scrollToMessage(msg, true);
  }

  function renderQuestions(count, animateIndex) {
    if (!questionsRoot) {
      return;
    }

    questionsRoot.innerHTML = QUESTIONS.map((q, i) => {
      const resolved = i < count;
      const animate = resolved && animateIndex === i;
      const others = otherOptions(q)
        .map(
          (option) =>
            `<div class="sc__answer"><span class="sc__answer-radio"></span><span class="sc__answer-label sc__answer-label--muted">${option}</span></div>`
        )
        .join('');

      const selected = resolved
        ? `<div class="sc__answer sc__answer--selected${animate ? ' is-resolving' : ''}" data-evidence="${q.evidenceId}">
            ${CHECK_SVG}
            <span class="sc__answer-label">${q.answer}</span>
            <span class="sc__ai-badge">
              ${SPARKLE_SVG}
              Graded by Ai
            </span>
          </div>`
        : `<div class="sc__answer"><span class="sc__answer-radio"></span><span class="sc__answer-label">${q.answer}</span></div>`;

      return `<div class="sc__question" data-q="${i}">
        <div class="sc__question-text">
          <span class="sc__question-label">${i + 1}. ${q.text}</span>
          <span class="sc__question-points">${q.points}pts</span>
        </div>
        <div class="sc__answers">${selected}${others}</div>
      </div>`;
    }).join('');

    resolvedCount = count;
  }

  function clearHighlights() {
    hideHlTip(true);
    highlightMarks().forEach((mark) => {
      mark.classList.remove('is-painting', 'is-painted');
    });
  }

  function paintAllHighlights() {
    highlightMarks().forEach((mark) => {
      mark.classList.remove('is-painting');
      mark.classList.add('is-painted');
    });
  }

  function clearEvidence() {
    evidenceMessages().forEach((msg) => {
      msg.classList.remove('sc__msg--evidence');
      const chip = msg.querySelector('.sc__evidence-chip');
      if (chip) {
        chip.hidden = true;
      }
    });
  }

  function scrollToEvidence(id, smooth) {
    if (!transcriptEl || !id) {
      return;
    }

    clearEvidence();

    const msg = document.querySelector(`[data-evidence-id="${id}"]`);
    if (!msg) {
      return;
    }

    msg.classList.add('sc__msg--evidence');
    const chip = msg.querySelector('.sc__evidence-chip');
    if (chip) {
      chip.hidden = false;
    }

    const phrase = msg.querySelector(`[data-ev-phrase="${id}"]`);
    if (phrase) {
      phrase.classList.add('is-painted');
    }

    scrollToMessage(msg, smooth);
  }

  function scrollTranscriptTop(instant) {
    if (!transcriptEl) {
      return;
    }
    lockSeek(instant || prefersReducedMotion() ? 0 : SEEK_LOCK_MS);
    setPlayheadSeconds(0);
    if (instant || prefersReducedMotion()) {
      transcriptEl.scrollTop = 0;
      return;
    }
    transcriptEl.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setInteractive(on) {
    interactive = on;
    app.classList.toggle('is-interactive', on);
    if (!on) {
      hideHlTip(true);
    }
  }

  function setRestFrame() {
    app.classList.remove('is-playing', 'is-exiting', 'is-entering', 'is-resetting');
    setInteractive(false);
    clearEvidence();
    clearHighlights();
    renderQuestions(0, -1);
    setActivePanel('scorecard');
    setPlayheadSeconds(0);
    scrollTranscriptTop(true);
  }

  function setFinishedFrame() {
    app.classList.remove('is-playing', 'is-exiting', 'is-entering', 'is-resetting');
    clearEvidence();
    paintAllHighlights();
    renderQuestions(QUESTIONS.length, -1);
    setPlayheadSeconds(0);
    scrollTranscriptTop(true);
    setInteractive(true);
  }

  async function paintHighlights(token) {
    const marks = highlightMarks();
    for (let i = 0; i < marks.length; i += 1) {
      const mark = marks[i];
      mark.classList.remove('is-painted', 'is-painting');
      // Force rest size before paint so background-size can wipe L→R.
      void mark.offsetWidth;
      mark.classList.add('is-painting');
      await wait(HL_MS, token);
      if (token !== runToken) {
        return;
      }
      mark.classList.remove('is-painting');
      mark.classList.add('is-painted');
      if (i < marks.length - 1) {
        await wait(HL_STAGGER_MS, token);
        if (token !== runToken) {
          return;
        }
      }
    }
  }

  function isResting() {
    return (
      resolvedCount === 0 &&
      !highlightMarks().some(
        (mark) =>
          mark.classList.contains('is-painted') ||
          mark.classList.contains('is-painting')
      )
    );
  }

  async function playDemo() {
    const token = ++runToken;
    clearTimers();
    setInteractive(false);
    syncCssBeats();

    if (prefersReducedMotion()) {
      setFinishedFrame();
      return;
    }

    // Rest already matches the demo start — skip soft exit/settle so hover
    // goes straight into highlights (no opacity flash).
    if (!isResting()) {
      app.classList.remove('is-entering', 'is-resetting', 'is-playing');
      app.classList.add('is-exiting');
      await wait(EXIT_MS, token);
      if (token !== runToken) {
        return;
      }
      setRestFrame();
      app.classList.remove('is-exiting');
    }

    app.classList.add('is-playing');

    await paintHighlights(token);
    if (token !== runToken) {
      return;
    }

    await wait(HOLD_AFTER_HL_MS, token);
    if (token !== runToken) {
      return;
    }

    for (let i = 0; i < QUESTIONS.length; i += 1) {
      renderQuestions(i + 1, i);
      await wait(RESOLVE_STEP_MS, token);
      if (token !== runToken) {
        return;
      }
    }

    app.classList.remove('is-playing');
    setInteractive(true);
  }

  async function resetDemo() {
    const token = ++runToken;
    clearTimers();
    setInteractive(false);
    syncCssBeats();

    if (prefersReducedMotion()) {
      setFinishedFrame();
      return;
    }

    // Already at rest (e.g. leave before play finishes settling) — snap, no fade.
    if (isResting() && !app.classList.contains('is-playing')) {
      setRestFrame();
      return;
    }

    app.classList.remove('is-playing', 'is-entering', 'is-resetting');
    app.classList.add('is-exiting');
    await wait(EXIT_MS, token);
    if (token !== runToken) {
      return;
    }

    setRestFrame();
    app.classList.remove('is-exiting');
  }

  function setActivePanel(panelId) {
    if (!scorecardPane) {
      return;
    }

    tabButtons.forEach((tab) => {
      const active = tab.getAttribute('data-panel') === panelId;
      tab.classList.toggle('sc__tab--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });

    scorecardPane.querySelectorAll('.sc__panel').forEach((panel) => {
      const match = panel.id === `panel-${panelId}`;
      if (match) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  function onAnswerClick(event) {
    if (!interactive || !questionsRoot) {
      return;
    }
    const row = event.target.closest('.sc__answer--selected[data-evidence]');
    if (!row || !questionsRoot.contains(row)) {
      return;
    }
    const id = row.getAttribute('data-evidence');
    row.classList.add('is-pressing');
    window.setTimeout(() => row.classList.remove('is-pressing'), BADGE_PRESS_MS);
    scrollToEvidence(id, true);
  }

  function onCommentClick(event) {
    if (!interactive || !commentsRoot) {
      return;
    }
    const comment = event.target.closest('.sc__comment[data-evidence]');
    if (!comment || !commentsRoot.contains(comment)) {
      return;
    }
    const id = comment.getAttribute('data-evidence');
    comment.classList.add('is-pressing');
    window.setTimeout(() => comment.classList.remove('is-pressing'), BADGE_PRESS_MS);
    scrollToEvidence(id, true);
  }

  if (questionsRoot) {
    questionsRoot.addEventListener('click', onAnswerClick);
  }

  if (commentsRoot) {
    commentsRoot.addEventListener('click', onCommentClick);
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      const panelId = tab.getAttribute('data-panel');
      if (panelId) {
        setActivePanel(panelId);
      }
    });
  });

  if (transcriptEl) {
    transcriptEl.addEventListener('pointerover', (event) => {
      const mark = event.target.closest('[data-hl]');
      if (!mark || !transcriptEl.contains(mark)) {
        return;
      }
      showHlTip(mark);
    });
    transcriptEl.addEventListener('pointerout', (event) => {
      const mark = event.target.closest('[data-hl]');
      if (!mark || !transcriptEl.contains(mark)) {
        return;
      }
      const next = event.relatedTarget;
      if (next && (mark.contains(next) || next.closest?.('[data-hl]') === mark)) {
        return;
      }
      // Moving to another highlight keeps tip-warm; only hide the open tip.
      if (next && next.closest && next.closest('[data-hl].is-painted')) {
        return;
      }
      hideHlTip(false);
    });
    transcriptEl.addEventListener('scroll', onTranscriptScroll, { passive: true });
  }

  if (playbackTray) {
    playbackTray.addEventListener('click', onTrayClick);
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
  renderTrackMarks();
  setPlayheadSeconds(0);
  if (prefersReducedMotion()) {
    setFinishedFrame();
  } else {
    setRestFrame();
  }
})();
