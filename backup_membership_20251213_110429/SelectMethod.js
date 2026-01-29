// screens/SelectMethod.jsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import GradientButton from '../../components/GradientButton';
import {useNavigation, useRoute} from '@react-navigation/native';
// import {PAYMENT_METHODS} from '../../constants/PaymentMethods';
// import PaymentCard from '../../components/PaymentCard';
// import PaymentService from '../../services/PaymentService';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import PaymentCard from '../../components/PaymentCard';
import { PAYMENT_METHODS } from '../../constants/PaymentMethods';
import PaymentService from '../../services/PaymentService';
const SelectMethod = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  // Get payment data from previous screen
  const {plan, selectedHours, totalAmount} = route.params || {};
  console.log("Plan-->",plan);
  console.log("selectedHours-->",selectedHours);
  console.log("totalAmount-->",totalAmount);
  
  // Get user profile for user_id
  const profile = useSelector(state => state.profile?.data);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [{translateY: slideAnim}],
    }),
    [fadeAnim, slideAnim],
  );

  const handlePaymentMethodSelect = useCallback(methodId => {
    setSelectedPaymentMethod(methodId);
  }, []);

  const preparePaymentData = useCallback(() => {
    return {
      plan_id: plan?.id || 1,
      amount: totalAmount || plan?.price || 99.99,
      currency: plan?.currency || 'aud',
      hours: selectedHours || 0,
    };
  }, [plan, totalAmount, selectedHours]);

  const handleContinue = useCallback(async () => {
    console.log('Selected Payment Method:', selectedPaymentMethod);
    if (!selectedPaymentMethod) {
      showMessage({
        message: 'Please select a payment method',
        type: 'warning',
      });
      return;
    }


    try {
      setLoading(true);
      const paymentData = preparePaymentData();

      if (selectedPaymentMethod === 'paypal') {
        // Initialize PayPal
        const result = await PaymentService.initializePayPal(
          paymentData,
          dispatch,
        );
      
        if (result.success) {
          navigation.navigate('PayPalWebView', {
            approvalUrl: result.approvalUrl,
            orderId: result.orderId,
            planDetails: {
              name: plan?.name || 'Plan',
              description: plan?.description || '',
            },
          });
        }
      } else if (selectedPaymentMethod === 'stripe') {
        // Initialize Stripe payment first
        console.log('Initializing Stripe payment...');
        const stripeResult = await PaymentService.initializeStripe(
          paymentData,
          dispatch,
        );

        console.log('Stripe initialization result:', stripeResult);

        if (stripeResult.success) {
          navigation.navigate('StripePaymentScreen', {
            paymentData,
            userId: profile?.id,
            clientSecret: stripeResult.clientSecret,
            paymentIntentId: stripeResult.paymentIntentId,
            planDetails: {
              name: plan?.name || 'Plan',
              description: plan?.description || '',
            },
          });
        } else {
          throw new Error(stripeResult.message || 'Failed to initialize Stripe payment');
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      PaymentService.handlePaymentError(error, selectedPaymentMethod);
    } finally {
      setLoading(false);
    }
  }, [
    selectedPaymentMethod,
    preparePaymentData,
    dispatch,
    navigation,
    plan,
    profile,
  ]);

  const paymentMethodsList = useMemo(
    () => Object.values(PAYMENT_METHODS),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.displayFlex}>
        <Image source={ICONS.LOGO} style={styles.logo} />
        <Text style={{...defaultStyles.buttonTextSmall, marginLeft: 10}}>
          {'Professional \nCompanionship'}
        </Text>
      </View>

      {/* Payment Methods */}
      <Animated.View style={[styles.paymentMethodContainer, animatedStyle]}>
        <Text style={styles.paymentMethodTitle}>Choose Payment Method</Text>

        {/* Plan Summary */}
        {plan && (
          <View style={styles.planSummary}>
            <Text style={styles.planSummaryTitle}>{plan.name}</Text>
            <Text style={styles.planSummaryAmount}>
              {plan.currency?.toUpperCase() || 'AUD'} ${totalAmount || plan.price}
            </Text>
            {selectedHours > 0 && (
              <Text style={styles.planSummaryHours}>{selectedHours} hours</Text>
            )}
          </View>
        )}

        {/* Payment Cards */}
        {paymentMethodsList.map(method => (
          <PaymentCard
            key={method.id}
            {...method}
            isSelected={selectedPaymentMethod === method.id}
            onPress={() => handlePaymentMethodSelect(method.id)}
            disabled={loading}
          />
        ))}
      </Animated.View>

      {/* Continue Button */}
      <GradientButton
        label={
          loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            'Continue to Payment'
          )
        }
        onClick={handleContinue}
        buttonMainStyle={styles.enhancedActionButton}
        // disabled={!selectedPaymentMethod || loading}
        testID="continue-button"
        accessibilityLabel="Continue to Payment"
        accessibilityRole="button"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: PADDING.medium,
    paddingTop: PADDING.extralarge,
  },
  paymentMethodContainer: {
    marginHorizontal: PADDING.large,
    marginVertical: PADDING.large,
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.DMSERIF,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: PADDING.large,
    letterSpacing: 0.5,
  },
  planSummary: {
    backgroundColor: '#f8fafc',
    padding: PADDING.large,
    borderRadius: 12,
    marginBottom: PADDING.large,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  planSummaryTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  planSummaryAmount: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
    marginBottom: 4,
  },
  planSummaryHours: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  enhancedActionButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 16,
    minHeight: 56,
    width: '90%',
    fontSize: 18,
    alignSelf: 'center',
  },
});

export default SelectMethod;