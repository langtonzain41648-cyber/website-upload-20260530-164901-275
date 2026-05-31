(function () {
  function startPlayer(src) {
    var video = document.getElementById("movie-player");
    var button = document.getElementById("play-button");
    var initialized = false;
    var hlsObject = null;

    if (!video || !src) {
      return;
    }

    function setup() {
      if (initialized) {
        return;
      }
      initialized = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsObject = new window.Hls();
        hlsObject.loadSource(src);
        hlsObject.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function play() {
      setup();
      if (button) {
        button.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsObject && hlsObject.destroy) {
        hlsObject.destroy();
      }
    });
  }

  window.initPlayer = startPlayer;
})();
