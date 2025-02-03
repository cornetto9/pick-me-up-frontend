import React, { useState, useEffect } from 'react';
import { 
  View, Button, TextInput, Alert, StyleSheet, Switch, Text, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image
} from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const API_URL = Constants.expoConfig.extra.API_URL; 
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dabjvo2wq/image/upload';
const UPLOAD_PRESET = 'pick_me_up'; 

const Item = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isGeneral, setIsGeneral] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [userId, setUserId] = useState(null); 
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error("❌ Error fetching user_id from AsyncStorage:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleAddressSelect = (selectedLocation) => {
    console.log("✅ Address Selected:", selectedLocation.address);
    console.log("✅ Coordinates:", { lat: selectedLocation.latitude, lng: selectedLocation.longitude });
    setAddress(selectedLocation.address);
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
  };

  const handlePostItem = async () => {
    const itemData = {
      title,
      details,
      image_url: imageUrl, 
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_general: isGeneral,
      availability,
      user_id: userId, 
    };

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

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const uploadResponse = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setImageUrl(uploadResponse.data.secure_url);
        console.log('Image uploaded successfully:', uploadResponse.data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'An error occurred while uploading the image');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <Text style={styles.text}>Post an Item</Text>

          {/* ✅ Title Input */}
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />

          {/* ✅ Details Input */}
          <Text style={styles.label}>Details:</Text>
          <TextInput
            style={[styles.input, styles.detailsInput]}
            placeholder="Enter details"
            value={details}
            onChangeText={setDetails}
            multiline
            placeholderTextColor="#888"
          />

          {/* ✅ Category Switch */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>General</Text>
              <Switch value={isGeneral} onValueChange={setIsGeneral} />
            </View>
          </View>

          {/* ✅ Availability Switch */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Available</Text>
              <Switch value={availability} onValueChange={setAvailability} />
            </View>
          </View>

          {/* ✅ Address Input */}
          <Text style={styles.label}>Address:</Text>
          <GooglePlacesInput onAddressSelected={handleAddressSelect} />
          {/* {address ? <Text style={styles.addressText}>📍 {address}</Text> : null} */}

          {/* ✅ Photo Upload */}
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

          {/* ✅ Submit Button */}
          <Button title="Post Item" onPress={handlePostItem} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ✅ Updated Styles (Light Theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // ✅ White background
    padding: 20, 
  },
  formContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  text: {
    color: 'black', // ✅ Black text
    fontSize: 24,
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  label: {
    color: 'black', // ✅ Black labels
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 15,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0', // ✅ Light gray background for inputs
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black', // ✅ Black text inside input
  },
  detailsInput: {
    height: 40,
  },
  switchContainer: {
    marginBottom: 10,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f9f9f9', // ✅ Light gray background for switch
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: 'black', // ✅ Black text for switches
  },
  addressText: {
    fontSize: 14,
    color: 'black', // ✅ Black address text
    marginTop: 5,
    backgroundColor: '#e0e0e0', // ✅ Light gray background
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default Item;