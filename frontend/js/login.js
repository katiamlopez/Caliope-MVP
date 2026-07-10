import { saveToken } from "./auth.js";

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    try {

        const respuesta = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!respuesta.ok) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        const datos = await respuesta.json();
        
        console.log("Respuesta completa del login:", datos);

        saveToken(datos.token);
        localStorage.setItem("userId", datos.id);
        

        window.location.href = "principal.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
});