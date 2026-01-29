/**
 * Custom useLanguage Hook
 * Advanced language management with persistence and performance
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode } from '../config/languages';
import { configureRTL } from '../utils/rtlManager';
import { preloadTranslations } from '../utils/translationLoader';
import { DEFAULT_NAMESPACES } from '../config/namespaces';

const LANGUAGE_STORAGE_KEY = 'user-language';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);
  const [availableLanguages] = useState(SUPPORTED_LANGUAGES);
  const changingRef = useRef(false);

  // Check if i18n is ready
  if (!i18n || !i18n.language) {
    console.warn('i18n not ready in useLanguage hook');
    return {
      currentLanguage: SUPPORTED_LANGUAGES[0], // Default to English
      isChanging: false,
      availableLanguages: SUPPORTED_LANGUAGES,
      changeLanguage: async () => false,
      resetToDefault: async () => false,
      isLanguageSupported: () => false,
      getLanguageName: () => 'English',
      getCurrentLanguage: () => SUPPORTED_LANGUAGES[0],
      i18n: null,
    };
  }

  // Get current language info
  const getCurrentLanguage = useCallback(() => {
    return getLanguageByCode(i18n.language);
  }, [i18n.language]);

  // Change language with optimizations
  const changeLanguage = useCallback(async (languageCode) => {
    // Prevent concurrent language changes
    if (changingRef.current) {
      console.warn('Language change already in progress');
      return false;
    }

    try {
      changingRef.current = true;
      setIsChanging(true);

      // Validate language code
      const targetLanguage = getLanguageByCode(languageCode);
      if (!targetLanguage) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }

      // Preload critical translations for better performance
      await preloadTranslations(languageCode, DEFAULT_NAMESPACES);

      // Change language in i18next
      await i18n.changeLanguage(languageCode);

      // Configure RTL layout
      configureRTL(languageCode);

      // Persist language choice
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

      if (__DEV__) {
        console.log(`Language changed to: ${languageCode} (${targetLanguage.native})`);
      }

      return true;

    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    } finally {
      changingRef.current = false;
      setIsChanging(false);
    }
  }, [i18n]);

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (savedLanguage && savedLanguage !== i18n.language) {
          const targetLanguage = getLanguageByCode(savedLanguage);
          if (targetLanguage) {
            await changeLanguage(savedLanguage);
          }
        }
      } catch (error) {
        console.warn('Failed to load saved language:', error);
      }
    };

    loadSavedLanguage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if language is supported
  const isLanguageSupported = useCallback((languageCode) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }, []);

  // Get language name by code
  const getLanguageName = useCallback((languageCode) => {
    const language = getLanguageByCode(languageCode);
    return language ? language.native : languageCode;
  }, []);

  // Reset to default language
  const resetToDefault = useCallback(async () => {
    return await changeLanguage(DEFAULT_LANGUAGE);
  }, [changeLanguage]);

  return {
    // Current state
    currentLanguage: getCurrentLanguage(),
    isChanging,

    // Available languages
    availableLanguages,

    // Actions
    changeLanguage,
    resetToDefault,

    // Utilities
    isLanguageSupported,
    getLanguageName,
    getCurrentLanguage,

    // Raw i18n access if needed
    i18n,
  };
};