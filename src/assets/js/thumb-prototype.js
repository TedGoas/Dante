function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function postToIframe(root, type) {
  const iframe = root.querySelector('.thumb-prototype__iframe');

  if (!iframe?.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage({ type }, '*');
}

function preloadThumb(root) {
  const iframe = root.querySelector('.thumb-prototype__iframe');
  const source = iframe?.dataset.src;

  if (!iframe || !source || iframe.getAttribute('src')) {
    return;
  }

  iframe.src = source;
}

function initThumbPrototype(root) {
  let active = false;
  let pendingPlayHandler = null;
  const iframe = root.querySelector('.thumb-prototype__iframe');

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

    postToIframe(root, 'dante-thumb-prototype-play');
  };

  const schedulePlay = () => {
    clearPendingPlay();

    if (!iframe) {
      return;
    }

    if (iframe.dataset.ready === '1' || iframe.contentDocument?.readyState === 'complete') {
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

  const stop = () => {
    if (!active) {
      return;
    }

    active = false;
    clearPendingPlay();
    postToIframe(root, 'dante-thumb-prototype-reset');
    root.classList.remove('is-active');
  };

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
  if (prefersReducedMotion()) {
    document.querySelectorAll('[data-thumb-prototype]').forEach(preloadThumb);
    return;
  }

  document.querySelectorAll('[data-thumb-prototype]').forEach(initThumbPrototype);
});
