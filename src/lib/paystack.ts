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

// Promisify Paystack's callback-based API
function promisifyPaystack<T = any>(
  fn: (callback: (err: any, result: any) => void) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function initializeTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, string>;
  callbackUrl?: string;
}) {
  return promisifyPaystack((callback) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (paystack.transaction.initialize as any)(params, callback);
  });
}

export async function verifyTransaction(reference: string) {
  return promisifyPaystack((callback) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (paystack.transaction.verify as any)(reference, callback);
  });
}
