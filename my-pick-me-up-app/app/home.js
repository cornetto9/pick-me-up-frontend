import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL; 

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/items`);
        console.log('Fetched items:', response.data); // Debugging log
        setItems(response.data.item); // Access the nested items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const renderItem = ({ item }) => {
    console.log('Rendering item:', item); // Debugging log
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDetailsText}>Availability: {item.availability ? 'Available' : 'Not Available'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Page</Text>
      <Button title="Log out" onPress={() => router.push('/login')} />
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.item_id.toString()} // Use item_id as the key
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/item')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
  },
  listContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  itemTitle: {
    fontWeight: 'bold',
    color: 'black', // Ensure the text color is visible
    fontSize: 16, // Increase font size for better visibility
  },
  itemDetailsText: {
    color: 'gray',
    fontSize: 14, // Increase font size for better visibility
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});