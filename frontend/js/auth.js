// auth.js

const TOKEN_KEY = "token";

/**
 * Guarda el JWT
 */
export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Obtiene el JWT
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Verifica si existe un token
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * Elimina el token
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "../Pages/inicio_sesion.html";
}