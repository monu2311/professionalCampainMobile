/**
 * HTMLContent Component
 * Reusable component for rendering HTML content with consistent styling
 */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

/**
 * HTMLContent - Renders HTML content with proper styling
 * @param {string} content - The HTML content to render
 * @param {object} customStyles - Custom styles to override defaults
 * @param {string} textColor - Text color (defaults to COLORS.textColor)
 * @param {number} fontSize - Base font size (defaults to 16)
 * @param {string} fontFamily - Font family (defaults to TYPOGRAPHY.QUICKREGULAR)
 * @param {boolean} renderAsText - Force render as plain text
 */
const HTMLContent = ({
  content,
  customStyles = {},
  textColor = COLORS.textColor,
  fontSize = 16,
  fontFamily = TYPOGRAPHY.QUICKREGULAR,
  renderAsText = false,
  ...props
}) => {
  // If no content, return null
  if (!content) {
    return null;
  }

  // Check if content contains HTML tags
  const hasHTMLTags = /<[^>]*>/.test(content);

  // If forced to render as text or no HTML tags found, render as plain text
  if (renderAsText || !hasHTMLTags) {
    return (
      <Text
        style={[
          {
            fontSize,
            fontFamily,
            color: textColor,
            lineHeight: fontSize * 1.5,
          },
          customStyles.plainText,
        ]}
      >
        {content}
      </Text>
    );
  }

  // Default HTML styles
  const defaultStyles = StyleSheet.create({
    p: {
      fontSize,
      fontFamily,
      color: textColor,
      lineHeight: fontSize * 1.5,
      marginBottom: 8,
    },
    div: {
      fontSize,
      fontFamily,
      color: textColor,
      lineHeight: fontSize * 1.5,
    },
    span: {
      fontSize,
      fontFamily,
      color: textColor,
    },
    strong: {
      fontWeight: 'bold',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
    },
    b: {
      fontWeight: 'bold',
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
    },
    em: {
      fontStyle: 'italic',
      fontFamily,
      color: textColor,
    },
    i: {
      fontStyle: 'italic',
      fontFamily,
      color: textColor,
    },
    u: {
      textDecorationLine: 'underline',
      fontFamily,
      color: textColor,
    },
    ul: {
      marginLeft: 10,
      marginBottom: 8,
    },
    ol: {
      marginLeft: 10,
      marginBottom: 8,
    },
    li: {
      fontSize,
      fontFamily,
      color: textColor,
      lineHeight: fontSize * 1.5,
      marginBottom: 4,
      paddingLeft: 5,
    },
    h1: {
      fontSize: fontSize * 1.5,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 12,
      marginTop: 8,
    },
    h2: {
      fontSize: fontSize * 1.3,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 10,
      marginTop: 8,
    },
    h3: {
      fontSize: fontSize * 1.15,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 8,
      marginTop: 6,
    },
    h4: {
      fontSize: fontSize * 1.1,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 6,
      marginTop: 4,
    },
    h5: {
      fontSize: fontSize * 1.05,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 4,
      marginTop: 4,
    },
    h6: {
      fontSize,
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      color: textColor,
      marginBottom: 4,
      marginTop: 4,
    },
    br: {
      height: fontSize * 0.5,
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.placeHolderColor,
      marginVertical: 10,
    },
    blockquote: {
      fontSize,
      fontFamily,
      color: textColor,
      fontStyle: 'italic',
      marginLeft: 15,
      paddingLeft: 10,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.specialTextColor,
      marginBottom: 8,
    },
    pre: {
      fontFamily: 'Courier',
      fontSize: fontSize * 0.9,
      color: textColor,
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 4,
      marginBottom: 8,
    },
    code: {
      fontFamily: 'Courier',
      fontSize: fontSize * 0.9,
      color: textColor,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 2,
    },
    a: {
      color: COLORS.specialTextColor,
      textDecorationLine: 'underline',
      fontFamily,
    },
    table: {
      marginBottom: 8,
    },
    th: {
      fontFamily: TYPOGRAPHY.QUICKBLOD,
      fontSize,
      color: textColor,
      padding: 8,
      borderBottomWidth: 2,
      borderBottomColor: COLORS.placeHolderColor,
    },
    td: {
      fontFamily,
      fontSize,
      color: textColor,
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
  });

  // Merge default styles with custom styles
  const mergedStyles = {
    ...defaultStyles,
    ...customStyles,
  };

  return (
    <HTMLView
      value={content}
      stylesheet={mergedStyles}
      addLineBreaks={false}
      {...props}
    />
  );
};

export default HTMLContent;