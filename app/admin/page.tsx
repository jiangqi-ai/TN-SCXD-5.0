'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    total_amount: number
    status: string
    created_at: string
    profiles: {
      full_name: string | null
      email: string
    } | null
  }>
  lowStockProducts: Array<{
    id: string
    name: string
    stock_quantity: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 获取用户总数
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // 获取产品总数
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // 获取订单总数
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // 获取总收入
      const { data: revenueData } = await supabase
        .from('orders')
        .select('final_amount')
        .eq('status', 'delivered')

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.final_amount, 0) || 0

      // 获取最近订单
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          id,
          final_amount,
          status,
          created_at,
          user_id,
          profiles!orders_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // 获取低库存产品 - 使用RPC查询或者简单查询
      const { data: allProducts } = await supabase
        .from('products')
        .select('id, name, stock_quantity, min_stock_level')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })

      const lowStockProducts = (allProducts || [])
        .filter(product => product.stock_quantity <= (product.min_stock_level || 5))
        .slice(0, 5)

      setStats({
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        recentOrders: (recentOrders || []).map(order => ({
          ...order,
          total_amount: order.final_amount,
          profiles: Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
        })),
        lowStockProducts: lowStockProducts || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'processing':
        return '处理中'
      case 'shipped':
        return '已发货'
      case 'delivered':
        return '已送达'
      case 'cancelled':
        return '已取消'
      default:
        return status
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

  const statCards = [
    {
      name: '总用户数',
      stat: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: '总产品数',
      stat: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: '总订单数',
      stat: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      name: '总收入',
      stat: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">仪表板</h1>
            <p className="mt-2 text-sm text-gray-700">
              系统概览和关键数据统计
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${item.color} rounded-md flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {item.stat}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 最近订单 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                最近订单
              </h3>
              <div className="flow-root">
                {stats?.recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">暂无订单</p>
                ) : (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {stats?.recentOrders.map((order) => (
                      <li key={order.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.profiles?.full_name || order.profiles?.email || '未知用户'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-medium text-gray-900">
                              {formatPrice(order.total_amount)}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 低库存产品 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                库存预警
              </h3>
              <div className="flow-root">
                {stats?.lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">库存充足</p>
                ) : (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {stats?.lowStockProducts.map((product) => (
                      <li key={product.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock_quantity === 0 
                                ? 'bg-red-100 text-red-800' 
                                : product.stock_quantity <= 5 
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              库存: {product.stock_quantity}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}