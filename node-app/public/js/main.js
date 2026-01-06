import { checkAuth, login, logout } from './auth.js';
import { loadNotes, saveNotes, validateNotes } from './notes.js';

// Exposer login/logout
window.login = login;
window.logout = logout;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Gestion centralisée des clics (Délégation d'événements)
    const container = document.getElementById('ue-container');
    if (container) {
        container.addEventListener('click', (e) => {
            // On vérifie si l'élément cliqué est un bouton
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action; // load, save, ou validate
            const ue = btn.dataset.ue;         // ue1, ue2...

            if (action === 'load') loadNotes(ue);
            if (action === 'save') saveNotes(ue);
            if (action === 'validate') validateNotes(ue);
        });
    }
});