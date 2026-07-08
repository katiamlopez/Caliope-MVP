
import { getToken } from "./auth.js";

console.log("Token:", getToken());

// 1. Cargar géneros desde el backend
async function cargarGeneros() {
  const selectElement = document.getElementById('genreSelect');
  if (!selectElement) return;
  
  try {
    const respuesta = await fetch('http://localhost:8080/api/genres', {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    }); 
    
    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: ${respuesta.status}`);
    }

    const genres = await respuesta.json();
    console.log("Genres received from backend:", genres);

    if (!genres || genres.length === 0) return;

    const fragmento = document.createDocumentFragment();

    genres.forEach(genre => {
      const option = document.createElement('option');
      
      // El backend usa .id y .genre
      option.value = genre.id;   
      option.textContent = genre.genre; 
      
      fragmento.appendChild(option);
    });

    selectElement.appendChild(fragmento);

  } catch (error) {
    console.error('Error loading genres from database:', error);
  }
}

// 2. Lógica del Formulario y las etiquetas
document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("formulario");
  const tituloInput = document.getElementById("titulo");
  const descripcionInput = document.getElementById("descripcion");

  //* Selección de Géneros (Tags)
  const genreSelect = document.getElementById("genreSelect");
  const selectedGenresContainer = document.getElementById("selectedGenres");
  const genreInputsContainer = document.getElementById("genreInputs");

  const selectedGenres = []; 
  const maximumGenres = 4;

  // Ejecutamos la carga dinámica inmediatamente
  cargarGeneros();

  function renderGenres() {
    selectedGenresContainer.innerHTML = "";
    genreInputsContainer.innerHTML = "";

    selectedGenres.forEach((genre) => {
      const genreTag = document.createElement("span");
      genreTag.className = "genre-tag";

      const genreText = document.createElement("span");
      // Usa los generos guardaos en la base de datos
      genreText.textContent = genre.genre || genre;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "genre-tag-remove";
      removeButton.setAttribute("aria-label", `Eliminar género`);
      removeButton.innerHTML = '<i class="bi bi-x-lg"></i>';

      removeButton.addEventListener("click", () => {
        removeGenre(genre);
      });

      genreTag.append(genreText, removeButton);
      selectedGenresContainer.appendChild(genreTag);

      // Enviamos el ID al input oculto
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "genres[]"; 
      hiddenInput.value = genre.id || genre;

      genreInputsContainer.appendChild(hiddenInput);
    });

    genreSelect.disabled = selectedGenres.length >= maximumGenres;
  }

  function addGenre() {
    const selectedOption = genreSelect.options[genreSelect.selectedIndex];
    if (!genreSelect.value) return;

    // Guardamos el objeto respetando la estructura de tu BD
    const genreObject = {
      id: Number(genreSelect.value) || genreSelect.value,
      genre: selectedOption.text
    };

    // Validar si ya fue agregado comparando los IDs
    const yaExiste = selectedGenres.some(g => g.id === genreObject.id);
    if (yaExiste) {
      alert("Ese género ya fue agregado.");
      genreSelect.value = "";
      return;
    }

    if (selectedGenres.length >= maximumGenres) {
      alert(`Solo puedes agregar hasta ${maximumGenres} géneros.`);
      genreSelect.value = "";
      return;
    }

    selectedGenres.push(genreObject);
    genreSelect.value = "";

    renderGenres();
  }

  function removeGenre(genre) {
    const index = selectedGenres.findIndex(g => g.id === genre.id);
    if (index !== -1) {
      selectedGenres.splice(index, 1);
    }
    renderGenres();
  }

  genreSelect.addEventListener("change", addGenre);

  async function enviarHistoria(status) {
    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!titulo || !descripcion) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    if (selectedGenres.length === 0) {
      alert("Selecciona al menos un género.");
      genreSelect.focus();
      return;
    }

    const portada = document.getElementById("portada").files[0];
    const pdf = document.getElementById("documentoHistoria").files[0];

    const story = {
      title: titulo,
      description: descripcion,
      picture_front_pages: portada ? portada.name : "",
      file_pdf: pdf ? pdf.name : "",
      status: status,
      genres: selectedGenres.map(g => g.id)
    };

    try {
      const response = await fetch("http://localhost:8080/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(story)
      });

      if (!response.ok) throw new Error("Error al guardar");

      const created = await response.json();
      const storyId = created.id || created.title || titulo;

      if (pdf) {
        const pdfDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(pdf);
        });
        const pdfs = JSON.parse(sessionStorage.getItem("caliopePdfs") || "{}");
        pdfs[storyId] = pdfDataUrl;
        sessionStorage.setItem("caliopePdfs", JSON.stringify(pdfs));
      }

      formulario.reset();
      selectedGenres.length = 0;
      renderGenres();
      window.location.href = "principal.html";
    } catch (error) {
      console.error(error);
      alert("No fue posible guardar la obra.");
    }
  }

  document.querySelector(".draft-button").addEventListener("click", () => {
    enviarHistoria("BORRADOR");
  });

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    enviarHistoria("PUBLICADO");
  });

  renderGenres();
});
