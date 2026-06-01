fetch("menu.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("menu-container").innerHTML = data;

        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggle-btn");
        const contenido = document.querySelector(".contenido");

        toggleBtn.addEventListener("click", () => {

            sidebar.classList.toggle("closed");

            if(contenido){
                contenido.classList.toggle("expand");
            }

        });

    });