/**
 * Crash Logger Service
 * Comprehensive crash detection and logging for release builds
 */
import { Platform, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CrashLoggerService {
  constructor() {
    this.isInitialized = false;
    this.crashLogs = [];
    this.maxLogs = 50;
    this.storageKey = 'app_crash_logs';
    this.init();
  }

  /**
   * Initialize the crash logger
   */
  async init() {
    try {
      // Load existing crash logs
      await this.loadStoredLogs();

      // Set up global error handlers
      this.setupGlobalErrorHandlers();

      // Set up native crash detection
      this.setupNativeCrashDetection();

      this.isInitialized = true;
      console.log('🔍 CrashLoggerService initialized');
    } catch (error) {
      console.warn('Failed to initialize CrashLoggerService:', error);
    }
  }

  /**
   * Set up global JavaScript error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (global.HermesInternal) {
      // Hermes engine
      global.HermesInternal.setPromiseRejectionTracker &&
        global.HermesInternal.setPromiseRejectionTracker((id, rejection) => {
          this.logCrash('unhandled_promise_rejection', {
            id,
            rejection: rejection.toString(),
            stack: rejection.stack,
          });
        });
    }

    // Handle global errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Log to crash service if it looks like an error
      if (args.length > 0 && (
        args[0]?.includes?.('Error:') ||
        args[0]?.includes?.('TypeError:') ||
        args[0]?.includes?.('ReferenceError:') ||
        args[0]?.includes?.('undefined is not a function')
      )) {
        this.logCrash('console_error', {
          message: args.join(' '),
          timestamp: new Date().toISOString(),
        });
      }

      // Call original console.error
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * Set up native crash detection (iOS/Android)
   */
  setupNativeCrashDetection() {
    if (Platform.OS === 'ios') {
      // iOS native crash detection
      DeviceEventEmitter.addListener('RCTFatalError', (error) => {
        this.logCrash('native_ios_crash', error);
      });
    } else if (Platform.OS === 'android') {
      // Android native crash detection
      DeviceEventEmitter.addListener('AndroidFatalError', (error) => {
        this.logCrash('native_android_crash', error);
      });
    }
  }

  /**
   * Log a crash with detailed information
   */
  async logCrash(type, errorData, additionalInfo = {}) {
    try {
      const crashInfo = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        type,
        platform: Platform.OS,
        platformVersion: Platform.Version,
        buildType: __DEV__ ? 'debug' : 'release',
        appVersion: '1.0.0', // TODO: Get from app config
        error: errorData,
        additionalInfo,
        deviceInfo: {
          manufacturer: Platform.constants?.Brand || 'Unknown',
          model: Platform.constants?.Model || 'Unknown',
          systemName: Platform.constants?.systemName || Platform.OS,
          systemVersion: Platform.constants?.systemVersion || Platform.Version,
        },
      };

      // Add to memory cache
      this.crashLogs.unshift(crashInfo);

      // Keep only latest logs
      if (this.crashLogs.length > this.maxLogs) {
        this.crashLogs = this.crashLogs.slice(0, this.maxLogs);
      }

      // Store to persistent storage
      await this.storeLogs();

      // Send to remote service (if configured)
      this.sendToRemoteService(crashInfo);

      console.log('🚨 Crash logged:', type, errorData?.message || errorData);

    } catch (error) {
      console.warn('Failed to log crash:', error);
    }
  }

  /**
   * Load stored crash logs from AsyncStorage
   */
  async loadStoredLogs() {
    try {
      const storedLogs = await AsyncStorage.getItem(this.storageKey);
      if (storedLogs) {
        this.crashLogs = JSON.parse(storedLogs);
        console.log(`📋 Loaded ${this.crashLogs.length} stored crash logs`);
      }
    } catch (error) {
      console.warn('Failed to load stored crash logs:', error);
      this.crashLogs = [];
    }
  }

  /**
   * Store crash logs to AsyncStorage
   */
  async storeLogs() {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.crashLogs));
    } catch (error) {
      console.warn('Failed to store crash logs:', error);
    }
  }

  /**
   * Send crash data to remote service (optional)
   */
  sendToRemoteService(crashInfo) {
    // TODO: Implement remote crash reporting
    // Example integrations:
    // - Crashlytics: crashlytics().recordError(error)
    // - Sentry: Sentry.captureException(error)
    // - Custom API: fetch('/api/crashes', { method: 'POST', body: JSON.stringify(crashInfo) })

    if (__DEV__) {
      console.log('📤 Would send crash to remote service:', crashInfo.type);
    }
  }

  /**
   * Get all crash logs
   */
  getCrashLogs() {
    return this.crashLogs;
  }

  /**
   * Get crash logs by type
   */
  getCrashLogsByType(type) {
    return this.crashLogs.filter(log => log.type === type);
  }

  /**
   * Clear all crash logs
   */
  async clearLogs() {
    this.crashLogs = [];
    try {
      await AsyncStorage.removeItem(this.storageKey);
      console.log('🧹 Crash logs cleared');
    } catch (error) {
      console.warn('Failed to clear crash logs:', error);
    }
  }

  /**
   * Export crash logs for sharing/debugging
   */
  exportLogs() {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLogs: this.crashLogs.length,
      logs: this.crashLogs,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get crash summary statistics
   */
  getCrashStats() {
    const stats = {
      total: this.crashLogs.length,
      byType: {},
      byPlatform: {},
      recent: 0, // Last 24 hours
    };

    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    this.crashLogs.forEach(log => {
      // Count by type
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;

      // Count by platform
      stats.byPlatform[log.platform] = (stats.byPlatform[log.platform] || 0) + 1;

      // Count recent crashes
      if (new Date(log.timestamp).getTime() > oneDayAgo) {
        stats.recent++;
      }
    });

    return stats;
  }

  /**
   * Test the crash logger (development only)
   */
  testCrashLogger() {
    if (__DEV__) {
      this.logCrash('test_crash', {
        message: 'This is a test crash',
        stack: 'Test stack trace',
      }, {
        testMode: true,
      });
      console.log('🧪 Test crash logged');
    }
  }
}

// Create and export singleton instance
const crashLogger = new CrashLoggerService();

export default crashLogger;

// Export individual methods for convenience
export const {
  logCrash,
  getCrashLogs,
  getCrashLogsByType,
  clearLogs,
  exportLogs,
  getCrashStats,
  testCrashLogger,
} = crashLogger;