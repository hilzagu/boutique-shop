import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartScreen() {
  const { items, removeItem, updateQuantity, totalItems, subtotalCents, loading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Please log in to view your cart</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product_image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product_name}</Text>
        <Text style={styles.itemDetails}>
          {item.size} / {item.color}
        </Text>
        <Text style={styles.itemPrice}>
          ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="remove" size={16} color="#666" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="add" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart ({totalItems})</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${(subtotalCents / 100).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
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
    marginTop: 16,
  },
  list: {
    padding: 15,
  },
  cartItem: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  itemDetails: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  checkoutBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
