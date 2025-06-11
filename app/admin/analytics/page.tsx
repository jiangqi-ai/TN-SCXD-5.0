'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { BarChart3, TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react'

interface AnalyticsData {
  userGrowth: Array<{ month: string; count: number }>
  orderTrends: Array<{ month: string; orders: number; revenue: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  dailyStats: {
    newUsers: number
    newOrders: number
    totalRevenue: number
    averageOrderValue: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createSupabaseClient()
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client')
      }
      
      // 获取用户增长数据
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // 获取订单数据
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('created_at, final_amount, status')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // 获取产品数据
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('name, stock_quantity, price')

      if (productsError) throw productsError

      // 处理用户增长数据
      const userGrowth = processUserGrowth(users || [])
      
      // 处理订单趋势数据
      const orderTrends = processOrderTrends(orders || [])
      
      // 处理热门产品数据（模拟数据，实际应该从order_items表获取）
      const topProducts = processTopProducts(products || [])
      
      // 处理今日统计数据
      const dailyStats = processDailyStats(users || [], orders || [])

      setData({
        userGrowth,
        orderTrends,
        topProducts,
        dailyStats
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError(error instanceof Error ? error.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const processUserGrowth = (users: any[]) => {
    const months: Record<string, number> = {}
    users.forEach(user => {
      const month = new Date(user.created_at).toISOString().substring(0, 7)
      months[month] = (months[month] || 0) + 1
    })
    
    return Object.entries(months)
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('zh-CN', { month: 'short' }),
        count: count as number
      }))
      .slice(-6)
  }

  const processOrderTrends = (orders: any[]) => {
    const months: Record<string, { orders: number; revenue: number }> = {}
    orders.forEach(order => {
      const month = new Date(order.created_at).toISOString().substring(0, 7)
      if (!months[month]) {
        months[month] = { orders: 0, revenue: 0 }
      }
      months[month].orders += 1
      if (order.status === 'delivered') {
        months[month].revenue += order.final_amount
      }
    })
    
    return Object.entries(months)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('zh-CN', { month: 'short' }),
        orders: data.orders,
        revenue: data.revenue
      }))
      .slice(-6)
  }

  const processTopProducts = (products: any[]) => {
    // 模拟热门产品数据，实际应该从订单商品表计算
    return products.slice(0, 5).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 10,
      revenue: (Math.floor(Math.random() * 100) + 10) * product.price
    }))
  }

  const processDailyStats = (users: any[], orders: any[]) => {
    const today = new Date().toISOString().substring(0, 10)
    
    const newUsers = users.filter(user => 
      user.created_at.substring(0, 10) === today
    ).length

    const todayOrders = orders.filter(order => 
      order.created_at.substring(0, 10) === today
    )

    const newOrders = todayOrders.length
    const totalRevenue = todayOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.final_amount, 0)
    
    const averageOrderValue = newOrders > 0 ? totalRevenue / newOrders : 0

    return {
      newUsers,
      newOrders,
      totalRevenue,
      averageOrderValue
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
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

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              {error}
            </div>
            <button
              onClick={() => fetchAnalyticsData()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">数据统计</h1>
            <p className="mt-2 text-sm text-gray-700">
              系统数据分析和趋势监控
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
            </select>
          </div>
        </div>

        {/* 今日统计 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      今日新用户
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data?.dailyStats.newUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      今日新订单
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data?.dailyStats.newOrders || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      今日收入
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatPrice(data?.dailyStats.totalRevenue || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均订单价值
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatPrice(data?.dailyStats.averageOrderValue || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 用户增长趋势 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">用户增长趋势</h3>
            <div className="space-y-4">
              {data?.userGrowth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((item.count / Math.max(...(data?.userGrowth.map(d => d.count) || [1]))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 订单趋势 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">订单趋势</h3>
            <div className="space-y-4">
              {data?.orderTrends.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((item.orders / Math.max(...(data?.orderTrends.map(d => d.orders) || [1]))) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{item.orders}单</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 热门产品 */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                热门产品
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {data?.topProducts.map((product, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-600">#{index + 1}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">销量: {product.sales}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(product.revenue)}
                          </p>
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            收入
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 