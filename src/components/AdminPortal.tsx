import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  MapPin, 
  Phone, 
  User, 
  AlertTriangle,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
  Smartphone,
  Send,
  MessageSquare,
  PhoneCall,
  ExternalLink,
  Bell
} from 'lucide-react';
import { DbOrder, DbProduct, SupabaseShopService } from '../lib/supabaseShop';
import { NotificationService, WhatsAppConfig, DEFAULT_ADMIN_PHONE } from '../lib/notificationService';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  userRole: 'admin' | 'client';
  onOpenConfig: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  user,
  userRole,
  onOpenConfig
}) => {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'notifications'>('orders');

  // --- WHATSAPP NOTIFICATIONS STATE ---
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => NotificationService.getWhatsAppConfig());
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [whatsAppFeedback, setWhatsAppFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [ordersPage, setOrdersPage] = useState(1);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderUpdatingId, setOrderUpdatingId] = useState<string | null>(null);
  const [orderActionFeedback, setOrderActionFeedback] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null);

  // --- PRODUCTS STATE ---
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [productFormSubmitting, setProductFormSubmitting] = useState(false);
  const [productFeedback, setProductFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Packs Révision' | 'Polycopiés Cours' | 'Annales & Examens Corrigés' | 'Séries TD & Exercices' | 'Guides & Manuels'>('Packs Révision');
  const [formPriceDT, setFormPriceDT] = useState<number>(25.00);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formFacultyId, setFormFacultyId] = useState('insat');

  useEffect(() => {
    if (isOpen && userRole === 'admin') {
      loadOrders(1, statusFilter);
      loadProducts();

      // Rafraîchissement automatique toutes les 15 secondes pour les nouvelles commandes
      const interval = setInterval(() => {
        loadOrders(1, statusFilter);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isOpen, userRole, statusFilter]);

  // Chargement des commandes
  const loadOrders = async (page = 1, filter = statusFilter) => {
    setLoadingOrders(true);
    setOrderActionFeedback(null);
    try {
      const result = await SupabaseShopService.fetchAllOrdersAdmin(filter, page, 50);
      if (page === 1) {
        setOrders(result.orders);
      } else {
        setOrders(prev => [...prev, ...result.orders]);
      }
      setOrdersCount(result.count);
      setOrdersPage(page);
    } catch (err: any) {
      console.error('Erreur chargement commandes admin:', err);
      setOrderActionFeedback({
        id: 'global',
        message: err.message || 'Impossible de charger les commandes.',
        type: 'error'
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  // Chargement des produits
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await SupabaseShopService.fetchProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Erreur chargement produits admin:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!isOpen) return null;

  // Si l'utilisateur n'est pas admin, affichage pédagogique clair (requis par le TP)
  if (userRole !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Accès Réservé à l'Administration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cette page est protégée par Row Level Security (RLS). Seuls les utilisateurs disposant du rôle <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-bold">admin</code> dans la table <code className="bg-slate-100 px-1.5 py-0.5 rounded">public.user_roles</code> peuvent consulter les commandes et administrer le catalogue.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Comment devenir administrateur pour ce TP ?
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
              <li>Copiez votre identifiant Auth UUID : <code className="font-mono text-slate-800 bg-white px-1 rounded border">{user?.id || 'Veuillez vous connecter d\'abord'}</code></li>
              <li>Ouvrez le fichier <code>supabase-admin.sql</code> dans votre projet.</li>
              <li>Dans votre console Supabase, ouvrez <strong>SQL Editor</strong> et collez le script en remplaçant <code>'VOTRE-UUID'</code> par votre UUID.</li>
              <li>Exécutez la requête puis rafraîchissez cette page.</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Retourner au site
            </button>
            <button
              onClick={() => { onClose(); onOpenConfig(); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              Vérifier la connexion Supabase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIONS COMMANDES ---
  const handleUpdateStatus = async (orderId: string, newStatus: string, currentStatus: string) => {
    setOrderUpdatingId(orderId);
    setOrderActionFeedback(null);
    try {
      const updated = await SupabaseShopService.updateOrderStatus(orderId, newStatus, currentStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setOrderActionFeedback({
        id: orderId,
        message: `Statut mis à jour à "${newStatus}" avec succès !`,
        type: 'success'
      });
    } catch (err: any) {
      console.error('Erreur mise à jour statut:', err);
      setOrderActionFeedback({
        id: orderId,
        message: err.message || 'Impossible de mettre à jour le statut.',
        type: 'error'
      });
    } finally {
      setOrderUpdatingId(null);
    }
  };

  // --- ACTIONS PRODUITS ---
  const handleResetProductForm = () => {
    setEditingProductId(null);
    setFormId(`poly-${Date.now().toString(36)}`);
    setFormName('');
    setFormCategory('Packs Révision');
    setFormPriceDT(25.00);
    setFormImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
    setFormDescription('');
    setFormFeatures('Formulaire complet inclus\nExercices corrigés\nSchémas en quadrichromie');
    setFormIsVisible(true);
    setFormFacultyId('insat');
    setProductFeedback(null);
  };

  const handleEditProductClick = (product: DbProduct) => {
    setEditingProductId(product.id);
    setFormId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPriceDT(product.price || (product.price_cents / 100.0));
    setFormImage(product.image);
    setFormDescription(product.description || '');
    setFormFeatures((product.features || []).join('\n'));
    setFormIsVisible(product.is_visible);
    setFormFacultyId(product.faculty_id || 'insat');
    setProductFeedback(null);
    // Scroll to form
    const el = document.getElementById('admin-product-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormSubmitting(true);
    setProductFeedback(null);

    const priceCents = Math.round(Number(formPriceDT) * 100);
    const featuresList = formFeatures
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      if (editingProductId) {
        // Mise à jour
        const updated = await SupabaseShopService.updateProduct(editingProductId, {
          name: formName.trim(),
          category: formCategory,
          description: formDescription.trim(),
          price_cents: priceCents,
          image: formImage.trim(),
          features: featuresList,
          is_visible: formIsVisible,
          is_available: true,
          faculty_id: formFacultyId
        });
        setProducts(prev => prev.map(p => p.id === editingProductId ? updated : p));
        setProductFeedback({ message: 'Polycopié mis à jour avec succès dans Supabase !', type: 'success' });
      } else {
        // Création
        const created = await SupabaseShopService.createProduct({
          id: formId.trim() || `poly-${Date.now().toString(36)}`,
          name: formName.trim(),
          category: formCategory,
          description: formDescription.trim(),
          price_cents: priceCents,
          image: formImage.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
          features: featuresList,
          is_visible: formIsVisible,
          is_available: true,
          faculty_id: formFacultyId
        });
        setProducts(prev => [created, ...prev]);
        setProductFeedback({ message: 'Nouveau polycopié ajouté au catalogue officiel !', type: 'success' });
        handleResetProductForm();
      }
    } catch (err: any) {
      console.error('Erreur sauvegarde produit:', err);
      setProductFeedback({ message: err.message || 'Erreur lors de l\'enregistrement.', type: 'error' });
    } finally {
      setProductFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProductFormSubmitting(true);
    try {
      await SupabaseShopService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setDeleteConfirmId(null);
      setProductFeedback({ message: 'Polycopié supprimé avec succès.', type: 'success' });
      if (editingProductId === productId) {
        handleResetProductForm();
      }
    } catch (err: any) {
      console.error('Erreur suppression produit:', err);
      setProductFeedback({ message: err.message || 'Impossible de supprimer le polycopié.', type: 'error' });
    } finally {
      setProductFormSubmitting(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setWhatsAppFeedback(null);
    try {
      if (whatsAppConfig.callMeBotApiKey) {
        const res = await NotificationService.testCallMeBot(whatsAppConfig.adminPhone, whatsAppConfig.callMeBotApiKey);
        setWhatsAppFeedback(res);
      } else {
        // Direct WhatsApp opening
        const testMsg = `🇹🇳 *TEST NOTIFICATION WHATSAPP - CoursShare Tunisie*\n\n✅ Félicitations Mohamed Amine ! Votre WhatsApp (+216 29 954 034) est configuré avec succès pour recevoir chaque commande de pack en temps réel.`;
        const url = NotificationService.getWhatsAppUrl(whatsAppConfig.adminPhone, testMsg);
        window.open(url, '_blank');
        setWhatsAppFeedback({ 
          success: true, 
          message: 'WhatsApp s\'est ouvert avec le message de test pré-rempli ! Cliquez sur Envoyer pour vérifier.' 
        });
      }
      NotificationService.playOrderChime();
    } catch (err: any) {
      setWhatsAppFeedback({ success: false, message: err.message || 'Erreur lors du test WhatsApp' });
    } finally {
      setTestingWhatsApp(false);
    }
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    NotificationService.saveWhatsAppConfig(whatsAppConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Espace Administration CoursShare (TP3)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider">
                  Admin Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Gestion des commandes, alertes téléphone & catalogue</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Gestion des Commandes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                {ordersCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'products'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Catalogue des Polycopiés</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'notifications'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Alertes WhatsApp 💬</span>
              {whatsAppConfig.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              )}
            </button>
          </div>

          {activeTab === 'orders' && (
            <button
              onClick={() => loadOrders(1, statusFilter)}
              disabled={loadingOrders}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ======================================================== */}
          {/* TAB 1: GESTION DES COMMANDES (Conforme aux specs TP3) */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Filter className="w-3.5 h-3.5 text-slate-600" />
                  Filtrer par statut :
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['Tous', 'Nouvelle', 'En préparation', 'Terminée', 'Annulée'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        loadOrders(1, st);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Feedback */}
              {orderActionFeedback?.id === 'global' && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  orderActionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderActionFeedback.message}</span>
                </div>
              )}

              {/* Orders List */}
              {loadingOrders && orders.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-600 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
                  <p>Chargement des commandes depuis Supabase...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-xs">Aucune commande trouvée</p>
                  <p className="text-[11px] text-slate-600">
                    {statusFilter !== 'Tous' ? `Aucune commande avec le statut "${statusFilter}".` : 'Aucune commande enregistrée pour le moment.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const orderDate = new Date(order.created_at).toLocaleDateString('fr-TN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div 
                        key={order.id}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                      >
                        {/* Summary Row */}
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="mt-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-slate-900">
                                  {order.order_reference}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  order.status === 'Nouvelle' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  order.status === 'En préparation' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  order.status === 'Terminée' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                  'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-2">
                                <User className="w-3 h-3 text-slate-600" />
                                <strong>{order.shipping_address?.fullName || 'Client'}</strong>
                                <span>·</span>
                                <span>{order.shipping_address?.governorate}</span>
                                <span>·</span>
                                <Calendar className="w-3 h-3 text-slate-600" />
                                <span>{orderDate}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick Status Update Selector */}
                          <div className="flex items-center gap-3 self-end md:self-center">
                            <div className="text-right">
                              <span className="font-extrabold text-slate-900 text-sm block">
                                {(order.total || (order.total_cents / 100.0)).toFixed(2)} DT
                              </span>
                              <span className="text-[10px] text-slate-600">
                                {order.items?.length || 0} produit(s)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <select
                                value={order.status}
                                disabled={orderUpdatingId === order.id}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value, order.status)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 focus:border-red-500 cursor-pointer disabled:opacity-50"
                              >
                                <option value="Nouvelle">Nouvelle</option>
                                <option value="En préparation">En préparation</option>
                                <option value="Terminée">Terminée</option>
                                <option value="Annulée">Annulée</option>
                              </select>

                              {orderUpdatingId === order.id && (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Inline Feedback */}
                        {orderActionFeedback?.id === order.id && (
                          <div className={`px-4 py-2 text-xs border-t ${
                            orderActionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {orderActionFeedback.message}
                          </div>
                        )}

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 space-y-4 text-xs animate-in fade-in">
                            {/* Products Snapshot */}
                            <div>
                              <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                                Articles commandés & Prix réels validés :
                              </h5>
                              <div className="space-y-1.5 bg-white rounded-xl p-3 border border-slate-200">
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                                    <div>
                                      <p className="font-semibold text-slate-900">{item.name}</p>
                                      <p className="text-[11px] text-slate-600">
                                        Réf: {item.product_id} — Qté: <strong>{item.quantity}</strong> × {(item.unit_price || (item.unit_price_cents / 100.0)).toFixed(2)} DT
                                      </p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                      {(item.subtotal || (item.subtotal_cents / 100.0)).toFixed(2)} DT
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Financial breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1">
                                <div className="flex justify-between text-slate-600">
                                  <span>Sous-total articles :</span>
                                  <span className="font-semibold">{(order.subtotal || (order.subtotal_cents / 100.0)).toFixed(2)} DT</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                  <span>Frais de livraison :</span>
                                  <span className="font-semibold">
                                    {order.shipping_cents === 0 ? 'OFFERTE (0.00 DT)' : `${(order.shipping || (order.shipping_cents / 100.0)).toFixed(2)} DT`}
                                  </span>
                                </div>
                                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-100 pt-1">
                                  <span>Total perçu :</span>
                                  <span className="text-red-600">{(order.total || (order.total_cents / 100.0)).toFixed(2)} DT</span>
                                </div>
                              </div>

                              <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2">
                                <h6 className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-red-600" />
                                  Coordonnées de livraison & Client
                                </h6>
                                <p className="font-medium text-slate-800">{order.shipping_address?.fullName} ({order.shipping_address?.phone})</p>
                                <p className="text-slate-600">{order.shipping_address?.facultyOrCampus} - {order.shipping_address?.governorate}</p>
                                <p className="text-slate-600">{order.shipping_address?.addressLine}</p>
                                
                                {/* Boutons d'action directe mobile */}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                  <a
                                    href={`tel:${(order.shipping_address?.phone || '').replace(/[^0-9]/g, '')}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition-colors"
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                    <span>Appeler</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/216${(order.shipping_address?.phone || '').replace(/[^0-9]/g, '').replace(/^216/, '')}?text=${encodeURIComponent(`Bonjour ${order.shipping_address?.fullName || ''}, je vous contacte depuis CoursShare Tunisie concernant votre commande ${order.order_reference} pour confirmer la livraison.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>

                                <p className="text-[10px] text-slate-500 pt-1">
                                  User Auth ID: <code className="font-mono text-slate-700">{order.user_id}</code>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Load more if >= 50 */}
                  {orders.length < ordersCount && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => loadOrders(ordersPage + 1, statusFilter)}
                        disabled={loadingOrders}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {loadingOrders ? 'Chargement...' : 'Charger la suite des commandes'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: GESTION DU CATALOGUE (Conforme aux specs TP3) */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Feedback */}
              {productFeedback && (
                <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  productFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{productFeedback.message}</span>
                </div>
              )}

              {/* Form Section */}
              <div id="admin-product-form" className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-red-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      {editingProductId ? `Modifier le polycopié (${editingProductId})` : 'Ajouter un nouveau polycopié au catalogue'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetProductForm}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nouveau produit
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Identifiant unique (ID) *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={Boolean(editingProductId)}
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        placeholder="pack-insat-gl"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-mono disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Catégorie *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs bg-white"
                      >
                        <option value="Packs Révision">Packs Révision</option>
                        <option value="Polycopiés Cours">Polycopiés Cours</option>
                        <option value="Annales & Examens Corrigés">Annales & Examens Corrigés</option>
                        <option value="Séries TD & Exercices">Séries TD & Exercices</option>
                        <option value="Guides & Manuels">Guides & Manuels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prix en Dinars Tunisiens (DT) *
                      </label>
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        required
                        value={formPriceDT}
                        onChange={(e) => setFormPriceDT(parseFloat(e.target.value) || 0)}
                        placeholder="25.00"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom complet du polycopié ou pack académique *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Pack Révision Génie Logiciel & Bases de Données"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL de l'image (HTTPS publique) *
                      </label>
                      <input
                        type="url"
                        required
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Faculté de référence
                      </label>
                      <select
                        value={formFacultyId}
                        onChange={(e) => setFormFacultyId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs bg-white"
                      >
                        <option value="tous">Toutes les facultés (National)</option>
                        <option value="insat">INSAT Centre Urbain Nord</option>
                        <option value="isg">ISG Tunis Bardo</option>
                        <option value="ihec">IHEC Carthage</option>
                        <option value="fst">FST Tunis El Manar</option>
                        <option value="fmt">Faculté de Médecine de Tunis</option>
                        <option value="enit">ENIT Tunis</option>
                        <option value="fdspt">FDSPT Tunis</option>
                        <option value="fsegt">FSEGT El Manar</option>
                        <option value="esen">ESEN Manouba</option>
                        <option value="ipeit">IPEIT Montfleury</option>
                        <option value="fsegs">FSEG Sfax</option>
                        <option value="tbs">TBS Tunis Business School</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description détaillée du contenu
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Support de cours relié avec résumés, formules et annales corrigées..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Caractéristiques (1 ligne par point clé)
                    </label>
                    <textarea
                      rows={3}
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      placeholder="180 pages haute qualité&#10;Normes SCF & barèmes officiels&#10;12 examens récents résolus"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsVisible}
                        onChange={(e) => setFormIsVisible(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>Visible dans la boutique pour les étudiants</span>
                    </label>

                    <button
                      type="submit"
                      disabled={productFormSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {productFormSubmitting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {editingProductId ? 'Enregistrer les modifications' : 'Ajouter le polycopié'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Products Table List */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>Polycopiés enregistrés ({products.length})</span>
                  <button
                    onClick={loadProducts}
                    disabled={loadingProducts}
                    className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingProducts ? 'animate-spin' : ''}`} />
                    Actualiser le catalogue
                  </button>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.map((p) => {
                    const priceDT = (p.price || (p.price_cents / 100.0)).toFixed(2);
                    const isDeleting = deleteConfirmId === p.id;

                    return (
                      <div 
                        key={p.id}
                        className={`p-3.5 rounded-2xl border transition-all bg-white flex gap-3 shadow-xs ${
                          p.is_visible ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-60 bg-slate-50'
                        }`}
                      >
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                              {p.name}
                            </h5>
                            <span className="font-extrabold text-xs text-red-600 shrink-0">
                              {priceDT} DT
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {p.category}
                            </span>
                            {p.is_visible ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <Eye className="w-2.5 h-2.5" /> Visible
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <EyeOff className="w-2.5 h-2.5" /> Masqué
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-mono text-slate-600 truncate max-w-[120px]">
                              {p.id}
                            </span>

                            {isDeleting ? (
                              <div className="flex items-center gap-1.5 animate-in fade-in">
                                <span className="text-[10px] text-red-600 font-bold">Confirmer ?</span>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Oui
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                                >
                                  Non
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleEditProductClick(p)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="px-2.5 py-1 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS WHATSAPP */}
          {activeTab === 'notifications' && (
            <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(92vh-160px)]">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-base">Alertes Instantanées WhatsApp</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        WhatsApp 🇹🇳 (+216 29 954 034)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Recevez les commandes d'étudiants (packs, coordonnées, adresse, total) directement sur votre WhatsApp.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => NotificationService.playOrderChime()}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Tester le carillon"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tester le carillon 🔊</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">WhatsApp Relié (+216 29 954 034)</h4>
                    <p className="text-[11px] text-emerald-700">
                      Chaque étudiant qui commande un pack peut vous envoyer le récapitulatif complet d'un clic sur WhatsApp.
                    </p>
                  </div>
                </div>
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Comment ça marche */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>📱</span> Deux manières de recevoir vos commandes sur WhatsApp :
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                    <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">1</span>
                      Mode Direct Client (Actif par défaut ✅)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Dès qu'un étudiant valide son panier sur le site, un gros bouton vert <strong>"Envoyer sur WhatsApp"</strong> s'affiche avec le texte pré-rédigé vers votre numéro. En 1 clic, il vous transmet sa commande !
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">2</span>
                      Mode Automatique CallMeBot (Optionnel 🤖)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Si vous souhaitez que le serveur WhatsApp vous pingue automatiquement même sans action du client : envoyez <code>I allow callmebot to send me messages</code> au <strong>+34 644 59 74 34</strong> sur WhatsApp pour avoir une clé API gratuite.
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulaire de Configuration WhatsApp */}
              <form onSubmit={handleSaveWhatsApp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <label htmlFor="whatsapp-enabled" className="text-xs font-bold text-slate-900 cursor-pointer">
                      Activer les réceptions de commande sur WhatsApp
                    </label>
                    <p className="text-[11px] text-slate-600">
                      Génère le lien WhatsApp direct avec votre numéro pour tous les acheteurs.
                    </p>
                  </div>
                  <input
                    id="whatsapp-enabled"
                    type="checkbox"
                    checked={whatsAppConfig.enabled}
                    onChange={(e) => setWhatsAppConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Votre Numéro WhatsApp de réception <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={whatsAppConfig.adminPhone}
                        onChange={(e) => setWhatsAppConfig(prev => ({ ...prev, adminPhone: e.target.value }))}
                        placeholder="21629954034"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 text-xs font-mono text-slate-800 font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">Format international sans le signe + (ex: <strong>21629954034</strong> pour la Tunisie).</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Clé API CallMeBot WhatsApp <span className="text-slate-600 text-[10px] font-normal">(Optionnelle pour envoi 100% automatique)</span>
                    </label>
                    <input
                      type="text"
                      value={whatsAppConfig.callMeBotApiKey}
                      onChange={(e) => setWhatsAppConfig(prev => ({ ...prev, callMeBotApiKey: e.target.value }))}
                      placeholder="Ex: 123456 (Laissez vide pour utiliser le Mode 1 Direct)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 text-xs font-mono text-slate-800"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">Obtenue gratuitement en envoyant un message WhatsApp au bot officiel CallMeBot.</p>
                  </div>
                </div>

                {/* Feedback du test */}
                {whatsAppFeedback && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    whatsAppFeedback.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {whatsAppFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
                    <span>{whatsAppFeedback.message}</span>
                  </div>
                )}

                {savedSuccess && (
                  <div className="p-3.5 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Configuration WhatsApp sauvegardée avec succès !</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    disabled={testingWhatsApp || !whatsAppConfig.adminPhone}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MessageSquare className={`w-3.5 h-3.5 text-emerald-600 ${testingWhatsApp ? 'animate-bounce' : ''}`} />
                    <span>{testingWhatsApp ? 'Ouverture...' : 'Tester WhatsApp sur mon téléphone 📲'}</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer la configuration</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-600">
            Conforme aux exigences du <strong>TP3 Supabase</strong> : RLS strict, gestion atomique et protection contre les modifications concurrentes.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer le panneau
          </button>
        </div>
      </div>
    </div>
  );
};
