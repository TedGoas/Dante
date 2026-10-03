(function () {
  'use strict';

  const AUDIO_BASE = '/labs/ipod/audio/';
  const VISIBLE_ROWS = 6;
  const WHEEL_STEP_DEG = 18;
  const MARQUEE_HOLD_MS = 3000;
  const MARQUEE_PX_PER_SEC = 45;

  const els = {
    listScreen: document.getElementById('screen-list'),
    nowScreen: document.getElementById('screen-now'),
    songList: document.getElementById('song-list'),
    lcdPlay: document.getElementById('lcd-play'),
    nowIndex: document.getElementById('now-index'),
    nowTitle: document.getElementById('now-title'),
    nowArtist: document.getElementById('now-artist'),
    nowAlbum: document.getElementById('now-album'),
    nowElapsed: document.getElementById('now-elapsed'),
    nowRemaining: document.getElementById('now-remaining'),
    nowProgress: document.getElementById('now-progress'),
    lcdNote: document.getElementById('lcd-note'),
    wheel: document.getElementById('wheel'),
    btnMenu: document.getElementById('btn-menu'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnPlay: document.getElementById('btn-play'),
    btnSelect: document.getElementById('btn-select'),
    btnInfo: document.getElementById('btn-info'),
    btnInfoClose: document.getElementById('btn-info-close'),
    infoWindow: document.getElementById('info-window')
  };

  /** @type {{ id: string, title: string, artist: string, album?: string, file: string }[]} */
  let songs = [];
  let highlightIndex = 0;
  let playIndex = 0;
  let screen = 'list'; // 'list' | 'now'
  let listOffset = 0;
  let noteTimer = 0;
  /** Bumped on pause/load so a late audio.play() promise cannot resume after the user paused. */
  let playGeneration = 0;

  const marquee = {
    generation: 0,
    timer: 0,
    raf: 0,
    textEl: null,
    onEnd: null
  };

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
    if (onList) {
      renderList();
    } else {
      clearListMarquee();
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

  function songListLabel(song) {
    return song.artist + ' — ' + song.title;
  }

  function sortSongs(list) {
    return list.slice().sort(function (a, b) {
      var artistCmp = a.artist.localeCompare(b.artist, undefined, { sensitivity: 'base' });
      if (artistCmp !== 0) return artistCmp;
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    });
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function clearListMarquee() {
    marquee.generation += 1;
    if (marquee.timer) {
      window.clearTimeout(marquee.timer);
      marquee.timer = 0;
    }
    if (marquee.raf) {
      window.cancelAnimationFrame(marquee.raf);
      marquee.raf = 0;
    }
    if (marquee.textEl) {
      marquee.textEl.classList.remove('is-marquee');
      marquee.textEl.style.transitionDuration = '';
      marquee.textEl.style.transform = '';
    }
    marquee.textEl = null;
    marquee.onEnd = null;
  }

  function syncListMarquee() {
    clearListMarquee();
    if (screen !== 'list' || prefersReducedMotion()) return;

    const selected = els.songList.querySelector('.lcd__item.is-selected .lcd__item-title');
    if (!selected) return;

    const textEl = selected.querySelector('.lcd__item-title-text');
    if (!textEl) return;

    const overflow = textEl.scrollWidth - selected.clientWidth;
    if (overflow <= 1) return;

    const generation = marquee.generation;
    marquee.textEl = textEl;
    textEl.style.transform = 'translateX(0)';

    function isCurrent() {
      return generation === marquee.generation && screen === 'list';
    }

    function holdThen(next) {
      if (!isCurrent()) return;
      marquee.timer = window.setTimeout(function () {
        marquee.timer = 0;
        if (!isCurrent()) return;
        next();
      }, MARQUEE_HOLD_MS);
    }

    function animateTo(fromX, toX, then) {
      if (!isCurrent()) return;

      const distance = Math.abs(toX - fromX);
      const durationMs = Math.max(1200, (distance / MARQUEE_PX_PER_SEC) * 1000);
      const started = performance.now();
      textEl.classList.add('is-marquee');

      function frame(now) {
        if (!isCurrent()) return;

        const t = Math.min(1, (now - started) / durationMs);
        const x = fromX + (toX - fromX) * t;
        textEl.style.transform = 'translateX(' + x + 'px)';

        if (t < 1) {
          marquee.raf = window.requestAnimationFrame(frame);
          return;
        }

        marquee.raf = 0;
        textEl.classList.remove('is-marquee');
        textEl.style.transform = 'translateX(' + toX + 'px)';
        then();
      }

      marquee.raf = window.requestAnimationFrame(frame);
    }

    function cycle() {
      if (!isCurrent()) return;

      const distance = textEl.scrollWidth - selected.clientWidth;
      if (distance <= 1) return;

      // Start → end → hold → start → hold → repeat
      holdThen(function () {
        animateTo(0, -distance, function () {
          holdThen(function () {
            animateTo(-distance, 0, function () {
              cycle();
            });
          });
        });
      });
    }

    cycle();
  }

  function renderList() {
    ensureHighlightVisible();
    clearListMarquee();
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

      const titleText = document.createElement('span');
      titleText.className = 'lcd__item-title-text';
      titleText.textContent = songListLabel(song);
      title.appendChild(titleText);

      li.appendChild(title);

      if (i === highlightIndex) {
        const chevron = document.createElement('span');
        chevron.className = 'lcd__item-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '›';
        li.appendChild(chevron);
      }

      frag.appendChild(li);
    }

    els.songList.replaceChildren(frag);

    // Measure after layout settles (flex + font can report 0 overflow on the first frame).
    function measureMarquee() {
      syncListMarquee();
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(measureMarquee);
        } else {
          measureMarquee();
        }
      });
    });
  }

  function renderNowPlaying() {
    const song = songs[playIndex];
    if (!song) return;
    if (els.nowIndex) {
      els.nowIndex.textContent = playIndex + 1 + ' of ' + songs.length;
    }
    els.nowTitle.textContent = song.title;
    els.nowArtist.textContent = song.artist;
    if (els.nowAlbum) {
      els.nowAlbum.textContent = song.album || '';
    }
    updateProgressUI();
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

  function hasLoadedTrack() {
    return Boolean(audio.src && audio.src.indexOf('/audio/') !== -1);
  }

  function pauseAudio() {
    playGeneration += 1;
    audio.pause();
    updateStatusPlay();
    if (screen === 'now') renderNowPlaying();
  }

  function playAudio() {
    if (!songs.length) return;
    if (!hasLoadedTrack()) {
      var index = screen === 'list' ? highlightIndex : playIndex;
      loadTrack(index, true);
      return;
    }

    const generation = (playGeneration += 1);
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          if (generation !== playGeneration) {
            audio.pause();
            return;
          }
          updateStatusPlay();
          if (screen === 'now') renderNowPlaying();
        })
        .catch(function () {
          if (generation !== playGeneration) return;
          audio.pause();
          showNote('No audio file yet');
          updateStatusPlay();
          if (screen === 'now') renderNowPlaying();
        });
    }
  }

  function loadTrack(index, autoplay) {
    if (!songs.length) return;
    playGeneration += 1;
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

    if (autoplay) {
      playAudio();
    } else {
      updateStatusPlay();
      if (screen === 'now') renderNowPlaying();
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
    // Keep playing only if we were already playing; don't force-start when paused.
    const wasPlaying = !audio.paused;
    loadTrack(next, wasPlaying);
    if (screen === 'list') {
      highlightIndex = playIndex;
      ensureHighlightVisible();
      renderList();
    } else {
      renderNowPlaying();
    }
  }

  function togglePlayPause() {
    if (!songs.length) return;

    if (!hasLoadedTrack()) {
      var index = screen === 'list' ? highlightIndex : playIndex;
      if (screen === 'list') setScreen('now');
      loadTrack(index, true);
      return;
    }

    if (audio.paused) {
      if (screen === 'list') setScreen('now');
      playAudio();
    } else {
      pauseAudio();
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

  function onWheelPointerDown(event) {
    if (event.button != null && event.button !== 0) return;

    wheelState.dragging = true;
    wheelState.pointerId = event.pointerId;
    wheelState.lastAngle = angleFromEvent(event);
    wheelState.accum = 0;
    els.wheel.closest('.ipod__wheel')?.classList.add('is-dragging');
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
    els.wheel.closest('.ipod__wheel')?.classList.remove('is-dragging');
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

  let infoReturnFocus = true;

  const stickieDrag = {
    active: false,
    pointerId: null,
    offsetX: 0,
    offsetY: 0
  };

  function infoWindowOpen() {
    return Boolean(els.infoWindow && els.infoWindow.open);
  }

  function placeInfoWindowNearIcon() {
    if (!els.infoWindow || !els.btnInfo) return;

    var icon = els.btnInfo.getBoundingClientRect();
    var dlg = els.infoWindow;
    var w = dlg.offsetWidth;
    var h = dlg.offsetHeight;
    var gap = 10;
    // Sit just left of the Info icon, between the icon column and the iPod.
    var left = icon.left - w - gap;
    var top = Math.max(8, icon.top - 10);

    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - h - 8));

    dlg.style.left = left + 'px';
    dlg.style.top = top + 'px';
  }

  function openInfoWindow() {
    if (!els.infoWindow || typeof els.infoWindow.showModal !== 'function') return;
    if (els.infoWindow.open) return;
    infoReturnFocus = true;
    els.infoWindow.showModal();
    placeInfoWindowNearIcon();
    if (els.btnInfoClose) els.btnInfoClose.focus();
  }

  function closeInfoWindow() {
    if (!els.infoWindow || !els.infoWindow.open) return;
    stickieDrag.active = false;
    stickieDrag.pointerId = null;
    var titlebar = els.infoWindow.querySelector('.stickie__titlebar');
    if (titlebar) titlebar.classList.remove('is-dragging');
    els.infoWindow.close();
  }

  function bindInfoWindow() {
    if (!els.infoWindow || !els.btnInfo) return;

    /** Set when Escape dismisses the dialog so keydown does not also call goMenu. */
    var escapeClosedInfo = false;
    var titlebar = els.infoWindow.querySelector('.stickie__titlebar');

    els.btnInfo.addEventListener('click', function () {
      openInfoWindow();
    });

    if (els.btnInfoClose) {
      els.btnInfoClose.addEventListener('click', function () {
        closeInfoWindow();
      });
    }

    els.infoWindow.addEventListener('click', function (event) {
      if (event.target === els.infoWindow) {
        closeInfoWindow();
      }
    });

    els.infoWindow.addEventListener('cancel', function () {
      escapeClosedInfo = true;
      window.setTimeout(function () {
        escapeClosedInfo = false;
      }, 0);
    });

    els.infoWindow.addEventListener('close', function () {
      if (infoReturnFocus && els.btnInfo) els.btnInfo.focus();
    });

    if (titlebar) {
      titlebar.addEventListener('pointerdown', function (event) {
        if (event.button != null && event.button !== 0) return;
        if (event.target.closest && event.target.closest('.stickie__close')) return;

        var rect = els.infoWindow.getBoundingClientRect();
        stickieDrag.active = true;
        stickieDrag.pointerId = event.pointerId;
        stickieDrag.offsetX = event.clientX - rect.left;
        stickieDrag.offsetY = event.clientY - rect.top;
        titlebar.classList.add('is-dragging');
        titlebar.setPointerCapture(event.pointerId);
        event.preventDefault();
      });

      titlebar.addEventListener('pointermove', function (event) {
        if (!stickieDrag.active || event.pointerId !== stickieDrag.pointerId) return;

        var w = els.infoWindow.offsetWidth;
        var h = els.infoWindow.offsetHeight;
        var left = event.clientX - stickieDrag.offsetX;
        var top = event.clientY - stickieDrag.offsetY;

        left = Math.max(0, Math.min(left, window.innerWidth - w));
        top = Math.max(0, Math.min(top, window.innerHeight - h));

        els.infoWindow.style.left = left + 'px';
        els.infoWindow.style.top = top + 'px';
      });

      function endStickieDrag(event) {
        if (event.pointerId !== stickieDrag.pointerId) return;
        stickieDrag.active = false;
        stickieDrag.pointerId = null;
        titlebar.classList.remove('is-dragging');
      }

      titlebar.addEventListener('pointerup', endStickieDrag);
      titlebar.addEventListener('pointercancel', endStickieDrag);
    }

    // Expose for keydown handler without a bigger refactor.
    bindInfoWindow.wasEscapeClose = function () {
      return escapeClosedInfo;
    };
  }

  function bindControls() {
    bindInfoWindow();

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
        if (
          infoWindowOpen() ||
          (bindInfoWindow.wasEscapeClose && bindInfoWindow.wasEscapeClose())
        ) {
          return;
        }
        goMenu();
        return;
      }
      if (infoWindowOpen()) return;
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
    });
    audio.addEventListener('pause', function () {
      updateStatusPlay();
    });
    audio.addEventListener('ended', function () {
      updateStatusPlay();
      // Only advance if this ending wasn't from a user pause/menu (generation still current).
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
        songs = sortSongs(Array.isArray(data) ? data : []);
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
