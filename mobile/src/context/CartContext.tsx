import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, subscribeToCartUpdates } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string;
  color: string;
  quantity: number;
  unit_price_cents: number;
  user_id: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (item: Omit<CartItem, "id" | "user_id">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Real-time sync
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToCartUpdates(user.id, () => {
      fetchCart();
    });

    return unsubscribe;
  }, [user, fetchCart]);

  const addItem = async (item: Omit<CartItem, "id" | "user_id">) => {
    if (!user) throw new Error("Must be logged in");

    // Check if item already exists
    const existing = items.find(
      (i) =>
        i.product_id === item.product_id &&
        i.size === item.size &&
        i.color === item.color
    );

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + item.quantity })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await supabase.from("cart_items").insert({
        ...item,
        user_id: user.id,
      });

      if (error) throw error;
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) throw error;
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id);
    if (error) throw error;
  };

  const clearCart = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);
    if (error) throw error;
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce((sum, i) => sum + i.quantity * i.unit_price_cents, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
