import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export default stripe;

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
}

export async function createPaymentIntent(
  amountCents: number,
  metadata: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}
