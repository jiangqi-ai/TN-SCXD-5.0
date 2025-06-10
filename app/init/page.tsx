'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Shield, User, Database, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

interface InitStatus {
  hasAdmin: boolean
  dbConnected: boolean
  checkingStatus: boolean
}

export default function SystemInit() {
  const router = useRouter()
  const [status, setStatus] = useState<InitStatus>({
    hasAdmin: false,
    dbConnected: false,
    checkingStatus: true
  })
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '系统管理员'
  })

  const supabase = createSupabaseClient()

  useEffect(() => {
    checkInitStatus()
  }, [])

  const checkInitStatus = async () => {
    try {
      // 检查数据库连接
      const { data: dbTest, error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      const dbConnected = !dbError

      // 检查是否已有管理员
      let hasAdmin = false
      if (dbConnected) {
        const { data: adminCheck } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
        
        hasAdmin = Boolean(adminCheck && adminCheck.length > 0)
      }

      setStatus({
        hasAdmin,
        dbConnected,
        checkingStatus: false
      })

      // 如果已有管理员，重定向到登录页
      if (hasAdmin) {
        toast.success('系统已初始化，请登录管理后台')
        router.push('/auth/login')
      }

    } catch (error) {
      console.error('检查初始化状态失败:', error)
      setStatus({
        hasAdmin: false,
        dbConnected: false,
        checkingStatus: false
      })
    }
  }

  const createFirstAdmin = async () => {
    if (adminData.password !== adminData.confirmPassword) {
      toast.error('密码确认不匹配')
      return
    }

    if (adminData.password.length < 6) {
      toast.error('密码至少需要6个字符')
      return
    }

    setLoading(true)
    try {
      // 1. 创建认证用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('用户创建失败')
      }

      // 2. 创建管理员档案
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: adminData.email,
          full_name: adminData.fullName,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (profileError) {
        throw profileError
      }

      // 3. 创建基本系统设置
      const basicSettings = [
        {
          key: 'site_name',
          value: '攀岩装备商城',
          category: 'general',
          description: '网站名称',
          data_type: 'string',
          is_public: true
        },
        {
          key: 'admin_email',
          value: adminData.email,
          category: 'admin',
          description: '管理员邮箱',
          data_type: 'string',
          is_public: false
        },
        {
          key: 'system_initialized',
          value: 'true',
          category: 'system',
          description: '系统是否已初始化',
          data_type: 'boolean',
          is_public: false
        },
        {
          key: 'setup_date',
          value: new Date().toISOString(),
          category: 'system',
          description: '系统初始化日期',
          data_type: 'string',
          is_public: false
        },
        // 用户注册控制设置
        {
          key: 'allow_user_registration',
          value: 'true',
          category: 'user',
          description: '是否允许用户注册',
          data_type: 'boolean',
          is_public: true
        },
        {
          key: 'require_email_verification',
          value: 'false',
          category: 'user',
          description: '是否需要邮箱验证',
          data_type: 'boolean',
          is_public: false
        },
        {
          key: 'max_users_per_day',
          value: '100',
          category: 'user',
          description: '每日最大注册用户数',
          data_type: 'number',
          is_public: false
        },
        {
          key: 'registration_message',
          value: '欢迎注册攀岩装备商城！',
          category: 'user',
          description: '注册页面提示信息',
          data_type: 'string',
          is_public: true
        }
      ]

      for (const setting of basicSettings) {
        await supabase
          .from('settings')
          .insert(setting)
      }

      toast.success('管理员账户创建成功！正在跳转...')
      
      // 等待一下确保数据写入
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (error: any) {
      console.error('创建管理员账户失败:', error)
      
      if (error.code === '23505') {
        toast.error('该邮箱已被使用')
      } else if (error.message?.includes('email')) {
        toast.error('邮箱格式不正确')
      } else {
        toast.error(`创建失败: ${error.message || '未知错误'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (status.checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">检查系统状态中...</p>
        </div>
      </div>
    )
  }

  if (!status.dbConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">数据库连接失败</h2>
            <p className="mt-2 text-gray-600">
              请检查环境变量配置是否正确
            </p>
            <div className="mt-6 space-y-2 text-sm text-left bg-gray-50 p-4 rounded">
              <p><strong>检查事项：</strong></p>
              <p>1. .env.local 文件是否存在</p>
              <p>2. NEXT_PUBLIC_SUPABASE_URL 是否正确</p>
              <p>3. NEXT_PUBLIC_SUPABASE_ANON_KEY 是否正确</p>
              <p>4. Supabase 项目是否正常运行</p>
            </div>
            <button
              onClick={checkInitStatus}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              重新检查
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status.hasAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">系统已初始化</h2>
            <p className="mt-2 text-gray-600">
              管理员账户已存在，请登录管理后台
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              前往登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">系统初始化</h2>
            <p className="mt-2 text-gray-600">
              创建第一个管理员账户来开始使用系统
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); createFirstAdmin(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                管理员姓名
              </label>
              <input
                type="text"
                value={adminData.fullName}
                onChange={(e) => setAdminData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                管理员邮箱
              </label>
              <input
                type="email"
                value={adminData.email}
                onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                value={adminData.password}
                onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
                placeholder="至少6个字符"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <input
                type="password"
                value={adminData.confirmPassword}
                onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
                placeholder="再次输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  创建中...
                </>
              ) : (
                <>
                  创建管理员账户
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">重要提醒：</p>
                <p>• 请妥善保管管理员账户信息</p>
                <p>• 此账户将拥有系统最高权限</p>
                <p>• 创建后可在管理后台修改密码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 