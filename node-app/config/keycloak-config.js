require('dotenv').config();

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

module.exports = keycloakConfig;