import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  UploadCloud, 
  Menu, 
  X, 
  Sparkles, 
  Info, 
  HelpCircle,
  GraduationCap,
  Building2,
  ChevronRight,
  ShoppingBag,
  User,
  ShieldCheck,
  Database,
  LogIn
} from 'lucide-react';
import { CategorySlug } from '../types';
import { CATEGORIES } from '../data/coursesData';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenShareModal: () => void;
  onOpenAboutModal: () => void;
  onOpenContactModal: () => void;
  onOpenRoom: () => void;
  onSelectCategory: (category: CategorySlug | 'all') => void;
  activeCategory: CategorySlug | 'all';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Supabase TP3 additions
  user: SupabaseUser | null;
  userRole: 'admin' | 'client';
  cartCount: number;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  onOpenConfig: () => void;
  isSupabaseActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenShareModal,
  onOpenAboutModal,
  onOpenContactModal,
  onOpenRoom,
  onSelectCategory,
  activeCategory,
  searchQuery,
  setSearchQuery,
  user,
  userRole,
  cartCount,
  onOpenAuth,
  onOpenAccount,
  onOpenAdmin,
  onOpenCart,
  onOpenConfig,
  isSupabaseActive
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const displayName = user?.user_metadata?.first_name || 
    user?.user_metadata?.full_name?.split(' ')[0] || 
    user?.email?.split('@')[0] || 
    'Mon Compte';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded text-[11px] border border-red-500/30">
              🇹🇳 Étudiants de Tunisie
            </span>
            <span className="hidden sm:inline text-slate-300">
              INSAT, ISG, IHEC, FST, FMT, FDSPT, ESEN, IPEIT, FSEG Sfax... Connecté à Supabase PostgreSQL.
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Supabase Status Button */}
            <button
              onClick={onOpenConfig}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                isSupabaseActive 
                  ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40' 
                  : 'bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-500/40'
              }`}
              title="Configurer Supabase (TP3)"
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseActive ? 'Supabase Actif' : 'Relier Supabase'}</span>
            </button>

            {userRole === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 bg-amber-400 text-amber-950 px-2 py-0.5 rounded font-extrabold text-[11px] hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Espace Admin</span>
              </button>
            )}

            <button 
              onClick={onOpenAboutModal} 
              className="hidden md:inline hover:text-white transition-colors cursor-pointer"
            >
              Le projet
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
              className="group flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  Cours<span className="text-red-600">Share</span>
                  <span className="text-xs text-red-500 font-bold ml-0.5">TN</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 hidden sm:inline">
                  Facultés & Universités de Tunisie
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Fac (INSAT, ISG...), matière, TD, examen..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 placeholder:text-slate-600 rounded-lg border border-transparent focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 text-xs p-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {/* Choisir ma Fac Button */}
            <button
              onClick={onOpenRoom}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-red-600" />
              <span>Ma Faculté 🇹🇳</span>
            </button>

            {/* Boutique Polycopiés Jump */}
            <button
              onClick={() => {
                const el = document.getElementById('polycopies-shop-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              <span>Polycopiés & Packs</span>
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onBlur={() => setTimeout(() => setCategoriesDropdownOpen(false), 200)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeCategory !== 'all'
                    ? 'text-red-700 bg-red-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Catégories</span>
                <span className="text-[10px]">▾</span>
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Types de documents
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setCategoriesDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                        activeCategory === cat.slug
                          ? 'bg-red-50 text-red-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-lg text-slate-700 hover:text-red-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Mes favoris"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button (TP3) */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-slate-700 hover:text-red-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
              title="Mon Panier de Polycopiés"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Account Button (TP3) */}
            {user ? (
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{displayName}</span>
                {userRole === 'admin' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-amber-950 font-extrabold">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Connexion</span>
              </button>
            )}

            {/* Share Document Button */}
            <button
              onClick={onOpenShareModal}
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs shadow-red-600/30 transition-all cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fac (INSAT, ISG...), TD, examen..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 text-xs text-slate-900 rounded-lg border border-transparent focus:border-red-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3">
          <button
            onClick={() => {
              onOpenRoom();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 flex items-center justify-between"
          >
            <span>🇹🇳 Choisir ma Faculté & Licence</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('polycopies-shop-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              Boutique Polycopiés & Packs (TP3)
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Accéder au Panneau Admin
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="border-t border-slate-100 pt-2 flex flex-col gap-1 text-xs">
            <button
              onClick={() => { onOpenConfig(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paramètres Supabase (TP3)</span>
            </button>
            <button
              onClick={() => { onOpenAboutModal(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
            >
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <span>À propos du projet</span>
            </button>
            <button
              onClick={() => { onOpenContactModal(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>Demander un DS / Examen</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
