const savedList = document.getElementById("savedList");

const guardados = JSON.parse(localStorage.getItem("guardados")) || [];

savedList.innerHTML = "";

if (guardados.length === 0) {
    savedList.innerHTML = "<p>No tienes historias guardadas todavía.</p>";
} else {
    guardados.forEach((historia) => {
        savedList.innerHTML += `
            <article class="saved-card">
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

                <a href="lectura.html" class="read-button">Leer</a>
            </article>
        `;
    });
}