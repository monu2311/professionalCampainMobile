import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASEURL = 'http://my-default-host.com';
const BASEURL = 'https://thecompaniondirectory.com/api';
export const BASEURLS = 'https://thecompaniondirectory.com/api';
const apiCall = async (
  method,
  url,
  data = {},
  baseUrl = BASEURL,
  params = null,
) => {
  const token = await AsyncStorage.getItem('ChapToken');
  const headers = {};
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

  const response = await axios(config);
  return response.data;
};
export default apiCall;
