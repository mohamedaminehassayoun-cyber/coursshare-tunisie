import React from 'react';
import { 
  GraduationCap, 
  Heart, 
  BookOpen, 
  ShieldCheck, 
  Mail, 
  Building2 
} from 'lucide-react';
import { CATEGORIES, DOMAINS, TUNISIAN_FACULTIES } from '../data/coursesData';
import { CategorySlug } from '../types';

interface FooterProps {
  onSelectCategory: (category: CategorySlug | 'all') => void;
  onSelectDomain: (domain: string) => void;
  onOpenAboutModal: () => void;
  onOpenContactModal: () => void;
  onOpenShareModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectDomain,
  onOpenAboutModal,
  onOpenContactModal,
  onOpenShareModal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black shadow-md shadow-red-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Cours<span className="text-red-500">Share</span>
                <span className="text-xs text-red-400 font-bold ml-1">TN</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plateforme académique collaborative dédiée exclusivement aux étudiants des universités et instituts tunisiens : polycopiés de cours, séries de TD résolues, DS et examens de session principale et contrôle.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenShareModal}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Partager un cours tunisien
              </button>
              <button
                onClick={onOpenContactModal}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Demander un examen
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Types de Documents
            </h4>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Principales Facultés */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Facultés Populaires
            </h4>
            <ul className="space-y-2.5 text-xs">
              {TUNISIAN_FACULTIES.slice(0, 6).map((fac) => (
                <li key={fac.id}>
                  <button
                    onClick={() => {
                      const el = document.getElementById('faculty-hub-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    {fac.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & Ethics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              CoursShare TN
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenAboutModal}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  Manifeste & Mission
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContactModal}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  Contact & Demande d'examen
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  Bibliothèque intégrale
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 leading-normal">
                100% gratuit et collaboratif pour tous les étudiants de Tunisie.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CoursShare Tunisie. Développé pour et par les étudiants tunisiens.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>🇹🇳 Tahya Tounes · Réussite pour tous nos étudiants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
