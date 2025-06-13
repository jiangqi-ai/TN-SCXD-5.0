'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Server, Globe, Settings } from 'lucide-react'

interface SystemStatus {
  database: {
    status: 'success' | 'warning' | 'error'
    mode: 'memory' | 'supabase'
    message: string
    connected: boolean
  }
  deployment: {
    status: 'success' | 'warning' | 'error'
    environment: string
    message: string
  }
  api: {
    status: 'success' | 'error'
    message: string
    responseTime: number
  }
  data: {
    products: number
    users: number
    orders: number
  }
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<string>('')

  const checkSystemStatus = async () => {
    setLoading(true)
    const startTime = Date.now()
    
    try {
      // 检查存储信息
      const storageResponse = await fetch('/api/storage-info', { cache: 'no-store' })
      const storageData = await storageResponse.json()
      
      // 检查产品数据
      const productsResponse = await fetch('/api/products', { cache: 'no-store' })
      const productsData = await productsResponse.json()
      
      // 检查用户数据
      const usersResponse = await fetch('/api/users', { cache: 'no-store' })
      const usersData = await usersResponse.json()
      
      // 检查订单数据
      const ordersResponse = await fetch('/api/orders', { cache: 'no-store' })
      const ordersData = await ordersResponse.json()
      
      const responseTime = Date.now() - startTime
      
      const systemStatus: SystemStatus = {
        database: {
          status: storageData.mode === 'supabase' && storageData.isSupabaseConnected ? 'success' : 
                  storageData.mode === 'memory' ? 'warning' : 'error',
          mode: storageData.mode,
          message: storageData.mode === 'supabase' && storageData.isSupabaseConnected ? 
                   '✅ Supabase 云数据库连接正常' :
                   storageData.mode === 'memory' ? 
                   '⚠️ 使用内存存储 (演示模式)' : 
                   '❌ 数据库连接失败',
          connected: storageData.isSupabaseConnected || storageData.mode === 'memory'
        },
        deployment: {
          status: storageData.environment?.isProd ? 'success' : 'warning',
          environment: storageData.environment?.isProd ? '生产环境' : '开发环境',
          message: storageData.environment?.isProd ? 
                   '✅ 已部署到生产环境' : 
                   '⚠️ 当前为开发环境'
        },
        api: {
          status: responseTime < 1000 ? 'success' : 'error',
          message: `✅ API 响应正常 (${responseTime}ms)`,
          responseTime
        },
        data: {
          products: productsData.length || 0,
          users: usersData.length || 0,
          orders: ordersData.length || 0
        }
      }
      
      setStatus(systemStatus)
      setLastCheck(new Date().toLocaleString())
      
    } catch (error) {
      console.error('系统状态检查失败:', error)
      setStatus({
        database: {
          status: 'error',
          mode: 'memory',
          message: '❌ 无法连接到数据库',
          connected: false
        },
        deployment: {
          status: 'error',
          environment: '未知',
          message: '❌ 部署状态检查失败'
        },
        api: {
          status: 'error',
          message: '❌ API 连接失败',
          responseTime: 0
        },
        data: {
          products: 0,
          users: 0,
          orders: 0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">系统状态</h1>
            <p className="text-gray-600">攀岩装备在线订购系统运行状态</p>
          </div>
          <button
            onClick={checkSystemStatus}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '检查中...' : '重新检查'}
          </button>
        </div>
        {lastCheck && (
          <p className="text-sm text-gray-500 mt-2">最后检查: {lastCheck}</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">正在检查系统状态...</p>
        </div>
      ) : status ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 数据库状态 */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.database.status)}`}>
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">数据库连接</h2>
                <p className="text-sm text-gray-600">
                  {status.database.mode === 'supabase' ? 'Supabase 云数据库' : '内存数据库'}
                </p>
              </div>
              {getStatusIcon(status.database.status)}
            </div>
            <p className="text-lg font-medium mb-2">{status.database.message}</p>
            <div className="text-sm text-gray-600">
              <p>存储模式: {status.database.mode === 'supabase' ? '云端存储' : '本地内存'}</p>
              <p>连接状态: {status.database.connected ? '已连接' : '未连接'}</p>
            </div>
          </div>

          {/* 部署状态 */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.deployment.status)}`}>
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">部署状态</h2>
                <p className="text-sm text-gray-600">{status.deployment.environment}</p>
              </div>
              {getStatusIcon(status.deployment.status)}
            </div>
            <p className="text-lg font-medium mb-2">{status.deployment.message}</p>
            <div className="text-sm text-gray-600">
              <p>环境: {status.deployment.environment}</p>
              <p>状态: {status.deployment.status === 'success' ? '生产就绪' : '开发模式'}</p>
            </div>
          </div>

          {/* API 状态 */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(status.api.status)}`}>
            <div className="flex items-center mb-4">
              <Server className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">API 服务</h2>
                <p className="text-sm text-gray-600">后端接口状态</p>
              </div>
              {getStatusIcon(status.api.status)}
            </div>
            <p className="text-lg font-medium mb-2">{status.api.message}</p>
            <div className="text-sm text-gray-600">
              <p>响应时间: {status.api.responseTime}ms</p>
              <p>状态: {status.api.status === 'success' ? '正常运行' : '响应异常'}</p>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="p-6 rounded-lg border-2 bg-blue-50 border-blue-200">
            <div className="flex items-center mb-4">
              <Settings className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">数据统计</h2>
                <p className="text-sm text-gray-600">系统数据概览</p>
              </div>
              <CheckCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.data.products}</div>
                <div className="text-sm text-gray-600">产品</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.data.users}</div>
                <div className="text-sm text-gray-600">用户</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.data.orders}</div>
                <div className="text-sm text-gray-600">订单</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">无法获取系统状态</p>
        </div>
      )}

      {/* 快速操作 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/settings"
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium">系统设置</div>
              <div className="text-sm text-gray-600">配置数据库连接</div>
            </div>
          </a>
          
          <a
            href="/admin"
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Database className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <div className="font-medium">管理后台</div>
              <div className="text-sm text-gray-600">管理产品和订单</div>
            </div>
          </a>
          
          <a
            href="/"
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <div className="font-medium">前台商店</div>
              <div className="text-sm text-gray-600">查看用户界面</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
} 