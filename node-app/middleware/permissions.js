/**
 * Middleware Keycloak Enforcer dynamique
 * @param {Object} keycloak - L'instance de Keycloak
 * @param {string} scope - Le scope requis (ex: 'lecture', 'écriture')
 */
function dynamicEnforcer(keycloak, scope){
    return (req, res, next) => {
        const ue = req.params.ue;

        // Nom de la ressource
        const resourceName = `notes_${ue}`;

        // Permission demandée
        const permissions = [`${resourceName}:${scope}`];

        // On instancie et exécute le middleware officiel "enforcer"
        const enforcerMiddleware = keycloak.enforcer(permissions, {
            response_mode: 'permissions'
        });

        enforcerMiddleware(req, res, next);
    };
}

module.exports = dynamicEnforcer;