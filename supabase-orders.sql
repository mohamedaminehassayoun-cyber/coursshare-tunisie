-- ==============================================================================
-- PROJET : CoursShare Tunisie - TP3 Supabase
-- FICHIER : supabase-orders.sql
-- ORDRE D'EXÉCUTION : 2ème script à exécuter (après supabase-setup.sql)
-- DESCRIPTION : Table des commandes 'orders', permissions, politiques RLS
--              et fonction sécurisée 'create_demo_order' avec calcul côté serveur,
--              vérification d'intégrité des prix et protection contre les doublons.
-- NOTE : Ce script est idempotent et relançable sans supprimer les commandes existantes.
-- ==============================================================================

-- 1. TABLE DES COMMANDES (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_id TEXT UNIQUE NOT NULL, -- Clé d'idempotence pour éviter les doublons sur re-clic ou retry
    items JSONB NOT NULL,            -- Instantané historique (titre, prix unitaire en centimes, quantité, total)
    shipping_address JSONB NOT NULL, -- Nom, téléphone tunisien, ville/faculté, adresse
    payment_method TEXT NOT NULL DEFAULT 'demo_cash_on_delivery',
    subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
    shipping_cents INTEGER NOT NULL CHECK (shipping_cents >= 0),
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (subtotal_cents / 100.0) STORED,
    shipping NUMERIC(10, 2) GENERATED ALWAYS AS (shipping_cents / 100.0) STORED,
    total NUMERIC(10, 2) GENERATED ALWAYS AS (total_cents / 100.0) STORED,
    status TEXT NOT NULL DEFAULT 'Nouvelle' CHECK (status IN ('Nouvelle', 'En préparation', 'Terminée', 'Annulée')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour les recherches courantes et les tris
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_attempt_id ON public.orders(attempt_id);

-- 2. ACTIVATION DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques si ré-exécution
DROP POLICY IF EXISTS "Les clients lisent leurs propres commandes" ON public.orders;
DROP POLICY IF EXISTS "Les admins lisent toutes les commandes" ON public.orders;
DROP POLICY IF EXISTS "Les admins mettent à jour le statut des commandes" ON public.orders;

-- Politique A : Un client authentifié lit UNIQUEMENT ses propres commandes (auth.uid() = user_id)
CREATE POLICY "Les clients lisent leurs propres commandes"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique B : Un administrateur peut lire TOUTES les commandes
CREATE POLICY "Les admins lisent toutes les commandes"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Politique C : Seul un administrateur peut modifier le statut d'une commande
CREATE POLICY "Les admins mettent à jour le statut des commandes"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- NOTA BENE SUR L'INSERTION :
-- Aucune politique d'INSERT direct n'est accordée aux clients.
-- L'insertion DOIT passer obligatoirement par la fonction 'create_demo_order' ci-dessous.


-- 3. FONCTION DE CRÉATION DE COMMANDE SÉCURISÉE (create_demo_order)
-- Règles strictes de sécurité :
-- - SECURITY DEFINER pour exécuter avec les privilèges de base
-- - SET search_path = '' pour bloquer les attaques de détournement de schéma
-- - auth.uid() obligatoire : tire le propriétaire directement du jeton JWT
-- - Contrôle des prix réels depuis public.products (anti-triche côté navigateur)
-- - Règle de livraison calculée en base : 7 DT (700 centimes), gratuite si sous-total >= 100 DT (10000 centimes)
-- - Contrôle d'idempotence via attempt_id : si déjà soumise, renvoie la commande existante sans dupliquer
-- - Comparaison du total attendu envoyé par le navigateur pour signaler tout changement de prix

CREATE OR REPLACE FUNCTION public.create_demo_order(
    p_attempt_id TEXT,
    p_items JSONB,
    p_shipping_address JSONB,
    p_payment_method TEXT,
    p_expected_total_cents INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_order RECORD;
    v_item JSONB;
    v_product_id TEXT;
    v_quantity INTEGER;
    v_product_record RECORD;
    v_computed_subtotal INTEGER := 0;
    v_computed_shipping INTEGER := 0;
    v_computed_total INTEGER := 0;
    v_order_reference TEXT;
    v_order_id UUID;
    v_snapshot_items JSONB := '[]'::jsonb;
    v_item_subtotal INTEGER;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    -- 1. Vérification de l'authentification de l'utilisateur
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Action non autorisée : vous devez être connecté pour passer une commande.';
    END IF;

    -- 2. Validation des paramètres obligatoires
    IF p_attempt_id IS NULL OR trim(p_attempt_id) = '' THEN
        RAISE EXCEPTION 'Paramètre attempt_id manquant pour le contrôle d''idempotence.';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Le panier est vide. Veuillez ajouter des polycopiés à votre commande.';
    END IF;

    -- 3. Protection d'idempotence : si une commande avec cet attempt_id existe déjà pour cet utilisateur, la retourner
    SELECT * INTO v_order
    FROM public.orders
    WHERE attempt_id = p_attempt_id AND user_id = v_user_id;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'is_duplicate_retry', true,
            'order_id', v_order.id,
            'order_reference', v_order.order_reference,
            'total_cents', v_order.total_cents,
            'total', v_order.total,
            'status', v_order.status,
            'created_at', v_order.created_at
        );
    END IF;

    -- 4. Parcours et validation de chaque produit dans le catalogue public.products
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_quantity := COALESCE((v_item->>'quantity')::integer, 1);

        IF v_product_id IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'Article ou quantité invalide dans le panier.';
        END IF;

        -- Récupération du produit réel depuis la table de référence
        SELECT id, name, price_cents, is_visible, is_available
        INTO v_product_record
        FROM public.products
        WHERE id = v_product_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Le polycopié avec l''identifiant % n''existe pas dans le catalogue.', v_product_id;
        END IF;

        IF NOT v_product_record.is_visible OR NOT v_product_record.is_available THEN
            RAISE EXCEPTION 'Le polycopié "%" n''est plus disponible actuellement.', v_product_record.name;
        END IF;

        v_item_subtotal := v_product_record.price_cents * v_quantity;
        v_computed_subtotal := v_computed_subtotal + v_item_subtotal;

        -- Ajout à l'instantané historique (ne changera jamais même si le catalogue change plus tard)
        v_snapshot_items := v_snapshot_items || jsonb_build_object(
            'product_id', v_product_record.id,
            'name', v_product_record.name,
            'unit_price_cents', v_product_record.price_cents,
            'unit_price', (v_product_record.price_cents / 100.0),
            'quantity', v_quantity,
            'subtotal_cents', v_item_subtotal,
            'subtotal', (v_item_subtotal / 100.0)
        );
    END LOOP;

    -- 5. Calcul de la livraison selon la règle officielle du TP
    -- 7 DT (700 centimes), offerte dès 100 DT (10000 centimes)
    IF v_computed_subtotal >= 10000 THEN
        v_computed_shipping := 0;
    ELSE
        v_computed_shipping := 700;
    END IF;

    v_computed_total := v_computed_subtotal + v_computed_shipping;

    -- 6. Contrôle de cohérence avec le total attendu par le navigateur (détection anti-fraude et décalage de prix)
    IF p_expected_total_cents IS NOT NULL AND p_expected_total_cents <> v_computed_total THEN
        RAISE EXCEPTION 'Le tarif du panier a été actualisé. Montant attendu : % DT, montant réel calculé : % DT. Veuillez vérifier votre panier.',
            (p_expected_total_cents / 100.0), (v_computed_total / 100.0);
    END IF;

    -- 7. Génération de la référence unique (ex: CS-TN-20261019-XXXX)
    v_order_reference := 'CS-TN-' || to_char(v_now, 'YYYYMMDD') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 4));

    -- 8. Insertion atomique dans public.orders
    INSERT INTO public.orders (
        order_reference,
        user_id,
        attempt_id,
        items,
        shipping_address,
        payment_method,
        subtotal_cents,
        shipping_cents,
        total_cents,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_order_reference,
        v_user_id,
        p_attempt_id,
        v_snapshot_items,
        COALESCE(p_shipping_address, '{}'::jsonb),
        COALESCE(p_payment_method, 'demo_cash_on_delivery'),
        v_computed_subtotal,
        v_computed_shipping,
        v_computed_total,
        'Nouvelle',
        v_now,
        v_now
    ) RETURNING id INTO v_order_id;

    -- 9. Renvoi de la confirmation
    RETURN jsonb_build_object(
        'success', true,
        'is_duplicate_retry', false,
        'order_id', v_order_id,
        'order_reference', v_order_reference,
        'subtotal_cents', v_computed_subtotal,
        'shipping_cents', v_computed_shipping,
        'total_cents', v_computed_total,
        'total', (v_computed_total / 100.0),
        'status', 'Nouvelle',
        'created_at', v_now
    );
END;
$$;

-- 4. DROITS D'EXÉCUTION SUR LA FONCTION
-- Révocation générale de sécurité
REVOKE ALL ON FUNCTION public.create_demo_order(TEXT, JSONB, JSONB, TEXT, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_demo_order(TEXT, JSONB, JSONB, TEXT, INTEGER) FROM anon;

-- Seuls les utilisateurs authentifiés peuvent exécuter la fonction de commande
GRANT EXECUTE ON FUNCTION public.create_demo_order(TEXT, JSONB, JSONB, TEXT, INTEGER) TO authenticated;
