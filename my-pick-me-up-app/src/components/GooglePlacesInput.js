import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

export default function GooglePlacesInput() {
  return (
    <GooglePlacesAutocomplete 
      placeholder='address'
      onPress={(data, details = null) => {
        console.log(data, details);
      }}
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
        // types: '(cities)'
      }}
      styles={{
        textInputContainer: {
          width: '100%',
        },
        textInput: {
          height: 38,
          color: '#5d5d5d',
          fontSize: 16,
        },
      }}
    />
  );
}