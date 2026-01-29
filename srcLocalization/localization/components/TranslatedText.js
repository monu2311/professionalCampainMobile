/**
 * TranslatedText Component
 * Optimized text component with memoization and RTL support
 */

import React, { memo } from 'react';
import { Text } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useRTL } from '../hooks/useRTL';

const TranslatedText = memo(({
  i18nKey,
  values = {},
  fallback,
  style,
  rtlStyle,
  numberOfLines,
  ellipsizeMode = 'tail',
  children,
  ...textProps
}) => {
  const { t, isReady } = useTranslation();
  const { isRTL, rtlStyle: getRTLStyle, textAlign } = useRTL();

  // If i18nKey is provided, use translation; otherwise use children
  const text = i18nKey
    ? isReady ? t(i18nKey, values) : (fallback || i18nKey)
    : children;

  // Apply RTL-aware styling
  const appliedStyle = getRTLStyle(style, rtlStyle);

  // Ensure proper text alignment for RTL
  const finalStyle = {
    ...appliedStyle,
    textAlign: appliedStyle?.textAlign || textAlign('left'),
  };

  return (
    <Text
      style={finalStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...textProps}
    >
      {text}
    </Text>
  );
});

TranslatedText.displayName = 'TranslatedText';

export default TranslatedText;

// Convenience components for common use cases
export const TranslatedHeading = memo((props) => (
  <TranslatedText
    style={[{ fontSize: 24, fontWeight: 'bold' }, props.style]}
    {...props}
  />
));

export const TranslatedSubheading = memo((props) => (
  <TranslatedText
    style={[{ fontSize: 18, fontWeight: '600' }, props.style]}
    {...props}
  />
));

export const TranslatedBodyText = memo((props) => (
  <TranslatedText
    style={[{ fontSize: 16 }, props.style]}
    {...props}
  />
));

export const TranslatedCaption = memo((props) => (
  <TranslatedText
    style={[{ fontSize: 12, opacity: 0.7 }, props.style]}
    {...props}
  />
));

TranslatedHeading.displayName = 'TranslatedHeading';
TranslatedSubheading.displayName = 'TranslatedSubheading';
TranslatedBodyText.displayName = 'TranslatedBodyText';
TranslatedCaption.displayName = 'TranslatedCaption';