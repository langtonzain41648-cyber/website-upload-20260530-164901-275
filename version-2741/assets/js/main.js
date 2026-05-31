import { H as Hls } from "./hls-vendor-dru42stk.js";

const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
}

const hero = document.querySelector("[data-hero]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  let current = 0;

  const showSlide = (index) => {
    current = index;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 5200);
  }
}

const filterPanels = Array.from(document.querySelectorAll("[data-filter-panel]"));

filterPanels.forEach((panel) => {
  const scope = panel.parentElement;
  const list = scope ? scope.querySelector("[data-filter-list]") : null;
  const search = panel.querySelector("[data-filter-search]");
  const year = panel.querySelector("[data-filter-year]");
  const type = panel.querySelector("[data-filter-type]");

  if (!list) {
    return;
  }

  const cards = Array.from(list.children);

  const runFilter = () => {
    const query = search ? search.value.trim().toLowerCase() : "";
    const yearValue = year ? year.value : "";
    const typeValue = type ? type.value : "";

    cards.forEach((card) => {
      const text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.textContent
      ].join(" ").toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesYear = !yearValue || card.dataset.year === yearValue;
      const matchesType = !typeValue || (card.dataset.type || "").includes(typeValue);
      card.classList.toggle("is-filter-hidden", !(matchesQuery && matchesYear && matchesType));
    });
  };

  [search, year, type].forEach((control) => {
    if (control) {
      control.addEventListener("input", runFilter);
      control.addEventListener("change", runFilter);
    }
  });
});

const players = Array.from(document.querySelectorAll("[data-player]"));

players.forEach((player) => {
  const video = player.querySelector("video");
  const button = player.querySelector("[data-play-button]");
  const stream = player.dataset.stream;
  let attached = false;

  const attachStream = () => {
    if (!video || !stream || attached) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    attached = true;
  };

  const playVideo = async () => {
    attachStream();
    if (button) {
      button.classList.add("is-hidden");
    }
    try {
      await video.play();
    } catch (error) {
      if (button) {
        button.classList.remove("is-hidden");
      }
    }
  };

  if (button) {
    button.addEventListener("click", playVideo);
  }

  if (video) {
    video.addEventListener("play", () => {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  }
});
