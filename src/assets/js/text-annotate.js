(() => {
  const VISIBILITY_THRESHOLD = 0.35;
  const UNDERLINE_START_DELAY_MS = 500;
  const UNDERLINE_STROKE_MS = 520;
  const UNDERLINE_SECOND_DELAY_MS = 220;
  const HIGHLIGHT_STAGGER_MS = 160;
  const HIGHLIGHT_DIRECTIONS = ['from-left', 'from-right', 'from-left'];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function prepareStroke(path, reverse) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = reverse ? `${-length}` : `${length}`;
  }

  function drawStroke(path, durationMs) {
    // Strong decelerate: launches quickly, eases into the end of the stroke.
    path.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.05, 0.7, 0.1, 1)`;
    path.style.strokeDashoffset = '0';
  }

  function prepareUnderline(root) {
    const primary = root.querySelector('.text-annotate__stroke--primary');
    const secondary = root.querySelector('.text-annotate__stroke--secondary');

    if (!primary || !secondary) {
      return;
    }

    prepareStroke(primary, false);
    prepareStroke(secondary, true);
    root.classList.add('is-prepared');
  }

  function drawUnderline(root) {
    if (root.classList.contains('is-drawn')) {
      return;
    }

    const primary = root.querySelector('.text-annotate__stroke--primary');
    const secondary = root.querySelector('.text-annotate__stroke--secondary');

    if (!primary || !secondary) {
      root.classList.add('is-drawn');
      return;
    }

    root.classList.add('is-drawn');
    drawStroke(primary, UNDERLINE_STROKE_MS);
    window.setTimeout(() => {
      drawStroke(secondary, UNDERLINE_STROKE_MS);
    }, UNDERLINE_SECOND_DELAY_MS);
  }

  function prepareHighlight(root, direction) {
    root.classList.add(`text-annotate--${direction}`);
    root.classList.add('is-prepared');
  }

  function drawHighlight(root) {
    if (root.classList.contains('is-drawn')) {
      return;
    }

    root.classList.add('is-drawn');
  }

  function revealAll(roots) {
    roots.forEach((root) => {
      root.classList.add('is-prepared');
      root.classList.add('is-drawn');
    });
  }

  function observeHighlights(highlights) {
    highlights.forEach((root, index) => {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        window.setTimeout(() => {
          drawHighlight(root);
        }, index * HIGHLIGHT_STAGGER_MS);
        observer.disconnect();
      }, { threshold: VISIBILITY_THRESHOLD });

      observer.observe(root);
    });
  }

  const roots = Array.from(document.querySelectorAll('.text-annotate'));

  if (!roots.length) {
    return;
  }

  if (prefersReducedMotion()) {
    revealAll(roots);
    return;
  }

  const underlines = [];
  const highlights = [];

  roots.forEach((root) => {
    if (root.classList.contains('text-annotate--underline-double')) {
      underlines.push(root);
      return;
    }

    if (root.classList.contains('text-annotate--highlight')) {
      highlights.push(root);
    }
  });

  underlines.forEach((root) => {
    prepareUnderline(root);
  });

  highlights.forEach((root, index) => {
    prepareHighlight(root, HIGHLIGHT_DIRECTIONS[index % HIGHLIGHT_DIRECTIONS.length]);
  });

  // Double rAF so prepared dash/clip state paints before the draw class flips.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        underlines.forEach((root) => {
          drawUnderline(root);
        });
      }, UNDERLINE_START_DELAY_MS);
      observeHighlights(highlights);
    });
  });
})();
