import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from './config';

const STORAGE_KEYS = CONFIG.STORAGE_KEYS;

export interface UserData {
  _id: string;
  name: string;
  email: string;
  civilID: string;
  specialization: string;
  licenseNum: string;
  YOEX: number;
  hospitalOrClinicName?: string;
  phoneNum: string;
  profileImage?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class AuthStorage {
  /**
   * Store authentication token
   */
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }

  /**
   * Get authentication token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Store user data
   */
  async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Get user data
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return !!(token && isLoggedIn === 'true');
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.IS_LOGGED_IN,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Login user (store token and user data)
   */
  async login(token: string, userData: UserData): Promise<void> {
    await this.setAuthToken(token);
    await this.setUserData(userData);
  }

  /**
   * Logout user (clear all data)
   */
  async logout(): Promise<void> {
    await this.clearAuth();
  }
}

// Export singleton instance
export const authStorage = new AuthStorage();
