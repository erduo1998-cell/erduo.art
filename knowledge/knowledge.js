(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");
  var filter = document.querySelector("[data-knowledge-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-knowledge-card]"));
  var count = document.querySelector("[data-result-count]");
  var noResults = document.querySelector("[data-no-results]");

  function normalize(value) {
    return String(value || "").trim().toLocaleLowerCase("zh-CN");
  }

  function updateFilters() {
    if (!filter) return;
    var query = normalize(filter.querySelector("[data-query]").value);
    var category = filter.querySelector("[data-category]").value;
    var evidence = filter.querySelector("[data-evidence]").value;
    var visible = 0;
    cards.forEach(function (card) {
      var matches = (!query || card.dataset.search.indexOf(query) !== -1) &&
        (!category || card.dataset.category === category) &&
        (!evidence || card.dataset.evidence === evidence);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (count) count.textContent = "显示 " + visible + " 条";
    if (noResults) noResults.hidden = visible !== 0;
  }

  if (filter) {
    filter.addEventListener("input", updateFilters);
    filter.addEventListener("change", updateFilters);
    filter.addEventListener("reset", function () {
      window.setTimeout(updateFilters, 0);
    });
  }

  function openHashTarget() {
    if (!window.location.hash) return;
    var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target || !target.matches("[data-knowledge-card]")) return;
    target.hidden = false;
    var detail = target.querySelector("[data-knowledge-detail]");
    if (detail) detail.open = true;
  }

  openHashTarget();
  window.addEventListener("hashchange", openHashTarget);

  if (!reduceMotion.matches) {
    var lightfields = Array.prototype.slice.call(document.querySelectorAll("[data-lightfield]"));
    lightfields.forEach(function (element) {
      var frame = 0;
      var timer = 0;
      function update(event) {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(function () {
          var rect = element.getBoundingClientRect();
          var x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
          var y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
          element.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
          element.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
          if (!coarsePointer.matches && event.pointerType === "mouse") {
            element.style.setProperty("--tilt-x", ((0.5 - y) * 4).toFixed(2) + "deg");
            element.style.setProperty("--tilt-y", ((x - 0.5) * 5).toFixed(2) + "deg");
          }
        });
      }
      element.addEventListener("pointermove", function (event) {
        element.dataset.pointerActive = "true";
        update(event);
      }, { passive: true });
      element.addEventListener("pointerleave", function () {
        window.cancelAnimationFrame(frame);
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
        element.removeAttribute("data-pointer-active");
      });
      element.addEventListener("pointerdown", function (event) {
        update(event);
        window.clearTimeout(timer);
        element.dataset.touchActive = "true";
        timer = window.setTimeout(function () {
          element.removeAttribute("data-touch-active");
        }, 420);
      }, { passive: true });
    });
  }
})();
