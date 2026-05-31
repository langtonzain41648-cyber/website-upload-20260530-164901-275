(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));

  if (slides.length > 1) {
    let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (index < 0) {
      index = 0;
    }

    const showSlide = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => showSlide(dotIndex));
    });

    window.setInterval(() => showSlide(index + 1), 5200);
  }

  const searchInput = document.querySelector("[data-search]");
  const filterControls = Array.from(document.querySelectorAll("[data-filter]"));
  const sortControl = document.querySelector("[data-sort]");
  const cards = Array.from(document.querySelectorAll("[data-card]"));
  const grid = cards.length ? cards[0].parentElement : null;

  const normalized = (value) => String(value || "").trim().toLowerCase();

  const applyFilters = () => {
    const query = normalized(searchInput ? searchInput.value : "");
    const activeFilters = filterControls.map((control) => ({
      name: control.getAttribute("data-filter"),
      value: normalized(control.value)
    }));

    cards.forEach((card) => {
      const haystack = normalized([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre
      ].join(" "));
      const textMatch = !query || haystack.includes(query);
      const filterMatch = activeFilters.every((filter) => {
        if (!filter.value || filter.value === "all") {
          return true;
        }
        return normalized(card.dataset[filter.name]).includes(filter.value);
      });
      card.hidden = !(textMatch && filterMatch);
    });
  };

  const applySort = () => {
    if (!sortControl || !grid) {
      return;
    }
    const value = sortControl.value;
    const sorted = [...cards].sort((a, b) => {
      if (value === "score") {
        const scoreA = Number((a.querySelector(".card-meta strong") || {}).textContent?.replace(/[^0-9.]/g, "") || 0);
        const scoreB = Number((b.querySelector(".card-meta strong") || {}).textContent?.replace(/[^0-9.]/g, "") || 0);
        return scoreB - scoreA;
      }
      if (value === "year") {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      }
      return Number(a.dataset.title.length) - Number(b.dataset.title.length);
    });
    sorted.forEach((card) => grid.appendChild(card));
  };

  if (cards.length) {
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    filterControls.forEach((control) => {
      control.addEventListener("change", applyFilters);
    });
    if (sortControl) {
      sortControl.addEventListener("change", () => {
        applySort();
        applyFilters();
      });
    }
  }
})();
