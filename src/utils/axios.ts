import { message } from "antd";
import { store } from "@/store";
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth.user?.token;
    const deviceId = 1;

    config.headers.device_id = deviceId;

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API Response:", response.config.url, response.status);

    // You can transform response data here if needed
    return response;
  },
  async (error: AxiosError<any>) => {
    // Handle different error statuses
    if (error.response) {
      const { status, data } = error.response;
      let validationErrors: any = null;
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          message.error("Session expired. Please login again.");

          // Clear auth state and redirect to login
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden - no permission
          message.error("You do not have permission to access this resource.");
          break;

        case 404:
          // Not found
          message.error(data?.message || "Resource not found.");
          break;

        case 422:
          // Validation error
          validationErrors = data?.errors;
          if (validationErrors) {
            Object.keys(validationErrors).forEach((key) => {
              message.error(validationErrors[key][0]);
            });
          } else {
            message.error(data?.message || "Validation error.");
          }
          break;

        case 429:
          // Too many requests
          message.error("Too many requests. Please try again later.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          message.error(data?.message || "Server error. Please try again later.");
          break;

        default:
          message.error(data?.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      // Request made but no response received
      message.error("Network error. Please check your connection.");
      console.error("❌ Network Error:", error.request);
    } else {
      // Something else happened
      message.error("An unexpected error occurred.");
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
