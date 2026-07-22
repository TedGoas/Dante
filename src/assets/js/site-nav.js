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

  const setListInert = (inert) => {
    if (inert) {
      list.setAttribute("inert", "");
      list.setAttribute("aria-hidden", "true");
    } else {
      list.removeAttribute("inert");
      list.removeAttribute("aria-hidden");
    }
  };

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    label.textContent = open ? "Close" : "Menu";

    /* inert only when the overlay pattern is hiding the list (mobile, closed). */
    setListInert(overlayQuery.matches && !open);
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
      close();
      toggle.focus();
    }
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
