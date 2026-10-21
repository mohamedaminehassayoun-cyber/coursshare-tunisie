import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap,
  Layers,
  HelpCircle,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CategorySlug, DocumentItem } from '../types';
import { CATEGORIES, DOMAINS, LEVELS, TUNISIAN_FACULTIES } from '../data/coursesData';

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (newDoc: DocumentItem) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  defaultFacultyId?: string;
  defaultLicenseId?: string;
}

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
  onShowToast,
  defaultFacultyId,
  defaultLicenseId,
}) => {
  if (!isOpen) return null;

  const [selectedFacultyId, setSelectedFacultyId] = useState(defaultFacultyId || TUNISIAN_FACULTIES[0].id);
  const currentFaculty = TUNISIAN_FACULTIES.find((f) => f.id === selectedFacultyId) || TUNISIAN_FACULTIES[0];
  
  const [selectedLicenseId, setSelectedLicenseId] = useState(defaultLicenseId || currentFaculty.licenses[0]?.id || '');
  const [sessionType, setSessionType] = useState<'DS' | 'Examen Principal' | 'Examen Contrôle' | 'Série TD' | 'Cours' | 'Mini-Projet'>('Examen Principal');
  const [academicYear, setAcademicYear] = useState('2025/2026');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategorySlug>('exercices');
  const [subject, setSubject] = useState('');
  const [domain, setDomain] = useState(DOMAINS[1]);
  const [level, setLevel] = useState(LEVELS[1]);
  const [semester, setSemester] = useState('Semestre 1');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Étudiant(e)');
  const [supervisorName, setSupervisorName] = useState('');
  const [description, setDescription] = useState('');
  const [pageCount, setPageCount] = useState(12);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>('2.4 Mo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFacultyChange = (newFacId: string) => {
    setSelectedFacultyId(newFacId);
    const fac = TUNISIAN_FACULTIES.find((f) => f.id === newFacId);
    if (fac && fac.licenses.length > 0) {
      setSelectedLicenseId(fac.licenses[0].id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} Mo`);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !authorName.trim()) {
      onShowToast('Veuillez remplir tous les champs obligatoires (*)', 'info');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const chosenFaculty = TUNISIAN_FACULTIES.find((f) => f.id === selectedFacultyId) || TUNISIAN_FACULTIES[0];
      const chosenLicense = chosenFaculty.licenses.find((l) => l.id === selectedLicenseId);

      const newDoc: DocumentItem = {
        id: `tn-user-${Date.now()}`,
        title: title.trim(),
        category,
        subject: subject.trim(),
        domain,
        level,
        semester,
        university: chosenFaculty.university,
        facultyId: chosenFaculty.id,
        facultyName: chosenFaculty.shortName,
        licenseId: chosenLicense?.id,
        sessionType,
        academicYear,
        supervisorProf: supervisorName.trim()
          ? {
              name: supervisorName.trim(),
              title: 'Enseignant / Professeur Titulaire',
              department: chosenFaculty.shortName,
              university: chosenFaculty.university,
            }
          : undefined,
        author: {
          name: authorName.trim(),
          avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
          role: authorRole.trim() || `Étudiant(e) à ${chosenFaculty.shortName}`,
          university: chosenFaculty.shortName,
          badge: 'Contributeur Tunisien Vérifié',
        },
        date: "Aujourd'hui",
        description: description.trim() || `Fichier d'apprentissage partagé pour les étudiants de ${chosenFaculty.shortName} (${chosenLicense?.name || ''}).`,
        pageCount: Number(pageCount) || 8,
        fileFormat: 'PDF',
        fileSize: fileSize || '2.0 Mo',
        rating: 5.0,
        reviewsCount: 1,
        downloadsCount: 1,
        viewsCount: 10,
        verified: true,
        tags: [chosenFaculty.shortName, subject.trim(), sessionType, level],
        previewPages: [
          {
            pageNumber: 1,
            title: `${sessionType} : ${subject.trim()} (${chosenFaculty.shortName})`,
            content: description.trim() || `Sujet et éléments de correction partagés pour la préparation des épreuves de ${subject.trim()}.\n\nCe document s'adresse en priorité aux étudiants de la filière ${chosenLicense?.name || 'LMD'} à ${chosenFaculty.name}.`,
            keyPoints: [
              'Conforme au programme officiel de l’enseignement supérieur tunisien',
              'Barème et détails des questions récurrentes en DS et examen',
              'Astuces de révision de promo',
            ],
          },
        ],
        comments: [
          {
            id: `comm-tn-${Date.now()}`,
            author: authorName.trim(),
            university: chosenFaculty.shortName,
            rating: 5,
            date: "À l'instant",
            content: 'Document ajouté à la Room de notre faculté ! Courage pour vos révisions et bonne chance pour la session principale.',
            helpful: 1,
          },
        ],
      };

      onAddDocument(newDoc);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      onShowToast(`🎉 Ya3tik el sa77a ! Ton document a été ajouté à la Room ${chosenFaculty.shortName}.`, 'success');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-red-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🇹🇳</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Partager un Cours ou Examen Tunisien
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Aide tes camarades de fac à valider leurs semestres
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* File Upload Drop Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Fichier du document (PDF, Word, etc.) *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.epub"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              {fileName ? (
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{fileName}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Taille : {fileSize} · Cliquez pour remplacer
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-800">
                    Glissez-déposez votre fichier ici, ou <span className="text-red-600 underline">parcourir</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Formats acceptés : PDF, DOCX, EPUB (Max 25 Mo)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Faculty & License Selection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-red-600" />
              <span>Établissement & Filière en Tunisie</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculté ou Institut *
                </label>
                <select
                  value={selectedFacultyId}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer font-medium"
                >
                  {TUNISIAN_FACULTIES.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.shortName} - {fac.university}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Licence / Filière *
                </label>
                <select
                  value={selectedLicenseId}
                  onChange={(e) => setSelectedLicenseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer font-medium"
                >
                  {currentFaculty.licenses.map((lic) => (
                    <option key={lic.id} value={lic.id}>
                      {lic.name} ({lic.shortCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre du document *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Examen Corrigé : Algorithmique Avancée & C - Session Principale 2025"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Session Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type d’épreuve / Nature *
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as any)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
              >
                <option value="Examen Principal">🎯 Examen - Session Principale</option>
                <option value="Examen Contrôle">🔄 Examen - Session de Contrôle (Rattrapage)</option>
                <option value="DS">📝 Devoir Surveillé (DS)</option>
                <option value="Série TD">📑 Série de TD Corrigée</option>
                <option value="Cours">📘 Cours Magistral / Polycopié</option>
                <option value="Mini-Projet">💻 Mini-Projet & TP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catégorie pédagogique *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matière exacte (Module) *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex. Algorithmique & C, Microéconomie, C.O.C, Merise..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semestre & Année Universitaire
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-2 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer bg-white"
                >
                  <option value="Semestre 1">Semestre 1</option>
                  <option value="Semestre 2">Semestre 2</option>
                  <option value="Semestre 3">Semestre 3</option>
                  <option value="Semestre 4">Semestre 4</option>
                  <option value="Annuel">Annuel</option>
                </select>

                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025/2026"
                  className="w-full px-2 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Contributor Profile */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-red-600" />
              <span>Informations sur l’auteur(e)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ton prénom / nom *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex. Mohamed Ben Ali"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ton statut / promo
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder={`Ex. Étudiant ${currentFaculty.shortName}`}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
            </div>

            {/* Supervising Professor (Optional) */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                👨‍🏫 Professeur / Enseignant référent du cours (Optionnel mais recommandé)
              </label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Ex. Pr. Sofiane Ouni, Pr. Fayçal Derbel, Dr. Lilia Sfaxi, Pr. Neila Boulila..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Permet d'associer le cours à son enseignant officiel dans le répertoire de la faculté.
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & conseils pour les étudiants de ta fac
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex. Épreuve posée par Pr. Trabelsi en janvier 2025 avec le corrigé manuscrit détaillé. Attention à l'exercice 2 sur les pointeurs..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Mise en ligne...' : 'Publier dans la Room'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
