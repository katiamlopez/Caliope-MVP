const formulario = document.querySelector("#registroForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos =
        Object.fromEntries(
            new FormData(formulario)
        );

    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/registro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(datos)
                }
            );

        const mensaje =
            await respuesta.text();

        alert(mensaje);

    } catch(error){

        console.error(error);

    }

});