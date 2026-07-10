import { api } from "./api.js";
import { getToken } from "./auth.js";

// Cuando la pagina carga, traigo las obras y los botones
document.addEventListener("DOMContentLoaded", async () => {
    await loadStories();
    const { LikeManager } = await import("./likeManager.js");
    LikeManager.init(".like-button");
    setupSaveButtons();
});

// Trae las obras desde el backend
async function loadStories() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    try {
        const res = await api("/api/stories");
        if (!res.ok) throw new Error("Error al cargar obras");
        const stories = await res.json();
        console.log("Datos de las historias:", stories); 
        renderStories(stories, container);
    } catch (e) {
        console.error("Error cargado obras:", e);
        container.innerHTML = '<p class="text-muted">No se pudieron cargar las obras.</p>';
    }
}

// Crea una tarjeta por cada obra, ordenadas de la mas nueva a la mas vieja
function renderStories(stories, container) {
    if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay obras publicadas aún.</p>';
        return;
    }

    container.innerHTML = "";
    stories
        .slice()
        .sort((a, b) => new Date(b.published_date || b.created_date) - new Date(a.published_date || a.created_date))
        .forEach(story => {
       const authorName = story.user 
            ? `${story.user.firstName || ""} ${story.user.lastName || ""}`.trim() || story.user.username || story.user.user_name || "Usuario"
            : "Usuario";

        let authorAvatar = "../assets/users-photos/foto-perfil-usuario.png";
if (story.user?.picture_avatar) {
    if (story.user.picture_avatar.startsWith('http')) {
        authorAvatar = story.user.picture_avatar;
    } else {
        authorAvatar = `/api/files/${story.user.picture_avatar}`;
    }
}
        const coverSrc = story.picture_front_pages 
            ? `/api/files/${story.picture_front_pages}` 
            : "../assets/stories-covers/portada-historia-el-cielo-de-abril.png";
            
        const timeAgo = getTimeAgo(story.published_date || story.created_date);
        const storyId = story.id || story.title;

        const card = document.createElement("article");
        card.className = "feed-card story-feed-card mb-4";
        card.innerHTML = `
            <header class="feed-card-header">
                <div class="feed-user-info">
                    <img src="${authorAvatar}" alt="${escapeHtml(authorName)}" class="feed-avatar"
                         onerror="this.src='../assets/users-photos/foto-perfil-usuario.png'" />
                    <p><strong>${escapeHtml(authorName)}</strong> publicó una nueva obra.</p>
                </div>
                <span class="feed-time">${timeAgo}</span>
            </header>
            <div class="story-feed-content">
                <img src="${coverSrc}" alt="${escapeHtml(story.title)}" class="story-cover"
                     onerror="this.src='../assets/stories-covers/portada-historia-el-cielo-de-abril.png'" />
                <div class="story-info">
                    <h2>${escapeHtml(story.title)}</h2>
                    <div class="story-genres">
                        ${(story.genres || []).map(g => `<span>${escapeHtml(g)}</span>`).join("")}
                    </div>
                    <p>${escapeHtml(story.description || "")}</p>
                    <div class="story-actions">
                        <button type="button" class="icon-button like-button" aria-label="Me gusta" data-id="${storyId}">
                            <i class="bi bi-heart"></i>
                            <span class="like-count">${story.likes_count || 0}</span>
                        </button>
                        <button type="button" class="icon-button" aria-label="Comentarios">
                            <i class="bi bi-chat"></i>
                            ${story.comments_count || 0}
                        </button>
                        <button type="button" class="icon-button" aria-label="Compartir">
                            <i class="bi bi-share"></i>
                        </button>
                        <button type="button" class="icon-button save-button" aria-label="Guardar"
                                data-id="${storyId}" data-titulo="${escapeHtml(story.title)}" data-autor="${escapeHtml(authorName)}" data-portada="${coverSrc}">
                            <i class="bi bi-bookmark"></i>
                        </button>
                        <a href="lectura.html?id=${storyId}" class="read-button" data-id="${storyId}"
                           data-titulo="${escapeHtml(story.title)}" data-autor="${escapeHtml(authorName)}"
                           data-portada="${coverSrc}" data-total-pages="${story.total_pages || 1}">
                            Leer
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupSaveButtons() {
    document.querySelectorAll(".save-button").forEach(btn => {
        btn.removeEventListener("click", handleSave);
        btn.addEventListener("click", handleSave);
    });
}

function handleSave(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const titulo = btn.dataset.titulo;
    const autor = btn.dataset.autor;
    const portada = btn.dataset.portada;
    const saved = JSON.parse(localStorage.getItem("caliopeSaved") || "[]");
    if (!saved.find(s => s.id === id)) {
        saved.push({ id, titulo, autor, portada });
        localStorage.setItem("caliopeSaved", JSON.stringify(saved));
        btn.querySelector("i").className = "bi bi-bookmark-fill";
    } else {
        const filtered = saved.filter(s => s.id !== id);
        localStorage.setItem("caliopeSaved", JSON.stringify(filtered));
        btn.querySelector("i").className = "bi bi-bookmark";
    }
}

function getTimeAgo(dateStr) {
    if (!dateStr) return "";
    try {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Ahora";
        if (mins < 60) return `Hace ${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Hace ${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `Hace ${days}d`;
        return new Date(dateStr).toLocaleDateString("es-MX");
    } catch {
        return dateStr;
    }
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

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
                : `/api/files/${profile.picture_avatar}`;
            return;
        }
        
        // 2. Si no está en localStorage, consultar al backend
        const res = await api("/api/users/me");
        if (!res.ok) throw new Error("Error al cargar perfil");
        const data = await res.json();
        
        if (data.picture_avatar) {
            avatarImg.src = data.picture_avatar.startsWith('http')
                ? data.picture_avatar
                : `/api/files/${data.picture_avatar}`;
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
