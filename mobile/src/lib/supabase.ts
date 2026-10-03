import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Realtime cart sync - subscribe to cart changes
export function subscribeToCartUpdates(
  userId: string,
  onUpdate: (payload: any) => void
) {
  const channel = supabase
    .channel(`cart-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `user_id=eq.${userId}`,
      },
      onUpdate
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
