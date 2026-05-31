(function () {
  window.initPlayer = function (streamUrl, rootId) {
    var root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var overlay = root.querySelector(".player-overlay");
    var playButton = root.querySelector(".play-button");
    var started = false;
    var hls = null;

    if (!video) {
      return;
    }

    function loadStream() {
      if (started) {
        return;
      }

      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function startVideo() {
      loadStream();
      video.controls = true;

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }

    if (playButton) {
      playButton.addEventListener("click", startVideo);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startVideo();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };
})();
