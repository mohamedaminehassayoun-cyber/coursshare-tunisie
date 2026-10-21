import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  BookOpen, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Tag,
  GraduationCap
} from 'lucide-react';
import { DbProduct } from '../lib/supabaseShop';

interface ProductsCatalogSectionProps {
  products: DbProduct[];
  onAddToCart: (product: DbProduct) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const ProductsCatalogSection: React.FC<ProductsCatalogSectionProps> = ({
  products,
  onAddToCart,
  cartCount,
  onOpenCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    'Tous',
    'Packs Révision',
    'Polycopiés Cours',
    'Annales & Examens Corrigés',
    'Séries TD & Exercices'
  ];

  const visibleProducts = products.filter(p => p.is_visible && p.is_available);

  const filteredProducts = selectedCategory === 'Tous'
    ? visibleProducts
    : visibleProducts.filter(p => p.category === selectedCategory);

  const handleAdd = (product: DbProduct) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section id="polycopies-shop-section" className="py-12 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              <span>Boutique Officielle des Polycopiés & Packs Universitaires (TP3)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Commandez vos polycopiés imprimés & reliés
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Packs d'examens corrigés, annales officielles et polycopiés conformes aux programmes universitaires tunisiens. 
              Livraison rapide sur campus et foyers universitaires en Tunisie.
            </p>
          </div>

          {/* Delivery & Cart Banner */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Livraison 7.00 DT</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Gratuite dès 100 DT d'achat</p>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Voir le panier</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-red-600 flex items-center justify-center text-[10px] font-extrabold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const priceDT = (product.price || (product.price_cents / 100.0)).toFixed(2);
            const isJustAdded = addedProductId === product.id;

            return (
              <div 
                key={product.id}
                className="group rounded-3xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image & Category Badge */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide uppercase">
                        {product.category}
                      </span>
                    </div>

                    {product.price_cents >= 10000 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-extrabold tracking-wide uppercase shadow-xs">
                          Livraison Gratuite
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features checklist */}
                    {product.features && product.features.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-600 block uppercase font-bold tracking-wider">
                        Prix Étudiant
                      </span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {priceDT} <span className="text-xs text-red-600">DT</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white hover:scale-102'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ajouté !</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Commander</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
