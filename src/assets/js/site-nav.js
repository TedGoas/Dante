(() => {
  const nav = document.querySelector(".site-nav");
  const toggle = nav && nav.querySelector(".site-nav__toggle");
  const label = toggle && toggle.querySelector("[data-site-nav-label]");
  const list = nav && nav.querySelector("#site-nav-list");

  if (!nav || !toggle || !label || !list) {
    return;
  }

  /* Keep in sync with styles.css mobile nav breakpoint. */
  const overlayQuery = window.matchMedia("(max-width: 56rem)");
  let lastFocus = null;

  const getFocusable = () => {
    const nodes = nav.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    return Array.prototype.filter.call(nodes, (el) => {
      if (el.hasAttribute("inert") || el.getAttribute("aria-hidden") === "true") {
        return false;
      }
      if (list.contains(el) && list.hasAttribute("inert")) {
        return false;
      }
      return el.getClientRects().length > 0;
    });
  };

  const setListInert = (inert) => {
    if (inert) {
      list.setAttribute("inert", "");
      list.setAttribute("aria-hidden", "true");
    } else {
      list.removeAttribute("inert");
      list.removeAttribute("aria-hidden");
    }
  };

  const trapFocus = (event) => {
    if (!nav.classList.contains("is-open") || !overlayQuery.matches) {
      return;
    }
    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusable();
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const setOpen = (open) => {
    const wasOpen = nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    label.textContent = open ? "Close" : "Menu";

    /* inert only when the overlay pattern is hiding the list (mobile, closed). */
    setListInert(overlayQuery.matches && !open);

    if (open && overlayQuery.matches && !wasOpen) {
      lastFocus = document.activeElement;
      const focusable = getFocusable();
      const firstInList = focusable.find((el) => list.contains(el));
      (firstInList || toggle).focus();
    } else if (!open && wasOpen && lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
      lastFocus = null;
    }
  };

  const close = () => setOpen(false);

  /** True when following the link leaves this page view (path, external, mailto). */
  const isNavigatingAway = (anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("javascript:")) {
      return false;
    }
    return !href.startsWith("#");
  };

  const syncForViewport = () => {
    if (!overlayQuery.matches) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      label.textContent = "Menu";
      setListInert(false);
      lastFocus = null;
      return;
    }
    setOpen(nav.classList.contains("is-open"));
  };

  nav.classList.add("site-nav--enhanced");
  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      lastFocus = null;
      close();
      toggle.focus();
      return;
    }
    trapFocus(event);
  });

  list.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor || isNavigatingAway(anchor)) {
      return;
    }
    close();
  });

  if (typeof overlayQuery.addEventListener === "function") {
    overlayQuery.addEventListener("change", syncForViewport);
  } else if (typeof overlayQuery.addListener === "function") {
    overlayQuery.addListener(syncForViewport);
  }
})();
