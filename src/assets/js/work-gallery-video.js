(function () {
  'use strict';

  var frames = document.querySelectorAll('[data-gallery-video]');
  if (!frames.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncLabel(frame, video) {
    var playing = !video.paused && !video.ended;
    frame.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    frame.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }

  function toggle(frame, video) {
    if (video.paused || video.ended) {
      video.play().catch(function () {});
    } else {
      video.pause();
    }
    syncLabel(frame, video);
  }

  frames.forEach(function (frame) {
    if (!(frame instanceof HTMLElement)) return;
    var video = frame.querySelector('video');
    if (!(video instanceof HTMLVideoElement)) return;

    frame.setAttribute('role', 'button');
    if (!frame.hasAttribute('tabindex')) {
      frame.setAttribute('tabindex', '0');
    }

    if (reducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
      try {
        video.currentTime = 0;
      } catch (err) {
        /* ignore */
      }
    } else if (video.paused && video.autoplay) {
      video.play().catch(function () {});
    }

    syncLabel(frame, video);

    video.addEventListener('play', function () {
      syncLabel(frame, video);
    });
    video.addEventListener('pause', function () {
      syncLabel(frame, video);
    });

    frame.addEventListener('click', function (event) {
      if (event.target instanceof HTMLElement && event.target.closest('a')) return;
      toggle(frame, video);
    });

    frame.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle(frame, video);
    });
  });
})();
