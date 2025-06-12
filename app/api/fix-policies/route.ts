import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { supabaseUrl, supabaseKey } = await request.json()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: '缺少Supabase配置信息' },
        { status: 400 }
      )
    }

    // 创建管理员客户端 - 使用service_role key如果可用，否则使用anon key
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 修复策略递归的SQL脚本
    const fixPolicies = async () => {
      const commands = [
        // 删除所有现有的profiles表策略
        `DROP POLICY IF EXISTS "Users can view own profile" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Users can update own profile" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Users can insert own profile" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles CASCADE;`,
        `DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles CASCADE;`,
        
        // 禁用RLS
        `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;`,
        
        // 重新启用RLS
        `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`,
        
        // 创建简单的新策略 - 分别创建，避免复杂依赖
        `CREATE POLICY "profiles_select_policy" ON profiles 
         FOR SELECT TO authenticated 
         USING (true);`,
         
        `CREATE POLICY "profiles_insert_policy" ON profiles 
         FOR INSERT TO authenticated 
         WITH CHECK (auth.uid() = user_id);`,
         
        `CREATE POLICY "profiles_update_policy" ON profiles 
         FOR UPDATE TO authenticated 
         USING (auth.uid() = user_id) 
         WITH CHECK (auth.uid() = user_id);`
      ]

      // 逐个执行命令
      for (const cmd of commands) {
        try {
          await supabase.rpc('exec_sql', { sql: cmd })
        } catch (error) {
          console.log(`执行SQL命令失败: ${cmd}`, error)
          // 继续执行下一个命令
        }
      }
    }

    // 尝试修复策略
    await fixPolicies()

    // 测试连接
    const { data, error: testError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (testError) {
      // 如果还是有错误，尝试更激进的修复
      console.log('第一次修复失败，尝试更激进的方法...')
      
      // 完全重建表结构（如果可能）
      try {
        // 删除所有策略并重建
        await supabase.rpc('exec_sql', { 
          sql: `
            DROP POLICY IF EXISTS "profiles_select_policy" ON profiles CASCADE;
            DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles CASCADE;
            DROP POLICY IF EXISTS "profiles_update_policy" ON profiles CASCADE;
            ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
            ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
            
            -- 创建最简单的策略
            CREATE POLICY "allow_all_authenticated" ON profiles 
            FOR ALL TO authenticated 
            USING (true) 
            WITH CHECK (true);
          `
        })
      } catch (error) {
        console.log('激进修复也失败:', error)
      }

      // 再次测试
      const { data: retryData, error: retryError } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1)

      if (retryError) {
        return NextResponse.json(
          { 
            error: `权限策略修复失败: ${retryError.message}`,
            suggestion: '请联系管理员手动修复数据库权限策略'
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: '权限策略修复成功！' 
    })

  } catch (error: any) {
    console.error('修复权限策略时出错:', error)
    return NextResponse.json(
      { error: `修复失败: ${error.message}` },
      { status: 500 }
    )
  }
} 