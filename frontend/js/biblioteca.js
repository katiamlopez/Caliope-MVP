import { getToken } from "./auth.js";

console.log("Token:", getToken());


const savedList = document.getElementById("savedList");
const readingList = document.getElementById("readingList");

function mostrarLeyendo() {
    const library = JSON.parse(localStorage.getItem("caliopeLibrary")) || [];

    const leyendo = library.filter((historia) => historia.status === "reading");

    readingList.innerHTML = "";

    if (leyendo.length === 0) {
        readingList.innerHTML = `
            <p class="empty-library-message">
                Aún no has empezado ninguna lectura.
            </p>
        `;
        return;
    }

    leyendo.forEach((historia) => {
        const currentPage = historia.currentPage || 1;
        const totalPages = historia.totalPages || 3;
        const progress = historia.progress || 0;

        readingList.innerHTML += `
            <article class="reading-card" data-id="${historia.storyId}">
                <div class="reading-story-info">
                    <img
                        src="${historia.cover}"
                        alt="Portada de ${historia.title}"
                        class="library-cover"
                    />

                    <div>
                        <h3>${historia.title}</h3>
                        <p>Por ${historia.author}</p>
                    </div>
                </div>

                <div class="reading-progress">
                    <p>Página ${currentPage} de ${totalPages}</p>

                    <div
                        class="progress library-progress"
                        role="progressbar"
                        aria-label="Progreso de lectura de ${historia.title}"
                        aria-valuenow="${progress}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>

                <a
                    href="lectura.html?id=${historia.storyId}"
                    class="read-button"
                >
                    Continuar
                </a>
            </article>
        `;
    });
}

function mostrarGuardados() {
    const guardados = JSON.parse(localStorage.getItem("guardados")) || [];

    savedList.innerHTML = "";

    if (guardados.length === 0) {
        savedList.innerHTML = "<p>No tienes historias guardadas todavía.</p>";
        return;
    }

    guardados.forEach((historia) => {
        savedList.innerHTML += `
            <article class="saved-card" data-id="${historia.id}">
                <div class="saved-story-info">
                    <img
                        src="${historia.portada}"
                        alt="Portada de ${historia.titulo}"
                        class="library-cover"
                    />

                    <div>
                        <h3>${historia.titulo}</h3>
                        <p>Por ${historia.autor}</p>
                    </div>
                </div>

                <div class="library-buttons">
                    <a
                        href="lectura.html?id=${historia.id}"
                        class="read-button"
                        data-id="${historia.id}"
                        data-titulo="${historia.titulo}"
                        data-autor="${historia.autor}"
                        data-portada="${historia.portada}"
                        data-total-pages="3"
                    >
                        Leer
                    </a>

                    <button
                        type="button"
                        class="delete-button"
                        data-id="${historia.id}">
                        Eliminar
                    </button>
                </div>
            </article>
        `;
    });

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    const deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const id = button.dataset.id;

            let guardados = JSON.parse(localStorage.getItem("guardados")) || [];

            guardados = guardados.filter((historia) => historia.id !== id);

            localStorage.setItem("guardados", JSON.stringify(guardados));

            const card = document.querySelector(`.saved-card[data-id="${id}"]`);

            if (card) {
                card.remove();
            }

            if (guardados.length === 0) {
                savedList.innerHTML = "<p>No tienes historias guardadas todavía.</p>";
            }
        });
    });
}

mostrarLeyendo();
mostrarGuardados();
