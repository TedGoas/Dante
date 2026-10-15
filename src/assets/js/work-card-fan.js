(function () {
  'use strict';

  var roots = document.querySelectorAll('[data-card-fan]');
  if (!roots.length) return;

  var coarseHover = window.matchMedia('(hover: none)');

  function onActivate(event) {
    if (!coarseHover.matches) return;
    var root = event.currentTarget;
    if (!(root instanceof HTMLElement)) return;
    var willExpand = !root.classList.contains('is-expanded');
    root.classList.toggle('is-expanded');
    /* Blur on collapse so :focus-within cannot keep the fan stuck open. */
    if (!willExpand) {
      root.blur();
    }
  }

  function onKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!coarseHover.matches) return;
    event.preventDefault();
    onActivate(event);
  }

  roots.forEach(function (root) {
    root.addEventListener('click', onActivate);
    root.addEventListener('keydown', onKeydown);
  });
})();
