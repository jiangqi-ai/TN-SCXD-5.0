// 配置管理 - 支持开发和生产环境
export const config = {
  // Supabase 配置
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // 环境检测
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  
  // 功能开关
  features: {
    useSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    useMemoryStorage: !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }
}

// 配置验证
export function validateConfig() {
  if (config.features.useSupabase) {
    if (!config.supabase.url) {
      console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL 未配置')
      return false
    }
    if (!config.supabase.anonKey) {
      console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY 未配置')
      return false
    }
    if (!config.supabase.serviceRoleKey && config.isProd) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY 未配置')
      return false
    }
  }
  return true
}

// 获取当前存储模式
export function getStorageMode(): 'supabase' | 'memory' {
  return config.features.useSupabase ? 'supabase' : 'memory'
} 