import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function AuthScreen() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Stride</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Sign in to sync your cart across all your devices
        </Text>

        <TouchableOpacity style={styles.googleBtn} onPress={signInWithGoogle}>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.googleBtnText}>Sign in with Google</Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#4285F4",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  googleBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
