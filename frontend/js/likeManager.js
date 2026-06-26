export const LikeManager = (() => {
  let state = {};

  const STORAGE_KEY = "likes";

  // -------------------------
  // CARGAR / GUARDAR ESTADO
  // -------------------------
  function load() {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function get(id) {
    return state[id];
  }

  // -------------------------
  // TOGGLE (SIN DOM DEPENDENCY)
  // -------------------------
  function toggle(id) {
    if (!state[id]) {
      state[id] = {
        liked: false,
        count: 0,
      };
    }

    state[id].liked = !state[id].liked;

    if (state[id].liked) {
      state[id].count++;
    } else {
      state[id].count = Math.max(0, state[id].count - 1);
    }

    save();
    return state[id];
  }

  // -------------------------
  // ACTUALIZAR UI
  // -------------------------
  function updateUI(btn, data) {
    const icon = btn.querySelector("i");
    const counter = btn.querySelector(".like-count");

    if (!icon || !counter) return;

    btn.classList.toggle("active", data.liked);

    icon.classList.toggle("bi-heart", !data.liked);
    icon.classList.toggle("bi-heart-fill", data.liked);

    counter.textContent = data.count;
  }

  // -------------------------
  // INIT
  // -------------------------
  function init(selector) {
    load();

    const buttons = document.querySelectorAll(selector);

    buttons.forEach((btn) => {
      const id = btn.getAttribute("data-id");
      if (!id) return;

      // Si no existe en storage, inicializa desde DOM UNA SOLA VEZ
      if (!state[id]) {
        const counter = btn.querySelector(".like-count");

        state[id] = {
          liked: false,
          count: parseInt(counter?.textContent || 0),
        };
      }

      // render inicial
      updateUI(btn, state[id]);

      // click handler
      btn.addEventListener("click", () => {
        const newState = toggle(id);
        updateUI(btn, newState);
      });
    });
  }

  return {
    init,
    toggle,
    get,
  };
})();
