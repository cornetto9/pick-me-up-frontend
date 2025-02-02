import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL; 
console.log('Loaded API_URL:', API_URL);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const storeUserId = async (userId) => {
        try {
            await AsyncStorage.setItem('user_id', userId.toString()); // Store as string
            console.log("✅ User ID stored:", userId);
        } catch (error) {
            console.error("❌ Error storing user_id:", error);
        }
    };

    const handleLogin = async () => {
        const loginData = { email, password };

        console.log('Logging in with data:', loginData);
        console.log('API_URL:', API_URL);

        try {
            const response = await axios.post(`${API_URL}/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);

            if (response.data.user_id) {
                console.log('✅ Login successful');
                
                // Store user_id in AsyncStorage
                await storeUserId(response.data.user_id);

                // Navigate to Home
                router.push('/home');
            } else {
                console.log('❌ Login failed: Invalid email or password');
                Alert.alert('Error', 'Invalid email or password');
            }
        } catch (error) {
            console.error('❌ Error logging in:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An error occurred while logging in');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button title="Login" onPress={handleLogin} />

            {/* New? Sign Up Button */}
            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupText}>New? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
    signupText: {
        marginTop: 15,
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
