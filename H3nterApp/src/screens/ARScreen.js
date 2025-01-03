// src/screens/ARScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, Button } from 'react-native';
import { getOrCreateDID } from '../services/did'; 
import Geolocation from '@react-native-community/geolocation';
import { getH3Cell } from '../services/h3';
import { getProfilesByCell } from '../services/gun';

export default function ARScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const webviewRef = useRef(null);

  useEffect(() => {
    // Get current H3 cell again and subscribe
    Geolocation.getCurrentPosition(info => {
      const { latitude, longitude } = info.coords;
      const cell = getH3Cell(latitude, longitude, 9);
      getProfilesByCell(cell, (didKey, data) => {
        // format an array: { did, avatarUrl, displayName }
        setProfiles(prev => {
          const updated = {...prev, [didKey]: { did: didKey, ...data }};
          return updated;
        });
      });
    });
  }, []);

  // Once profiles state updates, send data to the WebView
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify(Object.values(profiles)));
    }
  }, [profiles]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'file:///android_asset/index.html' }}
        // For iOS or if you placed the file in a different place, adjust accordingly
        // e.g. source={require('../../webview/index.html')}
        javaScriptEnabled={true}
        onMessage={(event) => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
      />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
