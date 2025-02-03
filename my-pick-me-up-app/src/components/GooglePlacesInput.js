import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

const GooglePlacesInput = ({ onAddressSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search for an address"
      fetchDetails={true}
      onPress={(data, details = null) => {
        if (details && details.geometry) {
          const { lat, lng } = details.geometry.location;
          const formattedAddress = data.description || details.formatted_address;

          console.log("✅ Address Selected:", formattedAddress);
          console.log("✅ Coordinates:", { lat, lng });

          onAddressSelected({
            address: formattedAddress,
            latitude: lat.toString(),
            longitude: lng.toString(),
          });
        } else {
          console.warn("⚠️ Error: Details not fetched properly.");
        }
      }}
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
      }}
      styles={{
        textInputContainer: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          width: '100%',
        },
        textInput: {
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          fontSize: 16,
          backgroundColor: '#fff',
        },
        listView: {
          backgroundColor: '#fff',
          borderRadius: 5,
          marginTop: 5,
          elevation: 3, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
      }}
      enablePoweredByContainer={false}
      currentLocation={false}
    />
  );
};

export default GooglePlacesInput;