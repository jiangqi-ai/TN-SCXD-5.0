'use client'

import AdminLayoutDemo from '@/components/AdminLayoutDemo'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign
} from 'lucide-react'

export default function AdminDemoPage() {
  // 演示数据
  const demoStats = {
    totalUsers: 156,
    totalProducts: 89,
    totalOrders: 234,
    totalRevenue: 45678.90
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const statCards = [
    {
      name: '总用户数',
      stat: demoStats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: '总产品数',
      stat: demoStats.totalProducts,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: '总订单数',
      stat: demoStats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      name: '总收入',
      stat: formatPrice(demoStats.totalRevenue),
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <AdminLayoutDemo>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">仪表板 (演示)</h1>
            <p className="mt-2 text-sm text-gray-700">
              系统概览和关键数据统计 - 演示数据
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
                最近订单 (演示数据)
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          张三
                        </p>
                        <p className="text-sm text-gray-500">
                          2024年1月15日 14:30
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          ¥1,299.00
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已送达
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          李四
                        </p>
                        <p className="text-sm text-gray-500">
                          2024年1月15日 12:15
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          ¥899.00
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          处理中
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          王五
                        </p>
                        <p className="text-sm text-gray-500">
                          2024年1月14日 16:45
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          ¥2,199.00
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          已发货
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 低库存产品 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                库存预警 (演示数据)
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          专业攀岩绳 10.2mm
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          库存: 3
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          攀岩头盔 Black Diamond
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          库存: 8
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          攀岩鞋 La Sportiva
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          库存: 12
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 配置提示 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                如何启用完整功能？
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>要使用完整的管理后台功能，请：</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>配置 Supabase 数据库连接</li>
                  <li>在 .env.local 文件中设置正确的环境变量</li>
                  <li>注册用户并设置管理员权限</li>
                  <li>访问 /admin 路径使用真实的管理后台</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutDemo>
  )
} 