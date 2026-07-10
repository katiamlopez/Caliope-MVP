// Actualizar avatar en la barra superior
async function updateTopbarAvatar() {
    const avatarImg = document.getElementById("topbarAvatar");
    if (!avatarImg) return;
    
    try {
        // 1. Intentar desde localStorage (rápido)
        const profile = JSON.parse(localStorage.getItem("caliopeUserProfile"));
        if (profile?.picture_avatar) {
            avatarImg.src = profile.picture_avatar.startsWith('http') 
                ? profile.picture_avatar 
                : `http://localhost:8080/api/files/${profile.picture_avatar}`;
            return;
        }
        
        // 2. Si no está en localStorage, consultar al backend
        const res = await api("/api/users/me");
        if (!res.ok) throw new Error("Error al cargar perfil");
        const data = await res.json();
        
        if (data.picture_avatar) {
            avatarImg.src = data.picture_avatar.startsWith('http')
                ? data.picture_avatar
                : `http://localhost:8080/api/files/${data.picture_avatar}`;
        }
        
        // 3. Manejar error de carga de imagen
        avatarImg.onerror = () => {
            avatarImg.src = "../assets/users-photos/foto-perfil-usuario.png";
        };
        
    } catch (e) {
        console.warn("No se pudo cargar el avatar");
        avatarImg.src = "../assets/users-photos/foto-perfil-usuario.png";
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateTopbarAvatar();
});