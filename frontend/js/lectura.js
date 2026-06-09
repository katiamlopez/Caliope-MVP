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

    reviewStars.forEach((star, index) => {
        star.addEventListener("click", () => {
            reviewStars.forEach((currentStar, currentIndex) => {
                const icon = currentStar.querySelector("i");

                icon.className =
                    currentIndex <= index
                        ? "bi bi-star-fill"
                        : "bi bi-star";
            });
        });
    });

    updateReadingProgress(getCurrentPageIndex());
});