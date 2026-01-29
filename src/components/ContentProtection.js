import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useMembershipContext } from '../contexts/MembershipContext';
import MembershipCard from './MembershipCard';
import { COLORS } from '../constants/theme';

const ContentProtection = ({ children, style }) => {
  const route = useRoute();
  const { isContentLocked, showMembershipCard, checkMembershipForRoute, navigateToMembership, logout, membershipInfo } = useMembershipContext();

  const allowedProfileScreens = [
    'PersonalDetails',
    'Gallery',
    'Video',
    'EditDetails',
    'EditContact',
    'Optional',
    'SelectPlan',
    'SelectMethod',
    'PayPalWebView',
    'StripePaymentScreen',
    'Login',
    'singup',
    'ForgetPassword',
    'GetStarted',
    'PleaseSelect',
    'SplashScreen'
  ];

  const isAllowedProfileScreen = allowedProfileScreens.includes(route.name);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Check membership status when route changes
  useEffect(() => {
    checkMembershipForRoute(route.name);

    // Force check after a delay if this is the Home/Main route
    if (route.name === 'Home') {
      const timer = setTimeout(() => {
        checkMembershipForRoute(route.name);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [route.name, checkMembershipForRoute]);

  // Add focus-based check for non-allowed screens
  useFocusEffect(
    useCallback(() => {
      if (!isAllowedProfileScreen) {
        // Force check after short delay to ensure all state is updated
        const timer = setTimeout(() => {
          checkMembershipForRoute(route.name);
        }, 200);

        return () => clearTimeout(timer);
      }
    }, [route.name, checkMembershipForRoute, isAllowedProfileScreen])
  );

  useEffect(() => {
    if (isContentLocked) {
      // Show overlay and dim content
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide overlay and show content
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isContentLocked]);

  // Don't apply protection to allowed screens
  if (isAllowedProfileScreen) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: contentOpacity }
        ]}
        pointerEvents={isContentLocked ? 'none' : 'auto'}
      >
        {children}
      </Animated.View>

      {/* Overlay when content is locked */}
      {isContentLocked && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayOpacity }
          ]}
          pointerEvents="none"
        />
      )}

      {/* Membership Card - positioned above overlay */}
      <MembershipCard
        visible={showMembershipCard}
        onBuyPlan={navigateToMembership}
        onLogout={logout}
        membershipInfo={membershipInfo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    zIndex: 1,
  },
});

export default ContentProtection;