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

  const SPARKLE_SVG =
    '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5l1.2 3.4H13l-2.8 2.1 1.1 3.5L8 8.6l-3.3 2.4 1.1-3.5L3 4.9h3.8L8 1.5z" fill="currentColor"/></svg>';
  const CHECK_SVG =
    '<svg class="sc__answer-check" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2l2.4 2.4 4.6-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const app = document.getElementById('app');
  const questionsRoot = document.getElementById('questions');
  const transcriptEl = document.getElementById('transcript');

  let runToken = 0;
  let timers = [];
  let interactive = false;
  let resolvedCount = 0;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function syncCssBeats() {
    app.style.setProperty('--sc-exit-ms', `${EXIT_MS}ms`);
    app.style.setProperty('--sc-settle-ms', `${SETTLE_MS}ms`);
    app.style.setProperty('--sc-resolve-ms', `${RESOLVE_STEP_MS}ms`);
    app.style.setProperty('--sc-press-ms', `${BADGE_PRESS_MS}ms`);
    app.style.setProperty('--sc-hl-ms', `${HL_MS}ms`);
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
    highlightMarks().forEach((mark) => {
      mark.classList.remove('is-painting', 'is-painted', 'is-evidence');
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
    highlightMarks().forEach((mark) => {
      mark.classList.remove('is-evidence');
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
      phrase.classList.add('is-painted', 'is-evidence');
    }

    const top = Math.max(0, msg.offsetTop - 20);
    if (smooth && !prefersReducedMotion()) {
      transcriptEl.scrollTo({ top, behavior: 'smooth' });
    } else {
      transcriptEl.scrollTop = top;
    }
  }

  function scrollTranscriptTop(instant) {
    if (!transcriptEl) {
      return;
    }
    if (instant || prefersReducedMotion()) {
      transcriptEl.scrollTop = 0;
      return;
    }
    transcriptEl.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setInteractive(on) {
    interactive = on;
    app.classList.toggle('is-interactive', on);
  }

  function setRestFrame() {
    app.classList.remove('is-playing', 'is-exiting', 'is-entering', 'is-resetting');
    setInteractive(false);
    clearEvidence();
    clearHighlights();
    renderQuestions(0, -1);
    scrollTranscriptTop(true);
  }

  function setFinishedFrame() {
    app.classList.remove('is-playing', 'is-exiting', 'is-entering', 'is-resetting');
    clearEvidence();
    paintAllHighlights();
    renderQuestions(QUESTIONS.length, -1);
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

  if (questionsRoot) {
    questionsRoot.addEventListener('click', onAnswerClick);
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
  if (prefersReducedMotion()) {
    setFinishedFrame();
  } else {
    setRestFrame();
  }
})();
