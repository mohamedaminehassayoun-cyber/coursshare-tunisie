import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  GraduationCap, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';
import { FacultyInfo } from '../types';
import { TUNISIAN_FACULTIES } from '../data/coursesData';
import { FacultyLogo } from './FacultyLogo';

interface FacultySelectorRoomProps {
  onSelectFaculty: (faculty: FacultyInfo) => void;
  selectedFaculty?: FacultyInfo | null;
  documentCountByFaculty: (facultyId: string) => number;
  onOpenShareModal?: () => void;
}

export const FacultySelectorRoom: React.FC<FacultySelectorRoomProps> = ({
  onSelectFaculty,
  selectedFaculty,
  documentCountByFaculty,
}) => {
  const [facultySearch, setFacultySearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('Toutes les régions');

  const regions = [
    'Toutes les régions',
    'Grand Tunis',
    'Sfax',
  ];

  const filteredFaculties = TUNISIAN_FACULTIES.filter((fac) => {
    // Region filter
    if (regionFilter !== 'Toutes les régions') {
      if (!fac.region.toLowerCase().includes(regionFilter.toLowerCase())) {
        return false;
      }
    }

    // Search query
    if (facultySearch.trim()) {
      const q = facultySearch.toLowerCase().trim();
      const matchName = fac.name.toLowerCase().includes(q);
      const matchShort = fac.shortName.toLowerCase().includes(q);
      const matchUni = fac.university.toLowerCase().includes(q);
      const matchLicense = fac.licenses.some(
        (l) => l.name.toLowerCase().includes(q) || l.shortCode.toLowerCase().includes(q)
      );
      const matchProf = fac.professors?.some(
        (p) => p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
      );
      return matchName || matchShort || matchUni || matchLicense || matchProf;
    }

    return true;
  });

  return (
    <section id="faculty-hub-section" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>🇹🇳</span>
            <span>Répertoire Officiel des Établissements Universitaires</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Choisis ta <span className="text-red-600">Faculté ou École</span> en Tunisie
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Logos officiels certifiés, liens institutionnels réels (.rnu.tn) et cours supervisés par les professeurs titulaires des facultés tunisiennes.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs mb-8">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              placeholder="Chercher ta fac ou ton prof (INSAT, ISG, IHEC, FST, FMT, Pr. Derbel)..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  regionFilter === reg
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of All Tunisian Faculties with logos, links, and direct portal entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculties.map((fac) => {
            const count = documentCountByFaculty(fac.id);
            const profsCount = fac.professors?.length || 0;

            return (
              <div
                key={fac.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-red-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden text-left"
              >
                {/* Top Strip with University Brand Color */}
                <div 
                  className="h-2.5 w-full transition-transform group-hover:scale-x-105" 
                  style={{ backgroundColor: fac.logoColor }}
                />

                <div className="p-6 pb-4">
                  {/* Logo, Symbol & Region */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <FacultyLogo 
                        facultyId={fac.id} 
                        size="lg" 
                        showOfficialModalOnClick={true}
                        className="group-hover:scale-105 transition-transform" 
                      />

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                            {fac.shortName}
                          </h3>
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          {fac.university}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{fac.region.split('(')[0]}</span>
                    </span>
                  </div>

                  {/* Full Name & Description */}
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                    {fac.name}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {fac.description}
                  </p>

                  {/* Verified Links & Statistics */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={fac.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-200"
                      title={`Visiter ${fac.websiteUrl}`}
                    >
                      <ExternalLink className="w-3 h-3 text-blue-600" />
                      <span>Site officiel</span>
                    </a>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users className="w-3 h-3 text-slate-400" />
                        {profsCount} profs référents
                      </span>
                    </div>
                  </div>

                  {/* Filières / Licences Badges */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Filières officielles :</span>
                      <span>Fondée en {fac.establishedYear}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.licenses.map((lic) => (
                        <span
                          key={lic.id}
                          className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {lic.shortCode}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{count > 0 ? `${count} docs certifiés` : 'Campus ouvert'}</span>
                  </span>

                  <button
                    onClick={() => onSelectFaculty(fac)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 group-hover:scale-105"
                  >
                    <span>Entrer dans le Campus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
