// Stripe Configuration
// TODO: Uncomment when you have Stripe credentials

/*
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

// Service Price IDs
export const STRIPE_PRICES = {
  VA: process.env.NEXT_PUBLIC_STRIPE_PRICE_VA,
  AUTOMATION: process.env.NEXT_PUBLIC_STRIPE_PRICE_AUTOMATION,
  WEB: process.env.NEXT_PUBLIC_STRIPE_PRICE_WEB,
};
*/

// Placeholder - Stripe not yet configured
export const getStripe = () => null;
export const STRIPE_PRICES = {
    VA: '',
    AUTOMATION: '',
    WEB: '',
};
