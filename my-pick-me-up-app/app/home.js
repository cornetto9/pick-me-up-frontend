import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import axios from 'axios';
import Constants from 'expo-constants';
import styles from '../src/styles'; // Import global styles

const API_URL = Constants.expoConfig.extra.API_URL;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/items`);
        if (response.data.item && Array.isArray(response.data.item)) {
          const sortedItems = response.data.item.sort((a, b) => {
            if (a.availability === b.availability) {
              return new Date(b.created_at) - new Date(a.created_at);
            }
            return a.availability ? -1 : 1;
          });
          setItems(sortedItems);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemPress = (item) => {
    router.push({ pathname: '/ItemDetails', params: item }); // ✅ Pass item data
  };

  const renderItem = ({ item }) => (
    // <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemContainer}>
    //   <Image source={{ uri: item.image_url }} style={styles.itemImage} />
    //   <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
    // </TouchableOpacity>
    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemContainer}>
    {item.image_url && item.image_url.trim() !== "" ? (
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
    ) : (
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    )}
    <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
  </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // <View style={styles.container}>
    //   {/* <View style={styles.buttonContainer}>
    //     <Button title="Logout" onPress={() => router.replace('/login')} color="red" />
    //     <Button title="Create Item" onPress={() => router.push('/createItem')} color="green" />
    //     <Button title="Account" onPress={() => router.push('/account')} color="blue" />
    //   </View> */}

    //   <FlatList
    //     data={items}
    //     renderItem={renderItem}
    //     keyExtractor={(item) => item.item_id.toString()}
    //     numColumns={2}
    //     columnWrapperStyle={styles.row}
    //     contentContainerStyle={styles.listContent}
    //   />
    // </View>
    <View style={[styles.container, { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, }]}>
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.item_id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'lightblue',
//     paddingHorizontal: 10,
//     paddingTop: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   itemContainer: {
//     width: '48%',
//     marginBottom: 10,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//     padding: 10,
//   },
//   itemImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 10,
//     resizeMode: 'cover',
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 5,
//   },
// });

export default Home;