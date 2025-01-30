import React, { useState} from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL; 

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });

            console.log('Response:', response.data);

            if (response.data.user_id) {
                console.log('Login successful');
                router.push('/home');
            } else {
                console.log('Login failed: Invalid email or password');
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pick Me Up</Text>

            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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

            <Button title="Login" onPress={handleLogin} />
            <Button title="New? Sign Up" onPress={() => router.push('/create')} />
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
    header: {
        color: '#fff',
        fontSize: 40,
        marginBottom: 30,
    },
    label: {
        color: '#fff',
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontSize: 15
    },
    // text: {
    //     color: 'white',
    //     fontSize: 40
    // },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});