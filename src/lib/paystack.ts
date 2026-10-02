const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_API_URL = "https://api.paystack.co";

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
}

interface PaystackResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

interface TransactionInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface TransactionVerifyData {
  status: string;
  reference: string;
  amount: number;
  customer: {
    email: string;
  };
}

export async function initializeTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, string>;
  callbackUrl?: string;
}): Promise<PaystackResponse<TransactionInitializeData>> {
  const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  });

  return response.json();
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackResponse<TransactionVerifyData>> {
  const response = await fetch(
    `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.json();
}
