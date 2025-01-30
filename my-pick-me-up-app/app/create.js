import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import GooglePlacesInput from '../src/components/GooglePlacesInput';
import { useRouter } from 'expo-router';

export default function UserCreateScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Creation Page</Text>
      {/* <Text style={styles.text}>address</Text> */}
      <GooglePlacesInput />
      <Button title="Go to Home" onPress={() => router.push('/home')} />
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
  text: {
    color: 'white',
    fontSize: 30
  },
});