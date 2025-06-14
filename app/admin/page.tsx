'use client'

import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/products')}
        >
          <h2 className="text-xl font-semibold mb-2">产品管理</h2>
          <p className="text-gray-600">管理产品信息、库存和分类</p>
        </div>

        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/orders')}
        >
          <h2 className="text-xl font-semibold mb-2">订单管理</h2>
          <p className="text-gray-600">查看和处理订单</p>
        </div>

        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/users')}
        >
          <h2 className="text-xl font-semibold mb-2">用户管理</h2>
          <p className="text-gray-600">管理用户账户和权限</p>
        </div>

        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/settings')}
        >
          <h2 className="text-xl font-semibold mb-2">系统设置</h2>
          <p className="text-gray-600">配置系统参数和数据库连接</p>
        </div>

        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 bg-blue-50"
          onClick={() => router.push('/admin/deployment')}
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-800">生产部署</h2>
          <p className="text-blue-600">管理应用构建、部署和生产环境</p>
        </div>

        <div 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/status')}
        >
          <h2 className="text-xl font-semibold mb-2">系统状态</h2>
          <p className="text-gray-600">实时监控系统运行状态</p>
        </div>
      </div>
    </div>
  )
} 