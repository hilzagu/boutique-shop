import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotalCents, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const shippingCost = subtotalCents >= 15000 ? 0 : 899;
  const tax = Math.round(subtotalCents * 0.08);
  const totalCents = subtotalCents + shippingCost + tax;

  const handleCheckout = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create order in database
      const orderNumber = `BOUTIQUE-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          user_email: form.email,
          user_name: form.name,
          status: "pending",
          shipping_name: form.name,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_state: form.state,
          shipping_zip: form.zip,
          shipping_country: form.country,
          subtotal_cents: subtotalCents,
          shipping_cents: shippingCost,
          tax_cents: tax,
          total_cents: totalCents,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        total_price_cents: item.unit_price_cents * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Navigate to confirmation
      router.replace(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please log in to checkout</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
        />

        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => setForm({ ...form, address: text })}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="City"
            value={form.city}
            onChangeText={(text) => setForm({ ...form, city: text })}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="State"
            value={form.state}
            onChangeText={(text) => setForm({ ...form, state: text })}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="ZIP Code"
          value={form.zip}
          onChangeText={(text) => setForm({ ...form, zip: text })}
        />

        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={styles.itemName}>
              {item.product_name} x{item.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${(subtotalCents / 100).toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {shippingCost === 0 ? "Free" : `$${(shippingCost / 100).toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${(tax / 100).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(totalCents / 100).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>Pay ${(totalCents / 100).toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  form: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginTop: 20,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#374151",
  },
  itemPrice: {
    fontSize: 14,
    color: "#111",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111",
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: "#111",
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  payBtn: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
