'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { 
  Shield,
  Settings,
  Database,
  CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<{
    database: boolean
    auth: boolean
  }>({ database: false, auth: false })
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      // 检查数据库连接
      const { data, error } = await supabase.from('profiles').select('count').limit(1).single()
      const databaseStatus = !error
      
      // 检查认证状态
      const { data: authData } = await supabase.auth.getUser()
      const authStatus = !!authData.user

      setSystemStatus({
        database: databaseStatus,
        auth: authStatus
      })
    } catch (error) {
      console.error('Error checking system status:', error)
      setSystemStatus({ database: false, auth: false })
    } finally {
      setLoading(false)
    }
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

  const quickActions = [
    {
      name: '用户设置',
      description: '管理用户角色和权限',
      href: '/admin/user-settings',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      name: '数据库配置',
      description: '配置数据库连接和设置',
      href: '/admin/database-config',
      icon: Database,
      color: 'bg-green-500'
    },
    {
      name: '系统设置',
      description: '配置系统参数和选项',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      name: '系统初始化',
      description: '初始化系统和安全设置',
      href: '/admin/setup',
      icon: Shield,
      color: 'bg-orange-500'
    }
  ]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">管理后台</h1>
            <p className="mt-2 text-sm text-gray-700">
              欢迎使用系统管理后台，您可以在这里管理系统设置和配置。
            </p>
          </div>
        </div>

        {/* 系统状态检查 */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                系统状态
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 ${systemStatus.database ? 'text-green-500' : 'text-red-500'} mr-3`} />
                  <span className="text-sm text-gray-700">
                    数据库连接: {systemStatus.database ? '正常' : '异常'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 ${systemStatus.auth ? 'text-green-500' : 'text-red-500'} mr-3`} />
                  <span className="text-sm text-gray-700">
                    用户认证: {systemStatus.auth ? '正常' : '异常'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            快捷操作
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <div key={action.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${action.color} rounded-md flex items-center justify-center`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-900 truncate">
                          {action.name}
                        </dt>
                        <dd className="text-xs text-gray-500 mt-1">
                          {action.description}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={action.href}
                      className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                    >
                      进入管理 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 系统信息 */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                系统信息
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• 请定期检查系统安全设置</p>
                <p>• 建议定期备份重要数据</p>
                <p>• 如有问题，请联系系统管理员</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}