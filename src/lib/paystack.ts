import Paystack from "paystack";

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!);

export default paystack;

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
}

// Paystack uses kobo (1 NGN = 100 kobo), but we'll treat amounts as-is
// since the user can configure their Paystack account currency
export async function initializeTransaction(params: {
  email: string;
  amount: number; // in kobo/cents
  reference: string;
  metadata: Record<string, string>;
  callbackUrl: string;
}) {
  return paystack.transaction.initialize({
    email: params.email,
    amount: params.amount,
    reference: params.reference,
    metadata: params.metadata,
    callback_url: params.callbackUrl,
  });
}

export async function verifyTransaction(reference: string) {
  return paystack.transaction.verify(reference);
}
