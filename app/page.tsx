import Link from 'next/link'
import StorageStatus from '@/components/StorageStatus'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            🧗‍♂️ 攀岩装备商城
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            专业的在线攀岩装备订购系统
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            欢迎来到攀岩装备商城
          </h2>
          
          <div className="space-y-4">
            <Link
              href="/products"
              className="block w-full bg-blue-600 text-white text-center py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🛍️ 浏览产品
            </Link>
            
            <Link
              href="/admin"
              className="block w-full bg-green-600 text-white text-center py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              ⚙️ 管理后台
            </Link>
            
            <Link
              href="/cart"
              className="block w-full bg-purple-600 text-white text-center py-4 px-6 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors"
            >
              🛒 购物车
            </Link>
            
            <Link
              href="/orders"
              className="block w-full bg-orange-600 text-white text-center py-4 px-6 rounded-lg text-lg font-medium hover:bg-orange-700 transition-colors"
            >
              📋 我的订单
            </Link>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">系统特色</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>完整的产品管理功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>购物车和订单系统</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>图片上传功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>管理员后台</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>响应式设计</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <StorageStatus />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">功能特性：</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• 🚀 <strong>智能切换</strong>: 自动检测并切换存储方式</div>
                <div>• 📱 <strong>多设备同步</strong>: Supabase 云端数据同步</div>
                <div>• 💾 <strong>本地模式</strong>: 无需配置即可使用</div>
                <div>• 📖 查看 <code>SUPABASE_SETUP.md</code> 了解云端配置</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500">
          <p className="text-sm">
            攀岩装备在线订购系统 - 支持云端数据同步
          </p>
        </div>
      </div>
    </div>
  )
} 