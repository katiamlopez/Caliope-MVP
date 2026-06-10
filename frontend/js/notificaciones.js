document.addEventListener("DOMContentLoaded", () => {
  const notificationButton =
    document.getElementById("notificationButton");
  const notificationPanel =
    document.getElementById("notificationPanel");
  const notificationClose =
    document.getElementById("notificationClose");

  if (!notificationButton || !notificationPanel) {
    return;
  }

  function openNotifications() {
    notificationPanel.classList.add("is-open");
    notificationButton.setAttribute("aria-expanded", "true");
  }

  function closeNotifications() {
    notificationPanel.classList.remove("is-open");
    notificationButton.setAttribute("aria-expanded", "false");
  }

  function toggleNotifications() {
    const isOpen = notificationPanel.classList.contains("is-open");

    if (isOpen) {
      closeNotifications();
    } else {
      openNotifications();
    }
  }

  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleNotifications();
  });

  if (notificationClose) {
    notificationClose.addEventListener("click", closeNotifications);
  }

  notificationPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", closeNotifications);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNotifications();
    }
  });
});