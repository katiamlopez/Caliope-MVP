/*
* ═══════ CONFIGURACION ═══════
 */

import { getToken } from "./auth.js";

console.log("Token:", getToken());

fetch("configuracion.html");
console.log("conectao :) ");

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

const defaultProfile = {
    displayName: "Ana García",
    username: "@anag",
    pronouns: [],
    roles: ["Escritor", "Lector"],
    bio: "Amo la fantasía, los mundos imaginarios y las historias que te hacen sentir. Siempre escribiendo, siempre leyendo.",
};

const selectedPronouns = [];
const selectedRoles = [];

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

function loadProfileSettings() {
    const savedProfile =
        JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY)) || defaultProfile;

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

function saveProfileSettings() {
    const displayNameInput = document.getElementById("displayName");
    const usernameInput = document.getElementById("username");
    const bioInput = document.getElementById("profileBio");

    const profile = {
        displayName: displayNameInput.value.trim(),
        username: usernameInput.value.trim(),
        pronouns: selectedPronouns,
        roles: selectedRoles,
        bio: bioInput.value.trim(),
    };

    localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile)
    );

    alert("Perfil actualizado correctamente.");
}

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

const profileSettingsForm = document.getElementById("profileSettingsForm");

if (profileSettingsForm) {
    loadProfileSettings();

    profileSettingsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveProfileSettings();
    });
}
