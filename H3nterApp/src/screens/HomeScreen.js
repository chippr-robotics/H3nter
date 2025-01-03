import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getProfile, getProfilesByDids } from '../services/bluesky';

export default function HomeScreen({ navigation }) {
  const [myProfile, setMyProfile] = useState(null); // Current user profile
  const [nearbyProfiles, setNearbyProfiles] = useState([]); // List of nearby user profiles
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user's profile
        const profile = await getProfile();
        setMyProfile(profile);

        // Simulate nearby DIDs (replace this with real DID discovery logic)
        const simulatedDIDs = [
          'did:plc:abc123',
          'did:plc:def456',
          'did:plc:ghi789',
        ];

        // Fetch profiles for the nearby DIDs
        const profiles = await getProfilesByDids(simulatedDIDs);
        setNearbyProfiles(profiles);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderProfile = ({ item }) => (
    <View style={styles.profileCard}>
      <Text style={styles.profileName}>{item.displayName || 'Unknown User'}</Text>
      <Text style={styles.profileHandle}>@{item.handle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.header}>Welcome, {myProfile?.displayName || 'User'}!</Text>
          <FlatList
            data={nearbyProfiles}
            keyExtractor={(item) => item.did}
            renderItem={renderProfile}
            ListEmptyComponent={<Text style={styles.emptyText}>No nearby profiles found.</Text>}
          />
        </>
      )}
      <Button title="Enter AR Mode" onPress={() => navigation.navigate('AR')} />
      <Button title="Logout" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHandle: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    color: '#aaa',
  },
});
