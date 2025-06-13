export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product: Product
}

export interface Order {
  id: number
  user_id: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product: Product
}

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  address: string
  created_at: string
  updated_at: string
} 