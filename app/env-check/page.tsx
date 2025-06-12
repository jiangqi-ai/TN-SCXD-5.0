'use client'

import { useEffect, useState } from 'react'

export default function EnvCheckPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)

  useEffect(() => {
    const checkEnv = () => {
      const status = {
        supabaseUrl: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
            process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : 
            '未设置',
          valid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false
        },
        supabaseKey: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30) + '...' : 
            '未设置',
          valid: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ') || false
        },
        siteUrl: {
          exists: !!process.env.NEXT_PUBLIC_SITE_URL,
          value: process.env.NEXT_PUBLIC_SITE_URL || '未设置',
          valid: true
        }
      }
      setEnvStatus(status)
    }

    checkEnv()
  }, [])

  if (!envStatus) {
    return <div className="p-8">检查中...</div>
  }

  const allValid = envStatus.supabaseUrl.valid && envStatus.supabaseKey.valid

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            🔍 环境变量检查
          </h1>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supabase URL */}
              <div className={`border rounded-lg p-4 ${
                envStatus.supabaseUrl.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-semibold mb-2">SUPABASE_URL</h3>
                <div className={`text-sm ${
                  envStatus.supabaseUrl.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  状态: {envStatus.supabaseUrl.exists ? '✅ 已设置' : '❌ 未设置'}
                </div>
                <div className="text-xs text-gray-600 mt-1 break-all">
                  {envStatus.supabaseUrl.value}
                </div>
                <div className={`text-xs mt-1 ${
                  envStatus.supabaseUrl.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {envStatus.supabaseUrl.valid ? '格式正确' : '格式错误'}
                </div>
              </div>

              {/* Supabase Key */}
              <div className={`border rounded-lg p-4 ${
                envStatus.supabaseKey.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-semibold mb-2">SUPABASE_ANON_KEY</h3>
                <div className={`text-sm ${
                  envStatus.supabaseKey.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  状态: {envStatus.supabaseKey.exists ? '✅ 已设置' : '❌ 未设置'}
                </div>
                <div className="text-xs text-gray-600 mt-1 break-all">
                  {envStatus.supabaseKey.value}
                </div>
                <div className={`text-xs mt-1 ${
                  envStatus.supabaseKey.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {envStatus.supabaseKey.valid ? '格式正确' : '格式错误'}
                </div>
              </div>

              {/* Site URL */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">SITE_URL</h3>
                <div className="text-sm text-blue-700">
                  状态: {envStatus.siteUrl.exists ? '✅ 已设置' : '⚠️ 使用默认'}
                </div>
                <div className="text-xs text-gray-600 mt-1 break-all">
                  {envStatus.siteUrl.value}
                </div>
              </div>
            </div>

            {/* 总体状态 */}
            <div className={`border rounded-lg p-6 text-center ${
              allValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <h2 className="text-xl font-bold mb-4">
                {allValid ? '🎉 配置完成' : '⚠️ 配置不完整'}
              </h2>
              {allValid ? (
                <div>
                  <p className="text-green-700 mb-4">
                    所有环境变量配置正确，系统可以正常连接Supabase数据库！
                  </p>
                  <a 
                    href="/admin/database" 
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    进入数据库管理
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 mb-4">
                    请在Vercel中配置缺少的环境变量
                  </p>
                  <div className="bg-gray-900 text-green-400 text-left p-4 rounded-lg text-sm font-mono">
                    <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...</div>
                  </div>
                </div>
              )}
            </div>

            {/* 说明 */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📋 配置步骤</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>登录 <a href="https://vercel.com" target="_blank" className="text-blue-600">Vercel控制台</a></li>
                <li>选择此项目 → Settings → Environment Variables</li>
                <li>添加上述环境变量</li>
                <li>触发重新部署</li>
                <li>刷新此页面检查配置</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 