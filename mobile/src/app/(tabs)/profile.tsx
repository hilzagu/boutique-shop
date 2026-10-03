import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>Welcome to Stride</Text>
          <Text style={styles.subText}>Sign in to sync your cart across devices</Text>
          <TouchableOpacity style={styles.googleBtn} onPress={signInWithGoogle}>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        {user.user_metadata?.avatar_url && (
          <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{user.user_metadata?.full_name || user.email}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="receipt-outline" size={22} color="#374151" />
          <Text style={styles.menuText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-outline" size={22} color="#374151" />
          <Text style={styles.menuText}>Wishlist</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={22} color="#374151" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
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
  profileCard: {
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  menu: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  signOutBtn: {
    margin: 20,
    marginTop: "auto",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
  },
  signOutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "500",
  },
});
