import { apiCall } from './api.js';
import { updateValidationStatus, showMessage } from './ui.js';

export async function loadNotes(ue) {
    try {
        const data = await apiCall(`/api/notes/${ue}`);
        const tbody = document.getElementById(`notes-${ue}`);

        tbody.innerHTML = '';
        const fragment = document.createDocumentFragment();

        data.notes.forEach((note, index) => {
            const tr = document.createElement('tr');

            // Création sécurisée des éléments (pas de innerHTML avec des variables)
            const tdName = document.createElement('td');
            tdName.textContent = note.etudiant;

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
    } catch (e) {}
}

export async function saveNotes(ue) {
    try {
        const tbody = document.getElementById(`notes-${ue}`);
        const inputs = tbody.querySelectorAll('input');

        const notes = Array.from(inputs).map(input => ({
            etudiant: input.closest('tr').cells[0].textContent,
            note: parseFloat(input.value)
        }));

        const data = await apiCall(`/api/notes/${ue}`, {
            method: 'POST',
            body: { notes }
        });
        showMessage(data.message);
    } catch (e) {}
}

export async function validateNotes(ue) {
    try {
        const data = await apiCall(`/api/notes/${ue}/valider`, { method: 'POST' });
        showMessage(data.message);
        updateValidationStatus(ue, true);
        loadNotes(ue);
    } catch (e) {}
}