import React from 'react';
import { 
  Bookmark, 
  Download, 
  Eye, 
  Star, 
  FileText, 
  ShieldCheck, 
  GraduationCap,
  Calendar,
  Layers,
  Building2
} from 'lucide-react';
import { DocumentItem } from '../types';
import { CATEGORIES } from '../data/coursesData';

interface DocumentCardProps {
  document: DocumentItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isFavorite,
  onToggleFavorite,
  onSelectDocument,
  onDownload,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.slug === document.category) || CATEGORIES[0];

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Header Strip */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Category Indicator Accent */}
            <span 
              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: categoryInfo.bgLight, color: categoryInfo.color }}
            >
              {categoryInfo.shortName}
            </span>

            {/* Session Type Badge (DS / Examen / TD) */}
            {document.sessionType && (
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {document.sessionType}
              </span>
            )}

            {document.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Vérifié
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(document.id);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Enregistrer dans mes favoris'}
            aria-label="Favori"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        {/* Clean Unboxed Metadata: Subject · Level · Semester */}
        <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center flex-wrap gap-1">
          <span className="text-red-700 font-bold">{document.subject}</span>
          <span>·</span>
          <span>{document.level}</span>
          <span>·</span>
          <span>{document.semester}</span>
        </div>

        {/* Document Title */}
        <h3 
          onClick={() => onSelectDocument(document)}
          className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {document.title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {document.description}
        </p>

        {/* Faculty / University */}
        <div className="mt-3 flex items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Building2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{document.facultyName || document.university}</span>
            {document.academicYear && (
              <span className="text-slate-400 font-normal text-[11px]">({document.academicYear})</span>
            )}
          </div>
        </div>

        {/* Real Professor Supervisor Badge */}
        {document.supervisorProf && (
          <div className="mt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1.5 truncate">
            <span className="text-emerald-700">👨‍🏫 Supervisé par :</span>
            <span className="font-extrabold text-emerald-950 truncate">{document.supervisorProf.name}</span>
          </div>
        )}
      </div>

      {/* Middle Author & Metrics Section */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Contributor Student */}
        <div className="flex items-center gap-2">
          <img
            src={document.author.avatar}
            alt={document.author.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 leading-tight">
              {document.author.name}
            </span>
            <span className="text-[10px] text-slate-500 leading-tight">
              {document.author.badge || document.author.role}
            </span>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-800">{document.rating}</span>
          <span className="text-slate-400 text-[10px]">({document.reviewsCount})</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Pages & Format info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {document.pageCount} p.
          </span>
          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
            {document.fileFormat}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDocument(document)}
            className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 active:bg-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Consulter</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(document);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Télécharger le fichier"
            aria-label="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
