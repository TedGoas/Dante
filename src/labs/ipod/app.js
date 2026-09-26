(function () {
  'use strict';

  const AUDIO_BASE = '/labs/ipod/audio/';
  const VISIBLE_ROWS = 6;
  const WHEEL_STEP_DEG = 18;

  const els = {
    listScreen: document.getElementById('screen-list'),
    nowScreen: document.getElementById('screen-now'),
    songList: document.getElementById('song-list'),
    lcdTitle: document.getElementById('lcd-title'),
    lcdPlay: document.getElementById('lcd-play'),
    nowTitle: document.getElementById('now-title'),
    nowArtist: document.getElementById('now-artist'),
    nowElapsed: document.getElementById('now-elapsed'),
    nowRemaining: document.getElementById('now-remaining'),
    nowProgress: document.getElementById('now-progress'),
    nowState: document.getElementById('now-state'),
    lcdNote: document.getElementById('lcd-note'),
    wheel: document.getElementById('wheel'),
    btnMenu: document.getElementById('btn-menu'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnPlay: document.getElementById('btn-play'),
    btnSelect: document.getElementById('btn-select')
  };

  /** @type {{ id: string, title: string, artist: string, file: string }[]} */
  let songs = [];
  let highlightIndex = 0;
  let playIndex = 0;
  let screen = 'list'; // 'list' | 'now'
  let listOffset = 0;
  let noteTimer = 0;

  const audio = new Audio();
  audio.preload = 'none';

  const wheelState = {
    dragging: false,
    lastAngle: 0,
    accum: 0,
    pointerId: null
  };

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return m + ':' + String(rem).padStart(2, '0');
  }

  function showNote(message) {
    els.lcdNote.textContent = message;
    els.lcdNote.hidden = false;
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(function () {
      els.lcdNote.hidden = true;
    }, 2400);
  }

  function updateStatusPlay() {
    if (!els.lcdPlay) return;
    els.lcdPlay.classList.toggle('is-visible', !audio.paused);
  }

  function setScreen(next) {
    screen = next;
    const onList = next === 'list';
    els.listScreen.classList.toggle('is-active', onList);
    els.nowScreen.classList.toggle('is-active', !onList);
    els.lcdTitle.textContent = onList ? 'Music' : 'Now Playing';
    if (onList) {
      renderList();
    } else {
      renderNowPlaying();
    }
    updateStatusPlay();
  }

  function clampHighlight() {
    if (!songs.length) {
      highlightIndex = 0;
      return;
    }
    highlightIndex = Math.max(0, Math.min(songs.length - 1, highlightIndex));
  }

  function ensureHighlightVisible() {
    if (highlightIndex < listOffset) {
      listOffset = highlightIndex;
    } else if (highlightIndex >= listOffset + VISIBLE_ROWS) {
      listOffset = highlightIndex - VISIBLE_ROWS + 1;
    }
    listOffset = Math.max(0, Math.min(Math.max(0, songs.length - VISIBLE_ROWS), listOffset));
  }

  function moveHighlight(delta) {
    if (!songs.length) return;
    highlightIndex += delta;
    clampHighlight();
    ensureHighlightVisible();
    if (screen === 'list') {
      renderList();
    }
  }

  function renderList() {
    ensureHighlightVisible();
    const frag = document.createDocumentFragment();
    const end = Math.min(songs.length, listOffset + VISIBLE_ROWS);

    for (let i = listOffset; i < end; i++) {
      const song = songs[i];
      const li = document.createElement('li');
      li.className = 'lcd__item' + (i === highlightIndex ? ' is-selected' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === highlightIndex ? 'true' : 'false');
      li.dataset.index = String(i);

      const title = document.createElement('span');
      title.className = 'lcd__item-title';
      title.textContent = song.title;

      const chevron = document.createElement('span');
      chevron.className = 'lcd__item-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '›';

      li.appendChild(title);
      li.appendChild(chevron);
      frag.appendChild(li);
    }

    els.songList.replaceChildren(frag);
  }

  function renderNowPlaying() {
    const song = songs[playIndex];
    if (!song) return;
    els.nowTitle.textContent = song.title;
    els.nowArtist.textContent = song.artist;
    updateProgressUI();
    els.nowState.textContent = audio.paused ? '❚❚' : '▶';
  }

  function updateProgressUI() {
    const duration = audio.duration;
    const current = audio.currentTime || 0;
    const hasDuration = Number.isFinite(duration) && duration > 0;
    const pct = hasDuration ? Math.min(100, (current / duration) * 100) : 0;

    els.nowElapsed.textContent = formatTime(current);
    els.nowRemaining.textContent = hasDuration
      ? '-' + formatTime(Math.max(0, duration - current))
      : '-0:00';
    els.nowProgress.style.width = pct + '%';
  }

  function audioSrcFor(song) {
    return AUDIO_BASE + encodeURIComponent(song.file);
  }

  function loadTrack(index, autoplay) {
    if (!songs.length) return;
    playIndex = Math.max(0, Math.min(songs.length - 1, index));
    highlightIndex = playIndex;
    const song = songs[playIndex];
    audio.pause();
    audio.src = audioSrcFor(song);
    audio.load();

    if (screen === 'now') {
      renderNowPlaying();
    } else {
      ensureHighlightVisible();
      renderList();
    }

    if (!autoplay) return;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          if (screen === 'now') renderNowPlaying();
        })
        .catch(function () {
          audio.pause();
          showNote('No audio file yet');
          updateStatusPlay();
          if (screen === 'now') renderNowPlaying();
        });
    }
  }

  function selectCurrent() {
    if (!songs.length) return;
    playIndex = highlightIndex;
    setScreen('now');
    loadTrack(playIndex, true);
  }

  function goMenu() {
    setScreen('list');
  }

  function skip(delta) {
    if (!songs.length) return;
    const next = playIndex + delta;
    if (next < 0 || next >= songs.length) return;
    const shouldPlay = !audio.paused || screen === 'now';
    loadTrack(next, shouldPlay || screen === 'now');
    if (screen === 'list') {
      highlightIndex = playIndex;
      ensureHighlightVisible();
      renderList();
    }
  }

  function hasLoadedTrack() {
    return Boolean(audio.getAttribute('src') || (audio.src && audio.src.indexOf('/audio/') !== -1));
  }

  function togglePlayPause() {
    if (!songs.length) return;

    if (!hasLoadedTrack()) {
      loadTrack(screen === 'list' ? highlightIndex : playIndex, true);
      if (screen === 'list') setScreen('now');
      return;
    }

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(function () {
            if (screen !== 'now') setScreen('now');
            else renderNowPlaying();
          })
          .catch(function () {
            audio.pause();
            showNote('No audio file yet');
            updateStatusPlay();
          });
      }
    } else {
      audio.pause();
      updateStatusPlay();
      if (screen === 'now') renderNowPlaying();
    }
  }

  /* —— Wheel math —— */

  function angleFromEvent(event) {
    const rect = els.wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = event.clientX - cx;
    const y = event.clientY - cy;
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  function normalizeDelta(delta) {
    if (delta > 180) return delta - 360;
    if (delta < -180) return delta + 360;
    return delta;
  }

  function isOnCenterOrButton(target) {
    return Boolean(
      target.closest &&
        (target.closest('.wheel__center') || target.closest('.wheel__btn'))
    );
  }

  function onWheelPointerDown(event) {
    if (event.button != null && event.button !== 0) return;
    if (isOnCenterOrButton(event.target)) return;

    wheelState.dragging = true;
    wheelState.pointerId = event.pointerId;
    wheelState.lastAngle = angleFromEvent(event);
    wheelState.accum = 0;
    els.wheel.classList.add('is-dragging');
    els.wheel.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onWheelPointerMove(event) {
    if (!wheelState.dragging || event.pointerId !== wheelState.pointerId) return;

    const angle = angleFromEvent(event);
    const delta = normalizeDelta(angle - wheelState.lastAngle);
    wheelState.lastAngle = angle;
    wheelState.accum += delta;

    while (wheelState.accum >= WHEEL_STEP_DEG) {
      wheelState.accum -= WHEEL_STEP_DEG;
      if (screen === 'list') moveHighlight(1);
    }
    while (wheelState.accum <= -WHEEL_STEP_DEG) {
      wheelState.accum += WHEEL_STEP_DEG;
      if (screen === 'list') moveHighlight(-1);
    }
  }

  function onWheelPointerUp(event) {
    if (event.pointerId !== wheelState.pointerId) return;
    wheelState.dragging = false;
    wheelState.pointerId = null;
    els.wheel.classList.remove('is-dragging');
    try {
      els.wheel.releasePointerCapture(event.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  function onWheelKeyScroll(event) {
    if (screen !== 'list') return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveHighlight(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveHighlight(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectCurrent();
    }
  }

  function bindControls() {
    els.btnMenu.addEventListener('click', goMenu);
    els.btnSelect.addEventListener('click', selectCurrent);
    els.btnPrev.addEventListener('click', function () {
      skip(-1);
    });
    els.btnNext.addEventListener('click', function () {
      skip(1);
    });
    els.btnPlay.addEventListener('click', togglePlayPause);

    els.wheel.addEventListener('pointerdown', onWheelPointerDown);
    els.wheel.addEventListener('pointermove', onWheelPointerMove);
    els.wheel.addEventListener('pointerup', onWheelPointerUp);
    els.wheel.addEventListener('pointercancel', onWheelPointerUp);

    document.addEventListener('keydown', function (event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'Escape') {
        goMenu();
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        togglePlayPause();
        return;
      }
      onWheelKeyScroll(event);
    });

    audio.addEventListener('timeupdate', function () {
      if (screen === 'now') updateProgressUI();
    });
    audio.addEventListener('loadedmetadata', function () {
      if (screen === 'now') updateProgressUI();
    });
    audio.addEventListener('play', function () {
      updateStatusPlay();
      if (screen === 'now') els.nowState.textContent = '▶';
    });
    audio.addEventListener('pause', function () {
      updateStatusPlay();
      if (screen === 'now') els.nowState.textContent = '❚❚';
    });
    audio.addEventListener('ended', function () {
      updateStatusPlay();
      if (playIndex < songs.length - 1) {
        loadTrack(playIndex + 1, true);
      } else if (screen === 'now') {
        renderNowPlaying();
      }
    });
  }

  function init() {
    bindControls();

    fetch('/labs/ipod/songs.json')
      .then(function (res) {
        if (!res.ok) throw new Error('songs.json missing');
        return res.json();
      })
      .then(function (data) {
        songs = Array.isArray(data) ? data : [];
        highlightIndex = 0;
        playIndex = 0;
        setScreen('list');
      })
      .catch(function () {
        songs = [];
        showNote('Could not load songs');
        setScreen('list');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
