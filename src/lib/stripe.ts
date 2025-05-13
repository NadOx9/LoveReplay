import { STRIPE_PRODUCTS } from './stripe-config';
import { supabase } from './supabase';

export async function redirectToCheckout(userId: string) {
  try {
    const { PREMIUM } = STRIPE_PRODUCTS;

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: PREMIUM.priceId,
        mode: PREMIUM.mode,
        success_url: `${window.location.origin}/?success=true`,
        cancel_url: `${window.location.origin}/?canceled=true`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.url) {
      throw new Error('No checkout URL returned');
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
}