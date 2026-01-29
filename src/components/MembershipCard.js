import React, { useRef, useEffect, memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, PADDING, SHADOW, HEIGHT } from '../constants/theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../apiConfig/Services';

const { width } = Dimensions.get('window');

const MembershipCard = memo(({ visible, onBuyPlan, onLogout, membershipInfo }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoize route data to prevent unnecessary re-renders
  const location = useRoute();

  // Removed debug logging to prevent excessive render cycles

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      await fetchProfile(dispatch);
      // The membership status will be automatically updated via Redux
      // and the card will hide if membership becomes active
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: location.name === 'UserChatList' ? HEIGHT*0.2 : 0 },
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={membershipInfo?.isExpired ? ['#FFC107', '#FF9800'] : [COLORS.specialTextColor, '#6366f1']}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon
              name={membershipInfo?.isExpired ? "access-time" : "lock-outline"}
              size={50}
              color={COLORS.white}
            />
          </LinearGradient>
        </View>

        <Text style={styles.title}>
          {membershipInfo?.isExpired ? "Your Plan Has Expired" : "Buy a Membership Plan"}
        </Text>
        <Text style={styles.subtitle}>
          {membershipInfo?.isExpired
            ? "Your membership plan has expired. You must renew to continue using the app."
            : "Purchase a plan to unlock premium features and access all content"}
        </Text>

        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#00CB07" />
            <Text style={styles.benefitText}>
              {membershipInfo?.isExpired ? "Continue accessing all profiles" : "Access to all profiles"}
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#00CB07" />
            <Text style={styles.benefitText}>
              {membershipInfo?.isExpired ? "Keep unlimited messaging" : "Unlimited messaging"}
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#00CB07" />
            <Text style={styles.benefitText}>
              {membershipInfo?.isExpired ? "Maintain your visibility" : "Advanced search filters"}
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={20} color="#00CB07" />
            <Text style={styles.benefitText}>
              {membershipInfo?.isExpired ? "Get priority support" : "Premium support"}
            </Text>
          </View>
        </View>

        {/* Refresh Button for Expired Members */}
        {membershipInfo?.isExpired && (
          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPressed,
              isRefreshing && styles.refreshButtonDisabled,
            ]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <View style={styles.refreshButtonContent}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color={COLORS.specialTextColor} />
              ) : (
                <Icon name="refresh" size={18} color={COLORS.specialTextColor} />
              )}
              <Text style={styles.refreshButtonText}>
                {isRefreshing ? "Checking..." : "Check Status"}
              </Text>
            </View>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.buyButton,
            pressed && styles.buyButtonPressed,
          ]}
          onPress={() => {
            // For expired Members, navigate to SelectPlan for renewal
            // For Companions, use the default onBuyPlan which goes to MembershipPlansScreen
            if (membershipInfo?.isExpired && membershipInfo?.profileType === 'member') {
              // Navigate directly to SelectPlan for expired Members
              navigation.navigate('SelectPlan');
            } else {
              // For Companions without membership, go to MembershipPlansScreen
              onBuyPlan();
            }
          }}
        >
          <LinearGradient
            colors={[COLORS.specialTextColor, '#6366f1']}
            style={styles.buyButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon
              name={membershipInfo?.isExpired ? "refresh" : "shopping-cart"}
              size={20}
              color={COLORS.white}
            />
            <Text style={styles.buyButtonText}>
              {membershipInfo?.isExpired ? "Renew Plan" : "Buy Plan"}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={onLogout}
        >
          <Icon name="logout" size={20} color={COLORS.placeHolderColor} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for tab bar
    zIndex: 10,
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: PADDING.large,
    alignItems: 'center',
    ...SHADOW.large,
    elevation: 15,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },
  buyButton: {
    width: '100%',
    marginBottom: 15,
  },
  buyButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buyButtonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutButtonPressed: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: COLORS.placeHolderColor,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    marginLeft: 8,
  },
  refreshButton: {
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.specialTextColor,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  refreshButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(47, 48, 145, 0.05)',
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: COLORS.specialTextColor,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    marginLeft: 8,
  },
});



export default MembershipCard;