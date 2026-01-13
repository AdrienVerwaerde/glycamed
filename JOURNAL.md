# Journal de bord - GlycAmed Production Ready

**Nom** : Adrien Verwaerde & Benjamin Bonnevial
**Date** : 13 janvier 2026
**Stack** : React

---

## Partie 1 : Patterns & Architecture

### Ce que j'ai mis en place :
- [x] Configuration centralisée
- [x] Service API
- [x] Store/Context pour l'état global
- [x] Composants réutilisables

### Fichiers créés :
1. `src/config.js`
2. `e2e/home.spec.js` (et autres)

### Fichiers modifiés :
1. `src/services/api.js`
2. `src/contexts/AuthContext.jsx`

### Difficultés :
Trouver et rassembler tous les morceaux de code à modifier / améliorer

### Temps passé : ?

---

## Partie 2 : Refactoring

### Pages améliorées :
- [x] Login
- [x] Dashboard  
- [x] Autre : RegisterPage

### Principal changement :
Passage des appels Axios directs vers l'usage du hook `useAuth` et du service centralisé `api.js`. Intégration des constantes de `config.js`.

### Temps passé : ?

---

## Partie 3 : Tests E2E

### Tests créés :
1. `home.spec.js` (titre et contenu)
2. `auth.spec.js` (login success/fail)
3. `dashboard.spec.js` (afficahge des jauges)

### Nombre de tests qui passent : 12 / 12

### data-testid ajoutés :
Aucun, utilisation de `getByRole` et `locator` sémantiques.

### Temps passé : ?

---

## Partie 4 : Sentry

### Implémenté :
- [x] Initialisation
- [x] Identification utilisateur
- [x] Error Boundary (React)

### URL de votre projet Sentry :
https://benjamin-bonnevial.sentry.io/insights/projects/glycamed/?project=4510703595094096

### Temps passé : ?

---

## Récap global

**Temps total** : ?

**Ce que j'ai appris** :
1. Faire des tests avec Playwright
2. Le mock d'API
3. La factorisation du code et des variables en dur

**Ce qui reste à améliorer** :
1. Ma compréhension et rédaction des tests
2. Sentry

**Questions pour le prof** :
1. Pas pour l'instant
2. 
