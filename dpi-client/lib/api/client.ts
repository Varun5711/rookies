import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import {
  getErrorMessage,
  getErrorCode,
  getErrorStatus,
  isAuthError,
  isNetworkError,
  isTimeoutError,
} from '@/lib/utils/error-handler';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create api client with timeout and defaults
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token refresh queue management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Add a subscriber callback to be called after token refresh
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers with new token
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor for token refresh with queue mechanism and error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = getErrorStatus(error);

    // Handle 401 errors - token refresh
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Use apiClient for refresh to benefit from interceptors and timeout
        const { data } = await apiClient.post('/auth/tokens/refresh', {
          refreshToken,
        });

        const newAccessToken = data.data.tokens.accessToken;
        const newRefreshToken = data.data.tokens.refreshToken;

        // Store new tokens
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        // Update header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Notify all queued requests
        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        isRefreshing = false;
        refreshSubscribers = [];

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle network errors (no response)
    if (isNetworkError(error)) {
      if (isTimeoutError(error)) {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (status === 403 && !isAuthError(error)) {
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 404 Not Found errors
    if (status === 404) {
      toast.error('The requested resource was not found.');
      return Promise.reject(error);
    }

    // Handle 429 Rate Limit errors
    if (status === 429) {
      toast.error('Too many requests. Please wait and try again.');
      return Promise.reject(error);
    }

    // Handle 500+ server errors
    if (status && status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle other errors with generic message
    if (status && status >= 400) {
      const message = getErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
