'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import { 
  Search,
  Filter,
  Eye,
  Edit,
  Package
} from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type Order = Database['public']['Tables']['orders']['Row'] & {
  profiles: {
    full_name: string | null
    email: string
  }
  order_items: Array<{
    id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url: string | null
    }
  }>
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles (
          full_name,
          email
        ),
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (searchTerm) {
      query = query.or(`profiles.email.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%`)
    }

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    if (data) {
      setOrders(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      
      toast.success('订单状态更新成功')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('更新失败，请重试')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
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

  const statusOptions = [
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已送达' },
    { value: 'cancelled', label: '已取消' }
  ]

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">订单管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              管理所有订单信息和状态
            </p>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索客户邮箱或姓名..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="input-field pl-10 pr-10 appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">所有状态</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 订单表格 */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        订单信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        客户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        下单时间
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          暂无订单
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                #{order.id.slice(0, 8)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.order_items.length} 件商品
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.profiles.full_name || '未设置'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.profiles.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getStatusColor(order.status)}`}
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => showOrderDetail(order)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 订单详情模态框 */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeDetailModal}></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      订单详情 #{selectedOrder.id.slice(0, 8)}
                    </h3>
                    <button
                      onClick={closeDetailModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* 客户信息 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">客户信息</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>姓名：</strong>{selectedOrder.profiles.full_name || '未设置'}</p>
                        <p className="text-sm"><strong>邮箱：</strong>{selectedOrder.profiles.email}</p>
                        <p className="text-sm"><strong>电话：</strong>{selectedOrder.shipping_phone}</p>
                      </div>
                    </div>

                    {/* 配送信息 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">配送信息</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{selectedOrder.shipping_address}</p>
                        {selectedOrder.notes && (
                          <p className="text-sm mt-1"><strong>备注：</strong>{selectedOrder.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* 商品信息 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">商品列表</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {selectedOrder.order_items.map((item) => (
                          <div key={item.id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {item.products.image_url ? (
                                <img
                                  src={item.products.image_url}
                                  alt={item.products.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
                              <p className="text-sm text-gray-500">
                                数量: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(item.quantity * item.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 订单总计 */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-900">订单总计</span>
                        <span className="text-xl font-bold text-primary-600">
                          {formatPrice(selectedOrder.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* 订单状态和时间 */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">订单状态：</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">下单时间：</span>
                        <span className="text-sm text-gray-900">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={closeDetailModal}
                    className="btn-secondary"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 