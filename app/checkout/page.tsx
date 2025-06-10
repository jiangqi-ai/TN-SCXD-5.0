'use client'

// 禁用静态生成以避免 location 相关错误
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useCart } from '@/store/cartStore'
import { useAuth } from '@/components/AuthProvider'
import { createSupabaseClient } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Mountain, MapPin, Phone, FileText } from 'lucide-react'

interface CheckoutForm {
  shippingAddress: string
  contactPhone: string
  notes?: string
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutForm>()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !user) {
      router.push('/auth/login')
    }
  }, [isClient, user, router])

  useEffect(() => {
    if (isClient && items.length === 0) {
      router.push('/cart')
    }
  }, [isClient, items.length, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (items.length === 0) {
      toast.error('购物车为空')
      return
    }

    setLoading(true)

    try {
      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          shipping_address: data.shippingAddress,
          contact_phone: data.contactPhone,
          notes: data.notes || null,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // 创建订单项
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw itemsError
      }

      // 更新产品库存
      for (const item of items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: item.stock_quantity - item.quantity
          })
          .eq('id', item.id)

        if (stockError) {
          console.error('Stock update error:', stockError)
        }
      }

      // 清空购物车
      clearCart()
      
      toast.success('订单创建成功！')
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('订单创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 在客户端渲染之前显示加载状态
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!user || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">确认订单</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 订单信息表单 */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">配送信息</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  配送地址 *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    {...register('shippingAddress', {
                      required: '请输入配送地址',
                      minLength: {
                        value: 10,
                        message: '地址至少10个字符'
                      }
                    })}
                    rows={3}
                    className="input-field pl-10"
                    placeholder="请输入详细的配送地址，包括省市区和具体地址"
                  />
                </div>
                {errors.shippingAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话 *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register('contactPhone', {
                      required: '请输入联系电话',
                      pattern: {
                        value: /^1[3-9]\d{9}$/,
                        message: '请输入有效的手机号码'
                      }
                    })}
                    type="tel"
                    className="input-field pl-10"
                    placeholder="请输入您的手机号码"
                  />
                </div>
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  备注信息
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input-field pl-10"
                    placeholder="有什么特殊要求可以在这里备注（选填）"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? '处理中...' : '确认下单'}
              </button>
            </form>
          </div>
        </div>

        {/* 订单摘要 */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">订单摘要</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Mountain className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      数量: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">商品小计</span>
                <span className="text-sm text-gray-900">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">运费</span>
                <span className="text-sm text-green-600">免费</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">总计</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 