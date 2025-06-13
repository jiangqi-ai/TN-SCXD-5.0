import { NextResponse } from 'next/server'
import { testDatabaseConnection } from '@/lib/database'
import { config } from '@/lib/config'

export async function GET() {
  try {
    // 基本配置检查
    const configStatus = {
      url: !!config.supabase.url,
      anonKey: !!config.supabase.anonKey,
      serviceKey: !!config.supabase.serviceRoleKey,
      isConfigured: !!config.supabase.url && !!config.supabase.anonKey
    }

    // 尝试连接数据库
    let connectionTest: any = null
    if (configStatus.isConfigured) {
      try {
        connectionTest = await testDatabaseConnection()
      } catch (error) {
        connectionTest = {
          success: false,
          error: error instanceof Error ? error.message : '连接测试失败'
        }
      }
    }

    return NextResponse.json({
      success: true,
      config: configStatus,
      connection: connectionTest,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('数据库测试失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '数据库测试失败'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // 强制重新测试数据库连接
    const connection = await testDatabaseConnection()
    
    return NextResponse.json({
      success: true,
      connection,
      message: '数据库连接测试完成',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '数据库连接测试失败'
      },
      { status: 500 }
    )
  }
} 