# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Gestion des stagiaires

  Ce dépôt contient l'application front-end d'un système de gestion des stagiaires. L'application est développée en React + TypeScript et utilise Vite comme bundler.

  Objectifs principaux :

  - Créer, modifier et lister des stagiaires
  - Gérer les tâches associées aux stagiaires
  # Gestion des stagiaires

  Repository: application front-end pour la gestion des stagiaires (React + TypeScript + Vite).

  Résumé

  - Objectif : gérer des stagiaires (création, édition, listing) et les tâches associées.
  - Export PDF des listes de stagiaires.

  Prérequis

  - Node.js 18+ (recommandé)
  - npm (ou pnpm)

  Installation

  ```powershell
  git clone <url-du-depot>
  cd "Gestion des Stagiaires"
  npm install
  ```

  ou avec pnpm :

  ```powershell
  pnpm install
  ```

  Scripts utiles

  - `npm run dev` — démarre Vite en mode développement
  - `npm run build` — compile TypeScript et construit l'application (`tsc -b && vite build`)
  - `npm run lint` — lance ESLint
  - `npm run preview` — prévisualise la build

  Exemples :

  ```powershell
  npm run dev
  npm run build
  npm run preview
  ```

  Structure du projet (extrait)

  - `src/` : code source
    - `main.tsx`, `App.tsx` — point d'entrée
    - `components/` — composants et pages (Stagiaire, Tache, Layout, ui/...)
    - `lib/` — utilitaires, helpers et export PDF
    - `styles/` — fichiers CSS
  - `public/` : ressources publiques
  - fichiers de config : `package.json`, `tsconfig.json`, `vite.config.ts`

  Développement

  ```powershell
  npm run dev
  ```

  Ouvrez l'URL indiquée par Vite (par défaut `http://localhost:5173`).

  Lint & tests

  ```powershell
  npm run lint
  ```

  Il n'y a pas de tests unitaires configurés par défaut. Si vous le souhaitez, je peux ajouter une configuration avec Vitest.

  Export PDF

  Le projet utilise `jspdf` et `jspdf-autotable` pour générer des PDF. L'utilitaire principal se trouve dans `src/lib/export-pdf.ts`.

  Contribution

  - Forkez le dépôt
  - Créez une branche `feature/*` ou `fix/*`
  - Ouvrez une Pull Request en décrivant vos changements

  Bonnes pratiques

  - Respectez la convention de branches : `feature/*`, `fix/*`, `chore/*`
  - Écrivez des commits atomiques et descriptifs

  Idées d'améliorations

  - Ajouter une API backend (Express, Fastify, ou Firebase)
  - Authentification et gestion des rôles
  - Ajouter des tests (Vitest)
  - Export CSV / Excel

  Besoin d'aide ?

  Dites-moi quelles fonctionnalités vous souhaitez ajouter (champs de formulaire, validations, pages, export, CI, etc.) — je peux générer les composants, tests ou une CI de base.

  ---

  Fichier README mis à jour.
  - `npm run lint` — lance ESLint
  - `npm run preview` — prévisualise la build

  Exemples :

  ```powershell
  npm run dev
  npm run build
  npm run preview
  ```

  Structure du projet (extrait)

  - `src/`
    - `main.tsx`, `App.tsx` — point d'entrée
    - `components/` — composants et pages (Stagiaire, Tache, Layout, ui/...)
    - `lib/` — utilitaires, helpers et export PDF
    - `styles/` — fichiers CSS
  - `public/` — ressources publiques
  - fichiers de configuration : `package.json`, `tsconfig.json`, `vite.config.ts`

  Développement

  1. Lancer le mode développement :

  ```powershell
  npm run dev
  ```

  2. Ouvrir l'URL indiquée par Vite (par défaut `http://localhost:5173`).

  Lint & tests

  ```powershell
  npm run lint
  ```

  Il n'y a pas de tests unitaires configurés par défaut. Si vous le souhaitez, je peux ajouter une configuration de tests (Vitest).

  Export PDF

  Le projet utilise `jspdf` et `jspdf-autotable` pour générer des PDF. L'utilitaire se trouve dans `src/lib/export-pdf.ts`.

  Contribution

  - Forkez le dépôt
  - Créez une branche `feature/*` ou `fix/*`
  - Ouvrez une Pull Request en décrivant vos changements

  Bonnes pratiques

  - Respecter la convention de branches : `feature/*`, `fix/*`, `chore/*`
  - Écrire des commits atomiques et clairs

  Idées d'améliorations

  - Ajouter un backend (Express, Fastify, ou Firebase)
  - Authentification et gestion des rôles
  - Tests unitaires et d'intégration (Vitest)
  - Export CSV / Excel

  Besoin d'aide ?

  Dites-moi ce que vous voulez ajouter ou améliorer (ex : nouveaux champs, validations, pages, CI). Je peux générer les composants, tests ou la configuration CI nécessaires.

  ---

  Fichier README mis à jour.

  Dites-moi quelles pages ou fonctionnalités vous voulez (ex : champs du formulaire, validations, workflow d'export) — je peux générer les composants nécessaires, des tests ou une CI de base.

  ---

  Fichier README mis à jour.
  Le projet utilise `jspdf` et `jspdf-autotable` pour l'export PDF. Le code d'export se trouve dans `src/lib/export-pdf.ts`.

  Contribution

  - Forkez le dépôt
  - Créez une branche `feature/*` ou `fix/*`
  - Ouvrez une Pull Request en décrivant les changements

  Convention recommandée : `feature/*`, `fix/*`, `chore/*`.

  Idées d'améliorations

  - Ajouter une API backend (Express, Fastify ou Firebase)
  - Authentification et gestion des rôles
  - Tests unitaires et d'intégration (Vitest)
  - Export CSV / Excel

  Besoin d'aide ?

  Dites-moi quelles fonctionnalités vous souhaitez (champs du formulaire, validations, pages supplémentaires, export, etc.) et je peux générer les composants, les tests ou une CI de base.

  ---

  # Gestion des stagiaires

  Application front-end pour gérer des stagiaires (React + TypeScript + Vite).

  Résumé

  - Fonctionnalités : création / modification / listing des stagiaires, gestion des tâches, export PDF

  Prérequis

  - Node.js 18+ (recommandé)
  - npm ou pnpm

  Installation

  ```powershell
  git clone <url-du-depot>
  cd "Gestion des Stagiaires"
  npm install
  ```

  ou avec pnpm :

  ```powershell
  pnpm install
  ```

  Scripts utiles

  - `npm run dev` — démarre Vite en développement
  - `npm run build` — construit l'application (`tsc -b && vite build`)
  - `npm run lint` — lance ESLint
  - `npm run preview` — prévisualise la build

  Utilisation rapide

  ```powershell
  npm run dev
  ```

  Ouvrez l'URL affichée par Vite (par défaut http://localhost:5173).

  Structure du projet (extrait)

  - `src/` : code source (components, lib, styles...)
  - `public/` : assets
  - fichiers de config : `package.json`, `tsconfig.json`, `vite.config.ts`

  Export PDF

  Le projet utilise `jspdf` et `jspdf-autotable` (voir `src/lib/export-pdf.ts`).

  Contribution

  - Forkez le dépôt, créez une branche `feature/*` ou `fix/*` et ouvrez une PR.

  ---

  README mis à jour.

