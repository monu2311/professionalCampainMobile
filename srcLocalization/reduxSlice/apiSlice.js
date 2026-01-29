import {createSlice} from '@reduxjs/toolkit';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiCall, {BASEURLS} from '../apiConfig/apicall';
import { setDropdown } from './listSlice';
import { setProfile } from './profileSlice';

const apiSlice = createSlice({
  name: 'auth',
  initialState: {
    data: {
      signup: {data: null, message: null, error: null, isLoading: false},
      planBuy: {data: null, message: null, error: null, isLoading: false},
      changePassword: {data: null, message: null, error: null, isLoading: false},
      contactUs: {data: null, message: null, error: null, isLoading: false},
      resendOTP: {data: null, message: null, error: null, isLoading: false},
      verifyOtp: {data: null, message: null, error: null, isLoading: false},
      login: {data: null, message: null, error: null, isLoading: false},
      categories: {data: null, message: null, error: null, isLoading: false},
      updateProfile: {data: null, message: null, error: null, isLoading: false},
      saveProfile: {data: null, message: null, error: null, isLoading: false},
      forgetPassword: {
        data: null,
        message: null,
        error: null,
        isLoading: false,
      },
      transaction: {data: null, message: null, error: null, isLoading: false},
      profile: {data: null, message: null, error: null, isLoading: false},
      userChatList: {data: null, message: null, error: null, isLoading: false},
      getChatAllUser: {data: null, message: null, error: null, isLoading: false},
      userChatHistory: {
        data: null,
        message: null,
        error: null,
        isLoading: false,
      },
      getNewMsg: {data: null, message: null, error: null, isLoading: false},
      sendChatMsg: {data: null, message: null, error: null, isLoading: false},
      newChatMsg: {data: null, message: null, error: null, isLoading: false},
      planhistory: {data: null, message: null, error: null, isLoading: false},
      refund: {data: null, message: null, error: null, isLoading: false},
      userByID: {data: null, message: null, error: null, isLoading: false},
      search: {data: null, message: null, error: null, isLoading: false},
      activePlaNSLICE: {data: null, message: null, error: null, isLoading: false},


      sendChatRequest: { data: null, message: null, error: null, isLoading: false },
      pendingChatRequests: { data: null, message: null, error: null, isLoading: false },
      sentChatRequests: { data: null, message: null, error: null, isLoading: false },
      approveChatRequest: { data: null, message: null, error: null, isLoading: false },
      rejectChatRequest: { data: null, message: null, error: null, isLoading: false },
      cancelChatRequest: { data: null, message: null, error: null, isLoading: false },
      checkChatRequestStatus: { data: null, message: null, error: null, isLoading: false },
      chatRequestStats: { data: null, message: null, error: null, isLoading: false },
      getChatForEdit: { data: null, message: null, error: null, isLoading: false },
      updateChatMessage: { data: null, message: null, error: null, isLoading: false },
      deleteChatMessage: { data: null, message: null, error: null, isLoading: false },




      getPendingBookings:{ data: null, message: null, error: null, isLoading: false },
      createBooking:{ data: null, message: null, error: null, isLoading: false },
      getBookingById:{ data: null, message: null, error: null, isLoading: false },
      updateBookingStatus:{ data: null, message: null, error: null, isLoading: false },
      cancelBooking:{ data: null, message: null, error: null, isLoading: false },
      getBookingStats:{ data: null, message: null, error: null, isLoading: false },
      getEscortAvailability:{ data: null, message: null, error: null, isLoading: false },

      

    },
  },
  reducers: {
    start: (state, action) => {
      const {apiName} = action.payload;
      state.data[apiName].isLoading = true;
      state.data[apiName].data = null;
      state.data[apiName].message = null;
      state.data[apiName].error = null;
    },
    success: (state, action) => {
      const {apiName, responseData, toastOptions} = action.payload;
      // console.log('action.payload----', action.payload);
      state.data[apiName].isLoading = false;
      state.data[apiName].data = responseData?.data ?? responseData;
      state.data[apiName].message = responseData?.message ?? null;
      state.data[apiName].error = responseData?.error ?? null;

      if (toastOptions?.successToast) {
        showMessage({
          message: responseData?.message || 'Operation Success',
          type: 'success',
          icon: 'success',
          duration: 3000,
        });
      }

      // Store token for specific APIs
      if (['login'].includes(apiName)) {
        const token = responseData?.data?.token || null;
        if (token) {
          state.token = token;
          AsyncStorage.setItem('ChapToken', token);
        }
      }
    },
    failure: (state, action) => {
      const {apiName, toastOptions, error} = action.payload;
      state.data[apiName].isLoading = false;
      state.data[apiName].data = null;
      state.data[apiName].message = error || 'Something went wrong';
      state.data[apiName].error = true;

      if (toastOptions?.errorToast) {
        showMessage({
          message: error || 'Something went wrong',
          type: 'danger',
          icon: 'danger',
          duration: 3000,
        });
      }
      // Clear token on auth failures
      if (error === 'Invalid credentials' || error === 'Unauthenticated') {
        AsyncStorage.removeItem('ChapToken');
        state.token = null;
      }
    },
  },
});

export const {start, success, failure} = apiSlice.actions;

export const callApi =
  (apiName, toastOptions, method, url, data = {}, id, params) =>
  async dispatch => {
    dispatch(start({apiName}));
    try {
      const response = await apiCall(method, url, data, id, params);
      dispatch(success({apiName, toastOptions, responseData: response}));
      if(apiName == "search"){
        const cityData = response?.data?.cityData?.reduce((acc,curr,idx)=>{
            acc[idx] = {
              item: curr?.city,
              value:curr?.id
            }

            return acc
        },[]);
        const homeCategory = response?.data?.CategoryRepository?.reduce((acc,curr,idx)=>{
          acc[idx] = {
            item: curr?.gender,
            value:curr?.id,
          }

          return acc
      },[]);


     dispatch(setProfile({ data: {homeCategory,cityData} }));

        console.log("cityDatacityData",cityData)
        
      }
      console.log('CALLAPI response', response);
      return response;
    } catch (error) {
      console.log('CALLAPI  error', error?.response);
      dispatch(
        failure({
          apiName,
          toastOptions,
          error: error.response?.data?.message || error.message,
        }),
      );
      return error.response?.data;
    }
  };

export const login = data =>
  callApi(
    'login',
    {successToast: true, errorToast: true},
    'POST',
    '/login',
    data,
  );

export const categories = data =>
  callApi(
    'categories',
    {successToast: false, errorToast: false},
    'Get',
    '/categories',
    null,
  );

export const plansList = data =>
  callApi(
    'plans',
    {successToast: false, errorToast: false},
    'Get',
    '/plan-management-list',
    null,
  );

export const register = (data, query) =>
  callApi(
    'signup',
    {successToast: false, errorToast: true},
    'post',
    '/register',
    data,
    BASEURLS,
    query,
  );

export const UpdateProfile = (data, query) =>
  callApi(
    'updateProfile',
    {successToast: false, errorToast: true},
    'post',
    '/multi-step-register',
    data,
    BASEURLS,
    query,
  );

export const saveProfile = data =>
  callApi(
    'saveProfile',
    {successToast: false, errorToast: false},
    'post',
    '/save-profile',
    null,
  );

export const Forget = data =>
  callApi(
    'forgetPassword',
    {successToast: false, errorToast: false},
    'post',
    '/forgot-password',
    data,
  );

export const transactions = data =>
  callApi(
    'transaction',
    {successToast: true, errorToast: true},
    'POST',
    '/process-initial-transactions',
    data,
  );

export const getProfile = data =>
  callApi(
    'profile',
    {successToast: false, errorToast: false},
    'Get',
    '/profile-detail',
    null,
  );


export const raiseRefund = id =>
  callApi(
    'refund',
    {successToast: false, errorToast: false},
    'GET',
    `/plans/initiate-refund/${id}`,
    null,
  );


export const planhistory = () =>
  callApi(
    'planhistory',
    {successToast: false, errorToast: false},
    'GET',
    '/plans/purchase-history',
    null,
  );
export const activePlanHistory = () =>
  callApi(
    'activePlaNSLICE',
    {successToast: false, errorToast: false},
    'GET',
    '/plans/purchase-history?type=active',
    null,
  );


  // export const activePlanHistory = () => {
  //   callApi(
  //     'activePlaNSLICE',
  //     {successToast: false, errorToast: false},
  //     'GET',
  //     '/plans/purchase-history?type=active',
  //     null,
  //   );
  // };


  export const getUserByID = id =>
    callApi(
      'userByID',
      {successToast: false, errorToast: false},
      'GET',
      `/user-check/${id}`,
      null,
    );


    export const changePassword = data => {

      return callApi(
        'changePassword',
        {successToast: false, errorToast: true},
        'POST',
        `/change-password`,
        data,
      );
    };

    export const contactUs = data => {

      return callApi(
        'contactUs',
        {successToast: true, errorToast: true},
        'POST',
        `/contact-us`,
        data,
      );
    };

    export const search = data => {

      return callApi(
        'search',
        {successToast: false, errorToast: false},
        'GET',
        `/search`,
        null,
        BASEURLS,
        data
      );
    };


    export const Buyplan = data => {
      return callApi(
        'planBuy',
        {successToast: true, errorToast: true},
        'POST',
        `/plans/buy`,
        data,
      );
    };



// ============================================
// PAYMENT API ENDPOINTS - ADD TO apiSlice.js
// ============================================

/**
 * Create PayPal order
 * @param {Object} data - {plan_id, amount, currency, hours}
 */
export const createPayPalOrder = (data) =>
  callApi(
    'paypalCreateOrder',
    { successToast: false, errorToast: true },
    'POST',
    '/paypal/create-order',
    data,
  );



/**
 * Create Stripe payment intent
 * @param {Object} data - {plan_id, amount, currency, hours}
 */
export const createStripeIntent = (data) =>
  callApi(
    'stripeCreateIntent',
    { successToast: false, errorToast: true },
    'POST',
    '/stripe/create-payment-intent',
    data,
  );

/**
 * Confirm Stripe payment
 * @param {Object} data - {payment_intent_id, user_id, plan_id, hours}
 */
export const confirmStripePayment = (data) =>
  callApi(
    'stripeConfirmPayment',
    { successToast: true, errorToast: true },
    'POST',
    '/stripe/confirm-payment',
    data,
  );



// ============================================
// CHAT REQUEST API ENDPOINTS - ADD TO apiSlice.js
// ============================================


  /**
 * Send chat request to a user
 * @param {number} userId - User ID to send request to
 * @param {Object} data - {message: string}
 */
export const sendChatRequest = (userId, data) =>
  callApi(
    'sendChatRequest',
    { successToast: true, errorToast: true },
    'POST',
    `/chat-requests/send/${userId}`,
    data,
  );

/**
 * Get pending chat requests (received)
 */
export const getPendingChatRequests = () =>
  callApi(
    'pendingChatRequests',
    { successToast: false, errorToast: false },
    'GET',
    '/chat-requests/pending',
    null,
  );

/**
 * Get sent chat requests
 */
export const getSentChatRequests = () =>
  callApi(
    'sentChatRequests',
    { successToast: false, errorToast: false },
    'GET',
    '/chat-requests/sent',
    null,
  );

/**
 * Approve chat request
 * @param {number} requestId - Request ID to approve
 * @param {Object} data - {response_message: string}
 */
export const approveChatRequest = (requestId, data) =>
  callApi(
    'approveChatRequest',
    { successToast: true, errorToast: true },
    'POST',
    `/chat-requests/approve/${requestId}`,
    data,
  );

/**
 * Reject chat request
 * @param {number} requestId - Request ID to reject
 * @param {Object} data - {response_message: string}
 */
export const rejectChatRequest = (requestId, data) =>
  callApi(
    'rejectChatRequest',
    { successToast: true, errorToast: true },
    'POST',
    `/chat-requests/reject/${requestId}`,
    data,
  );

/**
 * Cancel chat request (for sent requests)
 * @param {number} requestId - Request ID to cancel
 */
export const cancelChatRequest = (requestId) =>
  callApi(
    'cancelChatRequest',
    { successToast: true, errorToast: true },
    'POST',
    `/chat-requests/cancel/${requestId}`,
    null,
  );

/**
 * Check chat request status with a specific user
 * @param {number} userId - User ID to check status with
 */
export const checkChatRequestStatus = (userId) =>
  callApi(
    'checkChatRequestStatus',
    { successToast: false, errorToast: false },
    'GET',
    `/chat-requests/check/${userId}`,
    null,
  );

/**
 * Get chat request statistics
 */
export const getChatRequestStats = () =>
  callApi(
    'chatRequestStats',
    { successToast: false, errorToast: false },
    'GET',
    '/chat-requests/stats',
    null,
  );


  //Chat Request 
/**
 * Get chat for editing
 * @param {number} chatId - Chat message ID
 */
export const getChatForEdit = (chatId) =>
  callApi(
    'getChatForEdit',
    { successToast: false, errorToast: false },
    'GET',
    `/chats/${chatId}/edit`,
    null,
  );

/**
 * Update chat message
 * @param {number} chatId - Chat message ID
 * @param {Object} data - {message: string}
 */
export const updateChatMessage = (chatId, data) =>
  callApi(
    'updateChatMessage',
    { successToast: true, errorToast: true },
    'PUT',
    `/chats/${chatId}`,
    data,
  );

/**
 * Delete chat message
 * @param {number} chatId - Chat message ID
 */
export const deleteChatMessage = (chatId) =>
  callApi(
    'deleteChatMessage',
    { successToast: true, errorToast: true },
    'DELETE',
    `/chats/${chatId}`,
    null,
  );

  //get Chat user
export const getChatUser = data =>
  callApi(
    'userChatList',
    { successToast: false, errorToast: false },
    'Get',
    '/chats',
    null,
);


//get Chat user
export const getChatAllUser = data =>
  callApi(
    'getChatAllUser',
    { successToast: false, errorToast: false },
    'Get',
    '/chats/get-user-list',
    null,
);


// get Chat List of one user with another user
export const getChatHistory = id =>
  callApi(
    'userChatHistory',
    { successToast: false, errorToast: false },
    'GET',
    `/chats/show/${id}`,
    null,
);

//Send message to user
export const sendChatMessage = data => {
  const { id, payloadData } = data;

  return callApi(
    'sendChatMsg',
    { successToast: false, errorToast: true },
    'POST',
    `/chats/send/${id}`,
    payloadData,
  );
};


export const getNewMsg = id =>
  callApi(
    'newChatMsg',
    { successToast: false, errorToast: false },
    'GET',
    `/chats/get-message/${id}`,
    null,
);




// ============================================
// BOOKING REQUEST API ENDPOINTS - ADD TO apiSlice.js
// ============================================


// BOOKING ENDPOINTS
export const getPendingBookings = ({role = 'escort',status = 'pending'}) =>
  callApi(
    'getPendingBookings',
    { successToast: false, errorToast: true },
    'GET',
    status ? `/bookings?status=${status}&role=${role}` : `/bookings?role=${role}`,
    null,
  );

export const createBooking = (data) =>
  callApi(
    'createBooking',
    { successToast: true, errorToast: true },
    'POST',
    '/bookings',
    data,
  );

export const getBookingById = (id) =>
  callApi(
    'getBookingById',
    { successToast: false, errorToast: false },
    'GET',
    `/bookings/${id}`,
    null,
  );

export const updateBookingStatus = (data) =>
  callApi(
    'updateBookingStatus',
    { successToast: true, errorToast: true },
    'POST',
    '/bookings/update-status',
    data,
  );

export const cancelBooking = (data) =>
  callApi(
    'cancelBooking',
    { successToast: true, errorToast: true },
    'POST',
    '/bookings/cancel',
    data,
  );

export const getBookingStats = () =>
  callApi(
    'getBookingStats',
    { successToast: false, errorToast: false },
    'GET',
    '/bookings/stats',
    null,
  );

export const getEscortAvailability = (escortId) =>
  callApi(
    'getEscortAvailability',
    { successToast: false, errorToast: false },
    'GET',
    `/bookings/availability/${escortId}`,
    null,
  );




export default apiSlice.reducer;
