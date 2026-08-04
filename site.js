(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector("[data-header]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    if (header) header.classList.toggle("menu-active", open);
    body.classList.toggle("menu-open", open);
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach(function (element) {
      element.classList.add("in");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (element) {
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.92) {
        element.classList.add("in");
      } else {
        observer.observe(element);
      }
    });
  }
  root.classList.add("js-ready");

  var portrait = document.querySelector("[data-parallax]");
  var finePointer = window.matchMedia("(pointer: fine)");
  if (portrait && finePointer.matches && !reduceMotion.matches) {
    window.addEventListener(
      "pointermove",
      function (event) {
        var x = ((event.clientX / window.innerWidth) * 2 - 1) * 12;
        var y = ((event.clientY / window.innerHeight) * 2 - 1) * 8;
        portrait.style.setProperty("--portrait-x", x.toFixed(1) + "px");
        portrait.style.setProperty("--portrait-y", y.toFixed(1) + "px");
      },
      { passive: true }
    );
  }

})();
