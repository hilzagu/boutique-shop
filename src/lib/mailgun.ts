import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

const DOMAIN = process.env.MAILGUN_DOMAIN!;
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL!;
const FROM_NAME = process.env.MAILGUN_FROM_NAME || "Boutique Shop";

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function generateOrderConfirmationHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <span style="color:#666;font-size:14px;">Size: ${item.size} | Color: ${item.color}</span>
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price)}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;font-family:Georgia,serif;background:#fafafa;">
  <div style="max-width:600px;margin:0 auto;background:#fff;padding:40px 30px;">
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#1a1a1a;font-size:28px;margin:0;">Order Confirmed</h1>
      <p style="color:#666;margin:8px 0 0;">Thank you for shopping with us, ${data.customerName}!</p>
    </div>

    <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#666;">Order Number</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#1a1a1a;">#${data.orderNumber}</p>
    </div>

    <h2 style="font-size:18px;color:#1a1a1a;margin:0 0 12px;">Order Summary</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="padding:12px;text-align:left;font-size:13px;color:#666;">Item</th>
          <th style="padding:12px;text-align:center;font-size:13px;color:#666;">Qty</th>
          <th style="padding:12px;text-align:right;font-size:13px;color:#666;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;">
        <span style="color:#666;">Subtotal</span><span>${formatPrice(data.subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;">
        <span style="color:#666;">Shipping</span><span>${formatPrice(data.shipping)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;">
        <span style="color:#666;">Tax</span><span>${formatPrice(data.tax)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #1a1a1a;margin-top:8px;">
        <span style="font-weight:bold;font-size:16px;">Total</span>
        <span style="font-weight:bold;font-size:16px;">${formatPrice(data.total)}</span>
      </div>
    </div>

    <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:14px;color:#666;">Shipping Address</p>
      <p style="margin:0;line-height:1.6;">
        ${data.shippingAddress.name}<br/>
        ${data.shippingAddress.address}<br/>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br/>
        ${data.shippingAddress.country}
      </p>
    </div>

    <p style="color:#999;font-size:13px;text-align:center;margin-top:30px;">
      Questions about your order? Reply to this email or contact us at support@yourdomain.com
    </p>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const html = generateOrderConfirmationHtml(data);

    const result = await mg.messages.create(DOMAIN, {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderNumber}`,
      html,
      text: `Order #${data.orderNumber} confirmed. Total: ${formatPrice(data.total)}. Thank you for your purchase!`,
    });

    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error("Mailgun email error:", error);
    return { success: false, error: error.message };
  }
}

export async function logEmailToDatabase(
  supabase: any,
  data: {
    orderId: string | null;
    toEmail: string;
    subject: string;
    template: string;
    status: string;
    mailgunMessageId?: string;
  }
) {
  await supabase.from("emails").insert({
    order_id: data.orderId,
    to_email: data.toEmail,
    subject: data.subject,
    template: data.template,
    status: data.status,
    mailgun_message_id: data.mailgunMessageId,
  });
}
