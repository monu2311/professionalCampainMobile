# Professional Companionship App - API Integration Guide

## Table of Contents
1. [API Architecture](#api-architecture)
2. [Base Configuration](#base-configuration)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Request/Response Interceptors](#requestresponse-interceptors)
7. [Payment Integration](#payment-integration)
8. [File Uploads](#file-uploads)
9. [Real-time Updates](#real-time-updates)
10. [Best Practices](#best-practices)

## API Architecture

### Overview
The application uses a RESTful API architecture with the following components:
- **Base URL**: `https://thecompaniondirectory.com/api`
- **HTTP Client**: Axios
- **State Management**: Redux Toolkit with async thunks
- **Authentication**: Bearer token (JWT)
- **Content Types**: JSON, FormData (for file uploads)

### Directory Structure
```
src/
├── apiConfig/
│   ├── apiCall.js           # Base Axios configuration
│   ├── endpoints.js         # API endpoint constants
│   └── interceptors.js      # Request/Response interceptors
├── reduxSlice/
│   ├── apiSlice.js          # API async thunks
│   ├── profileSlice.js      # Profile state management
│   └── authSlice.js         # Auth state management
├── services/
│   ├── authService.js       # Authentication services
│   ├── userService.js       # User services
│   ├── paymentService.js    # Payment services
│   └── chatService.js       # Chat services
└── hooks/
    ├── useApi.js            # Custom API hook
    └── useAuth.js           # Auth hook
```

## Base Configuration

### Current apiCall.js Implementation
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASEURL = 'https://thecompaniondirectory.com/api';

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
    headers.Authorization = `Bearer ${token}`;
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

  if (params) {
    config.params = params;
  }

  const response = await axios(config);
  return response.data;
};

export default apiCall;
```

### Enhanced Axios Instance (Recommended)
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'https://thecompaniondirectory.com/api',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ChapToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('RefreshToken');
        const response = await axios.post('/auth/refresh', {
          refreshToken,
        });

        const { token } = response.data;
        await AsyncStorage.setItem('ChapToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Logout user
        await AsyncStorage.multiRemove(['ChapToken', 'RefreshToken']);
        // Navigate to login
        return Promise.reject(refreshError);
      }
    }

    // Show error message
    if (error.response?.data?.message) {
      showMessage({
        message: 'Error',
        description: error.response.data.message,
        type: 'danger',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## Authentication

### Login Flow
```javascript
// Redux Thunk Example
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/auth/login', {
        email,
        password,
      });

      // Store tokens
      await AsyncStorage.setItem('ChapToken', response.token);
      await AsyncStorage.setItem('RefreshToken', response.refreshToken);
      await AsyncStorage.setItem('UserData', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Register Flow
```javascript
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Step 1: Basic registration
      const response = await apiCall('POST', '/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      });

      // Store token
      await AsyncStorage.setItem('ChapToken', response.token);

      // Step 2: Complete profile
      const profileResponse = await apiCall('POST', '/profile/complete', {
        category: userData.category,
        services: userData.services,
        bio: userData.bio,
        availability: userData.availability,
        pricing: userData.pricing,
      });

      return { ...response, profile: profileResponse };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Forgot Password Flow
```javascript
// Request OTP
export const requestPasswordReset = createAsyncThunk(
  'auth/requestReset',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/auth/forgot-password', {
        email,
      });

      return response; // { message: 'OTP sent', otpId: 'xxx' }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ otpId, otp }, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/auth/verify-otp', {
        otpId,
        otp,
      });

      return response; // { resetToken: 'xxx' }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/auth/reset-password', {
        resetToken,
        newPassword,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Logout
```javascript
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiCall('POST', '/auth/logout');

      // Clear local storage
      await AsyncStorage.multiRemove([
        'ChapToken',
        'RefreshToken',
        'UserData',
      ]);

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

## API Endpoints

### User Management
```javascript
// Get user profile
GET /users/profile
Response: {
  id: string,
  email: string,
  name: string,
  category: string,
  services: string[],
  bio: string,
  images: string[],
  availability: object,
  pricing: object,
  rating: number,
  reviews: number,
}

// Update profile
PUT /users/profile
Body: {
  name?: string,
  bio?: string,
  services?: string[],
  availability?: object,
  pricing?: object,
}

// Upload profile image
POST /users/profile/image
Body: FormData {
  image: File,
  type: 'profile' | 'gallery',
}

// Delete account
DELETE /users/account
Body: {
  password: string,
  reason?: string,
}
```

### Discovery & Search
```javascript
// Search companions
GET /companions/search
Params: {
  category?: string,
  services?: string[],
  location?: string,
  priceMin?: number,
  priceMax?: number,
  availability?: string,
  rating?: number,
  page?: number,
  limit?: number,
}

// Get companion details
GET /companions/:id

// Add to favorites
POST /favorites/:companionId

// Remove from favorites
DELETE /favorites/:companionId
```

### Booking Management
```javascript
// Create booking
POST /bookings
Body: {
  companionId: string,
  date: string,
  time: string,
  duration: number,
  service: string,
  notes?: string,
}

// Get user bookings
GET /bookings
Params: {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  type?: 'incoming' | 'outgoing',
  page?: number,
  limit?: number,
}

// Update booking status
PUT /bookings/:id/status
Body: {
  status: 'confirmed' | 'cancelled' | 'completed',
  reason?: string,
}

// Rate booking
POST /bookings/:id/review
Body: {
  rating: number,
  comment: string,
}
```

### Chat System
```javascript
// Get chat list
GET /chats
Params: {
  type?: 'active' | 'requests',
  page?: number,
  limit?: number,
}

// Get chat messages
GET /chats/:userId/messages
Params: {
  lastMessageId?: string,
  limit?: number,
}

// Send message
POST /chats/:userId/messages
Body: {
  text?: string,
  image?: string,
  video?: string,
}

// Accept chat request
PUT /chats/:userId/accept

// Block user
POST /users/:userId/block
```

### Subscription Management
```javascript
// Get available plans
GET /plans

// Get user subscription
GET /subscriptions/current

// Purchase subscription
POST /subscriptions/purchase
Body: {
  planId: string,
  paymentMethod: 'paypal' | 'stripe',
  autoRenew?: boolean,
}

// Cancel subscription
DELETE /subscriptions/current

// Request refund
POST /subscriptions/refund
Body: {
  reason: string,
  details?: string,
}
```

## Error Handling

### Error Response Format
```javascript
{
  error: true,
  message: string,
  code: string,
  details?: object,
  timestamp: string,
}
```

### Common Error Codes
```javascript
const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_TOKEN_EXPIRED: 'Session expired, please login again',
  AUTH_UNAUTHORIZED: 'You are not authorized',

  // Validation
  VALIDATION_ERROR: 'Validation failed',
  INVALID_INPUT: 'Invalid input data',

  // Resource
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',

  // Payment
  PAYMENT_FAILED: 'Payment processing failed',
  INSUFFICIENT_FUNDS: 'Insufficient funds',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests',

  // Server
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
};
```

### Error Handling in Components
```javascript
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';

const useApiCall = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      setError(errorMessage);

      showMessage({
        message: 'Error',
        description: errorMessage,
        type: 'danger',
        duration: 3000,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
};
```

## Request/Response Interceptors

### Request Queue for Offline Support
```javascript
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(request) {
    this.queue.push(request);
    await this.saveQueue();
    this.process();
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue[0];

      try {
        await axios(request);
        this.queue.shift();
        await this.saveQueue();
      } catch (error) {
        if (error.message === 'Network Error') {
          // Keep in queue for retry
          break;
        }
        // Remove failed request
        this.queue.shift();
        await this.saveQueue();
      }
    }

    this.processing = false;
  }

  async saveQueue() {
    await AsyncStorage.setItem('RequestQueue', JSON.stringify(this.queue));
  }

  async loadQueue() {
    const saved = await AsyncStorage.getItem('RequestQueue');
    if (saved) {
      this.queue = JSON.parse(saved);
    }
  }
}
```

### Retry Logic
```javascript
const retryRequest = async (config, retries = 3, backoff = 1000) => {
  try {
    return await axios(config);
  } catch (error) {
    if (retries === 0) throw error;

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, backoff));

    return retryRequest(config, retries - 1, backoff * 2);
  }
};
```

## Payment Integration

### PayPal WebView Integration
```javascript
// Generate PayPal payment URL
export const createPayPalPayment = async (amount, planId) => {
  const response = await apiCall('POST', '/payments/paypal/create', {
    amount,
    planId,
    returnUrl: 'professionalcompanionship://payment/success',
    cancelUrl: 'professionalcompanionship://payment/cancel',
  });

  return response.paymentUrl;
};

// PayPal WebView Component
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';

const PayPalWebView = ({ paymentUrl, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    // Check for success URL
    if (url.includes('/payment/success')) {
      const transactionId = extractTransactionId(url);
      onSuccess(transactionId);
      return;
    }

    // Check for cancel URL
    if (url.includes('/payment/cancel')) {
      onCancel();
      return;
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => <LoadingSpinner />}
    />
  );
};
```

### Stripe WebView Integration
```javascript
// Generate Stripe checkout session
export const createStripeCheckout = async (amount, planId) => {
  const response = await apiCall('POST', '/payments/stripe/checkout', {
    amount,
    planId,
    successUrl: 'professionalcompanionship://payment/success',
    cancelUrl: 'professionalcompanionship://payment/cancel',
  });

  return response.checkoutUrl;
};

// Verify payment
export const verifyPayment = async (sessionId) => {
  const response = await apiCall('GET', `/payments/verify/${sessionId}`);
  return response;
};
```

## File Uploads

### Image Upload with Compression
```javascript
import ImagePicker from 'react-native-image-crop-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const uploadImage = async (type = 'profile') => {
  try {
    // Pick image
    const image = await ImagePicker.openPicker({
      width: 800,
      height: 800,
      cropping: true,
      includeBase64: false,
      compressImageQuality: 0.8,
    });

    // Compress image
    const compressed = await manipulateAsync(
      image.path,
      [{ resize: { width: 800 } }],
      { compress: 0.8, format: SaveFormat.JPEG }
    );

    // Create FormData
    const formData = new FormData();
    formData.append('image', {
      uri: compressed.uri,
      type: 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`,
    });
    formData.append('type', type);

    // Upload
    const response = await apiCall('POST', '/upload/image', formData);

    return response.imageUrl;
  } catch (error) {
    throw error;
  }
};
```

### Video Upload
```javascript
export const uploadVideo = async () => {
  try {
    const video = await ImagePicker.openPicker({
      mediaType: 'video',
      maxDuration: 60, // 60 seconds max
    });

    // Check file size (max 50MB)
    if (video.size > 50 * 1024 * 1024) {
      throw new Error('Video size must be less than 50MB');
    }

    const formData = new FormData();
    formData.append('video', {
      uri: video.path,
      type: video.mime,
      name: `video_${Date.now()}.mp4`,
    });

    // Upload with progress tracking
    const response = await axios.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // Update progress state
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });

    return response.data.videoUrl;
  } catch (error) {
    throw error;
  }
};
```

## Real-time Updates

### Polling Strategy for Chat
```javascript
class ChatPolling {
  constructor(userId, onNewMessage) {
    this.userId = userId;
    this.onNewMessage = onNewMessage;
    this.isActive = false;
    this.pollingInterval = 3000; // 3 seconds
    this.lastMessageId = null;
  }

  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.poll();
  }

  stop() {
    this.isActive = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  async poll() {
    if (!this.isActive) return;

    try {
      const response = await apiCall('GET', `/chats/${this.userId}/new-messages`, null, null, {
        lastMessageId: this.lastMessageId,
      });

      if (response.messages && response.messages.length > 0) {
        this.lastMessageId = response.messages[response.messages.length - 1].id;
        this.onNewMessage(response.messages);

        // Speed up polling when getting messages
        this.pollingInterval = 1000;
      } else {
        // Slow down polling when no messages
        this.pollingInterval = Math.min(this.pollingInterval * 1.5, 10000);
      }
    } catch (error) {
      console.error('Polling error:', error);
      this.pollingInterval = 5000;
    }

    // Schedule next poll
    this.timeoutId = setTimeout(() => this.poll(), this.pollingInterval);
  }

  sendMessage(message) {
    // Speed up polling after sending
    this.pollingInterval = 1000;
  }
}
```

### Push Notifications Setup
```javascript
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Request permission
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

  if (enabled) {
    const token = await messaging().getToken();
    await updateDeviceToken(token);
  }

  return enabled;
};

// Update device token
const updateDeviceToken = async (token) => {
  await apiCall('POST', '/users/device-token', { token });
};

// Handle notifications
messaging().onMessage(async remoteMessage => {
  // Display local notification
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    data: remoteMessage.data,
  });
});
```

## Best Practices

### 1. API Service Layer
```javascript
// services/apiService.js
class ApiService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async get(url, options = {}) {
    const cacheKey = `${url}${JSON.stringify(options)}`;

    // Check cache
    if (options.cache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < options.cacheTime || 60000) {
        return cached.data;
      }
    }

    // Check pending requests (prevent duplicate requests)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Make request
    const request = apiCall('GET', url, null, null, options.params);
    this.pendingRequests.set(cacheKey, request);

    try {
      const data = await request;

      // Cache result
      if (options.cache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  post(url, data, options = {}) {
    return apiCall('POST', url, data, null, options.params);
  }

  put(url, data, options = {}) {
    return apiCall('PUT', url, data, null, options.params);
  }

  delete(url, options = {}) {
    return apiCall('DELETE', url, null, null, options.params);
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new ApiService();
```

### 2. Custom Hooks
```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunc, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Usage
const ProfileScreen = () => {
  const { data: profile, loading, error, refetch } = useApi(
    () => apiService.get('/users/profile'),
    []
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return <ProfileView profile={profile} />;
};
```

### 3. Optimistic Updates
```javascript
// Redux slice with optimistic updates
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    pending: [],
  },
  reducers: {
    addOptimisticMessage: (state, action) => {
      state.pending.push({
        ...action.payload,
        id: `temp_${Date.now()}`,
        status: 'pending',
      });
    },
    confirmMessage: (state, action) => {
      const { tempId, message } = action.payload;
      state.pending = state.pending.filter(m => m.id !== tempId);
      state.messages.push(message);
    },
    removeOptimisticMessage: (state, action) => {
      state.pending = state.pending.filter(m => m.id !== action.payload);
    },
  },
});

// Usage in component
const sendMessage = async (text) => {
  const tempId = `temp_${Date.now()}`;

  // Add optimistic message
  dispatch(addOptimisticMessage({
    id: tempId,
    text,
    timestamp: new Date().toISOString(),
  }));

  try {
    const message = await apiCall('POST', '/messages', { text });
    dispatch(confirmMessage({ tempId, message }));
  } catch (error) {
    dispatch(removeOptimisticMessage(tempId));
    showError('Failed to send message');
  }
};
```

### 4. Request Debouncing
```javascript
import { debounce } from 'lodash';

// Search with debouncing
const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    debounce(async (query) => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const data = await apiCall('GET', '/search', null, null, { query });
        setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  return { search, results, loading };
};
```

### 5. API Testing
```javascript
// Mock API for testing
class MockApi {
  constructor() {
    this.delay = 1000;
  }

  async simulateDelay() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async get(url) {
    await this.simulateDelay();

    // Return mock data based on URL
    switch (url) {
      case '/users/profile':
        return mockUserProfile;
      case '/companions/search':
        return mockCompanions;
      default:
        throw new Error('Not found');
    }
  }

  async post(url, data) {
    await this.simulateDelay();

    // Simulate different scenarios
    if (Math.random() > 0.8) {
      throw new Error('Network error');
    }

    return { success: true, data };
  }
}

// Use mock API in development
const api = __DEV__ ? new MockApi() : apiService;
```

## Security Best Practices

### 1. Token Storage
```javascript
import * as Keychain from 'react-native-keychain';

// Secure token storage
export const secureStorage = {
  async setToken(token) {
    await Keychain.setInternetCredentials(
      'companionship-app',
      'token',
      token
    );
  },

  async getToken() {
    const credentials = await Keychain.getInternetCredentials('companionship-app');
    return credentials ? credentials.password : null;
  },

  async removeToken() {
    await Keychain.resetInternetCredentials('companionship-app');
  },
};
```

### 2. API Key Protection
```javascript
// Use environment variables
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL;
const API_KEY = Config.API_KEY;

// Never hardcode sensitive data
// ❌ Bad
const apiKey = 'sk_live_abc123...';

// ✅ Good
const apiKey = Config.STRIPE_PUBLIC_KEY;
```

### 3. Request Validation
```javascript
// Validate request data
const validateRequest = (data, schema) => {
  const errors = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    if (rules.required && !value) {
      errors.push(`${key} is required`);
    }

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${key} must be ${rules.type}`);
    }

    if (rules.min && value.length < rules.min) {
      errors.push(`${key} must be at least ${rules.min} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${key} format is invalid`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return true;
};
```

### 4. SSL Pinning
```javascript
import { NetworkingModule } from 'react-native';

// Configure SSL pinning
NetworkingModule.addSSLPinning({
  'thecompaniondirectory.com': {
    cert: 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  },
});
```

## Monitoring & Analytics

### API Performance Tracking
```javascript
// Track API performance
const trackApiCall = async (config) => {
  const startTime = Date.now();

  try {
    const response = await axios(config);
    const duration = Date.now() - startTime;

    // Log to analytics
    analytics.track('API_Call', {
      url: config.url,
      method: config.method,
      duration,
      status: response.status,
      success: true,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    analytics.track('API_Call', {
      url: config.url,
      method: config.method,
      duration,
      status: error.response?.status,
      success: false,
      error: error.message,
    });

    throw error;
  }
};
```

---

Last Updated: 2025-09-28
Version: 1.0.0