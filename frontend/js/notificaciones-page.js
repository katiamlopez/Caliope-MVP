document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".notification-filter");
  const notificationCards = document.querySelectorAll(".notification-card");
  const markReadButton = document.querySelector(".mark-read-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((currentButton) => {
        currentButton.classList.remove("active");
      });

      button.classList.add("active");

      notificationCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        if (selectedFilter === "all" || selectedFilter === cardCategory) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  markReadButton.addEventListener("click", () => {
    notificationCards.forEach((card) => {
      card.classList.remove("unread");
    });
  });
});