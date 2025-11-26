// FIXED apiConfig.js - Replace the request interceptor (lines 27-38)

// Request interceptor to add token and handle FormData
apiV2Client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ChapToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Special handling for FormData
    if (config.data instanceof FormData) {
      // Remove Content-Type to let axios set the correct boundary
      delete config.headers['Content-Type'];
      // Ensure multipart/form-data is used
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ALSO UPDATE: Create axios instance (lines 18-24)
export const apiV2Client = axios.create({
  baseURL: API_V2_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    // Don't set Content-Type here - let interceptor handle it
  },
});