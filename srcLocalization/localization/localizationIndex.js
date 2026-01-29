/**
 * Localization System Main Export
 * Senior React Native Developer Implementation
 *
 * This is the main entry point for the localization system.
 * Import this in your components for easy access to all localization features.
 */

// Core i18n
export { default as initializeI18n, i18n, translationUtils } from './index';

// Hooks
export {
  useTranslation,
  useLanguage,
  useRTL,
} from './hooks';

// Components
export {
  TranslatedText,
  TranslatedHeading,
  TranslatedSubheading,
  TranslatedBodyText,
  TranslatedCaption,
  LanguageSwitch,
} from './components';

// Utilities
export {
  loadTranslation,
  preloadTranslations,
  batchLoadTranslations,
  clearTranslationCache,
  getCacheStats,
  validateTranslations,
} from './utils/translationLoader';

export {
  configureRTL,
  getRTLStyle,
  getFlexDirection,
  getTextAlign,
  getPosition,
  getIconTransform,
  rtlMargin,
  rtlPadding,
  rtlBorder,
  isRTL,
  getWritingDirection,
} from './utils/rtlManager';

// Configuration
export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  RTL_LANGUAGES,
  getLanguageByCode,
  isRTLLanguage,
} from './config/languages';

export {
  NAMESPACES,
  DEFAULT_NAMESPACES,
  SCREEN_NAMESPACES,
  getNamespacesForScreen,
} from './config/namespaces';

// Localized static data
export {
  getGenderList,
  getCountryList,
  getProfileTypeList,
  getProfileList,
  getHomeLocation,
  getBodyDetails,
  getDateArray,
  getHomeBase,
  getSocialMedia,
  // Backward compatibility exports
  genderList,
  COUNTRYLIST,
  PROFILETYPELIST,
  profileList,
  HOMELOCATION,
  detailsData,
  dateArray,
  homeBase,
  SocialMedia,
} from '../constants/LocalizedStatic';