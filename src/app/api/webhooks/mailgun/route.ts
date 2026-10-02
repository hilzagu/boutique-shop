import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Mailgun webhook for tracking email events (delivered, bounced, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mailgun sends webhooks with event data
    const event = body["event-data"] || body;

    const {
      event: eventType,
      recipient,
      message: { id: messageId } = {},
    } = event;

    // Update email status in database
    if (eventType && messageId) {
      await supabaseAdmin
        .from("emails")
        .update({ status: eventType })
        .eq("mailgun_message_id", messageId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Mailgun webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
