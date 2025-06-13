'use client'

import { useEffect, useState } from 'react'

interface StorageInfo {
  mode: 'supabase' | 'memory'
  isSupabase: boolean
  isMemory: boolean
  configured: boolean
  environment: {
    isDev: boolean
    isProd: boolean
    nodeEnv: string
  }
  configuration: {
    hasSupabaseUrl: boolean
    hasSupabaseAnonKey: boolean
    hasServiceRoleKey: boolean
  }
}

export default function StorageStatus() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/storage-info')
      .then(res => res.json())
      .then(data => {
        setStorageInfo(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('获取存储信息失败:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="text-sm text-gray-600">检测存储配置中...</div>
      </div>
    )
  }

  if (!storageInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-sm text-red-600">⚠️ 无法获取存储配置信息</div>
      </div>
    )
  }

  const getStatusColor = () => {
    if (storageInfo.isSupabase) return 'bg-green-50 border-green-200 text-green-800'
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const getStatusIcon = () => {
    if (storageInfo.isSupabase) return '🚀'
    return '💾'
  }

  const getStatusText = () => {
    if (storageInfo.isSupabase) return '云端数据库 (Supabase)'
    return '内存数据库'
  }

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <span className="font-medium">{getStatusText()}</span>
      </div>
      
      <div className="text-xs space-y-1">
        <div>环境: {storageInfo.environment.nodeEnv}</div>
        
        {storageInfo.isSupabase ? (
          <div className="space-y-1">
            <div>✅ 数据持久化已启用</div>
            <div>✅ 多设备同步支持</div>
            <div>URL: {storageInfo.configuration.hasSupabaseUrl ? '✅' : '❌'}</div>
            <div>Key: {storageInfo.configuration.hasSupabaseAnonKey ? '✅' : '❌'}</div>
          </div>
        ) : (
          <div className="space-y-1">
            <div>⚠️ 数据临时存储</div>
            <div>⚠️ 重启后会重置</div>
            {!storageInfo.configuration.hasSupabaseUrl && (
              <div className="text-xs mt-1">
                配置 Supabase 启用云端同步
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 