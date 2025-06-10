import { createSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createSupabaseClient()
    
    // 获取所有管理员账户
    const { data: admins, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at, last_sign_in_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ admins })
  } catch (error: any) {
    console.error('获取管理员账户失败:', error)
    return NextResponse.json(
      { error: '获取管理员账户失败', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()
    
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: '邮箱、密码和姓名都是必填项' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient()
    
    // 创建用户账户
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      throw authError
    }

    if (authData.user) {
      // 创建用户资料
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          role: 'admin'
        }])

      if (profileError) {
        // 如果创建资料失败，删除已创建的用户
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }

      return NextResponse.json({
        message: '管理员账户创建成功',
        user: {
          id: authData.user.id,
          email,
          full_name: fullName,
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )

  } catch (error: any) {
    console.error('创建管理员账户失败:', error)
    return NextResponse.json(
      { error: '创建管理员账户失败', details: error.message },
      { status: 500 }
    )
  }
} 