/**
 * RTL (Right-to-Left) Manager
 * Advanced RTL support for Arabic language
 */

import { I18nManager, Platform } from 'react-native';
import { isRTLLanguage } from '../config/languages';

// RTL state management
let currentRTLState = I18nManager.isRTL;

// Configure RTL based on language
export const configureRTL = (languageCode) => {
  const shouldBeRTL = isRTLLanguage(languageCode);

  if (currentRTLState !== shouldBeRTL) {
    currentRTLState = shouldBeRTL;

    // Apply RTL configuration
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);

    if (__DEV__) {
      console.log(`RTL ${shouldBeRTL ? 'enabled' : 'disabled'} for language: ${languageCode}`);

      // In development, warn about app restart requirement
      if (Platform.OS === 'ios' && I18nManager.isRTL !== shouldBeRTL) {
        console.warn('RTL change requires app restart on iOS for full effect');
      }
    }
  }

  return shouldBeRTL;
};

// Get RTL-aware styles
export const getRTLStyle = (baseStyle, rtlStyle = {}) => {
  if (!I18nManager.isRTL) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    ...rtlStyle,
    // Auto-reverse common properties
    ...(baseStyle.marginLeft && !rtlStyle.marginRight && {
      marginLeft: baseStyle.marginRight || 0,
      marginRight: baseStyle.marginLeft,
    }),
    ...(baseStyle.paddingLeft && !rtlStyle.paddingRight && {
      paddingLeft: baseStyle.paddingRight || 0,
      paddingRight: baseStyle.paddingLeft,
    }),
    ...(baseStyle.left && !rtlStyle.right && {
      left: undefined,
      right: baseStyle.left,
    }),
    ...(baseStyle.borderLeftWidth && !rtlStyle.borderRightWidth && {
      borderLeftWidth: baseStyle.borderRightWidth || 0,
      borderRightWidth: baseStyle.borderLeftWidth,
    }),
  };
};

// RTL-aware flexbox direction
export const getFlexDirection = (direction = 'row') => {
  if (!I18nManager.isRTL || direction === 'column' || direction === 'column-reverse') {
    return direction;
  }

  return direction === 'row' ? 'row-reverse' : 'row';
};

// RTL-aware text alignment
export const getTextAlign = (align = 'left') => {
    console.log('getTextAlign called with:', align);
  console.log('I18nManager.isRTL:', I18nManager.isRTL);
  if (!I18nManager.isRTL) {
    return align;
  }

  switch (align) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    default:
      return align;
  }
};

// RTL-aware positioning
export const getPosition = (position) => {
  console.log('getPosition called with:', position);
  console.log('I18nManager.isRTL:', I18nManager.isRTL);
  if (!I18nManager.isRTL) {
    return position;
  }

  const { left, right, ...rest } = position;

  return {
    ...rest,
    ...(left !== undefined && { right: left }),
    ...(right !== undefined && { left: right }),
  };
};

// RTL-aware icon rotation (for directional icons)
export const getIconTransform = (baseTransform = []) => {
  if (!I18nManager.isRTL) {
    return baseTransform;
  }

  return [
    ...baseTransform,
    { scaleX: -1 }, // Flip horizontally for RTL
  ];
};

// RTL utility hooks-style functions
export const useRTL = () => ({
  isRTL: I18nManager.isRTL,
  getRTLStyle,
  getFlexDirection,
  getTextAlign,
  getPosition,
  getIconTransform,
});

// RTL-aware margin/padding helpers
export const rtlMargin = (left, right = left) => ({
  marginLeft: I18nManager.isRTL ? right : left,
  marginRight: I18nManager.isRTL ? left : right,
});

export const rtlPadding = (left, right = left) => ({
  paddingLeft: I18nManager.isRTL ? right : left,
  paddingRight: I18nManager.isRTL ? left : right,
});

// RTL-aware border helpers
export const rtlBorder = (leftWidth, rightWidth = leftWidth, leftColor, rightColor = leftColor) => ({
  borderLeftWidth: I18nManager.isRTL ? rightWidth : leftWidth,
  borderRightWidth: I18nManager.isRTL ? leftWidth : rightWidth,
  ...(leftColor && {
    borderLeftColor: I18nManager.isRTL ? rightColor : leftColor,
    borderRightColor: I18nManager.isRTL ? leftColor : rightColor,
  }),
});

// Check if current layout is RTL
export const isRTL = () => I18nManager.isRTL;

// Get writing direction for text components
export const getWritingDirection = () => I18nManager.isRTL ? 'rtl' : 'ltr';

// RTL-aware image transformation for UI elements
export const getImageTransform = (shouldFlip = false) => {
  if (!shouldFlip || !I18nManager.isRTL) {
    return {};
  }

  return {
    transform: [{ scaleX: -1 }],
  };
};