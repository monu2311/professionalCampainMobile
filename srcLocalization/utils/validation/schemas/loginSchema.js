/**
 * Localized Login Validation Schema
 * Uses i18next for dynamic validation messages
 */

import * as Yup from 'yup';
import { getValidationMessage } from '../yupLocale';

/**
 * Create login validation schema with localized messages
 * @returns {Yup.ObjectSchema} Localized validation schema
 */
export const getLoginValidationSchema = () => {
  return Yup.object().shape({
    user_name: Yup.string()
      .required(getValidationMessage('usernameRequired'))
      .min(3, getValidationMessage('usernameMinLength', { count: 3 }))
      .max(50, getValidationMessage('usernameMaxLength', { count: 50 }))
      .test('username-or-email', getValidationMessage('usernameFormat'), function(value) {
        if (!value) return false;

        // Check if it's an email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (emailRegex.test(value)) {
          return true;
        }

        // Check if it's a valid username format
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        if (!usernameRegex.test(value)) {
          return this.createError({
            message: getValidationMessage('usernameInvalid'),
            path: this.path
          });
        }

        return true;
      }),
    password: Yup.string()
      .required(getValidationMessage('passwordRequired'))
      .min(6, getValidationMessage('passwordMinLength', { count: 6 }))
      .max(128, getValidationMessage('passwordMaxLength', { count: 128 })),
  });
};

/**
 * Create enhanced login validation schema with stronger password requirements
 * @returns {Yup.ObjectSchema} Enhanced localized validation schema
 */
export const getEnhancedLoginValidationSchema = () => {
  return Yup.object().shape({
    user_name: Yup.string()
      .required(getValidationMessage('usernameRequired'))
      .min(3, getValidationMessage('usernameMinLength', { count: 3 }))
      .max(50, getValidationMessage('usernameMaxLength', { count: 50 }))
      .test('username-or-email', getValidationMessage('usernameFormat'), function(value) {
        if (!value) return false;

        // Check if it's an email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (emailRegex.test(value)) {
          return true;
        }

        // Check if it's a valid username format
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        if (!usernameRegex.test(value)) {
          return this.createError({
            message: getValidationMessage('usernameInvalid'),
            path: this.path
          });
        }

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
    rememberMe: Yup.boolean().default(false),
  });
};

/**
 * Validate individual field
 * @param {string} fieldName - Field name to validate
 * @param {any} value - Field value
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<string|null>} Error message or null
 */
export const validateLoginField = async (fieldName, value, schema = null) => {
  const validationSchema = schema || getLoginValidationSchema();

  try {
    await validationSchema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    return error.message;
  }
};

/**
 * Validate entire login form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema (optional)
 * @returns {Promise<Object>} Validation result
 */
export const validateLoginForm = async (values, schema = null) => {
  const validationSchema = schema || getLoginValidationSchema();

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
  getLoginValidationSchema,
  getEnhancedLoginValidationSchema,
  validateLoginField,
  validateLoginForm,
};