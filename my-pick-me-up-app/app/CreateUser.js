import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Constants from 'expo-constants';
import styles from '../src/styles'; // Import global styles

const API_URL = Constants.expoConfig.extra.API_URL; 

export default function UserCreateScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  

  // const [address, setAddress] = useState('');
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');

  // const handleAddressSelect = (selectedLocation) => {
  //   console.log("Address selected:", selectedLocation);
  //   setAddress(selectedLocation.address);
  //   setLatitude(selectedLocation.latitude);
  //   setLongitude(selectedLocation.longitude);
  // };

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        username,
        password,
      });

      console.log('Response:', response.data);

      if (response.status === 201) {
        console.log('Account creation successful');
        Alert.alert('Success', 'Account created successfully');

        // Log in the user after account creation
        const loginResponse = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

        if (loginResponse.status === 200) {
          console.log('Login successful');
          await AsyncStorage.setItem('user_id', loginResponse.data.user_id.toString());
          router.push('/Home');
        } else {
          console.log('Login failed');
          Alert.alert('Login Failed', 'Please try logging in manually.');
        }
      } else {
        console.log('Account creation failed');
        Alert.alert('Account Creation Failed', 'Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 500 && error.response.data.includes('duplicate key value violates unique constraint')) {
        Alert.alert('Account Creation Failed', 'Email already exists. Please use a different email.');
      } else {
        console.error('Account creation error:', error.response ? error.response.data : error.message);
        Alert.alert('Account Creation Failed', error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      
      <Text style={styles.label}>Email:</Text>
      <TextInput 
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Username:</Text>
      <TextInput 
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      {/* <Button title="Create Account" onPress={handleCreateAccount} /> */}
      {/* <Text style={styles.label}>Address:</Text>
      <GooglePlacesInput onAddressSelected={handleAddressSelect} />
      {address ? <Text style={styles.addressText}>📍 {address}</Text> : null} */}

      {/* <Button title="Go to Home" onPress={() => router.push('/Home')} /> */}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'lightblue',
//     // alignItems: 'center',
//     justifyContent: 'top',
//     padding: 20,
//   },
//   text: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 50,
//     textShadowColor: 'blue',
//     color: 'green',
//   },
//   label: {
//     color: 'green',
//     alignSelf: 'flex-start',
//     marginBottom: 5,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     // marginLeft: 10,
//     // marginRight: 10,
//     marginTop: 10,
//     borderRadius: 5,
//     backgroundColor: '#f0f0f0',
//   },
  
//   button: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginHorizontal: 10,
//     marginTop: 10,
//     marginBottom: 10,
//     width: '100%',
//     marginLeft: 0,

//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
