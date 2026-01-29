/**
 * Share Helper Utilities
 * Handles profile sharing functionality across platforms
 */
import { Share, Alert, Platform } from 'react-native';
import { generateProfileURL, getProfileShareContent } from './deepLinkingConfig';

/**
 * Share profile with native sharing options
 * @param {Object} profile - Profile data to share
 * @param {Object} options - Additional sharing options
 * @returns {Promise<boolean>} Success status
 */
export const shareProfile = async (profile, options = {}) => {
  try {
    if (!profile) {
      throw new Error('Profile data is required for sharing');
    }

    const shareContent = getProfileShareContent(profile);

    // Merge with custom options
    const finalContent = {
      ...shareContent,
      ...options,
    };

    const result = await Share.share(finalContent, {
      dialogTitle: 'Share Profile',
      excludedActivityTypes: options.excludedActivityTypes || [],
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared via:', result.activityType);
      } else {
        console.log('Profile shared successfully');
      }
      return true;
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
      return false;
    }

    return false;
  } catch (error) {
    console.error('Error sharing profile:', error);

    // Show fallback alert with copy option
    showShareFallback(profile);
    return false;
  }
};

/**
 * Show fallback sharing options when native sharing fails
 * @param {Object} profile - Profile data
 */
const showShareFallback = (profile) => {
  const profileURL = generateProfileURL(profile.userId || profile.id);

  Alert.alert(
    'Share Profile',
    'Choose how you\'d like to share this profile:',
    [
      {
        text: 'Copy Link',
        onPress: () => copyToClipboard(profileURL),
        style: 'default',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
const copyToClipboard = async (text) => {
  try {
    const { Clipboard } = await import('@react-native-clipboard/clipboard');
    await Clipboard.setString(text);

    Alert.alert(
      'Copied!',
      'Profile link has been copied to clipboard.',
      [{ text: 'OK', style: 'default' }]
    );
  } catch (error) {
    console.error('Error copying to clipboard:', error);

    // Fallback: Show the URL in an alert
    Alert.alert(
      'Profile Link',
      text,
      [{ text: 'OK', style: 'default' }]
    );
  }
};

/**
 * Share via specific social media platforms
 * @param {string} platform - Platform name (facebook, twitter, whatsapp, etc.)
 * @param {Object} profile - Profile data
 * @returns {Promise<boolean>} Success status
 */
export const shareViaSpecificPlatform = async (platform, profile) => {
  try {
    const shareContent = getProfileShareContent(profile);
    let url = '';

    switch (platform.toLowerCase()) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}`;
        break;

      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.message)}&url=${encodeURIComponent(shareContent.url)}`;
        break;

      case 'whatsapp':
        url = `whatsapp://send?text=${encodeURIComponent(shareContent.message + ' ' + shareContent.url)}`;
        break;

      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareContent.url)}&text=${encodeURIComponent(shareContent.message)}`;
        break;

      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}`;
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const { Linking } = await import('react-native');
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      throw new Error(`Cannot open ${platform}`);
    }
  } catch (error) {
    console.error(`Error sharing via ${platform}:`, error);

    // Fallback to native share
    return await shareProfile(profile);
  }
};

/**
 * Get available sharing options based on platform
 * @returns {Array} Array of sharing options
 */
export const getAvailableSharingOptions = () => {
  const commonOptions = [
    {
      id: 'native',
      name: 'More Options',
      icon: 'share',
      handler: shareProfile,
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: 'copy',
      handler: (profile) => {
        const url = generateProfileURL(profile.userId || profile.id);
        copyToClipboard(url);
      },
    },
  ];

  const socialOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'whatsapp',
      handler: (profile) => shareViaSpecificPlatform('whatsapp', profile),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'facebook',
      handler: (profile) => shareViaSpecificPlatform('facebook', profile),
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'twitter',
      handler: (profile) => shareViaSpecificPlatform('twitter', profile),
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: 'telegram',
      handler: (profile) => shareViaSpecificPlatform('telegram', profile),
    },
  ];

  return [...commonOptions, ...socialOptions];
};

/**
 * Create custom share content with branding
 * @param {Object} profile - Profile data
 * @param {Object} customization - Custom branding options
 * @returns {Object} Customized share content
 */
export const createCustomShareContent = (profile, customization = {}) => {
  const {
    appName = 'Professional Companionship',
    hashtags = ['#ProfessionalCompanionship', '#Connect'],
    includeAppPromo = true,
  } = customization;

  const baseContent = getProfileShareContent(profile);

  let message = baseContent.message;

  if (includeAppPromo) {
    message += `\n\nDiscover amazing people on ${appName}!`;
  }

  if (hashtags.length > 0) {
    message += `\n\n${hashtags.join(' ')}`;
  }

  return {
    ...baseContent,
    message,
  };
};

/**
 * Track sharing analytics
 * @param {string} platform - Platform used for sharing
 * @param {Object} profile - Profile that was shared
 * @param {boolean} success - Whether sharing was successful
 */
export const trackSharingAnalytics = (platform, profile, success) => {
  try {
    // Implement your analytics tracking here
    const analyticsData = {
      event: 'profile_shared',
      platform,
      profile_id: profile.userId || profile.id,
      profile_name: profile.name,
      success,
      timestamp: new Date().toISOString(),
    };

    console.log('Sharing analytics:', analyticsData);

    // Example: Send to analytics service
    // Analytics.track('profile_shared', analyticsData);
  } catch (error) {
    console.error('Error tracking sharing analytics:', error);
  }
};

/**
 * Batch share multiple profiles
 * @param {Array} profiles - Array of profiles to share
 * @param {Object} options - Sharing options
 * @returns {Promise<Array>} Array of results
 */
export const shareMultipleProfiles = async (profiles, options = {}) => {
  try {
    if (!Array.isArray(profiles) || profiles.length === 0) {
      throw new Error('Profiles array is required and must not be empty');
    }

    const results = await Promise.allSettled(
      profiles.map(profile => shareProfile(profile, options))
    );

    const successCount = results.filter(result =>
      result.status === 'fulfilled' && result.value === true
    ).length;

    const failureCount = results.length - successCount;

    console.log(`Shared ${successCount} profiles successfully, ${failureCount} failed`);

    return results;
  } catch (error) {
    console.error('Error sharing multiple profiles:', error);
    return [];
  }
};

/**
 * Share profile with QR code option
 * @param {Object} profile - Profile data
 * @returns {Promise<boolean>} Success status
 */
export const shareProfileWithQR = async (profile) => {
  try {
    const profileURL = generateProfileURL(profile.userId || profile.id);

    // Generate QR code URL (using a QR code service)
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileURL)}`;

    const shareContent = {
      title: `${profile.name}'s Profile QR Code`,
      message: `Scan this QR code to view ${profile.name}'s profile!`,
      url: qrCodeURL,
    };

    const result = await Share.share(shareContent);
    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing QR code:', error);
    return false;
  }
};

/**
 * Check if specific sharing platform is available
 * @param {string} platform - Platform to check
 * @returns {Promise<boolean>} Availability status
 */
export const isSharingPlatformAvailable = async (platform) => {
  try {
    const { Linking } = await import('react-native');

    const urls = {
      whatsapp: 'whatsapp://send',
      facebook: 'fb://profile',
      twitter: 'twitter://user',
      telegram: 'tg://msg',
      instagram: 'instagram://user',
    };

    const testURL = urls[platform.toLowerCase()];

    if (!testURL) {
      return false;
    }

    return await Linking.canOpenURL(testURL);
  } catch (error) {
    console.error(`Error checking platform availability for ${platform}:`, error);
    return false;
  }
};