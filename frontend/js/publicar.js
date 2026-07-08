import { getToken } from "./auth.js";

console.log("Token:", getToken());

document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("formulario");

  const tituloInput = document.getElementById("titulo");
  const descripcionInput = document.getElementById("descripcion");


  //* Seleccion de Generos

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



  //*Validacion de envio de formularios

  document.addEventListener('DOMContentLoaded', () => {
  cargarGeneros();
});

async function cargarGeneros() {
  const selectElement = document.getElementById('genreSelect');
  
  try {
    // Reemplaza esta URL con la ruta real de tu API o backend
    const respuesta = await fetch('http://localhost:8080/api/genres'); 
    const generos = await respuesta.json();
    console.log(respuesta)

    // Validamos que existan datos
    if (!generos || generos.length === 0) return;

    // Creamos un fragmento para mejorar el rendimiento al insertar nodos
    const fragmento = document.createDocumentFragment();

    generos.forEach(genero => {
      const option = document.createElement('option');
      // Supongamos que tu BD tiene columnas 'id' (o nombre) y 'nombre'
      option.value = genero.id || genero.nombre; 
      option.textContent = genero.nombre;
      fragmento.appendChild(option);
    });

    // Insertamos todas las opciones juntas al select
    selectElement.appendChild(fragmento);

  } catch (error) {
    console.error('Error al cargar los géneros desde la base de datos:', error);
  }
}


////////////////////////////////////////////////








  formulario.addEventListener("submit", async (event) => {
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

    const portada = document.getElementById("portada").files[0];
    const pdf = document.getElementById("documentoHistoria").files[0];
    const story = {
      idUsers: Number(localStorage.getItem("userId")),
      title: titulo,
      description: descripcion,
      picture_front_pages: portada ? portada.name : "",
      file_pdf: pdf ? pdf.name : "",
      status: "PUBLICADA",
      created_date: new Date().toISOString().split("T")[0],
      published_date: new Date().toISOString().split("T")[0]
    };
    console.log("Historia enviada:", story);
    try {

      const response = await fetch("http://localhost:8080/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(story)
      });

      if (!response.ok) {
        throw new Error("Error al publicar");
      }

      const historia = await response.json();

      console.log(historia);

      

      formulario.reset();

    } catch (error) {

      console.error(error);

      alert("No fue posible publicar");

    }

    alert("Formulario enviado correctamente.");

    formulario.reset();           // Limpia el texto del formulario
  });

  renderGenres();

});
