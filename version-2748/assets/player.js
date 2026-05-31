function initMoviePlayer(source) {
    var video = document.querySelector("[data-player-video]");
    var cover = document.querySelector("[data-player-cover]");
    var starters = Array.prototype.slice.call(document.querySelectorAll("[data-player-start]"));
    var hlsInstance = null;
    var loaded = false;

    if (!video || !source) {
        return;
    }

    function begin() {
        if (cover) {
            cover.style.display = "none";
        }

        if (!loaded) {
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls();
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        var promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function () {});
        }
    }

    starters.forEach(function (starter) {
        starter.addEventListener("click", begin);
    });

    video.addEventListener("click", function () {
        if (video.paused) {
            begin();
        } else {
            video.pause();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
