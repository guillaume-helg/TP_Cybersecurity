# 🛡️ Système de Gestion des Notes - TP Cybersécurité

Ce projet est une application de démonstration mettant en œuvre une architecture sécurisée pour la gestion de notes d'étudiants. Il illustre l'intégration d'un système d'authentification robuste (IAM) avec Keycloak, une segmentation réseau stricte via Docker, et une application Node.js protégée.

## 📦 Installation et Démarrage

Le déploiement se fait en deux étapes simples : la compilation et le lancement de l'infrastructure conteneurisée.

### 1. Compilation des extensions de keycloak

Génère les fichiers `.jar`

```bash
mvn clean install
```

### 2. Démarrage de l'infrastructure

Lance tous les services (LDAP, Keycloak, Node App) en mode détaché.

```bash
docker compose up
```

## 🌐 Accès aux Services

Une fois l'infrastructure démarrée :

| Service | URL | Identifiants (Défaut) |
| --- | --- | --- |
| **Application Web** | [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) | Se connecter via Keycloak |
| **Console Keycloak** | [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080) | `admin` / `admin` |

## 📂 Architecture du Projet

```text
.
├── docker-compose.yml
├── node-app/             # Application Web Client (Node.js + Express)
│   ├── public/           # Assets statiques
│   ├── routes/           # Routes API
│   └── server.js         # Point d'entrée de l'application
├── themes/               # Projet Maven pour le thème graphique Keycloak
├── keycloak/             # Configuration de l'image Docker Keycloak
├── ldap/                 # Configuration et données de l'annuaire LDAP
├── magic-link/           # Extension (Provider) Java pour Keycloak
├── token-validation/     # Module de validation de token
├── pom.xml               # Configuration Maven racine
└── docker-compose.yml    # Orchestration et réseaux (net-identity, net-app...)
```
## 👥 Auteurs

* **Guillaume Helg** - *M2 MIAGE*
* **Jérémy Patapy** - *M2 MIAGE*