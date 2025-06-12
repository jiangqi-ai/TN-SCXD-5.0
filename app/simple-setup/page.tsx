'use client'

import { useState } from 'react'
import { createSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export default function SimpleSetupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [setupComplete, setSetupComplete] = useState(false)
  const [message, setMessage] = useState('')

  // 步骤1：检查Supabase连接
  const checkConnection = async () => {
    setLoading(true)
    setMessage('')
    
    if (!isSupabaseConfigured()) {
      setMessage('❌ 请先在Vercel中配置Supabase环境变量')
      setLoading(false)
      return
    }

    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) throw error
      
      setMessage('✅ Supabase连接成功！')
      setStep(2)
    } catch (error) {
      setMessage('❌ 连接失败，请检查配置')
    }
    setLoading(false)
  }

  // 步骤2：发送管理员邀请
  const sendInvite = async () => {
    if (!adminEmail) {
      setMessage('请输入管理员邮箱')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const supabase = createSupabaseClient()
      
      // 使用Supabase的邀请功能
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(adminEmail, {
        data: {
          role: 'admin',
          full_name: '系统管理员'
        }
      })

      if (error) throw error

      setMessage('✅ 邀请邮件已发送！请检查邮箱并点击链接完成设置')
      setStep(3)
    } catch (error: any) {
      setMessage(`❌ 邀请失败: ${error.message}`)
    }
    setLoading(false)
  }

  // 步骤3：初始化系统数据
  const initializeSystem = async () => {
    setLoading(true)
    setMessage('')

    try {
      const supabase = createSupabaseClient()
      
      // 创建基础分类
      const categories = [
        { name: '攀岩鞋', description: '专业攀岩鞋类', is_active: true },
        { name: '安全装备', description: '安全带、头盔等', is_active: true },
        { name: '绳索装备', description: '攀岩绳、扁带等', is_active: true }
      ]

      const { error: catError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'name' })

      if (catError) throw catError

      // 创建系统设置
      const settings = [
        { key: 'site_name', value: '攀岩装备商城', description: '网站名称', is_public: true },
        { key: 'allow_user_registration', value: 'false', description: '是否允许用户注册', is_public: true }
      ]

      const { error: settingsError } = await supabase
        .from('settings')
        .upsert(settings, { onConflict: 'key' })

      if (settingsError) throw settingsError

      setMessage('✅ 系统初始化完成！')
      setSetupComplete(true)
    } catch (error: any) {
      setMessage(`❌ 初始化失败: ${error.message}`)
    }
    setLoading(false)
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            设置完成！
          </h1>
          <p className="text-gray-600 mb-6">
            攀岩装备下单系统已准备就绪
          </p>
          <div className="space-y-3">
            <a 
              href="/admin" 
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              进入管理后台
            </a>
            <a 
              href="/" 
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              查看商城首页
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            🧗‍♂️ 攀岩装备下单系统 - 快速配置
          </h1>

          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`h-1 w-16 ${
                      step > num ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>连接数据库</span>
              <span>管理员邀请</span>
              <span>系统初始化</span>
            </div>
          </div>

          {/* 步骤内容 */}
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">步骤1: 检查数据库连接</h2>
                <p className="text-gray-600 mb-4">
                  确保Supabase数据库连接正常
                </p>
                <button
                  onClick={checkConnection}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '检查中...' : '检查连接'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">步骤2: 创建管理员账户</h2>
                <p className="text-gray-600 mb-4">
                  输入管理员邮箱，系统将发送邀请邮件
                </p>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={sendInvite}
                  disabled={loading || !adminEmail}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '发送中...' : '发送邀请邮件'}
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">步骤3: 初始化系统</h2>
                <p className="text-gray-600 mb-4">
                  创建基础分类和系统设置
                </p>
                <button
                  onClick={initializeSystem}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? '初始化中...' : '完成设置'}
                </button>
              </div>
            )}

            {/* 消息显示 */}
            {message && (
              <div className={`p-4 rounded ${
                message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* 说明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">💡 配置说明</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 使用Supabase邀请功能，无需手动创建密码</li>
              <li>• 管理员通过邮件链接完成注册</li>
              <li>• 自动创建攀岩装备的基础分类</li>
              <li>• 系统启动后即可开始接收订单</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 