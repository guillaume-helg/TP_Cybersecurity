// --- 1. CONFIGURATION & CONSTANTES ---
const CONFIG = {
    ues: [
        { id: 'ue1', title: "UE1 - Unité d'Enseignement 1" },
        { id: 'ue2', title: "UE2 - Unité d'Enseignement 2" },
        { id: 'ue3', title: "UE3 - Unité d'Enseignement 3" }
    ],
    roles: new Set(['Ens', 'Mon', 'R1', 'C1', 'R2', 'C2', 'R3', 'C3'])
};

let currentUser = null;

// --- 2. FONCTION UTILITAIRE API (Gère les fetch et erreurs) ---
async function apiCall(url, options = {}) {
    try {
        const defaultHeaders = { 'Content-Type': 'application/json' };
        const config = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            body: options.body ? JSON.stringify(options.body) : null
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erreur inattendue');
        return data;
    } catch (error) {
        showMessage(error.message, 'error');
        throw error; // Relance l'erreur pour arrêter l'exécution si besoin
    }
}

// --- 3. AUTHENTIFICATION & INITIALISATION ---
async function checkAuth() {
    try {
        // Note: On utilise fetch direct ici pour gérer le cas spécifique du 401/403 sans afficher d'erreur rouge
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();

            // 1. Initialiser l'interface des UEs
            initDashboardUI();
            // 2. Afficher les infos user
            displayUser();

            // 3. Basculer l'affichage
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('app-section').style.display = 'block';
        }
    } catch (error) {
        console.log('Utilisateur non authentifié');
    }
}

function initDashboardUI() {
    const container = document.getElementById('ue-container');
    if (!container) return;

    container.innerHTML = CONFIG.ues.map(ue => `
        <div class="ue-section" id="${ue.id}-section">
            <h3>${ue.title} <span class="validation-status non-valide" id="status-${ue.id}">Non validé</span></h3>
            <table>
                <thead><tr><th>Étudiant</th><th>Note</th></tr></thead>
                <tbody id="notes-${ue.id}"></tbody>
            </table>
            <div class="actions">
                <button class="btn-primary" onclick="loadNotes('${ue.id}')">Afficher les notes</button>
                <button class="btn-success" onclick="saveNotes('${ue.id}')">Enregistrer</button>
                <button class="btn-success" onclick="validateNotes('${ue.id}')">Valider</button>
            </div>
        </div>
    `).join('');
}

function displayUser() {
    document.getElementById('user-name').textContent = currentUser.name;
    const rolesDiv = document.getElementById('user-roles');

    // Filtrage et création des badges en une passe
    rolesDiv.innerHTML = rolesDiv.innerHTML + currentUser.roles
        .filter(role => CONFIG.roles.has(role))
        .map(role => `<span class="role-badge">${role}</span>`)
        .join('');
}

// --- 4. GESTION DES NOTES ---

async function loadNotes(ue) {
    try {
        const data = await apiCall(`/api/notes/${ue}`);
        const tbody = document.getElementById(`notes-${ue}`);

        // Construction optimisée du tableau
        tbody.innerHTML = ''; // Clear
        const fragment = document.createDocumentFragment();

        data.notes.forEach((note, index) => {
            const tr = document.createElement('tr');

            // Cellule Nom (Sécurisée contre XSS via textContent)
            const tdName = document.createElement('td');
            tdName.textContent = note.etudiant;

            // Cellule Note
            const tdNote = document.createElement('td');
            tdNote.innerHTML = `<input type="number" step="0.5" min="0" max="20" 
                                       value="${note.note}" data-index="${index}" 
                                       ${data.valide ? 'disabled' : ''}>`;

            tr.appendChild(tdName);
            tr.appendChild(tdNote);
            fragment.appendChild(tr);
        });

        tbody.appendChild(fragment);
        updateValidationStatus(ue, data.valide);
        showMessage(`Notes de ${ue.toUpperCase()} chargées`);
    } catch (e) { /* L'erreur est déjà affichée par apiCall */ }
}

async function saveNotes(ue) {
    try {
        const tbody = document.getElementById(`notes-${ue}`);
        // Récupération des données via mapping sur les inputs
        const notes = Array.from(tbody.querySelectorAll('input[type="number"]')).map(input => ({
            etudiant: input.closest('tr').cells[0].textContent,
            note: parseFloat(input.value)
        }));

        const data = await apiCall(`/api/notes/${ue}`, {
            method: 'POST',
            body: { notes }
        });

        showMessage(data.message);
    } catch (e) { /* Erreur gérée */ }
}

async function validateNotes(ue) {
    try {
        const data = await apiCall(`/api/notes/${ue}/valider`, { method: 'POST' });

        showMessage(data.message);
        updateValidationStatus(ue, true);
        loadNotes(ue); // Recharger pour désactiver les champs
    } catch (e) { /* Erreur gérée */ }
}

// --- 5. UI HELPERS ---

function updateValidationStatus(ue, isValide) {
    const statusSpan = document.getElementById(`status-${ue}`);
    if (statusSpan) {
        statusSpan.textContent = isValide ? 'Validé' : 'Non validé';
        statusSpan.className = `validation-status ${isValide ? 'valide' : 'non-valide'}`;
    }
}

function showMessage(text, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

function login() { window.location.href = '/login'; }
function logout() { window.location.href = '/logout'; }

// Lancement
checkAuth();