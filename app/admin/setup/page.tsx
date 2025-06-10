'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { 
  Database, 
  User, 
  Settings, 
  Key,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

interface DatabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey: string
  connectionPool: number
  timeout: number
}

interface AdminAccount {
  email: string
  password: string
  fullName: string
}

export default function AdminSetup() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: '',
    connectionPool: 10,
    timeout: 30
  })
  const [adminAccount, setAdminAccount] = useState<AdminAccount>({
    email: 'admin@climbing-gear.com',
    password: '',
    fullName: '系统管理员'
  })
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: '数据库配置',
      description: '配置 Supabase 数据库连接参数',
      completed: false,
      required: true
    },
    {
      id: 'admin',
      title: '创建管理员账户',
      description: '设置系统管理员账户',
      completed: false,
      required: true
    },
    {
      id: 'settings',
      title: '系统设置',
      description: '配置基本系统参数',
      completed: false,
      required: false
    }
  ])

  const supabase = createSupabaseClient()

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      // 检查数据库连接
      const { data: dbTest } = await supabase.from('settings').select('count').limit(1)
      if (dbTest) {
        updateStepStatus('database', true)
      }

      // 检查管理员账户
      const { data: adminUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
      
      if (adminUser && adminUser.length > 0) {
        updateStepStatus('admin', true)
      }

      // 检查系统设置
      const { data: settings } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
      
      if (settings && settings.length > 0) {
        updateStepStatus('settings', true)
      }
    } catch (error) {
      // 静默处理错误
    }
  }

  const updateStepStatus = (stepId: string, completed: boolean) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed } : step
    ))
  }

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      // 这里应该使用新的配置测试连接
      const { data, error } = await supabase
        .from('settings')
        .select('count')
        .limit(1)

      if (error) {
        throw error
      }

      updateStepStatus('database', true)
      toast.success('数据库连接测试成功！')
      
      // 保存数据库配置到设置表
      await saveDatabaseConfig()
      
    } catch (error) {
      console.error('数据库连接测试失败:', error)
      toast.error('数据库连接测试失败，请检查配置')
    } finally {
      setLoading(false)
    }
  }

  const saveDatabaseConfig = async () => {
    try {
      const configEntries = [
        { key: 'db_url', value: dbConfig.url, category: 'database', is_public: false },
        { key: 'db_anon_key', value: dbConfig.anonKey, category: 'database', is_public: false },
        { key: 'db_service_key', value: dbConfig.serviceRoleKey, category: 'database', is_public: false },
        { key: 'db_connection_pool', value: dbConfig.connectionPool.toString(), category: 'database', is_public: false },
        { key: 'db_timeout', value: dbConfig.timeout.toString(), category: 'database', is_public: false }
      ]

      for (const config of configEntries) {
        await supabase
          .from('settings')
          .upsert(config, { onConflict: 'key' })
      }

      toast.success('数据库配置已保存')
    } catch (error) {
      console.error('保存数据库配置失败:', error)
      toast.error('保存数据库配置失败')
    }
  }

  const createAdminAccount = async () => {
    setLoading(true)
    try {
      // 创建用户账户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminAccount.email,
        password: adminAccount.password,
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
            email: adminAccount.email,
            full_name: adminAccount.fullName,
            role: 'admin'
          }])

        if (profileError) {
          throw profileError
        }

        updateStepStatus('admin', true)
        toast.success('管理员账户创建成功！')
      }

    } catch (error: any) {
      console.error('创建管理员账户失败:', error)
      toast.error(`创建管理员账户失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const initializeSystemSettings = async () => {
    setLoading(true)
    try {
      const defaultSettings = [
        { key: 'site_name', value: '攀岩装备专营店', category: 'general', is_public: true },
        { key: 'site_description', value: '专业的攀岩装备在线购买平台', category: 'general', is_public: true },
        { key: 'contact_email', value: adminAccount.email, category: 'contact', is_public: true },
        { key: 'setup_completed', value: 'true', category: 'system', is_public: false },
        { key: 'setup_date', value: new Date().toISOString(), category: 'system', is_public: false }
      ]

      for (const setting of defaultSettings) {
        await supabase
          .from('settings')
          .upsert(setting, { onConflict: 'key' })
      }

      updateStepStatus('settings', true)
      toast.success('系统设置初始化完成！')

    } catch (error) {
      console.error('初始化系统设置失败:', error)
      toast.error('初始化系统设置失败')
    } finally {
      setLoading(false)
    }
  }

  const completeSetup = () => {
    toast.success('系统设置完成！正在跳转到管理后台...')
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
  }

  const renderDatabaseStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Database className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">数据库配置说明</h3>
            <p className="mt-1 text-sm text-blue-700">
              请填入您的 Supabase 项目配置信息。这些信息可以在 Supabase Dashboard 的 Settings → API 中找到。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">项目URL</label>
          <input
            type="url"
            value={dbConfig.url}
            onChange={(e) => setDbConfig(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://your-project-id.supabase.co"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">公开密钥 (anon key)</label>
          <textarea
            value={dbConfig.anonKey}
            onChange={(e) => setDbConfig(prev => ({ ...prev, anonKey: e.target.value }))}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">服务密钥 (service_role key)</label>
          <textarea
            value={dbConfig.serviceRoleKey}
            onChange={(e) => setDbConfig(prev => ({ ...prev, serviceRoleKey: e.target.value }))}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">连接池大小</label>
            <input
              type="number"
              value={dbConfig.connectionPool}
              onChange={(e) => setDbConfig(prev => ({ ...prev, connectionPool: parseInt(e.target.value) }))}
              min="1"
              max="50"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">超时时间（秒）</label>
            <input
              type="number"
              value={dbConfig.timeout}
              onChange={(e) => setDbConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              min="5"
              max="120"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={testDatabaseConnection}
          disabled={loading || !dbConfig.url || !dbConfig.anonKey}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
          测试连接
        </button>
      </div>
    </div>
  )

  const renderAdminStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <User className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-800">管理员账户</h3>
            <p className="mt-1 text-sm text-green-700">
              创建系统管理员账户，用于访问管理后台和系统配置。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
          <input
            type="email"
            value={adminAccount.email}
            onChange={(e) => setAdminAccount(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">密码</label>
          <input
            type="password"
            value={adminAccount.password}
            onChange={(e) => setAdminAccount(prev => ({ ...prev, password: e.target.value }))}
            placeholder="请设置强密码（至少8个字符）"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">姓名</label>
          <input
            type="text"
            value={adminAccount.fullName}
            onChange={(e) => setAdminAccount(prev => ({ ...prev, fullName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={createAdminAccount}
          disabled={loading || !adminAccount.email || !adminAccount.password || adminAccount.password.length < 8}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <User className="h-4 w-4 mr-2" />}
          创建管理员
        </button>
      </div>
    </div>
  )

  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <Settings className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-800">系统设置</h3>
            <p className="mt-1 text-sm text-purple-700">
              初始化系统基本设置，后续可在管理后台进行修改。
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={initializeSystemSettings}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
          初始化设置
        </button>
      </div>
    </div>
  )

  const allRequiredStepsCompleted = steps.filter(s => s.required).every(s => s.completed)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">攀岩装备系统设置</h1>
          <p className="mt-2 text-gray-600">欢迎！请按照以下步骤完成系统初始化配置</p>
        </div>

        {/* 进度指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index 
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                }`}>
                  {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${step.completed ? 'text-green-600' : 'text-gray-900'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 当前步骤内容 */}
        <div className="bg-white shadow rounded-lg p-6">
          {currentStep === 0 && renderDatabaseStep()}
          {currentStep === 1 && renderAdminStep()}
          {currentStep === 2 && renderSettingsStep()}

          {/* 导航按钮 */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一步
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={steps[currentStep].required && !steps[currentStep].completed}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={completeSetup}
                disabled={!allRequiredStepsCompleted}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4 mr-2" />
                完成设置
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 