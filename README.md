# ParAmedic

## Description

Cette application web pensée pour l'utilisation sur mobile a pour but de suivre les consommations de boissons sucrées par Amed, un élève de MyDigitalSchool. L'idée est de proposer des indicateurs de quantité pour voir rapidement le taux de sucres, calories et caféine qu'il a pu ingurgiter depuis le début de la journée. De plus, des rapports sur plusieurs périodes sont disponibles.

De son côté, Amed peut accéder à un dashboard personnel pour télécharger des rapports sur la durée voulue et recevoir des alertes pour le prévenir de potentiels dépassements des doses conseillées.

L’application est divisée en deux parties :

- **Backend** : API REST en Node.js/TypeScript + Express + MongoDB
- **Frontend** : React + Vite + Material UI

## Prérequis

Pour lancer l’application en développement :

- **Docker + docker-compose**  
  (recommandé pour ne rien installer localement)
- ou **Node.js 18+** si vous souhaitez lancer API + Front localement

---

## Lancement avec Docker (recommandé)

```bash
docker-compose up --build
```

Cela démarre :

Le backend sur **http://localhost:8080**
Le frontend sur **http://localhost:3000**
Une base de données **MongoDB**

## Lancement en développement (sans Docker)

Cloner le projet

```bash
git clone git@github.com:AdrienVerwaerde/glycamed.git
cd glycamed
```

Démarrer le backend

```bash
cd backend
npm install
npm run dev
```

Démarrer le frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement

```bash
PORT=
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_EXPIRES=
REACT_APP_API_URL=
BCRYPT_ROUNDS=
NODE_ENV=
OFF_BASE_URL=
```

## Authentification

L’application utilise :

**JWT (JSON Web Tokens)**
Un middleware auth() pour sécuriser les routes sensibles

**Important** :
Consulter les consommations = accès libre
Ajouter une consommation = connexion obligatoire
Accéder au dashboard = connexion en tant que **Amed**

## Fonctionnement clé de l’application

**Authentification**
Tout utilisateur peut se créer un compte (nom d'utilisateur + email + mot de passe)
Tout utilisateur peut se connecter une fois le compte créé (email + mot de passe)

**Consommations publiques**
Toute personne peut consulter :

- Les consommations du jour
- Les récapitulatifs
- Les classements

**Ajout de consommation**
Réservé aux utilisateurs connectés
L'utilisateur connecté peut chercher un produit dans la modale prévue

**OpenFoodFacts**
ParAmedic utilise l'API OpenFoodFacts pour récupérer les informations d'un produit

**Récapitulatifs**
Tout utilisateur peut consulter les consommations d'Amed sur :

- Les 3 derniers jours
- La semaine
- Le mois en cours

**Dashboard**
Accessible uniquement par Amed ou un role Admin
Permet de télécharger des rapports pour une période personnalisée

**Alertes**
Concernent uniquement Amed
Sont envoyées lorsque celui-ci dépasse une limite conseillée

**Classements**
Visibles par tout utilisateur connecté ou non
Permettent de distinguer les meilleur.es contributeurs.rices

## Structure principale

```bash
/
│
├── backend/
│ ├── src/
│ │ ├── controllers/ → Logique de chaque route
│ │ ├── routes/ → Mapping API
│ │ ├── models/ → Schémas MongoDB
│ │ ├── middleware/ → Authentification JWT
│ │ └── utils/
│ └── ...
│
└── frontend/
├── src/
│ ├── components/
│ ├── contexts/ → AuthContext / ConsumptionContext
│ ├── pages/
│ ├── services/ → Appels API
│ └── ...
```

##

# Have Fun !

```bash
-- Benjamin Bonnevial & Adrien Verwaerde --
```
