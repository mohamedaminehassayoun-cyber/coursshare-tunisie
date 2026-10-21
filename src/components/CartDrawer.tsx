import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Building2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { CartItem, DbProduct, ShippingAddress, SupabaseShopService } from '../lib/supabaseShop';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  user: SupabaseUser | null;
  onOpenAuth: () => void;
  onOrderSuccess: (orderReference: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuth,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedReference, setConfirmedReference] = useState<string>('');

  // Attempt ID unique pour l'idempotence
  const [attemptId, setAttemptId] = useState<string>(() => `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  // Formulaire de livraison
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    governorate: 'Tunis',
    facultyOrCampus: 'INSAT Centre Urbain Nord',
    addressLine: ''
  });

  if (!isOpen) return null;

  // Calculs financiers stricts
  const subtotalCents = items.reduce((acc, item) => acc + (item.product.price_cents * item.quantity), 0);
  const subtotalDT = subtotalCents / 100.0;
  
  // Règle officielle : 7 DT (700 cents), offerte si sous-total >= 100 DT (10000 cents)
  const isFreeShipping = subtotalCents >= 10000;
  const shippingCents = items.length === 0 ? 0 : (isFreeShipping ? 0 : 700);
  const shippingDT = shippingCents / 100.0;

  const totalCents = subtotalCents + shippingCents;
  const totalDT = totalCents / 100.0;

  // Progrès vers la livraison gratuite (seuil 100 DT)
  const centsRemainingForFree = Math.max(0, 10000 - subtotalCents);
  const dtRemainingForFree = centsRemainingForFree / 100.0;
  const progressPercent = Math.min(100, Math.round((subtotalCents / 10000) * 100));

  const handleProceedToCheckout = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setStep('checkout');
    setErrorMessage(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      onOpenAuth();
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Votre panier est vide.');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      setErrorMessage('Veuillez renseigner tous les champs obligatoires de l\'adresse de livraison.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        attemptId, // Idempotence : réutilisé si retry réseau
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: 'demo_cash_on_delivery',
        expectedTotalCents: totalCents // Vérification côté serveur pour détecter un changement de prix
      };

      const result = await SupabaseShopService.createDemoOrder(orderPayload);

      // Succès confirmé par la base de données
      setConfirmedReference(result.order_reference);
      setStep('success');

      // Le panier n'est vidé QU'APRÈS confirmation de succès de Supabase
      onClearCart();
      onOrderSuccess(result.order_reference);

      // Générer un nouvel attempt_id pour la prochaine fois
      setAttemptId(`att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    } catch (err: any) {
      console.error('Erreur commande:', err);
      // En cas d'erreur : panier préservé, formulaire réactivé, message d'erreur clair
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'enregistrement de votre commande. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  const TUNISIAN_GOVERNORATES = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Bizerte', 'Sousse', 'Monastir', 'Mahdia', 'Sfax',
    'Kairouan', 'Gabès', 'Médenine', 'Gafsa', 'Jendouba', 'Béja', 'Le Kef', 'Siliana', 'Kasserine', 'Sidi Bouzid', 'Tozeur', 'Kébili', 'Tataouine', 'Zaghouan'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {step === 'cart' && 'Mon Panier de Polycopiés'}
                {step === 'checkout' && 'Finaliser la Commande'}
                {step === 'success' && 'Commande Confirmée !'}
              </h2>
              <p className="text-xs text-rose-100">
                {step === 'cart' && `${items.length} référence(s) sélectionnée(s)`}
                {step === 'checkout' && 'Livraison partout en Tunisie'}
                {step === 'success' && 'Enregistrée dans Supabase'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {step !== 'success' && items.length > 0 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {isFreeShipping ? (
                  <strong className="text-emerald-700">Félicitations ! Livraison 100% offerte 🎉</strong>
                ) : (
                  <span>Plus que <strong className="text-red-600">{dtRemainingForFree.toFixed(2)} DT</strong> pour la livraison offerte</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-slate-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isFreeShipping ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Erreur de validation</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">Votre panier est vide</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Consultez la boutique des polycopiés et packs de révision des facultés tunisiennes pour ajouter des articles.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 hover:border-slate-300 transition-all shadow-xs"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                          {item.product.category}
                        </span>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-sm text-red-600">
                            {(item.product.price_cents / 100.0).toFixed(2)} DT
                          </span>

                          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="w-6 h-6 rounded-md hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">Compte client connecté :</p>
                <p className="text-slate-600 font-mono text-[11px]">{user?.email}</p>
                <p className="text-[10px] text-slate-600">
                  L'identifiant Auth <code className="text-slate-700 font-mono">{user?.id?.substring(0, 12)}...</code> est extrait de manière sécurisée côté base.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  Nom complet de l'étudiant / destinataire *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Amine Ben Salah"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  Numéro de téléphone tunisien (+216) *
                </label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="98 123 456 / 22 987 654"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    Gouvernorat *
                  </label>
                  <select
                    value={shippingAddress.governorate}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, governorate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs bg-white"
                  >
                    {TUNISIAN_GOVERNORATES.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-600" />
                    Faculté / Campus
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.facultyOrCampus}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, facultyOrCampus: e.target.value }))}
                    placeholder="INSAT / FST El Manar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse exacte de livraison ou foyer universitaire *
                </label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress.addressLine}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                  placeholder="Avenue du Nord, Résidence Les Étudiants B2, Tunis"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs"
                />
              </div>

              {/* DEMO PAYMENT NOTICE (Conforme au TP3 sans données bancaires) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Mode de règlement (Démonstration TP3)
                </div>
                <p className="text-emerald-800 text-[11px]">
                  <strong>Paiement à la réception en Tunisie (Espèces).</strong>
                  <br />
                  Aucune information bancaire (carte, CVV, date) n'est requise ni collectée pour ce TP universitaire.
                </p>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Commande validée avec succès !</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Votre commande a été atomiquement enregistrée dans la base de données Supabase.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Référence de commande :</span>
                  <span className="font-mono font-bold text-red-600">{confirmedReference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Statut initial :</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-blue-800 bg-blue-100 text-[10px]">
                    Nouvelle
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total :</span>
                  <span className="font-bold text-slate-900">{totalDT.toFixed(2)} DT</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                Vous pouvez suivre l'état de préparation de votre polycopié dans votre <strong>Espace Mon Compte</strong>.
              </p>

              <button
                type="button"
                onClick={() => { setStep('cart'); onClose(); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Retourner à CoursShare
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Action Button */}
        {step !== 'success' && items.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total articles :</span>
                <span className="font-semibold text-slate-900">{subtotalDT.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison en Tunisie :</span>
                <span className="font-semibold">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">OFFERTE (0.00 DT)</span>
                  ) : (
                    <span>7.00 DT</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                <span>Total de la commande :</span>
                <span className="text-red-600 text-base">{totalDT.toFixed(2)} DT</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {user ? (
                  <>
                    <span>Passer la commande</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Se connecter pour commander</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Modifier
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enregistrement sécurisé...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmer la commande ({totalDT.toFixed(2)} DT)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
