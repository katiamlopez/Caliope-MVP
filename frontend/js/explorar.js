function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".explore-search input");
  const cards = document.querySelectorAll(".favorite-story-card");
  const genreButtons = document.querySelectorAll(".genre-tags button");

  let activeGenres = [];

  searchInput.addEventListener("input", filterCards);

  genreButtons.forEach(button => {
    button.addEventListener("click", () => {

      const genre = normalize(button.textContent);

      // 🟡 BOTÓN VER TODAS
      if (genre.includes("ver todas")) {
        activeGenres = [];
        genreButtons.forEach(b => b.classList.remove("active"));
        filterCards();
        return;
      }

      // 🔁 TOGGLE DE GÉNEROS
      if (activeGenres.includes(genre)) {
        activeGenres = activeGenres.filter(g => g !== genre);
        button.classList.remove("active");
      } else {
        activeGenres.push(genre);
        button.classList.add("active");
      }

      filterCards();
    });
  });

  function filterCards() {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {

      const title = card.querySelector(".favorite-story-title")?.textContent.toLowerCase() || "";
      const author = card.querySelector(".story-author")?.textContent.toLowerCase() || "";

      const genres = Array.from(card.querySelectorAll(".story-meta span"))
        .map(span => normalize(span.textContent));

      const text = `${title} ${author} ${genres.join(" ")}`;

      const matchesSearch = text.includes(query);

      // 🎭 MULTI-FILTRO
      const matchesGenre =
        activeGenres.length === 0 ||
        activeGenres.some(g => genres.includes(normalize(g)))

      if (matchesSearch && matchesGenre) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

});
