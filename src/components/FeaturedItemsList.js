/**
 * FeaturedItemsList Component
 * Horizontal FlatList with modern card design for featured items
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withSpring,
  FadeInDown,
  SlideInLeft,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.28;
const ITEM_HEIGHT = 140;
const ITEM_SPACING = 12;

/**
 * Individual Featured Item Component
 */
const FeaturedItem = ({ item, index, onPress }) => {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.8)).current;
  const pressScale = useSharedValue(1);

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();
  }, []);

  /**
   * Handle press animation
   */
  const handlePressIn = () => {
    pressScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  // Animated press style
  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <RNAnimated.View
      style={[
        styles.itemContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View style={animatedPressStyle}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.itemPressable}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {/* Background Image */}
          <FastImage
            source={{
              uri: item.profile_image || item.image,
              priority: FastImage.priority.normal,
            }}
            style={styles.itemImage}
            resizeMode={FastImage.resizeMode.cover}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,0,0,0.4)',
              'rgba(0,0,0,0.8)',
            ]}
            style={styles.itemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            {item.is_vip && (
              <Animated.View
                entering={SlideInLeft.delay(200)}
                style={styles.vipIndicator}
              >
                <Icon name="star" size={10} color={COLORS.white} />
              </Animated.View>
            )}
            {item.is_verified && (
              <Animated.View
                entering={SlideInLeft.delay(300)}
                style={styles.verifiedIndicator}
              >
                <Icon name="verified" size={10} color={COLORS.white} />
              </Animated.View>
            )}
          </View>

          {/* Online Status */}
          {item.is_online && (
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
            </View>
          )}

          {/* User Info */}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.age && (
              <Text style={styles.itemAge}>
                {item.age}
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </RNAnimated.View>
  );
};

/**
 * Main FeaturedItemsList Component
 */
const FeaturedItemsList = ({ data = [], onItemPress, title = "Quick Browse" }) => {
  const [listData, setListData] = useState([]);
  const scrollX = useSharedValue(0);

  useEffect(() => {
    // Use provided data or create sample data if none provided
    if (data.length > 0) {
      setListData(data.slice(0, 5)); // Show only 5 items
    } else {
      // Sample data for demo
      setListData([
        { id: 1, name: "Sarah", age: 25, is_vip: true, is_online: true },
        { id: 2, name: "Emma", age: 28, is_verified: true, is_online: false },
        { id: 3, name: "Lisa", age: 24, is_vip: true, is_verified: true },
        { id: 4, name: "Anna", age: 26, is_online: true },
        { id: 5, name: "Maya", age: 27, is_verified: true },
      ]);
    }
  }, [data]);

  /**
   * Handle scroll animation
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  /**
   * Render item
   */
  const renderItem = ({ item, index }) => (
    <FeaturedItem
      item={item}
      index={index}
      onPress={onItemPress}
    />
  );

  /**
   * Handle see all press
   */
  const handleSeeAll = () => {
    if (onItemPress) {
      onItemPress({ action: 'see_all' });
    }
  };

  if (listData.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(400).springify()}
      style={styles.container}
    >
      {/* List Content */}
      <Animated.FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: PADDING.small,
  },
  listContent: {
    paddingLeft: PADDING.large,
    paddingRight: PADDING.medium,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  itemPressable: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
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
  statusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  vipIndicator: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    padding: 3,
  },
  verifiedIndicator: {
    backgroundColor: COLORS.successDark,
    borderRadius: 8,
    padding: 3,
  },
  onlineStatus: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  itemInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  itemName: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  itemAge: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  itemSeparator: {
    width: ITEM_SPACING,
  },
});

export default FeaturedItemsList;