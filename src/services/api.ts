import axiosInstance from "@/utils/axios";

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

// User API endpoints
export const userApi = {
  // Get all users with pagination
  getUsers: async (page = 1, pageSize = 10, search?: string) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<User>>>("/users", {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: Partial<User>) => {
    const response = await axiosInstance.post<ApiResponse<User>>("/users", userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await axiosInstance.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (userData: Partial<User>) => {
    const response = await axiosInstance.put<ApiResponse<User>>("/users/me", userData);
    return response.data;
  }
};

// Auth API endpoints
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>("/auth/login", {
      email,
      password
    });
    return response.data;
  },

  // Register
  register: async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>("/auth/register", {
      name,
      email,
      password
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post<ApiResponse<void>>("/auth/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post<ApiResponse<{ token: string }>>("/auth/refresh");
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    const response = await axiosInstance.post<ApiResponse<void>>("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<void>>("/auth/reset-password", {
      token,
      password
    });
    return response.data;
  }
};

// Example: Dashboard API
export const dashboardApi = {
  // Get dashboard stats
  getStats: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>("/dashboard/stats");
    return response.data;
  },

  // Get recent activities
  getActivities: async (limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>("/dashboard/activities", {
      params: { limit }
    });
    return response.data;
  }
};

// Table Data API (for TableExample page)
export const tableApi = {
  // Get table data with pagination and search
  getTableData: async (page = 1, pageSize = 10, search?: string) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<any>>>("/table/data", {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  // Create new record
  createRecord: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>("/table/data", data);
    return response.data;
  },

  // Update record
  updateRecord: async (key: string, data: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/table/data/${key}`, data);
    return response.data;
  },

  // Delete record
  deleteRecord: async (key: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/table/data/${key}`);
    return response.data;
  }
};

// Notification API
export const notificationApi = {
  // Get all notifications
  getNotifications: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>("/notifications");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<void>>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await axiosInstance.patch<ApiResponse<void>>("/notifications/read-all");
    return response.data;
  }
};

// Generic API helper
export const api = {
  get: <T = any>(url: string, params?: any) => axiosInstance.get<T>(url, { params }),
  post: <T = any>(url: string, data?: any) => axiosInstance.post<T>(url, data),
  put: <T = any>(url: string, data?: any) => axiosInstance.put<T>(url, data),
  delete: <T = any>(url: string) => axiosInstance.delete<T>(url),
  patch: <T = any>(url: string, data?: any) => axiosInstance.patch<T>(url, data)
};

export default {
  user: userApi,
  auth: authApi,
  dashboard: dashboardApi,
  table: tableApi,
  notification: notificationApi
};
