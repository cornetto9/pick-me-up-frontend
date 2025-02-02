import React from 'react';
import { Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

export default function GooglePlacesInput({ onPress }) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search for an address"
      fetchDetails={true}
      onPress={(data, details = null) => {
        console.log("DATA:", data);
        console.log("DETAILS:", details);

        if (details) {
          // Alert.alert("Selected Place", JSON.stringify(details, null, 2)); // Show alert to confirm selection
          onPress(data, details);
        } else {
          console.log("⚠️ Error: Details not fetched!");
          Alert.alert("Error", "Details not fetched!"); // Show an alert if details are missing
        }
      }}
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
      }}
      styles={{
        textInputContainer: { width: '100%' },
        textInput: { height: 38, color: '#5d5d5d', fontSize: 16 },
        predefinedPlacesDescription: { color: '#1faadb' },
        listView: { backgroundColor: 'white' },
      }}
      enablePoweredByContainer={false}
      currentLocation={false}
    />
  );
}
