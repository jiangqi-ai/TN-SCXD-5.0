// ================================================
// 数据库表类型定义
// ================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
      };
      shopping_cart: {
        Row: CartItem;
        Insert: CartItemInsert;
        Update: CartItemUpdate;
      };
      settings: {
        Row: Setting;
        Insert: SettingInsert;
        Update: SettingUpdate;
      };
      discounts: {
        Row: Discount;
        Insert: DiscountInsert;
        Update: DiscountUpdate;
      };
    };
    Views: {
      product_details: {
        Row: ProductDetails;
      };
      order_details: {
        Row: OrderDetails;
      };
      low_stock_products: {
        Row: LowStockProduct;
      };
    };
  };
}

// ================================================
// 基础类型定义
// ================================================

export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'wechat' | 'alipay' | 'bank_transfer' | 'cash_on_delivery';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial_refund';
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type SettingDataType = 'string' | 'number' | 'boolean' | 'json';

// ================================================
// 用户相关类型
// ================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  is_active?: boolean;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  is_active?: boolean;
  last_login_at?: string | null;
}

// ================================================
// 分类相关类型
// ================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInsert {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

// ================================================
// 产品相关类型
// ================================================

export interface ProductSpecifications {
  [key: string]: string | number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  specifications: string | null; // JSON字符串
  price: number;
  original_price: number | null;
  category_id: string | null;
  stock_quantity: number;
  min_stock_level: number;
  weight: number | null;
  dimensions: string | null;
  image_url: string | null;
  gallery_images: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  view_count: number;
  sales_count: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInsert {
  name: string;
  sku: string;
  description: string;
  specifications?: string | null;
  price: number;
  original_price?: number | null;
  category_id?: string | null;
  stock_quantity?: number;
  min_stock_level?: number;
  weight?: number | null;
  dimensions?: string | null;
  image_url?: string | null;
  gallery_images?: string[] | null;
  is_active?: boolean;
  is_featured?: boolean;
  tags?: string[] | null;
}

export interface ProductUpdate {
  name?: string;
  sku?: string;
  description?: string;
  specifications?: string | null;
  price?: number;
  original_price?: number | null;
  category_id?: string | null;
  stock_quantity?: number;
  min_stock_level?: number;
  weight?: number | null;
  dimensions?: string | null;
  image_url?: string | null;
  gallery_images?: string[] | null;
  is_active?: boolean;
  is_featured?: boolean;
  view_count?: number;
  sales_count?: number;
  tags?: string[] | null;
}

export interface ProductDetails extends Product {
  category_name: string | null;
  category_slug: string | null;
}

export interface LowStockProduct extends Product {
  category_name: string | null;
}

// ================================================
// 订单相关类型
// ================================================

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  final_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface OrderInsert {
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  shipping_fee?: number;
  final_amount: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod | null;
  payment_status?: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
}

export interface OrderUpdate {
  total_amount?: number;
  discount_amount?: number;
  shipping_fee?: number;
  final_amount?: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod | null;
  payment_status?: PaymentStatus;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  confirmed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
}

export interface OrderDetails extends Order {
  customer_name: string | null;
  customer_email: string | null;
  total_items: number;
}

// ================================================
// 订单项相关类型
// ================================================

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderItemInsert {
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderItemUpdate {
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}

// ================================================
// 购物车相关类型
// ================================================

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemInsert {
  user_id: string;
  product_id: string;
  quantity: number;
}

export interface CartItemUpdate {
  quantity?: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

// ================================================
// 系统设置相关类型
// ================================================

export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  category: string;
  data_type: SettingDataType;
  is_public: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettingInsert {
  key: string;
  value: string;
  description?: string | null;
  category?: string;
  data_type?: SettingDataType;
  is_public?: boolean;
  updated_by?: string | null;
}

export interface SettingUpdate {
  value?: string;
  description?: string | null;
  category?: string;
  data_type?: SettingDataType;
  is_public?: boolean;
  updated_by?: string | null;
}

// ================================================
// 折扣相关类型
// ================================================

export interface Discount {
  id: string;
  name: string;
  code: string | null;
  type: DiscountType;
  value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  created_at: string;
}

export interface DiscountInsert {
  name: string;
  code?: string | null;
  type: DiscountType;
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  valid_from: string;
  valid_to: string;
  is_active?: boolean;
}

export interface DiscountUpdate {
  name?: string;
  code?: string | null;
  type?: DiscountType;
  value?: number;
  min_order_amount?: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count?: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
}

// ================================================
// 业务逻辑相关类型
// ================================================

export interface CreateOrderRequest {
  items: {
    product_id: string;
    quantity: number;
  }[];
  shipping_info: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string;
  };
  notes?: string;
  discount_code?: string;
}

export interface OrderSummary {
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  final_amount: number;
}

export interface ProductFilter {
  category_id?: string;
  price_min?: number;
  price_max?: number;
  is_featured?: boolean;
  search?: string;
  tags?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
} 