import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Bookmark, 
  Share2, 
  Star, 
  Calendar, 
  GraduationCap, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DocumentItem, DocumentComment } from '../types';
import { CATEGORIES } from '../data/coursesData';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  allDocuments: DocumentItem[];
  onAddComment: (docId: string, comment: Omit<DocumentComment, 'id' | 'date' | 'helpful'>) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  isFavorite,
  onToggleFavorite,
  onDownload,
  onSelectDocument,
  allDocuments,
  onAddComment,
  onShowToast,
}) => {
  if (!document) return null;

  const [activeTab, setActiveTab] = useState<'reader' | 'details' | 'reviews'>('reader');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentUni, setNewCommentUni] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const categoryInfo = CATEGORIES.find((c) => c.slug === document.category) || CATEGORIES[0];
  const pages = document.previewPages || [];
  const activePage = pages[currentPageIndex] || pages[0];

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Lien du document copié dans le presse-papier !', 'success');
    } else {
      onShowToast('Lien partagé !', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;

    setSubmittingComment(true);
    setTimeout(() => {
      onAddComment(document.id, {
        author: newCommentAuthor.trim(),
        university: newCommentUni.trim() || 'Université',
        rating: newCommentRating,
        content: newCommentText.trim(),
      });
      setNewCommentText('');
      setNewCommentAuthor('');
      setNewCommentUni('');
      setSubmittingComment(false);
      onShowToast('Ton avis a été publié avec succès ! Merci pour ton retour.', 'success');
    }, 400);
  };

  // Recommendations: documents in the same subject or domain
  const relatedDocuments = allDocuments
    .filter((d) => d.id !== document.id && (d.subject === document.subject || d.domain === document.domain))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: categoryInfo.bgLight, color: categoryInfo.color }}
              >
                {categoryInfo.name}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {document.subject} · {document.level} · {document.semester}
              </span>
              {document.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Certifié conforme
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
              {document.title}
            </h2>

            <div className="mt-1 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {document.university}
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {document.rating} ({document.reviewsCount} avis)
              </span>
              <span className="text-slate-400">
                Téléchargé {document.downloadsCount} fois
              </span>
            </div>

            {/* Supervising Professor Badge */}
            {document.supervisorProf && (
              <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span>👨‍🏫 Enseignant Référent :</span>
                <span className="font-extrabold">{document.supervisorProf.name}</span>
                <span className="text-emerald-700">({document.supervisorProf.title} · {document.supervisorProf.department})</span>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleFavorite(document.id)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Retirer des favoris' : 'Enregistrer'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-blue-600' : ''}`} />
            </button>

            {/* Share link button */}
            <button
              onClick={handleShareLink}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Copier le lien de partage"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Imprimer cette fiche"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download Main button */}
            <button
              onClick={() => onDownload(document)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger ({document.fileSize})</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex gap-2 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('reader')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Aperçu interactif & Pages</span>
              <span className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                {pages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Fiche pédagogique & Auteur</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Avis étudiants</span>
              <span className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                {document.comments.length}
              </span>
            </button>
          </div>

          {/* Reader Pagination Controls (only on reader tab) */}
          {activeTab === 'reader' && pages.length > 1 && (
            <div className="flex items-center gap-2 py-2">
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className="p-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                title="Page précédente"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold text-slate-600">
                Page {currentPageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                disabled={currentPageIndex === pages.length - 1}
                className="p-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                title="Page suivante"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1 bg-white space-y-8">
          {/* TAB 1: READER */}
          {activeTab === 'reader' && (
            <div className="space-y-6">
              {/* Document Page Canvas Container */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 md:p-10 shadow-inner">
                {/* Simulated Document Header */}
                <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {document.university} · {document.subject}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {activePage?.title || document.title}
                    </h3>
                  </div>
                  <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
                    Page {currentPageIndex + 1} de l'extrait officiel
                  </div>
                </div>

                {/* Text Content */}
                <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {activePage?.content}
                </div>

                {/* Key Points Takeaway Box */}
                {activePage?.keyPoints && activePage.keyPoints.length > 0 && (
                  <div className="mt-6 bg-blue-50/70 border border-blue-200/70 rounded-xl p-4 sm:p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Points Clés à Retenir pour l'Examen
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {activePage.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formulas Box */}
                {activePage?.formulas && activePage.formulas.length > 0 && (
                  <div className="mt-6 bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 sm:p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2.5">
                      Formules & Démonstrations Fondamentales
                    </h4>
                    <div className="space-y-2">
                      {activePage.formulas.map((formula, idx) => (
                        <div
                          key={idx}
                          className="bg-white/80 border border-amber-200/60 font-mono text-xs sm:text-sm text-amber-950 px-3 py-2 rounded-lg"
                        >
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table Data */}
                {activePage?.tableData && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                        <tr>
                          {activePage.tableData.headers.map((h, i) => (
                            <th key={i} className="p-3 border-b border-slate-200">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {activePage.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Reader Footer Navigation */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Document complet : {document.pageCount} pages disponibles au téléchargement.</span>
                  <button
                    onClick={() => onDownload(document)}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Télécharger tout le document ({document.fileSize})</span>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILS & AUTHOR */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Description du cours</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {document.description}
                  </p>
                </div>

                {/* Official Supervising Professor Profile */}
                {document.supervisorProf && (
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Validation Académique & Enseignant Référent 🇹🇳</span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {document.supervisorProf.name}
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      {document.supervisorProf.title} · {document.supervisorProf.department}
                    </div>
                    <div className="text-xs text-slate-600">
                      Établissement : <strong className="text-slate-800">{document.supervisorProf.university}</strong>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Mots-clés & Thématiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Spécifications Techniques
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Format :</span>
                      <span className="font-bold text-slate-800">{document.fileFormat}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Poids :</span>
                      <span className="font-bold text-slate-800">{document.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nombre de pages :</span>
                      <span className="font-bold text-slate-800">{document.pageCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Publication :</span>
                      <span className="font-bold text-slate-800">{document.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Author Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center">
                <img
                  src={document.author.avatar}
                  alt={document.author.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md mb-3"
                />
                <h4 className="font-extrabold text-base text-slate-900">
                  {document.author.name}
                </h4>
                <div className="text-xs font-semibold text-blue-700 mt-0.5">
                  {document.author.badge || 'Étudiant contributeur'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {document.author.university}
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {document.author.role}. Passionné(e) par la pédagogie et le partage des connaissances universitaires.
                </p>

                <div className="mt-6 pt-4 border-t border-slate-200 w-full flex items-center justify-around text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{document.downloadsCount}</div>
                    <div className="text-slate-400 text-[10px]">Téléchargements</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{document.rating} / 5</div>
                    <div className="text-slate-400 text-[10px]">Note moyenne</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS & COMMENTS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Reviews Summary */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold text-slate-900">
                    {document.rating}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Basé sur {document.reviewsCount} retours d'étudiants vérifiés
                    </div>
                  </div>
                </div>

                <div className="text-xs font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200">
                  98% des étudiants recommandent ce document pour leurs partiels
                </div>
              </div>

              {/* Add a Review Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-bold text-base text-slate-900">
                  Laisser un avis ou remercier l'auteur
                </h4>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ton prénom / pseudo *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCommentAuthor}
                        onChange={(e) => setNewCommentAuthor(e.target.value)}
                        placeholder="Ex. Alexandre P."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ton université / école
                      </label>
                      <input
                        type="text"
                        value={newCommentUni}
                        onChange={(e) => setNewCommentUni(e.target.value)}
                        placeholder="Ex. Université de Nantes"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ta note d'utilité *
                      </label>
                      <select
                        value={newCommentRating}
                        onChange={(e) => setNewCommentRating(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ 5/5 - Exceptionnel</option>
                        <option value={4}>⭐⭐⭐⭐ 4/5 - Très bon</option>
                        <option value={3}>⭐⭐⭐ 3/5 - Utile</option>
                        <option value={2}>⭐⭐ 2/5 - Moyen</option>
                        <option value={1}>⭐ 1/5 - À améliorer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ton retour / commentaire *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Comment ce document t'a aidé ? Les parties les plus utiles, astuces pour les autres..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {submittingComment ? 'Publication...' : 'Publier mon commentaire'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {document.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.author}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{comment.university}</span>
                      </div>
                      <span className="text-slate-400">{comment.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-[11px] text-slate-400">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      <span>{comment.helpful} étudiants ont trouvé cet avis utile</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Documents Section */}
          {relatedDocuments.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4">
                Documents complémentaires pour réviser cette matière
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedDocuments.map((relDoc) => (
                  <div
                    key={relDoc.id}
                    onClick={() => {
                      onSelectDocument(relDoc);
                      setCurrentPageIndex(0);
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/40 text-left group"
                  >
                    <div className="text-[11px] font-bold text-blue-700 mb-1">
                      {relDoc.subject} · {relDoc.level}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 line-clamp-2">
                      {relDoc.title}
                    </h4>
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{relDoc.pageCount} pages</span>
                      <span className="text-amber-600 font-semibold">★ {relDoc.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
