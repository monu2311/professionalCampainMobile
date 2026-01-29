/**
 * useValidation Hook
 * Custom hook for accessing localized validation schemas
 * Automatically re-initializes when language changes
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLanguageContext } from '../localization/LanguageProvider';
import { initializeYupI18n } from '../utils/validation/yupLocale';
import {
  getLoginValidationSchema,
  getEnhancedLoginValidationSchema,
  validateLoginField,
  validateLoginForm
} from '../utils/validation/schemas/loginSchema';
import {
  getCreateAccountValidationSchema,
  getEnhancedCreateAccountValidationSchema,
  validateCreateAccountField,
  validateCreateAccountForm
} from '../utils/validation/schemas/createAccountSchema';
import {
  getForgetPasswordValidationSchema,
  getResetPasswordValidationSchema,
  validateForgetPasswordField,
  validateForgetPasswordForm,
  checkPasswordStrength
} from '../utils/validation/schemas/forgetPasswordSchema';

/**
 * Custom hook for validation with localization support
 * @param {string} schemaType - Type of schema to use
 * @param {Object} options - Additional options
 * @returns {Object} Validation utilities and schemas
 */
export const useValidation = (schemaType = 'login', options = {}) => {
  const { currentLanguage, isRTL } = useLanguageContext();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Yup localization when language changes
  useEffect(() => {
    initializeYupI18n();
    setIsInitialized(true);
  }, [currentLanguage]);

  // Get the appropriate schema based on type
  const getSchema = useCallback(() => {
    switch (schemaType) {
      case 'login':
        return options.enhanced
          ? getEnhancedLoginValidationSchema()
          : getLoginValidationSchema();

      case 'createAccount':
      case 'register':
        return options.enhanced
          ? getEnhancedCreateAccountValidationSchema()
          : getCreateAccountValidationSchema();

      case 'forgetPassword':
      case 'forgotPassword':
        return getForgetPasswordValidationSchema();

      case 'resetPassword':
        return getResetPasswordValidationSchema();

      default:
        console.warn(`Unknown schema type: ${schemaType}`);
        return getLoginValidationSchema();
    }
  }, [schemaType, options.enhanced]);

  // Get validation functions based on type
  const getValidators = useCallback(() => {
    switch (schemaType) {
      case 'login':
        return {
          validateField: validateLoginField,
          validateForm: validateLoginForm,
        };

      case 'createAccount':
      case 'register':
        return {
          validateField: validateCreateAccountField,
          validateForm: validateCreateAccountForm,
        };

      case 'forgetPassword':
      case 'forgotPassword':
      case 'resetPassword':
        return {
          validateField: validateForgetPasswordField,
          validateForm: validateForgetPasswordForm,
        };

      default:
        return {
          validateField: validateLoginField,
          validateForm: validateLoginForm,
        };
    }
  }, [schemaType]);

  // Memoize the schema to prevent unnecessary re-creation
  const schema = useMemo(() => {
    if (!isInitialized) return null;
    return getSchema();
  }, [getSchema, isInitialized, currentLanguage]);

  // Memoize validators
  const validators = useMemo(() => {
    if (!isInitialized) return {};
    return getValidators();
  }, [getValidators, isInitialized]);

  // Field validation with schema
  const validateField = useCallback(async (fieldName, value, customSchema = null) => {
    if (!isInitialized) return null;

    const schemaToUse = customSchema || schema;
    return validators.validateField(fieldName, value, schemaToUse);
  }, [schema, validators, isInitialized]);

  // Form validation with schema
  const validateForm = useCallback(async (values, customSchema = null) => {
    if (!isInitialized) return { isValid: false, errors: {} };

    const schemaToUse = customSchema || schema;
    return validators.validateForm(values, schemaToUse);
  }, [schema, validators, isInitialized]);

  // Get field validation state for real-time validation
  const getFieldValidationState = useCallback((fieldName, value, touched, errors) => {
    const hasError = touched && errors[fieldName];
    const isValid = touched && !errors[fieldName] && value;

    return {
      hasError: !!hasError,
      isValid: !!isValid,
      errorMessage: hasError ? errors[fieldName] : null,
      showError: touched && !!errors[fieldName],
    };
  }, []);

  // Clear field error
  const clearFieldError = useCallback((errors, setErrors, fieldName) => {
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  }, []);

  // Set field error
  const setFieldError = useCallback((errors, setErrors, fieldName, errorMessage) => {
    setErrors({
      ...errors,
      [fieldName]: errorMessage,
    });
  }, []);

  // Validate on blur handler
  const createBlurHandler = useCallback((fieldName, value, setErrors) => {
    return async () => {
      const error = await validateField(fieldName, value);
      if (error) {
        setFieldError({}, setErrors, fieldName, error);
      } else {
        clearFieldError({}, setErrors, fieldName);
      }
    };
  }, [validateField, setFieldError, clearFieldError]);

  // Validate on change handler (for real-time validation)
  const createChangeHandler = useCallback((fieldName, setFieldValue, setErrors, errors) => {
    return (value) => {
      setFieldValue(fieldName, value);
      // Clear error if user starts typing
      if (errors[fieldName]) {
        clearFieldError(errors, setErrors, fieldName);
      }
    };
  }, [clearFieldError]);

  return {
    // Schema
    schema,
    isInitialized,

    // Validation functions
    validateField,
    validateForm,
    getFieldValidationState,

    // Error management
    clearFieldError,
    setFieldError,

    // Form handlers
    createBlurHandler,
    createChangeHandler,

    // Utilities
    checkPasswordStrength,

    // Language info
    currentLanguage,
    isRTL,
  };
};

/**
 * Hook specifically for login validation
 */
export const useLoginValidation = (options = {}) => {
  return useValidation('login', options);
};

/**
 * Hook specifically for create account validation
 */
export const useCreateAccountValidation = (options = {}) => {
  return useValidation('createAccount', options);
};

/**
 * Hook specifically for forget password validation
 */
export const useForgetPasswordValidation = () => {
  return useValidation('forgetPassword');
};

/**
 * Hook specifically for reset password validation
 */
export const useResetPasswordValidation = () => {
  return useValidation('resetPassword');
};

export default useValidation;