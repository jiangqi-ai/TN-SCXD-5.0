'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { 
  Database, 
  Settings, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
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

export default function DatabaseConfigPage() {
  const [config, setConfig] = useState<DatabaseConfig>({
    db_url: '',
    db_anon_key: '',
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
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown')
  const [showSensitive, setShowSensitive] = useState({
    url: false,
    anonKey: false,
    serviceKey: false
  })
  
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      
      // 从环境变量获取基础配置
      const envConfig = {
        db_url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        db_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      }
      
      // 从数据库获取其他配置
      const { data: settings, error } = await supabase
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
        console.error('加载配置失败:', error)
        toast.error('加载配置失败')
        return
      }

      // 合并配置
      const dbConfig = { ...config, ...envConfig }
      
      settings?.forEach((setting: any) => {
        const key = setting.key as DbSettingKey
        const value = setting.value
        
        switch (key) {
          case 'db_backup_enabled':
          case 'db_monitoring_enabled':
            (dbConfig as any)[key] = value === 'true'
            break
          case 'db_connection_pool_size':
          case 'db_query_timeout':
          case 'db_max_connections':
          case 'db_idle_timeout':
          case 'db_backup_retention_days':
          case 'db_slow_query_threshold':
          case 'low_stock_alert':
          case 'cart_cleanup_days':
            (dbConfig as any)[key] = parseInt(value) || 0
            break
          default:
            (dbConfig as any)[key] = value
        }
      })

      setConfig(dbConfig)
      
      // 测试连接状态
      await testConnection(false)
      
    } catch (error) {
      console.error('加载配置失败:', error)
      toast.error('加载配置失败')
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      setSaving(true)
      
      // 准备要保存的配置（排除环境变量）
      const settingsToSave = [
        { key: 'db_service_key', value: config.db_service_key, category: 'database', description: 'Supabase服务角色密钥' },
        { key: 'db_connection_pool_size', value: config.db_connection_pool_size.toString(), category: 'database', description: '连接池大小' },
        { key: 'db_query_timeout', value: config.db_query_timeout.toString(), category: 'database', description: '查询超时时间（秒）' },
        { key: 'db_max_connections', value: config.db_max_connections.toString(), category: 'database', description: '最大连接数' },
        { key: 'db_idle_timeout', value: config.db_idle_timeout.toString(), category: 'database', description: '空闲超时时间（秒）' },
        { key: 'db_backup_enabled', value: config.db_backup_enabled.toString(), category: 'database', description: '启用自动备份' },
        { key: 'db_backup_frequency', value: config.db_backup_frequency, category: 'database', description: '备份频率' },
        { key: 'db_backup_retention_days', value: config.db_backup_retention_days.toString(), category: 'database', description: '备份保留天数' },
        { key: 'db_monitoring_enabled', value: config.db_monitoring_enabled.toString(), category: 'database', description: '启用监控' },
        { key: 'db_slow_query_threshold', value: config.db_slow_query_threshold.toString(), category: 'database', description: '慢查询阈值（毫秒）' },
        { key: 'low_stock_alert', value: config.low_stock_alert.toString(), category: 'inventory', description: '低库存预警数量' },
        { key: 'cart_cleanup_days', value: config.cart_cleanup_days.toString(), category: 'cleanup', description: '购物车清理天数' }
      ]

      // 批量保存配置
      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            ...setting,
            data_type: typeof setting.value === 'string' && (setting.value === 'true' || setting.value === 'false') ? 'boolean' : 
                      isNaN(Number(setting.value)) ? 'string' : 'number',
            is_public: false,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'key' 
          })

        if (error) {
          throw error
        }
      }

      toast.success('配置保存成功！')
      
    } catch (error) {
      console.error('保存配置失败:', error)
      toast.error('保存配置失败')
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async (showToast = true) => {
    try {
      setTesting(true)
      
      // 测试数据库连接
      const { data, error } = await supabase
        .from('settings')
        .select('count')
        .limit(1)

      if (error) {
        throw error
      }

      setConnectionStatus('success')
      if (showToast) {
        toast.success('数据库连接测试成功！')
      }
      
    } catch (error) {
      console.error('数据库连接测试失败:', error)
      setConnectionStatus('error')
      if (showToast) {
        toast.error('数据库连接测试失败')
      }
    } finally {
      setTesting(false)
    }
  }

  const handleInputChange = (key: keyof DatabaseConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleSensitiveField = (field: keyof typeof showSensitive) => {
    setShowSensitive(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">数据库配置</h1>
            <p className="mt-2 text-sm text-gray-700">
              管理数据库连接、性能和备份设置
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            <button
              type="button"
              onClick={() => testConnection(true)}
              disabled={testing}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              测试连接
            </button>
            <button
              type="button"
              onClick={saveConfig}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              保存配置
            </button>
          </div>
        </div>

        {/* 连接状态 */}
        <div className="mt-6">
          <div className={`rounded-md p-4 ${
            connectionStatus === 'success' ? 'bg-green-50 border border-green-200' :
            connectionStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {connectionStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : connectionStatus === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <Database className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  connectionStatus === 'success' ? 'text-green-800' :
                  connectionStatus === 'error' ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  数据库连接状态: {
                    connectionStatus === 'success' ? '正常' :
                    connectionStatus === 'error' ? '异常' :
                    '未知'
                  }
                </h3>
                <div className={`mt-2 text-sm ${
                  connectionStatus === 'success' ? 'text-green-700' :
                  connectionStatus === 'error' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {connectionStatus === 'success' ? 
                    '数据库连接正常，所有功能可用。' :
                    connectionStatus === 'error' ?
                    '数据库连接失败，请检查配置参数。' :
                    '点击"测试连接"按钮检查数据库状态。'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {/* 连接配置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                连接配置
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    数据库URL
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showSensitive.url ? 'text' : 'password'}
                      value={config.db_url}
                      onChange={(e) => handleInputChange('db_url', e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                      placeholder="https://your-project.supabase.co"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => toggleSensitiveField('url')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showSensitive.url ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">从环境变量读取，无法修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    匿名密钥
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showSensitive.anonKey ? 'text' : 'password'}
                      value={config.db_anon_key}
                      onChange={(e) => handleInputChange('db_anon_key', e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                      readOnly
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
                  <p className="mt-2 text-sm text-gray-500">从环境变量读取，无法修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    服务角色密钥
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showSensitive.serviceKey ? 'text' : 'password'}
                      value={config.db_service_key}
                      onChange={(e) => handleInputChange('db_service_key', e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
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
                  <p className="mt-2 text-sm text-gray-500">用于管理员操作和数据备份</p>
                </div>
              </div>
            </div>
          </div>

          {/* 性能配置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                性能配置
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    连接池大小
                  </label>
                  <input
                    type="number"
                    value={config.db_connection_pool_size}
                    onChange={(e) => handleInputChange('db_connection_pool_size', parseInt(e.target.value) || 0)}
                    className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    min="1"
                    max="50"
                  />
                  <p className="mt-2 text-sm text-gray-500">推荐值: 10-20</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    查询超时时间（秒）
                  </label>
                  <input
                    type="number"
                    value={config.db_query_timeout}
                    onChange={(e) => handleInputChange('db_query_timeout', parseInt(e.target.value) || 0)}
                    className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    min="5"
                    max="300"
                  />
                  <p className="mt-2 text-sm text-gray-500">推荐值: 30-60</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    最大连接数
                  </label>
                  <input
                    type="number"
                    value={config.db_max_connections}
                    onChange={(e) => handleInputChange('db_max_connections', parseInt(e.target.value) || 0)}
                    className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    min="10"
                    max="500"
                  />
                  <p className="mt-2 text-sm text-gray-500">推荐值: 100-200</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    空闲超时时间（秒）
                  </label>
                  <input
                    type="number"
                    value={config.db_idle_timeout}
                    onChange={(e) => handleInputChange('db_idle_timeout', parseInt(e.target.value) || 0)}
                    className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    min="60"
                    max="3600"
                  />
                  <p className="mt-2 text-sm text-gray-500">推荐值: 300-600</p>
                </div>
              </div>
            </div>
          </div>

          {/* 备份配置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                备份配置
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.db_backup_enabled}
                    onChange={(e) => handleInputChange('db_backup_enabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 block text-sm font-medium text-gray-700">
                    启用自动备份
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      备份频率
                    </label>
                    <select
                      value={config.db_backup_frequency}
                      onChange={(e) => handleInputChange('db_backup_frequency', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="hourly">每小时</option>
                      <option value="daily">每天</option>
                      <option value="weekly">每周</option>
                      <option value="monthly">每月</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      备份保留天数
                    </label>
                    <input
                      type="number"
                      value={config.db_backup_retention_days}
                      onChange={(e) => handleInputChange('db_backup_retention_days', parseInt(e.target.value) || 0)}
                      className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      min="1"
                      max="365"
                    />
                    <p className="mt-2 text-sm text-gray-500">推荐值: 30-90天</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 监控和清理配置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                监控和清理配置
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.db_monitoring_enabled}
                    onChange={(e) => handleInputChange('db_monitoring_enabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 block text-sm font-medium text-gray-700">
                    启用数据库监控
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      慢查询阈值（毫秒）
                    </label>
                    <input
                      type="number"
                      value={config.db_slow_query_threshold}
                      onChange={(e) => handleInputChange('db_slow_query_threshold', parseInt(e.target.value) || 0)}
                      className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      min="100"
                      max="10000"
                    />
                    <p className="mt-2 text-sm text-gray-500">推荐值: 1000-3000毫秒</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      低库存预警数量
                    </label>
                    <input
                      type="number"
                      value={config.low_stock_alert}
                      onChange={(e) => handleInputChange('low_stock_alert', parseInt(e.target.value) || 0)}
                      className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      min="1"
                      max="100"
                    />
                    <p className="mt-2 text-sm text-gray-500">推荐值: 5-20</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      购物车清理天数
                    </label>
                    <input
                      type="number"
                      value={config.cart_cleanup_days}
                      onChange={(e) => handleInputChange('cart_cleanup_days', parseInt(e.target.value) || 0)}
                      className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      min="1"
                      max="365"
                    />
                    <p className="mt-2 text-sm text-gray-500">推荐值: 30-90天</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 