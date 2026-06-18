const modal = document.getElementById('privacy-modal');
const closeBtn = document.querySelector('.close-btn');

const openFooterLink = document.getElementById('open-privacy');
const openCardBtn = document.getElementById('open-privacy-btn');

const openModal = (e) => {
    e.preventDefault();
    if (modal) modal.style.display = 'flex';
};

if (openFooterLink) openFooterLink.addEventListener('click', openModal);
if (openCardBtn) openCardBtn.addEventListener('click', openModal);

const closeModal = () => {
    if (modal) modal.style.display = 'none';
};

if (closeBtn) closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});
