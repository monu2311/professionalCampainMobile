import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { login, search, getChatAllUser } from '../reduxSlice/apiSlice';
import { fetchAllAPIs, fetchPlans, fetchProfile } from '../apiConfig/Services';
import { handleAuthSuccess, storeMembershipStatus } from '../utils/authHelpers';
import { navigatePostLogin } from '../utils/navigationHelper';
import membershipService from '../services/MembershipService';
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
   * Show user-friendly error message using toast
   */
  const showErrorAlert = (title, message) => {
    showMessage({
      message: title || 'Login Error',
      description: message || 'Please check your credentials and try again.',
      type: 'danger',
      icon: 'danger',
      duration: 4000,
      floating: true,
      titleStyle: {
        fontSize: 16,
        fontWeight: '600',
      },
      textStyle: {
        fontSize: 14,
        fontWeight: '400',
      }
    });
  };

  /**
   * Show success message using toast
   */
  const showSuccessAlert = (message) => {
    showMessage({
      message: 'Success',
      description: message || 'Login successful!',
      type: 'success',
      icon: 'success',
      duration: 3000,
      floating: true,
      titleStyle: {
        fontSize: 16,
        fontWeight: '600',
      },
      textStyle: {
        fontSize: 14,
        fontWeight: '400',
      }
    });
  };

  /**
   * Handle API errors with user-friendly messages
   */
  const handleLoginError = (error) => {
    console.error('Login error:', error);

    let title = 'Login Failed';
    let message = 'Please check your credentials and try again.';

    // First check if there's a direct message from the server
    if (error?.message && typeof error.message === 'string') {
      // This handles messages like "Password or Email is Incorrect!"
      message = error.message;
      title = 'Authentication Error';
    } else if (error?.response?.status === 401) {
      title = 'Invalid Credentials';
      message = error?.response?.data?.message || 'The username or password you entered is incorrect.';
    } else if (error?.response?.status === 429) {
      title = 'Too Many Attempts';
      message = 'Please wait a few minutes before trying again.';
    } else if (error?.response?.status === 500) {
      title = 'Server Error';
      message = 'Our servers are experiencing issues. Please try again later.';
    } else if (error?.response?.data?.message) {
      // Server provided error message
      message = error.response.data.message;
    } else if (error?.code === 'NETWORK_ERROR' || (!error?.response && !error?.message)) {
      // Only show connection error if there's truly no response and no message
      title = 'Connection Error';
      message = 'Please check your internet connection and try again.';
    } else if (!error?.response && !error?.message) {
      // Fallback for unknown errors
      title = 'Something went wrong';
      message = 'An unexpected error occurred. Please try again.';
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
        dispatch(search({
          city: null,
          category: null,
          filter_type: null,
          page: 1,
          page_size: 32
        })),
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
      console.log("login response",response)

      // Check response status
      if (response?.status !== 200) {
        // Create an error object with the server message
        const error = new Error(response?.message || 'Login failed');
        error.message = response?.message || 'Login failed';
        error.response = response;
        throw error;
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

      // Initialize membership service with login data
      await membershipService.initialize(data.details);

      // Store membership status
      await storeMembershipStatus({
        has_active_membership: data.details.has_active_membership,
        is_user_can_logged_in: data.details.is_user_can_logged_in,
        profile_type: data.details.profile_type,
      });

      // Perform post-login tasks
       performPostLoginTasks();

      // Navigate based on membership status
      const navigationDestination = await membershipService.getNavigationDestination(
        data.details.account_step,
        data.details.status
      );

      // Use the navigation helper with the determined destination
      navigation.reset({
        index: 0,
        routes: [{ name: navigationDestination }],
      });

      console.log('Login successful, navigating to:', navigationDestination);

      // Reset login attempts on success
      setLoginAttempts(0);

      return {
        success: true,
        user: data.details,
        token: data.token,
      };

    } catch (error) {
      handleLoginError(error);
      console.log("login error",error)
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