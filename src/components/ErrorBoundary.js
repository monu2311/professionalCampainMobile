/**
 * Global Error Boundary Component
 * Catches JavaScript errors and prevents app crashes in release builds
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showErrorMessage } from '../utils/messageHelpers';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo,
    });

    // Log to crash service
    this.logErrorToCrashService(error, errorInfo);

    // Show user-friendly message
    if (this.props.showAlert !== false) {
      showErrorMessage(
        'Something went wrong',
        'The app encountered an error. Please try again.'
      );
    }
  }

  logErrorToCrashService = (error, errorInfo) => {
    const errorData = {
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      buildType: __DEV__ ? 'debug' : 'release',
      error: {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        name: error?.name || 'Error',
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack || 'No component stack',
      },
      screenName: this.props.screenName || 'Unknown Screen',
      userAgent: Platform.constants?.utsname?.machine || 'Unknown',
    };

    // Console log for development
    if (__DEV__) {
      console.error('🔴 Error Boundary Caught Error:', errorData);
    }

    // TODO: Send to crash reporting service (Crashlytics, Sentry, etc.)
    // Example: CrashReporting.recordError(errorData);

    // Store locally for debugging
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingLogs = AsyncStorage.getItem('error_logs').then((logs) => {
        const parsedLogs = logs ? JSON.parse(logs) : [];
        parsedLogs.push(errorData);

        // Keep only last 50 errors
        if (parsedLogs.length > 50) {
          parsedLogs.splice(0, parsedLogs.length - 50);
        }

        AsyncStorage.setItem('error_logs', JSON.stringify(parsedLogs));
      });
    } catch (storageError) {
      console.warn('Failed to store error log:', storageError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoBack = () => {
    if (this.props.navigation) {
      this.props.navigation.goBack();
    } else {
      this.handleRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Icon name="error-outline" size={64} color={COLORS.red || '#ff4444'} />

            <Text style={styles.title}>Something went wrong</Text>

            <Text style={styles.message}>
              The app encountered an unexpected error. This has been reported automatically.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable style={styles.retryButton} onPress={this.handleRetry}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>

              {this.props.navigation && (
                <Pressable style={styles.backButton} onPress={this.handleGoBack}>
                  <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white || '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.large,
  },
  errorCard: {
    backgroundColor: COLORS.white || '#ffffff',
    borderRadius: 16,
    padding: PADDING.extralarge,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD || 'System',
    color: COLORS.textColor || '#333',
    textAlign: 'center',
    marginTop: PADDING.medium,
    marginBottom: PADDING.small,
  },
  message: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR || 'System',
    color: COLORS.placeHolderColor || '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: PADDING.large,
  },
  debugContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: PADDING.medium,
    marginBottom: PADDING.large,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: COLORS.specialTextColor || '#007AFF',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderRadius: 12,
    minWidth: 120,
  },
  retryButtonText: {
    color: COLORS.white || '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor || '#ddd',
    minWidth: 120,
  },
  backButtonText: {
    color: COLORS.textColor || '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ErrorBoundary;