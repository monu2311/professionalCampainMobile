/**
 * Custom useRTL Hook
 * RTL layout management for Arabic language support
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';

import { isRTLLanguage } from '../config/languages';
import {
  getRTLStyle,
  getFlexDirection,
  getTextAlign,
  getPosition,
  getIconTransform,
  rtlMargin,
  rtlPadding,
  rtlBorder,
} from '../utils/rtlManager';

export const useRTL = () => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  // Update RTL state when language changes
  useEffect(() => {
    if (i18n && i18n.language) {
      const currentLanguageIsRTL = isRTLLanguage(i18n.language);
      setIsRTL(currentLanguageIsRTL);
    }
  }, [i18n?.language]);

  // RTL-aware style function with memoization
  const rtlStyle = useCallback((baseStyle, rtlOverrides = {}) => {
    return getRTLStyle(baseStyle, rtlOverrides);
  }, []);

  // RTL-aware text alignment
  const textAlign = useCallback((alignment) => {
    return getTextAlign(alignment);
  }, []);

  // RTL-aware flex direction
  const flexDirection = useCallback((direction = 'row') => {
    return getFlexDirection(direction);
  }, []);

  // RTL-aware positioning
  const position = useCallback((positionStyle) => {
    return getPosition(positionStyle);
  }, []);

  // RTL-aware icon transformation
  const iconTransform = useCallback((baseTransform = []) => {
    return getIconTransform(baseTransform);
  }, []);

  // Helper functions with memoization
  const helpers = useMemo(() => ({
    margin: rtlMargin,
    padding: rtlPadding,
    border: rtlBorder,
  }), []);

  // Common RTL styles
  const commonStyles = useMemo(() => ({
    row: {
      flexDirection: flexDirection('row'),
    },
    rowReverse: {
      flexDirection: flexDirection('row-reverse'),
    },
    textLeft: {
      textAlign: textAlign('left'),
    },
    textRight: {
      textAlign: textAlign('right'),
    },
    marginHorizontal: (value) => helpers.margin(value),
    paddingHorizontal: (value) => helpers.padding(value),
  }), [flexDirection, textAlign, helpers]);

  return {
    // State
    isRTL,

    // Style functions
    rtlStyle,
    textAlign,
    flexDirection,
    position,
    iconTransform,

    // Helpers
    ...helpers,

    // Common styles
    styles: commonStyles,

    // Utility functions
    isRTLLanguage: (languageCode) => isRTLLanguage(languageCode),
    getCurrentDirection: () => isRTL ? 'rtl' : 'ltr',
  };
};