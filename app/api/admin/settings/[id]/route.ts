import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: '缺少设置ID' }, { status: 400 })
    }

    // 删除设置
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除设置失败:', error)
      return NextResponse.json({ error: '删除设置失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 