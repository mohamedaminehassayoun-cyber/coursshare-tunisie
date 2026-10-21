import React from 'react';
import { 
  X, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  BookOpen,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShareModal: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenShareModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-red-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🇹🇳</span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  À propos de CoursShare Tunisie
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                La plateforme libre et solidaire des universités et facultés tunisiennes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Mission intro */}
          <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-5">
            <h3 className="font-bold text-base text-red-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              Notre Devise : « Tes cours, notre partage - Tunisie »
            </h3>
            <p className="text-xs sm:text-sm text-slate-700">
              CoursShare TN est né d'un constat partagé par tous les étudiants en Tunisie : <strong>les cours, séries de TD et corrigés d'examens sont éparpillés</strong> sur des dizaines de groupes Facebook, drives temporaires et photocopieuses de campus.
              <br /><br />
              Nous regroupons tout au même endroit, <strong>organisé par faculté (INSAT, ISG, IHEC, FST, FMT, FDSPT, ESEN, FSEG Sfax...) et par licence</strong>, pour que chaque étudiant trouve immédiatement les annales et TD corrigés de sa promo.
            </p>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-base mb-3">
              Nos Trois Engagements pour les Étudiants Tunisiens
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-2 font-bold">
                  01
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">
                  100% Gratuit & Sans Frais
                </div>
                <p className="text-[11px] text-slate-600">
                  Aucun abonnement, aucun paiement. Le savoir partagé reste libre d'accès pour tous les étudiants de Tunisie.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 font-bold">
                  02
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">
                  Rooms par Faculté
                </div>
                <p className="text-[11px] text-slate-600">
                  Chaque établissement a sa Room dédiée : tu sélectionnes ta fac et ta licence pour voir uniquement tes matières et TD.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-bold">
                  03
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">
                  Corrigés Officiels
                </div>
                <p className="text-[11px] text-slate-600">
                  Vrais DS et examens de session principale et contrôle avec barèmes et résolutions détaillées.
                </p>
              </div>
            </div>
          </div>

          {/* Categories explained */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-base mb-2">
              Ce que tu trouves dans la Room de ta Faculté
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span><strong>Cours Magistraux (Polycopiés) :</strong> Transparents et cours complets rédigés par les professeurs tunisiens.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>DS & Examens Corrigés :</strong> Annales des années précédentes (Session Principale & Session Contrôle).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Séries de TD :</strong> Feuilles d'exercices résolues pas à pas par les majors et tuteurs de ta fac.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Résumés de Révision :</strong> Synthèses condensées pour la semaine bloquée.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            🇹🇳 Fait avec fierté pour la jeunesse et les universitaires de Tunisie.
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenShareModal();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Ajouter un cours de ma Fac
          </button>
        </div>
      </div>
    </div>
  );
};
