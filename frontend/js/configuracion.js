/*
* ═══════ CONFIGURACION ═══════
 */


import { getToken } from "./auth.js";
import { api } from "./api.js";

console.log("Token:", getToken());
fetch("configuracion.html");


const htmlElement = document.documentElement;
const STORAGE_KEY = "theme-preference";
const PROFILE_STORAGE_KEY = "caliopeUserProfile";

function resolveTheme(preference) {
    if (preference === "system") {
        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
    }

    return preference;
}

function applyTheme(theme) {
    const html = document.documentElement;

    html.setAttribute("data-theme", theme);
    html.setAttribute("data-bs-theme", theme);
}

function setTheme(preference) {
    localStorage.setItem(STORAGE_KEY, preference);

    applyTheme(resolveTheme(preference));
}

function initTheme() {
    const preference =
        localStorage.getItem(STORAGE_KEY) || "system";

    applyTheme(resolveTheme(preference));

    const themeSelect =
        document.getElementById("themeSelect");

    if (themeSelect) {
        themeSelect.value = preference;
    }
}

document
    .getElementById("themeSelect")
    ?.addEventListener("change", (event) => {
        setTheme(event.target.value);
        console.log(event.target.value);
    });

initTheme();

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        const preference =
            localStorage.getItem(STORAGE_KEY);

        if (preference === "system") {
            applyTheme(resolveTheme("system"));
        }
    });

/**
 * * ═══════ PERFIL DE USUARIO ═══════
 */

const selectedPronouns = [];
const selectedRoles = [];

// Variables para almacenar el perfil actual
let currentUserProfile = null;
let currentUserId = null;

function renderTags(containerId, values, removeCallback) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    values.forEach((value) => {
        const tag = document.createElement("span");
        tag.classList.add("selected-tag");

        tag.innerHTML = `
            ${value}
            <button type="button" aria-label="Eliminar ${value}">×</button>
        `;

        tag.querySelector("button").addEventListener("click", () => {
            removeCallback(value);
        });

        container.appendChild(tag);
    });
}

function addValue(value, array, max, containerId, removeCallback) {
    if (!value) return;

    if (array.includes(value)) return;

    if (array.length >= max) {
        alert(`Puedes seleccionar máximo ${max} opciones.`);
        return;
    }

    array.push(value);
    renderTags(containerId, array, removeCallback);
}

function removePronoun(value) {
    const index = selectedPronouns.indexOf(value);

    if (index !== -1) {
        selectedPronouns.splice(index, 1);
    }

    renderTags("selectedPronouns", selectedPronouns, removePronoun);
}

function removeRole(value) {
    const index = selectedRoles.indexOf(value);

    if (index !== -1) {
        selectedRoles.splice(index, 1);
    }

    renderTags("selectedRoles", selectedRoles, removeRole);
}

// 🔥 NUEVA FUNCIÓN: Cargar perfil desde el backend
async function loadProfileFromBackend() {
    try {
        const res = await api("/api/users/me");
        if (!res.ok) throw new Error("Error al cargar perfil");
        
        const data = await res.json();
        currentUserProfile = data;
        currentUserId = data.id;
        
        // Cargar los datos en el formulario
        const displayNameInput = document.getElementById("displayName");
        const usernameInput = document.getElementById("username");
        const bioInput = document.getElementById("profileBio");
        const avatarInput = document.getElementById("profileAvatar");
        const emailInput = document.getElementById("profileEmail");

        if (displayNameInput) {
            displayNameInput.value = `${data.firstName || ""} ${data.lastName || ""}`.trim();
        }

        if (usernameInput) {
            usernameInput.value = data.user_name || data.username || "";
        }

        if (bioInput) {
            bioInput.value = data.bio || "";
        }

        if (emailInput) {
            emailInput.value = data.email || "";
        }

        // Cargar pronombres y roles (si existen en el backend)
        if (data.pronouns && Array.isArray(data.pronouns)) {
            selectedPronouns.length = 0;
            selectedPronouns.push(...data.pronouns);
        }

        if (data.roles && Array.isArray(data.roles)) {
            selectedRoles.length = 0;
            selectedRoles.push(...data.roles);
        }

        renderTags("selectedPronouns", selectedPronouns, removePronoun);
        renderTags("selectedRoles", selectedRoles, removeRole);

        // Mostrar avatar si existe
        if (data.picture_avatar) {
            const avatarPreview = document.getElementById("avatarPreview");
            if (avatarPreview) {
                avatarPreview.src = data.picture_avatar.startsWith('http') 
                    ? data.picture_avatar 
                    : `/api/files/${data.picture_avatar}`;
                avatarPreview.style.display = "block";
            }
        }

        return data;
    } catch (e) {
        console.warn("No se pudo cargar perfil desde API, usando localStorage", e);
        // Fallback a localStorage
        const fallback = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
        if (fallback) {
            loadProfileFromLocalStorage(fallback);
        }
        return null;
    }
}

// Cargar perfil desde localStorage (fallback)
function loadProfileFromLocalStorage(savedProfile) {
    const displayNameInput = document.getElementById("displayName");
    const usernameInput = document.getElementById("username");
    const bioInput = document.getElementById("profileBio");

    if (displayNameInput) {
        displayNameInput.value = savedProfile.displayName;
    }

    if (usernameInput) {
        usernameInput.value = savedProfile.username;
    }

    if (bioInput) {
        bioInput.value = savedProfile.bio;
    }

    selectedPronouns.length = 0;
    selectedRoles.length = 0;

    if (Array.isArray(savedProfile.pronouns)) {
        selectedPronouns.push(...savedProfile.pronouns);
    }

    if (Array.isArray(savedProfile.roles)) {
        selectedRoles.push(...savedProfile.roles);
    }

    renderTags("selectedPronouns", selectedPronouns, removePronoun);
    renderTags("selectedRoles", selectedRoles, removeRole);
}

// 🔥 NUEVA FUNCIÓN: Guardar perfil en el backend
async function saveProfileToBackend(formData) {
    try {
        console.log("currentUserId:", currentUserId); // 🔥 VERIFICAR
        console.log("Token:", getToken()); // 🔥 VERIFICAR
        const userId = currentUserId;
        if (!userId) {
            throw new Error("No hay usuario autenticado");
        }

        // Construir el objeto de usuario para enviar
        const userData = {
            firstName: formData.displayName.split(' ')[0] || "",
            lastName: formData.displayName.split(' ').slice(1).join(' ') || "",
            user_name: formData.username || "",
            bio: formData.bio || "",
            // No enviamos campos que no queremos actualizar (password, email, etc.)
        };

        console.log("Enviando al backend:", userData);

        const response = await fetch(`api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al actualizar: ${response.status} - ${errorText}`);
        }

        const updatedUser = await response.json();
        console.log("Usuario actualizado:", updatedUser);

        // Actualizar localStorage
        const profile = {
            displayName: `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim(),
            username: updatedUser.user_name ? `@${updatedUser.user_name}` : "",
            pronouns: selectedPronouns,
            roles: selectedRoles,
            bio: updatedUser.bio || "",
            picture_avatar: updatedUser.picture_avatar
        };

        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem("caliopeUserProfile", JSON.stringify(profile));

        alert("Perfil actualizado correctamente.");
        return updatedUser;
    } catch (e) {
        console.error("Error al guardar perfil:", e);
        alert(`Error al guardar: ${e.message}`);
        throw e;
    }
}

// 🔥 NUEVA FUNCIÓN: Manejar la subida de avatar
async function uploadAvatar(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const response = await fetch(`api/users/${currentUserId}/avatar`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir avatar");
        }

        const result = await response.json();
        return result.picture_avatar;
    } catch (e) {
        console.error("Error al subir avatar:", e);
        alert("No se pudo subir el avatar");
        return null;
    }
}

// 🔥 NUEVA FUNCIÓN: Guardar perfil completo
async function saveProfileSettings(event) {
    event.preventDefault();

    const displayNameInput = document.getElementById("displayName");
    const usernameInput = document.getElementById("username");
    const bioInput = document.getElementById("profileBio");
    const avatarInput = document.getElementById("profileAvatar");

    // Validar campos requeridos
    if (!displayNameInput.value.trim()) {
        alert("El nombre es obligatorio");
        displayNameInput.focus();
        return;
    }

    const formData = {
        displayName: displayNameInput.value.trim(),
        username: usernameInput.value.trim().replace('@', ''),
        bio: bioInput.value.trim(),
        pronouns: selectedPronouns,
        roles: selectedRoles
    };

    // Primero guardar el perfil
    await saveProfileToBackend(formData);

    // Luego subir el avatar si hay uno nuevo
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
        await uploadAvatar(avatarInput.files[0]);
    }

    // Recargar el perfil para actualizar todo
    await loadProfileFromBackend();
}

// Configurar eventos
document.addEventListener("DOMContentLoaded", async () => {
    // Cargar perfil del backend
    await loadProfileFromBackend();

    // Configurar eventos de pronombres y roles
    document.getElementById("pronounSelect")?.addEventListener("change", (event) => {
        addValue(
            event.target.value,
            selectedPronouns,
            3,
            "selectedPronouns",
            removePronoun
        );
        event.target.value = "";
    });

    document.getElementById("roleSelect")?.addEventListener("change", (event) => {
        addValue(
            event.target.value,
            selectedRoles,
            3,
            "selectedRoles",
            removeRole
        );
        event.target.value = "";
    });

    // Configurar el formulario
    const profileSettingsForm = document.getElementById("profileSettingsForm");
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener("submit", saveProfileSettings);
    }

    // Previsualización del avatar
    document.getElementById("profileAvatar")?.addEventListener("change", function(e) {
        const preview = document.getElementById("avatarPreview");
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
});

// Función auxiliar de escape (si no la tienes)
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
