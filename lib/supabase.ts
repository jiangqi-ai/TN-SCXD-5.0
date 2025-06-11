import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import SupabaseConfigManager from './supabase-config'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

// 创建默认的 Supabase 客户端
export function createSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // 在生产环境中，如果没有环境变量，返回一个模拟客户端
  if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn('Supabase environment variables are missing in production')
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false }
    })
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  })

  return supabaseClient
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

// 用于测试连接的客户端创建函数
export function createTestClient(url: string, anonKey: string) {
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
} 