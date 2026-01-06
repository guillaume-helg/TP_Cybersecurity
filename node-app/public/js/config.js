export const CONFIG = {
    ues: [
        { id: 'ue1', title: "UE1 - Unité d'Enseignement 1" },
        { id: 'ue2', title: "UE2 - Unité d'Enseignement 2" },
        { id: 'ue3', title: "UE3 - Unité d'Enseignement 3" }
    ],
    roles: new Set(['Enseignant titulaire', 'Moniteur', 'R1', 'C1', 'R2', 'C2', 'R3', 'C3'])
};

export const state = {
    currentUser: null
};