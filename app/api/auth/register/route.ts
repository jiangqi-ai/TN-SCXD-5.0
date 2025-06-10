import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isRegistrationEnabled, getMaxUsersPerDay } from '@/lib/settings'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 检查注册是否开启
    const registrationEnabled = await isRegistrationEnabled()
    if (!registrationEnabled) {
      return NextResponse.json(
        { error: '系统暂时关闭了用户注册功能，请稍后再试或联系管理员' },
        { status: 403 }
      )
    }

    const supabase = createSupabaseClient()

    // 检查今日注册用户数是否超限
    const maxUsersPerDay = await getMaxUsersPerDay()
    const today = new Date().toISOString().split('T')[0]
    
    const { count: todayRegistrations } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)

    if (todayRegistrations && todayRegistrations >= maxUsersPerDay) {
      return NextResponse.json(
        { error: `今日注册用户已达上限（${maxUsersPerDay}人），请明天再试` },
        { status: 429 }
      )
    }

    // 检查是否已有管理员
    const { data: existingAdmins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    const isFirstUser = !existingAdmins || existingAdmins.length === 0

    // 创建用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '用户创建失败' },
        { status: 500 }
      )
    }

    // 创建用户档案，第一个用户自动成为管理员
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email,
        full_name: fullName || '用户',
        role: isFirstUser ? 'admin' : 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (profileError) {
      // 如果档案创建失败，删除已创建的认证用户
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { error: '用户档案创建失败' },
        { status: 500 }
      )
    }

    // 如果是第一个用户（管理员），创建基本系统设置
    if (isFirstUser) {
      const basicSettings = [
        {
          key: 'site_name',
          value: '攀岩装备商城',
          category: 'general',
          description: '网站名称',
          is_public: true
        },
        {
          key: 'admin_email',
          value: email,
          category: 'admin', 
          description: '管理员邮箱',
          is_public: false
        },
        {
          key: 'system_initialized',
          value: 'true',
          category: 'system',
          description: '系统是否已初始化',
          is_public: false
        },
        {
          key: 'setup_date',
          value: new Date().toISOString(),
          category: 'system',
          description: '系统初始化日期',
          is_public: false
        }
      ]

      // 尝试创建设置，如果失败不影响用户注册
      try {
        for (const setting of basicSettings) {
          await supabase.from('settings').insert(setting)
        }
      } catch (settingsError) {
        console.warn('创建基本设置失败:', settingsError)
      }
    }

    return NextResponse.json({
      message: isFirstUser ? '恭喜！您已成为系统管理员' : '注册成功',
      user: {
        id: authData.user.id,
        email,
        role: isFirstUser ? 'admin' : 'customer'
      }
    })

  } catch (error) {
    console.error('注册过程中发生错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 