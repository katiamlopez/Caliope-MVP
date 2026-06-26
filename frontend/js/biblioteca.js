const savedList = document.getElementById("savedList");

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
                    <a href="lectura.html" class="read-button">Leer</a>

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

mostrarGuardados();