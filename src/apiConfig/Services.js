import axios from 'axios';
import {setDropdown} from '../reduxSlice/listSlice';
import {setPlans} from '../reduxSlice/planSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setProfile} from '../reduxSlice/profileSlice';
import {getUserByID} from '../reduxSlice/apiSlice';
import {setFaq} from '../reduxSlice/faqSlice';
import { storeUserData, storeMembershipStatus } from '../utils/authHelpers';
import membershipService from '../services/MembershipService';

export const fetchAllAPIs = async dispatch => {
  const baseURL = 'https://thecompaniondirectory.com/api';

  const endpoints = [
    '/services',
    '/profile-categories',
    '/hair-styles',
    '/eyes',
    '/hair-colors',
    '/body-types',
    '/dress-sizes',
    '/busts',
    '/countries',
    // '/cities',
  ];

  const keyMap = {
    '/services': 'Services',
    '/profile-categories': 'Profile Categories',
    '/hair-styles': 'Hair Style',
    '/eyes': 'Eyes',
    '/hair-colors': 'Hair Color',
    '/body-types': 'Body Type',
    '/dress-sizes': 'Dress Size',
    '/busts': 'Bust (optional- for search page)',
    '/countries': 'Countries',
    // '/cities': 'Cities',
  };

  try {
    // Make all requests at once
    const responses = await Promise.all(
      endpoints.map(endpoint =>
        axios.get(`${baseURL}${endpoint}`).catch(err => err),
      ), // Catch each error individually
    );

    console.log('API Responses:', responses);
    // Check for any errors
    const hasError = responses.some(
      res => res instanceof Error || res.status < 200 || res.status >= 300,
    );

    if (hasError) {
      return {
        error: {
          status: 'FETCH_ERROR',
          message: 'One or more API calls failed.',
        },
      };
    }

    // Extract the data from each response and store it in an object with mapped keys
    const allData = responses.reduce((acc, res, idx) => {
      const endpoint = endpoints[idx];
      const key = keyMap[endpoint]; 
      console.log(`Processing ${key}:`, res.data);

      if (key == 'Services') {
        acc['Services'] = {
          array: res.data.map(item => ({
            item:
              item?.name ||
              item?.label ||
              item?.title ||
              item?.body_type ||
              item?.dress_size ||
              item?.eyes ||
              item?.hair_color ||
              item?.bust ||
              item?.service ||
              item?.category ||
              item?.hair_style,
            value:
             item?.id?.toString() || item?.value || item?.name || item?.label || item?.id?.toString(),
            eventName: item?.name,
            eventImg: item?.image,
            eventDiscription: item?.description,
          })),
        };
      } else if(key == 'Countries'){ 
        // console.log("res?.data?.data",res?.data?.data)
        acc[key] = {
          array: res?.data?.data.map(item => ({
            item:
              item?.name ||
              item?.label ||
              item?.title ||
              item?.body_type ||
              item?.dress_size ||
              item?.eyes ||
              item?.hair_color ||
              item?.bust ||
              item?.service ||
              item?.category ||
              item?.hair_style,
            value:
              item?.id?.toString() || item?.value || item?.name || item?.label || item?.id?.toString(),
          })),
        };
      }
      else {
        acc[key] = {
          array: res.data.map(item => ({
            item:
              item?.name ||
              item?.label ||
              item?.title ||
              item?.body_type ||
              item?.dress_size ||
              item?.eyes ||
              item?.hair_color ||
              item?.bust ||
              item?.service ||
              item?.category ||
              item?.hair_style,
            value:
              item?.value || item?.name || item?.label || item?.id?.toString(),
          })),
        };
      }

      console.log(`Processed ${key}:`, acc[key]);

      return acc;
    }, {});

    dispatch(setDropdown({data: allData}));

    return allData; // Return the data for further use in your application
  } catch (error) {
    console.error('API Error:', error);
    return {error: {status: 'API_ERROR', message: error.message}};
  }
};

export const fetchPlans = async dispatch => {
  const starterPlansURL = 'https://thecompaniondirectory.com/api/starter-plans';
  const planManagementURL =
    'https://thecompaniondirectory.com/api/plan-management-list';

  try {
    const [starterRes, managementRes] = await Promise.all([
      axios.get(starterPlansURL),
      axios.get(planManagementURL),
    ]);

    const plans = managementRes?.data?.planManagemetData || [];
    const planManagemetData = starterRes?.data?.plans || [];
    dispatch(setPlans({plans, planManagemetData}));
  } catch (error) {
    console.error('Error fetching plans:', error);

    // Dispatch empty arrays if there's an error
    dispatch(setPlans({plans: [], planManagemetData: []}));
  }
};

export const fetchProfile = async dispatch => {
  const baseURL = 'https://thecompaniondirectory.com/api/profile-detail';
  const token = await AsyncStorage.getItem('ChapToken');
  console.log("Token--->",token)
  try {
    const response = await axios({
      method: 'get',
      url: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response",response)
    const {data, success} = response?.data;

    
    // console.log("datadata",response)
    if (response?.data && success == true) {
      console.log("response.data.data",response.data.data)
      // Store comprehensive user data for navigation including membership fields
      await storeUserData({
        profile_type: response?.data?.data?.user_profile?.profile_type,
        has_active_membership: response?.data?.data?.has_active_membership,
        is_user_can_logged_in: response?.data?.data?.is_user_can_logged_in,
        is_plan_purchased: response?.data?.data?.is_plan_purchased,
        account_step: response?.data?.data?.user_profile?.account_step,
        status: response?.data?.data?.user_profile?.status,
        user_id: response?.data?.data?.user_profile?.user_id,
        email: response?.data?.data?.user_profile?.email,
        user_name: response?.data?.data?.user_profile?.user_name,
        ...response?.data?.data?.user_profile
      });

      // Also update account step separately
      if (response?.data?.data?.user_profile?.account_step) {
        await AsyncStorage.setItem('account_step', String(response?.data?.data?.user_profile?.account_step));
      }
      console.log('fetchProfile: Storing profile data:', {
        profile_type: response?.data?.data?.user_profile?.profile_type,
        has_active_membership: response?.data?.data?.has_active_membership,
        is_user_can_logged_in: response?.data?.data?.is_user_can_logged_in,
        fullData: response?.data?.data
      });
      dispatch(setProfile({...response?.data?.data}));
      // dispatch(getUserByID(response?.data?.data?.user_profile?.user_id));

      // Initialize membership service
      await membershipService.initialize(response?.data?.data);

      // Store membership status
      await storeMembershipStatus({
        has_active_membership: response?.data?.data?.has_active_membership,
        is_user_can_logged_in: response?.data?.data?.is_user_can_logged_in,
        profile_type: response?.data?.data?.user_profile?.profile_type,
      });

      // Return the data for promise chaining
      return response?.data?.data;
    }
    return null;
  } catch (error) {
    // dispatch(setPlans({ planManagemetData: [] }))
    console.log(error, 'fetchProfile error');
    throw error;
  }
};

export const fetchFaQ = async dispatch => {
  const baseURL = 'https://thecompaniondirectory.com/api/faqs';
  const token = await AsyncStorage.getItem('ChapToken');
  try {
    const response = await axios({
      method: 'get',
      url: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // const {data,success} = response?.data;
    if (response?.status === 200) {
      dispatch(setFaq({...response?.data}));
    }
  } catch (error) {
    // dispatch(setPlans({ planManagemetData: [] }))
    // console.log(error, 'fetchFaQ error');
  }
};

export const updatePersonalDetails = async (personalData) => {
  const baseURL = 'https://thecompaniondirectory.com/api/update-personal-details';
  const token = await AsyncStorage.getItem('ChapToken');

  try {
    const response = await axios({
      method: 'post',
      url: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: personalData,
    });

    if (response?.data?.status) {
      return { success: true, data: response?.data };
    }
    // console.error('Update failed:', response?.data);s
    // return { success: false, error: 'Update failed' };
  } catch (error) {
    console.error('Error updating personal details:', error);
    return {
      success: false,
      error: error?.response?.data?.message || 'Failed to update personal details'
    };
  }
};

export const fetchService = async dispatch => {
  const baseURL = 'https://thecompaniondirectory.com/api';

  const endpoints = ['/services'];

  const keyMap = {
    '/services': 'Services',
  };

  try {
    // Make all requests at once
    const responses = await Promise.all(
      endpoints.map(endpoint =>
        axios.get(`${baseURL}${endpoint}`).catch(err => err),
      ), // Catch each error individually
    );

    // Check for any errors
    const hasError = responses.some(
      res => res instanceof Error || res.status < 200 || res.status >= 300,
    );

    if (hasError) {
      return {
        error: {
          status: 'FETCH_ERROR',
          message: 'One or more API calls failed.',
        },
      };
    }

    // Extract the data from each response and store it in an object with mapped keys
    const allData = responses.reduce((acc, res, idx) => {
      const endpoint = endpoints[idx];
      const key = keyMap[endpoint];

      acc[key] = {
        array: res.data.map(item => ({
          eventName: item?.name,
          eventImg: item?.image,
          eventDiscription: item?.description,
        })),
      };

      return acc;
    }, {});

    dispatch(setDropdown({data: allData}));

    return allData; // Return the data for further use in your application
  } catch (error) {
    console.error('API Error:', error);
    return {error: {status: 'API_ERROR', message: error.message}};
  }
};
