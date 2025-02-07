import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => router.push("/Home")} style={styles.navButton}>
        <Text style={styles.navText}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/Account")} style={styles.navButton}>
        <Text style={styles.navText}>👤 My Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/CreateItem")} style={styles.navButton}>
        <Text style={styles.navText}>➕ Post Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1, // ✅ Creates a border at the bottom
    borderBottomColor: '#ddd',
    shadowColor: '#000', // ✅ Shadow effect (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // ✅ Shadow for Android
    // position: 'absolute', // ✅ Fix to the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // ✅ Ensures it appears above content
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BottomNav;
