// Escucha cualquier clic en "Leer"
document.addEventListener("click", (event) => {
    const button = event.target.closest(".read-button");
    if (!button) return;
    event.preventDefault();

    // Busco el PDF guardado en sessionStorage
    const storyId = button.dataset.id;
    const pdfs = JSON.parse(sessionStorage.getItem("caliopePdfs") || "{}");

    const story = {
        storyId: storyId,
        title: button.dataset.titulo,
        author: button.dataset.autor,
        cover: button.dataset.portada,
        totalPages: Number(button.dataset.totalPages) || 3,
        currentPage: 1,
        progress: 0,
        status: "reading",
        pdfDataUrl: pdfs[storyId] || "",
    };

    if (!story.storyId) {
        window.location.href = button.getAttribute("href");
        return;
    }

    // Guardo la obra en mi biblioteca
    const library =
        JSON.parse(localStorage.getItem("caliopeLibrary")) || [];

    const existingStory = library.find(
        (item) => item.storyId === story.storyId
    );

    if (!existingStory) {
        library.push(story);
    } else if (existingStory.status !== "completed") {
        existingStory.status = "reading";
    }

    localStorage.setItem("caliopeLibrary", JSON.stringify(library));

    window.location.href = `lectura.html?id=${story.storyId}`;
});
