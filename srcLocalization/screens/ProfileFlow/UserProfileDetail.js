/**
 * User Profile Detail Screen
 * Comprehensive profile view with all sections matching screenshots
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  Platform,
  Share,
  Alert,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme';
import { ICONS } from '../../constants/Icons';

// Components
import ButtonWrapper from '../../components/ButtonWrapper';
import BookingModal from '../../components/BookingModal';

// Navigation and utilities
import { useNavigation, useRoute } from '@react-navigation/native';
import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { useRTL } from '../../localization/hooks/useRTL';
import { NAMESPACES } from '../../localization/config/namespaces';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const COLLAPSED_HEADER_HEIGHT = 90;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * Section Components
 */

// Profile Info Section Component
const ProfileInfoSection = ({ profile }) => (
  <View style={sectionStyles.container}>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="location-on" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Location</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.location || profile?.city || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="work" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Profile Type</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.profile_type || 'Trained Companions'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="height" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Height</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.height || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="visibility" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Eyes</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.eye_color || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="cake" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Age</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.age || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="person" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Name</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.name || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="location-city" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>City</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.city || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="palette" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Hair Color</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.hair_color || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="fitness-center" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Body Type</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.body_type || 'Not specified'}</Text>
    </View>
  </View>
);

// About Section Component
const AboutSection = ({ profile }) => (
  <>
    {profile?.description && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="info" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>About me</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.description}</Text>
      </View>
    )}

    {profile?.reviews && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="star" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Reviews</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.reviews}</Text>
      </View>
    )}
  </>
);

// Categories and Services Section
const CategoriesServicesSection = ({ profile }) => (
  <>
    {profile?.categories && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="category" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Categories</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.categories) ? profile.categories.join(', ') : profile.categories}</Text>
      </View>
    )}

    {profile?.services && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="room-service" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Services</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.services) ? profile.services.join(', ') : profile.services}</Text>
      </View>
    )}
  </>
);

// Availability Section Component
const AvailabilitySection = ({ profile }) => (
  <View style={sectionStyles.container}>
    <View style={sectionStyles.titleContainer}>
      <Icon name="schedule" size={20} color={COLORS.specialTextColor} />
      <Text style={sectionStyles.sectionTitle}>When can we meet?</Text>
    </View>

    <View style={sectionStyles.scheduleContainer}>
      <View style={sectionStyles.scheduleHeader}>
        <Text style={sectionStyles.scheduleHeaderText}>Weekdays</Text>
        <Text style={sectionStyles.scheduleHeaderText}>From</Text>
        <Text style={sectionStyles.scheduleHeaderText}>Until</Text>
      </View>

      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
        <View key={day} style={sectionStyles.scheduleRow}>
          <Text style={sectionStyles.dayText}>{day}</Text>
          <Text style={sectionStyles.timeText}>-</Text>
          <Text style={sectionStyles.timeText}>-</Text>
        </View>
      ))}

      {profile?.available_24_hours && (
        <View style={sectionStyles.availabilityNote}>
          <Icon name="access-time" size={16} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.availabilityText}>Available 24 hours</Text>
        </View>
      )}
    </View>
  </View>
);

// Contact Section Component
const ContactSection = ({ profile }) => {
  const handlePhonePress = () => {
    if (profile?.phone) {
      Linking.openURL(`tel:${profile.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (profile?.email) {
      Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleSMSPress = () => {
    if (profile?.phone) {
      Linking.openURL(`sms:${profile.phone}`);
    }
  };

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="contact-phone" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.sectionTitle}>Contact</Text>
      </View>

      {profile?.phone && (
        <Pressable style={sectionStyles.contactRow} onPress={handlePhonePress}>
          <View style={sectionStyles.labelContainer}>
            <Icon name="sms" size={16} color={COLORS.specialTextColor} />
            <Text style={sectionStyles.label}>Phone SMS only</Text>
          </View>
          <Text style={sectionStyles.contactValue}>{profile.phone}</Text>
        </Pressable>
      )}

      {profile?.email && (
        <Pressable style={sectionStyles.contactRow} onPress={handleEmailPress}>
          <View style={sectionStyles.labelContainer}>
            <Icon name="email" size={16} color={COLORS.specialTextColor} />
            <Text style={sectionStyles.label}>Email</Text>
          </View>
          <Text style={sectionStyles.contactValue}>{profile.email}</Text>
        </Pressable>
      )}

      <View style={sectionStyles.contactActionsContainer}>
        {profile?.phone && (
          <>
            <Pressable style={sectionStyles.contactAction} onPress={handlePhonePress}>
              <Icon name="phone" size={20} color={COLORS.white} />
              <Text style={sectionStyles.contactActionText}>Call</Text>
            </Pressable>

            <Pressable style={sectionStyles.contactAction} onPress={handleSMSPress}>
              <Icon name="message" size={20} color={COLORS.white} />
              <Text style={sectionStyles.contactActionText}>SMS</Text>
            </Pressable>
          </>
        )}

        {profile?.email && (
          <Pressable style={sectionStyles.contactAction} onPress={handleEmailPress}>
            <Icon name="email" size={20} color={COLORS.white} />
            <Text style={sectionStyles.contactActionText}>Email</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

// Interests Section Component
const InterestsSection = ({ profile }) => (
  <>
    {profile?.interests && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="interests" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Interests</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}</Text>
      </View>
    )}

    {profile?.wishlist && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="favorite" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Wishlist</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.wishlist}</Text>
      </View>
    )}

    {profile?.favorite_things && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="thumb-up" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>My Favourite Things</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.favorite_things}</Text>
      </View>
    )}
  </>
);

// Gallery Section Component
const GallerySection = ({ profile }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!profile?.selfie_gallery || !Array.isArray(profile.selfie_gallery) || profile.selfie_gallery.length === 0) {
    return null;
  }

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="photo-library" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.sectionTitle}>My Selfie Gallery</Text>
      </View>

      <View style={sectionStyles.galleryGrid}>
        {profile.selfie_gallery.map((imageUrl, index) => (
          <Pressable
            key={index}
            style={sectionStyles.galleryItem}
            onPress={() => setSelectedImage(imageUrl)}
          >
            <FastImage
              source={{ uri: imageUrl }}
              style={sectionStyles.galleryImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={sectionStyles.imageOverlay}>
              <Icon name="zoom-in" size={24} color={COLORS.white} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Image Modal would go here */}
    </View>
  );
};

/**
 * UserProfileDetail Component
 * Professional profile detail screen with animated header and actions
 */
const UserProfileDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.COMMON]);
  const rtl = useRTL();

  // Get profile data from route params
  const { profile, userId } = route.params || {};

  // State management
  const [profileData, setProfileData] = useState(profile || {});
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  /**
   * Handle scroll animation
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Update header opacity based on scroll position
      const opacity = interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT / 2],
        [1, 0]
      );
      headerOpacity.value = opacity;

      // Check if header should collapse
      const shouldCollapse = scrollY.value > HEADER_HEIGHT / 2;
      if (shouldCollapse !== isHeaderCollapsed) {
        runOnJS(setIsHeaderCollapsed)(shouldCollapse);
      }
    },
  });

  /**
   * Animated header styles
   */
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2],
      'clamp'
    );

    return {
      height,
      transform: [{ translateY }],
    };
  });

  /**
   * Animated image styles
   */
  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 1.2],
      'clamp'
    );

    return {
      transform: [{ scale }],
      opacity: headerOpacity.value,
    };
  });

  /**
   * Back button styles
   */
  const animatedBackButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [0, 1]
    );

    return {
      backgroundColor: `rgba(47, 48, 145, ${backgroundColor})`,
    };
  });

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * Handle chat navigation
   */
  const handleChat = () => {
    if (profileData?.userId || profileData?.id) {
      navigation.navigate('Chat', {
        userId: profileData.userId || profileData.id,
        userName: profileData.name || profileData.username,
        userImage: profileData.profile_image || profileData.image,
      });
      showSuccessMessage('Opening chat', 'Starting conversation...');
    } else {
      showErrorMessage('Chat Unavailable', 'Unable to start chat with this user.');
    }
  };

  /**
   * Handle profile sharing
   */
  const handleShare = async () => {
    try {
      const shareContent = {
        title: `Check out ${profileData.name || 'this profile'}`,
        message: `Take a look at ${profileData.name || 'this amazing profile'} on Professional Companionship!`,
        url: `app://profile/${profileData.userId || profileData.id}`,
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        showSuccessMessage('Profile Shared', 'Profile shared successfully!');
      }
    } catch (error) {
      showErrorMessage('Share Failed', 'Unable to share profile. Please try again.');
    }
  };

  /**
   * Handle booking button press
   */
  const handleBooking = () => {
    setShowBookingModal(true);
  };

  /**
   * Handle booking submission
   */
  const handleBookingSubmit = async (bookingData) => {
    try {
      // Here you would normally make an API call to submit the booking
      console.log('Booking submitted:', bookingData);

      // Close modal
      setShowBookingModal(false);

      // Show success message
      showSuccessMessage(
        'Booking Requested',
        `Your booking request for ${profileData.name || 'this companion'} has been sent successfully!`
      );

      // Optionally navigate to bookings screen
      // navigation.navigate('MyBookings');
    } catch (error) {
      showErrorMessage('Booking Failed', 'Unable to process your booking. Please try again.');
    }
  };

  /**
   * Format user info
   */
  const formatUserInfo = () => {
    const age = profileData?.age ? `, ${profileData.age}` : '';
    const location = profileData?.location || profileData?.city || 'Location not specified';
    return `${location}${age}`;
  };

  /**
   * Render profile sections
   */
  const renderProfileSections = () => (
    <View style={styles.contentContainer}>
      {/* Profile Info Section */}
      <ProfileInfoSection profile={profileData} />

      {/* About Section */}
      <AboutSection profile={profileData} />

      {/* Categories and Services Section */}
      <CategoriesServicesSection profile={profileData} />

      {/* Availability Section */}
      <AvailabilitySection profile={profileData} />

      {/* Contact Section */}
      <ContactSection profile={profileData} />

      {/* Interests Section */}
      <InterestsSection profile={profileData} />

      {/* Gallery Section */}
      <GallerySection profile={profileData} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          <FastImage
            style={styles.profileImage}
            source={{
              uri: profileData?.profile_image || profileData?.image,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
        </Animated.View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.profileName}>
              {profileData?.name || profileData?.username || 'Anonymous'}
            </Text>
            <Text style={styles.profileLocation}>
              📍 {formatUserInfo()}
            </Text>

            {/* VIP Badge */}
            {profileData?.is_vip && (
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP MEMBER</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Fixed Action Buttons */}
      <View style={[styles.fixedActions, { top: insets.top + 10 }]}>
        {/* Back Button */}
        <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
          <Pressable onPress={handleBack} style={styles.actionButtonPressable}>
            <Icon name="arrow-back" size={20} color={COLORS.white} />
          </Pressable>
        </Animated.View>

        {/* Share Button */}
        <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
          <Pressable onPress={handleShare} style={styles.actionButtonPressable}>
            <Icon name="share" size={20} color={COLORS.white} />
          </Pressable>
        </Animated.View>
      </View>

      {/* Chat Button (Left Side) */}
      <View style={[styles.chatFloatingButton, { bottom: insets.bottom + 20 }]}>
        <Pressable onPress={handleChat} style={styles.floatingChatButton}>
          <Icon name="chat" size={24} color={COLORS.white} />
        </Pressable>
      </View>

      {/* Book Now Button (Right Side) */}
      <View style={[styles.bookFloatingButton, { bottom: insets.bottom + 20 }]}>
        <Pressable onPress={handleBooking} style={styles.floatingBookButton}>
          <Icon name="event" size={24} color={COLORS.white} />
          <Text style={styles.bookButtonText}>{t('screens:profile.userProfileDetail.bookNow')}</Text>
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT, paddingBottom: insets.bottom + 100 }
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileSections()}
      </AnimatedScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        companionData={profileData}
        onSubmit={handleBookingSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: PADDING.large,
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  profileName: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileLocation: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vipBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: PADDING.medium,
    paddingVertical: 6,
    borderRadius: 20,
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
    letterSpacing: 1,
  },
  fixedActions: {
    position: 'absolute',
    left: PADDING.large,
    right: PADDING.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  actionButtonPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatFloatingButton: {
    position: 'absolute',
    left: PADDING.large,
    zIndex: 10,
  },
  floatingChatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.specialTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookFloatingButton: {
    position: 'absolute',
    right: PADDING.large,
    zIndex: 10,
  },
  floatingBookButton: {
    minWidth: 80,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',  // Gold color
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: PADDING.large,
  },
  section: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
    marginBottom: PADDING.medium,
  },
  description: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.medium,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(47, 48, 145, 0.05)',
    padding: PADDING.medium,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.small,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successDark,
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
    borderRadius: 20,
  },
  availabilityBadgeToday: {
    backgroundColor: '#ff6b35',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  availabilityDotToday: {
    backgroundColor: COLORS.white,
  },
  availabilityText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: PADDING.medium,
  },
  chatButton: {
    flex: 1,
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
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
});

// Section Styles
const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: PADDING.medium,
    marginVertical: PADDING.small,
    padding: PADDING.large,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.medium,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
  },

  value: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'right',
    flex: 1,
  },

  description: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 20,
  },

  // Schedule styles
  scheduleContainer: {
    marginTop: PADDING.small,
  },

  scheduleHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.specialTextColor,
  },

  scheduleHeaderText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
    textAlign: 'center',
  },

  scheduleRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  dayText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },

  timeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
  },

  availabilityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: PADDING.small,
    padding: PADDING.small,
    backgroundColor: 'rgba(47,48,145,0.05)',
    borderRadius: 8,
    gap: 6,
  },

  availabilityText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '500',
  },

  // Contact styles
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  contactValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
  },

  contactActionsContainer: {
    flexDirection: 'row',
    marginTop: PADDING.medium,
    gap: 10,
  },

  contactAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.specialTextColor,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },

  contactActionText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },

  // Gallery styles
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: PADDING.small,
    gap: 8,
  },

  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
});

export default UserProfileDetail;