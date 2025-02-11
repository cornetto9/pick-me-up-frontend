import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

const GooglePlacesInput = ({ onAddressSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search for an address"
      fetchDetails={true}
      // placeholderTextColor="#888"
      onPress={(data, details = null) => {
        if (details && details.geometry) {
          const { lat, lng } = details.geometry.location;
          const formattedAddress = data.description || details.formatted_address;

          // console.log("✅ Address Selected:", formattedAddress);
          // console.log("✅ Coordinates:", { lat, lng });

          onAddressSelected({
            address: formattedAddress,
            latitude: lat.toString(),
            longitude: lng.toString(),
          });
        } else {
          console.warn("⚠️ Error: Details not fetched properly.");
        }
      }}
      placeholderTextColor="#888"
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
          // marginLeft: 5,
          height: 40,
        },
        textInput: {
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: '#f0f0f0',
          fontSize: 16,
          marginBottom: 10,
        },
        listView: {
          maxHeight: 150,  // ✅ Limit dropdown height (so it doesn't take too much space)
          backgroundColor: '#fff',
          borderRadius: 5,
          elevation: 3, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          
        },
        
      }}
      enablePoweredByContainer={false}
      currentLocation={false}
      numberOfLines={3}  // ✅ Limits dropdown list size
      minLength={2}  // ✅ Dropdown appears only after 2+ characters are typed
    />
  );
};

export default GooglePlacesInput;