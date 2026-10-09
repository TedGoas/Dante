(function () {
  'use strict';

  var TIMELINE = [
    { scenario: 0, type: 'message', speaker: 'aria', text: "Thanks for calling Aerolabs! Our office is closed, but I'm here 24/7.", audio: 'Ashley-air-1.mp3', delay: 1500 },
    { scenario: 0, type: 'message', speaker: 'you', text: "Oh wow, I didn't expect anyone to pick up at this hour.", delay: 3500 },
    { scenario: 0, type: 'message', speaker: 'aria', text: "I'm always on. How can I help you tonight?", audio: 'Ashley-air-2.mp3', delay: 1900 },
    { scenario: 1, type: 'message', speaker: 'you', text: 'I had a quick question about your cancellation policy.', delay: 3700 },
    { scenario: 1, type: 'event', label: 'Knowledge retrieval', delay: 800 },
    { scenario: 1, type: 'message', speaker: 'aria', text: 'Sure! You can cancel any time before your next billing date. No fees.', audio: 'Ashley-air-3.mp3', delay: 1900 },
    { scenario: 1, type: 'message', speaker: 'you', text: 'What about getting a refund?', delay: 3300 },
    { scenario: 1, type: 'event', label: 'Knowledge retrieval', delay: 700 },
    { scenario: 1, type: 'message', speaker: 'aria', text: 'Refunds are issued within 5-7 business days to your original payment method.', audio: 'Ashley-air-4.mp3', delay: 1900 },
    { scenario: 2, type: 'message', speaker: 'you', text: "I'd also like to set up a call with your team.", delay: 3700 },
    { scenario: 2, type: 'event', label: 'Agent reasoning', delay: 800 },
    { scenario: 2, type: 'message', speaker: 'aria', text: 'Happy to help. Does Tuesday at 2 PM work for you?', audio: 'Ashley-air-5.mp3', delay: 1900 },
    { scenario: 2, type: 'message', speaker: 'you', text: 'Yes, perfect.', delay: 2700 },
    { scenario: 2, type: 'event', label: 'Appointment confirmed', delay: 700 },
    { scenario: 2, type: 'message', speaker: 'aria', text: "Done! You'll get a confirmation text in a moment.", audio: 'Ashley-air-6.mp3', delay: 1900 },
    { scenario: 3, type: 'message', speaker: 'you', text: "I'm interested in your enterprise plan.", delay: 3700 },
    { scenario: 3, type: 'event', label: 'Lead capture', delay: 800 },
    { scenario: 3, type: 'message', speaker: 'aria', text: "Great! I'll pass your interest to our sales team. Can I get your name and email?", audio: 'Ashley-air-7.mp3', delay: 2200 },
    { scenario: 3, type: 'message', speaker: 'you', text: "Sure, it's Jamie, jamie@company.com.", delay: 3300 },
    { scenario: 3, type: 'event', label: 'Lead saved', delay: 700 },
    { scenario: 3, type: 'message', speaker: 'aria', text: 'Got it! Someone from our team will be in touch within one business day.', audio: 'Ashley-air-8.mp3', delay: 1900 },
    { scenario: 4, type: 'message', speaker: 'you', text: 'Actually, can you transfer me to billing?', delay: 3700 },
    { scenario: 4, type: 'event', label: 'Agent reasoning', delay: 800 },
    { scenario: 4, type: 'message', speaker: 'aria', text: 'Of course, connecting you to our billing team now.', audio: 'Ashley-air-9.mp3', delay: 1700 },
    { scenario: 4, type: 'event', label: 'Transferring call', delay: 2700 },
    { scenario: 4, type: 'message', speaker: 'aria', text: "You're all set. Have a great night!", audio: 'Ashley-air-10.mp3', delay: 2000 }
  ];

  var CALLING_MS = 1000;
  var COMPLETE_TAIL_MS = 2000;
  var AUDIO_BASE = '/assets/img/dialpad/prototypes/ai-receptionist/audio/';
  var TOTAL_DELAY = TIMELINE.reduce(function (sum, item) {
    return sum + item.delay;
  }, 0);

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(window.location.search);
  var shouldAutostart = params.get('autostart') === '1' && !reducedMotion;

  var transcriptEl = document.getElementById('transcript');
  var waveformEl = document.getElementById('waveform');
  var timerEl = document.getElementById('timer');
  var phaseBtn = document.getElementById('phase-btn');
  var phaseLabel = document.getElementById('phase-label');
  var hearBtn = document.getElementById('hear-btn');
  var hearWrap = document.getElementById('hear-wrap');
  var hearLabel = document.getElementById('hear-label');

  var phase = 'idle';
  var visibleItems = [];
  var elapsedSeconds = 0;
  var currentSpeaker = null;
  var audioEnabled = false;
  var isMuted = true;
  /* Reuse one element so Safari can unlock on Hear, then play later clips. */
  var audioEl = new Audio();
  var currentAudio = null;
  var skipSpeak = false;
  var timers = [];
  var tickInterval = null;
  var activeStartedAt = null;
  var pausedProgressMs = 0;
  var demoCompletePosted = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = String(seconds % 60).padStart(2, '0');
    return m + ':' + s;
  }

  function cancelAudio() {
    audioEl.pause();
    try {
      audioEl.currentTime = 0;
    } catch (err) {
      /* ignore seek before metadata */
    }
    currentAudio = null;
  }

  function pauseAudio() {
    if (currentAudio && !audioEl.paused) {
      audioEl.pause();
    }
  }

  function resumeAudio() {
    if (currentAudio) {
      audioEl.play().catch(function () {});
    }
  }

  function speak(filename) {
    if (isMuted || !filename || reducedMotion) return;
    audioEl.pause();
    audioEl.src = AUDIO_BASE + filename;
    currentAudio = audioEl;
    audioEl.play().catch(function () {});
  }

  /** Call play() inside the Hear click so later speak() is allowed (Safari). */
  function unlockAudioFromGesture() {
    var firstClip = TIMELINE[0] && TIMELINE[0].audio;
    if (!firstClip) return;
    audioEl.src = AUDIO_BASE + firstClip;
    var playPromise = audioEl.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          audioEl.pause();
          try {
            audioEl.currentTime = 0;
          } catch (err) {
            /* ignore */
          }
        })
        .catch(function () {});
    }
  }

  function visibleSlice() {
    var lastMessageIndex = -1;
    for (var i = visibleItems.length - 1; i >= 0; i--) {
      if (visibleItems[i].type === 'message') {
        lastMessageIndex = i;
        break;
      }
    }
    if (lastMessageIndex < 0) return visibleItems.slice();
    return visibleItems.slice(lastMessageIndex);
  }

  function renderTranscript() {
    var items = visibleSlice();
    transcriptEl.innerHTML = '';
    items.forEach(function (item) {
      if (item.type === 'event') {
        var eventEl = document.createElement('div');
        eventEl.className = 'phone-event';
        eventEl.setAttribute('data-scenario', String(item.scenario));
        eventEl.innerHTML = '<span class="phone-event-pill"></span>';
        eventEl.querySelector('.phone-event-pill').textContent = item.label;
        transcriptEl.appendChild(eventEl);
        return;
      }

      var isAria = item.speaker === 'aria';
      var msg = document.createElement('div');
      msg.className = 'phone-msg';
      msg.setAttribute('data-scenario', String(item.scenario));
      msg.innerHTML =
        '<div class="avatar ' + (isAria ? 'avatar--aria' : 'avatar--you') + '" aria-hidden="true"><span>' +
        (isAria ? 'A' : 'Y') +
        '</span></div>' +
        '<div class="phone-msg-body">' +
        '<div class="phone-msg-meta">' +
        '<span class="phone-msg-name"></span>' +
        '<span class="phone-msg-role"></span>' +
        '</div>' +
        '<p class="phone-msg-text"></p>' +
        '</div>';
      msg.querySelector('.phone-msg-name').textContent = isAria ? 'Ashley' : 'You';
      msg.querySelector('.phone-msg-role').textContent = isAria ? 'AI Receptionist' : 'Customer';
      msg.querySelector('.phone-msg-text').textContent = item.text;
      transcriptEl.appendChild(msg);
    });

    // Slide-in like the source preview when a new message arrives.
    if (!reducedMotion && items.length) {
      var last = transcriptEl.lastElementChild;
      if (last) {
        var height = last.offsetHeight + 16;
        transcriptEl.style.transition = 'none';
        transcriptEl.style.transform = 'translateY(' + height + 'px)';
        transcriptEl.getBoundingClientRect();
        transcriptEl.style.transition = 'transform 0.4s ease';
        transcriptEl.style.transform = 'translateY(0)';
      }
    }
  }

  function updateSpeaking() {
    var speaking = phase === 'active' && currentSpeaker === 'aria';
    waveformEl.classList.toggle('is-speaking', speaking && !reducedMotion);
  }

  function updatePhaseUi() {
    phaseBtn.dataset.phase = phase;
    if (phase === 'active') {
      phaseLabel.textContent = 'Pause';
    } else if (phase === 'paused') {
      phaseLabel.textContent = '▶ Resume';
    } else {
      phaseLabel.textContent = '↺ Replay';
    }
  }

  function updateHearUi() {
    hearWrap.classList.toggle('is-hear-aria', !audioEnabled);
    var volumeIcon = hearBtn.querySelector('.icon-volume');
    var micIcon = hearBtn.querySelector('.icon-mic');
    var micOffIcon = hearBtn.querySelector('.icon-mic-off');
    volumeIcon.hidden = audioEnabled;
    micIcon.hidden = !audioEnabled || isMuted;
    micOffIcon.hidden = !audioEnabled || !isMuted;
    if (!audioEnabled) {
      hearLabel.textContent = 'Hear Ashley';
    } else {
      hearLabel.textContent = isMuted ? 'Unmute' : 'Mute Ashley';
    }
  }

  function postDemoComplete() {
    if (demoCompletePosted) return;
    demoCompletePosted = true;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'dante-prototype-demo-complete' }, '*');
    }
  }

  function scheduleFrom(progressMs) {
    var cumulative = 0;
    TIMELINE.forEach(function (item, index) {
      cumulative += item.delay;
      if (cumulative <= progressMs) return;
      var wait = cumulative - progressMs;
      var timer = setTimeout(function () {
        var entry = Object.assign({ id: index }, item);
        visibleItems.push(entry);
        if (item.type === 'message') {
          currentSpeaker = item.speaker;
          if (!skipSpeak && item.speaker === 'aria') {
            speak(item.audio);
          }
        }
        renderTranscript();
        updateSpeaking();
      }, wait);
      timers.push(timer);
    });

    var remaining = TOTAL_DELAY + COMPLETE_TAIL_MS - progressMs;
    if (remaining > 0) {
      timers.push(
        setTimeout(function () {
          phase = 'complete';
          currentSpeaker = null;
          clearInterval(tickInterval);
          tickInterval = null;
          cancelAudio();
          updateSpeaking();
          updatePhaseUi();
          postDemoComplete();
        }, remaining)
      );
    }
  }

  function startTick() {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(function () {
      elapsedSeconds += 1;
      timerEl.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function startDemo() {
    clearTimers();
    cancelAudio();
    demoCompletePosted = false;
    phase = 'calling';
    visibleItems = [];
    elapsedSeconds = 0;
    currentSpeaker = null;
    pausedProgressMs = 0;
    skipSpeak = false;
    timerEl.textContent = '0:00';
    renderTranscript();
    updateSpeaking();
    updatePhaseUi();

    timers.push(
      setTimeout(function () {
        phase = 'active';
        activeStartedAt = Date.now();
        startTick();
        updatePhaseUi();
        scheduleFrom(0);
      }, CALLING_MS)
    );
  }

  function pauseDemo() {
    if (phase !== 'active') return;
    pausedProgressMs += Date.now() - activeStartedAt;
    phase = 'paused';
    clearTimers();
    pauseAudio();
    updateSpeaking();
    updatePhaseUi();
  }

  function resumeDemo() {
    if (phase !== 'paused') return;
    phase = 'active';
    activeStartedAt = Date.now();
    startTick();
    resumeAudio();
    scheduleFrom(pausedProgressMs);
    updateSpeaking();
    updatePhaseUi();
  }

  function resetDemo() {
    startDemo();
  }

  function onPhaseClick() {
    if (phase === 'active') {
      pauseDemo();
    } else if (phase === 'paused') {
      resumeDemo();
    } else {
      resetDemo();
    }
  }

  function onHearClick() {
    if (!audioEnabled) {
      audioEnabled = true;
      isMuted = false;
      updateHearUi();
      unlockAudioFromGesture();
      resetDemo();
      return;
    }
    isMuted = !isMuted;
    if (isMuted) cancelAudio();
    updateHearUi();
  }

  phaseBtn.addEventListener('click', onPhaseClick);
  hearBtn.addEventListener('click', onHearClick);

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'dante-prototype-replay') return;
    resetDemo();
  });

  updateHearUi();
  updatePhaseUi();

  // Resting first frame for non-autostart / reduced motion.
  visibleItems = [
    Object.assign({ id: 0 }, TIMELINE[0])
  ];
  currentSpeaker = 'aria';
  renderTranscript();
  updateSpeaking();

  if (shouldAutostart) {
    startDemo();
  } else if (!reducedMotion) {
    // Idle resting frame until host activates with autostart.
    phase = 'idle';
    updatePhaseUi();
  } else {
    phase = 'complete';
    updatePhaseUi();
  }
})();
