import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

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
  featured: boolean;
}

export default function ShopScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Dresses", "Tops", "Bottoms", "Outerwear"];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (selectedCategory && selectedCategory !== "All") {
      query = query.eq("category", selectedCategory.toLowerCase());
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Link href={`/product/${item.slug}`} asChild>
      <TouchableOpacity style={styles.productCard}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${(item.price_cents / 100).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Stride</Text>
      </View>

      {/* Hero */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
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
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  categoryScroll: {
    maxHeight: 50,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  categoryBtnActive: {
    backgroundColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  loader: {
    marginTop: 50,
  },
  list: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 4,
  },
});
