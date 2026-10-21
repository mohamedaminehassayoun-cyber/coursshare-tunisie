import { getSupabase, isSupabaseConfigured } from './supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface DbProduct {
  id: string;
  name: string;
  category: 'Packs Révision' | 'Polycopiés Cours' | 'Annales & Examens Corrigés' | 'Séries TD & Exercices' | 'Guides & Manuels';
  description: string;
  price_cents: number;
  price?: number;
  image: string;
  features: string[];
  is_visible: boolean;
  is_available: boolean;
  faculty_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  governorate: string;
  facultyOrCampus: string;
  addressLine: string;
}

export interface OrderItemSnapshot {
  product_id: string;
  name: string;
  unit_price_cents: number;
  unit_price: number;
  quantity: number;
  subtotal_cents: number;
  subtotal: number;
}

export interface DbOrder {
  id: string;
  order_reference: string;
  user_id: string;
  attempt_id: string;
  items: OrderItemSnapshot[];
  shipping_address: ShippingAddress;
  payment_method: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  subtotal?: number;
  shipping?: number;
  total?: number;
  status: 'Nouvelle' | 'En préparation' | 'Terminée' | 'Annulée';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: DbProduct;
  quantity: number;
}

export interface OrderResult {
  success: boolean;
  is_duplicate_retry: boolean;
  order_id: string;
  order_reference: string;
  total_cents: number;
  total: number;
  status: string;
  created_at: string;
}

// Fallback initial products in case Supabase is not yet connected by the student
export const DEFAULT_SAMPLE_PRODUCTS: DbProduct[] = [
  {
    id: 'pack-insat-mpi',
    name: 'Pack Intégral INSAT MPI (Algo C + Analyse + Algèbre)',
    category: 'Packs Révision',
    description: 'Pack polycopiés imprimés et reliés avec résumés officiels, fiches de synthèse et 8 ans d\'examens corrigés détaillés pour le cycle préparatoire intégré INSAT.',
    price_cents: 3500, // 35.00 DT
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    features: ['3 tomes polycopiés reliés', 'Algorithmique en C & Structures de données', 'Analyse numérique & Algèbre linéaire', '8 examens corrigés pas à pas'],
    is_visible: true,
    is_available: true,
    faculty_id: 'insat'
  },
  {
    id: 'poly-isg-compta',
    name: 'Polycopié Officiel ISG Tunis - Comptabilité Financière & Fiscalité L1',
    category: 'Polycopiés Cours',
    description: 'Cours complet et cas pratiques d\'application conformes au programme du Pr. Fayçal Derbel. Idéal pour valider avec mention les examens de comptabilité générale.',
    price_cents: 1850, // 18.50 DT
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    features: ['160 pages imprimées haute qualité', 'Écritures comptables & Bilan selon normes SCF', '25 exercices progressifs résolus', 'Sujets de DS types'],
    is_visible: true,
    is_available: true,
    faculty_id: 'isg'
  },
  {
    id: 'pack-ihec-finance',
    name: 'Pack Annale & Corrigés IHEC Carthage - Finance d\'Entreprise & Marchés',
    category: 'Annales & Examens Corrigés',
    description: 'Recueil officiel des sessions principales et sessions de rattrapage avec barèmes officiels et corrections rédigées sous la supervision académique.',
    price_cents: 2400, // 24.00 DT
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    features: ['12 sessions complètes corrigées', 'VAN, TRI, Choix d\'investissement', 'Gestion de portefeuille & Marchés obligataires', 'Fiches mémo formules'],
    is_visible: true,
    is_available: true,
    faculty_id: 'ihec'
  },
  {
    id: 'poly-fst-physique',
    name: 'Polycopié FST Tunis - Électromagnétisme & Optique Ondulatoire L2',
    category: 'Polycopiés Cours',
    description: 'Support de cours théorique avec schémas d\'ondes, équations de Maxwell détaillées et séries de TD résolues pour étudiants en Sciences Fondamentales et Électronique.',
    price_cents: 1600, // 16.00 DT
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    features: ['Équations de Maxwell expliquées', 'Optique interférentielle et diffraction', '14 exercices de TD corrigés', 'Fiches récapitulatives avant examen'],
    is_visible: true,
    is_available: true,
    faculty_id: 'fst'
  },
  {
    id: 'pack-fmt-anatomie',
    name: 'Atlas & Fiches Synthèse FMT - Anatomie & Physiologie PCEM1',
    category: 'Packs Révision',
    description: 'Guide visuel haute définition d\'anatomie humaine avec schémas en couleurs légendés, tableaux de physiologie clinique et QCM officiels corrigés de la Faculté de Médecine de Tunis.',
    price_cents: 4200, // 42.00 DT
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80',
    features: ['Planches anatomiques quadrichromie', 'Appareil cardio-vasculaire & respiratoire', '300 QCM types concours résolus', 'Mémo poche pratique pour stages'],
    is_visible: true,
    is_available: true,
    faculty_id: 'fmt'
  },
  {
    id: 'pack-enit-genie',
    name: 'Pack Ingénieur ENIT - Mécanique des Fluides & Résistance des Matériaux',
    category: 'Packs Révision',
    description: 'Dossier technique relié comportant les cours magistraux, formulaire complet de RDM et annales d\'examens semestriels de l\'École Nationale d\'Ingénieurs de Tunis.',
    price_cents: 2900, // 29.00 DT
    price: 29.00,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    features: ['Formulaire officiel plastifié inclus', 'Dimensionnement des structures & poutres', 'Navier-Stokes et écoulements incompressibles', '9 examens récents résolus'],
    is_visible: true,
    is_available: true,
    faculty_id: 'enit'
  },
  {
    id: 'td-fdspt-droit',
    name: 'Série de TD & Cas Pratiques FDSPT - Droit des Obligations & Droit Constitutionnel',
    category: 'Séries TD & Exercices',
    description: 'Recueil de commentaires d\'arrêts, dissertations juridiques modèles et cas pratiques résolus pour étudiants en Licence Droit de la Faculté de Droit et des Sciences Politiques de Tunis.',
    price_cents: 1450, // 14.50 DT
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    features: ['Méthodologie du commentaire d\'arrêt', '18 cas pratiques corrigés', 'Jurisprudence tunisienne commentée', 'Lexique juridique bilingue Fr-Ar'],
    is_visible: true,
    is_available: true,
    faculty_id: 'fdspt'
  },
  {
    id: 'pack-prestige-tbs',
    name: 'Pack Réussite Complète Tunis Business School (TBS) - Economics & Business Analytics',
    category: 'Packs Révision',
    description: 'Pack intégral en langue anglaise selon le standard académique américain de TBS : Microeconomics, Macroeconomics, Business Statistics & Python for Business.',
    price_cents: 10500, // 105.00 DT (Dépasse le seuil des 100 DT pour tester la livraison gratuite automatique !)
    price: 105.00,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    features: ['4 volumes cartonnés en Anglais', 'Business Statistics & R/Python scripts', 'Midterms and Final Exams solutions', 'Livraison gratuite offerte incluse (Total > 100 DT)'],
    is_visible: true,
    is_available: true,
    faculty_id: 'tbs'
  }
];

export const SupabaseShopService = {
  // --- AUTHENTIFICATION ---
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase n\'est pas encore configuré avec votre Project URL et Publishable Key.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase n\'est pas encore configuré. Veuillez renseigner votre URL de projet.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async getSession(): Promise<Session | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Erreur session Supabase:', error.message);
      return null;
    }
    return session;
  },

  async getUserRole(userId: string): Promise<'admin' | 'client'> {
    const supabase = getSupabase();
    if (!supabase || !userId) return 'client';

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Erreur lecture rôle:', error.message);
        return 'client';
      }
      return data?.role === 'admin' ? 'admin' : 'client';
    } catch {
      return 'client';
    }
  },

  // --- CATALOGUE DES PRODUITS ---
  async fetchProducts(): Promise<DbProduct[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return DEFAULT_SAMPLE_PRODUCTS;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Impossible de charger les produits depuis Supabase, utilisation du catalogue local:', error.message);
        return DEFAULT_SAMPLE_PRODUCTS;
      }

      if (!data || data.length === 0) {
        return DEFAULT_SAMPLE_PRODUCTS;
      }

      return data.map((item: any) => ({
        ...item,
        price: item.price !== undefined ? Number(item.price) : item.price_cents / 100.0,
        features: Array.isArray(item.features) ? item.features : []
      }));
    } catch {
      return DEFAULT_SAMPLE_PRODUCTS;
    }
  },

  // --- COMMANDES ET CHECKOUT ---
  async createDemoOrder(params: {
    attemptId: string;
    items: { product_id: string; quantity: number }[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    expectedTotalCents: number;
  }): Promise<OrderResult> {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase n\'est pas encore configuré avec vos identifiants.');
    }

    const { data, error } = await supabase.rpc('create_demo_order', {
      p_attempt_id: params.attemptId,
      p_items: params.items,
      p_shipping_address: params.shippingAddress,
      p_payment_method: params.paymentMethod || 'demo_cash_on_delivery',
      p_expected_total_cents: params.expectedTotalCents
    });

    if (error) {
      throw error;
    }

    return data as OrderResult;
  },

  async fetchMyOrders(): Promise<DbOrder[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []).map((o: any) => ({
      ...o,
      subtotal: o.subtotal_cents ? o.subtotal_cents / 100.0 : o.subtotal,
      shipping: o.shipping_cents ? o.shipping_cents / 100.0 : o.shipping,
      total: o.total_cents ? o.total_cents / 100.0 : o.total
    }));
  },

  // --- ADMINISTRATION ---
  async fetchAllOrdersAdmin(statusFilter = 'Tous', page = 1, pageSize = 50): Promise<{ orders: DbOrder[]; count: number }> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (statusFilter && statusFilter !== 'Tous') {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const formattedOrders = (data || []).map((o: any) => ({
      ...o,
      subtotal: o.subtotal_cents ? o.subtotal_cents / 100.0 : o.subtotal,
      shipping: o.shipping_cents ? o.shipping_cents / 100.0 : o.shipping,
      total: o.total_cents ? o.total_cents / 100.0 : o.total
    }));

    return { orders: formattedOrders, count: count || 0 };
  },

  async updateOrderStatus(orderId: string, newStatus: string, currentKnownStatus?: string): Promise<DbOrder> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    // 1. Détection de modification concurrente
    const { data: currentOrder, error: checkError } = await supabase
      .from('orders')
      .select('status, updated_at')
      .eq('id', orderId)
      .single();

    if (checkError) throw checkError;

    if (currentKnownStatus && currentOrder.status !== currentKnownStatus) {
      throw new Error(`Modification concurrente : la commande est déjà passée à "${currentOrder.status}". Veuillez actualiser.`);
    }

    // 2. Mise à jour effective
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      subtotal: data.subtotal_cents ? data.subtotal_cents / 100.0 : data.subtotal,
      shipping: data.shipping_cents ? data.shipping_cents / 100.0 : data.shipping,
      total: data.total_cents ? data.total_cents / 100.0 : data.total
    };
  },

  async createProduct(product: Omit<DbProduct, 'created_at' | 'updated_at'>): Promise<DbProduct> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { data, error } = await supabase
      .from('products')
      .insert([{
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price_cents: product.price_cents,
        image: product.image,
        features: product.features,
        is_visible: product.is_visible,
        is_available: product.is_available,
        faculty_id: product.faculty_id || 'tous'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(productId: string, updates: Partial<DbProduct>): Promise<DbProduct> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const payload: any = { ...updates, updated_at: new Date().toISOString() };
    delete payload.price; // Generated column in Postgres

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  }
};
