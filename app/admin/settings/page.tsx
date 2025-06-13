'use client'

import { useState, useEffect } from 'react'
import { Database, Server, Wifi, WifiOff, Settings, Info, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface StorageInfo {
  mode: 'memory' | 'supabase'
  isSupabaseConfigured: boolean
  isSupabaseConnected: boolean
  message: string
}

export default function AdminSettings() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedEnv, setCopiedEnv] = useState<string | null>(null)

  useEffect(() => {
    fetchStorageInfo()
  }, [])

  const fetchStorageInfo = async () => {
    try {
      const response = await fetch('/api/storage-info')
      const data = await response.json()
      setStorageInfo(data)
    } catch (error) {
      console.error('获取存储信息失败:', error)
    } finally {
      setLoading(false)
    }
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

  const getStorageStatusColor = () => {
    if (!storageInfo) return 'bg-gray-100'
    if (storageInfo.mode === 'supabase' && storageInfo.isSupabaseConnected) {
      return 'bg-green-100 border-green-200'
    }
    if (storageInfo.mode === 'memory') {
      return 'bg-yellow-100 border-yellow-200'
    }
    return 'bg-red-100 border-red-200'
  }

  const getStorageIcon = () => {
    if (!storageInfo) return <Database className="h-5 w-5" />
    if (storageInfo.mode === 'supabase' && storageInfo.isSupabaseConnected) {
      return <Server className="h-5 w-5 text-green-600" />
    }
    if (storageInfo.mode === 'memory') {
      return <Database className="h-5 w-5 text-yellow-600" />
    }
    return <Database className="h-5 w-5 text-red-600" />
  }

  const getConnectivityIcon = () => {
    if (!storageInfo) return <Wifi className="h-4 w-4" />
    return storageInfo.isSupabaseConnected ? 
      <Wifi className="h-4 w-4 text-green-600" /> : 
      <WifiOff className="h-4 w-4 text-red-600" />
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
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      description: 'Supabase 服务角色密钥（可选）',
      example: 'eyJhbGciOiJIUzI1NiIs...',
      required: false
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">系统设置</h1>
        <p className="text-gray-600">管理系统配置和数据库部署</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 当前存储状态 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">存储状态</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">检测中...</p>
            </div>
          ) : storageInfo ? (
            <div className={`p-4 rounded-lg border ${getStorageStatusColor()}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getStorageIcon()}
                  <span className="ml-2 font-medium">
                    {storageInfo.mode === 'supabase' ? 'Supabase 云存储' : '内存存储'}
                  </span>
                </div>
                {getConnectivityIcon()}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">存储模式:</span>
                  <span className="font-medium">
                    {storageInfo.mode === 'supabase' ? '云端数据库' : '本地内存'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">配置状态:</span>
                  <span className={`font-medium ${
                    storageInfo.isSupabaseConfigured ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {storageInfo.isSupabaseConfigured ? '已配置' : '未配置'}
                  </span>
                </div>

                {storageInfo.mode === 'supabase' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">连接状态:</span>
                    <span className={`font-medium ${
                      storageInfo.isSupabaseConnected ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {storageInfo.isSupabaseConnected ? '已连接' : '连接失败'}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-600">{storageInfo.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              <p>无法获取存储信息</p>
            </div>
          )}

          {storageInfo && storageInfo.mode === 'memory' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">演示模式</p>
                  <p className="text-yellow-700 mt-1">
                    当前使用内存存储，数据在重启后丢失。配置数据库以获得持久化存储。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 数据库配置 */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold">生产数据库配置</h2>
            </div>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              创建 Supabase 项目
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>

          {/* 配置步骤 */}
          <div className="space-y-6">
            {/* 步骤 1: 创建数据库项目 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900">创建 Supabase 项目</h3>
              </div>
              <div className="ml-9">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>访问 <a href="https://supabase.com" className="text-blue-600 hover:underline">supabase.com</a> 并注册账户</li>
                  <li>点击 "New Project" 创建新项目</li>
                  <li>选择组织，输入项目名称和密码</li>
                  <li>选择离用户最近的数据库区域</li>
                  <li>等待项目创建完成（约 2 分钟）</li>
                </ol>
              </div>
            </div>

            {/* 步骤 2: 获取配置信息 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900">获取数据库配置</h3>
              </div>
              <div className="ml-9">
                <p className="text-sm text-gray-600 mb-3">
                  在 Supabase 项目控制台的 Settings → API 页面获取以下信息：
                </p>
                <div className="space-y-3">
                  {environmentVariables.map((env) => (
                    <div key={env.name} className="bg-gray-50 rounded-md p-3">
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
                      <p className="text-sm text-gray-600 mb-1">{env.description}</p>
                      <p className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border">
                        {env.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 步骤 3: 初始化数据库 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900">初始化数据库架构</h3>
              </div>
              <div className="ml-9">
                <p className="text-sm text-gray-600 mb-3">
                  在 Supabase 项目的 SQL Editor 中运行初始化脚本：
                </p>
                <div className="bg-gray-900 rounded-md p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">supabase-schema.sql</span>
                    <button
                      onClick={() => copyToClipboard('复制项目根目录的 supabase-schema.sql 文件内容', 'schema')}
                      className="flex items-center text-gray-400 hover:text-white"
                    >
                      {copiedEnv === 'schema' ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-300">
                    -- 复制项目根目录 supabase-schema.sql 文件内容
                    <br />-- 在 Supabase SQL Editor 中执行
                  </p>
                </div>
              </div>
            </div>

            {/* 步骤 4: 部署配置 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  4
                </div>
                <h3 className="font-semibold text-gray-900">配置生产环境</h3>
              </div>
              <div className="ml-9">
                <div className="space-y-4">
                  {/* Vercel 部署 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <h4 className="font-medium text-blue-900 mb-2">Vercel 部署</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>在 Vercel 控制台选择您的项目</li>
                      <li>进入 Settings → Environment Variables</li>
                      <li>添加上述环境变量及其对应值</li>
                      <li>重新部署项目以应用更改</li>
                    </ol>
                  </div>

                  {/* 本地开发 */}
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <h4 className="font-medium text-green-900 mb-2">本地开发环境</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                      <li>在项目根目录创建 <code className="bg-green-100 px-1 rounded">.env.local</code> 文件</li>
                      <li>添加环境变量（不要提交到 Git）</li>
                      <li>重启开发服务器：<code className="bg-green-100 px-1 rounded">npm run dev</code></li>
                    </ol>
                  </div>

                  {/* Docker 部署 */}
                  <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                    <h4 className="font-medium text-purple-900 mb-2">Docker 部署</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-purple-800">
                      <li>在 docker-compose.yml 中配置环境变量</li>
                      <li>或使用 <code className="bg-purple-100 px-1 rounded">.env</code> 文件</li>
                      <li>重新构建并启动容器</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 验证连接 */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">验证数据库连接</h4>
                <p className="text-sm text-gray-600">配置完成后，刷新本页面检查连接状态</p>
              </div>
              <button
                onClick={fetchStorageInfo}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                重新检测
              </button>
            </div>
          </div>
        </div>

        {/* 系统信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">系统信息</h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-medium text-gray-900 mb-2">应用信息</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">应用名称:</span>
                  <span>攀岩装备在线订购系统</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">版本:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">框架:</span>
                  <span>Next.js 14</span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-medium text-gray-900 mb-2">部署状态</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>智能存储切换</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>零配置部署</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    storageInfo?.mode === 'supabase' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span>生产数据库</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">技术栈</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span>Next.js + TypeScript</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span>Supabase PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">快速链接</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Server className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium">Supabase 控制台</div>
                <div className="text-sm text-gray-600">管理数据库和 API</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
            </a>

            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium">Vercel 控制台</div>
                <div className="text-sm text-gray-600">部署和环境变量</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
            </a>

            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Info className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium">部署文档</div>
                <div className="text-sm text-gray-600">VERCEL_DEPLOYMENT.md</div>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Database className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <div className="font-medium">数据库架构</div>
                <div className="text-sm text-gray-600">supabase-schema.sql</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 