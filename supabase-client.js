/**
 * ==============================================================================
 * PROJET : CoursShare Tunisie - TP3 Supabase
 * FICHIER : supabase-client.js
 * DESCRIPTION : Initialisation unique du client Supabase v2 avec Project URL
 *              et Publishable (anon) Key.
 * NOTE DE SÉCURITÉ : Ne JAMAIS insérer ici la clé secrète service_role ni
--                     de mot de passe de base de données.
 * ==============================================================================
 */

// Valeurs de configuration Supabase (à remplacer par vos identifiants Supabase)
const SUPABASE_CONFIG = {
  // Remplacez par l'URL de votre projet Supabase (ex: https://xyzcompany.supabase.co)
  url: window.__SUPABASE_URL__ || localStorage.getItem('coursshare_supabase_url') || 'https://VOTRE-PROJET.supabase.co',
  // Remplacez par votre clé publique "anon" / "publishable"
  anonKey: window.__SUPABASE_ANON_KEY__ || localStorage.getItem('coursshare_supabase_anon_key') || 'VOTRE-CLE-PUBLIQUE-ANON'
};

// Initialisation unique du client Supabase
let supabaseClientInstance = null;

function getSupabaseClient() {
  if (!supabaseClientInstance) {
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      console.warn("[Supabase] La bibliothèque Supabase JS v2 n'est pas encore chargée dans la page.");
      return null;
    }

    supabaseClientInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    console.log('[Supabase] Client initialisé avec succès pour CoursShare Tunisie.');
  }
  return supabaseClientInstance;
}

// Exportation globale pour les scripts côté navigateur
window.getSupabaseClient = getSupabaseClient;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
