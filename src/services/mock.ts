import type { TableData, Notification } from "@/types";

// Simulate API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock table data
const generateTableData = (count: number = 50): TableData[] => {
  const data: TableData[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      key: `${i}`,
      name: `User ${i}`,
      age: 20 + Math.floor(Math.random() * 40),
      address: `Address ${i}, Street ${Math.floor(Math.random() * 100)}`,
      tags: i % 2 === 0 ? ["developer", "active"] : ["designer"],
      status: i % 3 === 0 ? "inactive" : "active"
    });
  }
  return data;
};

// In-memory storage for table data
const tableDataStore = generateTableData();

// Mock Table API
export const mockTableApi = {
  // Get paginated table data with search
  getTableData: async (page: number = 1, pageSize: number = 10, search?: string) => {
    await delay(800); // Simulate network delay

    let filteredData = [...tableDataStore];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize
      }
    };
  },

  // Create new record
  createRecord: async (record: Omit<TableData, "key">) => {
    await delay(500);

    const newRecord: TableData = {
      ...record,
      key: `${tableDataStore.length + 1}`
    };

    tableDataStore.push(newRecord);

    return {
      success: true,
      data: newRecord,
      message: "Record created successfully"
    };
  },

  // Update record
  updateRecord: async (key: string, record: Partial<TableData>) => {
    await delay(500);

    const index = tableDataStore.findIndex((item) => item.key === key);
    if (index === -1) {
      throw new Error("Record not found");
    }

    tableDataStore[index] = { ...tableDataStore[index], ...record };

    return {
      success: true,
      data: tableDataStore[index],
      message: "Record updated successfully"
    };
  },

  // Delete record
  deleteRecord: async (key: string) => {
    await delay(500);

    const index = tableDataStore.findIndex((item) => item.key === key);
    if (index === -1) {
      throw new Error("Record not found");
    }

    tableDataStore.splice(index, 1);

    return {
      success: true,
      message: "Record deleted successfully"
    };
  }
};

// Generate mock notifications
const generateNotifications = (): Notification[] => {
  return [
    {
      id: "1",
      title: "New User Registration",
      description: "John Doe has registered",
      type: "info",
      read: false,
      createdAt: "2 minutes ago"
    },
    {
      id: "2",
      title: "Payment Received",
      description: "Payment of $1,200 received",
      type: "success",
      read: false,
      createdAt: "1 hour ago"
    },
    {
      id: "3",
      title: "Server Warning",
      description: "High CPU usage detected",
      type: "warning",
      read: true,
      createdAt: "3 hours ago"
    },
    {
      id: "4",
      title: "New Comment",
      description: "Someone commented on your post",
      type: "info",
      read: true,
      createdAt: "5 hours ago"
    },
    {
      id: "5",
      title: "System Update",
      description: "System will be updated tonight",
      type: "warning",
      read: true,
      createdAt: "1 day ago"
    }
  ];
};

// Mock Notification API
export const mockNotificationApi = {
  getNotifications: async () => {
    await delay(600);

    return {
      success: true,
      data: generateNotifications()
    };
  },

  markAsRead: async () => {
    await delay(300);

    return {
      success: true,
      message: "Notification marked as read"
    };
  },

  markAllAsRead: async () => {
    await delay(400);

    return {
      success: true,
      message: "All notifications marked as read"
    };
  }
};

// Mock Dashboard API
export const mockDashboardApi = {
  getStats: async () => {
    await delay(700);

    return {
      success: true,
      data: {
        totalUsers: 1234,
        activeUsers: 856,
        totalRevenue: 45678,
        totalOrders: 3456
      }
    };
  },

  getRecentActivities: async (limit: number = 10) => {
    await delay(600);

    const activities = [
      {
        id: "1",
        user: "John Doe",
        action: "Created new order",
        timestamp: "2 minutes ago",
        type: "order"
      },
      {
        id: "2",
        user: "Jane Smith",
        action: "Updated profile",
        timestamp: "15 minutes ago",
        type: "profile"
      },
      {
        id: "3",
        user: "Bob Johnson",
        action: "Made a payment",
        timestamp: "1 hour ago",
        type: "payment"
      },
      {
        id: "4",
        user: "Alice Williams",
        action: "Registered new account",
        timestamp: "2 hours ago",
        type: "registration"
      },
      {
        id: "5",
        user: "Charlie Brown",
        action: "Cancelled order",
        timestamp: "3 hours ago",
        type: "order"
      }
    ];

    return {
      success: true,
      data: activities.slice(0, limit)
    };
  }
};

// Generate mock users
const generateMockUsers = () => {
  const roles: ("admin" | "user" | "moderator")[] = ["admin", "user", "moderator"];
  const users = [];
  for (let i = 1; i <= 30; i++) {
    users.push({
      id: `${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: roles[i % 3],
      status: (i % 4 === 0 ? "inactive" : "active") as "active" | "inactive",
      joinDate: `202${(i % 4) + 1}-0${(i % 9) + 1}-${(i % 28) + 1}`,
      avatar: "https://res.cloudinary.com/dn2y3fyv8/image/upload/v1762482957/Screenshot_2025-11-07_093403_oe4lf7.png"
    });
  }
  return users;
};

// In-memory storage for users
const userDataStore = generateMockUsers();

// Mock User Management API
export const mockUserApi = {
  // Get paginated users with search
  getUsers: async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    colSearches: Record<string, string> = {}
  ) => {
    await delay(600);

    const normalizedSearch = search.toLowerCase();
    const hasSearch = !!normalizedSearch;
    const hasColFilters = Object.keys(colSearches).length > 0;

    const filteredData = userDataStore.filter((item) => {
      // 1. Filter theo search chung
      if (hasSearch) {
        const name = item.name.toLowerCase();
        const email = item.email.toLowerCase();

        if (!name.includes(normalizedSearch) && !email.includes(normalizedSearch)) {
          return false; // Không match search => loại
        }
      }

      // 2. Filter theo từng cột
      if (hasColFilters) {
        for (const [key, value] of Object.entries(colSearches)) {
          const itemValue = (item as any)[key];

          // Nếu key không tồn tại hoặc không match => loại
          if (typeof itemValue !== "string" || !itemValue.toLowerCase().includes(value.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    });

    // Pagination
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize
      }
    };
  },

  // Get user by ID
  getUserById: async (id: string) => {
    await delay(400);

    const user = userDataStore.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: user
    };
  },

  // Create new user
  createUser: async (userData: any) => {
    await delay(700);

    const newUser = {
      id: `${userDataStore.length + 1}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || "active",
      joinDate: new Date().toISOString().split("T")[0],
      avatar:
        userData.avatar ||
        "https://res.cloudinary.com/dn2y3fyv8/image/upload/v1762482957/Screenshot_2025-11-07_093403_oe4lf7.png"
    };

    userDataStore.push(newUser);

    return {
      success: true,
      data: newUser,
      message: "User created successfully"
    };
  },

  // Update user
  updateUser: async (id: string, userData: any) => {
    await delay(600);

    const index = userDataStore.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    userDataStore[index] = {
      ...userDataStore[index],
      ...userData
    };

    return {
      success: true,
      data: userDataStore[index],
      message: "User updated successfully"
    };
  },

  // Delete user
  deleteUser: async (id: string) => {
    await delay(500);

    const index = userDataStore.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    userDataStore.splice(index, 1);

    return {
      success: true,
      message: "User deleted successfully"
    };
  }
};

// Generate mock products
const generateMockProducts = () => {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Home & Garden"];
  const products = [];

  for (let i = 1; i <= 50; i++) {
    products.push({
      id: `${i}`,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 1000) + 10,
      stock: Math.floor(Math.random() * 100),
      category: categories[i % categories.length],
      description: `This is description for Product ${i}`,
      status: (i % 5 === 0 ? "inactive" : "active") as "active" | "inactive",
      createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      updatedAt: i % 3 === 0 ? new Date().toISOString().split("T")[0] : undefined
    });
  }
  return products;
};

// In-memory storage for products
const productDataStore = generateMockProducts();

// Mock Product Management API
export const mockProductApi = {
  // Get paginated products with search
  getProducts: async (page: number = 1, pageSize: number = 10, search?: string) => {
    await delay(600);

    let filteredData = [...productDataStore];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize
      }
    };
  },

  // Get product by ID
  getProductById: async (id: string) => {
    await delay(400);

    const product = productDataStore.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      data: product
    };
  },

  // Create new product
  createProduct: async (productData: any) => {
    await delay(700);

    const newProduct = {
      id: `${productDataStore.length + 1}`,
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      description: productData.description,
      status: productData.status || "active",
      createdAt: new Date().toISOString().split("T")[0]
    };

    productDataStore.push(newProduct);

    return {
      success: true,
      data: newProduct,
      message: "Product created successfully"
    };
  },

  // Update product
  updateProduct: async (id: string, productData: any) => {
    await delay(600);

    const index = productDataStore.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    productDataStore[index] = {
      ...productDataStore[index],
      ...productData,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    return {
      success: true,
      data: productDataStore[index],
      message: "Product updated successfully"
    };
  },

  // Delete product
  deleteProduct: async (id: string) => {
    await delay(500);

    const index = productDataStore.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    productDataStore.splice(index, 1);

    return {
      success: true,
      message: "Product deleted successfully"
    };
  }
};

// Mock Auth API
export const mockAuthApi = {
  // Login - accepts any credentials for development
  login: async (email: string, password: string) => {
    await delay(800);

    // For development, accept any email/password
    // In real app, this would validate against database
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Simulate successful login
    const user = {
      id: "1",
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      role: (email.includes("admin") ? "admin" : "user") as "admin" | "moderator" | "user",
      avatar: "https://res.cloudinary.com/dn2y3fyv8/image/upload/v1762482957/Screenshot_2025-11-07_093403_oe4lf7.png"
    };

    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      success: true,
      data: {
        user,
        token
      },
      message: "Login successful"
    };
  },

  // Register - creates new user
  register: async (name: string, email: string, password: string) => {
    await delay(900);

    // Simple validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Create user
    const user = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: "user" as const,
      avatar: "https://res.cloudinary.com/dn2y3fyv8/image/upload/v1762482957/Screenshot_2025-11-07_093403_oe4lf7.png"
    };

    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      success: true,
      data: {
        user,
        token
      },
      message: "Registration successful"
    };
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    await delay(700);

    if (!email) {
      throw new Error("Email is required");
    }

    // Simulate sending email
    return {
      success: true,
      message: "Password reset link sent to your email"
    };
  },

  // Reset password with token
  resetPassword: async (token: string, password: string) => {
    await delay(800);

    if (!token) {
      throw new Error("Invalid or expired reset token");
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Simulate successful password reset
    return {
      success: true,
      message: "Password has been reset successfully"
    };
  }
};

// Export all mock APIs
export const mockApi = {
  table: mockTableApi,
  notification: mockNotificationApi,
  dashboard: mockDashboardApi,
  user: mockUserApi,
  product: mockProductApi,
  auth: mockAuthApi
};

export default mockApi;
