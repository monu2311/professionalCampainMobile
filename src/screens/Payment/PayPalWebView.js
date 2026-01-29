/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { activePlanHistory, planhistory } from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';
import { fetchProfile } from '../../apiConfig/Services';
import sessionManager from '../../utils/sessionManager';
import { getUserData } from '../../utils/authHelpers';
import membershipService from '../../services/MembershipService';
import { setPlanPurchased } from '../../reduxSlice/profileSlice';
import { getPostLoginNavigation } from '../../utils/navigationHelper';

// Cancel matchers - still used by isPaymentCancelUrl
const CANCEL_MATCHERS = ['cancel', 'payment/cancel', 'paypal/cancel', 'useraction=cancel'];

// More precise success URL detection to avoid false positives
const isPaymentSuccessUrl = (url) => {
  const lowerUrl = (url || '').toLowerCase();

  // Check for PayPal specific success indicators
  if (lowerUrl.includes('payerid=')) return true;
  if (lowerUrl.includes('payment/success')) return true;
  if (lowerUrl.includes('paypal/success')) return true;
  if (lowerUrl.includes('approval-waiting')) return true;

  // Check for '/return' only as a path segment or with query params
  // This avoids matching 'register-form' or similar URLs
  if (lowerUrl.match(/\/return(\?|\/|#|$)/)) return true;

  // Check for generic success/completed/approved
  if (lowerUrl.includes('/success')) return true;
  if (lowerUrl.includes('/completed')) return true;
  if (lowerUrl.includes('/approved')) return true;

  return false;
};

// Check if URL is a cancel URL
const isPaymentCancelUrl = (url) => {
  const lowerUrl = (url || '').toLowerCase();
  return CANCEL_MATCHERS.some(matcher => lowerUrl.includes(matcher));
};

const PayPalWebView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // State for payment processing
  const isProcessingRef = useRef(false); // Add flag to prevent duplicate processing

  // Get user profile to determine plan_type
  const profileData = useSelector(state => state.profile?.user_profile);
  const userData = useSelector(state => state.profile?.data);

  // State for stored user data fallback
  const [storedUserData, setStoredUserData] = useState(null);

  console.log("profileData", profileData)
  console.log("userData", userData)

  // Load stored user data on component mount
  useEffect(() => {
    const loadStoredUserData = async () => {
      try {
        const stored = await getUserData();
        console.log('PayPal: Loaded stored user data:', stored);
       
        setStoredUserData(stored);
      } catch (error) {
        console.error('PayPal: Error loading stored user data:', error);
      }
    };
    loadStoredUserData();
  }, []);

  // Comprehensive user data resolution with fallbacks
  const resolveUserData = () => {

    const fallbackData = {
      user_id: profileData?.user_id || userData?.id || storedUserData?.user_id || storedUserData?.details?.id ,
      profile_type: profileData?.profile_type || userData?.profile_type || storedUserData?.profile_type,
      has_active_membership: profileData?.has_active_membership || userData?.has_active_membership || storedUserData?.has_active_membership || false,
      email: profileData?.email || userData?.email || storedUserData?.email,
      user_name: profileData?.user_name || userData?.user_name || storedUserData?.user_name,
    };

    

    console.log('PayPal: Resolved user data:', fallbackData);
    console.log('PayPal: Stored user data details:', storedUserData?.details);
    return fallbackData;
  };

  const {
    approvalUrl,
    paymentType = 'subscription',
    orderId,
    planData
  } = route.params || {};

  const initialUrl = useMemo(() => approvalUrl, [approvalUrl]);

  // Cleanup effect to reset processing flag on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  const closeWithRefresh = useCallback(
    async (ok, message) => {
      // Check if already processing to prevent duplicate calls
      if (isProcessingRef.current) {
        console.log('Payment already being processed, skipping duplicate call');
        return;
      }

      if (ok) {
        try {
          // Set processing flag to prevent duplicate calls
          isProcessingRef.current = true;
          setIsProcessingPayment(true); // Show loading state
          console.log('Starting payment confirmation process');

          // Check if token is still valid before proceeding
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          const token = await AsyncStorage.getItem('ChapToken');

          if (!token) {
            console.log('Token not found - session expired');

            // Clear auth data
            await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);

            // Show session expired modal instead of navigating directly
            sessionManager.showSessionExpiredModal();

            // Reset processing flag since we're not continuing
            isProcessingRef.current = false;
            setIsProcessingPayment(false);

            return;
          }

          // Import PaymentService for confirmation
          const PaymentService = (await import('../../services/PaymentService')).default;



          // Use resolved user data for all payment confirmation logic
          const paypalResolvedData = resolveUserData();
          const membershipStatus = paypalResolvedData.has_active_membership;
          const userIsUserCanLoggedIn = paypalResolvedData.is_user_can_logged_in || storedUserData?.is_user_can_logged_in;

          // Determine plan_type based on profile_type (1 = management, else membership)
          const planType = (parseInt(paypalResolvedData?.profile_type) === 1)
            ? membershipStatus ? "management" : "companion"
            : "membership";

          // Validate required fields before confirmation
          if (!paypalResolvedData.user_id) {
            throw new Error('User ID is required for PayPal payment confirmation. Please try logging in again.');
          }

          // Prepare confirmation data
          const confirmData = {
            order_id: orderId,
            plan_id: planData?.id,
            hours: 0, // Only for Plan ID 2
            plan_type: planType,
            user_id: paypalResolvedData.user_id
          };

          console.log('Confirming PayPal payment with data:', confirmData);

          // Call confirmPayPal API
          const result = await PaymentService.confirmPayPal(confirmData, dispatch);
          fetchProfile(dispatch);

          if (result.success) {
            showMessage({
              message: result.message || 'Payment successful',
              type: 'success'
            });

            // Update membership status after successful payment
            const profileType = paypalResolvedData.profile_type?.toString();
            await membershipService.updateMembershipAfterPayment(profileType);

            // Update Redux state
            dispatch(setPlanPurchased());

            // Refresh plan data if membership payment
            if (paymentType === 'membership') {
              dispatch(activePlanHistory());
              dispatch(planhistory());
            }

            // Refresh profile to get updated membership status
            await fetchProfile(dispatch);

            // Hide loading state before navigation
            setIsProcessingPayment(false);

            // Get comprehensive user details for navigation logic
            const userDetails = {
              ...paypalResolvedData,
              is_user_can_logged_in: userIsUserCanLoggedIn,
              is_plan_purchased: true, // Payment was just completed
              account_step: storedUserData?.account_step || 1,
              status: storedUserData?.status || false
            };

            console.log('PayPal: User details for navigation:', userDetails);

            // Use centralized navigation logic
            const destination = getPostLoginNavigation(userDetails, navigation);
            console.log('PayPal: Navigation destination:', destination);

            // Special case for Final screen that needs parameters
            if (destination === 'Final') {
              navigation.reset({
                index: 0,
                routes: [{
                  name: destination,
                  params: { value: userDetails?.status || 2 }
                }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: destination }],
              });
            }
          } else {
            throw new Error(result.message || 'Payment confirmation failed');
          }
        } catch (error) {
          console.error('Payment confirmation error:', error);

          // Handle specific error cases
          if (error.response?.status === 401 || error.message?.includes('session has expired')) {
            // Token expired during payment confirmation
            console.log('Token expired during payment confirmation');
            isProcessingRef.current = false;
            setIsProcessingPayment(false);

            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
            await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);

            // Show session expired modal instead of navigating directly
            sessionManager.showSessionExpiredModal();
          } else {
            // Regular error handling
            isProcessingRef.current = false;
            setIsProcessingPayment(false);
            showMessage({
              message: error.message || 'Payment confirmation failed',
              type: 'danger'
            });
            navigation.goBack();
          }
        }
      } else {
        console.log("Payment cancelled");
        // Reset processing flag on cancel
        isProcessingRef.current = false;
        setIsProcessingPayment(false);
        showMessage({ message: message || 'Payment cancelled', type: 'warning' });
        navigation.goBack();
      }
    },
    [dispatch, navigation, paymentType, orderId, planData, profileData],
  );

  const onNavigationStateChange = useCallback(
    navState => {
      const currentUrl = navState?.url || '';
      console.log("PayPal WebView Navigation:", navState);

      // Use more precise URL checking to avoid false positives
      if (isPaymentSuccessUrl(currentUrl)) {
        console.log('Payment success detected for URL:', currentUrl);
        closeWithRefresh(true);
        return false;
      }

      if (isPaymentCancelUrl(currentUrl)) {
        console.log('Payment cancelled detected for URL:', currentUrl);
        closeWithRefresh(false);
        return false;
      }

      // URL doesn't match success or cancel patterns - continue loading
      return true;
    },
    [closeWithRefresh],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {initialUrl ? (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: initialUrl }}
            startInLoadingState
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
            incognito
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
            originWhitelist={["*"]}
            allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
          />
          {loading && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.4)',
              }}>
              <ActivityIndicator size="large" color="#0551AF" />
            </View>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0551AF" />
        </View>
      )}
      <ScreenLoading
        loader={isProcessingPayment}
        message="Confirming your payment..."
      />
    </SafeAreaView>
  );
};

export default PayPalWebView;


