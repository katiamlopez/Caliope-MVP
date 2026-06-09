document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  const tituloInput = document.getElementById("titulo");
  const descripcionInput = document.getElementById("descripcion");

  const genreSelect = document.getElementById("genreSelect");
  const selectedGenresContainer =
    document.getElementById("selectedGenres");
  const genreInputsContainer =
    document.getElementById("genreInputs");

  const selectedGenres = [];
  const maximumGenres = 4;

  function renderGenres() {
    selectedGenresContainer.innerHTML = "";
    genreInputsContainer.innerHTML = "";

    selectedGenres.forEach((genre) => {
      const genreTag = document.createElement("span");
      genreTag.className = "genre-tag";

      const genreText = document.createElement("span");
      genreText.textContent = genre;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "genre-tag-remove";
      removeButton.setAttribute(
        "aria-label",
        `Eliminar género ${genre}`
      );

      removeButton.innerHTML = '<i class="bi bi-x-lg"></i>';

      removeButton.addEventListener("click", () => {
        removeGenre(genre);
      });

      genreTag.append(genreText, removeButton);
      selectedGenresContainer.appendChild(genreTag);

      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "generos[]";
      hiddenInput.value = genre;

      genreInputsContainer.appendChild(hiddenInput);
    });

    genreSelect.disabled =
      selectedGenres.length >= maximumGenres;
  }

  function addGenre() {
    const selectedGenre = genreSelect.value;

    if (!selectedGenre) {
      return;
    }

    if (selectedGenres.includes(selectedGenre)) {
      alert("Ese género ya fue agregado.");
      genreSelect.value = "";
      return;
    }

    if (selectedGenres.length >= maximumGenres) {
      alert(`Solo puedes agregar hasta ${maximumGenres} géneros.`);
      genreSelect.value = "";
      return;
    }

    selectedGenres.push(selectedGenre);
    genreSelect.value = "";

    renderGenres();
  }

  function removeGenre(genre) {
    const genreIndex = selectedGenres.indexOf(genre);

    if (genreIndex !== -1) {
      selectedGenres.splice(genreIndex, 1);
    }

    renderGenres();
  }

  genreSelect.addEventListener("change", addGenre);

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (titulo === "") {
      alert("El título no puede estar vacío.");
      tituloInput.focus();
      return;
    }

    if (descripcion === "") {
      alert("La descripción no puede estar vacía.");
      descripcionInput.focus();
      return;
    }

    if (descripcion.length < 10) {
      alert("La descripción debe tener al menos 10 caracteres.");
      descripcionInput.focus();
      return;
    }

    if (selectedGenres.length === 0) {
      alert("Selecciona al menos un género para la obra.");
      genreSelect.focus();
      return;
    }

    alert("Formulario enviado correctamente.");
  });

  renderGenres();
});
