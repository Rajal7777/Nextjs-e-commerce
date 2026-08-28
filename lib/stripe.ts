import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY configuration.");
  }

  return new Stripe(secretKey);
}
