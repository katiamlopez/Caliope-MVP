document.addEventListener("DOMContentLoaded", () => {
    const readButtons = document.querySelectorAll(".read-button");

    readButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const story = {
                storyId: button.dataset.id,
                title: button.dataset.titulo,
                author: button.dataset.autor,
                cover: button.dataset.portada,
                totalPages: Number(button.dataset.totalPages) || 3,
                currentPage: 1,
                progress: 0,
                status: "reading",
            };

            if (!story.storyId) {
                window.location.href = button.getAttribute("href");
                return;
            }

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
    });
});