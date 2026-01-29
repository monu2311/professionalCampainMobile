/**
 * SectionHeader Component
 * Modern section header with Home and See More buttons
 */

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme
import { COLORS, PADDING, TYPOGRAPHY } from '../constants/theme';

/**
 * SectionHeader Component
 * @param {string} title - Left side title (default: "Home")
 * @param {string} actionText - Right side action text (default: "See More")
 * @param {function} onActionPress - Callback for action button press
 * @param {boolean} showIcon - Whether to show arrow icon (default: true)
 * @param {string} subtitle - Optional subtitle below title
 */
const SectionHeader = ({
  title = "Home",
  actionText = "See More",
  onActionPress,
  showIcon = true,
  subtitle = null,
  isObscured = false,
}) => {
  // Animation values
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const actionScale = useSharedValue(1);
  const actionOpacity = useSharedValue(1);

  // Update opacity based on obscured state
  useEffect(() => {
    actionOpacity.value = withSpring(isObscured ? 0.3 : 1, {
      duration: 300,
    });
  }, [isObscured]);

  // Entrance animation
  useEffect(() => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  /**
   * Handle action button press
   */
  const handleActionPress = () => {
    // Animate button press
    actionScale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      actionScale.value = withSpring(1, { duration: 200 });
    }, 150);

    // Call callback
    if (onActionPress) {
      onActionPress();
    }
  };

  /**
   * Animated styles for action button
   */
  const animatedActionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: actionScale.value }],
    opacity: actionOpacity.value,
  }));

  return (
    <RNAnimated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Left Side - Title */}
      <RNAnimated.View
        entering={FadeInLeft.delay(200).springify()}
        style={styles.titleContainer}
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </RNAnimated.View>

      {/* Right Side - Action Button */}
      <RNAnimated.View
        entering={FadeInRight.delay(300).springify()}
        style={animatedActionStyle}
      >
        <Pressable
          onPress={!isObscured ? handleActionPress : null}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && !isObscured && styles.actionButtonPressed,
            isObscured && styles.actionButtonDisabled,
          ]}
          disabled={isObscured}
          pointerEvents={isObscured ? 'none' : 'auto'}
          android_ripple={!isObscured ? {
            color: 'rgba(47,48,145,0.2)',
            borderless: true,
          } : undefined}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          {showIcon && (
            <Icon
              name="arrow-forward-ios"
              size={14}
              color={COLORS.specialTextColor}
              style={styles.actionIcon}
            />
          )}
        </Pressable>
      </RNAnimated.View>
    </RNAnimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
    borderRadius: 20,
    backgroundColor: 'rgba(47,48,145,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(47,48,145,0.15)',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButtonPressed: {
    backgroundColor: 'rgba(47,48,145,0.15)',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(47,48,145,0.05)',
    borderColor: 'rgba(47,48,145,0.08)',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.specialTextColor,
    marginRight: 4,
  },
  actionIcon: {
    marginLeft: 2,
  },
});

export default SectionHeader;