import React, { useState, useEffect } from 'react';
import { 
  View, Button, TextInput, Alert, StyleSheet, Switch, Text, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity
} from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ Import icon for floating button

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
  const [loading, setLoading] = useState(false); // ✅ Track loading state
  const router = useRouter();

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
    setAddress(selectedLocation.address);
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
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
        console.log('📸 Image uploaded successfully:', uploadResponse.data.secure_url);
      } catch (error) {
        console.error('❌ Error uploading image:', error);
        Alert.alert('Error', 'An error occurred while uploading the image');
      }
    }
  };

  const handlePostItem = async () => {
    if (!title || !details) {
      Alert.alert("⚠️ Missing Fields", "Please enter a title and details before posting.");
      return;
    }
  
    setLoading(true); // ✅ Show loading state
  
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
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 201) {
        Alert.alert('✅ Success', 'Item posted successfully', [
          {
            text: 'OK',
            onPress: () => {
              // ✅ Reset form fields after success
              setTitle('');
              setDetails('');
              setImageUrl('');
              setLatitude('');
              setLongitude('');
              setAddress('');
              setIsGeneral(true);
              setAvailability(true);
  
              // ✅ Navigate back to Home instead of broken details page
              router.push('/Home');
            },
          },
        ]);
      } else {
        Alert.alert('❌ Error', 'Failed to post item');
      }
    } catch (error) {
      console.error('❌ Error posting item:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'An error occurred while posting the item');
    } finally {
      setLoading(false); // ✅ Hide loading state
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <Text style={styles.text}>Post an Item</Text>

          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Details:</Text>
          <TextInput
            style={[styles.input, styles.detailsInput]}
            placeholder="Enter details"
            value={details}
            onChangeText={setDetails}
            multiline
            placeholderTextColor="#888"
          />

          {/* ✅ Switches in One Row */}
          <View style={styles.switchRow}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>General</Text>
              <Switch value={isGeneral} onValueChange={setIsGeneral} />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Available</Text>
              <Switch value={availability} onValueChange={setAvailability} />
            </View>
          </View>

          <Text style={styles.label}>Address:</Text>
          <GooglePlacesInput onAddressSelected={handleAddressSelect} />

          <Button title="Choose Photo" onPress={handleChoosePhoto} />
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

          {/* ✅ Floating Action Button */}
          <TouchableOpacity 
            style={styles.fab} 
            onPress={handlePostItem} 
            disabled={loading}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ✅ Updated Styles
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    paddingBottom: 80,  
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor:'lightblue',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailsInput: {
    height: 80,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 5, 
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width:50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Item;
