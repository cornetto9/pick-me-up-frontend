import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Alert, StyleSheet, Switch, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.API_URL; 

const Item = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isGeneral, setIsGeneral] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [userId, setUserId] = useState(null); // Ensuring `userId` is null initially

  // Fetch user ID from AsyncStorage after login
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10)); // Ensure it's stored as a number
        } else {
          console.log("⚠️ No user_id found in AsyncStorage!");
        }
      } catch (error) {
        console.error("❌ Error fetching user_id from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, []);

  const handlePostItem = async () => {
    const itemData = {
      title,
      details,
      image_url: 'https://example.com/static-image.jpg', 
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_general: isGeneral,
      availability,
      user_id: userId, 
    };

    console.log('Posting item with data:', itemData);

    try {
      const response = await axios.post(`${API_URL}/items`, itemData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Item posted successfully');
      } else {
        Alert.alert('Error', 'Failed to post item');
      }
    } catch (error) {
      console.error('Error posting item:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'An error occurred while posting the item');
    }
  };

  const handleAddressSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, styles.detailsInput]}
            placeholder="Details"
            value={details}
            onChangeText={setDetails}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <GooglePlacesInput key="address" onPress={handleAddressSelect} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Category</Text>
          <Switch
            value={isGeneral}
            onValueChange={setIsGeneral}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Status</Text>
          <Switch
            value={availability}
            onValueChange={setAvailability}
          />
        </View>
        <Button title="Post Item" onPress={handlePostItem} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 18,
  },
  detailsInput: {
    height: 80,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
});

export default Item;