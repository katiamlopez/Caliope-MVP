// ==========================================
// TÉRMINOS Y CONDICIONES - CALÍOPE
// ==========================================

// Modal principal
const modal = document.getElementById("terms-modal");

// Botón para abrir
const openTermsBtn = document.getElementById("open-terms-btn");

// Botón para cerrar
const closeBtn = document.querySelector(".close-btn");

// ==========================================
// ABRIR MODAL
// ==========================================

function openModal() {
  if (modal) {
    modal.style.display = "flex";

    ```
// Evita que la página se desplace detrás del modal
document.body.style.overflow = "hidden";
```;
  }
}

// ==========================================
// CERRAR MODAL
// ==========================================

function closeModal() {
  if (modal) {
    modal.style.display = "none";

    ```
// Restaurar scroll
document.body.style.overflow = "auto";
```;
  }
}

// ==========================================
// EVENTOS
// ==========================================

// Abrir desde botón principal
if (openTermsBtn) {
  openTermsBtn.addEventListener("click", openModal);
}

// Cerrar con la X
if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

// Cerrar al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Cerrar con la tecla ESC
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && modal.style.display === "flex") {
    closeModal();
  }
});

// ==========================================
// ACCESIBILIDAD
// ==========================================

// Permite enfocar el botón al cargar
window.addEventListener("load", () => {
  if (openTermsBtn) {
    openTermsBtn.setAttribute("aria-haspopup", "dialog");
    openTermsBtn.setAttribute("aria-expanded", "false");
  }
});

// Actualiza atributos de accesibilidad
function updateAccessibility(isOpen) {
  if (!openTermsBtn) return;

  openTermsBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

// Sobrescribimos funciones para incluir accesibilidad
function openModal() {
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    updateAccessibility(true);
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    updateAccessibility(false);
  }
}
