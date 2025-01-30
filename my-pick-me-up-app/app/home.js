import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-get-random-values';
import { useRouter } from "expo-router";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Page</Text>
      <Button title="Log out" onPress={() => router.push('/login')} />
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
  },
});
