import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  MapPin, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Search,
  Filter,
  Share2,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Users,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { FacultyInfo, LicenseField, DocumentItem, CategorySlug } from '../types';
import { CATEGORIES } from '../data/coursesData';
import { DocumentCard } from './DocumentCard';
import { FacultyLogo } from './FacultyLogo';

interface DedicatedFacultyPortalProps {
  faculty: FacultyInfo;
  onBackToAllFaculties: () => void;
  documents: DocumentItem[];
  selectedLicense: LicenseField | null;
  onSelectLicense: (license: LicenseField) => void;
  selectedSemester: string;
  onSelectSemester: (semester: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onOpenShareModal: () => void;
}

export const DedicatedFacultyPortal: React.FC<DedicatedFacultyPortalProps> = ({
  faculty,
  onBackToAllFaculties,
  documents,
  selectedLicense,
  onSelectLicense,
  selectedSemester,
  onSelectSemester,
  onSelectDocument,
  onDownload,
  onToggleFavorite,
  favorites,
  onOpenShareModal,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'documents' | 'professors' | 'info'>('documents');
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [activeModule, setActiveModule] = useState<string>('Tous les modules');
  const [roomSearch, setRoomSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Current active license
  const currentLicense = selectedLicense || faculty.licenses[0];

  // Filter documents strictly belonging to this faculty
  const facultyDocs = documents.filter((doc) => {
    // Faculty match
    const matchFaculty =
      doc.facultyId === faculty.id ||
      doc.university.toLowerCase().includes(faculty.shortName.toLowerCase()) ||
      doc.university.toLowerCase().includes(faculty.name.toLowerCase());

    if (!matchFaculty) return false;

    // License filter
    if (activePortalTab === 'documents' && currentLicense && doc.licenseId && doc.licenseId !== currentLicense.id) {
      return false;
    }

    // Semester filter
    if (selectedSemester !== 'Tous les semestres' && doc.semester !== selectedSemester) {
      return false;
    }

    // Module filter
    if (activeModule !== 'Tous les modules') {
      const matchSubject =
        doc.subject.toLowerCase().includes(activeModule.toLowerCase()) ||
        doc.title.toLowerCase().includes(activeModule.toLowerCase());
      if (!matchSubject) return false;
    }

    // Category filter
    if (activeCategory !== 'all' && doc.category !== activeCategory) {
      return false;
    }

    // Search inside room
    if (roomSearch.trim()) {
      const q = roomSearch.toLowerCase().trim();
      const match =
        doc.title.toLowerCase().includes(q) ||
        doc.subject.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.author.name.toLowerCase().includes(q) ||
        (doc.supervisorProf && doc.supervisorProf.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(faculty.websiteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={onBackToAllFaculties}
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Retourner à la liste de toutes les facultés</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Universités de Tunisie</span>
            <span>&gt;</span>
            <span className="text-slate-700">{faculty.university}</span>
            <span>&gt;</span>
            <span className="text-red-600 font-bold">{faculty.shortName}</span>
          </div>
        </div>

        {/* Big Immersive Campus Banner for this Faculty ONLY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Colored accent strip */}
          <div 
            className="absolute top-0 left-0 right-0 h-3.5" 
            style={{ backgroundColor: faculty.logoColor }}
          />

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-2">
            <div className="flex items-start sm:items-center gap-5">
              {/* Official Faculty Emblème / Logo Badge */}
              <FacultyLogo facultyId={faculty.id} size="xl" className="shadow-xl ring-4 ring-slate-100" showOfficialModalOnClick={true} />

              {/* Faculty Info */}
              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                    <span>🇹🇳</span>
                    <span>Campus Officiel Dédié</span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {faculty.university}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {faculty.region}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-slate-500">
                    Fondée en {faculty.establishedYear}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {faculty.name} ({faculty.shortName})
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {faculty.description}
                </p>

                {/* Verified Official Links Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  {/* Direct Website URL */}
                  <a
                    href={faculty.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Site officiel : {faculty.websiteUrl.replace('http://', '').replace('https://', '')}</span>
                  </a>

                  {/* University Parent Portal */}
                  {faculty.portalUrl && (
                    <a
                      href={faculty.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Portail {faculty.university}</span>
                    </a>
                  )}

                  {/* Copy URL button */}
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    title="Copier le lien officiel"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                  </button>

                  <span className="text-xs text-slate-400 font-medium ml-1">
                    {faculty.studentCountEstimate}
                  </span>
                </div>

                {/* Informational Note about Tunisian RNU network */}
                <div className="pt-1 flex items-start gap-1.5 text-[11px] text-slate-400 leading-tight">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Les liens ci-dessus redirigent vers les serveurs officiels du Réseau National Universitaire (.rnu.tn).
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action: Share a doc for this faculty */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <button
                onClick={onOpenShareModal}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publier un fichier pour {faculty.shortName}</span>
              </button>
              <button
                onClick={onBackToAllFaculties}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                Changer d'établissement
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs: Documents vs Professors vs Campus Info */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActivePortalTab('documents')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activePortalTab === 'documents'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Cours & Séries ({documents.filter(d => d.facultyId === faculty.id).length})</span>
            </button>

            <button
              onClick={() => setActivePortalTab('professors')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activePortalTab === 'professors'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>👨‍🏫 Corps Enseignant & Professeurs Référents ({faculty.professors?.length || 0})</span>
            </button>

            <button
              onClick={() => setActivePortalTab('info')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activePortalTab === 'info'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>🏛️ Fiche Campus & Contacts Officiels</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DOCUMENTS & FILIÈRES */}
        {activePortalTab === 'documents' && (
          <>
            {/* Step 2: License / Department Selector for this Faculty */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <span>Filières & Licences de {faculty.shortName} :</span>
                </div>
                <div className="text-xs text-slate-500">
                  Clique sur ta filière pour filtrer automatiquement tes matières
                </div>
              </div>

              {/* License buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {faculty.licenses.map((lic) => {
                  const isSelected = currentLicense?.id === lic.id;
                  return (
                    <button
                      key={lic.id}
                      onClick={() => {
                        onSelectLicense(lic);
                        setActiveModule('Tous les modules');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 shadow-xs ring-2 ring-red-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lic.shortCode}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {lic.level}
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                        {lic.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Modules list for the selected license */}
              {currentLicense && (
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>Matières & Modules enseignés en {currentLicense.shortCode} :</span>
                    {activeModule !== 'Tous les modules' && (
                      <button
                        onClick={() => setActiveModule('Tous les modules')}
                        className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                      >
                        Réinitialiser la matière
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setActiveModule('Tous les modules')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        activeModule === 'Tous les modules'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Toutes les matières
                    </button>
                    {currentLicense.modules.map((mod) => (
                      <button
                        key={mod}
                        onClick={() => setActiveModule(mod)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          activeModule === mod
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Category & Semester Toolbar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search input inside this faculty */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    placeholder={`Chercher un cours ou examen dans ${faculty.shortName}...`}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                {/* Semester selection */}
                {currentLicense && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <button
                      onClick={() => onSelectSemester('Tous les semestres')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSemester === 'Tous les semestres'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Tous les semestres
                    </button>
                    {currentLicense.semesters.map((sem) => (
                      <button
                        key={sem}
                        onClick={() => onSelectSemester(sem)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedSemester === sem
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Pills (Cours, Examens, Séries TD, Résumés, Fiches) */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tous les formats ({facultyDocs.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const isCat = activeCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isCat
                          ? 'text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      style={{ backgroundColor: isCat ? cat.color : undefined }}
                    >
                      <span>{cat.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Results Header */}
            <div className="flex items-center justify-between px-2">
              <div className="text-sm font-extrabold text-slate-800">
                Documents disponibles pour {faculty.shortName} : <span className="text-red-600">{facultyDocs.length} fichier(s)</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Supervisés par le corps professoral officiel
              </div>
            </div>

            {/* Document Grid */}
            {facultyDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isFavorite={favorites.includes(doc.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelectDocument={onSelectDocument}
                    onDownload={onDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                  📄
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Aucun document ne correspond à ce filtre précis pour {faculty.shortName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Sois le premier étudiant à partager un cours magistral, un TD ou un examen corrigé pour cette filière !
                </p>
                <button
                  onClick={onOpenShareModal}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publier un fichier pour {currentLicense?.shortCode || faculty.shortName}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: CORPS ENSEIGNANT & PROFESSEURS RÉFÉRENTS */}
        {activePortalTab === 'professors' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-red-600">
                <ShieldCheck className="w-4 h-4" />
                <span>Corps Professoral Réel & Vérifié 🇹🇳</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Enseignants & Professeurs Référents de {faculty.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ces professeurs titulaires et maîtres-assistants dispensent les cours magistraux et conçoivent les séries de travaux dirigés et épreuves d'examens officiels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faculty.professors?.map((prof) => (
                <div 
                  key={prof.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={prof.avatar} 
                        alt={prof.name} 
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                            {prof.name}
                          </h3>
                          {prof.isDepartmentHead && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                              Chef de Département
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-red-600 mt-0.5">
                          {prof.title}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {prof.department}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                      {prof.bio}
                    </p>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Spécialité & Recherches :
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-3">
                        {prof.specialty}
                      </div>

                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Modules & Cours dispensés :
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prof.courses.map((c) => (
                          <span 
                            key={c}
                            className="text-[11px] font-semibold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-lg border border-blue-100"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Enseignant Titulaire Certifié
                    </span>
                    <button
                      onClick={() => {
                        setActivePortalTab('documents');
                        setRoomSearch(prof.name);
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Voir ses cours →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FICHE CAMPUS & CONTACTS OFFICIELS */}
        {activePortalTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <FacultyLogo facultyId={faculty.id} size="xl" showOfficialModalOnClick={true} />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Fiche d'Identité Officielle : {faculty.name}
                  </h2>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    Établissement public d'enseignement supérieur sous tutelle du MESRS Tunisie
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Université de Rattachement :
                    </div>
                    <div className="font-extrabold text-slate-800 text-base">
                      {faculty.university}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Année de Fondation :
                    </div>
                    <div className="font-extrabold text-slate-800 text-base">
                      {faculty.establishedYear}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Effectif Étudiant :
                    </div>
                    <div className="font-extrabold text-slate-800 text-base">
                      {faculty.studentCountEstimate}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      Adresse Géographique :
                    </div>
                    <div className="font-semibold text-slate-800 leading-relaxed">
                      {faculty.address || faculty.region}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      Téléphone Officiel :
                    </div>
                    <div className="font-semibold text-slate-800">
                      {faculty.phone || 'Standard universitaire'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-500" />
                      Email Institutionnel :
                    </div>
                    <div className="font-semibold text-slate-800">
                      {faculty.officialEmail || 'contact@rnu.tn'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct links footer */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={faculty.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir le site officiel ({faculty.websiteUrl})</span>
                </a>
                {faculty.portalUrl && (
                  <a
                    href={faculty.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Portail de l'Université</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
