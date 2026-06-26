const saveButtons = document.querySelectorAll(".save-button");

let guardados = JSON.parse(localStorage.getItem("guardados")) || [];

// Marcar como guardados los libros que ya existen en localStorage
saveButtons.forEach((button) => {
    const existe = guardados.find(item => item.id === button.dataset.id);
    const icon = button.querySelector("i");

    if (existe) {
        icon.classList.remove("bi-bookmark");
        icon.classList.add("bi-bookmark-fill");
        button.classList.add("saved");
    }
});

saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const historia = {
            id: button.dataset.id,
            titulo: button.dataset.titulo,
            autor: button.dataset.autor,
            portada: button.dataset.portada
        };

        guardados = JSON.parse(localStorage.getItem("guardados")) || [];

        const existe = guardados.find(item => item.id === historia.id);
        const icon = button.querySelector("i");

        if (existe) {
            guardados = guardados.filter(item => item.id !== historia.id);

            icon.classList.remove("bi-bookmark-fill");
            icon.classList.add("bi-bookmark");
            button.classList.remove("saved");

            console.log("Libro eliminado de guardados");
        } else {
            guardados.push(historia);

            icon.classList.remove("bi-bookmark");
            icon.classList.add("bi-bookmark-fill");
            button.classList.add("saved");

            console.log("Libro guardado");
        }

        localStorage.setItem("guardados", JSON.stringify(guardados));
    });
});