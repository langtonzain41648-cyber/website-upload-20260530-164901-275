
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.js-search'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.js-movie-card'));
  var typeSelect = document.querySelector('.js-type-filter');

  function applyFilters() {
    var query = searchInputs.length ? searchInputs[0].value.trim().toLowerCase() : '';
    var typeValue = typeSelect ? typeSelect.value : '';

    cards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var genre = (card.getAttribute('data-genre') || '').toLowerCase();
      var region = (card.getAttribute('data-region') || '').toLowerCase();
      var year = (card.getAttribute('data-year') || '').toLowerCase();
      var text = title + ' ' + genre + ' ' + region + ' ' + year;
      var matchText = !query || text.indexOf(query) !== -1;
      var matchType = !typeValue || genre.indexOf(typeValue.toLowerCase()) !== -1 || region.indexOf(typeValue.toLowerCase()) !== -1 || year.indexOf(typeValue.toLowerCase()) !== -1;

      card.classList.toggle('hidden-card', !(matchText && matchType));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', applyFilters);
  });

  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilters);
  }

  window.initializeMoviePlayer = function (videoId, coverId, source) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);

    if (!video) {
      return;
    }

    var prepared = false;

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      prepare();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  };
})();
