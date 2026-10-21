import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  ArrowRight,
  Database
} from 'lucide-react';
import { SupabaseShopService } from '../lib/supabaseShop';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: () => void;
  onOpenConfig: () => void;
  checkoutRedirectNotice?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  onOpenConfig,
  checkoutRedirectNotice = false
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'verification'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signedUpEmail, setSignedUpEmail] = useState('');

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isConfigured) {
      setErrorMsg('Supabase n\'est pas encore connecté. Cliquez sur "Configurer Supabase" ci-dessous pour ajouter votre URL et clé de projet.');
      return;
    }

    setLoading(true);
    try {
      await SupabaseShopService.signIn(email, password);
      onAuthSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setErrorMsg('Adresse e-mail ou mot de passe incorrect.');
      } else if (err.message?.includes('Email not confirmed')) {
        setErrorMsg('Votre adresse e-mail n\'a pas encore été confirmée. Veuillez vérifier votre boîte mail ou désactiver "Confirm email" dans Supabase pour ce TP.');
      } else {
        setErrorMsg(err.message || 'Erreur lors de la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg('Supabase n\'est pas encore configuré. Renseignez d\'abord vos identifiants de projet.');
      return;
    }

    setLoading(true);
    try {
      const data = await SupabaseShopService.signUp(email, password, firstName, lastName);
      setSignedUpEmail(email);

      // Si Supabase a déjà créé la session (pas d'obligation de confirmation email)
      if (data?.session) {
        onAuthSuccess();
        onClose();
      } else {
        // Affichage honnête de l'étape de vérification par email
        setMode('verification');
      }
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      if (err.message?.includes('User already registered')) {
        setErrorMsg('Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter.');
      } else {
        setErrorMsg(err.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {mode === 'login' && 'Connexion Étudiant'}
                {mode === 'signup' && 'Inscription Universitaire'}
                {mode === 'verification' && 'Vérification de l\'E-mail'}
              </h2>
              <p className="text-xs text-rose-100">Compte CoursShare & Commandes Supabase</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice checkout if opened because user tried to checkout */}
        {checkoutRedirectNotice && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Veuillez vous connecter pour valider votre commande de polycopiés.</span>
          </div>
        )}

        <div className="p-6">
          {/* Not Configured Notice */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Projet Supabase non configuré</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Pour activer la véritable authentification PostgreSQL, renseignez votre URL Supabase et clé Anon.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { onClose(); onOpenConfig(); }}
                className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                Configurer les clés Supabase
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'verification' && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Créer un compte
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  Adresse E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="etudiant@universite.tn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-600" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Amine"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ben Salah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  Adresse E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amine.bensalah@insat.u-carthage.tn"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  Mot de passe (6 caractères min.)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Création du compte...' : 'Créer mon compte'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* VERIFICATION HONEST NOTICE (Conforme aux exigences du TP3) */}
          {mode === 'verification' && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm">Instruction de confirmation d'e-mail</h3>
                    <p className="text-xs text-blue-800 mt-1">
                      Une demande d'inscription a été envoyée pour <strong>{signedUpEmail}</strong>.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-blue-950 space-y-2 border-t border-blue-200 pt-2.5">
                  <p className="font-semibold">Ce qui se passe maintenant (instruction honnête) :</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-800">
                    <li>Supabase transmet un e-mail de confirmation avec un lien d'activation unique.</li>
                    <li>Vérifiez votre boîte de réception (et vos courriers indésirables / Spams).</li>
                    <li>Cliquez sur le lien reçu pour valider votre compte avant de vous connecter.</li>
                  </ul>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200 text-[11px] text-slate-700">
                    💡 <strong>Astuce TP Supabase :</strong> Si vous testez en local et ne recevez pas d'email, allez dans votre console Supabase : 
                    <br />
                    <code>Authentication → Providers → Email</code> et désactivez temporairement <em>"Confirm email"</em>.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Aller à la page de connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
