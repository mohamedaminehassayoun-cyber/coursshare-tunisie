import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FacultySelectorRoom } from './components/FacultySelectorRoom';
import { DedicatedFacultyPortal } from './components/DedicatedFacultyPortal';
import { CategoriesSection } from './components/CategoriesSection';
import { DocumentCatalog } from './components/DocumentCatalog';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { ShareDocumentModal } from './components/ShareDocumentModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ToastNotification, ToastData } from './components/ToastNotification';
import { INITIAL_DOCUMENTS, TUNISIAN_FACULTIES } from './data/coursesData';
import { CategorySlug, DocumentItem, DocumentComment, FacultyInfo, LicenseField } from './types';

// Supabase TP3 imports
import { getSupabase, isSupabaseConfigured } from './lib/supabaseClient';
import { 
  DbProduct, 
  CartItem, 
  DEFAULT_SAMPLE_PRODUCTS, 
  SupabaseShopService 
} from './lib/supabaseShop';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPortal } from './components/AdminPortal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ProductsCatalogSection } from './components/ProductsCatalogSection';

export default function App() {
  // Load initial documents and merge with localStorage if any
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const savedDocs = localStorage.getItem('coursshare_tn_documents');
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userDocs = parsed.filter((d: DocumentItem) => d.id.startsWith('tn-user-'));
          return [...userDocs, ...INITIAL_DOCUMENTS];
        }
      }
    } catch (e) {
      console.error('Error loading documents from localStorage', e);
    }
    return INITIAL_DOCUMENTS;
  });

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const savedFavs = localStorage.getItem('coursshare_tn_favorites');
      if (savedFavs) {
        return JSON.parse(savedFavs);
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return ['doc-insat-algo-01', 'doc-isg-compta-01', 'doc-ihec-audit-01'];
  });

  // =========================================================================
  // SUPABASE TP3 STATE & AUTHENTICATION
  // =========================================================================
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'client'>('client');
  const [supabaseActive, setSupabaseActive] = useState<boolean>(isSupabaseConfigured());

  // Shop Catalogue from Supabase
  const [products, setProducts] = useState<DbProduct[]>(DEFAULT_SAMPLE_PRODUCTS);

  // Cart State persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('coursshare_tn_cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [
      { product: DEFAULT_SAMPLE_PRODUCTS[0], quantity: 1 } // Sample pre-loaded pack to discover cart immediately
    ];
  });

  // Modals for TP3
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [authCheckoutNotice, setAuthCheckoutNotice] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Active Faculty: null means on Main Hub; FacultyInfo means inside dedicated faculty portal
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyInfo | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<LicenseField | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('Tous les semestres');

  // Filter states for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState('Tous les domaines');
  const [selectedLevel, setSelectedLevel] = useState('Tous les niveaux');

  // Standard Modal states
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('coursshare_tn_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Persist documents
  useEffect(() => {
    try {
      localStorage.setItem('coursshare_tn_documents', JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [documents]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('coursshare_tn_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Check Supabase session & user role on mount and on auth state change
  useEffect(() => {
    const supabase = getSupabase();
    setSupabaseActive(isSupabaseConfigured());

    if (!supabase) return;

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        SupabaseShopService.getUserRole(user.id).then((role) => {
          setUserRole(role);
        });
      } else {
        setUserRole('client');
      }
    });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        SupabaseShopService.getUserRole(user.id).then((role) => {
          setUserRole(role);
        });
      } else {
        setUserRole('client');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load products from Supabase
  const refreshProducts = async () => {
    try {
      const loaded = await SupabaseShopService.fetchProducts();
      setProducts(loaded);
    } catch (e) {
      console.warn('Using default products', e);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [supabaseActive]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- CART HANDLERS ---
  const handleAddToCart = (product: DbProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(`Quantité augmentée pour « ${product.name.slice(0, 30)}... » (+1)`, 'info');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showToast(`« ${product.name.slice(0, 30)}... » ajouté au panier ! 🛍️`, 'success');
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Article retiré du panier', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- AUTH HANDLERS ---
  const handleSignOut = async () => {
    await SupabaseShopService.signOut();
    setCurrentUser(null);
    setUserRole('client');
    setAccountModalOpen(false);
    setAdminPortalOpen(false);
    showToast('Vous avez été déconnecté avec succès.', 'info');
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Document retiré de vos favoris', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Document ajouté à vos favoris ! ⭐', 'success');
        return [...prev, id];
      }
    });
  };

  const handleSelectFacultyFromHub = (fac: FacultyInfo) => {
    setSelectedFaculty(fac);
    setSelectedLicense(fac.licenses[0] || null);
    setSelectedSemester('Tous les semestres');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Bienvenue dans le Campus Dédié de ${fac.shortName} ! 🇹🇳`, 'info');
  };

  const handleBackToAllFaculties = () => {
    setSelectedFaculty(null);
    setSelectedLicense(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    if (newDoc.facultyId) {
      const fac = TUNISIAN_FACULTIES.find((f) => f.id === newDoc.facultyId);
      if (fac) {
        setSelectedFaculty(fac);
        const lic = fac.licenses.find((l) => l.id === newDoc.licenseId) || fac.licenses[0];
        setSelectedLicense(lic || null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddComment = (
    docId: string,
    commentData: Omit<DocumentComment, 'id' | 'date' | 'helpful'>
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const newComment: DocumentComment = {
            id: `comm-tn-${Date.now()}`,
            ...commentData,
            date: "À l'instant",
            helpful: 0,
          };
          const updatedComments = [newComment, ...doc.comments];
          const newAvgRating = Number(
            (
              (doc.rating * doc.reviewsCount + commentData.rating) /
              (doc.reviewsCount + 1)
            ).toFixed(2)
          );

          const updatedDoc = {
            ...doc,
            comments: updatedComments,
            reviewsCount: doc.reviewsCount + 1,
            rating: newAvgRating,
          };

          if (selectedDocument?.id === docId) {
            setSelectedDocument(updatedDoc);
          }

          return updatedDoc;
        }
        return doc;
      })
    );
  };

  const handleDownload = (doc: DocumentItem) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, downloadsCount: d.downloadsCount + 1 } : d))
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}

    try {
      const content = `====================================================================\n` +
        `CoursShare Tunisie 🇹🇳 - Plateforme Académique des Facultés Tunisiennes\n` +
        `====================================================================\n\n` +
        `TITRE : ${doc.title}\n` +
        `FACULTÉ / INSTITUT : ${doc.facultyName || doc.university}\n` +
        `MATIÈRE (MODULE) : ${doc.subject}\n` +
        `TYPE D'ÉPREUVE : ${doc.sessionType || 'Document de cours'}\n` +
        `NIVEAU : ${doc.level} (${doc.semester}) - Année : ${doc.academicYear || '2025/2026'}\n` +
        `AUTEUR : ${doc.author.name} (${doc.author.role})\n` +
        `NOTE : ${doc.rating}/5 (${doc.reviewsCount} avis d'étudiants)\n\n` +
        `--------------------------------------------------------------------\n` +
        `RÉSUMÉ PÉDAGOGIQUE DU DOCUMENT\n` +
        `--------------------------------------------------------------------\n` +
        `${doc.description}\n\n` +
        `--------------------------------------------------------------------\n` +
        `EXTRAIT CONFORME AU PROGRAMME UNIVERSITAIRE TUNISIEN\n` +
        `--------------------------------------------------------------------\n` +
        doc.previewPages
          .map(
            (p) =>
              `\n[PAGE ${p.pageNumber}] ${p.title}\n\n${p.content}\n` +
              (p.keyPoints
                ? `\nPoints Clés pour le DS / Examen :\n` + p.keyPoints.map((k) => ` - ${k}`).join('\n')
                : '') +
              (p.formulas
                ? `\nFormules & Démonstrations :\n` + p.formulas.map((f) => ` * ${f}`).join('\n')
                : '')
          )
          .join('\n\n') +
        `\n\n====================================================================\n` +
        `Retrouvez toutes les séries de TD et DS corrigés de votre fac sur CoursShare TN !\n` +
        `"Tes cours, notre partage - Tunisie"\n` +
        `====================================================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CoursShare_TN_${doc.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${doc.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error', e);
    }

    showToast(`Téléchargement de « ${doc.title.slice(0, 35)}... » lancé ! 📄`, 'success');
  };

  const getDocCountForFaculty = (facultyId: string) => {
    return documents.filter(
      (d) =>
        d.facultyId === facultyId ||
        d.university.toLowerCase().includes(facultyId.toLowerCase())
    ).length;
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFacultyHub = () => {
    setSelectedFaculty(null);
    const el = document.getElementById('faculty-hub-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: CategorySlug | 'all') => {
    setActiveCategory(category);
    if (!selectedFaculty) {
      scrollToCatalog();
    }
  };

  const handleSelectDomain = (domain: string) => {
    setSelectedDomain(domain);
    if (!selectedFaculty) {
      scrollToCatalog();
    }
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans'] text-slate-900 selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setFavoritesDrawerOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        onOpenAboutModal={() => setAboutModalOpen(true)}
        onOpenContactModal={() => setContactModalOpen(true)}
        onOpenRoom={scrollToFacultyHub}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        // Supabase TP3 additions
        user={currentUser}
        userRole={userRole}
        cartCount={totalCartCount}
        onOpenAuth={() => {
          setAuthInitialMode('login');
          setAuthCheckoutNotice(false);
          setAuthModalOpen(true);
        }}
        onOpenAccount={() => setAccountModalOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenConfig={() => setConfigModalOpen(true)}
        isSupabaseActive={supabaseActive}
      />

      <main className="flex-1">
        {selectedFaculty ? (
          /* ========================================================================= */
          /* MODE 1: DEDICATED FACULTY CAMPUS PORTAL (Exclusively for Selected Faculty) */
          /* ========================================================================= */
          <DedicatedFacultyPortal
            faculty={selectedFaculty}
            onBackToAllFaculties={handleBackToAllFaculties}
            documents={documents}
            selectedLicense={selectedLicense}
            onSelectLicense={(lic) => setSelectedLicense(lic)}
            selectedSemester={selectedSemester}
            onSelectSemester={(sem) => setSelectedSemester(sem)}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onDownload={handleDownload}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onOpenShareModal={() => setShareModalOpen(true)}
          />
        ) : (
          /* ========================================================================= */
          /* MODE 2: MAIN TUNISIAN UNIVERSITY HUB & COMPLETE CATALOG                   */
          /* ========================================================================= */
          <>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              onExploreClick={scrollToCatalog}
              onOpenRoomClick={() => {
                const el = document.getElementById('faculty-hub-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Tunisian Faculty Directory & Campus Selector */}
            <FacultySelectorRoom
              onSelectFaculty={handleSelectFacultyFromHub}
              documentCountByFaculty={getDocCountForFaculty}
              onOpenShareModal={() => setShareModalOpen(true)}
            />

            {/* 5 Distinctive Academic Categories */}
            <CategoriesSection
              documents={documents}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                scrollToCatalog();
              }}
            />

            {/* Main Document Catalog */}
            <DocumentCatalog
              documents={documents}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectDocument={(doc) => setSelectedDocument(doc)}
              onDownload={handleDownload}
              onOpenShareModal={() => setShareModalOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />

            {/* ===================================================================== */}
            {/* BOUTIQUE DES POLYCOPIÉS & PACKS UNIVERSITAIRES (TP3 SUPABASE)        */}
            {/* ===================================================================== */}
            <ProductsCatalogSection
              products={products}
              onAddToCart={handleAddToCart}
              cartCount={totalCartCount}
              onOpenCart={() => setCartDrawerOpen(true)}
            />

            {/* Workflow, Tunisian Student Testimonials & FAQ */}
            <HowItWorksSection
              onOpenShareModal={() => setShareModalOpen(true)}
              onOpenContactModal={() => setContactModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectDomain={handleSelectDomain}
        onOpenAboutModal={() => setAboutModalOpen(true)}
        onOpenContactModal={() => setContactModalOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* SUPABASE MODALS & DRAWERS (TP3)                                           */}
      {/* ========================================================================= */}

      {/* Auth Modal (Login / Signup / Verification) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthCheckoutNotice(false);
        }}
        initialMode={authInitialMode}
        checkoutRedirectNotice={authCheckoutNotice}
        onAuthSuccess={() => {
          showToast('Connexion réussie ! Bienvenue sur CoursShare TN.', 'success');
          // If user had clicked checkout before, reopen cart on checkout step
          if (authCheckoutNotice) {
            setCartDrawerOpen(true);
          }
        }}
        onOpenConfig={() => setConfigModalOpen(true)}
      />

      {/* Account Modal (Identity & 100 Orders with limits) */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={currentUser}
        userRole={userRole}
        onSignOut={handleSignOut}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
      />

      {/* Admin Portal (Orders with filter/status/concurrency & Products CRUD) */}
      <AdminPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        user={currentUser}
        userRole={userRole}
        onOpenConfig={() => setConfigModalOpen(true)}
      />

      {/* Cart Drawer & Checkout */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        user={currentUser}
        onOpenAuth={() => {
          setAuthCheckoutNotice(true);
          setAuthInitialMode('login');
          setCartDrawerOpen(false);
          setAuthModalOpen(true);
        }}
        onOrderSuccess={(ref) => {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
          showToast(`Commande ${ref} validée et enregistrée dans Supabase ! 📦`, 'success');
        }}
      />

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onConfigSaved={() => {
          setSupabaseActive(isSupabaseConfigured());
          refreshProducts();
          showToast('Configuration Supabase mise à jour ! Reconnexion...', 'info');
        }}
      />

      {/* ========================================================================= */}
      {/* STANDARD SITE MODALS                                                      */}
      {/* ========================================================================= */}

      {/* Document Detail & Reader Modal */}
      <DocumentDetailModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        isFavorite={selectedDocument ? favorites.includes(selectedDocument.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onDownload={handleDownload}
        onSelectDocument={(doc) => setSelectedDocument(doc)}
        allDocuments={documents}
        onAddComment={handleAddComment}
        onShowToast={showToast}
      />

      {/* Share / Upload Document Modal */}
      <ShareDocumentModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onAddDocument={handleAddDocument}
        onShowToast={showToast}
        defaultFacultyId={selectedFaculty?.id}
        defaultLicenseId={selectedLicense?.id}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favorites={favorites}
        documents={documents}
        onToggleFavorite={handleToggleFavorite}
        onSelectDocument={(doc) => setSelectedDocument(doc)}
        onDownload={handleDownload}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        onOpenShareModal={() => {
          setAboutModalOpen(false);
          setShareModalOpen(true);
        }}
      />

      {/* Contact & Request Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Real-time Toasts */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
