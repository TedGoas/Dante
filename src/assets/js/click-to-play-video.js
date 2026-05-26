function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function loadVideoSource(video) {
  const source = video.dataset.videoSrc;

  if (!source || video.src) {
    return;
  }

  video.src = source;
}

function initClickToPlay(root) {
  const video = root.querySelector('.click-to-play__video');
  const startButton = root.querySelector('.click-to-play__start');
  const poster = root.querySelector('.click-to-play__poster');

  if (!video || !startButton) {
    return;
  }

  const mediaLabel = poster?.alt || 'video';

  const activate = () => {
    loadVideoSource(video);
    video.controls = true;
    video.removeAttribute('aria-hidden');
    video.setAttribute('aria-label', mediaLabel);
    root.classList.add('is-active');

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        root.classList.remove('is-active');
        video.controls = false;
        video.setAttribute('aria-hidden', 'true');
        video.removeAttribute('aria-label');
      });
    }
  };

  startButton.addEventListener('click', () => {
    if (root.classList.contains('is-active')) {
      return;
    }

    activate();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion()) {
    return;
  }

  document.querySelectorAll('[data-click-to-play]').forEach(initClickToPlay);
});
