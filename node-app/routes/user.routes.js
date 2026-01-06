const express = require('express');
const router = express.Router();

module.exports = (keycloak) => {

    // Connexion
    router.get('/login', keycloak.protect(), (req, res) => {
        res.redirect('/');
    });

    // Déconnexion
    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    // API User Info
    router.get('/api/user', keycloak.protect(), (req, res) => {
        const token = req.kauth.grant.access_token;
        res.json({
            username: token.content.preferred_username,
            name: token.content.name || token.content.preferred_username,
            roles: token.content.realm_access?.roles || []
        });
    });

    return router;
};