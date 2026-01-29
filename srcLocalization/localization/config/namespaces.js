/**
 * Translation Namespaces Configuration
 * Optimized for code splitting and lazy loading
 */

export const NAMESPACES = {
  COMMON: 'common',        // Buttons, navigation, general UI
  FORMS: 'forms',          // Form fields, labels, placeholders
  STATIC: 'static',        // Dropdown lists, static data
  SCREENS: 'screens',      // Screen-specific content
  ERRORS: 'errors',        // Error messages, validation
  PROFILE: 'profile',      // Profile-related content
  CHAT: 'chat',           // Chat/messaging content
  SETTINGS: 'settings',    // Settings screen content
  AUTH: 'auth',           // Authentication screens
};

export const DEFAULT_NAMESPACES = [NAMESPACES.COMMON, NAMESPACES.ERRORS];

export const SCREEN_NAMESPACES = {
  LoginFlow: [NAMESPACES.AUTH, NAMESPACES.FORMS, NAMESPACES.ERRORS],
  ProfileFlow: [NAMESPACES.PROFILE, NAMESPACES.FORMS, NAMESPACES.STATIC],
  MainApp: [NAMESPACES.COMMON, NAMESPACES.SCREENS, NAMESPACES.STATIC],
  ChatFlow: [NAMESPACES.CHAT, NAMESPACES.COMMON],
  Settings: [NAMESPACES.SETTINGS, NAMESPACES.COMMON],
};

export const getNamespacesForScreen = (screenName) => {
  return SCREEN_NAMESPACES[screenName] || DEFAULT_NAMESPACES;
};