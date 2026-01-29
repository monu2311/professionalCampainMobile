import { showMessage } from 'react-native-flash-message';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

/**
 * Message Helper Utilities
 * Centralized messaging system with consistent styling and behavior
 */

/**
 * Default message configurations for different types
 */
export const MESSAGE_CONFIGS = {
  SUCCESS: {
    type: 'success',
    icon: 'success',
    duration: 3000,
    floating: true,
    titleStyle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: '#fff',
    },
    textStyle: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: TYPOGRAPHY.QUICKREGULAR,
      color: '#fff',
    },
    backgroundColor: COLORS.successDark,
    position: 'top',
  },
  ERROR: {
    type: 'danger',
    icon: 'danger',
    duration: 4000,
    floating: true,
    titleStyle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: '#fff',
    },
    textStyle: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: TYPOGRAPHY.QUICKREGULAR,
      color: '#fff',
    },
    backgroundColor: COLORS.red,
    position: 'top',
  },
  WARNING: {
    type: 'warning',
    icon: 'warning',
    duration: 3500,
    floating: true,
    titleStyle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: '#333',
    },
    textStyle: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: TYPOGRAPHY.QUICKREGULAR,
      color: '#333',
    },
    backgroundColor: '#fff3cd',
    position: 'top',
  },
  INFO: {
    type: 'info',
    icon: 'info',
    duration: 3000,
    floating: true,
    titleStyle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: '#fff',
    },
    textStyle: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: TYPOGRAPHY.QUICKREGULAR,
      color: '#fff',
    },
    backgroundColor: COLORS.specialTextColor,
    position: 'top',
  },
};

/**
 * Show success message with consistent styling
 * @param {string} title - Message title
 * @param {string} description - Message description
 * @param {Object} customConfig - Optional custom configuration
 */
export const showSuccessMessage = (title, description, customConfig = {}) => {
  showMessage({
    message: title,
    description: description,
    ...MESSAGE_CONFIGS.SUCCESS,
    ...customConfig,
  });
};

/**
 * Show error message with consistent styling
 * @param {string} title - Message title
 * @param {string} description - Message description
 * @param {Object} customConfig - Optional custom configuration
 */
export const showErrorMessage = (title, description, customConfig = {}) => {
  showMessage({
    message: title,
    description: description,
    ...MESSAGE_CONFIGS.ERROR,
    ...customConfig,
  });
};

/**
 * Show warning message with consistent styling
 * @param {string} title - Message title
 * @param {string} description - Message description
 * @param {Object} customConfig - Optional custom configuration
 */
export const showWarningMessage = (title, description, customConfig = {}) => {
  showMessage({
    message: title,
    description: description,
    ...MESSAGE_CONFIGS.WARNING,
    ...customConfig,
  });
};

/**
 * Show info message with consistent styling
 * @param {string} title - Message title
 * @param {string} description - Message description
 * @param {Object} customConfig - Optional custom configuration
 */
export const showInfoMessage = (title, description, customConfig = {}) => {
  showMessage({
    message: title,
    description: description,
    ...MESSAGE_CONFIGS.INFO,
    ...customConfig,
  });
};

/**
 * Pre-configured messages for common scenarios
 */
export const COMMON_MESSAGES = {
  // Success messages
  PASSWORD_RESET_SENT: {
    title: 'Password Reset Sent',
    description: 'Password reset instructions have been sent to your email address.',
  },
  EMAIL_VERIFIED: {
    title: 'Email Verified',
    description: 'Your email address has been successfully verified.',
  },
  PROFILE_UPDATED: {
    title: 'Profile Updated',
    description: 'Your profile has been successfully updated.',
  },

  // Error messages
  NETWORK_ERROR: {
    title: 'Connection Error',
    description: 'Please check your internet connection and try again.',
  },
  EMAIL_NOT_FOUND: {
    title: 'Email Not Found',
    description: 'No account found with this email address.',
  },
  INVALID_CREDENTIALS: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect.',
  },
  SERVER_ERROR: {
    title: 'Server Error',
    description: 'Our servers are experiencing issues. Please try again later.',
  },
  TOO_MANY_REQUESTS: {
    title: 'Too Many Requests',
    description: 'Please wait a few minutes before trying again.',
  },

  // Warning messages
  UNSAVED_CHANGES: {
    title: 'Unsaved Changes',
    description: 'You have unsaved changes that will be lost.',
  },
  RATE_LIMIT_WARNING: {
    title: 'Rate Limit Warning',
    description: 'You are approaching the request limit.',
  },

  // Info messages
  EMAIL_SENT: {
    title: 'Email Sent',
    description: 'Please check your email for further instructions.',
  },
  PROCESSING: {
    title: 'Processing',
    description: 'Your request is being processed.',
  },
};

/**
 * Show common success messages
 */
export const showPasswordResetSent = () => {
  showSuccessMessage(
    COMMON_MESSAGES.PASSWORD_RESET_SENT.title,
    COMMON_MESSAGES.PASSWORD_RESET_SENT.description
  );
};

export const showEmailVerified = () => {
  showSuccessMessage(
    COMMON_MESSAGES.EMAIL_VERIFIED.title,
    COMMON_MESSAGES.EMAIL_VERIFIED.description
  );
};

export const showProfileUpdated = () => {
  showSuccessMessage(
    COMMON_MESSAGES.PROFILE_UPDATED.title,
    COMMON_MESSAGES.PROFILE_UPDATED.description
  );
};

/**
 * Show common error messages
 */
export const showNetworkError = () => {
  showErrorMessage(
    COMMON_MESSAGES.NETWORK_ERROR.title,
    COMMON_MESSAGES.NETWORK_ERROR.description
  );
};

export const showEmailNotFound = () => {
  showErrorMessage(
    COMMON_MESSAGES.EMAIL_NOT_FOUND.title,
    COMMON_MESSAGES.EMAIL_NOT_FOUND.description
  );
};

export const showInvalidCredentials = () => {
  showErrorMessage(
    COMMON_MESSAGES.INVALID_CREDENTIALS.title,
    COMMON_MESSAGES.INVALID_CREDENTIALS.description
  );
};

export const showServerError = () => {
  showErrorMessage(
    COMMON_MESSAGES.SERVER_ERROR.title,
    COMMON_MESSAGES.SERVER_ERROR.description
  );
};

export const showTooManyRequests = () => {
  showErrorMessage(
    COMMON_MESSAGES.TOO_MANY_REQUESTS.title,
    COMMON_MESSAGES.TOO_MANY_REQUESTS.description
  );
};

/**
 * Show message with auto-navigation
 * @param {string} type - Message type (success, error, warning, info)
 * @param {string} title - Message title
 * @param {string} description - Message description
 * @param {Function} navigationCallback - Function to call after delay
 * @param {number} delay - Delay before calling navigation (ms)
 */
export const showMessageWithNavigation = (type, title, description, navigationCallback, delay = 2500) => {
  const messageFunction = {
    success: showSuccessMessage,
    error: showErrorMessage,
    warning: showWarningMessage,
    info: showInfoMessage,
  }[type] || showInfoMessage;

  messageFunction(title, description);

  if (navigationCallback && typeof navigationCallback === 'function') {
    setTimeout(navigationCallback, delay);
  }
};

/**
 * Clear all messages
 */
export const clearAllMessages = () => {
  // Note: react-native-flash-message doesn't have a built-in clear all method
  // This is a placeholder for future implementation if needed
  console.log('Clear all messages requested');
};