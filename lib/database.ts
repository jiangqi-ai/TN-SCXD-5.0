// 统一数据库接口 - 自动切换 Supabase 和内存存储
import { config, getStorageMode } from './config'

// 动态导入数据库实现
async function getDbImplementation() {
  const mode = getStorageMode()
  
  if (mode === 'supabase') {
    try {
      const supabaseDb = await import('./supabase-db')
      console.log('🚀 使用 Supabase 云端数据库')
      return supabaseDb
    } catch (error) {
      console.warn('⚠️ Supabase 连接失败，切换到内存存储:', error)
      const memoryDb = await import('./db')
      console.log('💾 使用内存数据库')
      return memoryDb
    }
  } else {
    const memoryDb = await import('./db')
    console.log('💾 使用内存数据库')
    return memoryDb
  }
}

// 数据库连接测试
export async function testDatabaseConnection() {
  const mode = getStorageMode()
  
  if (mode === 'supabase') {
    try {
      // 测试 Supabase 连接
      const supabaseDb = await import('./supabase-db')
      const testResult = await supabaseDb.getProducts()
      return {
        success: true,
        mode: 'supabase',
        message: 'Supabase 数据库连接成功',
        productCount: testResult.length
      }
    } catch (error) {
      return {
        success: false,
        mode: 'supabase',
        message: 'Supabase 数据库连接失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  } else {
    // 内存存储总是可用的
    const memoryDb = await import('./db')
    const testResult = await memoryDb.getProducts()
    return {
      success: true,
      mode: 'memory',
      message: '内存数据库连接成功',
      productCount: testResult.length
    }
  }
}

// 产品相关函数
export async function getProducts() {
  const db = await getDbImplementation()
  return db.getProducts()
}

export async function getProduct(id: number) {
  const db = await getDbImplementation()
  return db.getProduct(id)
}

export async function createProduct(productData: {
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}) {
  const db = await getDbImplementation()
  return db.createProduct(productData)
}

export async function updateProduct(id: number, productData: Partial<{
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}>) {
  const db = await getDbImplementation()
  return db.updateProduct(id, productData)
}

export async function deleteProduct(id: number) {
  const db = await getDbImplementation()
  return db.deleteProduct(id)
}

// 用户相关函数
export async function getUsers() {
  const db = await getDbImplementation()
  return db.getUsers()
}

export async function getUser(id: number) {
  const db = await getDbImplementation()
  return db.getUser(id)
}

export async function createUser(userData: {
  name: string
  email: string
}) {
  const db = await getDbImplementation()
  return db.createUser(userData)
}

export async function updateUser(id: number, userData: Partial<{
  name: string
  email: string
}>) {
  const db = await getDbImplementation()
  return db.updateUser(id, userData)
}

export async function deleteUser(id: number) {
  const db = await getDbImplementation()
  return db.deleteUser(id)
}

// 购物车相关函数
export async function getCartItems(userId: number) {
  const db = await getDbImplementation()
  return db.getCartItems(userId)
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDbImplementation()
  return db.addToCart(userId, productId, quantity)
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDbImplementation()
  return db.updateCartItem(id, quantity)
}

export async function removeFromCart(id: number) {
  const db = await getDbImplementation()
  return db.removeFromCart(id)
}

export async function clearCart(userId: number) {
  const db = await getDbImplementation()
  return db.clearCart(userId)
}

// 订单相关函数
export async function getOrders(userId?: number) {
  const db = await getDbImplementation()
  return db.getOrders(userId)
}

export async function getOrder(id: number) {
  const db = await getDbImplementation()
  return db.getOrder(id)
}

export async function createOrder(userId: number, items: Array<{
  product_id: number
  quantity: number
  price: number
}>) {
  const db = await getDbImplementation()
  return db.createOrder(userId, items)
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDbImplementation()
  return db.updateOrderStatus(id, status)
}

// 获取存储模式信息
export function getStorageInfo() {
  const mode = getStorageMode()
  return {
    mode,
    isSupabase: mode === 'supabase',
    isMemory: mode === 'memory',
    configured: config.features.useSupabase
  }
} 