import { STRIPE_PRODUCTS } from './stripe-config';
import { supabase } from './supabase';
import toast from 'react-hot-toast'; // 👈 assure-toi que tu l’as bien installé

export async function redirectToCheckout(userId: string) {
  try {
    const { PREMIUM } = STRIPE_PRODUCTS;

    toast.loading("Récupération de la session utilisateur...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      toast.dismiss();
      throw new Error("Utilisateur non authentifié.");
    }

    toast.success("Session récupérée ✅");

    toast.loading("Création de la session Stripe...");

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: PREMIUM.priceId,
        mode: PREMIUM.mode,
        success_url: `${window.location.origin}/?success=true`,
        cancel_url: `${window.location.origin}/?canceled=true`,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    toast.dismiss();

    if (error) {
      console.error("❌ Supabase function error:", error);
      throw new Error(error.message);
    }

    if (!data?.url) {
      console.error("❌ Pas d'URL retournée depuis Stripe :", data);
      throw new Error("Aucune URL de paiement retournée.");
    }

    toast.success("Redirection vers Stripe...");
    window.location.href = data.url;

  } catch (error: any) {
    toast.dismiss();
    console.error("Checkout error:", error);
    toast.error(`Erreur: ${error.message}`);
    throw error;
  }
}
