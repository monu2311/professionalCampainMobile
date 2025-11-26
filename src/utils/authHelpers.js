import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication Helper Utilities
 * Handles token management, storage, and auth-related operations
 */

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'ChapToken',
  ACCOUNT_STEP: 'account_step',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
};

/**
 * Store authentication token securely
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} Success status
 */
export const storeAuthToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error storing auth token:', error);
    return false;
  }
};

/**
 * Retrieve authentication token
 * @returns {Promise<string|null>} Token or null
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Store account step for navigation flow
 * @param {number} step - Account setup step
 * @returns {Promise<boolean>} Success status
 */
export const storeAccountStep = async (step) => {
  try {
    if (typeof step !== 'number') {
      throw new Error('Account step must be a number');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT_STEP, String(step));
    return true;
  } catch (error) {
    console.error('Error storing account step:', error);
    return false;
  }
};

/**
 * Get current account step
 * @returns {Promise<number|null>} Account step or null
 */
export const getAccountStep = async () => {
  try {
    const step = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT_STEP);
    return step ? parseInt(step, 10) : null;
  } catch (error) {
    console.error('Error retrieving account step:', error);
    return null;
  }
};

/**
 * Store user data
 * @param {Object} userData - User information
 * @returns {Promise<boolean>} Success status
 */
export const storeUserData = async (userData) => {
  try {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Valid user data object is required');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

/**
 * Get stored user data
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 * @returns {Promise<boolean>} Success status
 */
export const clearAuthData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const isAuthenticated = async () => {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Set remember me preference
 * @param {boolean} remember - Remember user preference
 * @returns {Promise<boolean>} Success status
 */
export const setRememberMe = async (remember) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
    return true;
  } catch (error) {
    console.error('Error setting remember me:', error);
    return false;
  }
};

/**
 * Get remember me preference
 * @returns {Promise<boolean>} Remember me preference
 */
export const getRememberMe = async () => {
  try {
    const remember = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return remember === 'true';
  } catch (error) {
    console.error('Error getting remember me preference:', error);
    return false;
  }
};

/**
 * Validate token format (basic JWT structure check)
 * @param {string} token - Token to validate
 * @returns {boolean} Validation result
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Basic JWT format check (3 parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Handle authentication success
 * @param {Object} authData - Authentication response data
 * @returns {Promise<boolean>} Success status
 */
export const handleAuthSuccess = async (authData) => {
  try {
    const { token, details } = authData;

    if (!token || !details) {
      throw new Error('Invalid authentication data');
    }

    // Store authentication data
    await storeAuthToken(token);
    await storeAccountStep(details.account_step || 0);
    await storeUserData(details);

    return true;
  } catch (error) {
    console.error('Error handling auth success:', error);
    return false;
  }
};