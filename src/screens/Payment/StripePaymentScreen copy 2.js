/**
 * StripePaymentScreen.js
 * Stripe payment screen with card details form
 * Uses @stripe/stripe-react-native for secure card handling
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  Animated,
  Pressable,
} from 'react-native';
import {
  StripeProvider,
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY } from '../../constants/theme';
import { ICONS } from '../../constants/Icons';

// Services
import PaymentService from '../../services/PaymentService';
import NotificationService from '../../services/NotificationService';

// Components
import GradientButton from '../../components/GradientButton';
import ButtonWrapper from '../../components/ButtonWrapper';

// Redux actions
import { activePlanHistory, planhistory } from '../../reduxSlice/apiSlice';
import { fetchProfile } from '../../apiConfig/Services';

// Stripe publishable key (should be in env config in production)
// const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QZfioRuVAfrNXRvJWGSJu0mj9c5lJpGXhUBJJJSWcL5K3EMLsczgHn6xQcPz82vxJBNyXLQy1EV03mS1vyfHT8Z00tP1fJGXj'; // Replace with actual key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S6rgR3VTSa1C6S0YDlJ5vyARXHLvxlFX7kPKucIh0yPl5mGqEv6NJuB8XoPOFXf5WBjQa7QBfCrGZktjz6rwT4j00FRLBRrj4'
/**
 * Payment Form Component
 */
const PaymentForm = ({ paymentData, planDetails, onSuccess, onError, initialClientSecret, initialPaymentIntentId, paymentType = 'subscription' }) => {
  const stripe = useStripe();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get user profile data for billing details
  const profileData = useSelector(state => state.profile?.user_profile);
  const userData = useSelector(state => state.profile?.data);

   console.log("userDatauserData",userData)
   console.log("profileData",profileData)

  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(initialClientSecret || null);
  // console.log("clientSecret",clientSecret)
  const [paymentIntentId, setPaymentIntentId] = useState(initialPaymentIntentId || null);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  

  const isFocused = useIsFocused();

  // Initialize payment intent only if not already provided
  useEffect(() => {
    if (isFocused && !clientSecret) {
      console.log('No clientSecret provided, initializing payment...');
      initializePayment();
    } else if (clientSecret && paymentIntentId) {
      console.log('Payment already initialized:', {
        paymentIntentId,
        clientSecret: 'Present'
      });
      fetchProfile(dispatch);
    }
  }, [isFocused, clientSecret]);

  /**
   * Initialize Stripe payment intent
   */
  const initializePayment = async () => {
    try {
      console.log('Initializing payment with data:', paymentData);

      if (!paymentData) {
        throw new Error('Payment data is missing');
      }

      setLoading(true);
      const result = await PaymentService.initializeStripe(paymentData, dispatch);

      console.log('Initialize stripe result:', result);

      if (result.success) {
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        console.log('Payment intent created successfully:', {
          paymentIntentId: result.paymentIntentId,
          clientSecret: result.clientSecret ? 'Present' : 'Missing'
        });
      } else {
        throw new Error(result.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment';
      NotificationService.error(errorMessage);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle card input change
   */
  const handleCardChange = (details) => {
    console.log('Card details changed:', details);
    setCardDetails(details);
    setIsCardComplete(details.complete);
  };

  /**
   * Process payment
   */
  const handlePayment = async () => {
    if (!isCardComplete) {
      NotificationService.warning('Please enter complete card details');
      return;
    }

    if (!clientSecret) {
      NotificationService.error('Payment not initialized. Please try again.');
      initializePayment();
      return;
    }

    try {
      setLoading(true);

      // Prepare billing details from user profile
      const billingDetails = {
        email: userData?.email || profileData?.email || paymentData.email || 'customer@example.com',
        name: userData?.user_name || profileData?.name || paymentData.name || 'Customer',
        phone: userData?.phone_no || profileData?.phone_no || null,
        address: {
          country: userData?.country || profileData?.country || null,
          state: userData?.state || profileData?.state || null,
        }
      };

      console.log('Billing details:', billingDetails);

      // Confirm payment with Stripe using correct method signature
      console.log('Confirming payment with Stripe...');
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        billingDetails: billingDetails,
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        throw new Error(confirmError.message);
      }

      console.log('Stripe payment confirmed successfully', paymentIntent);

      // Determine plan_type based on profile_type (1 = management, else membership)
      const planType = profileData?.profile_type === 1 || profileData?.profile_type === '1'
        ? "management"
        : "membership";

      // Confirm payment on backend
      console.log('Confirming payment with backend...');
      const confirmData = {
        payment_intent_id: paymentIntentId || paymentIntent?.id,
        user_id: profileData?.user_id || userData?.id || paymentData.userId,
        plan_id: paymentData.plan_id,
        hours: paymentData.hours || paymentData.no_of_days || 0,
        plan_type: planType
      };

      console.log('Backend confirmation data:', confirmData);
      const backendResponse = await PaymentService.confirmStripe(confirmData, dispatch);
      console.log('Backend confirmation response:', backendResponse);

      if (backendResponse.success) {
        onSuccess();

        // Refresh plan data if membership payment
        if (paymentType === 'membership') {
          dispatch(activePlanHistory());
          dispatch(planhistory());
        }

        showMessage({
          message: 'Payment Successful',
          description: `Your payment for ${planDetails?.name || 'Plan'} has been processed successfully!`,
          type: 'success',
          icon: 'success',
          duration: 3000,
        });

        // Dynamic navigation based on payment type
        setTimeout(() => {
          if (paymentType === 'membership') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }], // Go to Main for membership
            });
          } else if (paymentType === 'boostProfile') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }], // Go to Main for boost
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }], // Default navigation for subscriptions
            });
          }
        }, 1500);
      } else {
        throw new Error(backendResponse.message || 'Backend payment confirmation failed');
      }
    } catch (error) {
      console.error('Payment error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        stripeErrorCode: error.stripeErrorCode,
        declineCode: error.declineCode,
        localizedMessage: error.localizedMessage,
        response: error.response,
        stack: error.stack
      });

      let errorMessage = 'Payment failed. Please try again.';

      // Handle specific Stripe errors
      if (error.code === 'Failed' && error.localizedMessage) {
        // Handle Android-specific Intent errors
        errorMessage = 'Payment processing failed. Please ensure all card details are complete and try again.';
      } else if (error.code === 'canceled') {
        errorMessage = 'Payment was cancelled';
      } else if (error.code === 'PaymentSheetError.Canceled') {
        errorMessage = 'Payment was cancelled';
      } else if (error.type === 'card_error') {
        errorMessage = error.message || 'Your card was declined. Please try a different card.';
      } else if (error.type === 'validation_error') {
        errorMessage = 'Invalid card details. Please check your information.';
      } else if (error.declineCode) {
        errorMessage = `Card declined: ${error.declineCode}. Please use a different card.`;
      } else if (error.stripeErrorCode) {
        errorMessage = `Payment error: ${error.stripeErrorCode}. Please try again.`;
      } else if (error.localizedMessage) {
        errorMessage = error.localizedMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      NotificationService.error(errorMessage);

      // Don't navigate away, allow user to retry
      onError(error);
      setIsCardComplete(false); // Reset card completion state
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
      {/* Card Input Section */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <Icon name="credit-card" size={24} color={COLORS.specialTextColor} />
          <Text style={styles.sectionTitle}>Card Details</Text>
        </View>

        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
            expiry: 'MM/YY',
            cvc: 'CVC',
            postalCode: 'ZIP',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            placeholderColor: '#B0B0B0',
            fontSize: 16,
          }}
          style={styles.cardField}
          onCardChange={handleCardChange}
        />

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Icon name="lock" size={16} color={COLORS.successDark} />
          <Text style={styles.securityText}>
            Your card information is encrypted and secure
          </Text>
        </View>

        {/* Test Card Info (Remove in production) */}
        <View style={styles.testInfo}>
          <Text style={styles.testInfoTitle}>Test Card Numbers:</Text>
          <Text style={styles.testInfoText}>• Visa: 4242 4242 4242 4242</Text>
          <Text style={styles.testInfoText}>• Mastercard: 5555 5555 5555 4444</Text>
          <Text style={styles.testInfoText}>• Use any future expiry date and any 3-digit CVC</Text>
        </View>
      </View>

      {/* Payment Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          label={
            loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              `Pay ${paymentData.currency?.toUpperCase() || 'AUD'} $${paymentData.amount || '0.00'}`
            )
          }
          onClick={handlePayment}
          buttonMainStyle={styles.payButton}
          disabled={loading || !isCardComplete}
          testID="pay-button"
          accessibilityLabel="Complete Payment"
          accessibilityRole="button"
        />
      </View>
    </Animated.View>
  );
};

/**
 * Main StripePaymentScreen Component
 */
const StripePaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    paymentData,
    userId,
    planDetails,
    clientSecret,
    paymentIntentId,
    paymentType = 'subscription'
  } = route.params || {};
  const [paymentStatus, setPaymentStatus] = useState('pending');
  console.log("clientSecret",clientSecret)

  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
  };

  /**
   * Handle payment error
   */
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
  };

  /**
   * Navigate back
   */
  const handleBack = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.professionalcompanionship"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color={COLORS.textColor} />
              </Pressable>
              <View style={styles.headerTitleContainer}>
                <Image source={ICONS.LOGO} style={styles.logo} />
                <Text style={styles.headerTitle}>Secure Payment</Text>
              </View>
              <View style={styles.placeholderView} />
            </View>

            {/* Stripe Badge */}
            <View style={styles.stripeBadge}>
              <Icon name="verified-user" size={20} color={COLORS.specialTextColor} />
              <Text style={styles.stripeBadgeText}>Powered by Stripe</Text>
            </View>

            {/* Plan Summary */}
            {planDetails && (
              <Animated.View
                style={[
                  styles.planSummaryCard,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <LinearGradient
                  colors={['#f8fafc', '#ffffff']}
                  style={styles.planGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.planName}>{planDetails.name || 'Premium Plan'}</Text>
                  {planDetails.description && (
                    <Text style={styles.planDescription}>{planDetails.description}</Text>
                  )}
                  <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>
                      {paymentData?.currency?.toUpperCase() || 'AUD'}
                    </Text>
                    <Text style={styles.amountText}>
                      ${paymentData?.amount || '0.00'}
                    </Text>
                  </View>
                  {paymentData?.hours > 0 && (
                    <View style={styles.hoursContainer}>
                      <Icon name="schedule" size={16} color={COLORS.specialTextColor} />
                      <Text style={styles.hoursText}>{paymentData.hours} hours</Text>
                    </View>
                  )}
                </LinearGradient>
              </Animated.View>
            )}

            {/* Payment Form */}
            {paymentStatus === 'pending' && (
              <PaymentForm
                paymentData={{ ...paymentData, userId }}
                planDetails={planDetails}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                initialClientSecret={clientSecret}
                initialPaymentIntentId={paymentIntentId}
                paymentType={paymentType}
              />
            )}

            {/* Success State */}
            {paymentStatus === 'success' && (
              <View style={styles.statusContainer}>
                <Icon name="check-circle" size={80} color={COLORS.successDark} />
                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successMessage}>
                  Your payment has been processed successfully.
                </Text>
              </View>
            )}

            {/* Error State */}
            {paymentStatus === 'error' && (
              <View style={styles.statusContainer}>
                <Icon name="error-outline" size={80} color={COLORS.errorDark} />
                <Text style={styles.errorTitle}>Payment Failed</Text>
                <Text style={styles.errorMessage}>
                  There was an issue processing your payment. Please try again.
                </Text>
                <ButtonWrapper
                  label="Try Again"
                  onClick={() => setPaymentStatus('pending')}
                  buttonMainStyle={styles.retryButton}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
  },
  placeholderView: {
    width: 40,
  },
  stripeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.small,
    backgroundColor: 'rgba(47,48,145,0.05)',
    marginHorizontal: PADDING.large,
    marginTop: PADDING.medium,
    borderRadius: 8,
  },
  stripeBadgeText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    marginLeft: 8,
    fontWeight: '500',
  },
  planSummaryCard: {
    marginHorizontal: PADDING.large,
    marginVertical: PADDING.large,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  planGradient: {
    padding: PADDING.large,
  },
  planName: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.medium,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: PADDING.small,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    marginRight: 6,
  },
  amountText: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: PADDING.small,
  },
  hoursText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginLeft: 6,
  },
  formContainer: {
    paddingHorizontal: PADDING.large,
  },
  cardSection: {
    marginBottom: PADDING.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginLeft: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: PADDING.medium,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: PADDING.small,
    paddingHorizontal: PADDING.small,
  },
  securityText: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.successDark,
    marginLeft: 6,
  },
  testInfo: {
    backgroundColor: 'rgba(255,193,7,0.1)',
    padding: PADDING.medium,
    borderRadius: 8,
    marginTop: PADDING.medium,
  },
  testInfoTitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  testInfoText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: PADDING.large,
  },
  payButton: {
    minHeight: 56,
    borderRadius: 16,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingVertical: 50,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.successDark,
    marginTop: PADDING.large,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    marginTop: PADDING.small,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.errorDark,
    marginTop: PADDING.large,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    marginTop: PADDING.small,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: PADDING.large,
    minWidth: 150,
  },
});

export default StripePaymentScreen;