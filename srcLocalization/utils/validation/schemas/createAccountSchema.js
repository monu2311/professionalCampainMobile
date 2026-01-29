/**
 * Localized Create Account Validation Schema
 * Uses i18next for dynamic validation messages
 */

import * as Yup from 'yup';
import { getValidationMessage } from '../yupLocale';

/**
 * Create account validation schema with localized messages
 * @returns {Yup.ObjectSchema} Localized validation schema
 */
export const getCreateAccountValidationSchema = () => {
  return Yup.object().shape({
    user_name: Yup.string()
      .required(getValidationMessage('profileNameRequired'))
      .min(3, getValidationMessage('profileNameMinLength', { count: 3 }))
      .max(50, getValidationMessage('profileNameMaxLength', { count: 50 })),

    email: Yup.string()
      .required(getValidationMessage('emailRequired'))
      .email(getValidationMessage('invalidEmail'))
      .min(5, getValidationMessage('emailMinLength', { count: 5 }))
      .max(100, getValidationMessage('emailMaxLength', { count: 100 }))
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        getValidationMessage('emailFormat')
      ),

    password: Yup.string()
      .required(getValidationMessage('passwordRequired'))
      .min(6, getValidationMessage('passwordMinLength', { count: 6 }))
      .max(128, getValidationMessage('passwordMaxLength', { count: 128 })),

    confirm_password: Yup.string()
      .required(getValidationMessage('confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], getValidationMessage('passwordMismatch')),

    gender: Yup.string()
      .required(getValidationMessage('genderRequired')),

    country: Yup.string()
      .required(getValidationMessage('countryRequired')),

    state: Yup.number()
      .required(getValidationMessage('stateRequired'))
      .positive()
      .integer(),

    profile_type: Yup.string()
      .required(getValidationMessage('profileTypeRequired')),

    agree_to_terms: Yup.number()
      .required(getValidationMessage('termsRequired'))
      .oneOf([1], getValidationMessage('termsRequired')),
  });
};

/**
 * Create enhanced account validation schema with stronger requirements
 * @returns {Yup.ObjectSchema} Enhanced localized validation schema
 */
export const getEnhancedCreateAccountValidationSchema = () => {
  return Yup.object().shape({
    user_name: Yup.string()
      .required(getValidationMessage('profileNameRequired'))
      .min(3, getValidationMessage('profileNameMinLength', { count: 3 }))
      .max(50, getValidationMessage('profileNameMaxLength', { count: 50 }))
      .matches(/^[a-zA-Z0-9\s._-]+$/, getValidationMessage('usernameInvalid')),

    email: Yup.string()
      .required(getValidationMessage('emailRequired'))
      .email(getValidationMessage('invalidEmail'))
      .min(5, getValidationMessage('emailMinLength', { count: 5 }))
      .max(100, getValidationMessage('emailMaxLength', { count: 100 }))
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

    password: Yup.string()
      .required(getValidationMessage('passwordRequired'))
      .min(8, getValidationMessage('passwordMinLength', { count: 8 }))
      .max(128, getValidationMessage('passwordMaxLength', { count: 128 }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        getValidationMessage('passwordStrength')
      ),

    confirm_password: Yup.string()
      .required(getValidationMessage('confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], getValidationMessage('passwordMismatch')),

    gender: Yup.string()
      .required(getValidationMessage('genderRequired')),

    country: Yup.string()
      .required(getValidationMessage('countryRequired')),

    state: Yup.number()
      .required(getValidationMessage('stateRequired'))
      .positive()
      .integer(),

    city: Yup.string()
      .optional(),

    profile_type: Yup.string()
      .required(getValidationMessage('profileTypeRequired')),

    agree_to_terms: Yup.number()
      .required(getValidationMessage('termsRequired'))
      .oneOf([1], getValidationMessage('termsRequired')),

    phone_number: Yup.string()
      .optional()
      .matches(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        getValidationMessage('phoneInvalid')
      ),

    age: Yup.number()
      .optional()
      .min(18, getValidationMessage('ageMin', { min: 18 }))
      .max(120, getValidationMessage('ageMax', { max: 120 })),
  });
};

/**
 * Validate individual field
 * @param {string} fieldName - Field name to validate
 * @param {any} value - Field value
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<string|null>} Error message or null
 */
export const validateCreateAccountField = async (fieldName, value, schema = null) => {
  const validationSchema = schema || getCreateAccountValidationSchema();

  try {
    // Special handling for dependent fields
    if (fieldName === 'confirm_password') {
      // Need to include password value for comparison
      const mockValues = {
        password: '', // This should be the actual password value
        confirm_password: value
      };
      await validationSchema.validateAt(fieldName, mockValues);
    } else {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
    }
    return null;
  } catch (error) {
    return error.message;
  }
};

/**
 * Validate entire create account form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<Object>} Validation result
 */
export const validateCreateAccountForm = async (values, schema = null) => {
  const validationSchema = schema || getCreateAccountValidationSchema();

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

export default {
  getCreateAccountValidationSchema,
  getEnhancedCreateAccountValidationSchema,
  validateCreateAccountField,
  validateCreateAccountForm,
};