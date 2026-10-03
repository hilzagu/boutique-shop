import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[slug]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="auth" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
