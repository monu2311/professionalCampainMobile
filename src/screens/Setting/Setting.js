import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY, SHADOW} from '../../constants/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaQ, fetchPlans } from '../../apiConfig/Services';
import { activePlanHistory } from '../../reduxSlice/apiSlice';
import FastImage from 'react-native-fast-image';


// Enhanced settings data with icons and descriptions
const enhancedSettingsData = [
  {
    id: 1,
    label: 'Etiquette',
    navigation: 'AdvertisingRate',
    icon: 'star',
    description: 'Community guidelines and best practices',
    color: '#FF6B6B',
  },
  {
    id: 2,
    label: 'Help & Support',
    navigation: 'AboutUs',
    icon: 'help',
    description: 'Get assistance and find answers',
    color: '#4ECDC4',
  },
  {
    id: 3,
    label: 'Enquiries',
    navigation: 'Enquriries',
    icon: 'contact-support',
    description: 'Submit questions and feedback',
    color: '#45B7D1',
  },
  {
    id: 4,
    label: 'Change Password',
    navigation: 'ChangePassword',
    icon: 'lock',
    description: 'Update your account security',
    color: '#96CEB4',
  },
];

// Animated Setting Item Component
const AnimatedSettingItem = ({ item, index, onPress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const slideValue = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const delay = index * 150;

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 700,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, animatedValue, scaleValue, slideValue]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(item.navigation);
  };

  return (
    <Animated.View
      style={[
        styles.settingItemContainer,
        {
          opacity: animatedValue,
          transform: [
            { scale: scaleValue },
            { translateX: slideValue }
          ],
        },
      ]}
    >
      <Pressable style={styles.settingItem} onPress={handlePress}>
        {/* Background Gradient */}
        <View style={styles.itemBackground}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.itemGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          />
        </View>

        {/* Icon Section */}
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Icon name={item.icon} size={24} color={COLORS.white} />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>

        {/* Arrow Section */}
        <View style={styles.arrowSection}>
          <Icon name="keyboard-arrow-right" size={24} color={COLORS.placeHolderColor} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Profile Header Component
const ProfileHeader = () => {
  const profileData = useSelector(state => state.profile?.user_profile);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [headerOpacity, headerScale]);

  return (
    <Animated.View
      style={[
        styles.profileHeader,
        {
          opacity: headerOpacity,
          transform: [{ scale: headerScale }]
        }
      ]}
    >
      <LinearGradient
        colors={[COLORS.specialTextColor, '#4a4db8', '#6366f1']}
        style={styles.profileGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.profileContent}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            {profileData?.profile_image ? (
              <FastImage
                style={styles.profileImage}
                source={{
                  uri: "https://thecompaniondirectory.com/public/"+profileData?.profile_image,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.profileImageFallback}>
                <Icon name="person" size={40} color={COLORS.white} />
              </View>
            )}

            {/* Online Status */}
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
            </View>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileData?.profile_name || 'User Name'}
            </Text>
            <Text style={styles.profileEmail}>
              {profileData?.email || 'user@example.com'}
            </Text>
            <View style={styles.statusContainer}>
              <Icon name="verified" size={16} color={COLORS.white} />
              <Text style={styles.statusText}>Premium Member</Text>
            </View>
          </View>

          {/* Action Button */}
          <Pressable style={styles.editProfileButton}>
            <Icon name="edit" size={20} color={COLORS.white} />
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Setting = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const containerOpacity = useRef(new Animated.Value(0)).current;

  const nextHandler = (item) => {
    navigation.navigate(item);
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(activePlanHistory());
      fetchPlans(dispatch);
      fetchFaQ(dispatch);

      // Animate container appearance
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, dispatch, containerOpacity]);

  const renderSettingItem = (item, index) => (
    <AnimatedSettingItem
      key={item.id}
      item={item}
      index={index}
      onPress={nextHandler}
    />
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollContainer, { opacity: containerOpacity }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ProfileHeader />

        {/* Settings Title */}
        <Animated.View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Settings & Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your account and application settings
          </Text>
        </Animated.View>

        {/* Settings Items */}
        <View style={styles.settingsContainer}>
          {enhancedSettingsData.map((item, index) =>
            renderSettingItem(item, index)
          )}
        </View>

        {/* Footer */}
        <Animated.View style={styles.footer}>
          <Text style={styles.footerText}>
            Professional Companionship App
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Profile Header Styles
  profileHeader: {
    margin: PADDING.large,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOW.heavy,
  },
  profileGradient: {
    padding: PADDING.extralarge,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: PADDING.large,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImageFallback: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00CB07',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.white,
    marginLeft: 4,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Title Section
  titleContainer: {
    paddingHorizontal: PADDING.large,
    marginBottom: PADDING.large,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    lineHeight: 22,
  },

  // Settings Items
  settingsContainer: {
    paddingHorizontal: PADDING.large,
  },
  settingItemContainer: {
    marginBottom: PADDING.medium,
  },
  settingItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.large,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.light,
    position: 'relative',
    overflow: 'hidden',
  },
  itemBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemGradient: {
    flex: 1,
    borderRadius: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING.medium,
    ...SHADOW.light,
  },
  contentSection: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    lineHeight: 18,
  },
  arrowSection: {
    marginLeft: PADDING.small,
  },

  // Footer
  footer: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.extralarge,
    alignItems: 'center',
    marginTop: PADDING.extralarge,
  },
  footerText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
});

export default Setting;