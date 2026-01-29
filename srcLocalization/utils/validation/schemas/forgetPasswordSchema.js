/**
 * Localized Forget Password Validation Schema
 * Uses i18next for dynamic validation messages
 */

import * as Yup from 'yup';
import { getValidationMessage } from '../yupLocale';

/**
 * Forget password validation schema with localized messages
 * @returns {Yup.ObjectSchema} Localized validation schema
 */
export const getForgetPasswordValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .required(getValidationMessage('emailRequired'))
      .email(getValidationMessage('invalidEmail'))
      .min(5, getValidationMessage('emailMinLength', { count: 5 }))
      .max(100, getValidationMessage('emailMaxLength', { count: 100 }))
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        getValidationMessage('emailFormat')
      )
      .test('email-format', getValidationMessage('emailFormat'), function(value) {
        if (!value) return false;

        // Additional email format checks
        const emailParts = value.split('@');
        if (emailParts.length !== 2) return false;

        const [localPart, domain] = emailParts;

        // Check local part (before @)
        if (localPart.length === 0 || localPart.length > 64) return false;
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false;

        // Check domain part (after @)
        if (domain.length === 0 || domain.length > 253) return false;
        if (domain.startsWith('.') || domain.endsWith('.')) return false;
        if (domain.includes('..')) return false;

        return true;
      }),
  });
};

/**
 * Reset password validation schema with localized messages
 * @returns {Yup.ObjectSchema} Localized validation schema
 */
export const getResetPasswordValidationSchema = () => {
  return Yup.object().shape({
    password: Yup.string()
      .required(getValidationMessage('newPasswordRequired'))
      .min(8, getValidationMessage('passwordMinLength', { count: 8 }))
      .max(128, getValidationMessage('passwordMaxLength', { count: 128 }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        getValidationMessage('passwordStrongRequired')
      ),
    confirmPassword: Yup.string()
      .required(getValidationMessage('confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], getValidationMessage('passwordMismatch')),
    token: Yup.string()
      .required(getValidationMessage('tokenRequired'))
      .min(6, getValidationMessage('tokenInvalid')),
  });
};

/**
 * Validate individual field
 * @param {string} fieldName - Field name to validate
 * @param {any} value - Field value
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<string|null>} Error message or null
 */
export const validateForgetPasswordField = async (fieldName, value, schema = null) => {
  const validationSchema = schema || getForgetPasswordValidationSchema();

  try {
    await validationSchema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    return error.message;
  }
};

/**
 * Validate entire forget password form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<Object>} Validation result
 */
export const validateForgetPasswordForm = async (values, schema = null) => {
  const validationSchema = schema || getForgetPasswordValidationSchema();

  try {
    await validationSchema.validate(values, { abortEarly: false });
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
 * Email format validation utility
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Check if email domain is common/trusted
 * @param {string} email - Email to check
 * @returns {boolean} True if domain is common
 */
export const isCommonEmailDomain = (email) => {
  if (!email || !isValidEmailFormat(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  const commonDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'
  ];

  return commonDomains.includes(domain);
};

/**
 * Sanitize email input
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';

  return email.toLowerCase().trim();
};

/**
 * Check password strength with localized feedback
 * @param {string} password - Password to check
 * @returns {Object} Strength analysis with localized feedback
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
    strength.feedback.push(getValidationMessage('passwordStrengthWeak'));
  }

  // Complexity checks
  if (/[a-z]/.test(password)) {
    strength.score += 1;
  } else {
    strength.feedback.push(getValidationMessage('passwordStrengthAddLowercase'));
  }

  if (/[A-Z]/.test(password)) {
    strength.score += 1;
  } else {
    strength.feedback.push(getValidationMessage('passwordStrengthAddUppercase'));
  }

  if (/\d/.test(password)) {
    strength.score += 1;
  } else {
    strength.feedback.push(getValidationMessage('passwordStrengthAddNumbers'));
  }

  if (/[@$!%*?&]/.test(password)) {
    strength.score += 1;
  } else {
    strength.feedback.push(getValidationMessage('passwordStrengthAddSpecial'));
  }

  // Determine strength level
  if (strength.score >= 4) strength.level = 'strong';
  else if (strength.score >= 3) strength.level = 'medium';
  else strength.level = 'weak';

  return strength;
};

export default {
  getForgetPasswordValidationSchema,
  getResetPasswordValidationSchema,
  validateForgetPasswordField,
  validateForgetPasswordForm,
  isValidEmailFormat,
  isCommonEmailDomain,
  sanitizeEmail,
  checkPasswordStrength,
};