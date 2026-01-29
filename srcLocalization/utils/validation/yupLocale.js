/**
 * Yup Localization Integration
 * Integrates Yup validation with i18next for dynamic, localized validation messages
 */

import * as Yup from 'yup';
import { i18n } from '../../localization/index';

/**
 * Configure Yup default locale messages with i18next
 * This function should be called whenever the language changes
 */
export const configureYupLocale = () => {
  Yup.setLocale({
    mixed: {
      required: ({ path }) => {
        // Map field names to specific validation messages
        const fieldMappings = {
          user_name: 'forms:validation.usernameRequired',
          password: 'forms:validation.passwordRequired',
          confirm_password: 'forms:validation.confirmPasswordRequired',
          email: 'forms:validation.emailRequired',
          gender: 'forms:validation.genderRequired',
          country: 'forms:validation.countryRequired',
          state: 'forms:validation.stateRequired',
          city: 'forms:validation.cityRequired',
          profile_type: 'forms:validation.profileTypeRequired',
          agree_to_terms: 'forms:validation.termsRequired',
          phone_number: 'forms:validation.phoneRequired',
          age: 'forms:validation.ageRequired',
        };

        // Use specific message if available, otherwise use generic
        const specificKey = fieldMappings[path];
        if (specificKey) {
          return i18n.t(specificKey);
        }

        // Fallback to generic field required message
        return i18n.t('forms:validation.fieldRequired', { field: path });
      },
      notType: ({ path, type }) => {
        return i18n.t('forms:validation.invalidType', { field: path, type });
      },
      defined: ({ path }) => {
        return i18n.t('forms:validation.fieldRequired', { field: path });
      },
      oneOf: ({ values }) => {
        // Special case for password confirmation
        if (values && values.length === 1) {
          return i18n.t('forms:validation.passwordMismatch');
        }
        return i18n.t('forms:validation.invalidFormat', { field: 'value' });
      },
    },
    string: {
      email: () => i18n.t('forms:validation.invalidEmail'),
      min: ({ min, path }) => {
        // Map field names to specific min length messages
        const fieldMappings = {
          user_name: 'forms:validation.usernameMinLength',
          password: 'forms:validation.passwordMinLength',
          email: 'forms:validation.emailMinLength',
          profile_name: 'forms:validation.profileNameMinLength',
        };

        const specificKey = fieldMappings[path];
        if (specificKey) {
          return i18n.t(specificKey, { count: min });
        }

        return i18n.t('forms:validation.minLength', { count: min });
      },
      max: ({ max, path }) => {
        // Map field names to specific max length messages
        const fieldMappings = {
          user_name: 'forms:validation.usernameMaxLength',
          password: 'forms:validation.passwordMaxLength',
          email: 'forms:validation.emailMaxLength',
          profile_name: 'forms:validation.profileNameMaxLength',
        };

        const specificKey = fieldMappings[path];
        if (specificKey) {
          return i18n.t(specificKey, { count: max });
        }

        return i18n.t('forms:validation.maxLength', { count: max });
      },
      length: ({ length }) => {
        return i18n.t('forms:validation.exactLength', { count: length });
      },
      matches: ({ path }) => {
        // Special handling for password strength validation
        if (path === 'password') {
          return i18n.t('forms:validation.passwordStrength');
        }
        return i18n.t('forms:validation.invalidFormat', { field: path });
      },
      url: () => i18n.t('forms:validation.invalidUrl'),
      uuid: () => i18n.t('forms:validation.invalidUuid'),
    },
    number: {
      min: ({ min, path }) => {
        if (path === 'age') {
          return i18n.t('forms:validation.ageMin', { min });
        }
        return i18n.t('forms:validation.minValue', { value: min });
      },
      max: ({ max, path }) => {
        if (path === 'age') {
          return i18n.t('forms:validation.ageMax', { max });
        }
        return i18n.t('forms:validation.maxValue', { value: max });
      },
      integer: () => i18n.t('forms:validation.mustBeInteger'),
      positive: () => i18n.t('forms:validation.mustBePositive'),
      negative: () => i18n.t('forms:validation.mustBeNegative'),
    },
    date: {
      min: ({ min }) => i18n.t('forms:validation.dateMin', { date: min }),
      max: ({ max }) => i18n.t('forms:validation.dateMax', { date: max }),
    },
    array: {
      min: ({ min }) => i18n.t('forms:validation.arrayMin', { count: min }),
      max: ({ max }) => i18n.t('forms:validation.arrayMax', { count: max }),
    },
  });
};

/**
 * Initialize Yup locale configuration
 * Should be called on app startup and language change
 */
export const initializeYupLocale = () => {
  configureYupLocale();

  // Listen for language changes and reconfigure Yup
  i18n.on('languageChanged', () => {
    configureYupLocale();
  });
};

/**
 * Get localized validation message
 * Helper function to get validation messages directly
 */
export const getValidationMessage = (key, options = {}) => {
  return i18n.t(`forms:validation.${key}`, options);
};

/**
 * Create a localized validation error
 * Helper for custom validation methods
 */
export const createValidationError = (key, options = {}) => {
  return new Yup.ValidationError(
    getValidationMessage(key, options),
    null,
    options.path || ''
  );
};

/**
 * Custom validation methods with localization
 */
export const addCustomValidationMethods = () => {
  // Add custom username validation
  Yup.addMethod(Yup.string, 'username', function(message) {
    return this.test('username', message || getValidationMessage('usernameFormat'), function(value) {
      if (!value) return true; // Let required handle empty values

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
    });
  });

  // Add custom password strength validation
  Yup.addMethod(Yup.string, 'passwordStrength', function(level = 'medium') {
    return this.test('passwordStrength', getValidationMessage('passwordWeak'), function(value) {
      if (!value) return true; // Let required handle empty values

      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[@$!%*?&]/.test(value);
      const isLongEnough = value.length >= 8;

      if (level === 'strong') {
        if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !isLongEnough) {
          return this.createError({
            message: getValidationMessage('passwordStrongRequired'),
            path: this.path
          });
        }
      } else if (level === 'medium') {
        if (!hasLowercase || !hasUppercase || !hasNumber || !isLongEnough) {
          return this.createError({
            message: getValidationMessage('passwordStrength'),
            path: this.path
          });
        }
      } else {
        if (!isLongEnough) {
          return this.createError({
            message: getValidationMessage('passwordTooShort'),
            path: this.path
          });
        }
      }

      return true;
    });
  });

  // Add custom phone validation
  Yup.addMethod(Yup.string, 'phone', function(message) {
    return this.test('phone', message || getValidationMessage('phoneInvalid'), function(value) {
      if (!value) return true; // Let required handle empty values

      // Basic phone validation - can be customized per region
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      return phoneRegex.test(value);
    });
  });
};

/**
 * Initialize all Yup localization features
 */
export const initializeYupI18n = () => {
  initializeYupLocale();
  addCustomValidationMethods();
};

export default {
  configureYupLocale,
  initializeYupLocale,
  initializeYupI18n,
  getValidationMessage,
  createValidationError,
  addCustomValidationMethods,
};