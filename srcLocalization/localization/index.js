/**
 * Advanced i18n Configuration
 * Senior React Native Developer Implementation with Code Splitting
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from './config/languages';
import { NAMESPACES, DEFAULT_NAMESPACES } from './config/namespaces';
import { configureRTL } from './config/rtl';
import { getTranslation, hasTranslation } from './translations';

// Translation loader using static registry (fixes Metro bundler dynamic import issues)
const loadTranslation = async (lng, namespace) => {
  try {
    const translation = getTranslation(lng, namespace);
    if (translation) {
      return translation;
    }

    // Fallback to English if translation fails
    if (lng !== FALLBACK_LANGUAGE) {
      return loadTranslation(FALLBACK_LANGUAGE, namespace);
    }
    return {};
  } catch (error) {
    console.warn(`Failed to load translation: ${lng}/${namespace}`, error);
    // Fallback to English if translation fails
    if (lng !== FALLBACK_LANGUAGE) {
      return loadTranslation(FALLBACK_LANGUAGE, namespace);
    }
    return {};
  }
};

// Preload critical translations for performance
const preloadTranslations = async (lng, namespaces = DEFAULT_NAMESPACES) => {
  const translations = {};

  for (const namespace of namespaces) {
    translations[namespace] = await loadTranslation(lng, namespace);
  }

  return translations;
};

// Get device language with fallback
const getDeviceLanguage = () => {
  const locales = getLocales();

  if (locales && locales.length > 0) {
    const deviceLang = locales[0].languageCode;
    const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === deviceLang);
    return supportedLanguage ? deviceLang : DEFAULT_LANGUAGE;
  }

  return DEFAULT_LANGUAGE;
};

// Language detection configuration
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Try to get saved language from storage
      const savedLanguage = await AsyncStorage.getItem('user-language');

      if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
        callback(savedLanguage);
        return;
      }

      // Fallback to device language
      const deviceLanguage = getDeviceLanguage();
      callback(deviceLanguage);
    } catch (error) {
      console.warn('Language detection failed:', error);
      callback(DEFAULT_LANGUAGE);
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
      // Configure RTL for the new language
      configureRTL(lng);
    } catch (error) {
      console.warn('Failed to cache language:', error);
    }
  }
};

// Resource loader for dynamic imports
const resourceLoader = {
  type: 'backend',
  read: async (language, namespace, callback) => {
    try {
      const translation = await loadTranslation(language, namespace);
      callback(null, translation);
    } catch (error) {
      callback(error, null);
    }
  }
};

// Initialize i18n with advanced configuration
const initializeI18n = async () => {
  try {
    // First, initialize i18n without the custom resource loader
    await i18n
      .use(languageDetector)
      .use(initReactI18next)
      .init({
        // Language settings
        fallbackLng: FALLBACK_LANGUAGE,
        supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),

        // Namespaces
        defaultNS: NAMESPACES.COMMON,
        ns: Object.values(NAMESPACES),

        // Performance settings
        load: 'languageOnly', // Don't load country-specific variants
        preload: SUPPORTED_LANGUAGES.map(lang => lang.code), // Preload all languages

        // Debug settings
        debug: __DEV__,

        // React settings
        react: {
          useSuspense: false, // Disable suspense for React Native
          bindI18n: 'languageChanged loaded',
          bindI18nStore: 'added removed',
          transEmptyNodeValue: '', // Return empty string for empty nodes
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
        },

        // Interpolation settings
        interpolation: {
          escapeValue: false, // React already escapes
          format: (value, format) => {
            if (format === 'uppercase') return value.toUpperCase();
            if (format === 'lowercase') return value.toLowerCase();
            return value;
          }
        },

        // Error handling
        returnNull: false,
        returnEmptyString: false,
        returnObjects: false,
        joinArrays: false,

        // Key settings
        keySeparator: '.',
        nsSeparator: ':',
        pluralSeparator: '_',
        contextSeparator: '_',

        // Resources - load translations directly
        resources: {},
      });

    // Now manually load all translations into i18n store
    console.log('Loading translations into i18n store...');

    for (const language of SUPPORTED_LANGUAGES) {
      const langCode = language.code;
      console.log(`Loading translations for ${langCode}...`);

      for (const namespace of Object.values(NAMESPACES)) {
        try {
          const translation = await loadTranslation(langCode, namespace);
          if (translation) {
            // Add resources to i18n store
            i18n.addResourceBundle(langCode, namespace, translation, true, true);
            console.log(`✅ Loaded ${langCode}/${namespace}`);
          }
        } catch (error) {
          console.warn(`❌ Failed to load ${langCode}/${namespace}:`, error);
        }
      }
    }

    console.log('✅ i18n initialized successfully with all translations loaded');
    console.log('Available languages:', i18n.languages);
    console.log('Current language:', i18n.language);

    return true;
  } catch (error) {
    console.error('❌ i18n initialization failed:', error);
    return false;
  }
};

// Advanced translation utilities
export const translationUtils = {
  // Preload translations for better performance
  preloadTranslations,

  // Change language with preloading
  changeLanguage: async (languageCode) => {
    try {
      // Preload critical translations first
      await preloadTranslations(languageCode, DEFAULT_NAMESPACES);

      // Change language
      await i18n.changeLanguage(languageCode);

      // Configure RTL
      configureRTL(languageCode);

      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  },

  // Get current language info
  getCurrentLanguage: () => {
    const currentCode = i18n.language;
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentCode) || SUPPORTED_LANGUAGES[0];
  },

  // Check if translation exists
  hasTranslation: (key, namespace = NAMESPACES.COMMON) => {
    return i18n.exists(`${namespace}:${key}`);
  },

  // Get translation with fallback
  getTranslation: (key, options = {}, fallback = key) => {
    try {
      return i18n.t(key, options) || fallback;
    } catch (error) {
      console.warn('Translation error:', key, error);
      return fallback;
    }
  }
};

// Export the configured i18n instance
export { i18n };
export default initializeI18n;