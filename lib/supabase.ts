import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>

let supabaseClient: TypedSupabaseClient | null = null

// 创建 Supabase 客户端
export function createSupabaseClient(): TypedSupabaseClient {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 在构建时或环境变量缺失时，创建一个占位符客户端
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase环境变量缺失，使用占位符客户端')
    
    supabaseClient = createClient<Database>(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
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

  console.log('✅ 创建Supabase客户端:', supabaseUrl)

  supabaseClient = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )

  return supabaseClient
}

// 检查环境变量是否配置正确
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(supabaseUrl && 
           supabaseAnonKey && 
           supabaseUrl !== 'https://placeholder.supabase.co' &&
           supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder')
}

// 默认客户端实例
export const supabase = createSupabaseClient()

// 用于测试连接的客户端创建函数
export function createTestClient(url: string, anonKey: string): TypedSupabaseClient {
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
} 