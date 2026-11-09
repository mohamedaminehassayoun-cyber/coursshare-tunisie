import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  ChevronsDown, 
  ChevronsUp, 
  Layers, 
  GraduationCap, 
  ShoppingBag, 
  FileText, 
  Calculator, 
  Compass,
  X
} from 'lucide-react';

interface FloatingScrollAssistantProps {
  onOpenCalculator?: () => void;
}

export const FloatingScrollAssistant: React.FC<FloatingScrollAssistantProps> = ({
  onOpenCalculator,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(100, Math.round((currentY / totalHeight) * 100)) : 0;
      
      setScrollY(currentY);
      setScrollProgress(progress);
      setIsNearBottom(progress >= 92);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // List of major landmarks on the page in order
  const getLandmarks = () => {
    const landmarkIds = [
      'faculty-hub-section',
      'catalog-section',
      'polycopies-shop-section',
      'how-it-works-section'
    ];

    const positions = landmarkIds.map(id => {
      const el = document.getElementById(id);
      return {
        id,
        top: el ? el.getBoundingClientRect().top + window.scrollY : null
      };
    }).filter(item => item.top !== null) as { id: string; top: number }[];

    return positions.sort((a, b) => a.top - b.top);
  };

  // Scroll to next section below current position
  const handleScrollDown = () => {
    const landmarks = getLandmarks();
    const currentY = window.scrollY + 80; // small offset buffer

    // Find the first landmark strictly below current view
    const nextLandmark = landmarks.find(lm => lm.top > currentY);

    if (nextLandmark) {
      window.scrollTo({
        top: nextLandmark.top - 20,
        behavior: 'smooth'
      });
    } else {
      // If past last landmark or none, scroll smoothly to the bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll directly to bottom
  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Scroll to a specific section by ID
  const handleScrollToId = (id: string) => {
    setShowQuickMenu(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside 
      aria-label="Assistant de défilement et navigation rapide"
      className="fixed right-3 sm:right-5 bottom-6 z-40 flex flex-col items-end gap-2 select-none"
    >
      {/* Quick Menu Popover */}
      {showQuickMenu && (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-3 shadow-2xl mb-1 w-56 animate-in slide-in-from-right-3 fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-red-400" />
              Navigation Rapide
            </span>
            <button 
              onClick={() => setShowQuickMenu(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => handleScrollToId('faculty-hub-section')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer text-slate-200 hover:text-white"
            >
              <GraduationCap className="w-3.5 h-3.5 text-red-400" />
              <span>Facultés & Licences</span>
            </button>

            <button
              onClick={() => handleScrollToId('catalog-section')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer text-slate-200 hover:text-white"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Cours & Examens</span>
            </button>

            <button
              onClick={() => handleScrollToId('polycopies-shop-section')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer text-slate-200 hover:text-white"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Boutique Polycopiés</span>
            </button>

            {onOpenCalculator && (
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenCalculator();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer text-slate-200 hover:text-white"
              >
                <Calculator className="w-3.5 h-3.5 text-rose-400" />
                <span>Calculateur LMD 🇹🇳</span>
              </button>
            )}

            <button
              onClick={() => handleScrollToId('how-it-works-section')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer text-slate-200 hover:text-white"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Comment ça marche</span>
            </button>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={handleScrollToTop}
                className="hover:text-white cursor-pointer flex items-center gap-1"
              >
                <ChevronsUp className="w-3 h-3" />
                <span>Tout en haut</span>
              </button>
              <button
                onClick={handleScrollToBottom}
                className="hover:text-white cursor-pointer flex items-center gap-1"
              >
                <ChevronsDown className="w-3 h-3" />
                <span>Tout en bas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button Cluster */}
      <div className="flex flex-col items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/40">
        {/* Scroll To Top Button (Shows when scrolled down > 200px) */}
        {scrollY > 200 && (
          <button
            onClick={handleScrollToTop}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm group"
            title="Remonter tout en haut (Habbat el page)"
            aria-label="Remonter en haut"
          >
            <ArrowUp className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Quick Landmarks Menu Toggle */}
        <button
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            showQuickMenu 
              ? 'bg-red-600 text-white' 
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Menu de navigation rapide entre les sections"
          aria-label="Navigation rapide"
        >
          <span className="text-[10px] font-black">{scrollProgress}%</span>
          <span className="text-[8px] font-medium opacity-70">Pos.</span>
        </button>

        {/* Primary Scroll Down Button (T3awen bech tehbet louta) */}
        {!isNearBottom ? (
          <button
            onClick={handleScrollDown}
            className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-red-600/30 transition-all cursor-pointer group"
            title="Descendre à la section suivante (Habetni louta)"
            aria-label="Descendre d'une section"
          >
            <ArrowDown className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" />
            <span className="sr-only">Descendre</span>
          </button>
        ) : (
          <button
            onClick={handleScrollToTop}
            className="w-11 h-11 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer group"
            title="Vous êtes en bas ! Cliquer pour remonter au début"
            aria-label="Remonter au début"
          >
            <ChevronsUp className="w-5 h-5 text-red-400 group-hover:-translate-y-0.5 transition-transform" />
            <span className="sr-only">Remonter</span>
          </button>
        )}
      </div>
    </aside>
  );
};
