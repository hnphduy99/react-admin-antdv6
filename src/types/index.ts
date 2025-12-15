export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  avatar?: string;
  token?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface TableData {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
  status: "active" | "inactive";
}

export interface DashboardStats {
  users: number;
  revenue: number;
  orders: number;
  growth: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
}
