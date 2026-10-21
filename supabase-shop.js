/**
 * ==============================================================================
 * PROJET : CoursShare Tunisie - TP3 Supabase
 * FICHIER : supabase-shop.js
 * DESCRIPTION : Fonctions d'accès Supabase pour l'authentification des étudiants,
 *              la gestion des polycopiés, les commandes sécurisées et l'administration.
 * ==============================================================================
 */

const SupabaseShop = {
  /**
   * --- 1. AUTHENTIFICATION & UTILISATEURS ---
   */

  // Inscription par e-mail et mot de passe avec métadonnées nom/prénom
  async signUp(email, password, firstName, lastName) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

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

  // Connexion avec e-mail et mot de passe
  async signIn(email, password) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
    return data;
  },

  // Déconnexion
  async signOut() {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Récupérer la session active
  async getSession() {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Récupérer le rôle dans public.user_roles ('admin' ou 'client')
  async getUserRole(userId) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase || !userId) return 'client';

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Erreur lecture rôle:', error.message);
      return 'client';
    }
    return data ? data.role : 'client';
  },

  /**
   * --- 2. CATALOGUE DES POLYCOPIÉS ET PACKS ---
   */

  // Récupérer les produits visibles
  async getProducts() {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * --- 3. COMMANDES ET CHECKOUT ---
   */

  // Passer une commande sécurisée via la fonction RPC create_demo_order
  async createDemoOrder({ attemptId, items, shippingAddress, paymentMethod, expectedTotalCents }) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non configuré.');

    const { data, error } = await supabase.rpc('create_demo_order', {
      p_attempt_id: attemptId,
      p_items: items,
      p_shipping_address: shippingAddress,
      p_payment_method: paymentMethod || 'demo_cash_on_delivery',
      p_expected_total_cents: expectedTotalCents
    });

    if (error) throw error;
    return data;
  },

  // Récupérer les 100 dernières commandes du client connecté
  async getMyOrders() {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  /**
   * --- 4. ESPACE ADMINISTRATION ---
   */

  // Récupérer toutes les commandes (réservé aux admins protégés par RLS)
  async getAllOrders({ statusFilter = 'Tous', page = 1, pageSize = 50 } = {}) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
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
    return { orders: data || [], count: count || 0 };
  },

  // Mettre à jour le statut d'une commande avec détection de concurrence
  async updateOrderStatus(orderId, newStatus, currentKnownStatus) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    // 1. Détection de modification concurrente
    const { data: currentOrder, error: checkError } = await supabase
      .from('orders')
      .select('status, updated_at')
      .eq('id', orderId)
      .single();

    if (checkError) throw checkError;

    if (currentKnownStatus && currentOrder.status !== currentKnownStatus) {
      throw new Error(`Modification concurrente détectée : la commande a déjà été passée à "${currentOrder.status}" par un autre administrateur. Veuillez actualiser.`);
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
    return data;
  },

  // Ajouter un nouveau polycopié (réservé aux administrateurs)
  async createProduct(productData) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Modifier un polycopié
  async updateProduct(productId, updates) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un polycopié
  async deleteProduct(productId) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Client Supabase non initialisé.');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  }
};

window.SupabaseShop = SupabaseShop;
