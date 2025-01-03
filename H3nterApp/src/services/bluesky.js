// src/services/bluesky.js
import { BskyAgent } from '@atproto/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const agent = new BskyAgent({
  service: 'https://bsky.social', // The Bluesky service URL
});

const STORAGE_KEYS = {
  SESSION: 'BLUESKY_SESSION',
};

/**
 * Log in a user and store the session
 * @param {string} handle - The user's Bluesky handle (e.g., username.bsky.social)
 * @param {string} password - The user's Bluesky password
 */
export async function login(handle, password) {
  try {
    const { success, data } = await agent.login({ identifier: handle, password });
    if (success) {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data));
      return data;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

/**
 * Restore a session from local storage
 */
export async function restoreSession() {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      const sessionData = JSON.parse(session);
      agent.resumeSession(sessionData);
      return sessionData;
    }
    return null;
  } catch (error) {
    console.error('Error restoring session:', error);
    return null;
  }
}

/**
 * Log out the user and clear the session
 */
export async function logout() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    agent.session = null;
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

/**
 * Get the current user's profile
 */
export async function getProfile() {
  try {
    if (!agent.session) {
      throw new Error('No active session');
    }
    const { success, data } = await agent.getProfile({ actor: agent.session.did });
    if (success) {
      return data;
    } else {
      throw new Error('Failed to fetch profile');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Get profiles of other users by their DIDs
 * @param {string[]} dids - Array of DIDs to fetch profiles for
 */
export async function getProfilesByDids(dids) {
  try {
    const { success, data } = await agent.getProfiles({ actors: dids });
    if (success) {
      return data;
    } else {
      throw new Error('Failed to fetch profiles');
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
}

export default agent;
