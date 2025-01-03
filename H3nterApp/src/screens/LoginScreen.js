import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { login, restoreSession, getProfile } from '../services/bluesky';

export default function LoginScreen({ navigation }) {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const session = await login(handle, password);
      console.log('Logged in session:', session);
      Alert.alert('Login Successful', `Welcome, ${session.handle}`);
      const profile = await getProfile();
      console.log('User profile:', profile);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login to Bluesky</Text>
      <TextInput
        placeholder="Handle (e.g., username.bsky.social)"
        value={handle}
        onChangeText={setHandle}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
