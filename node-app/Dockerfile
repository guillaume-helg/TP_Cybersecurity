#Image Node.js officielle légère
FROM node:18-alpine

WORKDIR /app

# Copier des fichiers
COPY package*.json ./

# Installation les dépendances
RUN npm install
COPY . .

# Expose le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]