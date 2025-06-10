import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import SupabaseConfigManager from './supabase-config'

// 创建默认的 Supabase 客户端
export function createSupabaseClient() {
  // 尝试使用配置管理器的客户端
  const managedClient = SupabaseConfigManager.getClient()
  if (managedClient) {
    return managedClient as ReturnType<typeof createClient<Database>>
  }

  // 回退到环境变量配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    throw new Error('Supabase URL is required')
  }

  if (!supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    throw new Error('Supabase Anonymous Key is required')
  }

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    }
  })

  return client
}

// 初始化配置管理器（异步）
export async function initializeSupabase() {
  try {
    const client = await SupabaseConfigManager.initialize()
    return client
  } catch (error) {
    console.error('Failed to initialize Supabase with config manager:', error)
    return createSupabaseClient()
  }
}

// 导出配置管理器以供管理后台使用
export { SupabaseConfigManager }

// 默认客户端实例
export const supabase = createSupabaseClient()

// 数据库类型定义已移至 @/types/database.ts 