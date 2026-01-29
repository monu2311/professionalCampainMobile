import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { login, search, getChatAllUser } from '../reduxSlice/apiSlice';
import { fetchAllAPIs, fetchPlans, fetchProfile } from '../apiConfig/Services';
import { handleAuthSuccess } from '../utils/authHelpers';
import { navigatePostLogin } from '../utils/navigationHelper';
import { validateForm, loginValidationSchema } from '../utils/loginValidation';

/**
 * Custom hook for login functionality
 * Handles login process, validation, error handling, and post-login flow
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * Show user-friendly error message
   */
  const showErrorAlert = (title, message) => {
    Alert.alert(
      title || 'Login Error',
      message || 'Please check your credentials and try again.',
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  };

  /**
   * Show success message
   */
  const showSuccessAlert = (message) => {
    Alert.alert(
      'Success',
      message || 'Login successful!',
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  };

  /**
   * Handle API errors with user-friendly messages
   */
  const handleLoginError = (error) => {
    console.error('Login error:', error);

    let title = 'Login Failed';
    let message = 'Please check your credentials and try again.';

    if (error?.response?.status === 401) {
      title = 'Invalid Credentials';
      message = 'The username or password you entered is incorrect.';
    } else if (error?.response?.status === 429) {
      title = 'Too Many Attempts';
      message = 'Please wait a few minutes before trying again.';
    } else if (error?.response?.status === 500) {
      title = 'Server Error';
      message = 'Our servers are experiencing issues. Please try again later.';
    } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      title = 'Connection Error';
      message = 'Please check your internet connection and try again.';
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    showErrorAlert(title, message);
    setLoginAttempts(prev => prev + 1);
  };

  /**
   * Perform post-login data fetching
   */
  const performPostLoginTasks = async () => {
    try {
      // Fetch essential app data in parallel
      await Promise.allSettled([
        fetchAllAPIs(dispatch),
        fetchPlans(dispatch),
        fetchProfile(dispatch),
        dispatch(search({})),
        dispatch(getChatAllUser({})),
      ]);
    } catch (error) {
      console.warn('Some post-login tasks failed:', error);
      // Don't block login flow for non-critical tasks
    }
  };

  /**
   * Main login function
   */
  const performLogin = async (values) => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validate form data
      const validation = await validateForm(values, loginValidationSchema);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return false;
      }

      // Perform login API call
      const response = await dispatch(login(values));

      // Check response status
      if (response?.status !== 200) {
        throw new Error(response?.message || 'Login failed');
      }

      // Extract data from response
      const { data } = response;
      if (!data?.token || !data?.details) {
        throw new Error('Invalid response format');
      }

      // Store authentication data
      const authSuccess = await handleAuthSuccess(data);
      if (!authSuccess) {
        throw new Error('Failed to store authentication data');
      }

      // Perform post-login tasks
      await performPostLoginTasks();

      // Navigate to appropriate screen
      const navigationSuccess = navigatePostLogin(data.details, navigation);
      if (!navigationSuccess) {
        console.warn('Navigation failed, but login was successful');
      }

      // Reset login attempts on success
      setLoginAttempts(0);

      return {
        success: true,
        user: data.details,
        token: data.token,
      };

    } catch (error) {
      handleLoginError(error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate field in real-time
   */
  const validateField = async (fieldName, value) => {
    try {
      await loginValidationSchema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: null }));
      return null;
    } catch (error) {
      const errorMessage = error.message;
      setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
      return errorMessage;
    }
  };

  /**
   * Clear specific field error
   */
  const clearFieldError = (fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  };

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    setErrors({});
  };

  /**
   * Check if too many login attempts
   */
  const isTooManyAttempts = () => {
    return loginAttempts >= 5;
  };

  /**
   * Get field validation state
   */
  const getFieldState = (fieldName, value, touched) => {
    const hasError = touched && errors[fieldName];
    const isValid = touched && !errors[fieldName] && value;

    return {
      hasError: !!hasError,
      isValid: !!isValid,
      errorMessage: hasError ? errors[fieldName] : null,
    };
  };

  /**
   * Navigate to forgot password
   */
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  /**
   * Navigate to sign up
   */
  const navigateToSignUp = () => {
    navigation.navigate('singup');
  };

  return {
    // State
    isLoading,
    errors,
    loginAttempts,

    // Actions
    performLogin,
    validateField,
    clearFieldError,
    clearAllErrors,

    // Navigation
    navigateToForgotPassword,
    navigateToSignUp,

    // Utilities
    getFieldState,
    isTooManyAttempts: isTooManyAttempts(),

    // Alert functions
    showErrorAlert,
    showSuccessAlert,
  };
};