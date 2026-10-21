import React from 'react';
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Award, 
  ArrowRight, 
  GraduationCap, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { DOMAINS, LEVELS } from '../data/coursesData';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  onExploreClick: () => void;
  onOpenRoomClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDomain,
  setSelectedDomain,
  selectedLevel,
  setSelectedLevel,
  onExploreClick,
  onOpenRoomClick,
}) => {
  const quickSearches = [
    { label: 'INSAT (Dr. Lilia Sfaxi)', query: 'INSAT' },
    { label: 'ISG Tunis (Pr. Fayçal Derbel)', query: 'ISG' },
    { label: 'IHEC Carthage (Pr. Neila Boulila)', query: 'IHEC' },
    { label: 'FMT Médecine (Pr. Mongi Mighri)', query: 'FMT' },
    { label: 'FDSPT Droit (Pr. Farhat Horchani)', query: 'FDSPT' },
    { label: 'FST Info (Pr. Yosr Slama)', query: 'FST' },
    { label: 'ENIT RDM (Pr. Hatem Zenzri)', query: 'ENIT' },
    { label: 'IPEIT Prépa MP (Pr. Tarak Bejaoui)', query: 'IPEIT' },
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Background Subtle Geometric Pattern with Tunisian touch */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <span>🇹🇳</span>
            <span>La 1ère plateforme collaborative pour les étudiants des facultés tunisiennes</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Révise avec les meilleurs cours des <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-200">Facultés Tunisiennes</span>
          </h1>

          {/* Lead Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            INSAT, ISG, IHEC, FST, FMT, FDSPT, ESEN, IPEIT, FSEG Sfax... Tous les cours magistraux, séries de TD résolues, DS et examens de session principale et contrôle rangés par filière et semestre.
          </p>

          {/* Primary CTA to Room */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRoomClick}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Choisir ma Faculté & ma Licence 🇹🇳</span>
            </button>
            <button
              onClick={onExploreClick}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Parcourir tous les documents
            </button>
          </div>

          {/* Interactive Multi-Field Search Card */}
          <div className="pt-4 pb-2">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-2xl shadow-black/50 border border-slate-700/60 text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* Search Term */}
                <div className="md:col-span-6 relative flex items-center">
                  <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Matière, fac (INSAT, ISG...), DS, examen..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 md:bg-transparent rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-50 transition-colors"
                  />
                </div>

                {/* Domain Selector */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-200 pl-0 md:pl-2">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full py-3 px-3 bg-slate-50 md:bg-transparent rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:bg-slate-50 cursor-pointer"
                  >
                    {DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Selector & Action */}
                <div className="md:col-span-3 flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pl-0 md:pl-2">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full py-3 px-2 bg-slate-50 md:bg-transparent rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:bg-slate-50 cursor-pointer"
                  >
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={onExploreClick}
                    className="shrink-0 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-4 py-3 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                    aria-label="Rechercher"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Keyword Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-medium">Recherches populaires en Tunisie :</span>
              {quickSearches.map((qs) => (
                <button
                  key={qs.label}
                  onClick={() => {
                    setSearchQuery(qs.query);
                    onExploreClick();
                  }}
                  className="text-slate-300 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors border border-white/10 cursor-pointer"
                >
                  {qs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof & Metrics in Tunisia */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">14+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Facultés & Écoles Tunisiennes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400">35 000+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Étudiants Tunisiens</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Session Principale</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">& Examens de Contrôle</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Gratuit & Solidaire</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
