import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { restoreSession } from './src/services/bluesky';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const initSession = async () => {
      const session = await restoreSession();
      if (session) {
        console.log('Session restored:', session);
      } else {
        console.log('No session found, login required.');
      }
    };
    initSession();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
