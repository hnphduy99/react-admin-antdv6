export interface IProduct {
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
