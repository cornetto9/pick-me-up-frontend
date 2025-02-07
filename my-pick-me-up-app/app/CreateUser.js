import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL; 

export default function UserCreateScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleAddressSelect = (selectedLocation) => {
    console.log("Address selected:", selectedLocation);
    setAddress(selectedLocation.address);
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
  };

  const handleCreateAccount = async () => {
    try {
      console.log('Creating account with:', { email, username, password }); // Debugging log
      const response = await axios.post(`${API_URL}/register`, {
        email,
        username,
        password,
      });

      console.log('Response:', response.data);

      if (response.status === 201) {
        console.log('Account creation successful');
        Alert.alert('Success', 'Account created successfully');
        router.push('/home');
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
      <Text style={styles.text}>Create an Account</Text>
      
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

      <Button title="Create Account" onPress={handleCreateAccount} />
      {/* <Text style={styles.label}>Address:</Text>
      <GooglePlacesInput onAddressSelected={handleAddressSelect} />
      {address ? <Text style={styles.addressText}>📍 {address}</Text> : null} */}

      {/* <Button title="Go to Home" onPress={() => router.push('/Home')} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: 'black',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  label: {
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  addressText: {
    marginTop: 8,
    fontSize: 16,
  },
});