(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var opened = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-thumb]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle("is-active", thumbIndex === current);
    });
  }

  function playSlides() {
    if (timer) {
      window.clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      showSlide(Number(thumb.getAttribute("data-hero-thumb")) || 0);
      playSlides();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      playSlides();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      playSlides();
    });
  }

  showSlide(0);
  playSlides();

  var searchInput = document.querySelector(".search-input");
  var searchableItems = Array.prototype.slice.call(document.querySelectorAll(".searchable-list [data-search]"));

  if (searchInput && searchableItems.length) {
    searchInput.addEventListener("input", function () {
      var value = searchInput.value.trim().toLowerCase();

      searchableItems.forEach(function (item) {
        var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
        item.classList.toggle("is-filtered-out", value !== "" && text.indexOf(value) === -1);
      });
    });
  }
})();
