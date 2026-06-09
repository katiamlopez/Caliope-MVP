document.addEventListener("DOMContentLoaded", () => {
    const carouselElement = document.querySelector("#readingCarousel");
    const carouselItems = carouselElement.querySelectorAll(".carousel-item");

    const progressBar = document.querySelector("#readingProgressBar");
    const progressText = document.querySelector("#readingProgressText");
    const progressContainer = document.querySelector(".reading-progress");

    const previousButton = document.querySelector("#previousPageButton");
    const nextButton = document.querySelector("#nextPageButton");

    const reviewStars = document.querySelectorAll(".review-star");

    const totalPages = carouselItems.length;

    function getCurrentPageIndex() {
        return Array.from(carouselItems).findIndex((item) =>
            item.classList.contains("active")
        );
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

    //* Interaccion deReseñas
    //* Interacción de reseñas

const reviewText = document.querySelector("#reviewText");
const publishReviewButton = document.querySelector("#publishReviewButton");

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
});

    updateReadingProgress(getCurrentPageIndex());
});