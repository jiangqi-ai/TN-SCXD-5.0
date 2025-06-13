// Simple in-memory data store for demo purposes
interface Product {
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

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  created_at: string
}

interface Order {
  id: number
  user_id: number
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product_name: string
}

// In-memory data storage
let products: Product[] = [
  {
    id: 1,
    name: '专业攀岩绳',
    description: '高强度动力绳，适合各种攀岩活动。采用优质尼龙材料制作，具有出色的弹性和耐磨性。',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    category: '绳索',
    stock: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '攀岩头盔',
    description: '轻量化安全头盔，提供全面保护。通风设计，佩戴舒适，符合国际安全标准。',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: '安全装备',
    stock: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: '攀岩鞋',
    description: '专业攀岩鞋，提供优异抓地力。橡胶鞋底设计，适合各种岩面类型。',
    price: 399.99,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: '鞋类',
    stock: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: '攀岩背包',
    description: '专业攀岩背包，大容量设计，多个分隔袋便于装备分类存放。',
    price: 159.99,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: '背包',
    stock: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: '攀岩手套',
    description: '防滑攀岩手套，提供良好的抓握力和手部保护。透气材质，长时间使用不闷热。',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: '手套',
    stock: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: '攀岩粉袋',
    description: '专业攀岩粉袋，可调节腰带，方便取用镁粉。耐用材质，不易破损。',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    category: '配件',
    stock: 80,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let users: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let cartItems: CartItem[] = []
let orders: Order[] = [
  {
    id: 1,
    user_id: 1,
    total_amount: 499.98,
    status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    user_id: 2,
    total_amount: 299.99,
    status: 'processing',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    user_id: 1,
    total_amount: 89.99,
    status: 'shipped',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString()
  }
]
let orderItems: OrderItem[] = [
  {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 1,
    price: 299.99,
    product_name: '专业攀岩绳'
  },
  {
    id: 2,
    order_id: 1,
    product_id: 2,
    quantity: 1,
    price: 199.99,
    product_name: '攀岩头盔'
  },
  {
    id: 3,
    order_id: 2,
    product_id: 1,
    quantity: 1,
    price: 299.99,
    product_name: '专业攀岩绳'
  },
  {
    id: 4,
    order_id: 3,
    product_id: 5,
    quantity: 1,
    price: 89.99,
    product_name: '攀岩手套'
  }
]

let nextProductId = 7
let nextUserId = 3
let nextCartId = 1
let nextOrderId = 4
let nextOrderItemId = 5

// Product functions
export async function getProducts() {
  return products
}

export async function getProduct(id: number) {
  return products.find(p => p.id === id) || null
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const newProduct: Product = {
    ...productData,
    id: nextProductId++,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  products.push(newProduct)
  return newProduct
}

export async function updateProduct(id: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null
  
  products[index] = {
    ...products[index],
    ...productData,
    updated_at: new Date().toISOString()
  }
  return products[index]
}

export async function deleteProduct(id: number) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  
  products.splice(index, 1)
  return true
}

// User functions
export async function getUsers() {
  return users
}

export async function getUser(id: number) {
  return users.find(u => u.id === id) || null
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const newUser: User = {
    ...userData,
    id: nextUserId++,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  users.push(newUser)
  return newUser
}

export async function updateUser(id: number, userData: Partial<Omit<User, 'id' | 'created_at'>>) {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return null
  
  users[index] = {
    ...users[index],
    ...userData,
    updated_at: new Date().toISOString()
  }
  return users[index]
}

export async function deleteUser(id: number) {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return false
  
  users.splice(index, 1)
  return true
}

// Cart functions
export async function getCartItems(userId: number) {
  const userCartItems = cartItems.filter(item => item.user_id === userId)
  return userCartItems.map(item => {
    const product = products.find(p => p.id === item.product_id)
    return {
      ...item,
      product: product || null
    }
  })
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const existingItem = cartItems.find(item => item.user_id === userId && item.product_id === productId)
  
  if (existingItem) {
    existingItem.quantity += quantity
    return existingItem
  } else {
    const newItem: CartItem = {
      id: nextCartId++,
      user_id: userId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString()
    }
    cartItems.push(newItem)
    return newItem
  }
}

export async function updateCartItem(id: number, quantity: number) {
  const item = cartItems.find(item => item.id === id)
  if (!item) return null
  
  item.quantity = quantity
  return item
}

export async function removeFromCart(id: number) {
  const index = cartItems.findIndex(item => item.id === id)
  if (index === -1) return false
  
  cartItems.splice(index, 1)
  return true
}

export async function clearCart(userId: number) {
  cartItems = cartItems.filter(item => item.user_id !== userId)
  return true
}

// Order functions
export async function getOrders(userId?: number) {
  let filteredOrders = userId ? orders.filter(o => o.user_id === userId) : orders
  
  return filteredOrders.map(order => {
    const items = orderItems.filter(item => item.order_id === order.id)
    return {
      ...order,
      items
    }
  })
}

export async function getOrder(id: number) {
  const order = orders.find(o => o.id === id)
  if (!order) return null
  
  const items = orderItems.filter(item => item.order_id === id)
  return {
    ...order,
    items
  }
}

export async function createOrder(userId: number, items: Array<{product_id: number, quantity: number, price: number}>) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const newOrder: Order = {
    id: nextOrderId++,
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  orders.push(newOrder)
  
  // Create order items
  for (const item of items) {
    const product = products.find(p => p.id === item.product_id)
    const newOrderItem: OrderItem = {
      id: nextOrderItemId++,
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product_name: product?.name || 'Unknown Product'
    }
    orderItems.push(newOrderItem)
  }
  
  return newOrder
}

export async function updateOrderStatus(id: number, status: string) {
  const order = orders.find(o => o.id === id)
  if (!order) return null
  
  order.status = status
  order.updated_at = new Date().toISOString()
  return order
} 