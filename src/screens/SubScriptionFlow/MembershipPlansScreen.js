/**
 * MembershipPlansScreen.js
 * Modern membership plans selection screen with API integration
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Constants and styles
import { COLORS, PADDING, TYPOGRAPHY, SHADOW } from '../../constants/theme';

// API
import { getMembershipPlans } from '../../reduxSlice/apiSlice';

// Services
import NotificationService from '../../services/NotificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Features data matching the screenshots
const MEMBERSHIP_FEATURES = [
  {
    id: 1,
    icon: 'person',
    title: 'Full Profile Access',
    description: 'Complete companion profile features',
  },
  {
    id: 2,
    icon: 'chat',
    title: 'Premium Messaging',
    description: 'Advanced communication tools',
  },
  {
    id: 3,
    icon: 'headphones',
    title: 'Priority Support',
    description: '24/7 customer assistance',
  },
  {
    id: 4,
    icon: 'search',
    title: 'Advanced Search',
    description: 'Powerful filtering options',
  },
  {
    id: 5,
    icon: 'verified',
    title: 'Verification Badge',
    description: 'Trusted profile verification',
  },
  {
    id: 6,
    icon: 'schedule',
    title: '1 Year Access',
    description: 'Full year membership duration',
  },
];

// Plan Card Component
const PlanCard = ({ plan, index, onSelect, isSelected }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const slideValue = useRef(new Animated.Value(30)).current;
  console.log("plan", plan)

  useEffect(() => {
    const delay = index * 150;

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
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
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(plan);
  };

  const isPopular = plan?.name?.toLowerCase() === 'Companion Membership';

  return (
    <Animated.View
      style={[
        styles.planCard,
        isSelected && styles.selectedPlanCard,
        {
          opacity: animatedValue,
          transform: [
            { scale: scaleValue },
            { translateY: slideValue }
          ],
        },
      ]}
    >
      <Pressable style={styles.planPressable} onPress={handlePress}>
        <LinearGradient
          colors={
            isSelected
              ? [COLORS.specialTextColor, '#4a4db8']
              : ['#f8fafc', '#ffffff']
          }
          style={styles.planGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Popular Badge */}
          {isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MEMBERSHIP FEE</Text>
            </View>
          )}

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={[
              styles.currency,
              isSelected && styles.selectedText
            ]}>
              AUD
            </Text>
            <Text style={[
              styles.price,
              isSelected && styles.selectedText
            ]}>
              ${plan?.price}
            </Text>
          </View>

          {/* Plan Title */}
          <Text style={[
            styles.planTitle,
            isSelected && styles.selectedText
          ]}>
            {plan?.name}
          </Text>

          {/* Duration Info */}
          <Text style={[
            styles.durationInfo,
            isSelected && styles?.selectedSubtitleText
          ]}>
            One-time payment • {plan?.duration} access
          </Text>

          {/* Description */}
          {plan?.description && (
            <Text style={[
              styles.planDescription,
              isSelected && styles.selectedSubtitleText
            ]}>
              {plan?.description}
            </Text>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <Icon name="check-circle" size={24} color={COLORS.white} />
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

// Features Grid Component
const FeaturesGrid = () => (
  <View style={styles.featuresSection}>
    <Text style={styles.featuresTitle}>What's Included</Text>

    <View style={styles.featuresGrid}>
      {MEMBERSHIP_FEATURES.map((feature, index) => (
        <Animated.View
          key={feature.id}
          style={[
            styles.featureItem,
            {
              opacity: 1, // Always visible
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.specialTextColor, '#6366f1']}
            style={styles.featureIconContainer}
          >
            <Icon name={feature.icon} size={24} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </Animated.View>
      ))}
    </View>
  </View>
);

// Security Notice Component
const SecurityNotice = () => (
  <View style={styles.securityNotice}>
    <LinearGradient
      colors={['#10b981', '#059669']}
      style={styles.securityIconContainer}
    >
      <Icon name="shield" size={24} color={COLORS.white} />
    </LinearGradient>
    <View style={styles.securityTextContainer}>
      <Text style={styles.securityTitle}>Secure Payment</Text>
      <Text style={styles.securitySubtitle}>
        Your payment information is encrypted and secure
      </Text>
    </View>
  </View>
);

// Main Screen Component
const MembershipPlansScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get plans data from Redux
  const plansData = useSelector(state => state?.auth?.data?.membershipPlans?.data?.plan);
  const plansLoading = useSelector(state => state?.auth?.data?.membershipPlans?.isLoading);

  console.log("plansDataplansData", plansData)
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Load plans on screen focus
  useEffect(() => {
    if (isFocused) {
      loadPlans();

      // Animate header
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused]);

  // Animate content when plans are loaded
  useEffect(() => {
    if (plansData && !plansLoading) {
      setLoading(false);
      // Set default selection when plan loads
      setSelectedPlan(plansData);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [plansData, plansLoading]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      await dispatch(getMembershipPlans());
    } catch (error) {
      console.error('Failed to load membership plans:', error);
      NotificationService.error('Failed to load membership plans');
    }
  };

  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(plan);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedPlan) {
      NotificationService.warning('Please select a membership plan');
      return;
    }

    // Navigate to payment method selection
    navigation.navigate('SelectMethod', {
      plan: selectedPlan,
      totalAmount: selectedPlan.cost,
      paymentType: 'membership',
    });
  }, [selectedPlan, navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || plansLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.specialTextColor} />
        <Text style={styles.loadingText}>Loading membership plans...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.textColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          {/* Plans Grid */}
          <View style={styles.plansContainer}>
            {plansData ? (
              <PlanCard
                key={plansData?.id}
                plan={plansData}
                index={0}
                onSelect={handlePlanSelect}
                isSelected={selectedPlan?.id === plansData?.id}
              />
            ) : (
              <View style={styles.noPlansContainer}>
                <Text style={styles.noPlansText}>No membership plans available</Text>
                <Pressable style={styles.retryButton} onPress={loadPlans}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Features Section */}
          <FeaturesGrid />

          {/* Security Notice */}
          <SecurityNotice />
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Button */}
      {selectedPlan && (
        <View style={styles.bottomContainer}>
          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={[COLORS.specialTextColor, '#4a4db8']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.continueButtonText}>
                Continue to Payment
              </Text>
              <Icon name="arrow-forward" size={20} color={COLORS.white} />
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: PADDING.medium,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
  },
  headerSpacer: {
    width: 40,
  },

  // Scroll Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom button
  },

  // Plans Styles
  plansContainer: {
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.large,
  },
  planCard: {
    marginBottom: PADDING.large,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOW.medium,
  },
  selectedPlanCard: {
    ...SHADOW.large,
  },
  planPressable: {
    position: 'relative',
  },
  planGradient: {
    padding: PADDING.extralarge,
    alignItems: 'center',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: PADDING.medium,
    left: PADDING.medium,
    backgroundColor: COLORS.specialTextColor,
    paddingHorizontal: PADDING.medium,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    fontWeight: '700',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: PADDING.medium,
  },
  currency: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginRight: 8,
  },
  price: {
    fontSize: 48,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontWeight: '800',
  },
  selectedText: {
    color: COLORS.white,
  },
  selectedSubtitleText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  planTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 8,
    fontWeight: '700',
  },
  durationInfo: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.medium,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: PADDING.small,
  },
  selectionIndicator: {
    position: 'absolute',
    top: PADDING.medium,
    right: PADDING.medium,
  },
  noPlansContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.extralarge * 2,
  },
  noPlansText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.large,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.specialTextColor,
    paddingHorizontal: PADDING.extralarge,
    paddingVertical: PADDING.medium,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    fontWeight: '600',
  },

  // Features Styles
  featuresSection: {
    paddingHorizontal: PADDING.large,
    marginTop: PADDING.extralarge,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: PADDING.extralarge,
    fontWeight: '700',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: (SCREEN_WIDTH - PADDING.large * 2 - PADDING.medium) / 2,
    alignItems: 'center',
    marginBottom: PADDING.extralarge,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.medium,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Security Notice Styles
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    marginHorizontal: PADDING.large,
    marginTop: PADDING.extralarge,
    padding: PADDING.large,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  securityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING.medium,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: '#166534',
    marginBottom: 4,
    fontWeight: '600',
  },
  securitySubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: '#15803d',
    lineHeight: 18,
  },

  // Bottom Action Styles
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.large,
    paddingBottom: PADDING.extralarge,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW.button,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.large,
    gap: PADDING.small,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default MembershipPlansScreen;