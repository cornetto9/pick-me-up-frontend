import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, Switch, ActivityIndicator, Alert, 
  StyleSheet, Image, TouchableOpacity 
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';


const API_URL = Constants.expoConfig.extra.API_URL;

const Account = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (!storedUserId) {
          console.error("⚠️ User ID not found in AsyncStorage");
          Alert.alert("Error", "User not logged in.");
          return;
        }
  
        const userId = parseInt(storedUserId, 10);
        console.log(`🛠️ Fetching data for user ID: ${userId}`);
  
        const userResponse = await axios.get(`${API_URL}/users/${userId}`);
        console.log("✅ User data:", userResponse.data);
        setUser(userResponse.data.user);
  
        const itemsResponse = await axios.get(`${API_URL}/items/user/${userId}`);
        console.log("✅ Items data:", itemsResponse.data);
  
        let items = [];
        if (Array.isArray(itemsResponse.data)) {
          items = itemsResponse.data;
        } else if (Array.isArray(itemsResponse.data.items)) {
          items = itemsResponse.data.items;
        }
  
        // Sort items from latest to oldest based on created_at timestamp
        const sortedItems = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setItems(sortedItems);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (!storedUserId) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      const userId = parseInt(storedUserId, 10);
      console.log(`🛠️ Updating item ${itemId} for user ${userId} status to:`, newStatus);

      const requestData = { availability: newStatus };
      console.log("📤 Request Payload:", requestData);

      const endpoint = `${API_URL}/items/${itemId}?user_id=${userId}`;
      console.log("🌍 API Endpoint:", endpoint);

      await axios.patch(endpoint, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === itemId ? { ...item, availability: newStatus } : item
        )
      );

      Alert.alert("Success", `Item status updated to ${newStatus ? "Available" : "Unavailable"}`);
    } catch (error) {
      console.error("❌ Error updating item status:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update item status");

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === itemId ? { ...item, availability: !newStatus } : item
        )
      );
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_id"); // ✅ Remove user session
      router.replace("/Login"); // ✅ Redirect to login page
    } catch (error) {
      console.error("❌ Error logging out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleItemPress = (item) => {
    router.push({ pathname: '/ItemDetails', params: item }); // ✅ Pass item data
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* ✅ My Info Button at the Top Left */}
        <TouchableOpacity onPress={() => router.push('/UserInfo')} style={styles.infoButton}>
          <MaterialIcons name="person" size={24} color="white" />
          <Text style={styles.infoText}>My Info</Text>
        </TouchableOpacity>

        {/* ✅ Logout Button at the Top Right */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}

      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {/* ✅ Small Image */}
              {item.image_url && item.image_url.trim() !== "" ? (
                <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}

              {/* ✅ Item Title */}
              <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{item.title || "Untitled Item"}</Text>
              </TouchableOpacity>

              {/* ✅ Switch Button */}
              <Switch
                value={item.availability}
                onValueChange={(newValue) => handleStatusChange(item.item_id, newValue)}
              />
            </View>
          )}
          keyExtractor={(item) => item.item_id.toString()}
        />
      ) : (
        <Text style={styles.noItemsText}>You have no posted items yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingBottom: 10, // ✅ Prevents content from being hidden behind the bottom nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C9BCF",
    padding: 5,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: "100%",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 10,
    color: "grey",
  },
  itemTitleContainer: {
    flex: 1, // ✅ Ensures title wraps properly
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1, // ✅ Prevents title from overflowing
  },
  noItemsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Account;