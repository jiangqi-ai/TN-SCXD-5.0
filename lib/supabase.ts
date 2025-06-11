import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import SupabaseConfigManager from './supabase-config'

// 简化类型定义
export type TypedSupabaseClient = any

let supabaseClient: TypedSupabaseClient | null = null

// 创建默认的 Supabase 客户端
export function createSupabaseClient(): TypedSupabaseClient {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing')
    supabaseClient = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    )
    return supabaseClient
  }

  supabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce'
      }
    }
  )

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
export function createTestClient(url: string, anonKey: string): TypedSupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
} 