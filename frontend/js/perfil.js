import { getToken } from "./auth.js";
import { api } from "./api.js";

console.log("Token:", getToken());

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await api("/api/users/me");

        if (!response.ok) {
            throw new Error("No se pudo obtener el perfil");
        }

        const user = await response.json();

        console.log(user);

        mostrarPerfil(user);

    } catch (error) {

        console.error("Error:", error);

    }

});

function mostrarPerfil(user) {

    document.getElementById("profileDisplayName").textContent =
        `${user.firstName} ${user.lastName}`;

    document.getElementById("profileUsername").textContent =
        `@${user.user_name}`;

    document.getElementById("profileBio").textContent =
        user.bio || "Este usuario aún no tiene biografía.";

    // Si no manejas pronombres por ahora
    document.getElementById("profilePronouns").style.display = "none";

    // Roles (si aún no existen en tu BD)
    const roles = document.getElementById("profileRoles");
    roles.innerHTML = "<span>Escritor</span>";

    // Avatar
    const avatar = document.querySelector(".profile-avatar");

    if (user.picture_avatar) {
        avatar.src = user.picture_avatar;
    } else {
        avatar.src = "../assets/users-photos/foto-perfil-usuario.png";
    }

}