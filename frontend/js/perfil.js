import { getToken } from "./auth.js";

console.log("Token:", getToken());

document.addEventListener("DOMContentLoaded", () => {
    const defaultProfile = {
        displayName: "Ana García",
        username: "@anag",
        pronouns: "ella/she",
        bio: "Amo la fantasía, los mundos imaginarios y las historias que te hacen sentir. Siempre escribiendo, siempre leyendo.",
        roles: ["Escritora", "Lectora"],
    };

    const profile =
        JSON.parse(localStorage.getItem("caliopeUserProfile")) || defaultProfile;

    const displayName = document.querySelector("#profileDisplayName");
    const username = document.querySelector("#profileUsername");
    const pronouns = document.querySelector("#profilePronouns");
    const bio = document.querySelector("#profileBio");
    const roles = document.querySelector("#profileRoles");

    displayName.textContent = profile.displayName;
    username.textContent = profile.username;
    bio.textContent = profile.bio;

    if (profile.pronouns) {
        pronouns.textContent = profile.pronouns;
        pronouns.style.display = "block";
    } else {
        pronouns.style.display = "none";
    }

    roles.innerHTML = "";

    if (profile.roles && profile.roles.length > 0) {
        profile.roles.forEach((role) => {
            roles.innerHTML += `<span>${role}</span>`;
        });
    }
});