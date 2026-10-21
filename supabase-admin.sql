-- ==============================================================================
-- PROJET : CoursShare Tunisie - TP3 Supabase
-- FICHIER : supabase-admin.sql
-- ORDRE D'EXÉCUTION : À exécuter dans SQL Editor APRÈS avoir créé un compte utilisateur
-- DESCRIPTION : Attribution sécurisée du rôle 'admin' à un utilisateur existant
--              à partir de son UUID Auth Supabase.
-- NOTE : Cette opération se fait exclusivement dans SQL Editor de Supabase,
--        JAMAIS depuis le navigateur ou par l'API client.
-- ==============================================================================

-- ÉTAPE 1 :
-- Allez dans votre tableau de bord Supabase :
-- Authentication -> Users
-- Repérez la ligne correspondant à votre compte e-mail (ex: mohamedamineamine29954@gmail.com).
-- Copiez l'identifiant "User UID" (format UUID ex: a1b2c3d4-e5f6-7890-abcd-ef1234567890).

-- ÉTAPE 2 :
-- Remplacez 'VOTRE-UUID' ci-dessous par votre véritable UUID et cliquez sur "Run".

INSERT INTO public.user_roles (user_id, role)
VALUES ('VOTRE-UUID', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET 
    role = 'admin',
    created_at = timezone('utc'::text, now());

-- ÉTAPE 3 : Vérification immédiate
-- Exécutez cette requête pour confirmer que votre compte est bien administrateur :
SELECT 
    ur.id AS role_record_id,
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
