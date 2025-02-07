import { Stack, usePathname } from "expo-router";
import BottomNav from "../src/components/BottomNav";
import { View, StyleSheet } from "react-native";

export default function Layout() {
  const pathname = usePathname(); // ✅ Get current page path

  // ✅ List of pages where BottomNav should NOT appear
  const hiddenPages = ["/Login", "/CreateUser"];

  return (
    <View style={styles.container}>
      <Stack />

      {/* ✅ Show BottomNav only if NOT on hidden pages */}
      {!hiddenPages.includes(pathname) && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

