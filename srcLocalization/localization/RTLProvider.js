/**
 * RTL Context Provider
 * Global state management for RTL/LTR layout direction
 * Handles React Native I18nManager integration
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { I18nManager } from 'react-native';
import { isRTLLanguage } from './config/languages';

// Create RTL Context
const RTLContext = createContext({
  isRTL: false,
  setRTL: () => {},
  toggleRTL: () => {},
  forceLayoutDirection: () => {},
});

// RTL Provider Component
export const RTLProvider = ({ children }) => {
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  // Try to get language context if available (for automatic RTL updates)
  let languageContext = null;
  try {
    const { useLanguageContext } = require('./LanguageProvider');
    languageContext = useLanguageContext();
  } catch (error) {
    // LanguageProvider not available or not in context
  }

  // Force RTL layout direction
  const forceLayoutDirection = useCallback((languageCode) => {
    const shouldBeRTL = isRTLLanguage(languageCode);

    console.log(`🔄 Setting layout direction for ${languageCode}: RTL=${shouldBeRTL}`);

    // Update internal state immediately
    setIsRTL(shouldBeRTL);

    // Force React Native layout direction if it differs
    if (I18nManager.isRTL !== shouldBeRTL) {
      console.log(`📱 Forcing I18nManager RTL to: ${shouldBeRTL}`);
      I18nManager.forceRTL(shouldBeRTL);

      // Note: In production, you might want to restart the app here
      // for complete layout direction change, but for development
      // we'll handle it dynamically in components
    }
  }, []);

  // Set RTL state
  const setRTL = useCallback((rtlState) => {
    console.log(`🎯 Setting RTL state to: ${rtlState}`);
    setIsRTL(rtlState);

    // Update I18nManager if needed
    if (I18nManager.isRTL !== rtlState) {
      I18nManager.forceRTL(rtlState);
    }
  }, []);

  // Toggle RTL state
  const toggleRTL = useCallback(() => {
    const newRTLState = !isRTL;
    setRTL(newRTLState);
  }, [isRTL, setRTL]);

  // Listen for language changes from LanguageProvider
  useEffect(() => {
    if (languageContext) {
      const newIsRTL = languageContext.isRTL;
      if (newIsRTL !== isRTL) {
        console.log(`🔄 RTL Provider: Language context RTL changed to ${newIsRTL}`);
        setIsRTL(newIsRTL);

        // Update I18nManager if needed
        if (I18nManager.isRTL !== newIsRTL) {
          console.log(`📱 RTL Provider: Updating I18nManager.isRTL to ${newIsRTL}`);
          I18nManager.forceRTL(newIsRTL);
        }
      }
    }
  }, [languageContext?.isRTL, languageContext?.forceUpdate, languageContext?.currentLanguage]);

  // Initialize RTL state from I18nManager
  useEffect(() => {
    console.log(`🏗️ RTL Provider initialized. I18nManager.isRTL: ${I18nManager.isRTL}`);
    setIsRTL(I18nManager.isRTL);
  }, []);

  const contextValue = {
    isRTL,
    setRTL,
    toggleRTL,
    forceLayoutDirection,
  };

  return (
    <RTLContext.Provider value={contextValue}>
      {children}
    </RTLContext.Provider>
  );
};

// Custom hook to use RTL Context
export const useRTL = () => {
  const context = useContext(RTLContext);

  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }

  return context;
};

// Utility functions for RTL-aware styling
export const rtlStyle = (isRTL, ltrStyle, rtlStyleOverride = {}) => {
  if (!isRTL) return ltrStyle;

  // Create RTL version by flipping horizontal properties
  const rtlMappedStyle = { ...ltrStyle };

  // Flip left/right properties
  if (ltrStyle.left !== undefined) {
    rtlMappedStyle.right = ltrStyle.left;
    delete rtlMappedStyle.left;
  }
  if (ltrStyle.right !== undefined) {
    rtlMappedStyle.left = ltrStyle.right;
    delete rtlMappedStyle.right;
  }
  if (ltrStyle.marginLeft !== undefined) {
    rtlMappedStyle.marginRight = ltrStyle.marginLeft;
    delete rtlMappedStyle.marginLeft;
  }
  if (ltrStyle.marginRight !== undefined) {
    rtlMappedStyle.marginLeft = ltrStyle.marginRight;
    delete rtlMappedStyle.marginRight;
  }
  if (ltrStyle.paddingLeft !== undefined) {
    rtlMappedStyle.paddingRight = ltrStyle.paddingLeft;
    delete rtlMappedStyle.paddingLeft;
  }
  if (ltrStyle.paddingRight !== undefined) {
    rtlMappedStyle.paddingLeft = ltrStyle.paddingRight;
    delete rtlMappedStyle.paddingRight;
  }

  // Apply RTL-specific overrides
  return { ...rtlMappedStyle, ...rtlStyleOverride };
};

// Helper for text alignment
export const getTextAlign = (isRTL, defaultAlign = 'left') => {
  if (defaultAlign === 'center') return 'center';

  return isRTL ? 'right' : 'left';
};

// Helper for writing direction
export const getWritingDirection = (isRTL) => {
  return isRTL ? 'rtl' : 'ltr';
};

// Helper for flex direction
export const getFlexDirection = (isRTL, defaultDirection = 'row') => {
  if (defaultDirection !== 'row' && defaultDirection !== 'row-reverse') {
    return defaultDirection;
  }
  return isRTL ? 'row-reverse' : 'row';
};


// Helper for justify content
export const getJustifyContent = (isRTL, defaultJustify = 'flex-start') => {
  if (defaultJustify !== 'flex-start' && defaultJustify !== 'flex-end') {
    return defaultJustify;
  }
  return isRTL ? 'flex-end' : 'flex-start';
};

// Helper for flex direction
export const getAlignSelf = (isRTL, defaultAlign = 'flex-start') => {
  if (defaultAlign !== 'flex-start' && defaultAlign !== 'flex-end') {
    return defaultAlign;
  }
  return isRTL ? 'flex-end' : 'flex-start';
};

export const getButtonAlignSelf = (isRTL, defaultAlign = 'flex-start') => {
  if (defaultAlign !== 'flex-start' && defaultAlign !== 'flex-end') {
    return defaultAlign;
  }
  return !isRTL ? 'flex-end' : 'flex-start';
};
export default RTLProvider;