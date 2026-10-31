-- ==============================================================================
-- PROJET : CoursShare Tunisie - TP3 Supabase
-- FICHIER : supabase-admin.sql
-- DESCRIPTION : Attribution sécurisée du rôle 'admin' pour mohamedamineamine29954@gmail.com
-- ==============================================================================

-- 🚀 MÉTHODE DIRECTE PAR EMAIL (LA PLUS SIMPLE - PAS BESOIN DE CHERCHER L'UUID) :
-- Copiez-collez cette requête dans Supabase SQL Editor et cliquez sur "Run" :

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'mohamedamineamine29954@gmail.com'
ON CONFLICT (user_id)
DO UPDATE SET 
    role = 'admin',
    created_at = timezone('utc'::text, now());

-- 🔎 VÉRIFICATION IMMÉDIATE DU RÔLE ADMIN :
SELECT 
    ur.id AS role_record_id,
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'mohamedamineamine29954@gmail.com';

