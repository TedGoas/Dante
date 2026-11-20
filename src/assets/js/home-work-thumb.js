function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Narrow stack or real touch: static posters only — skip iframe preload/play. */
function prefersStaticThumbs() {
  return window.matchMedia('(max-width: 640px), (hover: none) and (pointer: coarse)').matches;
}

function postToIframe(root, type) {
  const iframe = root.querySelector('.home-work-thumb__iframe');

  if (!iframe?.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage({ type }, '*');
}

function preloadThumb(root) {
  const iframe = root.querySelector('.home-work-thumb__iframe');
  const source = iframe?.dataset.src;

  if (!iframe || !source || iframe.getAttribute('src')) {
    return;
  }

  iframe.src = source;
}

function isInteractiveThumb(root) {
  return root.hasAttribute('data-home-thumb-interactive');
}

function pointerStillOverRoot(root, event) {
  const x = event.clientX;
  const y = event.clientY;

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return false;
  }

  const hit = document.elementFromPoint(x, y);
  return Boolean(hit && root.contains(hit));
}

function initHomeWorkThumb(root) {
  let active = false;
  let pendingPlayHandler = null;
  const iframe = root.querySelector('.home-work-thumb__iframe');
  const interactive = isInteractiveThumb(root);

  const clearPendingPlay = () => {
    if (pendingPlayHandler && iframe) {
      iframe.removeEventListener('load', pendingPlayHandler);
      pendingPlayHandler = null;
    }
  };

  const playIfActive = () => {
    pendingPlayHandler = null;

    if (!active) {
      return;
    }

    postToIframe(root, 'dante-home-thumb-play');
  };

  const schedulePlay = () => {
    clearPendingPlay();

    if (!iframe) {
      return;
    }

    // Only trust our load flag — readyState can be "complete" on about:blank mid-nav.
    if (iframe.dataset.ready === '1') {
      playIfActive();
      return;
    }

    pendingPlayHandler = playIfActive;
    iframe.addEventListener('load', pendingPlayHandler, { once: true });
  };

  if (iframe) {
    iframe.addEventListener('load', () => {
      iframe.dataset.ready = '1';
    });
  }

  preloadThumb(root);

  const start = () => {
    if (active) {
      return;
    }

    active = true;
    root.classList.add('is-active');
    schedulePlay();
  };

  const stop = (event) => {
    if (!active) {
      return;
    }

    // Interactive iframes steal the pointer; treat that as still on the tile.
    if (interactive && event && pointerStillOverRoot(root, event)) {
      return;
    }

    active = false;
    clearPendingPlay();
    postToIframe(root, 'dante-home-thumb-reset');
    root.classList.remove('is-active');
  };

  // Host is the media cell; caption link lives inside and keeps hover active.
  root.addEventListener('pointerenter', start);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('focusin', start);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) {
      stop();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const thumbs = document.querySelectorAll('[data-home-thumb]');

  if (prefersStaticThumbs()) {
    // Captions are CSS-hidden; also drop them from the a11y tree so list
    // items don't announce duplicate "View case study" chrome.
    document.querySelectorAll('.home-work-grid__caption').forEach((caption) => {
      caption.setAttribute('aria-hidden', 'true');
    });
    return;
  }

  if (prefersReducedMotion()) {
    thumbs.forEach(preloadThumb);
    return;
  }

  thumbs.forEach(initHomeWorkThumb);
});
