document.addEventListener("DOMContentLoaded", () => {
    const carouselElement = document.querySelector("#readingCarousel");
    const carouselItems = carouselElement.querySelectorAll(".carousel-item");

    const progressBar = document.querySelector("#readingProgressBar");
    const progressText = document.querySelector("#readingProgressText");
    const progressContainer = document.querySelector(".reading-progress");

    const previousButton = document.querySelector("#previousPageButton");
    const nextButton = document.querySelector("#nextPageButton");

    const reviewStars = document.querySelectorAll(".review-star");
    const reviewText = document.querySelector("#reviewText");
    const publishReviewButton = document.querySelector("#publishReviewButton");

    const totalPages = carouselItems.length;

    const params = new URLSearchParams(window.location.search);
    const storyId = params.get("id");

    function getStoryFromLibrary() {
        if (!storyId) return null;

        const library =
            JSON.parse(localStorage.getItem("caliopeLibrary")) || [];

        return library.find((item) => item.storyId === storyId);
    }

    function updateReadingHeader() {
        const story = getStoryFromLibrary();

        if (!story) return;

        const workTitle = document.querySelector(".reading-work-title");
        const chapterTitle = document.querySelector(".chapter-title");
        const reviewTitle = document.querySelector("#reviewModalTitle");

        if (workTitle) {
            workTitle.textContent = story.title;
        }

        if (chapterTitle) {
            chapterTitle.textContent = `Capítulo 1: ${story.title}`;
        }

        if (reviewTitle) {
            reviewTitle.textContent = `Reseñar ${story.title}`;
        }

        document.title = `Lectura | ${story.title}`;
    }

    function getCurrentPageIndex() {
        return Array.from(carouselItems).findIndex((item) =>
            item.classList.contains("active")
        );
    }

    function saveReadingProgress(currentPage, percentage) {
        if (!storyId) return;

        const library =
            JSON.parse(localStorage.getItem("caliopeLibrary")) || [];

        const story = library.find((item) => item.storyId === storyId);

        if (!story) return;

        story.currentPage = currentPage;
        story.progress = percentage;
        story.status = percentage >= 100 ? "completed" : "reading";

        localStorage.setItem("caliopeLibrary", JSON.stringify(library));
    }

    function updateReadingProgress(pageIndex) {
        const currentPage = pageIndex + 1;
        const percentage = Math.round((currentPage / totalPages) * 100);

        progressBar.style.width = `${percentage}%`;

        progressText.textContent =
            `Página ${currentPage} de ${totalPages} · ${percentage}%`;

        progressContainer.setAttribute("aria-valuenow", percentage);

        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        saveReadingProgress(currentPage, percentage);
    }

    updateReadingHeader();

    const story = getStoryFromLibrary();
    let pdfDataUrl = story?.pdfDataUrl || "";
    if (!pdfDataUrl && storyId) {
        const pdfs = JSON.parse(sessionStorage.getItem("caliopePdfs") || "{}");
        pdfDataUrl = pdfs[storyId] || "";
    }

    // Si la obra tiene PDF, lo muestro y oculto el carrusel
    if (pdfDataUrl) {
        const carouselSection = document.querySelector("#readingCarousel");
        const navSection = document.querySelector(".reading-navigation");
        if (carouselSection) carouselSection.style.display = "none";
        if (navSection) navSection.style.display = "none";

        const mainContent = document.querySelector(".reading-page");
        if (mainContent) {
            const viewer = document.createElement("div");
            viewer.className = "pdf-viewer-wrapper";
            viewer.innerHTML = `<embed src="${pdfDataUrl}" type="application/pdf" class="pdf-embed" />`;
            mainContent.appendChild(viewer);
        }
        return;
    }

    carouselElement.addEventListener("slid.bs.carousel", (event) => {
        updateReadingProgress(event.to);
    });

    document.addEventListener("keydown", (event) => {
        const carousel =
            bootstrap.Carousel.getOrCreateInstance(carouselElement);

        if (event.key === "ArrowLeft" && !previousButton.disabled) {
            carousel.prev();
        }

        if (event.key === "ArrowRight" && !nextButton.disabled) {
            carousel.next();
        }
    });

    let selectedStars = 0;

    reviewStars.forEach((star, index) => {
        star.addEventListener("click", () => {
            selectedStars = index + 1;

            reviewStars.forEach((currentStar, currentIndex) => {
                const icon = currentStar.querySelector("i");

                icon.className =
                    currentIndex < selectedStars
                        ? "bi bi-star-fill"
                        : "bi bi-star";
            });
        });
    });

    publishReviewButton.addEventListener("click", () => {
        const reviewContent = reviewText.value.trim();

        if (selectedStars === 0) {
            alert("Debes seleccionar una calificación.");
            return;
        }

        if (reviewContent === "") {
            alert("Debes escribir una reseña.");
            return;
        }

        alert("Reseña publicada correctamente.");

        console.log("Estrellas:", selectedStars);
        console.log("Reseña:", reviewContent);
        reviewText.value = "";
        
    });

    if (story && story.currentPage > 1 && story.status === "reading") {
        const savedPageIndex = story.currentPage - 1;
        const carousel =
            bootstrap.Carousel.getOrCreateInstance(carouselElement);

        carousel.to(savedPageIndex);
        updateReadingProgress(savedPageIndex);
    } else {
        updateReadingProgress(getCurrentPageIndex());
    }
});
