export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

export interface Cart {
  userId: number;
  items: CartItem[];
}

export interface Order {
  id: number;
  userId: number;
  user_name?: string;
  user_email?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'staff' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
} 