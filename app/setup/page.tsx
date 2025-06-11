'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { 
  Database, 
  User, 
  Settings, 
  Shield,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Loader,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'
import toast from 'react-hot-toast'

type DbSettingKey = 
  | 'db_url' 
  | 'db_anon_key' 
  | 'db_service_key' 
  | 'db_connection_pool_size'
  | 'db_query_timeout'
  | 'db_max_connections'
  | 'db_idle_timeout'
  | 'db_backup_enabled'
  | 'db_backup_frequency'
  | 'db_backup_retention_days'
  | 'db_monitoring_enabled'
  | 'db_slow_query_threshold'
  | 'low_stock_alert'
  | 'cart_cleanup_days';

interface DatabaseConfig {
  // 连接配置
  db_url: string;
  db_anon_key: string;
  db_service_key: string;
  
  // 性能配置
  db_connection_pool_size: number;
  db_query_timeout: number;
  db_max_connections: number;
  db_idle_timeout: number;
  
  // 备份配置
  db_backup_enabled: boolean;
  db_backup_frequency: string;
  db_backup_retention_days: number;
  
  // 监控配置
  db_monitoring_enabled: boolean;
  db_slow_query_threshold: number;
  low_stock_alert: number;
  cart_cleanup_days: number;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  required: boolean;
}

interface AdminAccount {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  allowUserRegistration: boolean
  requireEmailVerification: boolean
  defaultUserRole: 'customer' | 'admin'
  maintenanceMode: boolean
}

export default function SystemSetupWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showSensitive, setShowSensitive] = useState({
    anonKey: false,
    serviceKey: false,
    password: false,
    confirmPassword: false
  })
  
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    db_url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    db_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    db_service_key: '',
    db_connection_pool_size: 10,
    db_query_timeout: 30,
    db_max_connections: 100,
    db_idle_timeout: 300,
    db_backup_enabled: true,
    db_backup_frequency: 'daily',
    db_backup_retention_days: 30,
    db_monitoring_enabled: true,
    db_slow_query_threshold: 1000,
    low_stock_alert: 5,
    cart_cleanup_days: 30
  })
  
  const [adminAccount, setAdminAccount] = useState<AdminAccount>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '系统管理员'
  })
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'TN-SCXD-5.0',
    siteDescription: '专业的系统开发模板',
    allowUserRegistration: true,
    requireEmailVerification: false,
    defaultUserRole: 'customer',
    maintenanceMode: false
  })

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: '数据库配置',
      description: '配置数据库连接和性能参数',
      icon: Database,
      completed: false,
      required: true
    },
    {
      id: 'admin',
      title: '管理员账户',
      description: '创建系统管理员账户',
      icon: User,
      completed: false,
      required: true
    },
    {
      id: 'system',
      title: '系统设置',
      description: '配置系统基本参数',
      icon: Settings,
      completed: false,
      required: false
    },
    {
      id: 'complete',
      title: '完成设置',
      description: '确认配置并启动系统',
      icon: Check,
      completed: false,
      required: true
    }
  ])

  const supabase = createSupabaseClient()
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      // 检查数据库连接
      const { data: dbTest } = await supabase.from('settings').select('count').limit(1)
      if (dbTest !== null) {
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
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', [
          'db_service_key',
          'db_connection_pool_size',
          'db_query_timeout',
          'db_max_connections',
          'db_idle_timeout',
          'db_backup_enabled',
          'db_backup_frequency',
          'db_backup_retention_days',
          'db_monitoring_enabled',
          'db_slow_query_threshold',
          'low_stock_alert',
          'cart_cleanup_days'
        ] as DbSettingKey[])

      if (settingsError) {
        console.error('加载配置失败:', settingsError)
        toast.error('加载配置失败')
        return
      }

      if (settings && settings.length > 0) {
        const newConfig = { ...dbConfig }
        
        settings.forEach(setting => {
          const key = setting.key as DbSettingKey
          const value = setting.value
          
          switch (key) {
            case 'db_backup_enabled':
            case 'db_monitoring_enabled':
              (newConfig as any)[key] = value === 'true'
              break
            case 'db_connection_pool_size':
            case 'db_query_timeout':
            case 'db_max_connections':
            case 'db_idle_timeout':
            case 'db_backup_retention_days':
            case 'db_slow_query_threshold':
            case 'low_stock_alert':
            case 'cart_cleanup_days':
              (newConfig as any)[key] = parseInt(value) || 0
              break
            default:
              (newConfig as any)[key] = value
          }
        })

        setDbConfig(newConfig)
        updateStepStatus('system', true)
      }

      // 检查是否已初始化
      const { data: systemSettings } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['system_initialized'])

      if (systemSettings && systemSettings.length > 0) {
        const systemInitialized = systemSettings.find(s => s.key === 'system_initialized')?.value === 'true'
        if (systemInitialized && adminUser && adminUser.length > 0) {
          toast.success('系统已初始化，正在跳转到管理后台...')
          setTimeout(() => router.push('/admin'), 2000)
          return
        }
      }
    } catch (error) {
      console.error('检查系统状态失败:', error)
    }
  }

  const updateStepStatus = (stepId: string, completed: boolean) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed } : step
    ))
  }

  const validateDatabaseUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.hostname || !parsedUrl.protocol) {
        return '数据库URL格式无效，请输入完整的URL地址'
      }
      return null
    } catch (error) {
      return '数据库URL格式无效，请检查输入'
    }
  }

  const testDatabaseConnection = async () => {
    setTesting(true)
    let retryCount = 0
    const maxRetries = 2
    const retryDelay = 2000 // 2秒延迟

    try {
      // 验证URL格式
      const urlError = validateDatabaseUrl(dbConfig.db_url)
      if (urlError) {
        throw new Error(urlError)
      }

      // 验证anon key格式
      if (!dbConfig.db_anon_key || dbConfig.db_anon_key.length < 20) {
        throw new Error('无效的数据库密钥，请检查anon key是否正确')
      }

      while (retryCount <= maxRetries) {
        try {
          console.log(`尝试连接数据库... 第${retryCount + 1}次`)
          
          // 创建一个新的测试客户端
          const { createTestClient } = await import('@/lib/supabase')
          const testClient = createTestClient(dbConfig.db_url, dbConfig.db_anon_key)
          
          // 使用更简单的健康检查
          const { data, error } = await testClient
            .from('settings')
            .select('count')
            .limit(1)
            .timeout(5000)

          if (error) {
            console.error(`第${retryCount + 1}次连接尝试失败:`, error.message)
            throw error
          }

          // 连接成功
          console.log('数据库连接测试成功!')
          toast.success('数据库连接测试成功！')
          return true

        } catch (error) {
          retryCount++
          if (retryCount <= maxRetries) {
            console.log(`等待${retryDelay/1000}秒后重试...`)
            await new Promise(resolve => setTimeout(resolve, retryDelay))
          } else {
            throw new Error(`数据库连接失败 (已重试${maxRetries}次): ${error.message}`)
          }
        }
      }
    } catch (error) {
      console.error('数据库连接测试失败:', error)
      toast.error(error.message)
      return false
    } finally {
      setTesting(false)
    }
  }

  const saveDatabaseConfig = async () => {
    try {
      const configEntries = [
        { key: 'db_service_key', value: dbConfig.db_service_key, category: 'database', description: 'Supabase服务角色密钥', data_type: 'string', is_public: false },
        { key: 'db_connection_pool_size', value: dbConfig.db_connection_pool_size.toString(), category: 'database', description: '连接池大小', data_type: 'number', is_public: false },
        { key: 'db_query_timeout', value: dbConfig.db_query_timeout.toString(), category: 'database', description: '查询超时时间', data_type: 'number', is_public: false },
        { key: 'db_backup_enabled', value: 'true', category: 'database', description: '启用数据库备份', data_type: 'boolean', is_public: false },
        { key: 'db_monitoring_enabled', value: 'true', category: 'database', description: '启用数据库监控', data_type: 'boolean', is_public: false }
      ]

      // 保存所有配置项
      for (const config of configEntries) {
        await supabase
          .from('settings')
          .upsert({
            ...config,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' })
      }

      // 获取最新的配置
      const { data: currentSettings, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', [
          'db_service_key',
          'db_connection_pool_size',
          'db_query_timeout',
          'db_max_connections',
          'db_idle_timeout',
          'db_backup_enabled',
          'db_backup_frequency',
          'db_backup_retention_days',
          'db_monitoring_enabled',
          'db_slow_query_threshold',
          'low_stock_alert',
          'cart_cleanup_days'
        ] as DbSettingKey[])

      if (error) {
        console.error('获取配置失败:', error)
        return
      }

      if (currentSettings && currentSettings.length > 0) {
        const newConfig = { ...dbConfig }
        
        currentSettings.forEach(setting => {
          const key = setting.key as DbSettingKey
          const value = setting.value
          
          switch (key) {
            case 'db_backup_enabled':
            case 'db_monitoring_enabled':
              (newConfig as any)[key] = value === 'true'
              break
            case 'db_connection_pool_size':
            case 'db_query_timeout':
            case 'db_max_connections':
            case 'db_idle_timeout':
            case 'db_backup_retention_days':
            case 'db_slow_query_threshold':
            case 'low_stock_alert':
            case 'cart_cleanup_days':
              (newConfig as any)[key] = parseInt(value) || 0
              break
            default:
              (newConfig as any)[key] = value
          }
        })

        setDbConfig(newConfig)
      }

    } catch (error) {
      console.error('保存数据库配置失败:', error)
      throw error
    }
  }

  const createAdminAccount = async () => {
    if (adminAccount.password !== adminAccount.confirmPassword) {
      toast.error('密码确认不匹配')
      return
    }

    if (adminAccount.password.length < 6) {
      toast.error('密码至少需要6个字符')
      return
    }

    setLoading(true)
    try {
      // 创建认证用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminAccount.email,
        password: adminAccount.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // 创建用户资料
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: adminAccount.email,
            full_name: adminAccount.fullName,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (profileError) throw profileError

        updateStepStatus('admin', true)
        toast.success('管理员账户创建成功！')
      }

    } catch (error: any) {
      console.error('创建管理员账户失败:', error)
      if (error.code === '23505') {
        toast.error('该邮箱已被使用')
      } else {
        toast.error(`创建失败: ${error.message || '未知错误'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const saveSystemSettings = async () => {
    setLoading(true)
    try {
      const settingsEntries = [
        { key: 'site_name', value: systemSettings.siteName, category: 'general', description: '网站名称', data_type: 'string', is_public: true },
        { key: 'site_description', value: systemSettings.siteDescription, category: 'general', description: '网站描述', data_type: 'string', is_public: true },
        { key: 'allow_user_registration', value: systemSettings.allowUserRegistration.toString(), category: 'user', description: '允许用户注册', data_type: 'boolean', is_public: true },
        { key: 'require_email_verification', value: systemSettings.requireEmailVerification.toString(), category: 'user', description: '需要邮箱验证', data_type: 'boolean', is_public: false },
        { key: 'default_user_role', value: systemSettings.defaultUserRole, category: 'user', description: '默认用户角色', data_type: 'string', is_public: false },
        { key: 'maintenance_mode', value: systemSettings.maintenanceMode.toString(), category: 'system', description: '维护模式', data_type: 'boolean', is_public: false },
        { key: 'admin_email', value: adminAccount.email, category: 'admin', description: '管理员邮箱', data_type: 'string', is_public: false },
        { key: 'setup_date', value: new Date().toISOString(), category: 'system', description: '系统初始化时间', data_type: 'string', is_public: false }
      ]

      for (const setting of settingsEntries) {
        await supabase
          .from('settings')
          .upsert({
            ...setting,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' })
      }

      updateStepStatus('system', true)
      toast.success('系统设置保存成功！')

    } catch (error) {
      console.error('保存系统设置失败:', error)
      toast.error('保存系统设置失败')
    } finally {
      setLoading(false)
    }
  }

  const completeSetup = async () => {
    setLoading(true)
    try {
      // 标记系统为已初始化
      await supabase
        .from('settings')
        .upsert({
          key: 'system_initialized',
          value: 'true',
          category: 'system',
          description: '系统是否已初始化',
          data_type: 'boolean',
          is_public: false,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' })

      updateStepStatus('complete', true)
      toast.success('系统初始化完成！正在跳转到登录页面...')
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (error) {
      console.error('完成系统设置失败:', error)
      toast.error('完成系统设置失败')
    } finally {
      setLoading(false)
    }
  }

  const toggleSensitiveField = (field: keyof typeof showSensitive) => {
    setShowSensitive(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    const step = steps[currentStep]
    if (step.required && !step.completed) {
      return false
    }
    return true
  }

  const renderDatabaseStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Database className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">数据库配置</h3>
            <p className="mt-1 text-sm text-blue-700">
              配置数据库连接参数和性能设置。URL和匿名密钥从环境变量读取。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">数据库URL</label>
          <input
            type="text"
            value={dbConfig.db_url}
            onChange={(e) => setDbConfig(prev => ({ ...prev, db_url: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="https://your-project.supabase.co"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? '从环境变量预填充，可手动修改' : '请输入Supabase项目URL'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">匿名密钥</label>
          <div className="mt-1 relative">
            <input
              type={showSensitive.anonKey ? 'text' : 'password'}
              value={dbConfig.db_anon_key}
              onChange={(e) => setDbConfig(prev => ({ ...prev, db_anon_key: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
            />
            <button
              type="button"
              onClick={() => toggleSensitiveField('anonKey')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showSensitive.anonKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '从环境变量预填充，可手动修改' : '请输入Supabase匿名密钥'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">服务角色密钥</label>
          <div className="mt-1 relative">
            <input
              type={showSensitive.serviceKey ? 'text' : 'password'}
              value={dbConfig.db_service_key}
              onChange={(e) => setDbConfig(prev => ({ ...prev, db_service_key: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder="输入服务角色密钥"
            />
            <button
              type="button"
              onClick={() => toggleSensitiveField('serviceKey')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showSensitive.serviceKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">用于管理员操作和数据备份</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">连接池大小</label>
            <input
              type="number"
              value={dbConfig.db_connection_pool_size}
              onChange={(e) => setDbConfig(prev => ({ ...prev, db_connection_pool_size: parseInt(e.target.value) || 10 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="1"
              max="50"
            />
            <p className="mt-1 text-xs text-gray-500">推荐: 10-20</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">查询超时(秒)</label>
            <input
              type="number"
              value={dbConfig.db_query_timeout}
              onChange={(e) => setDbConfig(prev => ({ ...prev, db_query_timeout: parseInt(e.target.value) || 30 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="5"
              max="300"
            />
            <p className="mt-1 text-xs text-gray-500">推荐: 30-60</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={testDatabaseConnection}
          disabled={testing || saving || !dbConfig.db_url || !dbConfig.db_anon_key}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              测试连接中...
            </>
          ) : saving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              保存配置中...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              测试连接并保存
            </>
          )}
        </button>
      </div>

      {dbConfig.db_url && dbConfig.db_anon_key && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-700">
            💡 <strong>提示:</strong> 点击"测试连接并保存"按钮来验证数据库配置并保存设置。
          </p>
        </div>
      )}
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
              创建系统第一个管理员账户，用于访问管理后台。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">管理员姓名</label>
          <input
            type="text"
            value={adminAccount.fullName}
            onChange={(e) => setAdminAccount(prev => ({ ...prev, fullName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
          <input
            type="email"
            value={adminAccount.email}
            onChange={(e) => setAdminAccount(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">密码</label>
          <div className="mt-1 relative">
            <input
              type={showSensitive.password ? 'text' : 'password'}
              value={adminAccount.password}
              onChange={(e) => setAdminAccount(prev => ({ ...prev, password: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              required
              minLength={6}
              placeholder="至少6个字符"
            />
            <button
              type="button"
              onClick={() => toggleSensitiveField('password')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showSensitive.password ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">确认密码</label>
          <div className="mt-1 relative">
            <input
              type={showSensitive.confirmPassword ? 'text' : 'password'}
              value={adminAccount.confirmPassword}
              onChange={(e) => setAdminAccount(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              required
              minLength={6}
              placeholder="再次输入密码"
            />
            <button
              type="button"
              onClick={() => toggleSensitiveField('confirmPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showSensitive.confirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={createAdminAccount}
          disabled={loading || !adminAccount.email || !adminAccount.password || adminAccount.password !== adminAccount.confirmPassword}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              创建中...
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              创建管理员
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderSystemStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <Settings className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-800">系统设置</h3>
            <p className="mt-1 text-sm text-purple-700">
              配置系统基本参数和用户管理设置。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">网站名称</label>
          <input
            type="text"
            value={systemSettings.siteName}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">网站描述</label>
          <textarea
            value={systemSettings.siteDescription}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.allowUserRegistration}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, allowUserRegistration: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              允许用户注册
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.requireEmailVerification}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              需要邮箱验证
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.maintenanceMode}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              维护模式
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">默认用户角色</label>
          <select
            value={systemSettings.defaultUserRole}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultUserRole: e.target.value as 'customer' | 'admin' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="customer">普通用户</option>
            <option value="admin">管理员</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSystemSettings}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              保存设置
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-800">完成系统初始化</h3>
            <p className="mt-1 text-sm text-green-700">
              确认所有配置并完成系统初始化。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">配置摘要</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">数据库连接:</span>
            <span className={`text-sm font-medium ${steps[0].completed ? 'text-green-600' : 'text-red-600'}`}>
              {steps[0].completed ? '✓ 已配置' : '✗ 未配置'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">管理员账户:</span>
            <span className={`text-sm font-medium ${steps[1].completed ? 'text-green-600' : 'text-red-600'}`}>
              {steps[1].completed ? '✓ 已创建' : '✗ 未创建'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">系统设置:</span>
            <span className={`text-sm font-medium ${steps[2].completed ? 'text-green-600' : 'text-yellow-600'}`}>
              {steps[2].completed ? '✓ 已配置' : '- 可选'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">网站名称:</span>
            <span className="text-sm font-medium text-gray-900">{systemSettings.siteName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">管理员邮箱:</span>
            <span className="text-sm font-medium text-gray-900">{adminAccount.email}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={completeSetup}
          disabled={loading || !steps[0].completed || !steps[1].completed}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              完成中...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              完成初始化
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDatabaseStep()
      case 1:
        return renderAdminStep()
      case 2:
        return renderSystemStep()
      case 3:
        return renderCompleteStep()
      default:
        return renderDatabaseStep()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">系统初始化向导</h1>
          <p className="mt-2 text-gray-600">
            按照以下步骤完成系统配置和初始化
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index 
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                }`}>
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
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
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 mr-2" })}
              {steps[currentStep].title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>

          {renderStepContent()}
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            上一步
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
} 
} 