'use client'

import { useCart } from '@/store/cartStore'
import { useAuth } from '@/components/AuthProvider'
import { Mountain, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">购物车为空</h2>
          <p className="text-gray-600 mb-8">快去挑选心仪的攀岩装备吧！</p>
          <Link
            href="/products"
            className="btn-primary inline-block"
          >
            开始购物
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">购物车</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              商品 ({items.length} 件)
            </h2>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              清空购物车
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="px-6 py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Mountain className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.price)}</p>
                  <p className="text-sm text-gray-500">库存: {item.stock_quantity} 件</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">总计:</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(getTotalPrice())}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="btn-secondary flex-1 text-center"
            >
              继续购物
            </Link>
            <button
              onClick={handleCheckout}
              className="btn-primary flex-1"
            >
              {user ? '立即结算' : '登录并结算'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 