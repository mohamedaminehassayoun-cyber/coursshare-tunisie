import React, { useState } from 'react';
import { 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Search,
  BookOpen,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { CategorySlug, DocumentItem } from '../types';
import { CATEGORIES, DOMAINS, LEVELS } from '../data/coursesData';
import { DocumentCard } from './DocumentCard';

interface DocumentCatalogProps {
  documents: DocumentItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onOpenShareModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: CategorySlug | 'all';
  setActiveCategory: (cat: CategorySlug | 'all') => void;
  selectedDomain: string;
  setSelectedDomain: (d: string) => void;
  selectedLevel: string;
  setSelectedLevel: (l: string) => void;
}

export const DocumentCatalog: React.FC<DocumentCatalogProps> = ({
  documents,
  favorites,
  onToggleFavorite,
  onSelectDocument,
  onDownload,
  onOpenShareModal,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  selectedDomain,
  setSelectedDomain,
  selectedLevel,
  setSelectedLevel,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent' | 'downloads'>('popular');

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSubject = doc.subject.toLowerCase().includes(q);
      const matchDesc = doc.description.toLowerCase().includes(q);
      const matchAuthor = doc.author.name.toLowerCase().includes(q);
      const matchUni = doc.university.toLowerCase().includes(q);
      const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchDesc && !matchAuthor && !matchUni && !matchTags) {
        return false;
      }
    }

    // Category
    if (activeCategory !== 'all' && doc.category !== activeCategory) {
      return false;
    }

    // Domain
    if (selectedDomain !== 'Tous les domaines' && doc.domain !== selectedDomain) {
      return false;
    }

    // Level
    if (selectedLevel !== 'Tous les niveaux' && doc.level !== selectedLevel) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'downloads') {
      return b.downloadsCount - a.downloadsCount;
    }
    if (sortBy === 'recent') {
      return b.id.localeCompare(a.id);
    }
    // Popular default
    return b.viewsCount - a.viewsCount;
  });

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    selectedDomain !== 'Tous les domaines' ||
    selectedLevel !== 'Tous les niveaux';

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedDomain('Tous les domaines');
    setSelectedLevel('Tous les niveaux');
    setSortBy('popular');
  };

  return (
    <section id="catalog-section" className="py-12 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 gap-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Bibliothèque Ouverte
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explorer les Documents Partagés
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Accède aux fiches de révision, cours magistraux et examens corrigés de toute la communauté universitaire.
            </p>
          </div>

          {/* View Mode & Sorter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 hidden sm:inline">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">Les plus consultés</option>
                <option value="rating">Les mieux notés (★)</option>
                <option value="downloads">Les plus téléchargés</option>
                <option value="recent">Plus récents</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-100 text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Affichage en grille"
                aria-label="Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-slate-100 text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Affichage en liste"
                aria-label="Liste"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-6 pb-6 space-y-4">
          {/* Category Pills (Zero-Pill Discipline: clean interactive tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tous les types ({documents.length})
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              const count = documents.filter((d) => d.category === cat.slug).length;

              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : cat.color }}
                  />
                  <span>{cat.name}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters (Domain & Level) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Affiner par :</span>
              </div>

              {/* Domain */}
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>

              {/* Level */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count & reset */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">
                {sortedDocuments.length} résultat{sortedDocuments.length > 1 ? 's' : ''}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Documents Grid / List */}
        {sortedDocuments.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {sortedDocuments.map((doc) => (
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
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Aucun document ne correspond à cette recherche
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nous n'avons pas encore de document avec ces critères précis. Tu peux réinitialiser les filtres ou être le premier étudiant à partager un cours !
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Voir tous les documents
              </button>
              <button
                onClick={onOpenShareModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Partager ce cours</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
