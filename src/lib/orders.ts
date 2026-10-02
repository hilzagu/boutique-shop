import { supabaseAdmin } from "./supabase";

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string;
  color: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
}

export interface CreateOrderData {
  userId: string | null;
  userEmail: string;
  userName: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  stripePaymentIntentId?: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BOUTIQUE-${timestamp}-${random}`;
}

export async function createOrder(data: CreateOrderData) {
  const orderNumber = generateOrderNumber();

  // Create the order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: data.userId,
      user_email: data.userEmail,
      user_name: data.userName,
      status: "pending",
      shipping_name: data.shippingName,
      shipping_address: data.shippingAddress,
      shipping_city: data.shippingCity,
      shipping_state: data.shippingState,
      shipping_zip: data.shippingZip,
      shipping_country: data.shippingCountry,
      stripe_payment_intent_id: data.stripePaymentIntentId || null,
      subtotal_cents: data.subtotalCents,
      shipping_cents: data.shippingCents,
      tax_cents: data.taxCents,
      total_cents: data.totalCents,
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  // Create order items
  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    ...item,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  return order;
}

export async function updateOrderStatus(orderId: string, status: string, stripeChargeId?: string) {
  const updateData: any = { status };
  if (stripeChargeId) updateData.stripe_charge_id = stripeChargeId;

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}

export async function getOrderById(orderId: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError) throw new Error(`Failed to fetch order: ${orderError.message}`);

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) throw new Error(`Failed to fetch order items: ${itemsError.message}`);

  return { ...order, items };
}

export async function getOrderByNumber(orderNumber: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (orderError) return null;

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  return { ...order, items: items || [] };
}
