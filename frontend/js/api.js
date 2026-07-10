// api.js

import { getToken } from "./auth.js";

// const BASE_URL = "http://localhost:8080";

export async function api(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(BASE_URL + endpoint, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "../index.html";
        return;
    }

    return response;
}