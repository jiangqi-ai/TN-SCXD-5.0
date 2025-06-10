import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // 验证用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 验证管理员权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 获取所有设置
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true })

    if (error) {
      console.error('获取设置失败:', error)
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 })
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // 验证用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 验证管理员权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const body = await request.json()
    const { key, value, description, category, data_type, is_public } = body

    // 验证必填字段
    if (!key || !value) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 插入新设置
    const { data: setting, error } = await supabase
      .from('settings')
      .insert([{
        key,
        value,
        description,
        category: category || 'general',
        data_type: data_type || 'string',
        is_public: is_public || false,
        updated_by: user.id
      }])
      .select()
      .single()

    if (error) {
      console.error('创建设置失败:', error)
      return NextResponse.json({ error: '创建设置失败' }, { status: 500 })
    }

    return NextResponse.json({ data: setting })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // 验证用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 验证管理员权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: '缺少设置ID' }, { status: 400 })
    }

    // 更新设置
    const { data: setting, error } = await supabase
      .from('settings')
      .update({
        ...updates,
        updated_by: user.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('更新设置失败:', error)
      return NextResponse.json({ error: '更新设置失败' }, { status: 500 })
    }

    return NextResponse.json({ data: setting })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 