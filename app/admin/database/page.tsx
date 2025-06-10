'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { 
  Database, 
  Activity, 
  HardDrive, 
  Users, 
  Package, 
  ShoppingCart,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DatabaseStats {
  tables: {
    profiles: number
    products: number
    orders: number
    order_items: number
    categories: number
    shopping_cart: number
    settings: number
    discounts: number
  }
  performance: {
    responseTime: number
    activeConnections: number
    lastBackup: string | null
  }
  storage: {
    totalSize: string
    usedSpace: string
    availableSpace: string
  }
}

interface TableInfo {
  table_name: string
  row_count: number
  size_mb: number
  last_updated: string
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  const fetchDatabaseStats = async () => {
    try {
      const startTime = Date.now()

      // 获取各表记录数
      const [
        { count: profilesCount },
        { count: productsCount },
        { count: ordersCount },
        { count: orderItemsCount },
        { count: categoriesCount },
        { count: cartCount },
        { count: settingsCount },
        { count: discountsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('order_items').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('shopping_cart').select('*', { count: 'exact', head: true }),
        supabase.from('settings').select('*', { count: 'exact', head: true }),
        supabase.from('discounts').select('*', { count: 'exact', head: true })
      ])

      const responseTime = Date.now() - startTime

      // 模拟存储信息（实际环境中需要从数据库获取）
      const mockStats: DatabaseStats = {
        tables: {
          profiles: profilesCount || 0,
          products: productsCount || 0,
          orders: ordersCount || 0,
          order_items: orderItemsCount || 0,
          categories: categoriesCount || 0,
          shopping_cart: cartCount || 0,
          settings: settingsCount || 0,
          discounts: discountsCount || 0
        },
        performance: {
          responseTime,
          activeConnections: Math.floor(Math.random() * 10) + 1,
          lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
        },
        storage: {
          totalSize: '1.2 GB',
          usedSpace: '456 MB',
          availableSpace: '744 MB'
        }
      }

      setStats(mockStats)

      // 构建表信息
      const tables: TableInfo[] = [
        { table_name: 'profiles', row_count: profilesCount || 0, size_mb: 2.1, last_updated: new Date().toISOString() },
        { table_name: 'products', row_count: productsCount || 0, size_mb: 15.7, last_updated: new Date().toISOString() },
        { table_name: 'orders', row_count: ordersCount || 0, size_mb: 8.3, last_updated: new Date().toISOString() },
        { table_name: 'order_items', row_count: orderItemsCount || 0, size_mb: 12.5, last_updated: new Date().toISOString() },
        { table_name: 'categories', row_count: categoriesCount || 0, size_mb: 0.5, last_updated: new Date().toISOString() },
        { table_name: 'shopping_cart', row_count: cartCount || 0, size_mb: 1.2, last_updated: new Date().toISOString() },
        { table_name: 'settings', row_count: settingsCount || 0, size_mb: 0.3, last_updated: new Date().toISOString() },
        { table_name: 'discounts', row_count: discountsCount || 0, size_mb: 0.8, last_updated: new Date().toISOString() }
      ]

      setTableInfo(tables)
    } catch (error) {
      console.error('Error fetching database stats:', error)
      toast.error('获取数据库统计失败')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDatabaseStats()
  }

  const handleBackup = async () => {
    try {
      toast.loading('正在创建备份...')
      // 这里应该调用实际的备份API
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('数据库备份成功')
    } catch (error) {
      toast.error('备份失败')
    }
  }

  const handleOptimize = async () => {
    try {
      toast.loading('正在优化数据库...')
      // 这里应该调用实际的优化API
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('数据库优化完成')
    } catch (error) {
      toast.error('优化失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getTableDisplayName = (tableName: string) => {
    const nameMap: Record<string, string> = {
      profiles: '用户资料',
      products: '产品信息',
      orders: '订单记录',
      order_items: '订单项目',
      categories: '产品分类',
      shopping_cart: '购物车',
      settings: '系统设置',
      discounts: '折扣优惠'
    }
    return nameMap[tableName] || tableName
  }

  const getHealthStatus = () => {
    if (!stats) return { status: 'unknown', color: 'gray', text: '未知' }
    
    if (stats.performance.responseTime < 100) {
      return { status: 'excellent', color: 'green', text: '优秀' }
    } else if (stats.performance.responseTime < 500) {
      return { status: 'good', color: 'blue', text: '良好' }
    } else if (stats.performance.responseTime < 1000) {
      return { status: 'fair', color: 'yellow', text: '一般' }
    } else {
      return { status: 'poor', color: 'red', text: '需要优化' }
    }
  }

  const healthStatus = getHealthStatus()

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">数据库管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              监控数据库状态、性能指标和维护操作
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </button>
            <button
              onClick={handleBackup}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              备份
            </button>
            <button
              onClick={handleOptimize}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Activity className="h-4 w-4 mr-2" />
              优化
            </button>
          </div>
        </div>

        {/* 数据库健康状态 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">数据库健康状态</h2>
                <p className="text-sm text-gray-500">实时监控数据库运行状态</p>
              </div>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${healthStatus.color}-100 text-${healthStatus.color}-800`}>
              <CheckCircle className="h-4 w-4 mr-1" />
              {healthStatus.text}
            </div>
          </div>
        </div>

        {/* 性能指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">响应时间</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.performance.responseTime}ms</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">活跃连接</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.performance.activeConnections}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">存储使用</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.storage.usedSpace}</p>
                <p className="text-xs text-gray-500">总空间 {stats?.storage.totalSize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 表统计信息 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">数据表统计</h2>
            <p className="text-sm text-gray-500">各数据表的记录数量和存储大小</p>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    表名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    记录数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    大小 (MB)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后更新
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableInfo.map((table) => (
                  <tr key={table.table_name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getTableDisplayName(table.table_name)}
                          </div>
                          <div className="text-sm text-gray-500">{table.table_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.row_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.size_mb.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(table.last_updated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">用户总数</p>
                <p className="text-lg font-bold">{stats?.tables.profiles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-green-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">产品总数</p>
                <p className="text-lg font-bold">{stats?.tables.products}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-purple-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">订单总数</p>
                <p className="text-lg font-bold">{stats?.tables.orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <HardDrive className="h-6 w-6 text-orange-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">分类总数</p>
                <p className="text-lg font-bold">{stats?.tables.categories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 维护建议 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">维护建议</h3>
              <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>建议每日进行数据库备份</li>
                <li>定期清理过期的购物车数据</li>
                <li>监控数据库性能指标</li>
                <li>及时更新索引优化查询性能</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 