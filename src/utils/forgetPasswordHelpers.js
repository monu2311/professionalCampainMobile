import { Alert } from 'react-native';
import { sanitizeEmail, isValidEmailFormat } from './forgetPasswordValidation';

/**
 * Helper functions for forget password functionality
 * Utility functions for navigation, alerts, and data processing
 */

/**
 * Navigation helper constants
 */
export const FORGET_PASSWORD_ROUTES = {
  LOGIN: 'Login',
  SIGNUP: 'singup',
  FORGET_PASSWORD: 'ForgetPassword',
};

/**
 * Alert configurations for different scenarios
 */
export const ALERT_CONFIGS = {
  SUCCESS: {
    title: 'Password Reset Sent',
    message: 'Password reset instructions have been sent to your email address.',
    type: 'success',
  },
  ERROR: {
    NETWORK: {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
    },
    EMAIL_NOT_FOUND: {
      title: 'Email Not Found',
      message: 'No account found with this email address.',
    },
    TOO_MANY_REQUESTS: {
      title: 'Too Many Requests',
      message: 'Please wait a few minutes before requesting another reset.',
    },
    SERVER_ERROR: {
      title: 'Server Error',
      message: 'Our servers are experiencing issues. Please try again later.',
    },
    GENERAL: {
      title: 'Reset Failed',
      message: 'Please check your email and try again.',
    },
  },
};

/**
 * Show success alert with navigation callback
 * @param {string} message - Success message to display
 * @param {Function} onConfirm - Callback function when user confirms
 */
export const showSuccessAlert = (message, onConfirm) => {
  Alert.alert(
    ALERT_CONFIGS.SUCCESS.title,
    message || ALERT_CONFIGS.SUCCESS.message,
    [
      {
        text: 'OK',
        style: 'default',
        onPress: onConfirm,
      }
    ],
    { cancelable: true }
  );
};

/**
 * Show error alert
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
export const showErrorAlert = (title, message) => {
  Alert.alert(
    title || ALERT_CONFIGS.ERROR.GENERAL.title,
    message || ALERT_CONFIGS.ERROR.GENERAL.message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

/**
 * Show confirmation alert before password reset
 * @param {string} email - Email address to reset
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 */
export const showResetConfirmationAlert = (email, onConfirm, onCancel) => {
  Alert.alert(
    'Confirm Password Reset',
    `Send password reset instructions to ${email}?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Send',
        style: 'default',
        onPress: onConfirm,
      }
    ],
    { cancelable: true }
  );
};

/**
 * Process and validate email input
 * @param {string} email - Raw email input
 * @returns {Object} Processed email data
 */
export const processEmailInput = (email) => {
  const sanitized = sanitizeEmail(email);
  const isValid = isValidEmailFormat(sanitized);

  return {
    original: email,
    sanitized,
    isValid,
    isEmpty: !sanitized || sanitized.length === 0,
  };
};

/**
 * Generate error message based on error type and status
 * @param {Object} error - Error object from API
 * @returns {Object} Error configuration with title and message
 */
export const getErrorConfig = (error) => {
  if (!error) return ALERT_CONFIGS.ERROR.GENERAL;

  const status = error?.response?.status;
  const code = error?.code;

  if (status === 404) {
    return ALERT_CONFIGS.ERROR.EMAIL_NOT_FOUND;
  } else if (status === 429) {
    return ALERT_CONFIGS.ERROR.TOO_MANY_REQUESTS;
  } else if (status === 500 || status >= 500) {
    return ALERT_CONFIGS.ERROR.SERVER_ERROR;
  } else if (code === 'NETWORK_ERROR' || !error?.response) {
    return ALERT_CONFIGS.ERROR.NETWORK;
  } else if (error?.response?.data?.message) {
    return {
      title: 'Reset Failed',
      message: error.response.data.message,
    };
  }

  return ALERT_CONFIGS.ERROR.GENERAL;
};

/**
 * Handle navigation after password reset
 * @param {Object} navigation - React Navigation object
 * @param {string} route - Route to navigate to
 * @param {Object} params - Optional navigation parameters
 */
export const handleNavigationAfterReset = (navigation, route = FORGET_PASSWORD_ROUTES.LOGIN, params = {}) => {
  try {
    navigation.navigate(route, params);
  } catch (error) {
    console.warn('Navigation error after password reset:', error);
    // Fallback navigation
    navigation.goBack();
  }
};

/**
 * Format email for display (mask middle part for privacy)
 * @param {string} email - Email to format
 * @returns {string} Formatted email
 */
export const formatEmailForDisplay = (email) => {
  if (!email || !isValidEmailFormat(email)) return email;

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 3) {
    return email;
  }

  const visibleStart = localPart.substring(0, 2);
  const visibleEnd = localPart.substring(localPart.length - 1);
  const maskedPart = '*'.repeat(Math.min(localPart.length - 3, 4));

  return `${visibleStart}${maskedPart}${visibleEnd}@${domain}`;
};

/**
 * Debounce function for form validation
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Check if password reset is allowed based on rate limiting
 * @param {number} attempts - Number of previous attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {boolean} True if reset is allowed
 */
export const isResetAllowed = (attempts, maxAttempts = 3) => {
  return attempts < maxAttempts;
};

/**
 * Get rate limiting message
 * @param {number} attempts - Current attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {string} Rate limiting message
 */
export const getRateLimitMessage = (attempts, maxAttempts = 3) => {
  const remaining = maxAttempts - attempts;

  if (remaining <= 0) {
    return 'Too many reset attempts. Please wait before trying again.';
  } else if (remaining === 1) {
    return 'You have 1 attempt remaining.';
  } else {
    return `You have ${remaining} attempts remaining.`;
  }
};