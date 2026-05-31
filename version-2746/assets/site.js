(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showHero(dotIndex);
      });
    });

    if (slides.length > 1) {
      showHero(0);
      setInterval(function () {
        showHero(activeIndex + 1);
      }, 5200);
    }

    var pageQuery = new URLSearchParams(window.location.search).get("q") || "";
    var searchInput = document.querySelector("[data-page-search]");
    if (searchInput && pageQuery) {
      searchInput.value = pageQuery;
    }

    var searchItems = Array.prototype.slice.call(document.querySelectorAll("[data-search-item]"));
    var typeFilter = document.querySelector("[data-type-filter]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var emptyState = document.querySelector("[data-empty-state]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function filterItems() {
      if (!searchItems.length) {
        return;
      }
      var query = normalize(searchInput ? searchInput.value : "");
      var typeValue = normalize(typeFilter ? typeFilter.value : "");
      var yearValue = normalize(yearFilter ? yearFilter.value : "");
      var visible = 0;

      searchItems.forEach(function (item) {
        var haystack = normalize(item.getAttribute("data-title") + " " + item.getAttribute("data-region") + " " + item.getAttribute("data-type") + " " + item.getAttribute("data-year") + " " + item.getAttribute("data-tags"));
        var typeOk = !typeValue || normalize(item.getAttribute("data-type")) === typeValue;
        var yearOk = !yearValue || normalize(item.getAttribute("data-year")) === yearValue;
        var queryOk = !query || haystack.indexOf(query) !== -1;
        var shouldShow = typeOk && yearOk && queryOk;
        item.style.display = shouldShow ? "" : "none";
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", filterItems);
    }
    if (typeFilter) {
      typeFilter.addEventListener("change", filterItems);
    }
    if (yearFilter) {
      yearFilter.addEventListener("change", filterItems);
    }
    filterItems();
  });
})();
