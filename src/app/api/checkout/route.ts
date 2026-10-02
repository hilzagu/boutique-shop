import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { totalCents, items, shipping } = body;

    if (!totalCents || totalCents <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Generate a unique reference
    const reference = `BOUTIQUE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Initialize Paystack transaction
    const result = await initializeTransaction({
      email: shipping.email,
      amount: totalCents,
      reference,
      metadata: {
        name: shipping.name,
        itemCount: items.length.toString(),
        orderReference: reference,
      },
      callbackUrl: `${process.env.NEXTAUTH_URL}/order-confirmation?reference=${reference}`,
    });

    if (!result.status) {
      return NextResponse.json(
        { error: result.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
      accessCode: result.data.access_code,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}
