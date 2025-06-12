import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>

let supabaseClient: TypedSupabaseClient | null = null

// 创建 Supabase 客户端
export function createSupabaseClient(): TypedSupabaseClient {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase环境变量缺失!')
    console.error('请在Vercel中配置以下环境变量:')
    console.error('- NEXT_PUBLIC_SUPABASE_URL')
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
    throw new Error('Supabase环境变量缺失，请检查配置')
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