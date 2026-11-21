function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Narrow stack or real touch: static posters only — skip iframe preload/play. */
function prefersStaticThumbs() {
  return window.matchMedia('(max-width: 640px), (hover: none) and (pointer: coarse)').matches;
}

/* Start fetching before the tile is on screen so hover can play sooner. */
const PRELOAD_ROOT_MARGIN = '400px 0px';

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

function markIframeReady(root) {
  root.classList.add('is-iframe-ready');
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

function observePreload(thumbs) {
  const roots = Array.from(thumbs);

  if (!roots.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    roots.forEach(preloadThumb);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        preloadThumb(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: PRELOAD_ROOT_MARGIN, threshold: 0 }
  );

  roots.forEach((root) => observer.observe(root));
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
      markIframeReady(root);
    });
  }

  const start = () => {
    // Hover/focus before the IO preload window — kick off fetch now.
    preloadThumb(root);

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
    // Focus into an iframe reports relatedTarget null. Wait a frame so
    // document.activeElement can settle on the iframe (still inside root).
    requestAnimationFrame(() => {
      if (!root.contains(document.activeElement)) {
        stop(event);
      }
    });
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

  // Desktop: posters are visual placeholders only — caption is the real link.
  document.querySelectorAll('.home-work-grid__poster-link').forEach((poster) => {
    poster.setAttribute('aria-hidden', 'true');
    poster.setAttribute('tabindex', '-1');
  });

  if (prefersReducedMotion()) {
    // Still defer fetch; resting iframe frame shows once loaded.
    thumbs.forEach((root) => {
      const iframe = root.querySelector('.home-work-thumb__iframe');
      if (iframe) {
        iframe.addEventListener('load', () => markIframeReady(root));
      }
    });
    observePreload(thumbs);
    return;
  }

  thumbs.forEach(initHomeWorkThumb);
  observePreload(thumbs);
});
