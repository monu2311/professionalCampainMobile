import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Text, ActivityIndicator, Platform } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';

const RichTextEditor = ({ placeholder, onChange, name, value }) => {
  const richText = useRef(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackValue, setFallbackValue] = useState(value || '');
  const [lastValue, setLastValue] = useState(value || '');
  const initializationTimeoutRef = useRef(null);
  const changeTimeoutRef = useRef(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
  }, []);

  // Safe initialization effect
  useEffect(() => {
    cleanup();
    setIsLoading(true);
    setHasError(false);

    // Set a timeout for initialization
    initializationTimeoutRef.current = setTimeout(() => {
      try {
        if (richText.current && isWebViewReady) {
          // Safely set initial content
          if (value && typeof value === 'string') {
            richText.current.setContentHTML(value);
          }
          setIsLoading(false);
        } else {
          // Fallback if WebView is not ready
          setHasError(true);
          setIsLoading(false);
          console.warn('RichTextEditor: WebView not ready, using fallback');
        }
      } catch (error) {
        console.error('RichTextEditor initialization error:', error);
        setHasError(true);
        setIsLoading(false);
      }
    }, 1000); // Wait 1 second for WebView to initialize

    return cleanup;
  }, [value, isWebViewReady, cleanup]);

  // Safe change handler with debouncing
  const handleEditorChange = useCallback((content) => {
    try {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }

      changeTimeoutRef.current = setTimeout(() => {
        if (content !== lastValue) {
          setLastValue(content);
          setFallbackValue(content);
          if (onChange && typeof onChange === 'function') {
            onChange(content);
          }
        }
      }, 300); // Debounce changes
    } catch (error) {
      console.error('RichTextEditor change error:', error);
      // Fallback to TextInput
      setHasError(true);
    }
  }, [onChange, lastValue]);

  // WebView ready handler
  const handleWebViewReady = useCallback(() => {
    try {
      setIsWebViewReady(true);
      console.log('RichTextEditor: WebView ready');
    } catch (error) {
      console.error('RichTextEditor WebView ready error:', error);
      setHasError(true);
    }
  }, []);

  // Fallback TextInput handler
  const handleFallbackChange = useCallback((text) => {
    setFallbackValue(text);
    if (onChange && typeof onChange === 'function') {
      onChange(text);
    }
  }, [onChange]);

  // Error boundary effect
  useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      console.error('RichTextEditor Error:', error, errorInfo);
      setHasError(true);
      setIsLoading(false);
    };

    // Add global error listener (React Native specific)
    if (Platform.OS === 'android') {
      // Android specific error handling
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string' &&
          (message.includes('WebView') || message.includes('RichEditor'))) {
          errorHandler(new Error(message));
        }
        originalConsoleError.apply(console, args);
      };

      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Loading state
  if (isLoading && !hasError) {
    return (
      <View style={[styles.editor, styles.centerContent]}>
        <ActivityIndicator size="small" color={COLORS.mainColor} />
        <Text style={styles.loadingText}>Loading editor...</Text>
      </View>
    );
  }

  // Error state - fallback to regular TextInput
  if (hasError) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackLabel}>
          {placeholder || 'Rich text editor (simplified mode)'}
        </Text>
        <TextInput
          style={styles.fallbackInput}
          multiline
          numberOfLines={8}
          value={fallbackValue}
          onChangeText={handleFallbackChange}
          placeholder={placeholder || 'Please input content'}
          placeholderTextColor={COLORS.placeHolderColor}
          textAlignVertical="top"
        />
      </View>
    );
  }

  // Normal rich text editor
  return (
    <ScrollView style={styles.scrollContainer}>
      <RichToolbar
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedButtonStyle={{ fontSize: 8 }}
        unselectedButtonStyle={{ fontSize: 8 }}
        editor={richText}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
        ]}
        iconSize={16}
        iconMap={{
          [actions.undo]: ({ tintColor }) => (
            <Icon name="return-up-back" size={16} color={tintColor} />
          ),
          [actions.redo]: ({ tintColor }) => (
            <Icon name="return-up-forward" size={16} color={tintColor} />
          ),
        }}
      />
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  richBar: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    overflow: 'hidden',
  },
  editor: {
    height: 220,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: '#CCCCCC',
    borderWidth: 0.5,
    borderTopWidth: 0,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.placeHolderColor,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
  },
  fallbackContainer: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  fallbackLabel: {
    fontSize: 12,
    color: COLORS.textColor,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  fallbackInput: {
    height: 200,
    padding: 12,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlignVertical: 'top',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default RichTextEditor;
