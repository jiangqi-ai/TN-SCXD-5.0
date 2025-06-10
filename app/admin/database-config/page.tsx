'use client'

import { useState, useEffect } from 'react'
import SupabaseConfigManager, { type DatabaseConfig } from '@/lib/supabase-config'
import { 
  Database, 
  Settings, 
  Key,
  Check,
  AlertCircle,
  Loader,
  RefreshCw,
  Save,
  TestTube,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DatabaseConfigPage() {
  const [config, setConfig] = useState<DatabaseConfig>({
    url: '',
    anonKey: '',
    serviceRoleKey: '',
    connectionPool: 10,
    timeout: 30
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean
    error?: string
  } | null>(null)
  const [showKeys, setShowKeys] = useState({
    anonKey: false,
    serviceRoleKey: false
  })

  useEffect(() => {
    loadCurrentConfig()
    checkCurrentConnection()
  }, [])

  const loadCurrentConfig = () => {
    const currentConfig = SupabaseConfigManager.getConfig()
    if (currentConfig) {
      setConfig(currentConfig)
    }
  }

  const checkCurrentConnection = async () => {
    const status = await SupabaseConfigManager.checkConnection()
    setConnectionStatus(status)
  }

  const handleInputChange = (field: keyof DatabaseConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const status = await SupabaseConfigManager.checkConnection()
      setConnectionStatus(status)
      
      if (status.connected) {
        toast.success('数据库连接测试成功！')
      } else {
        toast.error(`连接测试失败: ${status.error}`)
      }
    } catch (error: any) {
      toast.error(`连接测试失败: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      const success = await SupabaseConfigManager.updateConfig(config)
      
      if (success) {
        toast.success('数据库配置已保存并生效！')
        await checkCurrentConnection()
      } else {
        toast.error('保存配置失败')
      }
    } catch (error: any) {
      toast.error(`保存配置失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const reloadConfig = async () => {
    setLoading(true)
    try {
      await SupabaseConfigManager.reloadConfig()
      loadCurrentConfig()
      await checkCurrentConnection()
      toast.success('配置已重新加载')
    } catch (error: any) {
      toast.error(`重新加载配置失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">数据库配置</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理 Supabase 数据库连接配置和参数
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {connectionStatus && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                connectionStatus.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{connectionStatus.connected ? '已连接' : '连接失败'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 配置状态卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    数据库状态
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {connectionStatus?.connected ? '正常' : '异常'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    连接池大小
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {config.connectionPool}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    超时时间
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {config.timeout}s
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 配置表单 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">连接配置</h2>
          <p className="mt-1 text-sm text-gray-500">
            修改数据库连接参数，保存后立即生效
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* 项目URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              项目 URL
            </label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Supabase 项目的完整 URL 地址
            </p>
          </div>

          {/* 公开密钥 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              公开密钥 (anon key)
            </label>
            <div className="mt-1 relative">
              <input
                value={config.anonKey}
                onChange={(e) => handleInputChange('anonKey', e.target.value)}
                type={showKeys.anonKey ? 'text' : 'password'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKeys(prev => ({ ...prev, anonKey: !prev.anonKey }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKeys.anonKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              用于客户端认证的公开密钥
            </p>
          </div>

          {/* 服务密钥 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              服务密钥 (service_role key)
            </label>
            <div className="mt-1 relative">
              <input
                value={config.serviceRoleKey || ''}
                onChange={(e) => handleInputChange('serviceRoleKey', e.target.value)}
                type={showKeys.serviceRoleKey ? 'text' : 'password'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKeys(prev => ({ ...prev, serviceRoleKey: !prev.serviceRoleKey }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKeys.serviceRoleKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              用于服务端操作的特权密钥（可选）
            </p>
          </div>

          {/* 性能参数 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                连接池大小
              </label>
              <input
                type="number"
                value={config.connectionPool}
                onChange={(e) => handleInputChange('connectionPool', parseInt(e.target.value))}
                min="1"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                同时支持的最大连接数 (1-100)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                超时时间（秒）
              </label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
                min="5"
                max="300"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                数据库操作超时时间 (5-300秒)
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={reloadConfig}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              重新加载
            </button>

            <button
              onClick={testConnection}
              disabled={testing || !config.url || !config.anonKey}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            >
              {testing ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              测试连接
            </button>
          </div>

          <button
            onClick={saveConfig}
            disabled={loading || !config.url || !config.anonKey}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            保存配置
          </button>
        </div>
      </div>

      {/* 连接错误详情 */}
      {connectionStatus && !connectionStatus.connected && connectionStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">连接错误</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{connectionStatus.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 配置说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Database className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">配置说明</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>项目 URL 和公开密钥是必填项，可在 Supabase Dashboard 的 Settings → API 中找到</li>
                <li>服务密钥用于后台管理操作，具有更高权限，请妥善保管</li>
                <li>连接池大小影响并发性能，建议根据应用负载调整</li>
                <li>配置修改后会立即生效，请谨慎操作</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 