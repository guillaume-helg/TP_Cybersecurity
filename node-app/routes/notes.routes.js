const express = require('express');
const router = express.Router();
const { notesStorage, validationStatus, saveChanges} = require('../data/store');
const checkPermission = require('../middleware/permissions');

module.exports = (keycloak) => {

    // Lire les notes (GET)
    router.get('/api/notes/:ue', keycloak.protect(), async (req, res, next) => {
        const ue = req.params.ue;
        // Middleware spécifique injecté ici
        await checkPermission(req, res, next, ue, `notes_${ue}`, 'lecture');
    }, (req, res) => {
        const ue = req.params.ue;
        res.json({
            ue: ue.toUpperCase(),
            notes: notesStorage[ue] || [],
            valide: validationStatus[ue] || false
        });
    });

    // Modifier les notes (POST)
    router.post('/api/notes/:ue', keycloak.protect(), async (req, res, next) => {
        const ue = req.params.ue;
        await checkPermission(req, res, next, ue, `notes_${ue}`, 'écriture');
    }, (req, res) => {
        const ue = req.params.ue;
        const { notes } = req.body;

        if (validationStatus[ue]) {
            return res.status(400).json({ error: 'Impossible de modifier des notes déjà validées' });
        }

        notesStorage[ue] = notes;
        saveChanges();

        res.json({ success: true, message: `Notes de ${ue.toUpperCase()} mises à jour`, notes: notesStorage[ue] });
    });

    // Valider les notes (POST)
    router.post('/api/notes/:ue/valider', keycloak.protect(), async (req, res, next) => {
        const ue = req.params.ue;
        await checkPermission(req, res, next, ue, `notes_${ue}`, 'validation');
    }, (req, res) => {
        const ue = req.params.ue;

        if (validationStatus[ue]) {
            return res.status(400).json({ error: 'Les notes sont déjà validées' });
        }

        validationStatus[ue] = true;
        saveChanges();

        res.json({ success: true, message: `Notes de ${ue.toUpperCase()} validées`, valide: true });
    });

    return router;
};