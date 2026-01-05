require('dotenv').config();

const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const axios = require('axios');
const path = require('path');
const {response} = require("express");

const app = express();
const memoryStore = new session.MemoryStore();

// Configuration de la session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Configuration Keycloak
const keycloakConfig = {
    realm: process.env.KEYCLOAK_REALM,
    'auth-server-url': process.env.KEYCLOAK_AUTH_SERVER_URL,
    'ssl-required': 'external',
    resource: process.env.KEYCLOAK_RESOURCE,
    'confidential-port': 0,
    credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET
    }
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware());
app.use(express.json());
app.use(express.static('public'));

// Stockage simulé des notes (en mémoire)
const notesStorage = {
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

// État de validation des notes
const validationStatus = {
    ue1: false,
    ue2: false,
    ue3: false
};

// Middleware pour vérifier les permissions avec Keycloak
async function checkPermission(req, res, next, resource, scope) {
    try {
        const token = req.kauth.grant.access_token.token;

        const response = await axios.post(
            `${keycloakConfig['auth-server-url']}realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
            new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
                audience: keycloakConfig.resource,
                permission: `${resource}#${scope}`,
                response_mode: 'decision'
            }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (response.data.result) {
            next();
        } else {
            res.status(403).json({ error: 'Accès refusé : permissions insuffisantes' });
        }
    } catch (error) {
        console.error('Erreur de vérification des permissions:', error.response?.data || error.message);
        res.status(403).json({
            error: 'Accès refusé',
            details: error.response?.data?.error_description || 'Permissions insuffisantes'
        });
    }
}

// Routes protégées

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Page de connexion
app.get('/login', keycloak.protect(), async (req, res, next) => {
    res.redirect('/');
});


// Informations utilisateur
app.get('/api/user', keycloak.protect(), (req, res) => {
    const token = req.kauth.grant.access_token;
    res.json({
        username: token.content.preferred_username,
        name: token.content.name || token.content.preferred_username,
        roles: token.content.realm_access?.roles || []
    });
});

// Lire les notes d'une UE (permission L)
app.get('/api/notes/:ue', keycloak.protect(), async (req, res, next) => {
    const ue = req.params.ue;
    await checkPermission(req, res, next, `notes-${ue}`, 'lire');
}, (req, res) => {
    const ue = req.params.ue;
    res.json({
        ue: ue.toUpperCase(),
        notes: notesStorage[ue] || [],
        valide: validationStatus[ue] || false
    });
});

// Écrire/Modifier les notes (permission E)
app.post('/api/notes/:ue', keycloak.protect(), async (req, res, next) => {
    const ue = req.params.ue;
    await checkPermission(req, res, next, `notes-${ue}`, 'ecrire');
}, (req, res) => {
    const ue = req.params.ue;
    const { notes } = req.body;

    if (validationStatus[ue]) {
        return res.status(400).json({
            error: 'Impossible de modifier des notes déjà validées'
        });
    }

    notesStorage[ue] = notes;
    res.json({
        success: true,
        message: `Notes de ${ue.toUpperCase()} mises à jour`,
        notes: notesStorage[ue]
    });
});

// Valider les notes (permission V)
app.post('/api/notes/:ue/valider', keycloak.protect(), async (req, res, next) => {
    const ue = req.params.ue;
    await checkPermission(req, res, next, `notes-${ue}`, 'valider');
}, (req, res) => {
    const ue = req.params.ue;

    if (validationStatus[ue]) {
        return res.status(400).json({
            error: 'Les notes sont déjà validées'
        });
    }

    validationStatus[ue] = true;
    res.json({
        success: true,
        message: `Notes de ${ue.toUpperCase()} validées`,
        valide: true
    });
});

// Déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Assurez-vous que Keycloak est en cours d\'exécution sur http://localhost:8080');
});