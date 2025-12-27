import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { getToken, signOut } from "./redux";
import { API_BASE_URL } from "@/constants/constants";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    const deviceId = 1;

    config.headers.device_id = deviceId;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;
    if (code === 403) {
      signOut();
      throw new Error(message);
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response;
      let validationErrors: any = null;
      switch (status) {
        case 401:
          window.location.href = "/login";
          // Unauthorized - token expired or invalid
          throw new Error("Session expired. Please login again.");

        case 403:
          // Forbidden - no permission
          throw new Error("You do not have permission to access this resource.");

        case 404:
          // Not found
          throw new Error(data?.message || "Resource not found.");

        case 422:
          // Validation error
          validationErrors = data?.errors;
          if (validationErrors) {
            Object.keys(validationErrors).forEach((key) => {
              throw new Error(validationErrors[key][0]);
            });
          } else {
            throw new Error(data?.message || "Validation error.");
          }
          break;

        case 429:
          // Too many requests
          throw new Error("Too many requests. Please try again later.");

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          throw new Error(data?.message || "Server error. Please try again later.");

        default:
          throw new Error(data?.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      throw new Error(error.request || "Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
