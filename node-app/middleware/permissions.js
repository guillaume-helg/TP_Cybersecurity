const axios = require('axios');
const keycloakConfig = require('../config/keycloak-config');

async function checkPermission(req, res, next, ue, resource, scope) {
    try {
        const token = req.kauth.grant.access_token.token;

        // Appel à Keycloak pour vérifier les permissions UMA
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
            return next();
        } else {
            return res.status(403).json({ error: 'Accès refusé : permissions insuffisantes' });
        }
    } catch (error) {
        console.error(`Erreur permission ${scope} sur ${ue}:`, error.response?.data || error.message);
        return res.status(403).json({
            error: `<strong>Accès refusé :</strong> ${scope} impossible sur l'${ue}`,
            details: error.response?.data?.error_description || 'Erreur technique Keycloak'
        });
    }
}

module.exports = checkPermission;