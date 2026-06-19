fetch("menu.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("menu-container").innerHTML = data;

        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggle-btn");
        const contenido = document.querySelector(".contenido");

        const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();

        localStorage.removeItem("sesionActiva");

        window.location.href = "inicio_sesion.html";
    });
}

        toggleBtn.addEventListener("click", () => {

            sidebar.classList.toggle("closed");

            if(contenido){
                contenido.classList.toggle("expand");
            }

        });

    });