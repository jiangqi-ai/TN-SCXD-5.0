'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { useCart } from '@/store/cartStore'
import { Mountain, ShoppingCart, User, LogOut, Package, Settings } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Navigation() {
  const { user, profile, signOut } = useAuth()
  const { items } = useCart()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleSignOut = async () => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      setIsLoggingOut(true)
      
      // 创建一个Promise，如果5秒内没有完成就reject
      const signOutWithTimeout = new Promise<void>((resolve, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('退出超时'))
        }, 5000)

        // 尝试正常退出
        signOut()
          .then(() => {
            if (timeoutId) clearTimeout(timeoutId)
            resolve()
          })
          .catch(reject)
      })

      await signOutWithTimeout
      
    } catch (err) {
      console.error('退出登录失败:', err)
      
      // 清理超时定时器
      if (timeoutId) clearTimeout(timeoutId)
      
      // 强制清除状态并重定向
      toast.error('退出登录失败，正在强制退出...')
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/auth/login'
    } finally {
      setIsLoggingOut(false)
      setShowUserMenu(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">攀岩装备</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              产品中心
            </Link>
            {user && (
              <Link
                href="/orders"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                订单中心
              </Link>
            )}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                管理后台
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{profile?.full_name || user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      个人资料
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      我的订单
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        管理后台
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoggingOut ? '退出中...' : '退出登录'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  登录
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 