/**
 * Custom useTranslation Hook
 * Enhanced version with performance optimizations
 */

import { useCallback, useEffect, useState } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { NAMESPACES } from '../config/namespaces';
import { translationUtils } from '../index';

// Import the language context for force updates
let useLanguageContext;
try {
  const LanguageProvider = require('../LanguageProvider');
  useLanguageContext = LanguageProvider.useLanguageContext;
} catch (error) {
  // Fallback if context is not available
  useLanguageContext = () => ({ forceUpdate: 0 });
}

export const useTranslation = (namespaces = [NAMESPACES.COMMON]) => {
  const [isReady, setIsReady] = useState(false);
  const { t: i18nT, i18n, ready } = useI18nextTranslation(namespaces, { useSuspense: false });

  // Use language context for force updates if available
  let languageContext;
  try {
    languageContext = useLanguageContext();
  } catch (error) {
    languageContext = { forceUpdate: 0 };
  }

  // Enhanced translation function with fallback
  const t = useCallback((key, options = {}) => {
    try {
      // Use i18next t function for proper reactive updates
      if (!isReady || !i18n.isInitialized) {
        return key; // Return key if not ready
      }

      const translation = i18nT(key, options);

      if (__DEV__ && translation === key) {
        console.warn(`🔍 Translation missing for key: ${key} (lang: ${i18n.language})`);
      }

      return translation || key;
    } catch (error) {
      if (__DEV__) {
        console.warn('❌ Translation error:', key, error);
      }
      return key; // Return key as fallback
    }
  }, [i18nT, isReady, i18n.isInitialized, i18n.language, languageContext?.forceUpdate]);

  // Get translation with namespace prefix
  const tWithNamespace = useCallback((namespace, key, options = {}) => {
    return t(`${namespace}:${key}`, options);
  }, [t]);

  // Check if translation exists
  const hasTranslation = useCallback((key) => {
    return translationUtils.hasTranslation(key);
  }, []);

  // Get pluralized translation
  const tPlural = useCallback((key, count, options = {}) => {
    return t(key, { count, ...options });
  }, [t]);

  // Get formatted translation
  const tFormat = useCallback((key, values = {}, options = {}) => {
    return t(key, { ...values, ...options });
  }, [t]);

  useEffect(() => {
    setIsReady(ready && i18n.isInitialized);
  }, [ready, i18n.isInitialized]);

  return {
    t,
    tWithNamespace,
    tPlural,
    tFormat,
    hasTranslation,
    i18n,
    isReady,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};