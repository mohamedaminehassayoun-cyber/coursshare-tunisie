import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Eye, 
  Download, 
  BookOpen, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { DocumentItem } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  documents: DocumentItem[];
  onToggleFavorite: (id: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  documents,
  onToggleFavorite,
  onSelectDocument,
  onDownload,
}) => {
  if (!isOpen) return null;

  const favoriteDocs = documents.filter((doc) => favorites.includes(doc.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-blue-700 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Mes Documents Favoris
              </h3>
              <p className="text-xs text-slate-500">
                {favoriteDocs.length} document{favoriteDocs.length > 1 ? 's' : ''} enregistré{favoriteDocs.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteDocs.length > 0 ? (
            favoriteDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-blue-700">
                      {doc.subject} · {doc.level}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(doc.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer mt-1 leading-snug"
                  >
                    {doc.title}
                  </h4>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{doc.university}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {doc.pageCount} pages · {doc.fileFormat}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDownload(doc)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Télécharger"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectDocument(doc);
                        onClose();
                      }}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Lire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-800">
                Aucun favori pour le moment
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Clique sur le marque-page d'un document pour l'enregistrer ici et le retrouver rapidement avant tes épreuves.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer mt-2"
              >
                Parcourir les fiches
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {favoriteDocs.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
            Tes favoris sont sauvegardés automatiquement sur ton appareil.
          </div>
        )}
      </div>
    </div>
  );
};
