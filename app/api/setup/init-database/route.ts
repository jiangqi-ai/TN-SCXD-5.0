import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url, anonKey } = await request.json()

    if (!url || !anonKey) {
      return NextResponse.json(
        { error: '缺少数据库连接参数' },
        { status: 400 }
      )
    }

    // 创建测试客户端
    const { createTestClient } = await import('@/lib/supabase')
    const testClient = createTestClient(url, anonKey)

    console.log('开始初始化数据库结构...')

    // 尝试创建基础设置数据
    try {
      // 首先尝试插入一些基础设置来测试settings表是否存在
      const { error: insertError } = await testClient
        .from('settings')
        .upsert([
          {
            key: 'site_name',
            value: '攀岩装备商城',
            description: '网站名称',
            category: 'general',
            data_type: 'string',
            is_public: true
          },
          {
            key: 'allow_user_registration',
            value: 'false',
            description: '是否允许用户注册',
            category: 'user',
            data_type: 'boolean',
            is_public: true
          }
        ], { onConflict: 'key' })

      if (insertError) {
        console.error('插入设置失败:', insertError)
        return NextResponse.json(
          { 
            error: '数据库表结构不完整，请在Supabase控制台中执行数据库初始化脚本',
            details: insertError.message,
            sqlFile: 'database/init-basic.sql'
          },
          { status: 400 }
        )
      }

      console.log('基础设置插入成功')

    } catch (error: any) {
      console.error('数据库操作失败:', error)
      return NextResponse.json(
        { 
          error: '数据库表结构不完整，请在Supabase控制台中执行数据库初始化脚本',
          details: error.message,
          sqlFile: 'database/init-basic.sql'
        },
        { status: 400 }
      )
    }

    // 验证关键表是否可以访问
    const { data: settingsTest, error: settingsError } = await testClient
      .from('settings')
      .select('count')
      .limit(1)

    if (settingsError) {
      console.error('验证settings表失败:', settingsError)
      return NextResponse.json(
        { 
          error: '数据库表结构验证失败，请在Supabase控制台中执行数据库初始化脚本',
          details: settingsError.message,
          sqlFile: 'database/init-basic.sql'
        },
        { status: 400 }
      )
    }

    console.log('数据库初始化验证完成')
    return NextResponse.json({ 
      success: true, 
      message: '数据库初始化成功，基础设置已配置' 
    })

  } catch (error: any) {
    console.error('数据库初始化失败:', error)
    return NextResponse.json(
      { error: `数据库初始化失败: ${error.message}` },
      { status: 500 }
    )
  }
} 