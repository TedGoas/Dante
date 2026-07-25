const ACTIVATION_DELAY_MS = 1000;
const VISIBILITY_THRESHOLD = 0.35;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function activateEmbed(root) {
  const iframe = root.querySelector('.prototype-embed__iframe');
  const source = iframe?.dataset.src;

  if (!iframe || !source || root.classList.contains('is-active')) {
    return;
  }

  iframe.src = source.includes('?') ? `${source}&autostart=1` : `${source}?autostart=1`;
  root.classList.add('is-active');
}

function showReplayButton(root) {
  const replayButton = root.querySelector('.prototype-embed__replay');

  if (!replayButton) {
    return;
  }

  root.classList.add('is-demo-complete');
  replayButton.hidden = false;
}

function hideReplayButton(root) {
  const replayButton = root.querySelector('.prototype-embed__replay');

  if (!replayButton) {
    return;
  }

  root.classList.remove('is-demo-complete');
  replayButton.hidden = true;
}

function replayEmbed(root) {
  const iframe = root.querySelector('.prototype-embed__iframe');

  if (!iframe?.contentWindow) {
    return;
  }

  hideReplayButton(root);
  iframe.contentWindow.postMessage({ type: 'dante-prototype-replay' }, '*');
}

function initPrototypeEmbed(root) {
  if (root.classList.contains('is-active')) {
    return;
  }

  const iframe = root.querySelector('.prototype-embed__iframe');
  const replayButton = root.querySelector('.prototype-embed__replay');

  if (replayButton) {
    replayButton.addEventListener('click', () => {
      replayEmbed(root);
    });
  }

  let timerId = null;

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      timerId = window.setTimeout(() => {
        activateEmbed(root);
        observer.disconnect();
      }, ACTIVATION_DELAY_MS);
      return;
    }

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }, { threshold: VISIBILITY_THRESHOLD });

  observer.observe(root);

  root._prototypeEmbedIframe = iframe;
}

function handlePrototypeMessage(event) {
  if (event.data?.type !== 'dante-prototype-demo-complete') {
    return;
  }

  document.querySelectorAll('[data-prototype-embed]').forEach((root) => {
    const iframe = root._prototypeEmbedIframe || root.querySelector('.prototype-embed__iframe');

    if (iframe?.contentWindow === event.source) {
      showReplayButton(root);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion()) {
    return;
  }

  document.querySelectorAll('[data-prototype-embed]').forEach(initPrototypeEmbed);
  window.addEventListener('message', handlePrototypeMessage);
});
