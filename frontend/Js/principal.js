fetch("menu.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("menu-container").innerHTML = data;

        const toggleBtn = document.getElementById("toggle-btn");
        const sidebar = document.querySelector(".sidebar");
        const contenido = document.querySelector(".contenido");

        toggleBtn.addEventListener("click", () => {

            sidebar.classList.toggle("closed");

            contenido.classList.toggle("expand");

            // Cambiar icono
            if(sidebar.classList.contains("closed")){
                toggleBtn.innerHTML = "☰";
            }else{
                toggleBtn.innerHTML = "✖";
            }

        });

    });