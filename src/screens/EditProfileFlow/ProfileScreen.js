import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Pressable, Platform, Animated} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY, SHADOW} from '../../constants/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {editProfileData} from '../../constants/Static';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../apiConfig/Services';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

// MenuItemAnimated component moved outside to avoid re-creation on render
const MenuItemAnimated = ({ item, index, nextHandler, getMenuIcon }) => {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemTranslateY = useRef(new Animated.Value(30)).current;
  const itemScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const delay = index * 100;

    Animated.parallel([
      Animated.timing(itemOpacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(itemTranslateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(itemScale, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [index, itemOpacity, itemScale, itemTranslateY]);

  return (
    <Animated.View
      style={{
        opacity: itemOpacity,
        transform: [
          { translateY: itemTranslateY },
          { scale: itemScale },
        ],
      }}
    >
      <Pressable
        onPress={() => nextHandler(item?.navigation)}
        style={[
          styles.menuItem,
          index === editProfileData.length - 1 && styles.lastMenuItem
        ]}
        android_ripple={{ color: 'rgba(47, 48, 145, 0.1)' }}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Icon name={getMenuIcon(item?.label)} size={20} color={COLORS.mainColor} />
          </View>
          <Text style={styles.menuLabel}>{item?.label}</Text>
        </View>
        <Icon name="arrow-forward-ios" size={16} color={COLORS.placeHolderColor} />
      </Pressable>
    </Animated.View>
  );
};
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
        colors={[COLORS.white, '#fff', '#fff']}
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
            {/* <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
            </View> */}
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileData?.profile_name || 'User Name'}
            </Text>
            <Text style={styles.profileEmail}>
              {profileData?.email || 'user@example.com'}
            </Text>
            {/* <View style={styles.statusContainer}>
              <Icon name="verified" size={16} color={COLORS.black} />
              <Text style={styles.statusText}>Premium Member</Text>
            </View> */}
          </View>

          {/* Action Button */}
          {/* <Pressable style={styles.editProfileButton}>
            <Icon name="edit" size={20} color={COLORS.white} />
          </Pressable> */}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const ProfileScreen = () => {
  const profileData = useSelector(state => state.profile?.user_profile);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Animated values for parallax effects
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const menuItemsOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // New morphing card animation values
  const profileCardScale = useRef(new Animated.Value(1)).current;
  const profileCardRotate = useRef(new Animated.Value(0)).current;

  console.log('profileDataprofileData', profileData);

  const nextHandler = item => {
    navigation.navigate(item);
  };

  const Logout = async(item)=>{
    await AsyncStorage.removeItem('ChapToken');
    await AsyncStorage.removeItem('account_step');
    navigation.reset({
      index: 0,
      routes: [{name: item}],
    });
  };

  const getMenuIcon = (label) => {
    switch(label) {
      case 'Personal Details': return 'person';
      case 'Gallery': return 'photo-library';
      case 'Video': return 'videocam';
      case 'Details': return 'info';
      case 'Contact': return 'contact-phone';
      case 'Optional': return 'tune';
      default: return 'arrow-forward-ios';
    }
  };

  const isFocused = useIsFocused();

  // Morphing Profile Card Animation
  const morphProfileCard = () => {
    Animated.parallel([
      Animated.spring(profileCardScale, {
        toValue: profileCardScale._value === 1 ? 1.05 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(profileCardRotate, {
        toValue: profileCardRotate._value === 0 ? 1 : 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle scroll events for parallax
  // eslint-disable-next-line no-unused-vars
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        // Show/hide sticky header
        if (offsetY > 200 && !showStickyHeader) {
          setShowStickyHeader(true);
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (offsetY <= 200 && showStickyHeader) {
          Animated.timing(headerOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowStickyHeader(false));
        }

        // Trigger menu animations
        if (offsetY > 150) {
          Animated.timing(menuItemsOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }

        // Auto-morph profile card on scroll
        if (offsetY > 100 && offsetY < 150) {
          morphProfileCard();
        }
      }
    }
  );

  // Hero section parallax transform
  const heroTransform = {
    transform: [
      {
        scale: scrollY.interpolate({
          inputRange: [0, 300],
          outputRange: [1, 1.15],
          extrapolate: 'clamp',
        }),
      },
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 300],
          outputRange: [0, -50],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  // Profile image floating effect
  const profileImageTransform = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 300],
          outputRange: [0, -30],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [0, 200, 300],
          outputRange: [1, 0.9, 0.8],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  // Text fade animation
  const textOpacity = {
    opacity: scrollY.interpolate({
      inputRange: [0, 150, 250],
      outputRange: [1, 0.7, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 250],
          outputRange: [0, -20],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  // Sticky header animation
  // eslint-disable-next-line no-unused-vars
  const stickyHeaderStyle = {
    opacity: headerOpacity,
    transform: [
      {
        translateY: headerOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  // Profile card morphing animation
  const profileCardAnimatedStyle = {
    transform: [
      { scale: profileCardScale },
      {
        rotateY: profileCardRotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
      {
        perspective: 1000,
      },
    ],
  };

  // Start animations on focus
  useEffect(() => {
    if (isFocused) {
      fetchProfile(dispatch);

      // Reset animations
      scrollY.setValue(0);
      headerOpacity.setValue(0);
      menuItemsOpacity.setValue(0);
      profileCardScale.setValue(1);
      profileCardRotate.setValue(0);
      setShowStickyHeader(false);

      // Start pulse animation for online indicator
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();

      // Trigger menu items animation after a delay
      setTimeout(() => {
        Animated.timing(menuItemsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 500);
    }
  }, [isFocused, dispatch, headerOpacity, menuItemsOpacity, profileCardRotate, profileCardScale, pulseAnimation, scrollY]);


  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {/* {showStickyHeader && (
        <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
          <View style={styles.stickyHeaderContent}>
            <View style={styles.stickyProfileContainer}>
              {profileData?.profile_image ? (
                <FastImage
                  style={styles.stickyProfileImage}
                  source={{
                    uri: "https://thecompaniondirectory.com/public/"+profileData?.profile_image,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={styles.stickyProfileImageFallback}>
                  <Icon name="person" size={20} color={COLORS.placeHolderColor} />
                </View>
              )}
            </View>
            <View style={styles.stickyTextContainer}>
              <Text style={styles.stickyProfileName}>
                {profileData?.profile_name || 'User Name'}
              </Text>
              <Text style={styles.stickyProfileEmail}>
                {profileData?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </Animated.View>
      )} */}

      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
      >
       <ProfileHeader />

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            {editProfileData?.map((item, index) => (
              <MenuItemAnimated
                key={item.label}
                item={item}
                index={index}
                nextHandler={nextHandler}
                getMenuIcon={getMenuIcon}
              />
            ))}
          </View>
        </View>

        {/* Modern Logout Section */}
        <View style={styles.logoutContainer}>
          <Pressable
            onPress={() => Logout('GetStarted')}
            style={styles.logoutButton}
          >
            <View style={styles.logoutGradient}>
              <Icon name="logout" color={COLORS.white} size={24} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    margin: PADDING.large,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOW.heavy,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  stickyHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.white,
    ...SHADOW.medium,
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    minHeight: 60,
  },
  stickyProfileContainer: {
    marginRight: PADDING.medium,
  },
  stickyProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  stickyProfileImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  stickyTextContainer: {
    flex: 1,
  },
  stickyProfileName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
  },
  stickyProfileEmail: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 2,
  },
  heroSection: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.extralarge,
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
    ...SHADOW.heavy,
  },
  profileGradient: {
    padding: PADDING.extralarge,
  },
  profileContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    // marginRight: PADDING.large,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImageFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: PADDING.medium,
  },
  profileName: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.black,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.black,
    marginBottom: 8,
  },
  onlineStatusRing: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.light,
  },
  onlineIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00CB07',
  },
  statusRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    top: -5,
    left: -5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.black,
    marginLeft: 4,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00CB07',
    marginRight: 4,
  },
  onlineStatusText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    gap: PADDING.small,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuSection: {
    paddingHorizontal: PADDING.large,
    marginBottom: PADDING.large,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 48, 145, 0.05)',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(47, 48, 145, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: PADDING.medium,
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: PADDING.large,
    paddingBottom: PADDING.extralarge + 50,
    alignItems: 'center',
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOW.heavy,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingHorizontal: PADDING.extralarge,
    paddingVertical: PADDING.large,
    gap: PADDING.medium,
  },
  logoutText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
  },
});

export default ProfileScreen;