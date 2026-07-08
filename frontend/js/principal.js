//!FUNCIONAMIENTO DEL BOTON DE LIKE
import { getToken } from "./auth.js";

console.log("Token:", getToken());


import { LikeManager } from "./likeManager.js";

document.addEventListener("DOMContentLoaded", () => {
  LikeManager.init(".like-button");
});
