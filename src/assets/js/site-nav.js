(() => {
  const nav = document.querySelector(".site-nav");
  const toggle = nav && nav.querySelector(".site-nav__toggle");
  const label = toggle && toggle.querySelector("[data-site-nav-label]");
  const list = nav && nav.querySelector("#site-nav-list");

  if (!nav || !toggle || !label || !list) {
    return;
  }

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    label.textContent = open ? "Close" : "Menu";

    if (open) {
      list.removeAttribute("inert");
      list.removeAttribute("aria-hidden");
    } else {
      list.setAttribute("inert", "");
      list.setAttribute("aria-hidden", "true");
    }
  };

  const close = () => setOpen(false);

  const isPageNavigation = (anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#" || href.startsWith("#") || href.startsWith("javascript:")) {
      return false;
    }
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
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
    if (!anchor || isPageNavigation(anchor)) {
      return;
    }
    close();
  });
})();
