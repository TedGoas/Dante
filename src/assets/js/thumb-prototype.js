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

function activateThumb(root) {
  const iframe = root.querySelector('.thumb-prototype__iframe');

  if (!iframe) {
    return;
  }

  const play = () => {
    postToIframe(root, 'dante-thumb-prototype-play');
  };

  if (!iframe.getAttribute('src')) {
    iframe.addEventListener('load', play, { once: true });
    preloadThumb(root);
  } else if (iframe.contentDocument?.readyState === 'complete' || iframe.dataset.ready === '1') {
    play();
  } else {
    iframe.addEventListener('load', play, { once: true });
  }

  root.classList.add('is-active');
}

function deactivateThumb(root) {
  if (!root.classList.contains('is-active')) {
    return;
  }

  postToIframe(root, 'dante-thumb-prototype-reset');
  root.classList.remove('is-active');
}

function initThumbPrototype(root) {
  let active = false;
  const iframe = root.querySelector('.thumb-prototype__iframe');

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
    activateThumb(root);
  };

  const stop = () => {
    if (!active) {
      return;
    }

    active = false;
    deactivateThumb(root);
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
