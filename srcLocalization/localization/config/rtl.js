/**
 * RTL (Right-to-Left) Configuration
 * For Arabic language support
 */

import { I18nManager } from 'react-native';
import { RTL_LANGUAGES } from './languages';

export const RTL_CONFIG = {
  allowRTL: true,
  forceRTL: false,
};

export const configureRTL = (languageCode) => {
  const isRTL = RTL_LANGUAGES.includes(languageCode);

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // Note: In production, you might want to restart the app
    // for RTL changes to take full effect
    if (__DEV__) {
      console.log(`RTL ${isRTL ? 'enabled' : 'disabled'} for language: ${languageCode}`);
    }
  }

  return isRTL;
};

export const getRTLStyle = (isRTL, styles) => {
  if (!isRTL) return styles.ltr || styles;

  return {
    ...styles.ltr,
    ...styles.rtl,
    flexDirection: styles.rtl?.flexDirection || (
      styles.ltr?.flexDirection === 'row' ? 'row-reverse' : styles.ltr?.flexDirection
    ),
  };
};