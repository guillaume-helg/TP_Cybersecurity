const fs = require('fs');
const path = require('path');

// Définition des chemins de fichiers
const STORAGE_DIR = path.join(__dirname, 'storage');
const NOTES_FILE = path.join(STORAGE_DIR, 'notes.json');
const STATUS_FILE = path.join(STORAGE_DIR, 'status.json');

// Données par défaut
const defaultNotes = {
    ue1: [
        { etudiant: 'Jean Dupont', note: 15.5 },
        { etudiant: 'Marie Martin', note: 12.0 }
    ],
    ue2: [
        { etudiant: 'Jean Dupont', note: 14.0 },
        { etudiant: 'Marie Martin', note: 16.5 }
    ],
    ue3: [
        { etudiant: 'Jean Dupont', note: 13.5 },
        { etudiant: 'Marie Martin', note: 15.0 }
    ]
};

const defaultStatus = {
    ue1: false,
    ue2: false,
    ue3: false
};

// Créer le dossier
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Fonction générique de chargement
function loadData(filePath, defaultData) {
    if (fs.existsSync(filePath)) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e) {
            console.error(`Erreur de lecture ${filePath}, utilisation des défauts.`);
            return defaultData;
        }
    } else {
        // Création du fichier initial
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        return defaultData; // On retourne une COPIE pour éviter les problèmes de référence
    }
}

// Chargement en mémoire au démarrage
const notesStorage = loadData(NOTES_FILE, defaultNotes);
const validationStatus = loadData(STATUS_FILE, defaultStatus);

// Sauvegarde
function saveChanges() {
    try {
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notesStorage, null, 2));
        fs.writeFileSync(STATUS_FILE, JSON.stringify(validationStatus, null, 2));
        console.log('Données sauvegardées sur le disque.');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde :', error);
    }
}

module.exports = { notesStorage, validationStatus, saveChanges };