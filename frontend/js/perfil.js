import { api } from "./api.js";

let allStories = [];

// Cargo mis datos y mis obras al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    await loadProfile();
    setupTabs();
});

async function loadProfile() {
    try {
        const res = await api("/api/users/me");
        if (!res.ok) throw new Error("Error al cargar perfil");
        const data = await res.json();
        allStories = data.stories || [];
        renderProfile(data);
        renderStoriesByStatus("PUBLICADO", "#obrasContainer");

        localStorage.setItem("caliopeUserProfile", JSON.stringify({
            displayName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
            username: data.user_name ? `@${data.user_name}` : "",
            pronouns: "",
            roles: [],
            bio: data.bio || "",
            picture_avatar: data.picture_avatar || ""
        }));

        updateTopbarAvatar();
        
    } catch (e) {
        console.warn("No se pudo cargar perfil desde API");
        const fallback = JSON.parse(localStorage.getItem("caliopeUserProfile"));
        if (fallback) renderProfile(fallback);
    }
}

function renderProfile(data) {
    const fullName = data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : data.displayName || "Usuario";

    setText("#profileDisplayName", fullName);
    setText("#profileUsername", data.user_name ? `@${data.user_name}` : data.username || "");
    setText("#profileBio", data.bio || "");
    setText("#profileEmail", data.email || "");

   if (data.picture_avatar) {
        const avatar = document.querySelector(".profile-avatar");
        if (avatar) {
            // Si la imagen ya tiene URL completa o es un archivo del servidor
            if (data.picture_avatar.startsWith('http')) {
                avatar.src = data.picture_avatar;
            } else {
                avatar.src = `/api/files/${data.picture_avatar}`;
            }
        }
    }

    if (data.pronouns) {
        const el = document.querySelector("#profilePronouns");
        if (el) {
            el.textContent = data.pronouns;
            el.style.display = "block";
        }
    }
    
    const rolesContainer = document.querySelector("#profileRoles");
    if (rolesContainer && data.roles && data.roles.length) {
        rolesContainer.innerHTML = "";
        data.roles.forEach(r => {
            rolesContainer.innerHTML += `<span>${escapeHtml(r)}</span>`;
        });
    }
}

function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
}

function setupTabs() {
    document.querySelectorAll('#profileTabs [data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener("shown.bs.tab", (e) => {
            const target = e.target.getAttribute("data-bs-target");
            if (target === "#obras") {
                renderStoriesByStatus("PUBLICADO", "#obrasContainer");
            } else if (target === "#borrador") {
                renderStoriesByStatus("BORRADOR", "#borradorContainer");
            }
        });
    });
}


// Filtra obras por publicadas o borradores
function renderStoriesByStatus(status, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const filtered = allStories.filter(s => s.status === status);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay obras disponibles.</p>';
        return;
    }

    container.innerHTML = "";
    filtered.forEach(story => {
        const card = document.createElement("article");
        card.className = "profile-work-card";

  
        const coverSrc = story.picture_front_pages 
            ? `/api/files/${story.picture_front_pages}`
            : "../assets/stories-covers/portada-historia-el-cielo-de-abril.png";
            
        const statusLabel = story.status === "PUBLICADO" ? "Publicado" : "Borrador";
        const statusClass = story.status === "PUBLICADO" ? "status-published" : "status-draft";
        const dateLabel = story.status === "PUBLICADO"
            ? `Publicado: ${formatDate(story.published_date)}`
            : `Creado: ${formatDate(story.created_date)}`;

        card.innerHTML = `
            <div class="profile-work-cover-wrapper">
                <img src="${coverSrc}" alt="${escapeHtml(story.title)}" class="profile-work-cover"
                     onerror="this.style.display='none'" />
            </div>
            <h3>${escapeHtml(story.title)}</h3>
            <p>${escapeHtml(story.description || "")}</p>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
            <p class="profile-work-date">${dateLabel}</p>
        `;
        container.appendChild(card);
    });
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString("es-MX", {
            year: "numeric", month: "long", day: "numeric"
        });
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
