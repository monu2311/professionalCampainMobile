// services/PaymentService.js
import {Alert} from 'react-native';
import {
  createPayPalOrder,
  createStripeIntent,
  confirmStripePayment,
  confrimStripeIntent,
} from '../reduxSlice/apiSlice';
import NotificationService from './NotificationService';

class PaymentService {
  /**
   * Validate payment data
   */
  validatePaymentData(data) {
    const {plan_id, amount, currency, hours} = data;

    if (!plan_id) {
      throw new Error('Plan ID is required');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!currency) {
      throw new Error('Currency is required');
    }

    if (hours !== undefined && hours < 0) {
      throw new Error('Invalid hours value');
    }

    return true;
  }

  /**
   * Initialize PayPal payment
   * @param {Object} paymentData - Payment details
   * @param {Function} dispatch - Redux dispatch
   * @returns {Promise<Object>} - {success, approvalUrl, orderId}
   */
  async initializePayPal(paymentData, dispatch) {
    try {
      this.validatePaymentData(paymentData);

      const response = await dispatch(createPayPalOrder(paymentData));

      if (response?.success && response?.approval_url) {
        return {
          success: true,
          approvalUrl: response.approval_url,
          orderId: response.order_id,
          message: response.message,
        };
      } else {
        throw new Error(response?.message || 'Failed to create PayPal order');
      }
    } catch (error) {
      console.error('PayPal initialization error:', error);
      throw error;
    }
  }

  /**
   * Confirm PayPal payment after approval
   * @param {Object} confirmData - Payment confirmation data
   * @param {string} confirmData.order_id - PayPal Order ID
   * @param {number} confirmData.plan_id - Plan ID
   * @param {number} confirmData.hours - Hours (optional, for Plan ID 2)
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async confirmPayPal(confirmData, dispatch) {
    try {
      console.log('Confirming PayPal payment:', confirmData);

      if (!confirmData.order_id) {
        throw new Error('PayPal Order ID is required');
      }

      if (!confirmData.plan_id) {
        throw new Error('Plan ID is required');
      }

      // Import apiCall here since it's not imported at the top
      const { default: apiCall } = await import('../apiConfig/apicall');

      const response = await apiCall(
        'POST',
        '/paypal/confirm-payment',
        confirmData
      );

      console.log('PayPal confirmation response:', response);

      if (response?.success) {
        NotificationService.success(
          response.message || 'PayPal payment confirmed successfully'
        );
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(response?.message || 'Failed to confirm PayPal payment');
      }
    } catch (error) {
      console.error('PayPal confirmation error:', error);
      NotificationService.error(
        error.message || 'Failed to confirm PayPal payment'
      );
      throw error;
    }
  }

  /**
   * Initialize Stripe payment
   * @param {Object} paymentData - Payment details
   * @param {Function} dispatch - Redux dispatch
   * @returns {Promise<Object>} - {success, clientSecret, paymentIntentId}
   */
  async initializeStripe(paymentData, dispatch) {
    try {
      this.validatePaymentData(paymentData);

      const response = await dispatch(createStripeIntent(paymentData));

      if (response?.success && response?.client_secret) {
        return {
          success: true,
          clientSecret: response.client_secret,
          paymentIntentId: response.payment_intent_id,
          planDetails: response.plan_details,
          hours: response.hours,
          message: response.message,
        };
      } else {
        throw new Error(
          response?.message || 'Failed to create Stripe payment intent',
        );
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }



  async confrimPaymentIntentStripe(paymentIntent, dispatch) {
    try {
    

      const response = await dispatch(confrimStripeIntent(paymentIntent));

      if (response?.success) {

        return{
          success: true,
          paymentIntentId : response?.payment_intent_id
        }
        // return {
        //   success: true,
        //   clientSecret: response.client_secret,
        //   paymentIntentId: response.payment_intent_id,
        //   planDetails: response.plan_details,
        //   hours: response.hours,
        //   message: response.message,
        // };
      } else {
        throw new Error(
          response?.message || 'Failed to create Stripe payment intent',
        );
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }




  /**
   * Confirm Stripe payment after user completes card entry
   * @param {Object} confirmData - {payment_intent_id, user_id, plan_id, hours}
   * @param {Function} dispatch - Redux dispatch
   */
  async confirmStripe(confirmData, dispatch) {
    try {
      const response = await dispatch(confirmStripePayment(confirmData));

      if (response?.success) {
        return {
          success: true,
          message: response.message || 'Payment confirmed successfully',
        };
      } else {
        throw new Error(response?.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Stripe confirmation error:', error);
      throw error;
    }
  }

  /**
   * Handle payment errors with user-friendly messages
   */
  handlePaymentError(error, paymentMethod) {
    const errorMessage =
      error?.message ||
      error?.response?.data?.message ||
      `${paymentMethod} payment failed`;

    Alert.alert('Payment Error', errorMessage, [
      {text: 'OK', style: 'cancel'},
      {text: 'Retry', onPress: () => console.log('Retry payment')},
    ]);

    return errorMessage;
  }

  /**
   * Handle payment errors with modern UI
   */
  handlePaymentError(error, paymentMethod, showModal = false) {
    const errorMessage =
      error?.message ||
      error?.response?.data?.message ||
      `${paymentMethod} payment failed`;

    // Use modern notification instead of Alert
    NotificationService.error(errorMessage);

    // Optionally show modal for critical errors
    if (showModal) {
      return {
        showErrorModal: true,
        errorType: 'error',
        errorTitle: 'Payment Failed',
        errorMessage,
      };
    }

    return errorMessage;
  }

  /**
   * Show network error
   */
  showNetworkError() {
    NotificationService.error(
      'Network connection failed. Please check your internet and try again.',
    );
  }

  /**
   * Show validation error
   */
  showValidationError(message) {
    NotificationService.warning(message);
  }
  
}

export default new PaymentService();