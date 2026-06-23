/**
 * * ═══════ CONFIGURACION ═══════
 */
fetch("configuracion.html");
console.log("conectao :) ");
const htmlElement = document.documentElement;
const STORAGE_KEY = 'theme-preference';

function resolveTheme(preference) {

    if (preference === 'system') {

        return window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
            ? 'dark'
            : 'light';
    }

    return preference;
}

function applyTheme(theme) {

    const html =
        document.documentElement;

    html.setAttribute(
        'data-theme',
        theme
    );

    html.setAttribute(
        'data-bs-theme',
        theme
    );
}

function setTheme(preference) {

    localStorage.setItem(
        STORAGE_KEY,
        preference
    );

    applyTheme(
        resolveTheme(preference)
    );
}

function initTheme() {

    const preference =
        localStorage.getItem(STORAGE_KEY)
        || 'system';

    applyTheme(
        resolveTheme(preference)
    );

    const themeSelect =
        document.getElementById('themeSelect');

    if (themeSelect) {
        themeSelect.value = preference;
    }
}

document
    .getElementById('themeSelect')
    ?.addEventListener(
        'change',
        (event) => {

            setTheme(
                event.target.value
                
            );
            console.log(event.target.value);

        }
    );

initTheme();

window
.matchMedia('(prefers-color-scheme: dark)')
.addEventListener(
    'change',
    () => {

        const preference =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (preference === 'system') {

            applyTheme(
                resolveTheme('system')
            );

        }
    }
);