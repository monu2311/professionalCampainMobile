/**
 * Language Context Provider
 * Global state management for language changes and forced re-renders
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { i18n } from './index';
import { isRTLLanguage } from './config/languages';

// Create Language Context
const LanguageContext = createContext({
  currentLanguage: 'en',
  changeLanguage: () => {},
  isChanging: false,
  isRTL: false,
  onRTLChange: () => {},
});

// Language Provider Component
export const LanguageProvider = ({ children, onRTLChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isChanging, setIsChanging] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isRTL, setIsRTL] = useState(isRTLLanguage(i18n.language || 'en'));

  // Force re-render function
  const triggerRerender = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Language change handler
  const changeLanguage = useCallback(async (languageCode) => {
    if (isChanging) return;

    console.log('🔄 Language change requested:', languageCode);
    setIsChanging(true);

    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode);

      // Update local state
      setCurrentLanguage(languageCode);

      // Check if RTL direction changed
      const newIsRTL = isRTLLanguage(languageCode);
      if (newIsRTL !== isRTL) {
        console.log(`🔀 RTL direction changed: ${isRTL} → ${newIsRTL}`);
        setIsRTL(newIsRTL);

        // Notify parent component about RTL change
        if (onRTLChange) {
          onRTLChange(newIsRTL, languageCode);
        }
      }

      // Force re-render of all components
      triggerRerender();

      console.log('✅ Language changed successfully to:', languageCode);
      console.log(`📱 RTL mode: ${newIsRTL}`);
      console.log('📊 Available translations for', languageCode, ':', Object.keys(i18n.getResourceBundle(languageCode) || {}));
    } catch (error) {
      console.error('❌ Language change failed:', error);
    } finally {
      setIsChanging(false);
    }
  }, [isChanging, triggerRerender, isRTL, onRTLChange]);

  // Listen for i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('📢 i18n language changed event:', lng);
      setCurrentLanguage(lng);

      // Update RTL state
      const newIsRTL = isRTLLanguage(lng);
      setIsRTL(newIsRTL);

      triggerRerender();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [triggerRerender]);

  // Initialize current language and RTL state
  useEffect(() => {
    if (i18n.isInitialized) {
      const lang = i18n.language;
      setCurrentLanguage(lang);
      setIsRTL(isRTLLanguage(lang));
    }
  }, []);

  const contextValue = {
    currentLanguage,
    changeLanguage,
    isChanging,
    isRTL,
    forceUpdate, // Components can use this to force re-renders
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageProvider;