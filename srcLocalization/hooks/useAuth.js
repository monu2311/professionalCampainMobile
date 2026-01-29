import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  getAuthToken,
  getUserData,
  clearAuthData,
  isAuthenticated,
  getRememberMe,
  setRememberMe as setRememberMeStorage
} from '../utils/authHelpers';
import { navigatePostLogin, resetToLogin } from '../utils/navigationHelper';

/**
 * Custom hook for authentication management
 * Handles authentication state, token management, and auth operations
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);
  const dispatch = useDispatch();

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const authenticated = await isAuthenticated();

      if (authenticated) {
        const userData = await getUserData();
        const rememberMePreference = await getRememberMe();

        setIsLoggedIn(true);
        setUser(userData);
        setRememberMeState(rememberMePreference);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRememberMeState(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update authentication state after successful login
   */
  const updateAuthState = async (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);

      // Store remember me preference
      await setRememberMeStorage(rememberMe);
    } catch (error) {
      console.error('Error updating auth state:', error);
    }
  };

  /**
   * Logout user and clear all data
   */
  const logout = async (navigation) => {
    try {
      setIsLoading(true);

      // Clear all authentication data
      await clearAuthData();

      // Update state
      setIsLoggedIn(false);
      setUser(null);
      setRememberMeState(false);

      // Navigate to login
      if (navigation) {
        resetToLogin(navigation);
      }

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user has completed profile setup
   */
  const isProfileComplete = () => {
    return user?.status === true || user?.account_step >= 7;
  };

  /**
   * Get user's profile type
   */
  const getProfileType = () => {
    return user?.profile_type || null;
  };

  /**
   * Check if user is a member
   */
  const isMember = () => {
    return user?.profile_type === 2;
  };

  /**
   * Check if user is a companion
   */
  const isCompanion = () => {
    return user?.profile_type === 1;
  };

  /**
   * Check if user has purchased a plan (for members)
   */
  const hasPurchasedPlan = () => {
    return user?.is_plan_purchased === true;
  };

  /**
   * Get current account setup step
   */
  const getCurrentStep = () => {
    return user?.account_step || 0;
  };

  /**
   * Set remember me preference
   */
  const setRememberMe = (value) => {
    setRememberMeState(value);
  };

  /**
   * Refresh user data
   */
  const refreshUserData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  /**
   * Check authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated && isLoggedIn) {
        // User was logged out externally
        setIsLoggedIn(false);
        setUser(null);
      }
      return authenticated;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    // State
    isLoggedIn,
    user,
    isLoading,
    rememberMe,

    // Actions
    updateAuthState,
    logout,
    setRememberMe,
    refreshUserData,
    checkAuthStatus,

    // Computed values
    isProfileComplete: isProfileComplete(),
    profileType: getProfileType(),
    isMember: isMember(),
    isCompanion: isCompanion(),
    hasPurchasedPlan: hasPurchasedPlan(),
    currentStep: getCurrentStep(),
  };
};