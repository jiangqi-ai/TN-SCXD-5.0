'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Database, Globe } from 'lucide-react'

interface StatusData {
  database: 'success' | 'warning' | 'error'
  deployment: 'success' | 'warning' | 'error'
  message: string
}

export default function StatusIndicator() {
  const [status, setStatus] = useState<StatusData | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/storage-info', { cache: 'no-store' })
        const data = await response.json()
        
        setStatus({
          database: data.mode === 'supabase' && data.isSupabaseConnected ? 'success' : 
                   data.mode === 'memory' ? 'warning' : 'error',
          deployment: data.environment?.isProd ? 'success' : 'warning',
          message: data.mode === 'supabase' && data.isSupabaseConnected ? 
                   '生产数据库已连接' :
                   data.mode === 'memory' ? 
                   '演示模式 (内存存储)' : 
                   '数据库连接失败'
        })
      } catch (error) {
        setStatus({
          database: 'error',
          deployment: 'error',
          message: '状态检查失败'
        })
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // 每30秒检查一次
    return () => clearInterval(interval)
  }, [])

  if (!status) return null

  const getIcon = (statusType: 'success' | 'warning' | 'error') => {
    switch (statusType) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">系统状态</span>
        <a href="/status" className="text-xs text-blue-600 hover:underline">
          详情
        </a>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center text-xs">
          <Database className="h-3 w-3 mr-1 text-gray-400" />
          <span className="mr-2">数据库:</span>
          {getIcon(status.database)}
        </div>
        
        <div className="flex items-center text-xs">
          <Globe className="h-3 w-3 mr-1 text-gray-400" />
          <span className="mr-2">部署:</span>
          {getIcon(status.deployment)}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-600 border-t pt-2">
        {status.message}
      </div>
    </div>
  )
} 