/**
 * Deep Linking Configuration
 * Handles profile sharing and navigation via URLs
 */

/**
 * Deep linking configuration for React Navigation
 */
export const deepLinkingConfig = {
  prefixes: [
    'professionalcompanionship://',
    'https://professionalcompanionship.com',
    'app://',
  ],
  config: {
    screens: {
      // Main navigation structure
      MainStack: {
        screens: {
          // Profile-related screens
          UserProfileDetail: {
            path: '/profile/:userId',
            parse: {
              userId: (userId) => userId,
            },
            stringify: {
              userId: (userId) => userId,
            },
          },

          // Chat screens
          Chat: {
            path: '/chat/:userId',
            parse: {
              userId: (userId) => userId,
            },
          },

          // Main screens
          Main: 'main',
          Login: 'login',
          ForgetPassword: 'forgot-password',
          CreateAccount: 'signup',

          // Settings and other screens
          Setting: 'settings',
          ProfileScreen: 'my-profile',
        },
      },
    },
  },
};

/**
 * URL patterns for different deep link types
 */
export const URL_PATTERNS = {
  PROFILE: '/profile/:userId',
  CHAT: '/chat/:userId',
  MAIN: '/main',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SETTINGS: '/settings',
};

/**
 * Generate profile deep link URL
 * @param {string} userId - User ID for the profile
 * @param {Object} options - Additional options for URL generation
 * @returns {string} Generated URL
 */
export const generateProfileURL = (userId, options = {}) => {
  const { baseURL = 'app://profile', includeProfile = true } = options;

  if (!userId) {
    throw new Error('User ID is required for profile URL generation');
  }

  let url = `${baseURL}/${userId}`;

  // Add profile data as query parameters if needed
  if (includeProfile && options.profile) {
    const queryParams = new URLSearchParams();

    if (options.profile.name) {
      queryParams.append('name', options.profile.name);
    }

    if (options.profile.image) {
      queryParams.append('image', options.profile.image);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  return url;
};

/**
 * Generate chat deep link URL
 * @param {string} userId - User ID for the chat
 * @param {Object} options - Additional options
 * @returns {string} Generated chat URL
 */
export const generateChatURL = (userId, options = {}) => {
  const { baseURL = 'app://chat' } = options;

  if (!userId) {
    throw new Error('User ID is required for chat URL generation');
  }

  return `${baseURL}/${userId}`;
};

/**
 * Parse profile URL to extract user ID and parameters
 * @param {string} url - URL to parse
 * @returns {Object} Parsed URL data
 */
export const parseProfileURL = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // Extract user ID from path
    const userId = pathParts[pathParts.length - 1];

    // Extract query parameters
    const params = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return {
      userId,
      params,
      isValid: !!userId,
    };
  } catch (error) {
    console.error('Error parsing profile URL:', error);
    return {
      userId: null,
      params: {},
      isValid: false,
    };
  }
};

/**
 * Validate deep link URL format
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateDeepLink = (url) => {
  try {
    const urlObj = new URL(url);
    const validPrefixes = [
      'professionalcompanionship',
      'app',
      'https',
    ];

    const isValidPrefix = validPrefixes.some(prefix =>
      urlObj.protocol.startsWith(prefix)
    );

    if (!isValidPrefix) {
      return {
        isValid: false,
        error: 'Invalid URL prefix',
      };
    }

    // Check if it's a profile URL
    if (urlObj.pathname.includes('/profile/')) {
      const parsed = parseProfileURL(url);
      return {
        isValid: parsed.isValid,
        type: 'profile',
        data: parsed,
        error: parsed.isValid ? null : 'Invalid profile URL format',
      };
    }

    // Check if it's a chat URL
    if (urlObj.pathname.includes('/chat/')) {
      const pathParts = urlObj.pathname.split('/');
      const userId = pathParts[pathParts.length - 1];

      return {
        isValid: !!userId,
        type: 'chat',
        data: { userId },
        error: userId ? null : 'Invalid chat URL format',
      };
    }

    return {
      isValid: true,
      type: 'general',
      data: { url },
      error: null,
    };

  } catch (error) {
    return {
      isValid: false,
      error: 'Malformed URL',
    };
  }
};

/**
 * Handle incoming deep link navigation
 * @param {string} url - Deep link URL
 * @param {Object} navigation - React Navigation object
 * @returns {boolean} Success status
 */
export const handleDeepLinkNavigation = (url, navigation) => {
  try {
    const validation = validateDeepLink(url);

    if (!validation.isValid) {
      console.error('Invalid deep link:', validation.error);
      return false;
    }

    switch (validation.type) {
      case 'profile':
        navigation.navigate('UserProfileDetail', {
          userId: validation.data.userId,
          profile: validation.data.params,
        });
        return true;

      case 'chat':
        navigation.navigate('Chat', {
          userId: validation.data.userId,
        });
        return true;

      default:
        console.log('General deep link handled:', url);
        return true;
    }
  } catch (error) {
    console.error('Error handling deep link navigation:', error);
    return false;
  }
};

/**
 * Get shareable content for profile
 * @param {Object} profile - Profile data
 * @returns {Object} Share content object
 */
export const getProfileShareContent = (profile) => {
  const profileURL = generateProfileURL(profile.userId || profile.id, {
    profile: {
      name: profile.name,
      image: profile.profile_image,
    },
  });

  return {
    title: `Check out ${profile.name || 'this profile'}`,
    message: `Take a look at ${profile.name || 'this amazing profile'} on Professional Companionship!`,
    url: profileURL,
  };
};

/**
 * Register deep link handlers
 * @param {Object} navigation - React Navigation object
 */
export const registerDeepLinkHandlers = (navigation) => {
  // Handle initial URL when app is opened via deep link
  const handleInitialURL = async () => {
    try {
      const { Linking } = require('react-native');
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        handleDeepLinkNavigation(initialUrl, navigation);
      }
    } catch (error) {
      console.error('Error handling initial URL:', error);
    }
  };

  // Handle URLs when app is already running
  const handleURL = (event) => {
    handleDeepLinkNavigation(event.url, navigation);
  };

  // Register listeners
  const { Linking } = require('react-native');
  Linking.addEventListener('url', handleURL);

  // Handle initial URL
  handleInitialURL();

  // Return cleanup function
  return () => {
    Linking.removeEventListener('url', handleURL);
  };
};

/**
 * Test deep linking functionality
 * @param {Object} navigation - React Navigation object
 */
export const testDeepLinking = (navigation) => {
  const testUrls = [
    'app://profile/123',
    'app://chat/456',
    'professionalcompanionship://profile/789',
  ];

  console.log('Testing deep linking...');

  testUrls.forEach((url, index) => {
    setTimeout(() => {
      console.log(`Testing URL: ${url}`);
      const result = handleDeepLinkNavigation(url, navigation);
      console.log(`Result: ${result ? 'Success' : 'Failed'}`);
    }, index * 2000);
  });
};