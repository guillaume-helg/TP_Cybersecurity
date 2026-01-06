import { CONFIG } from './config.js';

export function showMessage(text, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = text;
    messagesDiv.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

export function updateValidationStatus(ue, isValide) {
    const statusSpan = document.getElementById(`status-${ue}`);
    if (statusSpan) {
        statusSpan.textContent = isValide ? 'Validé' : 'Non validé';
        statusSpan.className = `validation-status ${isValide ? 'valide' : 'non-valide'}`;
    }
}

export function initDashboardUI() {
    const container = document.getElementById('ue-container');
    if (!container) return;

    // On utilise des data-attributes (data-action) au lieu de onclick="..."
    container.innerHTML = CONFIG.ues.map(ue => `
        <div class="ue-section" id="${ue.id}-section">
            <h3>${ue.title} <span class="validation-status inconnu" id="status-${ue.id}">Inconnu</span></h3>
            <table>
                <thead><tr><th>Étudiant</th><th>Note</th></tr></thead>
                <tbody id="notes-${ue.id}"></tbody>
            </table>
            <div class="actions">
                <button class="btn-primary" data-action="load" data-ue="${ue.id}">Afficher les notes</button>
                <button class="btn-success" data-action="save" data-ue="${ue.id}">Enregistrer</button>
                <button class="btn-success" data-action="validate" data-ue="${ue.id}">Valider</button>
            </div>
        </div>
    `).join('');
}