import React, { useState, useEffect } from 'react';
import { 
  ScrollView, View, Button, TextInput, Alert, StyleSheet, Switch, Text, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, LogBox
} from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ Import icon for floating button

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

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
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false); // ✅ Track loading state
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
        setLoadingImage(false);
        console.log('📸 Image uploaded successfully:', uploadResponse.data.secure_url);
      } catch (error) {
        console.error('❌ Error uploading image:', error);
        Alert.alert('Error', 'An error occurred while uploading the image');
        setLoadingImage(false);
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
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.formContainer} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Post an Item</Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Description:</Text>
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
            <GooglePlacesInput keyboardShouldPersistTaps="handled" onAddressSelected={handleAddressSelect} />
            
            
            <Button title="Choose Photo" onPress={handleChoosePhoto} />
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
            {imageUrl && (
              <TouchableOpacity onPress={() => router.push(imageUrl)}>
                {/* <Image source={{ uri: imageUrl }} style={styles.uploadedImage} /> */}
                <Text style={styles.imageLink}>{imageUrl}</Text>
              
              </TouchableOpacity>
            )}

            {/* post button */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handlePostItem}
            >
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#2C3E50', marginTop: 10 }]} 
              onPress={() => router.push('/Home')}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            
          </ScrollView>
          {/* <TouchableOpacity 
              style={styles.fab} 
              onPress={handlePostItem} 
              disabled={loading}
            >
              <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity> */}
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
    backgroundColor:'#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
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
    color: '#2C3E50', // Midnight Navy
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    marginBottom: 10,
  },
  detailsInput: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 2, 
    marginLeft: 0,
    // borderColor: '#ccc',
    // borderWidth: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 5,
    color: '#2C3E50',
    marginLeft: 0, 
  },
  button: {
    backgroundColor: '#6C9BCF', // Soft Blue
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    alignItems: 'center',

  },
  
  
  // fab: {
  //   position: 'absolute',
  //   bottom: 20,
  //   right: 20,
  //   backgroundColor: '#007AFF',
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25, // Should be 25 instead of 30 for a perfect circle
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 5, // Adds shadow for Android
  //   shadowColor: '#000', // Shadow for iOS
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3,
  // },
  
});

export default Item;
