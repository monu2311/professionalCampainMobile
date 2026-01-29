/**
 * Supported Languages Configuration
 * Senior React Native Developer Implementation
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    rtl: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    native: 'العربية',
    flag: '🇸🇦',
    rtl: true,
  },
  {
    code: 'es',
    name: 'Spanish',
    native: 'Español',
    flag: '🇪🇸',
    rtl: false,
  },
  {
    code: 'nl',
    name: 'Dutch',
    native: 'Nederlands',
    flag: '🇳🇱',
    rtl: false,
  },
  {
    code: 'zh',
    name: 'Chinese',
    native: '中文',
    flag: '🇨🇳',
    rtl: false,
  },
  {
    code: 'de',
    name: 'German',
    native: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false,
  },
];

export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

export const RTL_LANGUAGES = ['ar'];

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

export const isRTLLanguage = (code) => {
  return RTL_LANGUAGES.includes(code);
};