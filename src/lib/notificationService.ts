/**
 * Service de Notification WhatsApp pour CoursShare Tunisie
 * Permet à l'administrateur (Mohamed Amine) de recevoir chaque commande directement sur WhatsApp :
 * 1. Lien direct WhatsApp pré-rempli pour le client (+216 29 954 034)
 * 2. Envoi automatique CallMeBot WhatsApp API (optionnel 100% automatique)
 * 3. Alertes sonores et visuelles dans le navigateur
 */

export interface WhatsAppConfig {
  adminPhone: string; // Ex: '21629954034'
  callMeBotApiKey: string; // Clé gratuite CallMeBot pour envoi direct automatique
  enabled: boolean;
  autoOpenWhatsApp: boolean;
}

const STORAGE_KEY = 'coursshare_whatsapp_config';
export const DEFAULT_ADMIN_PHONE = '21629954034';

export const NotificationService = {
  getWhatsAppConfig(): WhatsAppConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          adminPhone: parsed.adminPhone || DEFAULT_ADMIN_PHONE,
          callMeBotApiKey: parsed.callMeBotApiKey || '',
          enabled: parsed.enabled !== undefined ? parsed.enabled : true,
          autoOpenWhatsApp: parsed.autoOpenWhatsApp !== undefined ? parsed.autoOpenWhatsApp : true
        };
      }
    } catch (e) {
      console.warn('Erreur lecture config WhatsApp:', e);
    }
    return {
      adminPhone: DEFAULT_ADMIN_PHONE,
      callMeBotApiKey: '',
      enabled: true,
      autoOpenWhatsApp: true
    };
  },

  saveWhatsAppConfig(config: WhatsAppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Erreur sauvegarde config WhatsApp:', e);
    }
  },

  /**
   * Construit le message formaté pour WhatsApp avec tous les détails de la commande
   */
  buildOrderMessage(order: {
    reference: string;
    clientName: string;
    phone: string;
    governorate: string;
    address: string;
    faculty?: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    shipping: number;
    total: number;
  }): string {
    const itemsList = order.items
      .map((item, idx) => `  ${idx + 1}. *${item.name}* (x${item.quantity}) — ${(item.price * item.quantity).toFixed(2)} DT`)
      .join('\n');

    return (
      `🇹🇳 *NOUVELLE COMMANDE COURSSHARE TUNISIE !*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Réf Commande :* ${order.reference}\n` +
      `👤 *Nom Client :* ${order.clientName}\n` +
      `📞 *Tél Client :* ${order.phone}\n` +
      `📍 *Gouvernorat :* ${order.governorate}\n` +
      `🏛️ *Faculté :* ${order.faculty || 'Non spécifiée'}\n` +
      `🏠 *Adresse :* ${order.address}\n\n` +
      `📚 *Articles Commandés :*\n` +
      `${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *Sous-total :* ${order.subtotal.toFixed(2)} DT\n` +
      `🚚 *Frais de livraison :* ${order.shipping === 0 ? 'OFFERTE (0.00 DT)' : `${order.shipping.toFixed(2)} DT`}\n` +
      `💰 *TOTAL À PAYER :* *${order.total.toFixed(2)} DT*\n` +
      `💳 *Mode :* Paiement espèces à la livraison\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🕒 _${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Tunis' })}_`
    );
  },

  /**
   * Génère le lien wa.me officiel pour envoyer directement le message à Mohamed Amine sur WhatsApp
   */
  getWhatsAppUrl(adminPhone: string, message: string): string {
    const cleanPhone = (adminPhone || DEFAULT_ADMIN_PHONE).replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Envoi automatique via l'API CallMeBot WhatsApp (si l'administrateur a configuré sa clé gratuite)
   */
  async sendAutomatedWhatsApp(order: {
    reference: string;
    clientName: string;
    phone: string;
    governorate: string;
    address: string;
    faculty?: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    shipping: number;
    total: number;
  }): Promise<boolean> {
    const config = this.getWhatsAppConfig();
    if (!config.enabled || !config.callMeBotApiKey) return false;

    const message = this.buildOrderMessage(order);
    const cleanPhone = (config.adminPhone || DEFAULT_ADMIN_PHONE).replace(/[^0-9]/g, '');

    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${config.callMeBotApiKey.trim()}`;
      const res = await fetch(url, { mode: 'no-cors' }); // no-cors pour contourner tout blocage navigateur
      return true;
    } catch (e) {
      console.warn('CallMeBot error:', e);
      return false;
    }
  },

  /**
   * Test de l'API CallMeBot sur WhatsApp
   */
  async testCallMeBot(phone: string, apiKey: string): Promise<{ success: boolean; message: string }> {
    const cleanPhone = (phone || DEFAULT_ADMIN_PHONE).replace(/[^0-9]/g, '');
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      return { success: false, message: 'Veuillez saisir votre clé API CallMeBot reçue sur WhatsApp.' };
    }

    const testMsg = `🇹🇳 *TEST WHATSAPP COURSSHARE*\n\n✅ Connexion réussie ! Votre WhatsApp (+216 29 954 034) est prêt à recevoir automatiquement chaque commande d\'étudiant.`;

    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(testMsg)}&apikey=${cleanKey}`;
      await fetch(url, { mode: 'no-cors' });
      return { 
        success: true, 
        message: 'Demande envoyée à WhatsApp ! Vérifiez votre application WhatsApp dans quelques secondes.' 
      };
    } catch (err: any) {
      return { success: false, message: `Erreur : ${err.message || 'Impossible d\'envoyer le message'}` };
    }
  },

  /**
   * Joue un carillon sonore quand une nouvelle commande arrive
   */
  playOrderChime(): void {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // AudioContext non supporté
    }
  }
};
