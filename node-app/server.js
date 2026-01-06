require('dotenv').config();
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const path = require('path');

// Imports
const keycloakConfig = require('./config/keycloak-config');
const userRoutes = require('./routes/user.routes');
const notesRoutes = require('./routes/notes.routes');

const app = express();
const memoryStore = new session.MemoryStore();

// Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_par_defaut',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Initialisation
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/', userRoutes(keycloak));
app.use('/', notesRoutes(keycloak));

// Route Accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});