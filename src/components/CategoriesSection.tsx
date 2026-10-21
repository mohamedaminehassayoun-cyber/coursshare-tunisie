import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';
import { CategorySlug, DocumentItem } from '../types';

interface CategoriesSectionProps {
  documents: DocumentItem[];
  activeCategory: CategorySlug | 'all';
  onSelectCategory: (category: CategorySlug) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  documents,
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const getDocCount = (slug: CategorySlug) => {
    return documents.filter((d) => d.category === slug).length;
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Architecture Pédagogique
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos Catégories de Documents
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1">
              Trouve exactement le format dont tu as besoin pour réviser vite et efficacement selon ton calendrier d'examens.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const count = getDocCount(cat.slug);
            const isSelected = activeCategory === cat.slug;

            return (
              <div
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-lg bg-white'
                }`}
              >
                <div>
                  {/* Category Icon Badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs"
                    style={{ backgroundColor: cat.bgLight, color: cat.color }}
                  >
                    {getIcon(cat.iconName)}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-xs font-semibold mt-0.5 text-slate-500">
                    {cat.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Footer Count & Link */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {count} {count > 1 ? 'documents' : 'document'}
                  </span>
                  <span 
                    className="flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: cat.color }}
                  >
                    <span>Explorer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
