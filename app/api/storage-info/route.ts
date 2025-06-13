import { NextResponse } from 'next/server'
import { getStorageMode, config } from '@/lib/config'
import { testDatabaseConnection } from '@/lib/database'

export async function GET() {
  try {
    const mode = getStorageMode()
    const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    let isSupabaseConnected = false
    let message = ''
    
    if (mode === 'supabase' && isSupabaseConfigured) {
      try {
        const connectionTest = await testDatabaseConnection()
        isSupabaseConnected = connectionTest.success
        message = connectionTest.message
      } catch (error) {
        isSupabaseConnected = false
        message = error instanceof Error ? error.message : 'Supabase 连接测试失败'
      }
    } else if (mode === 'memory') {
      message = '当前使用内存存储，数据在应用重启后会丢失'
    } else {
      message = 'Supabase 环境变量未配置，使用内存存储'
    }
    
    return NextResponse.json({
      mode,
      isSupabaseConfigured,
      isSupabaseConnected,
      message,
      environment: {
        isDev: config.isDev,
        isProd: config.isProd,
        nodeEnv: process.env.NODE_ENV
      },
      configuration: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    })
  } catch (error) {
    console.error('获取存储信息失败:', error)
    return NextResponse.json(
      { error: '获取存储信息失败' },
      { status: 500 }
    )
  }
} 