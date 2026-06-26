// Selecciona todos los botones de compartir
const shareButtons = document.querySelectorAll('.icon-button[aria-label="Compartir"]');

shareButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const parent = this.closest(".story-actions");
        const saveButton = parent.querySelector(".save-button");

        const id = saveButton.dataset.id;
        const titulo = saveButton.dataset.titulo;
        const autor = saveButton.dataset.autor;

        const url = `${window.location.origin}/frontend/Pages/lectura.html?historia=${id}`;
        //  "http://localhost:5503/frontend/Pages/lectura.html?historia=42"
        const texto = `📖 ${titulo} por ${autor}\n\nLéelo en Calíope:`;

        if (navigator.share) {
            navigator.share({ title: titulo, text: texto, url })
                .catch(() => {}); // silenciar si el usuario cancela
        } else {
            navigator.clipboard.writeText(url)
                .then(() => alert("🔗 Enlace copiado al portapapeles"))
                .catch(() => alert("No se pudo copiar el enlace"));
        }
    });
});