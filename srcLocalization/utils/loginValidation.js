import * as Yup from 'yup';
import { getLoginValidationSchema, getEnhancedLoginValidationSchema } from './validation/schemas/loginSchema';

/**
 * Login Form Validation Schema
 * Comprehensive validation for login form fields
 */

/**
 * Username/Email validation schema
 * Supports both username and email formats
 */
const usernameValidation = Yup.string()
  .required('Username or email is required')
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must not exceed 50 characters')
  .test('username-or-email', 'Please enter a valid username or email', function(value) {
    if (!value) return false;

    // Check if it's an email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (emailRegex.test(value)) {
      return true;
    }

    // Check if it's a valid username format
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(value);
  });

/**
 * Password validation schema
 * Basic password requirements for login
 */
const passwordValidation = Yup.string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password must not exceed 128 characters');

/**
 * Main login validation schema
 */
export const loginValidationSchema = Yup.object().shape({
  user_name: usernameValidation,
  password: passwordValidation,
});

/**
 * Enhanced login validation schema with additional security checks
 */
export const enhancedLoginValidationSchema = Yup.object().shape({
  user_name: usernameValidation,
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  rememberMe: Yup.boolean().default(false),
});

/**
 * Validation for forgot password form
 */
export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
});

/**
 * Validation for reset password form
 */
export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  token: Yup.string()
    .required('Reset token is required')
    .min(6, 'Invalid reset token'),
});

/**
 * Custom validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: {
    USERNAME: 'Username or email is required',
    PASSWORD: 'Password is required',
    EMAIL: 'Email is required',
  },
  FORMAT: {
    EMAIL: 'Please enter a valid email address',
    USERNAME: 'Username can only contain letters, numbers, dots, hyphens, and underscores',
    PASSWORD_WEAK: 'Password is too weak',
  },
  LENGTH: {
    USERNAME_MIN: 'Username must be at least 3 characters',
    USERNAME_MAX: 'Username must not exceed 50 characters',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    PASSWORD_MAX: 'Password must not exceed 128 characters',
  },
  SECURITY: {
    PASSWORD_STRENGTH: 'Password must contain uppercase, lowercase, and numbers',
    PASSWORD_MISMATCH: 'Passwords do not match',
  },
};

/**
 * Validate individual field
 * @param {string} fieldName - Field name to validate
 * @param {any} value - Field value
 * @param {Object} schema - Validation schema
 * @returns {Promise<string|null>} Error message or null
 */
export const validateField = async (fieldName, value, schema = loginValidationSchema) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    return error.message;
  }
};

/**
 * Validate entire form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema
 * @returns {Promise<Object>} Validation result
 */
export const validateForm = async (values, schema = loginValidationSchema) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Get field validation state for real-time validation
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @param {boolean} touched - Whether field has been touched
 * @param {Object} errors - Current errors object
 * @returns {Object} Validation state
 */
export const getFieldValidationState = (fieldName, value, touched, errors) => {
  const hasError = touched && errors[fieldName];
  const isValid = touched && !errors[fieldName] && value;

  return {
    hasError: !!hasError,
    isValid: !!isValid,
    errorMessage: hasError ? errors[fieldName] : null,
  };
};

/**
 * Sanitize input values
 * @param {Object} values - Form values
 * @returns {Object} Sanitized values
 */
export const sanitizeLoginValues = (values) => {
  return {
    user_name: values.user_name?.trim().toLowerCase() || '',
    password: values.password || '',
    rememberMe: Boolean(values.rememberMe),
  };
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Strength analysis
 */
export const checkPasswordStrength = (password) => {
  const strength = {
    score: 0,
    feedback: [],
    level: 'weak',
  };

  if (!password) {
    return strength;
  }

  // Length check
  if (password.length >= 8) {
    strength.score += 1;
  } else {
    strength.feedback.push('Use at least 8 characters');
  }

  // Complexity checks
  if (/[a-z]/.test(password)) strength.score += 1;
  else strength.feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) strength.score += 1;
  else strength.feedback.push('Add uppercase letters');

  if (/\d/.test(password)) strength.score += 1;
  else strength.feedback.push('Add numbers');

  if (/[@$!%*?&]/.test(password)) strength.score += 1;
  else strength.feedback.push('Add special characters');

  // Determine strength level
  if (strength.score >= 4) strength.level = 'strong';
  else if (strength.score >= 3) strength.level = 'medium';
  else strength.level = 'weak';

  return strength;
};

/**
 * Get localized login validation schema
 * Use this for components that need i18n support
 */
export const getLocalizedLoginValidationSchema = getLoginValidationSchema;
export const getLocalizedEnhancedLoginValidationSchema = getEnhancedLoginValidationSchema;