import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { totalCents, items, shipping, subtotalCents, shippingCents, taxCents } = body;

    if (!totalCents || totalCents <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Get session (user may be guest or logged in)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    // Create a pending order first, so it exists when Paystack redirects back
    const order = await createOrder({
      userId,
      userEmail: shipping.email,
      userName: shipping.name,
      shippingName: shipping.name,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country,
      items: items.map((item: any) => ({
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        total_price_cents: item.unitPriceCents * item.quantity,
      })),
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
    });

    // Generate a unique reference
    const reference = `BOUTIQUE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Attach the payment reference to the order
    const { supabaseAdmin } = await import("@/lib/supabase");
    await supabaseAdmin
      .from("orders")
      .update({ stripe_payment_intent_id: reference })
      .eq("id", order.id);

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
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}
