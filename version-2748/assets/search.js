document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-search-root]");
    if (!root) {
        return;
    }

    var input = root.querySelector("[data-search-input]");
    var type = root.querySelector("[data-type-filter]");
    var year = root.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");

    function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var t = type ? type.value : "";
        var y = year ? year.value : "";
        var shown = 0;

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-genre") || "",
                card.getAttribute("data-tags") || ""
            ].join(" ").toLowerCase();
            var passQuery = !q || haystack.indexOf(q) !== -1;
            var passType = !t || (card.getAttribute("data-type") || "") === t;
            var passYear = !y || (card.getAttribute("data-year-range") || "") === y;
            var visible = passQuery && passType && passYear;
            card.style.display = visible ? "" : "none";
            if (visible) {
                shown += 1;
            }
        });

        if (empty) {
            empty.style.display = shown ? "none" : "block";
        }
    }

    [input, type, year].forEach(function (control) {
        if (control) {
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        }
    });
});
