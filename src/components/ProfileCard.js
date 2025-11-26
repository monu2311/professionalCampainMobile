/**
 * Modern Profile Card Component
 * Instagram/Tinder-inspired vertical card design with animations
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';

// Components
import ButtonWrapper from './ButtonWrapper';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * ProfileCard Component
 * Modern card design with image, gradient overlay, user info, and actions
 */
const ProfileCard = ({
  item,
  onViewProfile,
  onBookmark,
  isBookmarked = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
console.log('ProfileCard Rendered for:', item);
  /**
   * Handle card press with animation
   */
  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  /**
   * Animated styles for card interactions
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  /**
   * Handle bookmark press
   */
  const handleBookmarkPress = () => {
    if (onBookmark) {
      onBookmark(item);
    }
  };

  /**
   * Handle view profile press
   */
  const handleViewProfilePress = () => {
    console.log('ProfileCard: View profile pressed for:', item?.name || item?.id);
    if (onViewProfile) {
      onViewProfile(item);
    }
  };


  /**
   * Get user description preview
   */
  const getDescriptionPreview = () => {
    const description = item?.description || item?.bio || '';
    return description.length > 80
      ? `${description.substring(0, 80)}...`
      : description;
  };

  return (
    <AnimatedPressable
      style={[styles.cardContainer, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleViewProfilePress}
      activeOpacity={1}
    >
      {/* Main Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.profileImage}
          source={{
            uri: item?.profile_image || item?.image,
            priority: FastImage.priority.high,
          }}
             resizeMode={FastImage.resizeMode.cover}
          fallback={true}
        />

        {/* Top Badges and Actions */}
        <View style={styles.topOverlay}>
          {/* VIP Badge */}
          {item?.is_vip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}

          {/* Online Status */}
          {item?.is_online && (
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>

        {/* Bookmark Button */}
        <Pressable
          style={[
            styles.bookmarkButton,
            isBookmarked && styles.bookmarkButtonActive
          ]}
          onPress={handleBookmarkPress}
        >
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={20}
            color={COLORS.white}
          />
        </Pressable>

        {/* Bottom Gradient and User Info */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.userInfoContainer}>
            {/* User Name and Age */}
            <Text style={styles.userName} numberOfLines={1}>
              {item?.name || item?.username || 'Anonymous'}
              {item?.age && (
                <Text style={styles.userAge}>, {item.age}</Text>
              )}
            </Text>

            {/* Location */}
            <Text style={styles.userLocation} numberOfLines={1}>
              📍 {item?.location || item?.city || 'Location not specified'}
            </Text>

            {/* Description Preview */}
            {getDescriptionPreview() && (
              <Text style={styles.descriptionPreview} numberOfLines={2}>
                {getDescriptionPreview()}
              </Text>
            )}

            {/* Availability Status */}
            <View style={styles.statusContainer}>
              {item?.available_now && (
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Available Now</Text>
                </View>
              )}

              {item?.available_today && !item?.available_now && (
                <View style={[styles.statusBadge, styles.statusBadgeToday]}>
                  <View style={[styles.statusDot, styles.statusDotToday]} />
                  <Text style={styles.statusText}>Available Today</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <ButtonWrapper
          label="View Profile"
          onClick={handleViewProfilePress}
          style={styles.viewProfileButton}
          textStyle={styles.viewProfileButtonText}
        />
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: PADDING.medium,
    marginVertical: PADDING.small,
    overflow: 'hidden',
    zIndex: 1,
    // Modern shadow with depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 400,
    width: '100%',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: PADDING.medium,
    left: PADDING.medium,
    right: PADDING.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  vipBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: PADDING.small,
    paddingVertical: 4,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  vipText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
  },
  onlineIndicator: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  bookmarkButton: {
    position: 'absolute',
    top: PADDING.medium,
    right: PADDING.medium,
    width: 40,
    height: 40,
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bookmarkButtonActive: {
    backgroundColor: COLORS.specialTextColor,
    opacity: 0.9,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    zIndex: 5,
  },
  userInfoContainer: {
    padding: PADDING.large,
    paddingBottom: PADDING.medium,
  },
  userName: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userAge: {
    fontWeight: '400',
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
  },
  userLocation: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  descriptionPreview: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    lineHeight: 18,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,203,7,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusBadgeToday: {
    backgroundColor: 'rgba(255,193,7,0.9)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    marginRight: 4,
  },
  statusDotToday: {
    backgroundColor: COLORS.white,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '500',
  },
  actionContainer: {
    padding: PADDING.large,
    paddingTop: PADDING.medium,
  },
  viewProfileButton: {
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 12,
    paddingVertical: PADDING.medium,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  viewProfileButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
});

export default ProfileCard;