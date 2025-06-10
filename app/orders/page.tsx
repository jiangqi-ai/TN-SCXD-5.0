'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Mountain, Package, Calendar, MapPin, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type Order = Database['public']['Tables']['orders']['Row'] & {
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

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
    setLoading(false)
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

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
        <p className="mt-2 text-gray-600">查看您的所有订单信息和状态</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
          <p className="text-gray-500 mb-8">您还没有任何订单记录</p>
          <button
            onClick={() => router.push('/products')}
            className="btn-primary"
          >
            开始购物
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        订单号: #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        下单时间: {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <button
                      onClick={() => showOrderDetail(order)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {order.order_items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.products.image_url ? (
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <Mountain className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.products.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              数量: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          还有 {order.order_items.length - 4} 件商品...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-sm text-gray-500">订单总额</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  {/* 订单状态和时间 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">订单状态</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">下单时间</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedOrder.created_at)}</span>
                    </div>
                  </div>

                  {/* 配送信息 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      配送信息
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <p className="text-sm text-gray-900">{selectedOrder.shipping_address}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedOrder.shipping_phone}
                      </div>
                      {selectedOrder.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>备注：</strong>{selectedOrder.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 商品信息 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      商品列表
                    </h4>
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
                              <Mountain className="h-6 w-6 text-gray-400" />
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
  )
} 