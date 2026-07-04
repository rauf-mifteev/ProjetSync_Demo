# ProjetSync — Démonstration web

Démonstration fonctionnelle de ProjetSync (TP1, 420-319-AH), construite à partir du cahier des charges et de la spécification technique de l'équipe. Elle couvre l'authentification, le tableau de bord, la gestion des tâches (Kanban), le calendrier, la gestion d'équipe, le registre des décisions et les notifications.

** Important — ce que cette démo est, et n'est pas.**
Pour pouvoir être hébergée gratuitement sur **GitHub Pages** (qui ne sert que des fichiers statiques, sans serveur), cette version n'utilise **pas** encore le backend Node.js/Express/MongoDB décrit dans la spécification technique. À la place, `src/lib/store.js` simule l'API au complet (mêmes fonctions, mêmes règles de gestion RG-01 à RG-06) mais persiste les données dans le `localStorage` du navigateur plutôt que dans une vraie base de données.

Concrètement :
- Toutes les interactions (créer une tâche, inviter un membre, etc.) fonctionnent réellement et respectent les règles du cahier des charges.
- Les données restent **dans le navigateur de chaque personne** — elles ne sont pas partagées entre deux appareils différents.
- `src/lib/store.js` est écrit pour que chaque fonction corresponde à une route de la section 2 de la spécification technique (`login`, `getTasks`, `createTask`, etc.). Brancher le vrai backend consistera à remplacer le contenu de ce fichier par des appels `fetch` vers l'API, sans toucher aux pages.

## Comptes de démonstration
Un jeu de données est généré automatiquement au premier chargement (équipe, tâches, décisions, notifications). Mot de passe pour tous les comptes : `demo1234`.

| Nom | Rôle | Courriel |
|---|---|---|
| Kevin Vazquez Boza | Scrum Master | kevin.vb@demo.projetsync.app |
| Kevin Mai | Frontend | kevin.mai@demo.projetsync.app |
| Rauf Mifteev | Backend | rauf.mifteev@demo.projetsync.app |
| Daniel Alain Dyky | Full-stack | daniel.dyky@demo.projetsync.app |
| Danensky Nashby Leveille | DevOps | danensky.nl@demo.projetsync.app |

Vous pouvez aussi créer un nouveau compte depuis l'écran de connexion, puis créer votre propre équipe.

Pour repartir des données de démonstration d'origine : ouvrez la console du navigateur et exécutez `localStorage.clear()`, puis rechargez la page.

## Lancer le projet localement

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
npm install
npm run dev
```
Ouvrez l'URL affichée (généralement http://localhost:5173).


## Structure du projet
Voir la section 7 de la spécification technique. Résumé :
```
src/
├── lib/store.js        # Couche de données (à remplacer par de vrais appels API)
├── components/          # Sidebar, TopBar, TaskCard, TaskModal, Avatar, ui.jsx
├── pages/                # LoginPage, DashboardPage, TasksPage, CalendarPage, TeamPage, DecisionsPage
└── App.jsx                # Routage (HashRouter, compatible GitHub Pages)
```
