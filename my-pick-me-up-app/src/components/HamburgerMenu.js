import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons

const HamburgerMenu = ({ children, flatListRef }) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const menuTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust the value to shift the screen to the right
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, { transform: [{ translateX: menuTranslateX }] }]}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
        {children}
        <TouchableOpacity onPress={() => router.push("/CreateItem")} style={styles.floatingButton}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => flatListRef.current.scrollToOffset({ offset: 0, animated: true })} style={styles.topButton}>
          <Ionicons name="arrow-up" size={32} color="white" />
        </TouchableOpacity>
      </Animated.View>
      {menuVisible && (
        <Animated.View style={[styles.dropdownMenu, { transform: [{ translateX: menuTranslateX }] }]}>
          <TouchableOpacity onPress={() => router.push("/Home")} style={styles.menuItem}>
            <Text style={styles.menuText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Account")} style={styles.menuItem}>
            <Text style={styles.menuText}>👤 My Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/About")} style={styles.menuItem}>
            <Text style={styles.menuText}>ℹ️ About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Logout")} style={styles.menuItem}>
            <Text style={styles.menuText}>🚪 Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  topButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    zIndex: 20,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
  },
});

export default HamburgerMenu;