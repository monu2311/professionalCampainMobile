import * as Yup from 'yup';
import { getForgetPasswordValidationSchema } from './validation/schemas/forgetPasswordSchema';

/**
 * Forget Password Form Validation Schema
 * Comprehensive validation for email field in password reset
 */

/**
 * Email validation schema
 * Validates email format and requirements
 */
const emailValidation = Yup.string()
  .required('Email is required')
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must not exceed 100 characters')
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    'Please enter a valid email format'
  )
  .test('email-format', 'Please enter a valid email address', function(value) {
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
  });

/**
 * Main forget password validation schema
 */
export const forgetPasswordValidationSchema = Yup.object().shape({
  email: emailValidation,
});

/**
 * Validate form data against schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Yup validation schema
 * @returns {Object} Validation result with isValid flag and errors
 */
export const validateForm = async (data, schema) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return {
      isValid: true,
      errors: {},
    };
  } catch (error) {
    const errors = {};

    if (error.inner) {
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
    } else {
      errors.general = error.message;
    }

    return {
      isValid: false,
      errors,
    };
  }
};

/**
 * Validate single field
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Object} schema - Yup validation schema
 * @returns {string|null} Error message or null if valid
 */
export const validateField = async (fieldName, value, schema) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    return error.message;
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
 * Get localized forget password validation schema
 * Use this for components that need i18n support
 */
export const getLocalizedForgetPasswordValidationSchema = getForgetPasswordValidationSchema;