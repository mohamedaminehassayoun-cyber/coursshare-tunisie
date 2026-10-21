import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default / fallback keys or environment variables
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const STORAGE_URL_KEY = 'coursshare_supabase_url';
const STORAGE_ANON_KEY = 'coursshare_supabase_anon_key';

export function getStoredSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_URL_KEY) || ENV_URL || '';
  const anonKey = localStorage.getItem(STORAGE_ANON_KEY) || ENV_ANON_KEY || '';
  return { url, anonKey };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_ANON_KEY);

  // Reset instance to re-create client with new credentials
  supabaseInstance = null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(
    url && 
    anonKey && 
    !url.includes('VOTRE-PROJET') && 
    !anonKey.includes('VOTRE-CLE')
  );
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey || url.includes('VOTRE-PROJET')) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}
