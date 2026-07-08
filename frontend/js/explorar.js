import { getToken } from "./auth.js";

console.log("Token:", getToken());

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".explore-search");
  const searchInput = document.querySelector(".explore-search input");

  const storyCards = document.querySelectorAll(".favorite-story-card");

  const genreContainer = document.querySelector(".genre-tags");
  const genreToggleButton = document.querySelector(".genre-toggle-button");

  const genreButtons = Array.from(
    genreContainer.querySelectorAll("button:not(.genre-toggle-button)")
  );

  let activeGenres = [];
  let expandedGenres = false;
  const visibleLimit = 5;

  function updateGenreVisibility() {
    genreButtons.forEach((button, index) => {
      button.style.display =
        index < visibleLimit || expandedGenres ? "" : "none";
    });

    genreToggleButton.textContent = expandedGenres ? "Ver menos" : "Ver todas";
  }

  function filterCards() {
    const query = normalize(searchInput.value);

    storyCards.forEach((card) => {
      const title = normalize(
        card.querySelector(".favorite-story-title")?.textContent || ""
      );

      const author = normalize(
        card.querySelector(".story-author")?.textContent || ""
      );

      const genres = Array.from(card.querySelectorAll(".story-meta span"))
        .map((span) => normalize(span.textContent));

      const matchesSearch =
        title.includes(query) || author.includes(query);

      const matchesGenre =
        activeGenres.length === 0 ||
        activeGenres.some((genre) => genres.includes(genre));

      card.style.display = matchesSearch && matchesGenre ? "flex" : "none";
    });
  }

  searchInput?.addEventListener("input", filterCards);

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCards();
  });

  genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const genre = normalize(button.textContent);

      if (activeGenres.includes(genre)) {
        activeGenres = activeGenres.filter((item) => item !== genre);
        button.classList.remove("active");
      } else {
        activeGenres.push(genre);
        button.classList.add("active");
      }

      filterCards();
    });
  });

  genreToggleButton?.addEventListener("click", () => {
    expandedGenres = !expandedGenres;
    updateGenreVisibility();
  });

  updateGenreVisibility();
  filterCards();
});