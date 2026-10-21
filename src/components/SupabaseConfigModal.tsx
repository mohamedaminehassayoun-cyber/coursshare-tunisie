import React, { useState, useEffect } from 'react';
import { X, Database, Key, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, isSupabaseConfigured } from '../lib/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setUrl(config.url.includes('VOTRE-PROJET') ? '' : config.url);
      setAnonKey(config.anonKey.includes('VOTRE-CLE') ? '' : config.anonKey);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    onConfigSaved();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    saveStoredSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Connexion Supabase (TP3)</h2>
              <p className="text-xs text-emerald-100">Configuration du projet et clés d'API sécurisées</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">
                {isConfigured ? 'Supabase est connecté et actif' : 'Supabase n\'est pas encore relié'}
              </p>
              <p className="text-slate-600">
                {isConfigured 
                  ? 'Vos requêtes d\'authentification, catalogue et commandes transitent directement par votre base PostgreSQL Supabase.'
                  : 'Renseignez ci-dessous les identifiants de votre projet Supabase (disponibles dans Project Settings > API). En attendant, le catalogue fonctionne en mode démonstration locale.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Project URL (Supabase URL)
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-mono transition-all"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Visible dans votre tableau de bord Supabase : <strong>Project Settings → API → Project URL</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                Publishable Key (Clé "anon" / public)
              </label>
              <textarea
                required
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-mono transition-all"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Utilisez la clé <strong>anon public</strong>. Ne saisissez <strong>JAMAIS</strong> la clé secrète <code className="text-red-600 font-mono">service_role</code>.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Configuration enregistrée avec succès ! Reconnexion en cours...
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                Réinitialiser la configuration
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sauvegarder et Connecter
                </button>
              </div>
            </div>
          </form>

          {/* Quick Help Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Rappels pour le TP3 :
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li>Exécutez d'abord <code>supabase-setup.sql</code> dans votre <strong>SQL Editor</strong> Supabase.</li>
              <li>Exécutez ensuite <code>supabase-orders.sql</code> pour activer les commandes et la fonction.</li>
              <li>Créez votre compte étudiant dans l'app, puis exécutez <code>supabase-admin.sql</code> avec votre UUID pour devenir Administrateur.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
