-- ==============================================================================
-- PROJET : CoursShare Tunisie - TP3 Supabase
-- FICHIER : supabase-setup.sql
-- ORDRE D'EXÉCUTION : 1er script à exécuter dans SQL Editor de Supabase
-- DESCRIPTION : Création du catalogue 'products', des rôles 'user_roles',
--              contraintes, politiques de sécurité Row Level Security (RLS)
--              et données initiales adaptées aux facultés tunisiennes.
-- NOTE : Ce script est réservé à une base neuve ou réinitialisée.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES PRODUITS / POLYCOPIÉS UNIVERSITAIRES (products)
-- Les prix sont stockés sous deux formes complémentaires :
-- - price_cents (entier) : unité de calcul sécurisée (1 DT = 100 centimes, ex: 15.00 DT = 1500)
-- - price (numeric) : affichage décimal standard (15.00 DT)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Packs Révision', 'Polycopiés Cours', 'Annales & Examens Corrigés', 'Séries TD & Exercices', 'Guides & Manuels')),
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    price NUMERIC(10, 2) GENERATED ALWAYS AS (price_cents / 100.0) STORED,
    image TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    faculty_id TEXT DEFAULT 'tous',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour optimiser les filtres du catalogue
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_visible ON public.products(is_visible, is_available);
CREATE INDEX IF NOT EXISTS idx_products_faculty ON public.products(faculty_id);

-- 3. TABLE DES RÔLES UTILISATEURS (user_roles)
-- user_id référence strictement auth.users.id de Supabase Auth
-- Aucun mot de passe n'est stocké ici. L'absence de ligne ou le rôle 'client' correspond à un compte client standard.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_roles_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 4. FONCTION HELPER POUR VÉRIFIER LE RÔLE ADMIN DE FAÇON ÉTANCHE
-- SECURITY DEFINER avec search_path fixé pour empêcher les attaques de détournement de schéma
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'admin'
    );
$$;

-- 5. ROW LEVEL SECURITY (RLS) SUR LES TABLES

-- A. Active RLS sur public.products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique 1 : Visiteurs et clients peuvent lire UNIQUEMENT les produits visibles
CREATE POLICY "Les visiteurs et clients lisent les produits visibles"
ON public.products
FOR SELECT
USING (
    is_visible = true 
    OR public.is_admin()
);

-- Politique 2 : Seuls les administrateurs peuvent insérer de nouveaux produits
CREATE POLICY "Seuls les admins créent des produits"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Politique 3 : Seuls les administrateurs peuvent mettre à jour les produits
CREATE POLICY "Seuls les admins modifient des produits"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Politique 4 : Seuls les administrateurs peuvent supprimer des produits
CREATE POLICY "Seuls les admins suppriment des produits"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_admin());


-- B. Active RLS sur public.user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Politique 1 : Un utilisateur authentifié peut UNIQUEMENT lire son propre rôle
CREATE POLICY "Les utilisateurs lisent uniquement leur propre rôle"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ATTENTION : Aucune politique INSERT, UPDATE ou DELETE n'est donnée au rôle 'authenticated' ou 'anon'.
-- Cela garantit qu'aucun utilisateur depuis son navigateur ne peut s'auto-attribuer le rôle admin,
-- même s'il connaît l'API ou est déjà admin dans l'interface.
-- L'attribution admin se fait EXCLUSIVEMENT via le SQL Editor avec le script supabase-admin.sql.


-- 6. DONNÉES INITIALES (Catalogue adapté au projet CoursShare Tunisie)
-- Tous les prix sont en centimes (1500 = 15.00 DT, 7500 = 75.00 DT, etc.)
INSERT INTO public.products (id, name, category, description, price_cents, image, features, is_visible, is_available, faculty_id)
VALUES
(
    'pack-insat-mpi',
    'Pack Intégral INSAT MPI (Algo C + Analyse + Algèbre)',
    'Packs Révision',
    'Pack polycopiés imprimés et reliés avec résumés officiels, fiches de synthèse et 8 ans d''examens corrigés détaillés pour le cycle préparatoire intégré INSAT.',
    3500, -- 35.00 DT
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    '["3 tomes polycopiés reliés", "Algorithmique en C & Structures de données", "Analyse numérique & Algèbre linéaire", "8 examens corrigés pas à pas"]'::jsonb,
    true,
    true,
    'insat'
),
(
    'poly-isg-compta',
    'Polycopié Officiel ISG Tunis - Comptabilité Financière & Fiscalité L1',
    'Polycopiés Cours',
    'Cours complet et cas pratiques d''application conformes au programme du Pr. Fayçal Derbel. Idéal pour valider avec mention les examens de comptabilité générale.',
    1850, -- 18.50 DT
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    '["160 pages imprimées haute qualité", "Écritures comptables & Bilan selon normes SCF", "25 exercices progressifs résolus", "Sujets de DS types"]'::jsonb,
    true,
    true,
    'isg'
),
(
    'pack-ihec-finance',
    'Pack Annale & Corrigés IHEC Carthage - Finance d''Entreprise & Marchés',
    'Annales & Examens Corrigés',
    'Recueil officiel des sessions principales et sessions de rattrapage avec barèmes officiels et corrections rédigées sous la supervision académique.',
    2400, -- 24.00 DT
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    '["12 sessions complètes corrigées", "VAN, TRI, Choix d''investissement", "Gestion de portefeuille & Marchés obligataires", "Fiches mémo formules"]'::jsonb,
    true,
    true,
    'ihec'
),
(
    'poly-fst-physique',
    'Polycopié FST Tunis - Électromagnétisme & Optique Ondulatoire L2',
    'Polycopiés Cours',
    'Support de cours théorique avec schémas d''ondes, équations de Maxwell détaillées et séries de TD résolues pour étudiants en Sciences Fondamentales et Électronique.',
    1600, -- 16.00 DT
    'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    '["Équations de Maxwell expliquées", "Optique interférentielle et diffraction", "14 exercices de TD corrigés", "Fiches récapitulatives avant examen"]'::jsonb,
    true,
    true,
    'fst'
),
(
    'pack-fmt-anatomie',
    'Atlas & Fiches Synthèse FMT - Anatomie & Physiologie PCEM1',
    'Packs Révision',
    'Guide visuel haute définition d''anatomie humaine avec schémas en couleurs légendés, tableaux de physiologie clinique et QCM officiels corrigés de la Faculté de Médecine de Tunis.',
    4200, -- 42.00 DT
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80',
    '["Planches anatomiques quadrichromie", "Appareil cardio-vasculaire & respiratoire", "300 QCM types concours résolus", "Mémo poche pratique pour stages"]'::jsonb,
    true,
    true,
    'fmt'
),
(
    'pack-enit-genie',
    'Pack Ingénieur ENIT - Mécanique des Fluides & Résistance des Matériaux',
    'Packs Révision',
    'Dossier technique relié comportant les cours magistraux, formulaire complet de RDM et annales d''examens semestriels de l''École Nationale d''Ingénieurs de Tunis.',
    2900, -- 29.00 DT
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    '["Formulaire officiel plastifié inclus", "Dimensionnement des structures & poutres", "Navier-Stokes et écoulements incompressibles", "9 examens récents résolus"]'::jsonb,
    true,
    true,
    'enit'
),
(
    'td-fdspt-droit',
    'Série de TD & Cas Pratiques FDSPT - Droit des Obligations & Droit Constitutionnel',
    'Séries TD & Exercices',
    'Recueil de commentaires d''arrêts, dissertations juridiques modèles et cas pratiques résolus pour étudiants en Licence Droit de la Faculté de Droit et des Sciences Politiques de Tunis.',
    1450, -- 14.50 DT
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    '["Méthodologie du commentaire d''arrêt", "18 cas pratiques corrigés", "Jurisprudence tunisienne commentée", "Lexique juridique bilingue Fr-Ar"]'::jsonb,
    true,
    true,
    'fdspt'
),
(
    'pack-prestige-tbs',
    'Pack Réussite Complète Tunis Business School (TBS) - Economics & Business Analytics',
    'Packs Révision',
    'Pack intégral en langue anglaise selon le standard académique américain de TBS : Microeconomics, Macroeconomics, Business Statistics & Python for Business.',
    10500, -- 105.00 DT (Dépasse le seuil des 100 DT pour tester la livraison gratuite automatique !)
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    '["4 volumes cartonnés en Anglais", "Business Statistics & R/Python scripts", "Midterms and Final Exams solutions", "Livraison gratuite offerte incluse (Total > 100 DT)"]'::jsonb,
    true,
    true,
    'tbs'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    price_cents = EXCLUDED.price_cents,
    image = EXCLUDED.image,
    features = EXCLUDED.features,
    is_visible = EXCLUDED.is_visible,
    is_available = EXCLUDED.is_available,
    faculty_id = EXCLUDED.faculty_id,
    updated_at = timezone('utc'::text, now());
