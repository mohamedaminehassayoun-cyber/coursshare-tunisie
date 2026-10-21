import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { DbOrder, SupabaseShopService } from '../lib/supabaseShop';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  userRole: 'admin' | 'client';
  onSignOut: () => void;
  onOpenAdminPortal?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  userRole,
  onSignOut,
  onOpenAdminPortal
}) => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadOrders();
    }
  }, [isOpen, user]);

  const loadOrders = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const myOrders = await SupabaseShopService.fetchMyOrders();
      setOrders(myOrders);
    } catch (err: any) {
      console.error('Erreur chargement commandes:', err);
      setFetchError(err.message || 'Impossible de récupérer vos commandes.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const fullName = user.user_metadata?.full_name || 
    `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 
    user.email?.split('@')[0] || 'Étudiant';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Nouvelle':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Nouvelle</span>;
      case 'En préparation':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">En préparation</span>;
      case 'Terminée':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Terminée</span>;
      case 'Annulée':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">Annulée</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{fullName}</h2>
                {userRole === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
                    Étudiant
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'admin' && onOpenAdminPortal && (
              <button
                onClick={() => { onClose(); onOpenAdminPortal(); }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Panneau Admin
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Admin Banner if Admin */}
          {userRole === 'admin' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
              <div className="text-xs">
                <p className="font-bold">Privilèges Administrateur actifs (TP3)</p>
                <p className="text-amber-800">Votre rôle est vérifié dans la table <code>user_roles</code> de Supabase. Vous pouvez gérer les commandes et le catalogue.</p>
              </div>
              {onOpenAdminPortal && (
                <button
                  onClick={() => { onClose(); onOpenAdminPortal(); }}
                  className="shrink-0 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Accéder à l'Admin
                </button>
              )}
            </div>
          )}

          {/* Orders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Mes Commandes de Polycopiés & Packs
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600 font-medium">
                  (Limite affichage : 100 dernières commandes)
                </span>
                <button
                  onClick={loadOrders}
                  disabled={loading}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Actualiser"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-600">
                <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-red-600" />
                Chargement sécurisé depuis Supabase...
              </div>
            ) : fetchError ? (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Erreur de lecture des commandes</p>
                  <p>{fetchError}</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Aucune commande enregistrée pour le moment</p>
                <p className="text-[11px] text-slate-600 max-w-sm mx-auto">
                  Découvrez les polycopiés imprimés et packs de révision des facultés tunisiennes dans la boutique et passez votre première commande.
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
                      className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all bg-white"
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                            CS
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                {order.order_reference}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-600" />
                              <span>{orderDate}</span>
                              <span>·</span>
                              <span>{order.items?.length || 0} article(s)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-900 block">
                              {(order.total || (order.total_cents / 100.0)).toFixed(2)} DT
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">
                              {order.shipping_cents === 0 ? 'Livraison gratuite' : '+7.00 DT livr.'}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Detail */}
                      {isExpanded && (
                        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-in fade-in">
                          {/* Items List */}
                          <div>
                            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                              Articles commandés (Instantané de commande)
                            </h4>
                            <div className="space-y-2 bg-white rounded-xl p-3 border border-slate-200">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                                  <div className="flex-1 pr-2">
                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                    <p className="text-[11px] text-slate-600">
                                      Quantité : <strong>{item.quantity}</strong> × {(item.unit_price || (item.unit_price_cents / 100.0)).toFixed(2)} DT
                                    </p>
                                  </div>
                                  <span className="font-bold text-slate-900">
                                    {(item.subtotal || (item.subtotal_cents / 100.0)).toFixed(2)} DT
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Amounts Summary */}
                          <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
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
                            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                              <span>Total payé :</span>
                              <span className="text-red-600">{(order.total || (order.total_cents / 100.0)).toFixed(2)} DT</span>
                            </div>
                          </div>

                          {/* Shipping & Payment Infos */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-white rounded-xl p-3 border border-slate-200">
                              <h5 className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5 mb-1.5">
                                <MapPin className="w-3.5 h-3.5 text-red-600" />
                                Adresse de livraison
                              </h5>
                              <p className="font-semibold text-slate-800">{order.shipping_address?.fullName}</p>
                              <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                {order.shipping_address?.phone}
                              </p>
                              <p className="text-slate-600 mt-0.5">{order.shipping_address?.facultyOrCampus} - {order.shipping_address?.governorate}</p>
                              <p className="text-slate-600">{order.shipping_address?.addressLine}</p>
                            </div>

                            <div className="bg-white rounded-xl p-3 border border-slate-200">
                              <h5 className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5 mb-1.5">
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                Modalité de paiement
                              </h5>
                              <p className="text-slate-800 font-medium">Paiement à la livraison (Démonstration TP)</p>
                              <p className="text-[11px] text-slate-600 mt-1">
                                Identifiant de tentative : <code className="font-mono text-[10px] text-slate-600">{order.attempt_id?.substring(0, 16)}...</code>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
