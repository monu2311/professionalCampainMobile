import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sessionManager from '../utils/sessionManager';

// const BASEURL = 'http://my-default-host.com';
const BASEURL = 'https://thecompaniondirectory.com/api';
export const BASEURLS = 'https://thecompaniondirectory.com/api';
// const BASEURL = 'https://lbq0fqvr-8001.inc1.devtunnels.ms/api';
// export const BASEURLS = 'https://lbq0fqvr-8001.inc1.devtunnels.ms/api';

// Store navigation reference (not needed anymore, but keeping for backwards compatibility)
let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
  // sessionManager no longer needs navigation ref
};

// Setup axios interceptor for handling 401 errors
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.log('Token expired - 401 error detected');

      // Clear authentication data (but don't navigate - let modal handle it)
      await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);

      // Show session expired modal instead of toast
      sessionManager.showSessionExpiredModal();
    }
    return Promise.reject(error);
  }
);

const apiCall = async (
  method,
  url,
  data = {},
  baseUrl = BASEURL,
  params = null,
) => {
  const token = await AsyncStorage.getItem('ChapToken');
  const headers = {
    'Origin': 'https://thecompaniondirectory.com'
  };
  if(token){
    headers.Authorization  =  `Bearer ${token}`
  }

  const config = {
    method: (method || 'GET').toString().toUpperCase(),
    url: `${baseUrl}${url}`,
    headers,
  };


  if (data) {
    config.data = data;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else if (method && String(method).toUpperCase() !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }
  }

  if ( params) {
    config.params = params;
  }
  console.log("config config",config)
  try {
    const response = await axios(config);
    console.log("response--->", response);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);

    // Additional error handling for specific status codes
    if (error.response?.status === 401) {
      // Already handled by interceptor
      throw new Error('Your session has expired. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw error;
  }
};
export default apiCall;
