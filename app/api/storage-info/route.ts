import { NextResponse } from 'next/server'
import { getStorageInfo } from '@/lib/database'
import { config } from '@/lib/config'

export async function GET() {
  try {
    const storageInfo = getStorageInfo()
    
    return NextResponse.json({
      ...storageInfo,
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
    return NextResponse.json(
      { error: '获取存储信息失败' },
      { status: 500 }
    )
  }
} 