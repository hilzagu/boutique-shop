declare module "paystack" {
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

  interface PaystackInstance {
    transaction: {
      initialize(params: {
        email: string;
        amount: number;
        reference?: string;
        metadata?: Record<string, string>;
        callback_url?: string;
      }): Promise<PaystackResponse<TransactionInitializeData>>;

      verify(reference: string): Promise<PaystackResponse<TransactionVerifyData>>;
    };
  }

  function Paystack(secretKey: string): PaystackInstance;
  export = Paystack;
}
