'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

export default function DebugPage() {
  const [status, setStatus] = useState<string>('检查中...')
  const [errors, setErrors] = useState<string[]>([])
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const checkStatus = async () => {
      const newErrors: string[] = []

      // 检查环境变量
      const vars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '未设置'
      }
      setEnvVars(vars)

      // 检查 Supabase URL
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        newErrors.push('Supabase URL 无效或未设置')
      }

      // 检查 Supabase 连接
      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)

        if (error) {
          newErrors.push(`Supabase 连接错误: ${error.message}`)
        } else {
          setStatus('✅ Supabase 连接正常')
        }
      } catch (error: any) {
        newErrors.push(`Supabase 初始化失败: ${error.message}`)
      }

      if (newErrors.length > 0) {
        setStatus('❌ 发现问题')
        setErrors(newErrors)
      }
    }

    checkStatus()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">系统诊断</h1>
      
      <div className="space-y-6">
        {/* 状态概览 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">系统状态</h2>
          <p className="text-lg">{status}</p>
        </div>

        {/* 环境变量 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">环境变量</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`text-sm ${value === '未设置' ? 'text-red-600' : 'text-green-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 错误列表 */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">发现的问题</h2>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 解决方案 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">解决方案</h2>
          <div className="space-y-2 text-blue-800">
            <p>1. 确保 Supabase 项目已创建并正在运行</p>
            <p>2. 检查 .env.local 文件中的环境变量是否正确</p>
            <p>3. 确认 Supabase URL 和密钥有效</p>
            <p>4. 刷新页面或重启开发服务器</p>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              刷新页面
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 