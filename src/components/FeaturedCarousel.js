/**
 * FeaturedCarousel Component
 * Modern glassmorphic horizontal carousel for featured users
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import  {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  withSpring,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getCarouselUsers } from '../reduxSlice/apiSlice';
import { BASEURLS } from '../apiConfig/apicall';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 220;
const ITEM_WIDTH = SCREEN_WIDTH * 0.9;
const ITEM_SPACING = 15;

const AnimatedScrollView = RNAnimated.createAnimatedComponent(
  RNAnimated.ScrollView
);

/**
 * Individual Carousel Item Component
 */
const CarouselItem = ({ item, index, onPress }) => {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.9)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        styles.carouselItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(item)}
        style={styles.itemPressable}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        {/* Background Image */}
        <FastImage
          source={{
            uri: (item.profile_image.includes("https://thecompaniondirectory.com") ? item.profile_image : "https://thecompaniondirectory.com/" + item.profile_image),
            priority: FastImage.priority.high,
          }}
          style={styles.itemImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Glassmorphic Overlay */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.7)',
          ]}
          style={styles.itemGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Badges Container */}
        <View style={styles.badgesContainer}>
          {item.is_vip === 1 && (
            <RNAnimated.View
              entering={SlideInRight.delay(200)}
              style={styles.vipBadge}
            >
              <Icon name="star" size={14} color={COLORS.white} />
              <Text style={styles.badgeText}>VIP</Text>
            </RNAnimated.View>
          )}
          {/* {item.is_verified === 1 && (
            <Animated.View
              entering={SlideInRight.delay(300)}
              style={styles.verifiedBadge}
            >
              <Icon name="verified" size={14} color={COLORS.white} />
              <Text style={styles.badgeText}>Verified</Text>
            </Animated.View>
          )} */}
        </View>

        {/* User Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.location && (
            <View style={styles.locationContainer}>
              <Icon name="location-on" size={14} color={COLORS.white} />
              <Text style={styles.userLocation} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
        </View>

        {/* Glassmorphic Info Panel */}
        {item.is_verified === 1 && ( <View style={styles.glassPanel}>
          <View style={styles.glassPanelContent}>
            
         <Icon name="verified" size={14} color={COLORS.white} />
         <Text style={styles.panelText}>Verified</Text>
          </View>
        </View>)}
      </Pressable>
    </RNAnimated.View>
  );
};

/**
 * Pagination Dots Component
 */
const PaginationDots = ({ data, scrollX }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = interpolate(scrollX.value, inputRange, [0.7, 1.2, 0.7]);
          const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4]);

          return {
            transform: [{ scale }],
            opacity,
          };
        });

        return (
          <RNAnimated.View
            key={index}
            style={[styles.paginationDot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

/**
 * Main FeaturedCarousel Component
 */
const FeaturedCarousel = ({ onUserPress }) => {
  const dispatch = useDispatch();
  const carouselData = useSelector(state => state?.auth?.data?.getCarouselUsers);
  console.log("kjashdasd", carouselData)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values
  const scrollX = useSharedValue(0);
  const carouselOpacity = useSharedValue(0);

  // Auto-scroll functionality
  const scrollViewRef = useRef(null);
  const autoScrollTimer = useRef(null);

  useEffect(() => {
    // Fetch carousel data
    dispatch(getCarouselUsers());

    // Animate carousel entrance
    carouselOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (carouselData?.data?.length > 1) {
      startAutoScroll();
    }
    return () => clearAutoScroll();
  }, [carouselData, currentIndex]);

  const startAutoScroll = () => {
    autoScrollTimer.current = setTimeout(() => {
      if (carouselData?.data?.length > 0) {
        const nextIndex = (currentIndex + 1) % carouselData.data.length;
        scrollToIndex(nextIndex);
        setCurrentIndex(nextIndex);
      }
    }, 4000); // Auto-scroll every 4 seconds
  };

  const clearAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * ITEM_WIDTH,
      animated: true,
    });
  };

  /**
   * Handle scroll events
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  /**
   * Handle user press
   */
  const handleUserPress = (user) => {
    clearAutoScroll();
    if (onUserPress) {
      onUserPress(user);
    }
  };

  // Animated carousel container style
  const animatedCarouselStyle = useAnimatedStyle(() => ({
    opacity: carouselOpacity.value,
  }));

  // Loading state
  if (carouselData?.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading featured profiles...</Text>
      </View>
    );
  }

  // No data state
  if (!carouselData?.data || carouselData.data.length === 0) {
    return null;
  }

  return (
    <RNAnimated.View
      style={[styles.carouselContainer, animatedCarouselStyle]}
      entering={FadeIn.duration(800)}
    >
      {/* Header */}
      <View style={styles.carouselHeader}>
        <Text style={styles.carouselTitle}>Featured Profiles</Text>
        <View style={styles.featuredBadge}>
          <Icon name="star" size={16} color={COLORS.gold} />
          <Text style={styles.featuredText}>Premium</Text>
        </View>
      </View>

      {/* Carousel ScrollView */}
      <AnimatedScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollBegin={clearAutoScroll}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setCurrentIndex(newIndex);
          startAutoScroll();
        }}
      >
        {carouselData.data.map((item, index) => (
          <CarouselItem
            key={item.id || index}
            item={item}
            index={index}
            onPress={handleUserPress}
          />
        ))}
      </AnimatedScrollView>

      {/* Pagination Dots */}
      <PaginationDots data={carouselData.data} scrollX={scrollX} />
    </RNAnimated.View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: CAROUSEL_HEIGHT + 60,
    marginVertical: PADDING.medium,
  },
  loadingContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: PADDING.medium,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    marginBottom: PADDING.medium,
  },
  carouselTitle: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201,162,39,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  featuredText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.gold,
  },
  scrollContent: {
    paddingLeft: PADDING.large,
    paddingRight: PADDING.large - ITEM_SPACING,
  },
  carouselItem: {
    paddingBottom:PADDING.medium,
    width: ITEM_WIDTH,
    height: CAROUSEL_HEIGHT,
    marginRight: ITEM_SPACING,
    borderRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRigthRadius:20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  itemPressable: {
    flex: 1,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badgesContainer: {
    position: 'absolute',
    top: PADDING.medium,
    right: PADDING.medium,
    flexDirection: 'column',
    gap: 6,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
  },
  itemInfo: {
    position: 'absolute',
    bottom: PADDING.large,
    left: PADDING.large,
    right: PADDING.large,
  },
  userName: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassPanel: {
    position: 'absolute',
    top: PADDING.medium,
    left: PADDING.medium,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  glassPanelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    backgroundColor:COLORS.successDark
  },
  panelText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.white,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING.medium,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.specialTextColor,
  },
});

export default FeaturedCarousel;