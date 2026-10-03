import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  sizes: string[];
  colors: string[];
  image_url: string;
  stock: number;
}

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      setProduct(data);
      setSelectedSize(data.sizes[0] || "");
      setSelectedColor(data.colors[0] || "");
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        size: selectedSize,
        color: selectedColor,
        quantity,
        unit_price_cents: product.price_cents,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        {/* Image */}
        <Image source={{ uri: product.image_url }} style={styles.image} />

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${(product.price_cents / 100).toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Size selector */}
          <Text style={styles.label}>Size</Text>
          <View style={styles.optionsRow}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionBtn,
                  selectedSize === size && styles.optionBtnActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSize === size && styles.optionTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color selector */}
          <Text style={styles.label}>Color</Text>
          <View style={styles.optionsRow}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.optionBtn,
                  selectedColor === color && styles.optionBtnActive,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedColor === color && styles.optionTextActive,
                  ]}
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color="#666" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <Ionicons name="add" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add to cart button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtn, added && styles.addBtnSuccess]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.addBtnText}>
            {added ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Text>
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
  loader: {
    marginTop: 100,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  details: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 20,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  optionBtnActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextActive: {
    color: "#fff",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "500",
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addBtnSuccess: {
    backgroundColor: "#22c55e",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
