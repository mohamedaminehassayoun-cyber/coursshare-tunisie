# 🇹🇳 Guide Complet TP3 Supabase & Déploiement Vercel
## Projet : CoursShare Tunisie — Plateforme Universitaire & Polycopiés

Ce guide pas-à-pas vous accompagne pour finaliser la configuration de votre projet **Supabase**, exécuter les scripts SQL, attribuer votre rôle Administrateur et déployer l'application sur **Vercel**.

---

## Sommaire
1. [Création et configuration du projet Supabase](#1-création-et-configuration-du-projet-supabase)
2. [Récupération des clés d'API (URL & Publishable Key)](#2-récupération-des-clés-dapi)
3. [Ordre d'exécution des scripts SQL](#3-ordre-dexécution-des-scripts-sql)
4. [Configuration de l'authentification et des URLs](#4-configuration-de-lauthentification-et-des-urls)
5. [Création d'un compte étudiant et attribution du rôle Admin](#5-création-dun-compte-et-attribution-du-rôle-admin)
6. [Matrice de test des autorisations et de sécurité RLS](#6-matrice-de-test-des-autorisations)
7. [Procédure de déploiement sur Vercel](#7-procédure-de-déploiement-sur-vercel)
8. [Résolution des erreurs fréquentes](#8-résolution-des-erreurs-fréquentes)
9. [Fichiers modifiés, limites & actions manuelles restantes](#9-fichiers-modifiés-et-actions-restantes)

---

## 1. Création et configuration du projet Supabase

1. Rendez-vous sur [https://supabase.com](https://supabase.com) et connectez-vous avec votre compte GitHub ou e-mail.
2. Cliquez sur **"New project"**.
3. Remplissez les informations du projet :
   - **Organization** : Votre organisation personnelle.
   - **Name** : `coursshare-tunisie` (ou le nom de votre choix).
   - **Database Password** : Définissez un mot de passe fort et **conservez-le précieusement**.
   - **Region** : Choisissez **EU Central (Frankfurt)** ou **EU West (London)** pour une latence minimale depuis la Tunisie.
4. Cliquez sur **"Create new project"** et patientez 1 à 2 minutes pendant que Supabase initialise votre instance PostgreSQL.

---

## 2. Récupération des clés d'API

Une fois le projet prêt :
1. Dans le menu de gauche, cliquez sur l'icône **Project Settings** (icône d'engrenage en bas).
2. Rendez-vous dans **API**.
3. Repérez les deux valeurs fondamentales :
   - **Project URL** : format `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **Project API keys** : copiez la clé **`anon` / `public`** (NE JAMAIS copier `service_role` dans l'application front-end).
4. **Dans l'application CoursShare :**
   - Cliquez sur le bouton **"Relier Supabase"** ou **"⚙️ Paramètres Supabase"** dans la barre de navigation.
   - Collez votre **Project URL** et votre **Publishable Key (anon)**.
   - Cliquez sur **"Sauvegarder et Connecter"**. L'application se reconnectera automatiquement.

---

## 3. Ordre d'exécution des scripts SQL

Allez dans votre tableau de bord Supabase, puis ouvrez l'onglet **SQL Editor** (icône de console `>_`).

### Étape 3.1 : Exécuter `supabase-setup.sql` (1er script)
1. Ouvrez le fichier `supabase-setup.sql` situé à la racine de votre projet.
2. Copiez l'intégralité du contenu et collez-le dans le **SQL Editor** de Supabase.
3. Cliquez sur **"Run"** (ou Ctrl+Entrée).
4. **Ce que ce script accomplit :**
   - Crée la table `public.products` avec types de prix entiers sécurisés (`price_cents`) et prix décimal calculé (`price NUMERIC(10,2)`).
   - Crée la table `public.user_roles` liée strictement à `auth.users.id`.
   - Active **Row Level Security (RLS)** sur `products` et `user_roles`.
   - Applique la politique stricte : *aucun utilisateur navigateur ne peut modifier `user_roles`*.
   - Insère les 8 polycopiés et packs officiels des facultés tunisiennes (INSAT, ISG, IHEC, FST, FMT, ENIT, FDSPT, TBS).

### Étape 3.2 : Exécuter `supabase-orders.sql` (2ème script)
1. Ouvrez le fichier `supabase-orders.sql`.
2. Copiez l'intégralité du contenu, collez-le dans un nouvel onglet du **SQL Editor** de Supabase et cliquez sur **"Run"**.
3. **Ce que ce script accomplit :**
   - Crée la table `public.orders` avec champ d'idempotence `attempt_id`.
   - Active **Row Level Security (RLS)** sur `orders` (clients lisent uniquement leurs commandes, admins lisent tout).
   - Crée la fonction sécurisée `create_demo_order` (`SECURITY DEFINER`, `search_path = ''`).
   - Calcule les montants côté serveur (anti-fraude), applique la règle de livraison (7 DT, offerte dès 100 DT), vérifie l'idempotence et prévient les doublons lors des re-clics ou coupures réseau.
   - Révoque l'accès aux utilisateurs anonymes et autorise uniquement le rôle `authenticated`.

---

## 4. Configuration de l'authentification et des URLs

Dans le menu de gauche de Supabase :
1. Allez dans **Authentication** → **URL Configuration**.
2. **Site URL** :
   - En local : mettez `http://localhost:3000` (ou votre port local).
   - Une fois déployé sur Vercel : mettez votre URL de production `https://votre-projet.vercel.app`.
3. **Redirect URLs** :
   - Ajoutez :
     - `http://localhost:3000/**`
     - `http://localhost:5173/**`
     - `http://localhost:8000/**`
     - `https://*.vercel.app/**`
4. **Astuce pour les tests (Confirmation d'e-mail) :**
   - Par défaut, Supabase exige de cliquer sur un lien dans un e-mail de confirmation.
   - Pour tester immédiatement sans attendre la réception d'e-mails :
     - Allez dans **Authentication** → **Providers** → cliquez sur **Email**.
     - Désactivez temporairement **"Confirm email"** puis sauvegardez.
     - Tout nouveau compte sera actif immédiatement après l'inscription !

---

## 5. Création d'un compte et attribution du rôle Admin

### Étape 5.1 : Créer votre compte dans CoursShare
1. Dans l'application, cliquez sur le bouton **"Connexion"** puis sur **"Créer un compte"**.
2. Entrez votre prénom, nom, e-mail (ex: `amine@etudiant.tn`) et votre mot de passe (6 caractères min).
3. Cliquez sur **"Créer mon compte"**.
4. Connectez-vous avec vos identifiants.

### Étape 5.2 : Récupérer votre UUID Auth
1. Allez dans votre tableau de bord Supabase : **Authentication** → **Users**.
2. Vous verrez votre compte listé dans le tableau.
3. Copiez la valeur de la colonne **User UID** (ex: `c8d2f14a-7b3e-4e92-9451-289cf048b112`).

### Étape 5.3 : Exécuter `supabase-admin.sql`
1. Ouvrez le fichier `supabase-admin.sql`.
2. Remplacez `'VOTRE-UUID'` par l'UUID que vous venez de copier.
3. Collez la requête dans le **SQL Editor** de Supabase et cliquez sur **"Run"**.
4. Retournez dans CoursShare et rafraîchissez la page :
   - Le badge doré **"Admin"** apparaît à côté de votre nom.
   - Le bouton **"Espace Admin"** s'affiche dans la barre de navigation et dans votre compte.
   - Vous avez désormais accès à la gestion des commandes et du catalogue.

---

## 6. Matrice de test des autorisations

Testez méthodiquement les 4 profils pour valider la sécurité :

| Scénario de test | Profil testé | Action effectuée | Résultat attendu et vérifié |
| :--- | :--- | :--- | :--- |
| **Test 1** | **Visiteur anonyme** | Consulter le catalogue des polycopiés | ✅ Voit les polycopiés visibles. |
| **Test 2** | **Visiteur anonyme** | Tenter d'ouvrir l'Espace Admin ou commander | 🛑 Accès bloqué avec message explicatif ; invitation à se connecter. |
| **Test 3** | **Client A connecté** | Passer une commande de polycopiés | ✅ Commande calculée en base et enregistrée atomiquement. |
| **Test 4** | **Client A connecté** | Consulter "Mon Compte" | ✅ Voit uniquement ses propres commandes. |
| **Test 5** | **Client B connecté** | Consulter "Mon Compte" | ✅ Ne voit AUCUNE commande du Client A (isolation RLS stricte). |
| **Test 6** | **Admin connecté** | Ouvrir l'Espace Admin | ✅ Accès autorisé : voit toutes les commandes, change les statuts, modifie/ajoute des produits. |
| **Test 7** | **Tous les profils** | Tenter de modifier `user_roles` depuis la console navigateur | 🛑 Rejeté par la politique RLS PostgreSQL (aucun droit d'écriture accordé au rôle authenticated). |

---

## 7. Procédure de déploiement sur Vercel

Le projet CoursShare est construit avec **Vite + React + TypeScript**. Voici les étapes exactes pour Vercel :

### Étape 7.1 : Dépôt GitHub
1. Poussez votre code sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "TP3: Intégration Supabase Auth, Commandes et Administration"
   git push origin main
   ```

### Étape 7.2 : Créer le projet sur Vercel
1. Rendez-vous sur [https://vercel.com](https://vercel.com) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **"Add New..."** → **"Project"**.
3. Importez votre dépôt GitHub.
4. **Paramètres de build (Vite React) :**
   - **Framework Preset** : `Vite` (détecté automatiquement).
   - **Root Directory** : `./` (la racine).
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. **Variables d'environnement (Environment Variables) :**
   - Ajoutez :
     - `VITE_SUPABASE_URL` = votre Project URL Supabase.
     - `VITE_SUPABASE_ANON_KEY` = votre Publishable Key anon.
6. Cliquez sur **"Deploy"**.

### Étape 7.3 : Mise à jour des Redirect URLs dans Supabase
Une fois le déploiement terminé, Vercel vous fournit une adresse HTTPS en `.vercel.app` (ex: `https://coursshare-tunisie.vercel.app`).
1. Retournez dans **Supabase** → **Authentication** → **URL Configuration**.
2. Définissez **Site URL** sur votre adresse Vercel `https://votre-projet.vercel.app`.
3. Ajoutez votre URL dans les **Redirect URLs**.
4. Testez l'inscription, la connexion, le panier et l'administration directement sur l'URL en ligne.

---

## 8. Résolution des erreurs fréquentes

* **Erreur "Invalid login credentials"** :
  - Vérifiez que l'e-mail et le mot de passe sont exacts.
  - Si l'e-mail n'a pas été confirmé, validez le lien reçu par mail ou désactivez "Confirm email" dans Supabase > Authentication > Providers > Email.
* **Erreur "new row violates row-level security policy for table user_roles"** :
  - C'est le comportement de sécurité normal voulu par le TP : aucun utilisateur ne peut insérer dans `user_roles` depuis l'application cliente. L'attribution du rôle admin doit obligatoirement se faire dans le **SQL Editor** avec `supabase-admin.sql`.
* **Erreur "create_demo_order function does not exist"** :
  - Vous n'avez pas encore exécuté `supabase-orders.sql` dans le SQL Editor. Exécutez-le pour créer la fonction RPC.
* **Erreur "Failed to fetch" ou CORS** :
  - Vérifiez que l'URL Supabase ne contient pas d'espace au début ou à la fin.
  - Vérifiez que vous avez bien utilisé la clé `anon`, et non la clé `service_role`.

---

## 9. Fichiers modifiés et actions restantes

### Fichiers créés et configurés dans le projet :
- `supabase-setup.sql` : Script initial de création des tables `products`, `user_roles`, politiques RLS et données de départ.
- `supabase-admin.sql` : Script d'attribution du rôle admin à exécuter dans SQL Editor avec son UUID.
- `supabase-orders.sql` : Script relançable de création de la table `orders`, sécurité RLS et fonction RPC `create_demo_order`.
- `supabase-client.js` & `supabase-shop.js` : Scripts d'interfaçage standard à la racine.
- `src/lib/supabaseClient.ts` : Gestionnaire de client Supabase avec support des variables d'environnement et fallback localStorage.
- `src/lib/supabaseShop.ts` : Service TypeScript complet (Auth, rôles, catalogue, commandes avec idempotence, administration).
- `src/components/AuthModal.tsx` : Modale d'authentification avec inscription, connexion et instruction honnête de vérification e-mail.
- `src/components/AccountModal.tsx` : Espace Mon Compte avec affichage des 100 dernières commandes et détails dépliables.
- `src/components/CartDrawer.tsx` : Panier avec livraison calculée (7 DT, offerte dès 100 DT), formulaire de livraison en Tunisie et passation atomique.
- `src/components/AdminPortal.tsx` : Panneau d'administration complet avec filtres de statut, modification concurrente détectée et CRUD produits.
- `src/components/ProductsCatalogSection.tsx` : Espace vitrine des polycopiés et packs universitaires.
- `src/components/SupabaseConfigModal.tsx` : Modale de saisie et de test immédiat des identifiants Supabase.

### Actions manuelles à réaliser de votre côté :
1. Créez votre projet sur [Supabase.com](https://supabase.com).
2. Exécutez `supabase-setup.sql` puis `supabase-orders.sql` dans le SQL Editor de Supabase.
3. Renseignez votre URL et clé Anon dans l'application via le bouton "Relier Supabase".
4. Créez votre compte dans l'application et exécutez `supabase-admin.sql` avec votre UUID pour devenir Admin.
5. Poussez sur GitHub et déployez sur Vercel selon l'étape 7.
