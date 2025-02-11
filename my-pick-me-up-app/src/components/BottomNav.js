import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons


const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => router.push("/Home")} style={styles.navButton}>
        <Ionicons name="home" size={24} color="#2C3E50" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/Account")} style={styles.navButton}>
        <Ionicons name="person" size={24} color="#2C3E50" />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/CreateItem")} style={styles.navButton}>
        <Ionicons name="add-circle" size={24} color="#2C3E50" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F7FA', // White background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1, // ✅ Creates a border at the bottom
    borderBottomColor: '#ddd',
    shadowColor: '#000', // ✅ Shadow effect (iOS)
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // ✅ Shadow for Android
    // position: 'absolute', // ✅ Fix to the top
    top: 0,
    left: 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
});

export default BottomNav;
