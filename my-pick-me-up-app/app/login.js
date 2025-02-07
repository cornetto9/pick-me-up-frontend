import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email and password cannot be empty');
      return;
    }

    try {
      console.log(`🛠️ Attempting login for: ${email}`);

      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('✅ Login response:', response.data);

      // If backend returns a user_id directly (without success flag)
      if (response.data.user_id) {
        await AsyncStorage.setItem('user_id', response.data.user_id.toString());
        router.replace('/Home');  // ✅ Use replace to prevent back navigation to login
        return;
      }

      // If backend explicitly returns success
      if (response.data.success) {
        await AsyncStorage.setItem('user_id', response.data.user_id.toString());
        router.replace('/Home');
      } else {
        console.log('❌ Login failed: Invalid email or password');
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Error logging in:', error.response?.data || error.message);

      if (error.response?.data?.error) {
        Alert.alert('Login Failed', error.response.data.error);
      } else {
        Alert.alert('Error', 'An error occurred while logging in. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pick me Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      <Button title="Login" onPress={handleLogin} />

      <Button title="Sign up" onPress={() => router.push("/CreateUser")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'lightblue',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    textShadowColor: 'blue',
    color: 'green',
  },
});

export default Login;
