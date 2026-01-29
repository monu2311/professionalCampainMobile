/**
 * Translation Registry
 * Static import registry for all translation files to avoid Metro bundler dynamic import issues
 */

// English translations
const enTranslations = {
  common: () => require('./en/common.json'),
  screens: () => require('./en/screens.json'),
  forms: () => require('./en/forms.json'),
  errors: () => require('./en/errors.json'),
  static: () => require('./en/static.json'),
};

// Spanish translations
const esTranslations = {
  common: () => require('./es/common.json'),
  screens: () => require('./es/screens.json'),
  forms: () => require('./es/forms.json'),
  errors: () => require('./es/errors.json'),
  static: () => require('./es/static.json'),
};

// German translations
const deTranslations = {
  common: () => require('./de/common.json'),
  screens: () => require('./de/screens.json'),
  forms: () => require('./de/forms.json'),
  errors: () => require('./de/errors.json'),
  static: () => require('./de/static.json'),
};

// Dutch translations
const nlTranslations = {
  common: () => require('./nl/common.json'),
  screens: () => require('./nl/screens.json'),
  forms: () => require('./nl/forms.json'),
  errors: () => require('./nl/errors.json'),
  static: () => require('./nl/static.json'),
};

// Chinese translations
const zhTranslations = {
  common: () => require('./zh/common.json'),
  screens: () => require('./zh/screens.json'),
  forms: () => require('./zh/forms.json'),
  errors: () => require('./zh/errors.json'),
  static: () => require('./zh/static.json'),
};

// Arabic translations
const arTranslations = {
  common: () => require('./ar/common.json'),
  screens: () => require('./ar/screens.json'),
  forms: () => require('./ar/forms.json'),
  errors: () => require('./ar/errors.json'),
  static: () => require('./ar/static.json'),
};

// Hindi translations
const hiTranslations = {
  common: () => require('./hi/common.json'),
  screens: () => require('./hi/screens.json'),
  forms: () => require('./hi/forms.json'),
  errors: () => require('./hi/errors.json'),
  static: () => require('./hi/static.json'),
};

/**
 * Translation Registry
 * Organized by language code and namespace
 */
export const translationRegistry = {
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
  nl: nlTranslations,
  zh: zhTranslations,
  ar: arTranslations,
  hi: hiTranslations,
};

/**
 * Get translation function for a specific language and namespace
 * @param {string} lng - Language code
 * @param {string} namespace - Translation namespace
 * @returns {Object|null} Translation data or null if not found
 */
export const getTranslation = (lng, namespace) => {
  try {
    const languageTranslations = translationRegistry[lng];
    if (!languageTranslations) {
      console.warn(`Language '${lng}' not found in translation registry`);
      return null;
    }

    const namespaceLoader = languageTranslations[namespace];
    if (!namespaceLoader) {
      console.warn(`Namespace '${namespace}' not found for language '${lng}'`);
      return null;
    }

    // Execute the loader function to get the translation data
    return namespaceLoader();
  } catch (error) {
    console.warn(`Failed to load translation for ${lng}/${namespace}:`, error);
    return null;
  }
};

/**
 * Check if a translation exists for a language and namespace
 * @param {string} lng - Language code
 * @param {string} namespace - Translation namespace
 * @returns {boolean} True if translation exists
 */
export const hasTranslation = (lng, namespace) => {
  return !!(translationRegistry[lng] && translationRegistry[lng][namespace]);
};

/**
 * Get all available languages
 * @returns {string[]} Array of language codes
 */
export const getAvailableLanguages = () => {
  return Object.keys(translationRegistry);
};

/**
 * Get all available namespaces for a language
 * @param {string} lng - Language code
 * @returns {string[]} Array of namespace names
 */
export const getAvailableNamespaces = (lng) => {
  const languageTranslations = translationRegistry[lng];
  return languageTranslations ? Object.keys(languageTranslations) : [];
};