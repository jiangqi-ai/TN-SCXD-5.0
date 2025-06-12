'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Shield, Database, Users, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: string
}

export default function SupabaseDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [testing, setTesting] = useState(false)
  const [config, setConfig] = useState({
    url: '',
    anonKey: ''
  })

  const runDiagnostics = async () => {
    setTesting(true)
    const testResults: DiagnosticResult[] = []

    try {
      // 1. 检查环境变量
      const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (envUrl && envAnonKey) {
        testResults.push({
          test: '环境变量检查',
          status: 'success',
          message: '环境变量配置正确',
          details: `URL: ${envUrl}`
        })
        setConfig({ url: envUrl, anonKey: envAnonKey })
      } else {
        testResults.push({
          test: '环境变量检查',
          status: 'error',
          message: '环境变量缺失',
          details: '请检查 .env.local 文件中的 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
        })
      }

      // 2. URL格式检查
      const testUrl = config.url || envUrl
      if (testUrl) {
        if (testUrl.includes('.supabase.co')) {
          testResults.push({
            test: 'URL格式检查',
            status: 'success',
            message: 'URL格式正确'
          })
        } else {
          testResults.push({
            test: 'URL格式检查',
            status: 'error',
            message: 'URL格式不正确',
            details: 'URL应该类似 https://your-project.supabase.co'
          })
        }
      }

      // 3. 网络连接测试
      try {
        const response = await fetch(`${testUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': config.anonKey || envAnonKey || '',
            'Authorization': `Bearer ${config.anonKey || envAnonKey || ''}`
          }
        })

        if (response.ok) {
          testResults.push({
            test: '网络连接测试',
            status: 'success',
            message: 'Supabase服务器可达'
          })
        } else {
          testResults.push({
            test: '网络连接测试',
            status: 'error',
            message: `连接失败 (${response.status})`,
            details: response.statusText
          })
        }
      } catch (error: any) {
        testResults.push({
          test: '网络连接测试',
          status: 'error',
          message: '网络连接失败',
          details: error.message
        })
      }

      // 4. 认证服务测试
      if (testUrl && (config.anonKey || envAnonKey)) {
        try {
          const supabase = createClient(testUrl, config.anonKey || envAnonKey || '')
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            testResults.push({
              test: '认证服务测试',
              status: 'warning',
              message: '认证服务响应异常',
              details: error.message
            })
          } else {
            testResults.push({
              test: '认证服务测试',
              status: 'success',
              message: '认证服务正常'
            })
          }
        } catch (error: any) {
          testResults.push({
            test: '认证服务测试',
            status: 'error',
            message: '认证服务测试失败',
            details: error.message
          })
        }
      }

      // 5. 数据库连接测试
      if (testUrl && (config.anonKey || envAnonKey)) {
        try {
          const supabase = createClient(testUrl, config.anonKey || envAnonKey || '')
          
          // 尝试访问一个可能存在的表
          const { data, error } = await supabase
            .from('settings')
            .select('count')
            .limit(1)
          
          if (error) {
            if (error.message.includes('infinite recursion')) {
              testResults.push({
                test: '数据库连接测试',
                status: 'error',
                message: '权限策略递归错误',
                details: '请执行 database/fix-policies.sql 修复权限策略'
              })
            } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
              testResults.push({
                test: '数据库连接测试',
                status: 'warning',
                message: '数据库表不存在',
                details: '请执行数据库初始化脚本'
              })
            } else {
              testResults.push({
                test: '数据库连接测试',
                status: 'error',
                message: '数据库访问失败',
                details: error.message
              })
            }
          } else {
            testResults.push({
              test: '数据库连接测试',
              status: 'success',
              message: '数据库连接正常'
            })
          }
        } catch (error: any) {
          testResults.push({
            test: '数据库连接测试',
            status: 'error',
            message: '数据库测试失败',
            details: error.message
          })
        }
      }

    } catch (error: any) {
      testResults.push({
        test: '诊断过程',
        status: 'error',
        message: '诊断过程出错',
        details: error.message
      })
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Supabase 配置诊断</h1>
          <p className="mt-2 text-lg text-gray-600">
            检查 Supabase 配置和连接状态
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">手动配置测试</h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Supabase URL</label>
              <input
                type="text"
                value={config.url}
                onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="https://your-project.supabase.co"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anon Key</label>
              <input
                type="password"
                value={config.anonKey}
                onChange={(e) => setConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="eyJhbGciOiJIUzI1NiI..."
              />
            </div>
          </div>
          
          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {testing ? '诊断中...' : '开始诊断'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">诊断结果</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start">
                    {getStatusIcon(result.status)}
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {result.test}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="mt-2 text-xs text-gray-500 font-mono">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 修复建议 */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">修复建议</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 如果环境变量缺失，请创建 .env.local 文件</li>
                <li>• 如果出现权限策略递归错误，请执行 database/fix-policies.sql</li>
                <li>• 如果数据库表不存在，请执行完整的数据库初始化脚本</li>
                <li>• 如果网络连接失败，请检查 Supabase 项目状态</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 