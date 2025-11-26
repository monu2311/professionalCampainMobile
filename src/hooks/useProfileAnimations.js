/**
 * Profile Animation Hooks
 * Custom hooks for managing animations in profile-related screens
 */
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate } from 'react-native-reanimated';
import { useCallback } from 'react';

/**
 * Hook for card entrance animations
 * Provides staggered entrance animations for profile cards
 */
export const useCardEntranceAnimation = (index = 0, delay = 100) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);

  const animateIn = useCallback(() => {
    const animationDelay = index * delay;

    opacity.value = withTiming(1, {
      duration: 600,
      delay: animationDelay,
    });

    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
      delay: animationDelay,
    });

    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      delay: animationDelay,
    });
  }, [index, delay, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return {
    animatedStyle,
    animateIn,
  };
};

/**
 * Hook for card press animations
 * Provides press feedback animations for interactive elements
 */
export const useCardPressAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const pressIn = useCallback(() => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(0.8, { duration: 150 });
  }, [scale, opacity]);

  const pressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(1, { duration: 150 });
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    pressIn,
    pressOut,
  };
};

/**
 * Hook for header parallax animation
 * Provides parallax scrolling effects for profile headers
 */
export const useHeaderParallaxAnimation = (headerHeight = 300) => {
  const scrollY = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, headerHeight],
      [headerHeight, headerHeight * 0.3],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2],
      [1, 0],
      'clamp'
    );

    return {
      height,
      opacity,
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 1.2],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight * 0.3],
      'clamp'
    );

    return {
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 3, headerHeight / 2],
      [1, 0.8, 0],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight / 2],
      [0, -20],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return {
    scrollY,
    headerStyle,
    imageStyle,
    titleStyle,
  };
};

/**
 * Hook for floating action button animations
 * Provides entrance and interaction animations for FABs
 */
export const useFloatingButtonAnimation = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  const show = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(1, { duration: 300 });
    rotation.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
  }, [scale, opacity, rotation]);

  const hide = useCallback(() => {
    scale.value = withSpring(0, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(0, { duration: 200 });
  }, [scale, opacity]);

  const press = useCallback(() => {
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    });
    rotation.value = withSpring(15, {
      damping: 15,
      stiffness: 200,
    });

    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 200,
      });
    }, 100);
  }, [scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    show,
    hide,
    press,
  };
};

/**
 * Hook for bookmark animation
 * Provides animation for bookmark toggle interactions
 */
export const useBookmarkAnimation = () => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const toggleBookmark = useCallback((isBookmarked) => {
    if (isBookmarked) {
      // Animate to bookmarked state
      scale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 200,
      });
      rotation.value = withSpring(360, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      // Animate to unbookmarked state
      scale.value = withSpring(0.8, {
        damping: 15,
        stiffness: 200,
      });
      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    }

    // Return to normal size
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
    }, 200);
  }, [scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return {
    animatedStyle,
    toggleBookmark,
  };
};

/**
 * Hook for loading state animations
 * Provides skeleton loading and shimmer effects
 */
export const useLoadingAnimation = () => {
  const opacity = useSharedValue(0.3);
  const translateX = useSharedValue(-100);

  const startShimmer = useCallback(() => {
    // Opacity pulse animation
    opacity.value = withTiming(1, { duration: 1000 }, () => {
      opacity.value = withTiming(0.3, { duration: 1000 });
    });

    // Shimmer effect
    translateX.value = withTiming(100, { duration: 1500 }, () => {
      translateX.value = -100;
    });
  }, [opacity, translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    shimmerStyle,
    pulseStyle,
    startShimmer,
  };
};

/**
 * Hook for page transition animations
 * Provides smooth transitions between screens
 */
export const usePageTransitionAnimation = () => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(100);
  const scale = useSharedValue(0.9);

  const animateIn = useCallback(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 150,
    });
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 200,
    });
  }, [opacity, translateX, scale]);

  const animateOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: 300 });
    translateX.value = withTiming(-100, { duration: 300 });
    scale.value = withTiming(0.9, { duration: 300 });
  }, [opacity, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return {
    animatedStyle,
    animateIn,
    animateOut,
  };
};

/**
 * Hook for scroll-based animations
 * Provides various scroll-triggered animations
 */
export const useScrollAnimations = (scrollY) => {
  const filterOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.5, 0],
      'clamp'
    );

    return { opacity };
  });

  const headerOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50, 100],
      [0, 0.5, 1],
      'clamp'
    );

    return { opacity };
  });

  const cardScale = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      'clamp'
    );

    return {
      transform: [{ scale }],
    };
  });

  return {
    filterOpacity,
    headerOpacity,
    cardScale,
  };
};