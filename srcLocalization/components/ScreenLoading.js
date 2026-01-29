/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
  Platform
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('screen');

const LoadingDots = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );

    dot2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );

    dot3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.3, 1]),
    transform: [
      { scale: interpolate(dot1.value, [0, 1], [0.8, 1.2]) },
    ],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.3, 1]),
    transform: [
      { scale: interpolate(dot2.value, [0, 1], [0.8, 1.2]) },
    ],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.3, 1]),
    transform: [
      { scale: interpolate(dot3.value, [0, 1], [0.8, 1.2]) },
    ],
  }));

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
};

const ModernLoader = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.loaderContainer, animatedStyle]}>
      <LinearGradient
        colors={[COLORS.specialTextColor || '#6366f1', '#8b5cf6', '#a855f7']}
        style={styles.gradientLoader}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.innerLoader} />
      </LinearGradient>
    </Animated.View>
  );
};

const ScreenLoading = ({ loader, message = 'Please wait' }) => {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    if (loader) {
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false
      );
    } else {
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [loader]);

  const containerPulse = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulseAnim.value, [0, 1], [0.98, 1.02]) },
    ],
  }));

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={loader}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <RNAnimated.View
        style={[
          styles.modalContainer,
          { opacity: fadeAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
          style={styles.gradientBackdrop}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />

        <Animated.View
          entering={FadeIn.duration(300).springify()}
          style={[styles.glassContainer, containerPulse]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
            style={styles.modalContent}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
          >
            <ModernLoader />

            <Animated.Text
              entering={FadeIn.duration(400).delay(200)}
              style={styles.loadingText}
            >
              {message}
            </Animated.Text>

            <LoadingDots />
          </LinearGradient>
        </Animated.View>
      </RNAnimated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glassContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  modalContent: {
    paddingVertical: 35,
    paddingHorizontal: 45,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: width * 0.7,
  },
  loaderContainer: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  gradientLoader: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerLoader: {
    width: '85%',
    height: '85%',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  loadingText: {
    color: COLORS.textColor || '#1a1a1a',
    fontSize: 16,
    fontFamily: TYPOGRAPHY?.QUICKREGULAR || 'System',
    fontWeight: '500',
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.specialTextColor || '#6366f1',
  },
});

export default ScreenLoading;

