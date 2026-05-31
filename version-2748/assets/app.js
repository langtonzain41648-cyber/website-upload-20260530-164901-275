document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-nav]");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function showSlide(next) {
        if (!slides.length) {
            return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === index);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(index + 1);
        }, 5200);
    }
});
