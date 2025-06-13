import { supabaseAdmin } from './supabase'

// 产品相关函数
export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getProduct(id: number) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export async function createProduct(productData: {
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([productData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateProduct(id: number, productData: Partial<{
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}>) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export async function deleteProduct(id: number) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    if (error.code === 'PGRST116') return false // Not found
    throw error
  }
  return true
}

// 用户相关函数
export async function getUsers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getUser(id: number) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createUser(userData: {
  name: string
  email: string
}) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([userData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateUser(id: number, userData: Partial<{
  name: string
  email: string
}>) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function deleteUser(id: number) {
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id)
  
  if (error) {
    if (error.code === 'PGRST116') return false
    throw error
  }
  return true
}

// 购物车相关函数
export async function getCartItems(userId: number) {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  
  // 转换数据格式以匹配现有接口
  return (data || []).map(item => ({
    ...item,
    product: item.products
  }))
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  // 先检查是否已存在
  const { data: existing } = await supabaseAdmin
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()
  
  if (existing) {
    // 更新数量
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } else {
    // 创建新项
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .insert([{
        user_id: userId,
        product_id: productId,
        quantity
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export async function updateCartItem(id: number, quantity: number) {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function removeFromCart(id: number) {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    if (error.code === 'PGRST116') return false
    throw error
  }
  return true
}

export async function clearCart(userId: number) {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  
  if (error) throw error
  return true
}

// 订单相关函数
export async function getOrders(userId?: number) {
  let query = supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  // 转换数据格式
  return (data || []).map(order => ({
    ...order,
    items: order.order_items
  }))
}

export async function getOrder(id: number) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return {
    ...data,
    items: data.order_items
  }
}

export async function createOrder(userId: number, items: Array<{
  product_id: number
  quantity: number
  price: number
}>) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // 创建订单
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert([{
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending'
    }])
    .select()
    .single()
  
  if (orderError) throw orderError
  
  // 创建订单项目
  const orderItems = []
  for (const item of items) {
    // 获取产品信息
    const product = await getProduct(item.product_id)
    if (product) {
      orderItems.push({
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        price: item.price
      })
    }
  }
  
  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) throw itemsError
  
  return order
}

export async function updateOrderStatus(id: number, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
} 