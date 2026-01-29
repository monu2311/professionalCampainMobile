import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { Forget } from '../reduxSlice/apiSlice';
import { validateForm, forgetPasswordValidationSchema } from '../utils/forgetPasswordValidation';

/**
 * Custom hook for forget password functionality
 * Handles password reset process, validation, error handling, and navigation
 */
export const useForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetAttempts, setResetAttempts] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * Show user-friendly error message using flash message
   */
  const showErrorMessage = (title, message) => {
    showMessage({
      message: title || 'Reset Password Error',
      description: message || 'Please check your email and try again.',
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
   * Show success message using flash message
   */
  const showSuccessMessage = (message) => {
    showMessage({
      message: 'Password Reset Sent',
      description: message || 'Password reset instructions have been sent to your email.',
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

    // Auto-navigate to login after showing success message
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2500);
  };

  /**
   * Handle API errors with user-friendly messages
   */
  const handleResetError = (error) => {
    console.error('Password reset error:', error);

    let title = 'Reset Failed';
    let message = 'Please check your email and try again.';

    if (error == "Error: This Email does not exists !") {
      title = 'Email Not Found';
      message = 'No account found with this email address.';
    } else if (error?.response?.status === 429) {
      title = 'Too Many Requests';
      message = 'Please wait a few minutes before requesting another reset.';
    } else if (error?.response?.status === 500) {
      title = 'Server Error';
      message = 'Our servers are experiencing issues. Please try again later.';
    } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      title = 'Connection Error';
      message = 'Please check your internet connection and try again.';
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    showErrorMessage(title, message);
    setResetAttempts(prev => prev + 1);
  };

  /**
   * Main forget password function
   */
  const performPasswordReset = async (values) => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validate form data
      const validation = await validateForm(values, forgetPasswordValidationSchema);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return false;
      }

      // Perform password reset API call
      const response = await dispatch(Forget(values));
      console.log("response",response)

      // Check response status
      if (response?.status !== "1") {
        throw new Error(response?.message || 'Password reset failed');
      }

      // Show success message and navigate
      showSuccessMessage('Password reset instructions have been sent to your email address.');

      // Reset attempts on success
      setResetAttempts(0);

      return {
        success: true,
        message: 'Password reset email sent successfully',
      };

    } catch (error) {
      handleResetError(error);
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate field in real-time
   */
  const validateField = (fieldName, value) => {
    try {
      forgetPasswordValidationSchema.validateSyncAt(fieldName, { [fieldName]: value });
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
   * Check if too many reset attempts
   */
  const isTooManyAttempts = () => {
    return resetAttempts >= 3;
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
   * Navigate back to login
   */
  const navigateToLogin = () => {
    navigation.navigate('Login');
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
    resetAttempts,

    // Actions
    performPasswordReset,
    validateField,
    clearFieldError,
    clearAllErrors,

    // Navigation
    navigateToLogin,
    navigateToSignUp,

    // Utilities
    getFieldState,
    isTooManyAttempts: isTooManyAttempts(),

    // Message functions
    showErrorMessage,
    showSuccessMessage,
  };
};