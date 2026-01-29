import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import MembershipRequiredModal from '../components/MembershipRequiredModal';
import { useMembershipGuard } from '../hooks/useMembershipGuard';
import { COLORS } from '../constants/theme';

const withMembershipProtection = (WrappedComponent) => {
  return (props) => {
    const {
      isContentLocked,
      showMembershipModal,
      isAllowedProfileScreen,
      isLoading,
      navigateToMembership,
      logout,
      refreshMembershipStatus,
    } = useMembershipGuard();

    const [blurAmount, setBlurAmount] = React.useState(0);
    const contentOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (isContentLocked) {
        // Set blur amount as a plain number for BlurView
        setBlurAmount(15);

        Animated.timing(contentOpacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Reset blur amount to 0
        setBlurAmount(0);

        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [isContentLocked]);

    useEffect(() => {
      const unsubscribe = props.navigation?.addListener('focus', () => {
        refreshMembershipStatus();
      });

      return unsubscribe;
    }, [props.navigation]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.specialTextColor} />
        </View>
      );
    }

    if (isAllowedProfileScreen) {
      return <WrappedComponent {...props} />;
    }

    return (
      <>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { opacity: contentOpacity }
            ]}
            pointerEvents={isContentLocked ? 'none' : 'auto'}
          >
            <WrappedComponent {...props} />
          </Animated.View>

          {isContentLocked && (
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.blurContainer,
              ]}
              pointerEvents="none"
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={blurAmount}
                reducedTransparencyFallbackColor={COLORS.white}
              />
            </Animated.View>
          )}
        </View>

        {/* <MembershipRequiredModal
          visible={showMembershipModal}
          onBuyPlan={navigateToMembership}
          onLogout={logout}
        /> */}
      </>
    );
  };
};

const ProtectedScreen = ({ Component, ...props }) => {
  const ProtectedComponent = withMembershipProtection(Component);
  return <ProtectedComponent {...props} />;
};

export { withMembershipProtection, ProtectedScreen };

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  blurContainer: {
    zIndex: 998,
    elevation: 10,
  },
});