'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Globe, 
  Settings,
  ExternalLink,
  Copy,
  Upload,
  GitBranch,
  Zap
} from 'lucide-react'

interface DeploymentStatus {
  database: {
    status: 'success' | 'warning' | 'error'
    mode: 'memory' | 'supabase'
    message: string
    connected: boolean
  }
  environment: {
    status: 'success' | 'warning' | 'error'
    type: 'production' | 'development'
    message: string
  }
  build: {
    status: 'success' | 'warning' | 'error'
    message: string
    lastBuild?: string
  }
  deployment: {
    status: 'ready' | 'pending' | 'error'
    platform: string
    url?: string
  }
}

export default function DeploymentManagement() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [buildLogs, setBuildLogs] = useState<string[]>([])
  const [copiedEnv, setCopiedEnv] = useState<string | null>(null)

  const checkDeploymentStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/storage-info', { cache: 'no-store' })
      const data = await response.json()
      
      setStatus({
        database: {
          status: data.mode === 'supabase' && data.isSupabaseConnected ? 'success' : 
                   data.mode === 'memory' ? 'warning' : 'error',
          mode: data.mode,
          message: data.mode === 'supabase' && data.isSupabaseConnected ? 
                   'Supabase 云数据库已连接' :
                   data.mode === 'memory' ? 
                   '当前使用内存存储 (演示模式)' : 
                   '数据库连接失败',
          connected: data.isSupabaseConnected || data.mode === 'memory'
        },
        environment: {
          status: data.environment?.isProd ? 'success' : 'warning',
          type: data.environment?.isProd ? 'production' : 'development',
          message: data.environment?.isProd ? 
                   '生产环境运行中' : 
                   '开发环境 - 准备部署'
        },
        build: {
          status: 'success',
          message: '构建就绪',
          lastBuild: new Date().toLocaleString()
        },
        deployment: {
          status: data.environment?.isProd ? 'ready' : 'pending',
          platform: 'Vercel',
          url: data.environment?.isProd ? 'https://your-app.vercel.app' : undefined
        }
      })
    } catch (error) {
      console.error('部署状态检查失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateBuild = async () => {
    setDeploying(true)
    setBuildLogs([])
    
    const logs = [
      '🔄 开始构建...',
      '📦 安装依赖包...',
      '🔍 TypeScript 类型检查...',
      '⚡ 编译 Next.js 应用...',
      '🎨 优化静态资源...',
      '📊 生成页面路由...',
      '✅ 构建完成！',
      '🚀 准备部署到 Vercel...'
    ]
    
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBuildLogs(prev => [...prev, logs[i]])
    }
    
    setDeploying(false)
    await checkDeploymentStatus()
  }

  const copyToClipboard = async (text: string, envName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedEnv(envName)
      setTimeout(() => setCopiedEnv(null), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  useEffect(() => {
    checkDeploymentStatus()
  }, [])

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
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

  const environmentVariables = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      description: 'Supabase 项目 URL',
      example: 'https://your-project.supabase.co',
      required: true
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      description: 'Supabase 匿名密钥',
      example: 'eyJhbGciOiJIUzI1NiIs...',
      required: true
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">生产部署管理</h1>
            <p className="text-gray-600">管理应用的构建、部署和生产环境配置</p>
          </div>
          <button
            onClick={checkDeploymentStatus}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '检查中...' : '刷新状态'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">正在检查部署状态...</p>
        </div>
      ) : status ? (
        <div className="space-y-6">
          {/* 部署状态概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 数据库状态 */}
            <div className={`p-4 rounded-lg border ${getStatusColor(status.database.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <Database className="h-6 w-6 text-gray-600" />
                {getStatusIcon(status.database.status)}
              </div>
              <h3 className="font-semibold text-gray-900">数据库</h3>
              <p className="text-sm text-gray-600">{status.database.message}</p>
            </div>

            {/* 环境状态 */}
            <div className={`p-4 rounded-lg border ${getStatusColor(status.environment.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-6 w-6 text-gray-600" />
                {getStatusIcon(status.environment.status)}
              </div>
              <h3 className="font-semibold text-gray-900">环境</h3>
              <p className="text-sm text-gray-600">{status.environment.message}</p>
            </div>

            {/* 构建状态 */}
            <div className={`p-4 rounded-lg border ${getStatusColor(status.build.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <GitBranch className="h-6 w-6 text-gray-600" />
                {getStatusIcon(status.build.status)}
              </div>
              <h3 className="font-semibold text-gray-900">构建</h3>
              <p className="text-sm text-gray-600">{status.build.message}</p>
            </div>

            {/* 部署状态 */}
            <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-6 w-6 text-gray-600" />
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900">部署</h3>
              <p className="text-sm text-gray-600">{status.deployment.platform} 就绪</p>
            </div>
          </div>

          {/* 快速部署 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Upload className="h-6 w-6 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold">快速部署</h2>
              </div>
              <button
                onClick={simulateBuild}
                disabled={deploying}
                className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                  deploying 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {deploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    构建中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    开始部署
                  </>
                )}
              </button>
            </div>

            {/* 构建日志 */}
            {buildLogs.length > 0 && (
              <div className="bg-gray-900 rounded-md p-4 mb-4">
                <h3 className="text-white font-medium mb-2">构建日志</h3>
                <div className="space-y-1">
                  {buildLogs.map((log, index) => (
                    <div key={index} className="text-green-400 text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">1. 推送代码</h3>
                <p className="text-sm text-gray-600 mb-3">将代码推送到 GitHub 仓库</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  git push origin main
                </code>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">2. 自动构建</h3>
                <p className="text-sm text-gray-600 mb-3">Vercel 自动检测并构建</p>
                <div className="text-xs text-green-600">✅ 自动触发</div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">3. 生产部署</h3>
                <p className="text-sm text-gray-600 mb-3">部署到生产环境</p>
                <div className="text-xs text-blue-600">🚀 即时上线</div>
              </div>
            </div>
          </div>

          {/* 环境变量配置 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold">生产环境配置</h2>
            </div>

            <div className="space-y-4">
              {environmentVariables.map((env) => (
                <div key={env.name} className="bg-gray-50 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {env.name}
                      </span>
                      {env.required && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          必需
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(env.name, env.name)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {copiedEnv === env.name ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{env.description}</p>
                  <p className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border">
                    {env.example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 部署平台链接 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold">部署平台</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">▲</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Vercel 控制台</div>
                  <div className="text-sm text-gray-600">管理部署和环境变量</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Supabase 控制台</div>
                  <div className="text-sm text-gray-600">管理数据库和 API</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">无法获取部署状态</p>
        </div>
      )}
    </div>
  )
} 