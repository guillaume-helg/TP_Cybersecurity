import { state, CONFIG } from './config.js';
import { initDashboardUI } from './ui.js';

export async function checkAuth() {
    try {
        const response = await fetch('/api/user'); // Fetch direct pour éviter l'erreur visuelle
        if (response.ok) {
            state.currentUser = await response.json();

            initDashboardUI();
            displayUser(state.currentUser);

            document.getElementById('login-section').style.display = 'none';
            document.getElementById('app-section').style.display = 'block';
        }
    } catch (error) {
        console.log('Non connecté');
    }
}

function displayUser(user) {
    document.getElementById('user-name').textContent = user.name;
    const rolesDiv = document.getElementById('user-roles');

    rolesDiv.innerHTML += user.roles
        .filter(role => CONFIG.roles.has(role))
        .map(role => `<span class="role-badge">${role}</span>`)
        .join('');
}

export function login() { window.location.href = '/login'; }
export function logout() { window.location.href = '/logout'; }